# vite 中间件原理

使用`connect`库，实现中间件，在创建`http`服务的时候将中间件函数带进去。

## middlewares
1. `timeMiddleware` get request cause time。
2. `corsMiddleware` for cors
3. `proxyMiddleware` for proxy
4. `beseMiddleware` for base url that has been define by user
5. `launchEditorMiddleware` open in editor support, locate in error code
6. `viteHMRPingMiddleware` hmr reconnect ping
7. `servePublicMiddleware` serve static files under /public
8. `transformMiddleware` transform request, and handle file
9. `serveRawFsMiddleware`
10. `serveStaticMiddleware`
11. `spaFallbackMiddleware` fallback to index.html
12. `indexHtmlMiddleware`
13. `vite404Middleware`
14. `errorMiddleware` There are middleware where the function takes exactly 4 arguments.


## `vite`各种中间件解析
在`vite`中，插入了一系列的中间件用于处理请求，下面我们一起来看看这些中间件的作用及原理。

### 1. `timeMiddleware`

用于记录请求响应所用时间。采用`performance.now()`分别记录获取请求及响应时的耗时，之后相减获取整个请求的耗时。


### 2. `corsMiddleware`

跨域相关，使用`cors`库实现。

### 3. `proxyMiddleware`

代理

### 4. `baseMiddleware`

TODO

### 5. `EditorMiddleware` 
这个中间件使用`launch-editor-middleware`库，用于定位到指定文件的指定位置（比如说我们输入的地址为'localhost:8080/__open-in-editor?file=index.js:1:3',此时编辑器就会定位到`index.js`文件的第一行的第三个字符）。

### 6. `viteHMRPingMiddleware` 
发送心跳，用于`socket`连接。

### 7. `servePublicMiddleware`

静态文件服务器，使用`sirv`包实现。输入对应目录下的文件时即可进行访问。

```js
if (config.publicDir) {
    middlewares.use(servePublicMiddleware(config.publicDir))
}
```
默认配置会把`publicDir`这个值设置成`public`，也就是你根目录的`public`文件夹就是静态服务器所访问的目录。


简单demo
```js
var express = require('express');
var app = express();
let sirv = require('sirv');
let serve = sirv(process.cwd() + '\\public', {
  dev: true,
  etag: true,
  extendsions: [],
  setHeaders(res, pathname) {
    if (/\.[tj]sx?$/.test(pathname)) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  },
});
app.use(function viteServerPublicMiddleware(req, res, next) {
  serve(req, res, next);
});
```

来看看`vite`的实现
```js
export function servePublicMiddleware(dir: string): Connect.NextHandleFunction {
  const serve = sirv(dir, sirvOptions)

  return function viteServePublicMiddleware(req, res, next) {
    // 会跳过import请求以及内部的请求
    if (isImportRequest(req.url!) || isInternalRequest(req.url!)) {
      return next()
    }
    serve(req, res, next)
  }
}
```

### 8. `transformMiddleware`

处理`js`文件、`import`请求、`css`文件、`html`代理。
判断是否已经有缓存，有缓存就直接返回缓存。

**缓存部分**
采用`http`缓存机制
`Etag` & `If-None-Match`

`Etag`是属于HTTP 1.1属性，它是由服务器生成返回给前端，
当第一次发起`HTTP`请求时，服务器会返回一个`Etag`

并在第二次发起同一个请求时，客户端会同时发送一个`If-None-Match`，而它的值就是`Etag`的值。然后，服务器会比对这个客服端发送过来的`Etag`是否与服务器的相同，如果相同，就将`If-None-Match`的值设为`false`，返回状态为`304`，客户端继续使用本地缓存，不解析服务器返回的数据。如果不相同，就将`If-None-Match`的值设为`true`，返回状态为`200`，客户端重新解析服务器返回的数据

说白了，
`ETag` 实体标签: 一般为资源实体的哈希值
即`ETag`就是服务器生成的一个标记，用来标识返回值是否有变化。
且`Etag`的优先级高于`Last-Modified`。

在`vite`中采用`etag`库来生成`etag`
```js
etag = getEtag(content, { weak: true }),
```
然后把这个值存在`ModuleNode`上，当再次请求的时候就会判断。


解析url。

使用`map`记录当前请求的地址，如果请求已经处理完成，从`map`中删除，用此来判断请求是否已经完成。

调用`pluginContainer`的`resolveId`、`load`、`transform` 等方法运行所有的插件。


### 9. `serveRawFsMiddleware`

处理 `/@fs/`开头的文件（原生的 ES module 不支持裸模块的导入，所以 Vite 进行了模块加载路径的重写。 client.js的路径就是重写了，在路径前面加了`/@fs/`）


### 10. `serveStaticMiddleware`

处理非`html`请求或者`/`请求（这些请求在`indexHtmlMiddleware`中间件上处理）。跳过内部请求（/@fs/, /@vite-client等）。


### 11. `spaFallbackMiddleware`

使用`connect-history-api-fallback`库实现。

实现访问`/`变成`/index/html`。


`connect-history-api-fallback`的简单使用：
```js
var express = require('express');
var app = express();
const history = require('connect-history-api-fallback');
app.use(
  history({
    rewrites: [{ from: '/', to: '/index.html' }],
  })
);

app.get('/index.html', function (req, res, next) {
  res.json({ msg: 'This is index.html' });
});

app.listen(80, function () {
  console.log('web server listening on port 80');
});
```

`history`函数里的`to`也可以是一个方法，接收一个`context`参数（包含`parsedUrl`，`match`，`request`三个对象）


在`vite`中，主要是先判断请求的目录下是否有个`index.html`文件，有的话直接访问该文件，没有就访问根目录的`index.html`文件。
```js
  to({ parsedUrl }: any) {
    const rewritten =
      decodeURIComponent(parsedUrl.pathname) + 'index.html'

    if (fs.existsSync(path.join(root, rewritten))) {
      return rewritten
    } else {
      return `/index.html`
    }
  }
```

### 12. `indexHtmlMiddleware`

用于处理`html`文件。

根据请求的地址是否以`.html`结尾，是的话判断该路径下的`html`文件是否存在，然后进行读取转换操作。
```js
// vite/src/node/server/middlewares/indexHtml.ts
export function indexHtmlMiddleware(
  server: ViteDevServer
): Connect.NextHandleFunction {
  return async function viteIndexHtmlMiddleware(req, res, next) {
    if (res.writableEnded) {
      return next()
    }

    const url = req.url && cleanUrl(req.url)
    // spa-fallback always redirects to /index.html
    if (url?.endsWith('.html') && req.headers['sec-fetch-dest'] !== 'script') {
      const filename = getHtmlFilename(url, server)
      // 是否存在
      if (fs.existsSync(filename)) {
        try {
          // 读取文件
          let html = fs.readFileSync(filename, 'utf-8')
          // 将文件进行转换
          html = await server.transformIndexHtml(url, html, req.originalUrl)
          return send(req, res, html, 'html')
        } catch (e) {
          return next(e)
        }
      }
    }
    next()
  }
}

// vite/src/node/server/index.ts
server.transformIndexHtml = createDevHtmlTransformFn(server)

// vite/src/node/server/middlewares/indexHtml.ts
export function createDevHtmlTransformFn(
  server: ViteDevServer
): (url: string, html: string, originalUrl: string) => Promise<string> {
  // 获取 具有transformIndexHtml的插件并分为两部分
  const [preHooks, postHooks] = resolveHtmlTransforms(server.config.plugins)

  return (url: string, html: string, originalUrl: string): Promise<string> => {
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
```

操作主要有几方面，一方面是通过`script`标签把`@vite/client`这部分代码添加到`html`上，实现`socket`连接。另一方面就是处理插件上的`transformIndexHtml`方法。

### 13. `vite404Middleware`
用于返回404

### 14. `errorMiddleware`

用于打印错误。

> 当中间件存在4个参数时，说明这个中间件时用于处理异常的。
>  `app.use(function errorHandlerMiddleware(err, req, res, next) {})`


