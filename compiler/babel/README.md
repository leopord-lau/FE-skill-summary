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

`babel`采用微内核架构，核心就是`babel-core`这个包。

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

根据传入的入口文件夹`src`调用`handle`方法循环读取文件。
```js
  if (!cliOptions.skipInitialBuild) {
    if (cliOptions.deleteDirOnStart) {
      util.deleteDir(cliOptions.outDir);
    }

    fs.mkdirSync(cliOptions.outDir, { recursive: true });

    startTime = process.hrtime();

    for (const filename of cliOptions.filenames) {
      compiledFiles += await handle(filename);
    }

    if (!cliOptions.quiet) {
      logSuccess();
      logSuccess.flush();
    }
  }
```

`handle`, 读取`src`目录下的所有文件后逐个传入到`handleFile`中处理。
```js
async function handle() {
    ...
    await handleFile(filename, path.dirname(filename))
}
```

`handleFile`，将文件名及路径传入`write`方法中。
```js
async function handleFile() {
    const written = await write(src, base);
    ...
}
```

在`write`方法中会执行`compile`方法
```js
async function write() {
    ...
    const res = await util.compile(src, {
        ...babelOptions,
        sourceFileName: slash(path.relative(dest + "/..", src)),
      });
    ...
}
```

`compile`, 将文件地址和配置传入到 `babel.transformFile` 中处理。
```js
function compile(filename, opts) {
    ...
    opts = {
    ...opts,
    caller: CALLER,
  };

  return new Promise((resolve, reject) => {
    babel.transformFile(filename, opts, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}
```

至此 `babel-cli` 的工作就执行完毕，接着会进入到 `babel-core`中执行。

babel-core/src/transform-file.ts
`transformFile`
```js
const transformFile = transformFileRunner.errback

const transformFileRunner = gensync<
  (filename: string, opts?: InputOptions) => FileResult | null
>(function* (filename, opts: InputOptions) {
  const options = { ...opts, filename };

  const config: ResolvedConfig | null = yield* loadConfig(options);
  if (config === null) return null;

  const code = yield* fs.readFile(filename, "utf8");
  return yield* run(config, code);
});
```

使用`gensync`库可以生成同步和异步两种方法，这里只使用了异步方法。向下执行 `run` 方法.

```ts
export function* run(
  config: ResolvedConfig,
  code: string,
  ast?: t.File | t.Program | null,
): Handler<FileResult> {
  
  const file = yield* normalizeFile(
    config.passes,
    normalizeOptions(config),
    code,
    ast,
  );

  const opts = file.opts;
  try {
    yield* transformFile(file, config.passes);
  } catch (e) {
    e.message = `${opts.filename ?? "unknown"}: ${e.message}`;
    if (!e.code) {
      e.code = "BABEL_TRANSFORM_ERROR";
    }
    throw e;
  }

  let outputCode, outputMap;
  try {
    if (opts.code !== false) {
      ({ outputCode, outputMap } = generateCode(config.passes, file));
    }
  } catch (e) {
    e.message = `${opts.filename ?? "unknown"}: ${e.message}`;
    if (!e.code) {
      e.code = "BABEL_GENERATE_ERROR";
    }
    throw e;
  }

  return {
    metadata: file.metadata,
    options: opts,
    ast: opts.ast === true ? file.ast : null,
    code: outputCode === undefined ? null : outputCode,
    map: outputMap === undefined ? null : outputMap,
    sourceType: file.ast.program.sourceType,
  };
}
```

这个方法主要做了三件事件：

1. 通过 `normalizeFile` 将传入的文件转化为 `AST`。
2. 通过 `transformFile` 处理 `AST` 产出新的 `AST`。
3. 通过 `generateCode` 将新的 `AST` 转化为目标代码。