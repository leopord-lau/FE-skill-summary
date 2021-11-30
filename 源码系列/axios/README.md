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

> **扩展**
>
>如果对`createInstance`方法还不是非常理解的话，我们写个简单的`demo`来更深入的了解一下。已经理解了的同学们可以跳过这部分。
>
>首先是`bind`方法，其实就是`axios`里内部实现的一个`Object.bind`方法。将`Axios.prototype.request`这个原型方法的`this`指向刚刚创建的一个`axios`实例，并返回一个函数，用于接收参数传递给`Axios.prototype.request`方法。这样就可以使用`axios({method: 'post',url: '',data: {}})`这种方式。
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
>
>`extend` 将构造函数 `Axios.prototype` 上的方法挂载到新的实例 `instance` 上，然后将原型各个方法中的 `this` 指向 `context`
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
>
>通过查看`extend`源码我们可以很容易理解`createInstance`方法中的两行扩展代码。
```js
// 将构造函数 Axios.prototype 上的方法挂载到新的实例 instance 上，然后将原型各个方法中的 this 指向 context，开发中才能使用 axios.get/post… 等等
utils.extend(instance, Axios.prototype, context);
  // 将构造函数 Axios 的实例属性挂载到新的实例 instance 上
utils.extend(instance, context);
```
>
>来写一个`demo`
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





## 默认配置
在前面讲解`createInstance`方法时，可以看到传了一个默认配置，这个是`axios`提供的内置属性和方法，可以被覆盖。

```js
var defaults = {
  transitional: {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false,
  },
  // 请求适配器
  adapter: getDefaultAdapter(),

  // 请求转换器
  transformRequest: [],

  // 响应转换器
  transformResponse: [],

  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      Accept: 'application/json, text/plain, */*',
    },
  },
};
```
`xsrfCookieName`、`xsrfHeaderName`用于防止 `csrf` 攻击
```js
if (utils.isStandardBrowserEnv()) {
  // Add xsrf header
  var xsrfValue =
    (config.withCredentials || isURLSameOrigin(fullPath)) &&
    config.xsrfCookieName
      ? cookies.read(config.xsrfCookieName)
      : undefined;

  if (xsrfValue) {
    requestHeaders[config.xsrfHeaderName] = xsrfValue;
  }
}
```

**扩展**
>CSRF攻击攻击原理及过程如下：
>1. 用户C打开浏览器，访问受信任网站A，输入用户名和密码请求登录网站A；
>
>2. 在用户信息通过验证后，网站A产生Cookie信息并返回给浏览器，此时用户登录网站A成功，可以正常发送请求到网站A；
>
>3. 用户未退出网站A之前，在同一浏览器中，打开一个TAB页访问网站B；
>
>4. 网站B接收到用户请求后，返回一些攻击性代码，并发出一个请求要求访问第三方站点A；
>
>5. 浏览器在接收到这些攻击性代码后，根据网站B的请求，在用户不知情的情况下携带Cookie信息，向网站A发出请求。网站A并不知道该请求其实是由B发起的，所以会根据用户C的Cookie信息以C的权限处理该请求，导致来自网站B的恶意代码被执行。
>
>现在网站 B 发起的请求里虽然有 cookie 但是并不包含前端和后端约定好的 header 中的 X-XSRF-TOKEN 字段，所以请求会失败，这样便防止了 csrf 攻击。


## `Axios`构造函数

```js
function Axios(instanceConfig) {
  // 默认配置
  this.defaults = instanceConfig;
  // 拦截器
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager(),
  };
}
```

在`request`这个原型方式，可以通过传入`config`来覆盖默认的配置。

`request`方法具体做了以下工作：

1. 兼容多种传参方式(1. request('example/url', { method: 'post' });  request({ url: 'example/url', method: 'post' }))
2. 合并参数
3. 通过`promise`的链式调用，处理请求、响应拦截器以及发送请求等操作。

```js
Axios.prototype.request = function request(config) {
  // 兼容多种传参方式
  // 1. request('example/url', { method: 'post' })
  // 2. request({ url: 'example/url', method: 'post' });
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }
  // 合并配置
  config = mergeConfig(this.defaults, config);

  // 设置方法，默认get
  ...

  // 请求拦截器
  var requestInterceptorChain = [];
  // 拦截器是否是同步的
  var synchronousRequestInterceptors = true;
  
  // 拦截器处理，先跳过，下一部分在详解
  ...

  // 发送请求
  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  // 执行response拦截器
  while (responseInterceptorChain.length) {
    promise = promise.then(
      responseInterceptorChain.shift(),
      responseInterceptorChain.shift()
    );
  }

  return promise;
};
```

`mergeConfig`方法对不同的参数进行是否选用默认参数的处理，比如`url`、`method`、`data`等参数就没有默认的。

```js
var mergeMap = {
  // 如果用户配置中不存在，不会选用默认
  url: valueFromConfig2,
  method: valueFromConfig2,
  data: valueFromConfig2,

  // 用户配置中不存在，会选用默认
  baseURL: defaultToConfig2,
  transformRequest: defaultToConfig2,
  transformResponse: defaultToConfig2,
  paramsSerializer: defaultToConfig2,
  timeout: defaultToConfig2,
  timeoutMessage: defaultToConfig2,
  withCredentials: defaultToConfig2,
  adapter: defaultToConfig2,
  responseType: defaultToConfig2,
  xsrfCookieName: defaultToConfig2,
  xsrfHeaderName: defaultToConfig2,
  onUploadProgress: defaultToConfig2,
  onDownloadProgress: defaultToConfig2,
  decompress: defaultToConfig2,
  maxContentLength: defaultToConfig2,
  maxBodyLength: defaultToConfig2,
  transport: defaultToConfig2,
  httpAgent: defaultToConfig2,
  httpsAgent: defaultToConfig2,
  cancelToken: defaultToConfig2,
  socketPath: defaultToConfig2,
  responseEncoding: defaultToConfig2,

  validateStatus: mergeDirectKeys,
};
```

## 拦截器

来看看`axios`是如何通过`promise`实现拦截器的。

拦截器管理机制其实很简单。就只有一个属性（用于保存拦截器）及三个原型方法（添加、移除、执行）。
```js
function InterceptorManager() {
  this.handlers = [];
}

// 添加拦截器
InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    // 默认是异步的
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null,
  });
  return this.handlers.length - 1;
};

// 移除拦截器
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

// 执行所有的拦截器
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};
```

在`Axios`构造函数里创建了两个拦截器管理实例
```js
this.interceptors = {
  request: new InterceptorManager(),
  response: new InterceptorManager(),
};
```

在`axios`实例创建后，可通过 `use` 方法注册成功和失败的钩子函数，比如 `axios.interceptors.request.use((config) => config, (error) => error, options);`

```js
// 添加请求拦截器
axios.interceptors.request.use(
    function (config) {
        // 在发送请求之前做些什么
        return config;
    },
    function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 添加响应拦截器
axios.interceptors.response.use(
    function (response) {
        // 对响应数据做点什么
        return response;
    },
    function (error) {
        // 对响应错误做点什么
        return Promise.reject(error);
    }
);
```

需要主要的是，在传递`use`方法的第一个参数时必须返回`config`，保证下一个`promise`能获取到处理后的参数。 `options`是可选参数对象，可传入两个属性(`synchronous`, `runWhen`);

`synchronous`: 在添加一个请求拦截器时，`axios`默认这些是异步的，如果拦截器是同步的，不想被默认成异步造成延迟，可以往`options`中传入该属性。
```js
axios.interceptors.request.use(function (config) {
  return config;
}, null, { synchronous: true });
```


`runWhen`: 用于运行时检查执行特定的拦截器，可以添加一个`runWhen`函数到`options`，当函数返回`false`时该拦截器不会执行。

```js
function onGetCall(config) {
  return config.method === 'get';
}
axios.interceptors.request.use(function (config) {
  return config;
}, null, { runWhen: onGetCall });

```


`request`原型方法中对这些拦截器的操作其实也很简单，就是创建一个栈，将`use`方法获取的所有处理函数都推进栈中。

```js
Axios.prototype.request = function request(config) {
  // 请求拦截器栈
  var requestInterceptorChain = [];
  // 拦截器是否是同步的
  var synchronousRequestInterceptors = true;

  // 循环将请求拦截器加入请求拦截链中
  this.interceptors.request.forEach(function unshiftRequestInterceptors(
    interceptor
  ) {
    if (
      typeof interceptor.runWhen === 'function' &&
      interceptor.runWhen(config) === false
    ) {
      return;
    }

    // 是否同步，只要一个拦截器是异步，那么整个都是异步
    synchronousRequestInterceptors =
      synchronousRequestInterceptors && interceptor.synchronous;

    // 将处理方法推进栈中，采用unshift方法
    requestInterceptorChain.unshift(
      interceptor.fulfilled,
      interceptor.rejected
    );
  });

  // 响应拦截器栈
  var responseInterceptorChain = [];
  // 循环将响应拦截器加入拦截链中
  this.interceptors.response.forEach(function pushResponseInterceptors(
    interceptor
  ) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  ...
}
```

上面的代码将用户设置的请求跟响应拦截器通过`unshift`和`push`方法分别放进了两个栈中，下面继续看看`axios`是如何将所有的拦截器跟发送请求放进一个`promise`链中。

异步执行
```js
Axios.prototype.request = function request(config) {
  ...

  var promise;

  // 异步执行方法
  if (!synchronousRequestInterceptors) {
    // 整一个执行链条
    var chain = [dispatchRequest, undefined];

    // 头unshift进request拦截器
    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    // 尾push进response拦截器
    chain = chain.concat(responseInterceptorChain);

    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }
  // 同步执行方法
  ...
}
```

`axios`采用`promise.resolve`的方式将拦截器异步化。将所有请求拦截器放在请求方法之前，所有的响应拦截器放在后。遍历所有的方法通过`promise`的`then`方法将所有方法放在一条链上。

`promise.resolve`异步化简单示例。
```js
function printA(data) {
  console.log(data);
  return data + 'a';
}

function asyncPrintA() {
  let promise = Promise.resolve('async a')
    .then(printA)
    .then(printA)
    .then(printA);
  return promise;
}

console.log(asyncPrintA());
printA('a');
console.log('log after a, before async a');


// a
// log after a, before async a
// async a
// async aa
// async aaa
```

来看同步执行的方法。
```js
Axios.prototype.request = function request(config) {
  ...
  
  // 同步执行方法
  var newConfig = config;
  // 遍历执行request拦截器
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      // 只要链中有一个失败就直接失败退出
      onRejected(error);
      break;
    }
  }
  // 发送请求
  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  // 执行response拦截器
  while (responseInterceptorChain.length) {
    promise = promise.then(
      responseInterceptorChain.shift(),
      responseInterceptorChain.shift()
    );
  }
  return promise;
}
```

请求拦截器是在请求方法方法之前执行，因此不需要考虑请求响应的情况，直接遍历执行所有的方法就可以了，当其中一个拦截器出现错误时会中断整个请求。当执行完后发送请求，由于请求是异步的，因此响应拦截器也必须是异步的，所以通过`promise`的`then`方法串起来。


## `dispatchRequest`

在发送请求前，会进行一系列的操作:
1. 判断该请求是否已经取消了
```js
throwIfCancellationRequested(config);
```
这个方法会判断请求体内的`cancel`是否已经执行了，如果执行了就会直接抛出原因，不会发送请求。


2. 转换`data`，比如对 `post` 请求的 `data` 进行字符串化 `JSON.stringify(data)`

```js
config.data = transformData.call(
  config,
  config.data,
  config.headers,
  config.transformRequest
);
```
通常来说，我们不需要传入一个`transformRequest`参数，直接使用默认的就可以。

`transformRequest`
```js
transformRequest: [
  function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    // 满足的data类型
    if (
      utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(
        headers,
        'application/x-www-form-urlencoded;charset=utf-8'
      );
      return data.toString();
    }
    if (
      utils.isObject(data) ||
      (headers && headers['Content-Type'] === 'application/json')
    ) {
      setContentTypeIfUnset(headers, 'application/json');
      return stringifySafely(data);
    }
    return data;
  },
],
```

如果你要自己写一个转换方法的，需要注意这个方法只满足`PUT`, `POST`, `PATCH`和`DELETE`这些方法，而且由于传入的是一个数组，最后一个方法必须返回`string`,`buffer`,`ArrayBuffer`,`FormData`,`Stream`类型的数据。


3. 选择适配器 ( 浏览器端 `xhr` 和 `node` 端的 `http`)

```js
var adapter = config.adapter || defaults.adapter;
```
同样，适配器也可以自定义。

我们看看默认的适配器
```js
function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = require('./adapters/xhr');
  } else if (
    typeof process !== 'undefined' &&
    Object.prototype.toString.call(process) === '[object process]'
  ) {
    // For node use HTTP adapter
    adapter = require('./adapters/http');
  }
  return adapter;
}
```
逻辑很简单，就是判断`XMLHttpRequest`这个对象存不存在，存在说明是出于浏览器环境，否则便是`node`环境。

现在来看一下`xhrAdapter`
```js
function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;
    var onCanceled;

    // token 相关
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }

      if (config.signal) {
        config.signal.removeEventListener('abort', onCanceled);
      }
    }

    // 不处理formData格式的header
    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    // 起一个xml请求
    var request = new XMLHttpRequest();
    // http 基础鉴权
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password
        ? unescape(encodeURIComponent(config.auth.password))
        : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    // 建立连接
    request.open(
      config.method.toUpperCase(),
      buildURL(fullPath, config.params, config.paramsSerializer),
      true
    );

    // 设置timeout
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      var responseHeaders =
        'getAllResponseHeaders' in request
          ? parseHeaders(request.getAllResponseHeaders())
          : null;
      var responseData =
        !responseType || responseType === 'text' || responseType === 'json'
          ? request.responseText
          : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request,
      };

      settle(
        function _resolve(value) {
          resolve(value);
          done();
        },
        function _reject(err) {
          reject(err);
          done();
        },
        response
      );
      request = null;
    }

    // 添加onloaded事件
    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // 通过readyState来模拟实现一个onloaded事件
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }
        if (
          request.status === 0 &&
          !(request.responseURL && request.responseURL.indexOf('file:') === 0)
        ) {
          return;
        }
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    // 超时
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = config.timeout
        ? 'timeout of ' + config.timeout + 'ms exceeded'
        : 'timeout exceeded';
      var transitional = config.transitional || defaults.transitional;
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(
        createError(
          timeoutErrorMessage,
          config,
          transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
          request
        )
      );

      // Clean up request
      request = null;
    };

    // xsrf相关
    ...

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (
          typeof requestData === 'undefined' &&
          key.toLowerCase() === 'content-type'
        ) {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken || config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = function (cancel) {
        if (!request) {
          return;
        }
        reject(
          !cancel || (cancel && cancel.type) ? new Cancel('canceled') : cancel
        );
        // 取消请求
        request.abort();
        request = null;
      };

      config.cancelToken && config.cancelToken.subscribe(onCanceled);
      if (config.signal) {
        config.signal.aborted
          ? onCanceled()
          : config.signal.addEventListener('abort', onCanceled);
      }
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};
```