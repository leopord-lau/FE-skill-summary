# Axios 源码解析

根据`package.json`配置中的`main`主入口，可以看到入口文件的是`index.js`

`index.js`
```js
module.exports = require('./lib/axios');
```

进入入口文件，可以看出`axios`的内部逻辑均在`lib`文件夹下。

`lib/axios.js`

生成`axios`实例对象。
```js
function createInstance(defaultConfig) {
  // 创建一个实例，用于指定一个上下文
  var context = new Axios(defaultConfig);
  // 将原型中的request方法的this指向当前实例形成一个新的实例，把该方法作为实例方法使用。
  var instance = bind(Axios.prototype.request, context);
  // 将构造函数 Axios.prototype 上的方法挂载到新的实例 instance 上，然后将原型各个方法中的 this 指向 context，开发中才能使用 axios.get/post… 等等
  utils.extend(instance, Axios.prototype, context);
  // 将构造函数 Axios 的实例属性挂载到新的实例 instance 上
  utils.extend(instance, context);

  // 暴露一个创建实例的方法
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };
  return instance;
}
// 生成供使用的默认实例， 这个default就是默认配置。
var axios = createInstance(defaults);
```
在`createInstance`方法，可以发现里边并不是简单的创建一个实例，而是通过改变上下文及挂载属性的方式从而实现支持`axios()`、`axios.get()`等方式。

同时还暴露出构造函数`Axios`及用于取消请求的`CancelToken`等
```js
axios.Axios = Axios;
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');
```

## 扩展
如果对`createInstance`方法还不是非常理解的话，我们写个简单的`demo`来更深入的了解一下。已经理解了的同学们可以跳过这部分。

首先是`bind`方法，其实就是`axios`里内部实现的一个`Object.bind`方法。将`Axios.prototype.request`这个原型方法的`this`指向刚刚创建的一个`axios`实例，并返回一个函数，用于接收参数传递给`Axios.prototype.request`方法。这样就可以使用`axios({method: 'post',url: '',data: {}})`这种方式。
```js
function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
}
```

```js
var instance = bind(Axios.prototype.request, context);
// 也可以改写成
var instance = Axios.prototype.request.bind(context);
```

`extend` 将构造函数 `Axios.prototype` 上的方法挂载到新的实例 `instance` 上，然后将原型各个方法中的 `this` 指向 `context`
```js
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      // 将原型各个方法中的 this 指向 context
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

function forEach(obj, fn) {
  if (obj === null || typeof obj === 'undefined') {
    return;
  }
  if (typeof obj !== 'object') {
    obj = [obj];
  }
  if (Object.prototype.toString.call(obj) === '[object Array]') {
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}
```

通过查看`extend`源码我们可以很容易理解`createInstance`方法中的两行扩展代码。
```js
// 将构造函数 Axios.prototype 上的方法挂载到新的实例 instance 上，然后将原型各个方法中的 this 指向 context，开发中才能使用 axios.get/post… 等等
utils.extend(instance, Axios.prototype, context);
  // 将构造函数 Axios 的实例属性挂载到新的实例 instance 上
utils.extend(instance, context);
```

来写一个`demo`
```js
class Base {
  constructor(name) {
    this.name = name;
  }
}
Base.prototype.say = function say(message) {
  console.log(message);
  return this;
};
Base.prototype.location = 'china';

let b = new Base('_base');
b._inner = '_inner attribute';

// 将say方法指向b实例，这样就可以通过instance()方式将参数传递给say方法。
let instance = Base.prototype.say.bind(b);
console.log(Object.getOwnPropertyNames(instance));    // ['length', 'name']
console.log(instance('say this message'));            // say this message

// 将Base中的原型方法添加到instance中，此时实例b中的_inner属性并没有添加到instance上
extend(instance, Base.prototype, b);
console.log(Object.getOwnPropertyNames(instance));    // ['length', 'name', 'say', 'location']

// 将实例b中的所有属性添加到instance上
extend(instance, b);
console.log(Object.getOwnPropertyNames(instance));    // ['length', 'name', 'say', 'location', '_inner']
```
