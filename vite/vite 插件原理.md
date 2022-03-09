## vite 插件实现原理

在`config`配置中，将各种配置传入函数中作为一个上下文。

在`config`文件中，将`config.plugins`值赋值为`resolvePlugins(resolved)`

`resolveId`主要是用于解析`url`.
将访问地址转化为文件路径。

复写`httpServer.listen`函数，在启动监听时执行`buildStart()`
`buildStart()` 主要用于初始化插件的状态  

`load()`用于加载插件的`js`代码。

## `plugins`

1. `pre-alias`

todo

2. `alias`

todo

3. `modulepreload-polyfill`
方法：
- `resolveId`: 如果访问的地址是`vite/modulepreload-polyfill`，则返回当前路径。
- `load`: polyfill 代码

4. `resolve`
方法：
- `configureServer`: 将`server`传入当前文件中，用于后续的`resolveId`方法使用。
- `resolveId`: 