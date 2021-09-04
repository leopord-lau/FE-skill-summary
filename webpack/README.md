# webpack

## 基础知识

`webpack` 是一个用于现代 `JavaScript` 应用程序的静态模块打包工具。当 `webpack` 处理应用程序时，它会在内部从一个或多个入口点构建一个依赖图(`dependency graph`)，然后将你项目中所需的每一个模块组合成一个或多个 `bundles`，它们均为静态资源，用于展示你的内容。

webpack安装命令，在安装前需确保有node.js环境。
```bash
npm install webpack -g
```

`webpack`具有以下几个核心概念：
- entry
- output
- loader
- plugin
- mode


###  `entry`

指示 `webpack` 应该使用哪个模块，来作为构建其内部依赖图(`dependency graph`) 的开始。

默认值是 `./src/index.js`，但你可以通过在 `webpack configuration` 中配置 `entry` 属性，来指定一个（或多个）不同的入口起点。

1、 单入口（简写）语法    
`entry: string | [string]`
```js
module.exports = {
  entry: "./src/index.js",
};
```
 可以将一个文件路径数组传递给 entry 属性，这将创建一个所谓的 "multi-main entry"。在你想要一次注入多个依赖文件，并且将它们的依赖关系绘制在一个 "chunk" 中时，这种方式就很有用。
```js
module.exports = {
  entry: ["./src/index.js", "./src/index2.js"],
};
```
不管是单个入口还是多个入口，如果没有指定输出，都只会生成一个bundle文件。

2、对象语法
`entry: { <entryChunkName> string | [string] } | {}`
```js
module.exports = {
  // 单入口对象
  //   entry: {
  //     app: "./src/index.js",
  //   },

  // 多入口对象
  entry: {
    app: "./src/index.js",
    adminApp: "./src/index2.js",
  },
};
```

3、描述入口的对象
- `dependOn`: 当前入口所依赖的入口。它们必须在该入口被加载前被加载。
- `filename`: 指定要输出的文件名称。
- `import`: 启动时需加载的模块。
- `library`: 指定 `library` 选项，为当前 `entry` 构建一个 `library`。
- `runtime`: 运行时 `chunk` 的名字。如果设置了，就会创建一个新的运行时 `chunk`。在 `webpack 5.43.0` 之后可将其设为 `false` 以避免一个新的运行时 `chunk`。
- `publicPath`: 当该入口的输出文件在浏览器中被引用时，为它们指定一个公共 `URL` 地址.



### 2. `output`

指定`webpack`输出`bundle`文件的目录，以及文件命名。主要输出文件的默认值是 `./dist/main.js`，其他生成文件默认放置在 `./dist` 文件夹中。可以通过在 `webpack configuration` 中配置 `output` 属性。

注意： **即使可以存在多个 entry 起点，但只能指定一个 output 配置**

```js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    // 生成bundle文件的目录
    path: path.resolve(__dirname, "dist"),
    // 文件名
    filename: "my-first-webpack.bundle.js",
  },
};
```

多个入口
如果配置中创建出多于一个 `"chunk"`（例如，使用多个入口起点或使用像 `CommonsChunkPlugin` 这样的插件），则应该使用 占位符(`substitutions`) 来确保每个文件具有唯一的名称。

```js
module.exports = {
  entry: {
    app: "./src/index.js",
    adminApp: "./src/index2.js",
  },
  output: {
    filename: "[name].js",
  },
};
```
`[name]`就是`entry`中各个入口文件的`chunkName`。

`[contenthash]` substitution 将根据资源内容创建出唯一 `hash`。
```js
module.exports = {
  output: {
    // filename: "[name].js",
    filename: "[name].[contenthash].js"
  },
};
```
contenthash默认长度是20，可以通过`[contenthash:8]`来指定长度。


### 3. loader
`webpack` 只能理解 `JavaScript` 和 `JSON` 文件，如果要处理其他类型的文件，需要使用`loader`将其转换成有效模块。
在 `webpack` 的配置中，`loader` 有两个属性：
- `test` 属性，识别出哪些文件会被转换。
- `use` 属性，定义出在进行转换时，应该使用哪个 `loader`。

比如说要处理一个`txt`文件。
```js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    // 生成bundle文件的目录
    path: path.resolve(__dirname, "dist"),
    // 文件名
    filename: "my-first-webpack.bundle.js",
  },
  module: {
    rules: [{ test: /\.txt$/, use: "raw-loader" }],
  },
};

```
> 请记住，使用正则表达式匹配文件时，你不要为它添加引号。也就是说，`/\.txt$/` 与 `'/\.txt$/'` 或 `"/\.txt$/"` 不一样。前者指示 `webpack` 匹配任何以 `.txt` 结尾的文件，后者指示 `webpack` 匹配具有绝对路径 `'.txt'` 的单个文件; 这可能不符合你的意图。

### 4.`plugin`
`loader` 用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。包括：打包优化，资源管理，注入环境变量。

使用一个插件，只需要在配置文件中通过 `require()`引入，然后把它添加到 `plugins` 数组中。多数插件可以通过选项(`option`)自定义。你也可以在一个配置文件中因为不同目的而多次使用同一个插件，这时需要通过使用 `new` 操作符来创建一个插件实例。

安装`html-webapck-plugin`

```bat
npm i --save-dev html-webpack-plugin
```

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // ..
  plugins: [new HtmlWebpackPlugin({ title: "webpack" })],
};
```

`html-webpack-plugin` 为应用程序生成一个 `HTML` 文件，并自动将生成的所有 `bundle` 注入到此文件中。

### 6. mode
通过选择 `development`, `production` 或 `none` 之中的一个，来设置 `mode` 参数，你可以启用 `webpack` 内置在相应环境下的优化。其默认值为 `production`。

```js
module.exports = {
  mode: "development",
  // ..
};
```