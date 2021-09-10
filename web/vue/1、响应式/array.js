const arrayProto = Array.prototype;
const arrayMethods = Object.create(arrayProto);

const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse' 
]

methodsToPatch.forEach((method) => {
  const original = arrayProto[method];
  Object.defineProperty(arrayMethods, method, {
    value: function mutator(...args) {
      // 覆盖数组原方法
      const result = original.apply(this, args);
      const ob = this.__ob__;
      let inserted;
      switch (method) {
        case 'push': 
        case 'unshift':
          inserted = args
          break
        case 'splice':
          inserted = args.slice(2);
          console.info(inserted);
          break
      }
      if (inserted) ob.observeArray(inserted)
      ob.dep.notify();
      return result;
    },
    writable: true,
    configurable: true
  })
})
