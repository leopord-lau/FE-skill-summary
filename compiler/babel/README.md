# Babel

## Babel 是一个 JavaScript 编译器。

Babel 是一个工具链，主要用于将采用 ECMAScript 2015+ 语法编写的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中。

- 语法转换
- 通过 Polyfill 方式在目标环境中添加缺失的特性（通过第三方 polyfill 模块，例如 core-js，实现）
- 源码转换 (codemods)


## Babel安装

### babel-cli 命令行工具
Babel 的 CLI 是一种在命令行下使用 Babel 编译文件的简单方法。
```bash
npm install --global babel-cli
```

编译
```bash
babel index.js
```
运行该命令后会直接将结果输出到终端，使用 `--out-file` 或着 `-o` 可以将结果写入到指定的文件。
```bash
babel index.js --out-file compiled.js

# or

babel index.js -o compiled.js
```

如果想要把一个目录整个编译成一个新的目录，可以使用 `--out-dir` 或者 `-d`。
```bash
babel src --out-dir lib

# or

babel src -d lib
```

### babel-core 核心库

core，中文意思即核心。封装了Babel的核心功能。可已通过npm或yarn进行安装。
```bash
npm install --save-dev @babel/core

yarn add @babel/core --dev
```
通过以上命令将@babel/core安装到开发依赖中，因为生产环境不需要@babel/core，@babel/core的主要功能是转换代码（编译代码）。

安装后，我们可以在js代码中，直接引入babel模块用于转换代码。
```js
const babel = require("@babel/core");

babel.transformSync("code", optionsObject);
// => { code, map, ast }
```
transformSync函数的第一个参数是需要转换的代码，第二个参数为可选参数，用于设定babel的配置（configuration）。



## 源码分析

### 入口
当我们使用 `npm run babel` 的时候会执行到下面的代码，具体位置是 `babel-cli/src/babel/index.js`。

```js
import parseArgv from "./options";
import dirCommand from "./dir";
import fileCommand from "./file";

const opts = parseArgv(process.argv);

if (opts) {
  const fn = opts.cliOptions.outDir ? dirCommand : fileCommand;
  fn(opts).catch(err => {
    console.error(err);
    process.exitCode = 1;
  });
} else {
  process.exitCode = 2;
}
```

在这段代码中，会中`process`中获取配置信息，然后判断输入的是一个文件还是文件夹进行处理。

假如我们的执行命令时`babel src --out-dir lib`，那么对应生成的`opts`为：
```js
{
  babelOptions: {},
  cliOptions: {
    filename: undefined,
    filenames: [ 'src' ],
    extensions: undefined,
    keepFileExtension: undefined,
    outFileExtension: undefined,
    watch: true,
    skipInitialBuild: undefined,
    outFile: undefined,
    outDir: 'lib',
    relative: undefined,
    copyFiles: undefined,
    copyIgnored: undefined,
    includeDotfiles: undefined,
    verbose: undefined,
    quiet: undefined,
    deleteDirOnStart: undefined,
    sourceMapTarget: undefined
  }
}
```

