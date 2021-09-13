# Koa2源码解读

`Koa` 是⼀个新的 `web` 框架， 致⼒于成为 `web` 应⽤和 `API` 开发领域中的⼀个更⼩、更富有表现⼒、更健壮的基⽯。

特点：
- 轻量，⽆捆绑
- 中间件架构
- 优雅的API设计
- 增强的错误处理

安装
```bash
npm i koa -S
```

## 基本使用
```js
const Koa = require('koa');
const app = new Koa();
app.use((ctx, next) => {
  ctx.body = [
    {
      content: "koa框架"
    }
  ]
  next()
})


app.use((ctx, next) => {
  console.log("url: " + ctx.url);
  if(ctx.url === '/index.html') {
    ctx.type = 'text/html;charset=utf-8';
    ctx.body = `<h1>koa框架</h1>`
  }
  next()
})

app.listen(3000);
```

## 常见的中间件操作

- 静态服务

```bash
npm i koa-static --save-dev
```

`koa-static` 是`koa`（node框架）中最常用的、较为成熟的 静态`web`托管服务中间件。
```js
app.use(require('koa-static')(__dirname + '/'));
```
当添加以上中间件后，可以在`url`上输入对应的文件名即可进行访问。

比如说有个`data.txt`文件，那么可以直接在`url`上输入`/data.txt`进行文件的读取。

- 路由
```bash
npm i koa-router --save-dev
```

```js
const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')()

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string';
});
router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  };
})

app.use(router.routes());
app.listen(3000);
```

- 日志
```js
app.use(async (ctx,next) => {
  const start = new Date().getTime()
  console.log(`start: ${ctx.url}`);
  await next();
  const end = new Date().getTime()
  console.log(`请求${ctx.url}, 耗时${parseInt(end-start)}ms`)
})
```
