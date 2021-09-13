const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(__dirname + '/'));
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