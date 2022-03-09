# `vite`


## 创建服务
使用`cac`库解析命令，创建`server`。

src/node/server/index.ts createServer
这个函数用于创建`server`，包括处理配置（命令中获取的及默认配置）、创建`websocket`用于`hmr`、监听文件（当文件变动时通过`websocket`通知`html`进行更新）、创建`moduleGraph`用于匹配找到当前请求相关的文件、创建插件容器来统一控制所有插件、插入中间件等。

```js
export async function createServer(
  inlineConfig: InlineConfig = {}
): Promise<ViteDevServer> {
  // 处理配置
  const config = await resolveConfig(inlineConfig, 'serve', 'development')

  // 使用connect库用于编写中间件
  const middlewares = connect() as Connect.Server

  // 创建websocket
  const ws = createWebSocketServer(httpServer, config, httpsOptions)

  // 使用chokidar监听文件
  const watcher = chokidar.watch(path.resolve(root), {
    ignored: [
      '**/node_modules/**',
      '**/.git/**',
      ...(Array.isArray(ignored) ? ignored : [ignored])
    ],
    ignoreInitial: true,
    ignorePermissionErrors: true,
    disableGlobbing: true,
    ...watchOptions
  }) as FSWatcher

  // 创建moduleGraph用于描述文件间的关系
  const moduleGraph: ModuleGraph = new ModuleGraph((url) =>
    container.resolveId(url)
  )

  // 创建插件容器，用于统一控制插件
  const container = await createPluginContainer(config, moduleGraph, watcher)

  // 创建一个server对象，里边包含了server所有信息
  const server: ViteDevServer = {...};

  // 监听文件变动
  watcher.on('change');
  watcher.on('add');
  watcher.on('unlink');

  // 插入各种中间件
  middlewares.use('middlewareFunction')
})
```

## 启动服务

src/node/server/index.ts startServer

配置`host`、`port`，启动`httpServer`，并使用`open`库打开浏览器。

```js
async function startServer(
  server: ViteDevServer,
  inlinePort?: number,
  isRestart: boolean = false
): Promise<ViteDevServer> {
    const hostname = resolveHostname(options.host)
    // ...
    openBrowser(
      path.startsWith('http')
        ? path
        : `${protocol}://${hostname.name}:${serverPort}${path}`,
      true,
      server.config.logger
    )
}
```

## 重启服务
src/node/server/index.ts restartServer
关闭当前`server`，通过`createServer`新建一个`server`.
```js
async function restartServer(server: ViteDevServer) {
    await server.close()

    // ...
    newServer = await createServer(server.config.inlineConfig)
}
```

## `resolveConfig`
处理命令行中的配置与默认配置。先简单看一下该方法的一些处理，之后我们会更加具体的分析。
```js
export async function resolveConfig(
  inlineConfig: InlineConfig,
  command: 'build' | 'serve',
  defaultMode = 'development'
): Promise<ResolvedConfig> {
  let { configFile } = config
  if (configFile !== false) {
    // 从配置文件中读取配置
    const loadResult = await loadConfigFromFile(
      configEnv,
      configFile,
      config.root,
      config.logLevel
    )
    if (loadResult) {
      config = mergeConfig(loadResult.config, config)
      configFile = loadResult.path
      configFileDependencies = loadResult.dependencies
    }
  }

  // 处理用户插件
  const rawUserPlugins = (config.plugins || []).flat().filter((p) => {
    if (!p) {
      return false
    } else if (!p.apply) {
      return true
    } else if (typeof p.apply === 'function') {
      return p.apply({ ...config, mode }, configEnv)
    } else {
      return p.apply === command
    }
  }) as Plugin[]
  const [prePlugins, normalPlugins, postPlugins] =
    sortUserPlugins(rawUserPlugins)

  // run config hooks
  const userPlugins = [...prePlugins, ...normalPlugins, ...postPlugins]
  for (const p of userPlugins) {
    if (p.config) {
      const res = await p.config(config, configEnv)
      if (res) {
        config = mergeConfig(config, res)
      }
    }
  }
  
  // 加载.env文件
  const userEnv =
    inlineConfig.envFile !== false &&
    loadEnv(mode, envDir, resolveEnvPrefix(config))

  // 用于缓存
  const cacheDir = config.cacheDir
    ? path.resolve(resolvedRoot, config.cacheDir)
    : pkgPath && path.join(path.dirname(pkgPath), `node_modules/.vite`)

  // 整合默认插件与用户配置的插件
  (resolved.plugins as Plugin[]) = await resolvePlugins(
    resolved,
    prePlugins,
    normalPlugins,
    postPlugins
  )
}
```

## `createWebsocketServer`

使用`ws`库创建一个`Websocket`实例，
```js
export function createWebSocketServer(
  server: Server | null,
  config: ResolvedConfig,
  httpsOptions?: HttpsServerOptions
): WebSocketServer {
  let wss: WebSocket
  // ...
  wss = new WebSocket({ noServer: true })

  // 监听连接、错误事件
  wss.on('connection')
  wss.on('error')

  return {
      // 将this指向wss
      on: wss.on.bind(wss),
      off: wss.off.bind(wss),
      send() {},
      close() {}
  }
}
```

## `createPluginContainer`

创建插件容器，用于统一控制所有插件。调用`createPluginContainer`后会返回一个对象，包含以下几方面：

1. `options` 用于`rollup`打包的一个对象
2. `getModuleInfo`, 获取当前`id`下的`module`信息。
3. `buildStart`， 采用`map`方法调用所有的`plugin`中的`buildStart`方法，并传入一个`context`作为上下文。
4. `resolveId`，遍历调用所有的`plugin`中的`resolveId`方法，对请求的文件名进行处理。

具体分析:

创建一个上下文用于所有的插件。
```js
class Context implements PluginContext {
    meta = minimalContext.meta
    ssr = false
    _activePlugin: Plugin | null
    _activeId: string | null = null
    _activeCode: string | null = null
    _resolveSkips?: Set<Plugin>
    _addedImports: Set<string> | null = null

    constructor(initialPlugin?: Plugin) {
      this._activePlugin = initialPlugin || null
    }
    // 将代码解析成语法树
    parse(code: string, opts: any = {}) {
      return parser.parse(code, {
        sourceType: 'module',
        ecmaVersion: 'latest',
        locations: true,
        ...opts
      })
    }

    async resolve(
      id: string,
      importer?: string,
      options?: { skipSelf?: boolean }
    ) {
      let skip: Set<Plugin> | undefined
      if (options?.skipSelf && this._activePlugin) {
        skip = new Set(this._resolveSkips)
        skip.add(this._activePlugin)
      }
      let out = await container.resolveId(id, importer, { skip, ssr: this.ssr })
      if (typeof out === 'string') out = { id: out }
      return out as ResolvedId | null
    } 

    getModuleInfo(id: string) {
      return getModuleInfo(id)
    }

    getModuleIds() {
      return moduleGraph
        ? moduleGraph.idToModuleMap.keys()
        : Array.prototype[Symbol.iterator]()
    }

    // files added by plugins can be trace 
    addWatchFile(id: string) {
      watchFiles.add(id)
      ;(this._addedImports || (this._addedImports = new Set())).add(id)
      if (watcher) ensureWatchedFile(watcher, id, root)
    }

    getWatchFiles() {
      return [...watchFiles]
    }

    emitFile(assetOrFile: EmittedFile) {
      warnIncompatibleMethod(`emitFile`, this._activePlugin!.name)
      return ''
    }

    setAssetSource() {
      warnIncompatibleMethod(`setAssetSource`, this._activePlugin!.name)
    }

    getFileName() {
      warnIncompatibleMethod(`getFileName`, this._activePlugin!.name)
      return ''
    }

    warn(
      e: string | RollupError,
      position?: number | { column: number; line: number }
    ) {
      const err = formatError(e, position, this)
      const msg = buildErrorMessage(
        err,
        [chalk.yellow(`warning: ${err.message}`)],
        false
      )
      logger.warn(msg, {
        clear: true,
        timestamp: true
      })
    }

    error(
      e: string | RollupError,
      position?: number | { column: number; line: number }
    ): never {
      // error thrown here is caught by the transform middleware and passed on
      // the the error middleware.
      throw formatError(e, position, this)
    }
}
```

```js
// 创建一个上下文
const ctx = new Context()

// 遍历所有的插件并把指定上下文
for (const plugin of plugins) {
  if (!plugin.resolveId) continue;
  if (skip?.has(plugin)) continue;

  ctx._activePlugin = plugin;

  // current plugin resolve start timestamp
  const pluginResolveStart = isDebug ? performance.now() : 0;

  const result = await plugin.resolveId.call(ctx, rawId, importer, { ssr });
  if (!result) continue;

  if (typeof result === 'string') {
    id = result;
  } else {
    id = result.id;
    Object.assign(partial, result);
  }

  isDebug &&
    debugPluginResolve(
      timeFrom(pluginResolveStart),
      plugin.name,
      prettifyUrl(id, root)
    );

  // resolveId() is hookFirst - first non-null result is returned.
  break;
}

```


5. `load`， 遍历调用所有的`plugin`中的`load`方法，用于更新`module`信息
6. `transform`， 遍历调用所有的`plugin`中的`transform`方法，用于更新`module`信息
7. `close`
