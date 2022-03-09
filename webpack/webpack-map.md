# webpack

## 简介
`webpack` 是一个用于现代 `JavaScript` 应用程序的静态模块打包工具。当 `webpack` 处理应用程序时，它会在内部从一个或多个入口点构建一个依赖图(`dependency graph`)，然后将你项目中所需的每一个模块组合成一个或多个 `bundles`，它们均为静态资源，用于展示你的内容。

- 代码转换: TypeScript 编译成 JavaScript、SCSS,LESS 编译成 CSS.
- 文件优化：压缩 JavaScript、CSS、HTML 代码，压缩合并图片。
- 代码分割：提取多个页面的公共代码、提取首屏不需要执行部分的代码让其异步加载。
- 模块合并：在采用模块化的项目里会有很多个模块和文件，需要构建功能把模块分类合并成一个文件。
- 自动刷新：监听本地源代码的变化，自动重新构建、刷新浏览器。

## 核心概念

- entry: 入口
- output: 输出
- loader: 模块转换器，用于把模块原内容按照需求转换成新内容
- 插件(plugins): 扩展插件，在webpack构建流程中的特定时机注入扩展逻辑来改变构建结果或做你想要做的事情


## webpack构建流程

分为3个阶段：初始化阶段，编译阶段，输出文件（chunk）。

### 初始化阶段

- 初始化参数：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数。这个过程中还会执行配置文件中的插件实例化语句 new Plugin()。
- 初始化默认参数配置: new WebpackOptionsDefaulter().process(options)
- 实例化Compiler对象:用上一步得到的参数初始化Compiler实例，Compiler负责文件监听和启动编译。Compiler实例中包含了完整的Webpack配置，全局只有一个Compiler实例。
- 加载插件: 依次调用插件的apply方法，让插件可以监听后续的所有事件节点。同时给插件传入compiler实例的引用，以方便插件通过compiler调用Webpack提供的API。
- 处理入口: 读取配置的Entrys，为每个Entry实例化一个对应的EntryPlugin，为后面该Entry的递归解析工作做准备。


### 编译阶段
- run阶段：启动一次新的编译。this.hooks.run.callAsync。
- compile: 该事件是为了告诉插件一次新的编译将要启动，同时会给插件带上compiler对象。
- compilation: 当Webpack以开发模式运行时，每当检测到文件变化，一次新的Compilation将被创建。一个Compilation对象包含了当前的模块资源、编译生成资源、变化的文件等。Compilation对象也提供了很多事件回调供插件做扩展。
- make:一个新的 Compilation 创建完毕主开始编译  完毕主开始编译this.hooks.make.callAsync。
- addEntry: 即将从 Entry 开始读取文件。
- _addModuleChain: 根据依赖查找对应的工厂函数，并调用工厂函数的create来生成一个空的MultModule对象，并且把- MultModule对象存入compilation的modules中后执行MultModule.build。
- buildModules: 使用对应的Loader去转换一个模块。开始编译模块,this.buildModule(module)  buildModule(module, optional, origin,dependencies, thisCallback)。
- build: 开始真正编译模块。
- doBuild: 开始真正编译入口模块。
- normal-module-loader: 在用Loader对一个模块转换完后，使用acorn解析转换后的内容，输出对应的抽象语法树（AST），以方便Webpack后面对代码的分析。
- program: 从配置的入口模块开始，分析其AST，当遇到require等导入其它模块语句时，便将其加入到依赖的模块列表，同时对新找出的依赖模块递归分析，最终搞清所有模块的依赖关系。


### 输出阶段

- seal: 封装 compilation.seal seal(callback)。
- addChunk: 生成资源 addChunk(name)。
- createChunkAssets: 创建资源 this.createChunkAssets()。
- getRenderManifest: 获得要渲染的描述文件 getRenderManifest(options)。
- render: 渲染源码 source = fileManifest.render()。
- afterCompile: 编译结束   this.hooks.afterCompile。
- shouldEmit: 所有需要输出的文件已经生成好，询问插件哪些文件需要输出，哪些不需要。this.hooks.shouldEmit。
- emit: 确定好要输出哪些文件后，执行文件输出，可以在这里获取和修改输出内容。
- done: 全部完成     this.hooks.done.callAsync。


## code splitting

主要有2种方式：
- 分离业务代码和第三方库
- 按需加载（利用`import`语法）




## 与rollup的异同点

## loader

### 常用loader

### 详解loader

## plugin

### 常用plugin

### 详解plugin

## 如何实现热更新

## 如何做性能优化

## happyPack

核心原理：将`webpack`中最耗时的`loader`文件转换操作任务，分解到多个进程中并行处理，从而减少构建时间。

接入HappyPack

- 安装：`npm i -D happypack`
- 重新配置`rules`部分,将`loader`交给`happypack`来分配：

```js
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({size: 5}); //构建共享进程池，包含5个进程
...
plugins: [
    // happypack并行处理
    new HappyPack({
        // 用唯一ID来代表当前HappyPack是用来处理一类特定文件的，与rules中的use对应
        id: 'babel',
        loaders: ['babel-loader?cacheDirectory'],//默认设置loader处理
        threadPool: happyThreadPool,//使用共享池处理
    }),
    new HappyPack({
        // 用唯一ID来代表当前HappyPack是用来处理一类特定文件的，与rules中的use对应
        id: 'css',
        loaders: [
            'css-loader',
            'postcss-loader',
            'sass-loader'],
            threadPool: happyThreadPool
    })
],
module: {
    rules: [
    {
        test: /\.(js|jsx)$/,
        use: ['happypack/loader?id=babel'],
        exclude: path.resolve(__dirname,' ./node_modules'),
    },
    {
        test: /\.(scss|css)$/,
        //使用的mini-css-extract-plugin提取css此处，如果放在上面会出错
        use: [MiniCssExtractPlugin.loader,'happypack/loader?id=css'],
        include:[
            path.resolve(__dirname,'src'),
            path.join(__dirname, './node_modules/antd')
        ]
    },
}
```

参数：

`threads`：代表开启几个子进程去处理这一类文件，默认是3个；
`verbose`:是否运行`HappyPack`输出日志，默认true；
`threadPool`：代表共享进程池，即多个`HappyPack`示例使用一个共享进程池中的子进程去处理任务，以防资源占有过多




## dll
在使用`webpack`进行打包时候，对于依赖的第三方库，如`react`，`react-dom`等这些不会修改的依赖，可以让它和业务代码分开打包；

只要不升级依赖库版本，之后`webpack`就只需要打包项目业务代码，遇到需要导入的模块在某个动态链接库中时，就直接去其中获取；而不用再去编译第三方库，这样第三方库就只需要打包一次。

接入需要完成的事：

1. 将依赖的第三方模块抽离，打包到一个个单独的动态链接库中
2. 当需要导入的模块存在动态链接库中时，让其直接从链接库中获取
3. 项目依赖的所有动态链接库都需要被加载

接入工具(`webpack`已内置)

1. `DllPlugin`插件：用于打包出一个个单独的动态链接库文件；
2. `DllReferencePlugin`:用于在主要的配置文件中引入`DllPlugin`插件打包好的动态链接库文件


配置webpack_dll.config.js构建动态链接库
```js
const DllPlugin = require('webpack/lib/DllPlugin');
const path = require('path');
module.exports = {
  mode: 'development',
  entry: {
    axios: ['axios']
  },
  output: {
    filename: '[name].dll.js',
    path: path.resolve(__dirname, './src/assets/dll'),
    library: '_dll_[name]',
    clean: true,
  },
  plugins: [
    new DllPlugin({
      name: '_dll_[name]',
      // manifest.json 描述动态链接库包含了哪些内容
      path: path.join(__dirname, './', '[name].dll.manifest.json'),
    }),
  ],
};
```

在`webpack.config.js`中使用

```js
module.exports = {
  mode: 'development',
  entry: {
    app: {
      import: './src/index.js',
      dependOn: ['axios'],
    },
    axios: 'axios',
  },
  output: {
    filename: '[name].[hash].js',
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html'),
    }),
    ...[
      new DllReferencePlugin({
        manifest: require('./axios.dll.manifest.json'),
      }),
    ],
    // ...[autoAddDllRes()],
  ],
  //   externals: {
  //     axios: 'axios',
  //   },
};
```

## tree-shaking


## scope hosting


# babel

## 原理


# 模板引擎

# 前端发布

## 一个前端页面如何发布到线上

## cdn

## 增量发布



# weex

## weex 原理

## 为什么weex比h5快


## weex缺点