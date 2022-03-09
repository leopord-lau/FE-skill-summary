# `Vite HMR`原理解析
模块热替换（`hot module replacement`）的简称，指的是在应用运行的时候，不需要刷新页面就可以直接替换、增删模块。`vite`的热替换`webpack`的实现类似，都是通过`websocket`建立服务端和浏览器的通信，这样文件发生变动就可以实时反应到浏览器中。


## 创建`httpServer`和`socket`

使用`http`创建一个`httpServer`。使用`connect`来创建中间件。
```js
// 创建httpserver
require('http').createServer(connect())

// 创建websocket
// vite/src/node/server/ws.ts
// createWebSocketServer()
export function createWebSocketServer(
server: Server | null,
  config: ResolvedConfig,
  httpsOptions?: HttpsServerOptions
): WebSocketServer {
  let wss: WebSocket
  let httpsServer: Server | undefined = undefined

  const hmr = isObject(config.server.hmr) && config.server.hmr
  
  const wsServer = (hmr && hmr.server) || server

  if (wsServer) {
    wss = new WebSocket({ noServer: true })
    wsServer.on('upgrade', (req, socket, head) => {
      if (req.headers['sec-websocket-protocol'] === HMR_HEADER) {
        wss.handleUpgrade(req, socket as Socket, head, (ws) => {
          wss.emit('connection', ws, req)
        })
      }
    })
  } else {
    const websocketServerOptions: ServerOptions = {}
    const port = (hmr && hmr.port) || 24678
    if (httpsOptions) {
      httpsServer = createHttpsServer(httpsOptions, (req, res) => {
        const statusCode = 426
        const body = STATUS_CODES[statusCode]
        if (!body)
          throw new Error(
            `No body text found for the ${statusCode} status code`
          )

        res.writeHead(statusCode, {
          'Content-Length': body.length,
          'Content-Type': 'text/plain'
        })
        res.end(body)
      })

      httpsServer.listen(port)
      websocketServerOptions.server = httpsServer
    } else {
      websocketServerOptions.port = port
    }

    wss = new WebSocket(websocketServerOptions)
  }
  wss.on('connection', (socket) => {
    socket.send(JSON.stringify({ type: 'connected' }))
    if (bufferedError) {
      socket.send(JSON.stringify(bufferedError))
      bufferedError = null
    }
  })

  return {
    on: wss.on.bind(wss),
    off: wss.off.bind(wss),
    send(payload: HMRPayload) {
      if (payload.type === 'error' && !wss.clients.size) {
        bufferedError = payload
        return
      }

      const stringified = JSON.stringify(payload)
      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(stringified)
        }
      })
    },
    close() {
    }
  }
}
```

## 监听文件的变化
首先服务端向浏览器发送消息肯定是因为文件发生了改动，`Vite` 使用了 `chokidar` 来进行文件系统的变动监听。

`chokidar`其实是使用了`node`的`fs`模块进行封装的库。

来看看这个库的简单使用：
```js
const chokidar = require('chokidar');
const path = require('path');

const watcher = chokidar.watch(path.resolve(process.cwd()), {
  ignored: ['**/node_modules/**'],
});

watcher.on('change', (file) => {
  console.log(`file: ${file} has been changed`);
});

watcher.on('add', (file) => {
  console.log(`file: ${file} has been added`);
});

watcher.on('unlink', (file) => {
  console.log(`file: ${file} has been removed`);
});
```
该demo简单监听了当前目录文件的改动、添加、移除等。

`vite`中添加了一些配置。详细配置请查看[chokidar](https://www.npmjs.com/package/chokidar)

```js
// packages/vite/node/index.ts
import chokidar from 'chokidar'
// 监听除了node_modules和.git文件夹的所有文件
const watcher = chokidar.watch(path.resolve(root), {
    ignored: [
      '**/node_modules/**',
      '**/.git/**',
      ...(Array.isArray(ignored) ? ignored : [ignored])
    ],
    ignoreInitial: true,
    ignorePermissionErrors: true,
    disableGlobbing: true,
    // watchOptions为vite.config.js里面的server.watch配置
    ...watchOptions
}) as FSWatcher
```

在`vite`中主要监听3个事件:
1. `change`事件，文件内容变动
2. `add`事件， 添加文件
3. `unlink`事件，移除文件


在`add`方法中，
```js
// 监听文件变动
  watcher.on('change', async (file) => {
    file = normalizePath(file)
    // 修改package文件不触发更新
    if (file.endsWith('/package.json')) {
      return invalidatePackageData(packageCache, file)
    }
    // 更新缓存
    moduleGraph.onFileChange(file)
    if (serverConfig.hmr !== false) {
      try {
        // 处理hmr更新
        await handleHMRUpdate(file, server)
      } catch (err) {
        ws.send({
          type: 'error',
          err: prepareError(err)
        })
      }
    }
  })
  // 添加新文件
  watcher.on('add', (file) => {
    handleFileAddUnlink(normalizePath(file), server)
  })

  // 移除文件
  watcher.on('unlink', (file) => {
    handleFileAddUnlink(normalizePath(file), server, true)
  })
```

`handleHMRUpdate` 处理各种文件的变动，并通过`websocket`将变动信息发给浏览器。
```js
function updateModules(
  file: string,
  modules: ModuleNode[],
  timestamp: number,
  { config, ws }: ViteDevServer
) {
  const updates: Update[] = []
  const invalidatedModules = new Set<ModuleNode>()
  let needFullReload = false

  for (const mod of modules) {
    invalidate(mod, timestamp, invalidatedModules)
    if (needFullReload) {
      continue
    }

    // 边界，所有相关文件
    const boundaries = new Set<{
      boundary: ModuleNode
      acceptedVia: ModuleNode
    }>()
    const hasDeadEnd = propagateUpdate(mod, boundaries)
    if (hasDeadEnd) {
      needFullReload = true
      continue
    }

    // 获取所有需要更新的文件及类型
    updates.push(
      ...[...boundaries].map(({ boundary, acceptedVia }) => ({
        type: `${boundary.type}-update` as Update['type'],
        timestamp,
        path: boundary.url,
        acceptedPath: acceptedVia.url
      }))
    )
  }
  // 是否需要重新刷新
  if (needFullReload) {
    config.logger.info(chalk.green(`page reload `) + chalk.dim(file), {
      clear: true,
      timestamp: true
    })
    ws.send({
      type: 'full-reload'
    })
  // 局部更新
  } else {
    config.logger.info(
      updates
        .map(({ path }) => chalk.green(`hmr update `) + chalk.dim(path))
        .join('\n'),
      { clear: true, timestamp: true }
    )
    ws.send({
      type: 'update',
      updates
    })
  }
}
```

## 文件变动处理

在启动`server`的时候会创建一个`ModuleGraph`对象用来记录所有访问请求文件的关系链。
```js
// packages/vite/src/node/index.ts
const moduleGraph: ModuleGraph = new ModuleGraph((url) =>
  container.resolveId(url)
)
```

`vite`对不同文件有不一样的处理方式:

1. 如果是配置文件(`vite.config.js`、`.env`等)，会直接重启服务。
```js
   if (isConfig || isConfigDependency || isEnv) {
    // auto restart server
    await server.restart()
    return
  }
```

2. `vite/dist/client/client.mjs`，不处理
```js
   if (file.startsWith(normalizedClientDir)) {
    ws.send({
      type: 'full-reload',
      path: '*'
    })
    return
  }
```


3. `html`文件

对于`html`而言，会插入一段`script`把`@vite/client`这部分代码添加到`html`上，实现`socket`连接。


```js
// vite/src/node/server/middlewares/indexHtml.ts
export function createDevHtmlTransformFn(
  server: ViteDevServer
): (url: string, html: string, originalUrl: string) => Promise<string> {
    // ...
    // 执行插件以及默认的devHtmlHook方法
    // devHtmlHook方法用于解析vue格式并返回一个包含了/@vite/client信息的对象，在applyHtmlTransforms方法里根据对象信息在指定的标签位置插入生成的标签
    // preHooks用于解析vue格式之前
    // postHooks用于解析vue格式之后
    return applyHtmlTransforms(html, [...preHooks, devHtmlHook, ...postHooks], {
      path: url,
      filename: getHtmlFilename(url, server),
      server,
      originalUrl
    })
  }
}

// 用于返回一个存储/@vite/client 信息的对象
const devHtmlHook: IndexHtmlTransformHook = async (
  html,
  { path: htmlPath, server, originalUrl }
) => {
  // ...
  // 返回一个包含了@vite/client的script
  return {
    html,
    tags: [
      {
        tag: 'script',
        attrs: {
          type: 'module',
          src: path.posix.join(base, CLIENT_PUBLIC_PATH)
        },
        injectTo: 'head-prepend'
      }
    ]
  }
}

// vite/src/node/plugins/html.ts
// 将hooks解析出来的所有对象都通过script标签应用到html文件中
export async function applyHtmlTransforms(
  html: string,
  hooks: IndexHtmlTransformHook[],
  ctx: IndexHtmlTransformContext
): Promise<string> {
  for (const hook of hooks) {
      // ...
      for (const tag of tags) {
        if (tag.injectTo === 'body') {
          bodyTags.push(tag)
        // ...
        } else {
          headPrependTags.push(tag)
        }
      }
    }
  }
  // inject tags
  if (headPrependTags.length) {
    html = injectToHead(html, headPrependTags, true)
  }
  // ...
  return html
}


function injectToHead(
  html: string,
  tags: HtmlTagDescriptor[],
  prepend = false
) {
  if (prepend) {
    // inject as the first element of head
    if (headPrependInjectRE.test(html)) {
      return html.replace(
        headPrependInjectRE,
        (match, p1) => `${match}\n${serializeTags(tags, incrementIndent(p1))}`
      )
    }
  }
  // ...
  return prependInjectFallback(html, tags)
}
```

4. `js`文件


在发送请求时，会调用`ensureEntryFromUrl`方法生成该文件的关系链，同时对该文件进行监听。
```js
// vite/src/node/server/transformRequest
// doTransform()
const mod = await moduleGraph.ensureEntryFromUrl(url)


// vite/src/node/server/moduleGraph
async ensureEntryFromUrl(rawUrl: string): Promise<ModuleNode> {
    // 解析出地址及文件路径
    const [url, resolvedId, meta] = await this.resolveUrl(rawUrl)
    let mod = this.urlToModuleMap.get(url)
    if (!mod) {
      mod = new ModuleNode(url)
      if (meta) mod.meta = meta
      this.urlToModuleMap.set(url, mod)
      mod.id = resolvedId
      this.idToModuleMap.set(resolvedId, mod)
      const file = (mod.file = cleanUrl(resolvedId))
      let fileMappedModules = this.fileToModulesMap.get(file)
      if (!fileMappedModules) {
        fileMappedModules = new Set()
        this.fileToModulesMap.set(file, fileMappedModules)
      }
      fileMappedModules.add(mod)
    }
    return mod
}
```

之后对该文件的内容进行解析，读取`import`引入的文件，并把这些文件放入关系链中。使用`es-module-lexer`
```js
// vite/src/node/plugins/importAnalysis.ts
// transform()
import {parse as parseImports} from 'es-module-lexer'

// 解析出import引入的文件
imports = parseImports(source)[0]
```

比如说
```js
import http from './http'

// 解析结果
[
  [
    { n: './http', s: 40, e: 46, ss: 22, se: 47, d: -1, a: -1 }
  ],
  [],
  false
]
```

之后将这些引入的文件更新到请求文件的关系链中并对引入文件生成相应的关系链。


5. `css`文件

生成关系链跟`js`文件一样。

对`css`文件进行解析，对预处理文件（`sass`等）进行转换解析，之后采用`postcss-import`插件对`import`进行解析并对引入的文件进行放入关系中同时监听引入的文件。

解析`css`文件：
```js
async function compileCSS(
  id: string,
  code: string,
  config: ResolvedConfig,
  urlReplacer: CssUrlReplacer,
  atImportResolvers: CSSAtImportResolvers,
  server?: ViteDevServer
): Promise<{
  // css文件且无import任何文件
  if (
    lang === 'css' &&
    !postcssConfig &&
    !isModule &&
    !needInlineImport &&
    !hasUrl
  ) {
    return { code }
  }

  // 2. 预处理: sass etc.
  if (isPreProcessor(lang)) {
    // ...
  }

  // 解析@import
  const postcssOptions = (postcssConfig && postcssConfig.options) || {}
  const postcssPlugins =
    postcssConfig && postcssConfig.plugins ? postcssConfig.plugins.slice() : []

  if (needInlineImport) {
    // 如果有引入其他文件，则需要使用postcss-import插件进行解析
    postcssPlugins.unshift(
      (await import('postcss-import')).default({
        async resolve(id, basedir) {
          const resolved = await atImportResolvers.css(
            id,
            path.join(basedir, '*')
          )
          if (resolved) {
            return path.resolve(resolved)
          }
          return id
        }
      })
    )
  }
  
  // ...

  // postcss is an unbundled dep and should be lazy imported
  const postcssResult = await (await import('postcss'))
    .default(postcssPlugins)
    .process(code, {
      ...postcssOptions,
      to: id,
      from: id,
      map: {
        inline: false,
        annotation: false,
        prev: map
      }
    })

  // 解析出的对象中messages字段就是所有引入文件的数组
  for (const message of postcssResult.messages) {
    if (message.type === 'dependency') {
      // 对引入文件进行记录。
      deps.add(message.file as string)
    }
    // ...
  }

  return {
    ast: postcssResult,
    code: postcssResult.css,
    map: postcssResult.map as any,
    modules,
    deps
  }
})
```

对`scss`等文件的处理都是通过`require`动态引入`scss`来解析。
```js
// vite/src/node/plugins/css.ts
// loadPreprocessor()

function loadPreprocessor(lang: PreprocessLang, root: string): any {
  // ...
  try {
    const fallbackPaths = require.resolve.paths?.(lang) || []
    const resolved = require.resolve(lang, { paths: [root, ...fallbackPaths] })
    return (loadedPreprocessors[lang] = require(resolved))
  } catch (e) {
      // ...
  }
}
```

对于`compileCss`返回的`deps`字段（请求`css`文件中引入的其他文件路径数组），会先判断文件类型（`css`或者其他）生成对应的文件节点（`css`文件只生成文件节点）或者是文件关系链。之后更新请求`css`文件的关系链。
```js
// vite/src/node/plugins/css.ts
// transform()
for (const file of deps) {
  depModules.add(
    isCSSRequest(file)
      ? //
        moduleGraph.createFileOnlyEntry(file)
      : await moduleGraph.ensureEntryFromUrl(
          (
            await fileToUrl(file, config, this)
          ).replace((config.server?.origin ?? '') + config.base, '/')
        )
  );
}

moduleGraph.updateModuleInfo(
  thisModule,
  depModules,
  new Set(),
  isSelfAccepting
);
```

以上步骤都处理完后就是要把解析后的`css`文件返回给浏览器了。
如果直接返回`css`文件的话会报错，因为浏览器解析`import`文件的时候认为它是`script`，而返回的文件的`Content-Type`是`text/css`，通过将`Content-Type`设置成`application/javascript`，并把`css`文件的内容改写成
```js
const cssWarp = `
    function updateStyle(id, content) {
    let style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.innerHTML = content;
    document.head.appendChild(style);
  }
    const css = ${JSON.stringify(css)};
    updateStyle(1, css);
    export default css`;
```
即可。

不管是`js`文件还是`css`文件，当文件发送改动时会通过`socket`将对应带动信息发给浏览器端，实现页面更新。