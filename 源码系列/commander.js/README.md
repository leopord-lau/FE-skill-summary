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


