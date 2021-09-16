function compose(middlewares) {
  return function() {
    // 默认执行第一个
    return dispatch(0);

    function dispatch(i) {
      const fn = middlewares[i];
      if(!fn) {
        return Promise.resolve();
      }
      return Promise.resolve(
        fn(function next() {
          // 执行下一个
          return dispatch(i + 1);
        })
      )
    }
  }
}

// test

async function fn1(next) {
  console.log('fn1');
  await next();
  console.log('end fn1');
}

async function fn2(next) {
  console.log("fn2");
  await delay();
  await next();
  console.log("end fn2");
}
function fn3(next) {
  console.log("fn3");
}
function delay() {
  return new Promise((reslove, reject) => {
    setTimeout(() => {
      reslove();
    }, 2000);
  });
}
const middlewares = [fn1, fn2, fn3];
const finalFn = compose(middlewares);
finalFn();