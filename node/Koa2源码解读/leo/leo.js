const http = require("http");
const context = require("./context");
const request = require("./request");
const response = require("./response");

class Leo {
  constructor() {
    this.middlewares = [];
  }

  listen(...args) {
    const server = http.createServer( async (req,res) => {
      let ctx = this.createContext(req, res);
      const fn = this.compose(this.middlewares);
      await fn(ctx);
      res.end(ctx.body);
    })
    server.listen(...args);
  }
  use(middleware) {
    this.middlewares.push(middleware);
  }
  createContext(req, res) {
    const ctx = Object.create(context);
    ctx.request = Object.create(request);
    ctx.response = Object.create(response);

    ctx.req = ctx.request.req = req;
    ctx.res = ctx.response.res = res;
    return ctx;
  }
  compose(middlewares) {
    return function(ctx) {
      return dispatch(0);

      function dispatch(i) {
        let fn = middlewares[i];
        if(!fn) {
          return Promise.resolve();
        }
        return Promise.resolve(
          fn(ctx, function next() {
            return dispatch(i + 1);
          })
        )
      }
    }
  }
}

module.exports = Leo;
