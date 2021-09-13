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

app.use(async (ctx,next) => {
  const start = new Date().getTime()
  console.log(`start: ${ctx.url}`);
  await next();
  const end = new Date().getTime()
  console.log(`请求${ctx.url}, 耗时${parseInt(end-start)}ms`)
})
app.use(router.routes());
app.listen(3000);
