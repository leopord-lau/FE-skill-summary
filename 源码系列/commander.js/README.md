# commander.js
`commander`是一个轻巧的`nodejs`模块，提供了用户命令行输入和参数解析强大功能。

`commander`的特性：

- 自记录代码
- 自动生成帮助
- 合并短参数
- 默认选项
- 强制选项​​
- 命令解析
- 提示符
  

## 安装
```bash
npm install commander
```

## 使用

在文件中引入`commander`，可以通过直接引入一个`program`对象或者创建一个实例的方式进行使用。

```js
const { program } = require('commander');
program.version("v1.0.0");
```

```js
const { Command } = require('commander');
const program = new Command();
program.version("v1.0.0");
```

通过查看源码可以得知`program`其实就是一个刚创建的实例，可以更明确地访问全局命令。

`源码片段:`
```js
exports = module.exports = new Command();
exports.program = exports;

exports.Command = Command;
```

### `option`选项
`Commander` 使用`.option()`方法来定义选项，同时可以附加选项的简介。每个选项可以定义一个短选项名称（`-`后面接单个字符）和一个长选项名称（`--`后面接一个或多个单词），使用逗号、空格或`|`分隔。


语法：
`options(flags, description, fn, defaultValue)`
```js
commander.option(
    "-f, --filename [filename]",
    "The filename to use when reading from stdin. This will be used in source-maps, errors etc."
);
```
`源码解析:`

`lib\command.js` `option()`

采用柯里化写法, 实际调用的是`_optionsEx()`方法
```js
  options(flags, description, fn, defaultValue) {
    return this._optionEx({}, flags, description, fn, defaultValue);
  }
```

`_optionsEx()`, 创建一个`options`实例，fn可以是函数、正则等形式，需要注意的是尽量不要使用正则形式，自 Commander v7 起，该功能不再推荐使用。
```js
  _optionEx(config, flags, description, fn, defaultValue) {
    // 创建一个option实例
    const option = this.createOption(flags, description);
    if (typeof fn === "function") {
      option.default(defaultValue).argParser(fn);
    } else if (fn instanceof RegExp) {
      // deprecated
      ...
    } else {
      option.default(fn);
    }

    return this.addOption(option);
  }
```
在`Option`构造函数中，会调用一个`splitOptionFlags()`方法，用于解析长、断标识，比如说`-m,--mixed <value>`。`attributeName()`会返回一个`camelcase`的字符，例如`--file-name`会被解析成`fileName`。

通过空格、`|`和`,`来切割出不同的字符。 
```js
function splitOptionFlags(flags) {
  let shortFlag;
  let longFlag;
  const flagParts = flags.split(/[ |,]+/);
  if (flagParts.length > 1 && !/^[[<]/.test(flagParts[1]))
    shortFlag = flagParts.shift();
  longFlag = flagParts.shift();
  if (!shortFlag && /^-[^-]$/.test(longFlag)) {
    shortFlag = longFlag;
    longFlag = undefined;
  }
  return { shortFlag, longFlag };
}
```
同时，根据`flags`中的字符进行判断是否有设置接收参数。 `<value>`表示执行该命令时必须传入一个参数，`<value...>`表示可接受多个参数，`[value]`表示可配置参数。
```js
this.required = flags.includes("<"); 
this.optional = flags.includes("[");
this.variadic = /\w\.\.\.[>\]]$/.test(flags)
```


在创建了一个`option`对象后，将其放入`addOption()`中进行处理，该方法会对`option`进行注册、监听等操作。
```js
  addOption(option) {
    const oname = option.name();
    const name = option.attributeName();
    // 注册
    this.options.push(option);

    const handleOptionValue = (val, invalidValueMessage, valueSource) => {
      // ...
    };

    this.on("option:" + oname, (val) => {
      const invalidValueMessage = `error: option '${option.flags}' argument '${val}' is invalid.`;
      handleOptionValue(val, invalidValueMessage, "cli");
    });

    if (option.envVar) {
      this.on("optionEnv:" + oname, (val) => {
        const invalidValueMessage = `error: option '${option.flags}' value '${val}' from env '${option.envVar}' is invalid.`;
        handleOptionValue(val, invalidValueMessage, "env");
      });
    }

    return this;
  }
```
`Command`继承了`node`中的事件模块`EventEmitter`实现对`option`的监听和触发。


在写好`option`配置后，需要调用`program.parse(process.argv)`方法对用户的输入进行解析。

`parse(argv, parseOptions)`
```js
parse(argv, parseOptions) {
  const userArgs = this._prepareUserArgs(argv, parseOptions);
  this._parseCommand([], userArgs);

  return this;
}
```
在`_prepareUserArgvs`方法中解析读取用户的输入。`process.argv`获取的数组前两个元素分别是`node`安装地址跟运行的`script`路径，后边的才是用户的输入，因此需要先过滤掉这两个。同时还支持多个`argv`约定。
```js
_prepareUserArgs(argv, parseOptions) {
  parseOptions = parseOptions || {};
  this.rawArgs = argv.slice();

  let userArgs;
  switch (parseOptions.from) {
    case undefined:
    case 'node':
      this._scriptPath = argv[1];
      userArgs = argv.slice(2);
      break;
    case 'electron':
      if (process.defaultApp) {
        this._scriptPath = argv[1];
        userArgs = argv.slice(2);
      } else {
        userArgs = argv.slice(1);
      }
      break;
    case 'user':
      userArgs = argv.slice(0);
      break;
    default:
      throw new Error(
        `unexpected parse option { from: '${parseOptions.from}' }`
      );
  }
  if (!this._scriptPath && require.main) {
    this._scriptPath = require.main.filename;
  }

  this._name =
    this._name ||
    (this._scriptPath &&
      path.basename(this._scriptPath, path.extname(this._scriptPath)));

  return userArgs;
}
```
在获取了用户输入后，就是对这些参数进行解析。

`_parseCommand()`
```js
_parseCommand(operands, unknown) {
    const parsed = this.parseOptions(unknown);
    // command部分下边继续讲解
}
```

`parseOptions`读取输入的配置
```js
parseOptions(argv) {
  const operands = [];
  const unknown = [];
  let dest = operands;
  const args = argv.slice();

  // 判断是否是option配置， 必须要有一个-开头
  function maybeOption(arg) {
    return arg.length > 1 && arg[0] === '-';
  }

  let activeVariadicOption = null;
  // 逐步读取配置
  while (args.length) {
    const arg = args.shift();
    // --终止读取 也就是说 -- 后边的配置并不会生效
    // 例如 node src/index.js -  --number 1 2 3 -- -c a b
    // -c其实没有用
    if (arg === '--') {
      if (dest === unknown) dest.push(arg);
      dest.push(...args);
      break;
    }

    // 处理多参数情况
    if (activeVariadicOption && !maybeOption(arg)) {
      // 当触发这个监听时会执行handleOptionValue,里边会判断variadic的值将所有的参数放进一个数组中
      this.emit(`option:${activeVariadicOption.name()}`, arg);
      continue;
    }
    activeVariadicOption = null;

    if (maybeOption(arg)) {
      // 查看是否已经配置有该命令
      const option = this._findOption(arg);
      if (option) {
          // 前边提到的当配置option时如果有配置 <value> 必填参数，那么该option的required值为true
        if (option.required) {
            // 读取value
          const value = args.shift();
          if (value === undefined) this.optionMissingArgument(option);
          // 触发监听方法
          this.emit(`option:${option.name()}`, value);
        // 配置了可选参数
        } else if (option.optional) {
          let value = null;
          if (args.length > 0 && !maybeOption(args[0])) {
            value = args.shift();
          }
          this.emit(`option:${option.name()}`, value);
        } else {
          // boolean flag
          this.emit(`option:${option.name()}`);
        }
        // 前面提到当配置的option中存在 ...> 如<value...>时，variadic值为true
        activeVariadicOption = option.variadic ? option : null;
        continue;
      }
    }

    // 组合flag， 比如像 -abc , 会遍历判断 -a -b -c是否是配置过的option
    if (arg.length > 2 && arg[0] === '-' && arg[1] !== '-') {
      // 拆解组合
      const option = this._findOption(`-${arg[1]}`);
      if (option) {
        if (
          option.required ||
          (option.optional && this._combineFlagAndOptionalValue)
        ) {
          this.emit(`option:${option.name()}`, arg.slice(2));
        } else {
          this.emit(`option:${option.name()}`);
          args.unshift(`-${arg.slice(2)}`);
        }
        continue;
      }
    }

    // 解析--foo=bar传参格式
    if (/^--[^=]+=/.test(arg)) {
      const index = arg.indexOf('=');
      const option = this._findOption(arg.slice(0, index));
      if (option && (option.required || option.optional)) {
        this.emit(`option:${option.name()}`, arg.slice(index + 1));
        continue;
      }
    }

    if (maybeOption(arg)) {
      dest = unknown;
    }

    // 解析command 下面在讲解
    dest.push(arg);
  }

  return { operands, unknown };
}
```
从上面的源码解析中可以总结如下：

1. 多个短选项可以合并简写，最后一个选项可以附加参数, 比如` -a -b -c 1 `可以写成`-abc 1`。
2. `--`可以标记选项的结束，后续的参数均不会被命令解释，可以正常使用。
3. 可以通过`=`传参
4. 可以传递多个参数


### 常用选项类型

1. `boolean`型， 选项无需配置参数, 通常我们使用的都是此类型。
2. 设置参数(使用尖括号声明在该选项后，如`--expect <value>`),如果在命令行中不指定具体的选项及参数，则会被定义为`undefined`。

```js
const { Command } = require('commander');
const program = new Command();

program.option('-e --example', 'this is a boolean type option');

program.option('-t --type <type>', 'must set an param or an error will occur');

program.parse(process.argv);
console.log(program.opts());
```
eg.
```bash
node index.js -e
{ example: true }

node index.js -t
error: option '-t --type <type>' argument missing


node index.js -t a
{ type: 'a' }
```
1. 取反， 可以定义一个以 `no-` 开头的 `boolean` 型**长选项**。在命令行中使用该选项时，会将对应选项的值置为 `false`。当只定义了带 `no-` 的选项，未定义对应不带 `no-` 的选项时，该选项的默认值会被置为 `true`值。

```js
program.option('--no-example', 'no example');
```
```bash
node index.js --no-example
{ example: false }
```
`源码解析：`

在配置了`option`之后,会对该命令进行监听，执行该`flag`会触发`handleOptionValue`方法，根据用户是否有设置取反或者有默认值，来设置该`option`的值

`handleOptionValue`
```js
const handleOptionValue = (val, invalidValueMessage, valueSource) => {
  const oldValue = this.getOptionValue(name);
  
  // 参数处理这部分放在自定义选项部分讲解
  // .. 

  if (typeof oldValue === 'boolean' || typeof oldValue === 'undefined') {
    if (val == null) {
      this.setOptionValueWithSource(
        name,
        // 是否取反，取反的话值为false， 不取反就判断是否有值，没有就赋值为true
        option.negate ? false : defaultValue || true,
        valueSource
      );
    } else {
      this.setOptionValueWithSource(name, val, valueSource);
    }
  } else if (val !== null) {
    this.setOptionValueWithSource(
      name,
      option.negate ? false : val,
      valueSource
    );
  }
};
```


4. 可选参数 (`--optional [value]`)， 该选项在不带参数时可用作 `boolean` 选项，在带有参数时则从参数中得到值。
```js
program.option('-f [filename]', 'optional');
```

```bash
node index.js -f
{ f: true }

node index.js -f index.js
{ f: 'index.js' }
```

5. 必填选项
通过`.requiredOption()`方法可以设置选项为必填。必填选项要么设有默认值，要么必须在命令行中输入，对应的属性字段在解析时必定会有赋值。该方法其余参数与`.option()`一致。
```js
program.requiredOption('-r --required <type>', 'must');
```
```bash
node index.js   
error: required option '-r --required <type>' not specified
```

当然可以设置一个默认值
```js
program.requiredOption('-r --required <type>', 'must'， 'a');
```
```bash
node index.js   
{ required: 'a' }
```

6. 变长参数选项
定义选项时，可以通过使用`...`来设置参数为可变长参数。在命令行中，用户可以输入多个参数，解析后会以数组形式存储在对应属性字段中。在输入下一个选项前（`-`或`--`开头），用户输入的指令均会被视作变长参数。与普通参数一样的是，可以通过`--`标记当前命令的结束。
```js
program.option('-n <numbers...>', 'set numbers');
program.option('-c <chars...>', 'set chars');
```

```bash
node index.js -n 1 2 3 4 -c a b c
{ n: [ '1', '2', '3', '4' ], c: [ 'a', 'b', 'c' ] }
```


7. 版本
`.version()`方法可以设置版本，其默认选项为`-V`和`--version`，设置了版本后，命令行会输出当前的版本号。

```js
program.version('v1.0.0')
```

版本选项也支持自定义设置选项名称，可以在`.version()`方法里再传递一些参数（长选项名称、描述信息），用法与`.option()`方法类似。

```js
program.version('v1.0.0', '-a --aversion', 'current version');
```

`源码解析`：

 `version`方法其实很简单，就是判断用户配置`version`信息时有没有自定义信息，比如说启动命令这些。之后就是创建一个`option`注册后监听。
```js
version(str, flags, description) {
  if (str === undefined) return this._version;
  this._version = str;
  flags = flags || '-V, --version';
  description = description || 'output the version number';
  const versionOption = this.createOption(flags, description);
  this._versionOptionName = versionOption.attributeName();
  this.options.push(versionOption);
  this.on('option:' + versionOption.name(), () => {
    this._outputConfiguration.writeOut(`${str}\n`);
    this._exit(0, 'commander.version', str);
  });
  return this;
}

```

8. 使用`addOption`方法
大多数情况下，选项均可通过`.option()`方法添加。但对某些不常见的用例，也可以直接构造`Option`对象，对选项进行更详尽的配置。

```js
program
  .addOption(
    new Option('-t, --timeout <delay>', 'timeout in seconds').default(
      60,
      'one minute'
    )
  )
  .addOption(
    new Option('-s, --size <type>', 'size').choices([
      'small',
      'medium',
      'large',
    ])
  );
```

```bash
node index.js -s small
{ timeout: 60, size: 'small' }

node index.js -s mini
error: option '-s, --size <type>' argument 'mini' is invalid. Allowed choices are small, medium, large.
```

`源码解析：`就是添加一个`fn`在传入值的时候判断一下值就可以。

```js
function choices(values) {
  this.argChoices = values;
  this.parseArg = (arg, previous) => {
    if (!values.includes(arg)) {
      throw new InvalidArgumentError(
        `Allowed choices are ${values.join(', ')}.`
      );
    }
    if (this.variadic) {
      return this._concatValue(arg, previous);
    }
    return arg;
  };
  return this;
}
```


9. 自定义选项
选项的参数可以通过自定义函数来处理，该函数接收两个参数，即用户新输入的参数值和当前已有的参数值（即上一次调用自定义处理函数后的返回值），返回新的选项参数值。 也就是`option`中的第三个参数。第四个参数就是初始值

自定义函数适用场景包括参数类型转换，参数暂存，或者其他自定义处理的场景。
```js
program.option(
  '-f --float <number>',
  'process float argument',
  (value, previous) => {
    return Number(value) + previous;
  },
  2
);
```
```bash
node index.js -f 3
{ float: 5 }
```

`源码解析`:
```js
const handleOptionValue = (val, invalidValueMessage, valueSource) => {
  const oldValue = this.getOptionValue(name);
  
  // 当配置了option的第三个参数
  if (val !== null && option.parseArg) {
    try {
      val = option.parseArg(
        val,
        // defaultValue为第四个参数
        oldValue === undefined ? defaultValue : oldValue
      );
    } catch (err) {
      if (err.code === "commander.invalidArgument") {
        const message = `${invalidValueMessage} ${err.message}`;
        this._displayError(err.exitCode, err.code, message);
      }
      throw err;
    }

  // 处理多参数情况
  } else if (val !== null && option.variadic) {
    val = option._concatValue(val, oldValue);
  }

  // ...
  // 查看取反部分讲解
}
```    



### 配置命令

通过`.command()`或`.addCommand()`可以配置命令，有两种实现方式：为命令绑定处理函数，或者将命令单独写成一个可执行文件。子命令支持嵌套。

`.command()`的第一个参数为命令名称。命令参数可以跟在名称后面，也可以用`.argument()`单独指定。参数可为必选的（尖括号表示）、可选的（方括号表示）或变长参数（点号表示，如果使用，只能是最后一个参数）。

```js
program
  .command('clone <source> [destination]')
  .description('clone a repository into a newly created directory')
  .action((source, destination) => {
    console.log('clone command called');
  });
```

在`Command`对象上使用`.argument()`来按次序指定命令参数。该方法接受参数名称和参数描述。参数可为必选的（尖括号表示，例如`<required>`）或可选的(方括号表示，例如`[optional]`)。
```js
program
  .command('login')
  .description('login')
  .argument('<username>', 'user')
  .argument('[password]', 'password', 'no password')
  .action((username, password) => {
    console.log(`login, ${username} - ${password}`);
  });
```

在参数名后加上`...`来声明可变参数，且只有最后一个参数支持这种用法。可变参数会以数组的形式传递给处理函数。
```js
program
  .command('readFile')
  .description('read multiple file')
  .argument('<username>', 'user')
  .argument('[password]', 'password', 'no password')
  .argument('<filepath...>')
  .action((username, password, args) => {
    args.forEach((dir) => {
      console.log('rmdir %s', dir);
    });
    console.log(`username: ${username}, pass: ${password}, args: ${args}`);
  });
```

`源码解析：` 新建一个`command`
```js
command(nameAndArgs, actionOptsOrExecDesc, execOpts) {
  let desc = actionOptsOrExecDesc;
  let opts = execOpts;
  if (typeof desc === 'object' && desc !== null) {
    opts = desc;
    desc = null;
  }
  opts = opts || {};
  // 解析获取输入的命令及参数
  const [, name, args] = nameAndArgs.match(/([^ ]+) *(.*)/);

  // 创建一个command
  const cmd = this.createCommand(name);
  if (desc) {
    cmd.description(desc);
    cmd._executableHandler = true;
  }
  if (opts.isDefault) this._defaultCommandName = cmd._name;
  cmd._hidden = !!(opts.noHelp || opts.hidden);
  cmd._executableFile = opts.executableFile || null;
  // 添加参数
  if (args) cmd.arguments(args);
  this.commands.push(cmd);
  cmd.parent = this;
  // 继承属性
  cmd.copyInheritedSettings(this);

  if (desc) return this;
  return cmd;
}
```
`action`用于注册命令回调。
```js

```



#### 声明统一参数

命令处理函数的参数，为该命令声明的所有参数，除此之外还会附加两个额外参数：一个是解析出的选项，另一个则是该命令对象自身。

```js
program
  .argument('<name>')
  .option('-t, --title <title>', 'title to use before name')
  .option('-d, --de')
  .action((name, options, command) => {
    console.log(name);
    console.log(options);
    console.log(command.name());
  });
```


### 帮助信息
帮助信息是 `Commander` 基于你的程序自动生成的，默认的帮助选项是`-h,--help`。
```bash
node index.js -h
Usage: index [options]

Options:
  -h, --help  display help for command
```

#### 自定义
使用`addHelpText`方法添加额外的帮助信息。
```js
program.addHelpText('after', `call help`);
```

```bash
node index.js -h
Usage: index [options]

Options:
  -h, --help  display help for command
call help
```

`addHelpText`方法的第一个参数是添加的帮助信息展示的位置，
包括如下：
- `beforeAll`：作为全局标头栏展示

- `before`：在内建帮助信息之前展示

- `after`：在内建帮助信息之后展示

- `afterAll`：作为全局末尾栏展示


#### `showHelpAfterError`展示帮助信息
```js
program.showHelpAfterError();
// 或者
program.showHelpAfterError('(add --help for additional information)');
```

```bash
node index.js -asd
error: unknown option '-asd'
(add --help for additional information)
```