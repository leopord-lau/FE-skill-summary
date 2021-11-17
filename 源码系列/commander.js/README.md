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
同时，根据`flags`中的字符进行判断是否有设置接收参数。 `<value>`表示执行该命令时必须传入一个参数，`[value]`表示可配置参数。


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



#### 常用选项类型

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

3. 取反， 可以定义一个以 `no-` 开头的 `boolean` 型**长选项**。在命令行中使用该选项时，会将对应选项的值置为 `false`。当只定义了带 `no-` 的选项，未定义对应不带 `no-` 的选项时，该选项的默认值会被置为 `true`值。

```js
program.option('--no-example', 'no example');
```
```bash
node index.js --no-example
{ example: false }
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