# Vue 知识汇总

## 1. 创建实例
通过`Vue`函数创建一个`Vue`实例.
```js
const vm = new Vue({})
```

## 2. 数据
当创建了一个实例后，通过将数据传入实例的`data`属性中，会将数据进行劫持，实现响应式，也就是说当这些数据发生变化时，对应的视图也会发生改变。
```js
const data = {
  a: 1
}
const vm = new Vue({
  data: data
})

console.log(vm.a === data.a);  // true

vm.a = 2;
console.log(data.a)            // 2

data.a = 3;
console.log(vm.a)              // 3
```

### 数据响应式源码解析

#### 编写一个mini观察器

可能大部分人都已知道了Vue2.0是采用`Object.defineProperty()`这个API进行实现。
`Object.defineProperty`的使用
```js
var data={}
Object.defineProperty(data,'name',{
  get:function(){
    return value
  },
  set:function(newValue){
    value=newValue
  }
})
//如果不为属性设置初始值，就会报错。所以在使用时需要为data中的属性设置‘’这个空的初始化值。
data.name='leo' 
```

在页面上进行响应:
```html
<div id="app">
  <p>你好，<span id='name'></span></p>
</div>
<script>
var obj = {};
// 数据劫持
Object.defineProperty(obj, "name", {
  get() {
    console.log('获取name')
    return document.querySelector('#name').innerHTML;
  },
  set(nick) {
    console.log('设置name')
    document.querySelector('#name').innerHTML = nick;
  }
});
console.log(obj.name);   
obj.name = "leo";
console.log(obj.name)
</script>
```

理解了`Object.defineProperty()`的使用后，现在我们从0开始通过`Object.defineProperty()`编写一个mini观察器来理解Vue响应式的原理思路。

1. getter和setter
实现一个转换函数（或者说是拦截函数），对对象中的属性进行`set`和`get`.
```js
function observe(obj) {
  // 遍历data中的所有键
  Object.keys(obj).forEach(key => {
    // 获取键对应的值
    let value = obj[key];
    Object.defineProperty(obj, key, {
      get() {
        console.log(`${key}': `, value);
        return value;
      },
      set(newVal) {
        console.log(`set ${newVal} to ${key}`);
        value = newVal;
      }
    })
  })
}
```

2. 依赖收集
就是追踪当`data`改变时哪些代码应该执行。
定义一个Dep类，至少应该包含`depend`（收集）和 `notify`（唤醒）这两个方法。
```js
class Dep {
  constructor() {
    // 定义一个数组用于保存已经收集到更新方法
    this.subs = new Set();
  }
  depend(dep) { 
    if(dep) {
      this.subs.add(dep);
    }
  }
  notify() {
    // 执行所有收集到的更新方法
    this.subs.forEach(sub => sub());
  }
}
```

那么依赖是在什么时候收集的呢？
其实某段代码在调用data中的值的时候对这个代码块进行收集。
比如说我们在`observe`上下文中用到了data中的某个值，那么这时候收集到的代码块应该是整片代码：
修改`dep.js`中的更新方法：
```js
// dep.js
class Dep {
  constructor() {
    // 定义一个数组用于保存已经收集到更新方法
    this.subs = new Set();
  }
  depend(dep) { 
    this.subs.add(dep);
  }
  notify() {
    // 执行所有收集到的更新方法
    this.subs.forEach(function(sub) {
      // 调用收集到的代码块中的update方法
      sub.update()
    });
  }
}
```

```js
// observe.js
// 定义上下文
let context = this;

function observe(obj) {
  // 遍历data中的所有键
  Object.keys(obj).forEach(key => {
    // 获取键对应的值
    let value = obj[key];
    let dep = new Dep();
    Object.defineProperty(obj, key, {
      get() {
        // 收集，是哪块代码在进行收集
        dep.depend(context);
        console.log(`${key}': `, value);
        return value;
      },
      set(newVal) {
        if(value !== newVal) {
          console.log(`set ${newVal} to ${key}`);
          value = newVal;
          // 更新
          dep.notify();
        }
      }
    })
  })
}

// 定义数据
const obj = {
  count: 0
}
observe(obj);

// 在observe文件中调用了data中的值
console.log(obj.count);

// 更新方法
function update() {
  console.log("updated")
  console.log(obj.count);
}

// 更改值，此时就会触发更新
obj.count = 2;
```
为了更方便我们传入上下文，我们创建一个`watcher`来监听一下。
```js
// watcher.js
class Watcher {
  constructor(key) {
    Dep.target = this;
    this.key = key;
  }
  update() {
    console.log(`属性${this.key}更新了`);
  }
}
```

更改一下`observe`的依赖收集信息：
```js
// observe.js
function observe(obj) {
  Object.keys(obj).forEach(key => {
    let value = obj[key];
    let dep = new Dep();
    Object.defineProperty(obj, key, {
      get() {
        // 更改
        Dep.target && dep.depend(Dep.target);
        console.log(`${key}': `, value);
        return value;
      },
      set(newVal) {
        if(value !== newVal) {
          console.log(`set ${newVal} to ${key}`);
          value = newVal;
          dep.notify();
        }
      }
    })
  })
}

const obj = {
  count: 0
}
observe(obj);

// 传入需要监听的代码块
new Watcher(this, "count");

// 触发收集
console.log(obj.count);

// 触发更新
obj.count = 2;
```

理解了大概的思路后我们就把上面这些代码完善一下，实现自己的vue响应式代码。
```js
class Leo {
  constructor(options) {
    this.$options = options;
    this.$data = options.data;
    // 进行响应化
    this.observe(this.$data);
  }

  observe(value) {
    // 对象类型
    if(!value || typeof value !== 'object') {
      return;
    }
    Object.keys(value).forEach(key => {
      // 响应化
      this.defineReactive(value, key, value[key]);
      
      // 执行代理
      this.proxyData(key);
    })
  }
  defineReactive(obj, key, val) {
    // 递归
    this.observe(val);

    const dep = new Dep();

    Object.defineProperty(obj, key, {
      get() {
        Dep.target && dep.addDep(Dep.target);
        return val;
      },
      set(newVal) {
        if(newVal === val) {
          return;
        }
        val = newVal;
        dep.notify();
      } 
    })
  }
  
  proxyData(key) {
    // 在实例上定义属性的话是需要this.$data.xxx的方法，我们采用defineProperty方式进行代理，使得能够通过this.xxx 进行处理
    Object.defineProperty(this, key, {
      get() {
        return this.$data[key];
      },
      set(newVal) {
        this.$data[key] = newVal;
      }
    })
  }
}

class Dep {
  constructor() {
    this.deps = [];
  }
  addDep(dep) {
    this.deps.push(dep);
  }
  notify() {
    this.deps.forEach(dep => dep.update())
  }
}

class Watcher {
  constructor(key) {
    // console.log(context);
    Dep.target = this;
    this.key = key;
  }
  update() {
    console.log(`属性${this.key}更新了`);
  }
}
```
由于目前还没有实现编译部分代码，所以对于`watcher`的监听只能局限与实例里边，`watcher`创建代码如下：
```js
class Leo {
  constructor(options) {
    // ...
    // 代码测试
    new Watcher(this, 'test');
    this.test
  }
  // ...
}

// 测试
const leo = new Leo({
  data: {
    test: "test"
  }
})
leo.test = 'change'
```

经过上面的代码，你应该对Vue的响应式有一定的理解了，现在我们将开始讲解Vue的响应式源码。

#### 数据响应式源码
Vue一大特点是数据响应式，数据的变化会作用于UI而不用进行DOM操作。原理上来讲，是利用了JS语言特性`Object.defineProperty()`，通过定义对象属性`setter`方法拦截对象属性变更，从而将数值的变化转换为UI的变化。

具体实现是在Vue初始化时，会调用`initState`，它会初始化`data`，`props`等，这里着重关注`data`初始化.

初始化数据源码目录：`src/core/instance/state.js`

核心代码便是`initData`:
```js
function initData (vm: Component) { // 初始化数据
  let data = vm.$options.data // 获取data
  data = vm._data = typeof data === 'function' // data(){return {}} 这种情况跟 data:{} 这种
    ? getData(data, vm)
    : data || {}
  
  // ..
  
  // proxy data on instance // 将data代理到实例上
  proxy(vm, `_data`, key) // 代理，通过this.dataName就可以直接访问定义的数据，而不用通过this.$data.dataName
  // observe data
  
  // ..

  observe(data, true /* asRootData */) // 执行数据的响应化
}
```

core/observer/index.js
observe方法返回一个`Observer`实例
```js
function observe (value: any, asRootData: ?boolean): Observer | void {  // 返回一个Observer实例,一个data对应这一个__ob__(有value，dep这两者个数相同)

  // ..

  ob = new Observer(value) // 新建一个Observer实例，通过将这个实例添加在value的__ob__属性中

  // ..

  return ob
}
```

core/observer/index.js
Observer对象根据数据类型执行对应的响应化操作

```js
class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that have this object as root $data

  constructor (value: any) {
    this.value = value // data本身
    // 最开始是data调用了一次
    this.dep = new Dep() // dependence 依赖收集，data中的每一个键都对应着一个dep

    // ..

    def(value, '__ob__', this) // 定义一个property 设置_ob__,它的值就是Observer实例
    if (Array.isArray(value)) { // data中可能具有object或者array类型的数据，需要进行不同的处理方式
      
      // ..

      // 循环遍历所有的value进行observe操作
      this.observeArray(value)
    } else {
      this.walk(value) // 如果不是array类型，就直接进行操作
    }
  }

  // 处理对象类型数据
  walk (obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) { 
      defineReactive(obj, keys[i]) // 添加响应式处理
    }
  }

  // 遍历数组添加监听（data里边的数组数据）
  observeArray(items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}
```

`defineReactive`定义对象属性的`getter`/`setter`，`getter`负责添加依赖，`setter`负责通知更新.
```js
// 定义响应式
function defineReactive {
  // 为每一个属性也添加依赖收集
  const dep = new Dep()

  // 获取对象描述符（用于判断是否可以配置）
  const property = Object.getOwnPropertyDescriptor(obj, key) // 获取键的属性描述符
  if (property && property.configurable === false) { // 如果是不可配置的属性，直接返回
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get // 获取键的getter
  const setter = property && property.set // 获取键的setter

  if ((!getter || setter) && arguments.length === 2) { // 如果键没有设置getter或者setter而且传入的参数只有两个（会设置其他非用户传进来的参数（$attrs,$listeners等））
    val = obj[key] // 就直接保存这个键对应的值，进行下面的操作
  }

  // 判断是否观察子对象
  let childOb = !shallow && observe(val) // 判断是否具有子对象（返回undefined或者observer） 例如 data:{name:{lastName:'lau',firstName:'leo'}} // 给子对象也添加observer
  
  // 拦截获取
  Object.defineProperty(obj, key, { // 设置getter和setter
    enumerable: true,
    configurable: true,
    // 获取
    get: function reactiveGetter () { // 设置响应化获取
      const value = getter ? getter.call(obj) : val // 如果有配置getter，就绑定到data中，否则就直接输出结果
      if (Dep.target) { // watch实例
        dep.depend() // 给watcher添加dep
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
  
    // 拦截
    set: function reactiveSetter (newVal) {
      // 获取之前的值 且不为 NaN
      const value = getter ? getter.call(obj) : val

      // .. 判断新值

      if (getter && !setter) return
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      // 如果存在子对象，且非浅监听，直接观察
      childOb = !shallow && observe(newVal)

      // 触发更新
      dep.notify()
    }
  })
}
```

core/observer/dep.js
`Dep`负责管理一组`Watcher`，包括`watcher`实例的增删及通知更新。
```js
class Dep { // 依赖，管理watcher
  static target: ?Watcher;  // target就是watcher实例
  id: number;
  subs: Array<Watcher>;

  constructor () {
    this.id = uid++
    this.subs = []
  }
  addSub (sub: Watcher) { // 添加订阅者，有多个访问了data中的某个属性
    this.subs.push(sub)
  }

  removeSub (sub: Watcher) { // 删除订阅者
    remove(this.subs, sub)
  }

  depend () { // watcher中添加dep实例
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  notify () {

    // stabilize the subscriber list
    // ..

    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update() // 通知更新
    }
  }
}
```

**`Watcher`**

`Watcher`解析一个表达式并收集依赖，当数值变化时触发回调函数，常用于`$watch` API和指令中。
每个组件也会有对应的`Watcher`，数值变化会触发其`update`函数导致重新渲染。

```js
class Watcher {
  constructor () {}
  // 重新收集依赖
  get () {
    pushTarget(this) // 将Dep.target设置成当前的watcher实例，将当前的watcher添加进watcher队列中
  }
  // 给当前组件的watcher添加依赖
  addDep (dep: Dep) {
    // ..
    
    // 添加watcher实例
    dep.addSub(this)
  }
  // 清除数据
  cleanupDeps () {}

  // 更新 懒更新和同步
  update () { // 通知更新
    
    // ..
    // 同步执行更新渲染
    this.run()

    // 异步就添加到watcher队列之后统一更新
  }

  // 执行更新
  run() {}
```

以上就是一些数据响应式相关的源码，在使用Vue时，数组是特别注意的。

**数组响应化**
数组数据变化的侦测跟对象不同，我们操作数组通常使用`push`、`pop`、`splice`等方法，此时没有办法得知数据变化。所以vue中采取的策略是拦截这些方法并通知`dep`。

```js
function observe(obj) {
  Object.definedPro
}
```




## 3. 模板语法
Vue.js 使用了基于 HTML 的模板语法，允许开发者声明式地将 DOM 绑定至底层 Vue 实例的数据。所有 Vue.js 的模板都是合法的 HTML，所以能被遵循规范的浏览器和 HTML 解析器解析。

### 文本
数据绑定最常见的形式就是使用“Mustache”语法 (双大括号) 的文本插值：
```html
<span>Message: {{ msg }}</span>
```
Mustache 标签将会被替代为对应数据对象上 msg property 的值。无论何时，绑定的数据对象上 msg property 发生了改变，插值处的内容都会更新。

通过使用 `v-once` 指令，你也能执行一次性地插值，当数据改变时，插值处的内容不会更新。但请留心这会影响到该节点上的其它数据绑定：
```html
<span v-once>这个将不会改变: {{ msg }}</span>
```

### 原始HTML
双大括号会将数据解释为普通文本，而非 HTML 代码。为了输出真正的 HTML，你需要使用 `v-html` 指令：
```html
<p>Using mustaches: {{ rawHtml }}</p>
<p>Using v-html directive: <span v-html="rawHtml"></span></p>
```


### attribute
Mustache 语法不能作用在 HTML attribute 上，遇到这种情况应该使用 `v-bind` 指令
```html
<div v-bind:id="dynamicId"></div>
```
对于布尔 `attribute` (它们只要存在就意味着值为 `true`)，`v-bind` 工作起来略有不同，在这个例子中：
```html
<button v-bind:disabled="isButtonDisabled">Button</button>
```
如果 `isButtonDisabled` 的值是 `null`、`undefined` 或 `false`，则 `disabled`属性甚至不会被包含在渲染出来的 \<button> 元素中。


### 表达式
表达式会在所属 Vue 实例的数据作用域下作为 JavaScript 被解析。有个限制就是，每个绑定都只能包含单个**表达式**。
```html
{{ number + 1 }}

{{ ok ? 'YES' : 'NO' }}

{{ message.split('').reverse().join('') }}

<div v-bind:id="'list-' + id"></div>
```
以上的表达式可以被解析。下面的例子则不能被解析。
```html
<!-- 这是语句，不是表达式 -->
{{ var a = 1 }}

<!-- 流控制也不会生效，请使用三元表达式 -->
{{ if (ok) { return message } }}
```

### 指令
指令 (Directives) 是带有 `v-` 前缀的特殊 attribute。指令 attribute 的值预期是单个 JavaScript 表达式 (v-for 是例外情况)。指令的职责是，当表达式的值改变时，将其产生的连带影响，响应式地作用于 DOM。
```html
<p v-if="seen">现在你看到我了</p>
```
`v-if` 指令将根据表达式 `seen` 的值的真假来插入/移除 \<p> 元素。

**参数**

一些指令能够接收一个“参数”，在指令名称之后以冒号表示。例如，`v-bind` 指令可以用于响应式地更新 HTML attribute：
```html
<a v-bind:href="url">...</a>
```
元素的 `href` 属性与表达式 `url` 的值绑定。

`v-on`指令用于监听DOM事件。
比如点击事件：
```html
<a v-on:click="doSomething">...</a>
```


**动态参数**

可以用方括号括起来的 JavaScript 表达式作为一个指令的参数。
```html
<a v-bind:[attributeName]="url"> ... </a>
```
这里的 `attributeName` 会被作为一个 JavaScript 表达式进行动态求值，求得的值将会作为最终的参数来使用。
例如，如果你的 Vue 实例有一个  `attributeName`，其值为 "`href`"，那么这个绑定将等价于 `v-bind:href`。

同样，也可以使用动态参数为一个动态的事件名绑定处理函数。
```html
<a v-on:[eventName]="doSomething"> ... </a>
```

当然，vue对动态参数是有约束的。
- 对动态参数的值的约束： 动态参数预期会求出一个字符串，异常情况下值为 null。这个特殊的 null 值可以被显性地用于移除绑定。任何其它非字符串类型的值都将会触发一个警告。
- 对动态参数表达式的约束：动态参数表达式有一些语法约束，因为某些字符，如空格和引号，放在 HTML attribute 名里是无效的。


**修饰符**
修饰符 (modifier) 是以半角句号 `.` 指明的特殊后缀，用于指出一个指令应该以特殊方式绑定。例如，`.prevent` 修饰符告诉 `v-on` 指令对于触发的事件调用 `event.preventDefault()`.
```html
<form v-on:submit.prevent="onSubmit">...</form>
```


### 缩写
`v-` 前缀作为一种视觉提示，用来识别模板中 Vue 特定的 attribute。当你在使用 Vue.js 为现有标签添加动态行为 (dynamic behavior) 时，`v-` 前缀很有帮助，然而，对于一些频繁用到的指令来说，就会感到使用繁琐。同时，在构建由 Vue 管理所有模板的单页面应用程序 (SPA - single page application) 时，v- 前缀也变得没那么重要了。因此，Vue 为 `v-bind` 和 `v-on` 这两个最常用的指令，提供了特定简写.

**v-bind缩写**
用`:`直接替换`v-bind`。
```html
<!-- 完整语法 -->
<a v-bind:href="url">...</a>

<!-- 缩写 -->
<a :href="url">...</a>
<a :[key]="url"> ... </a>
```

**v-on缩写**
```html
<!-- 完整语法 -->
<a v-on:click="doSomething">...</a>

<!-- 缩写 -->
<a @click="doSomething">...</a>
<a @[event]="doSomething"> ... </a>
```


## 4. 计算属性和侦听器

### 计算属性

用于解决模板表达式内的逻辑复杂的运算。

比如说在表达式内有个复杂运算：
```html
<div id="example">
  {{ message.split('').reverse().join('') }}
</div>
```
使用`computed`:
```html
<div id="example">
  <p>Original message: "{{ message }}"</p>
  <p>Computed reversed message: "{{ reversedMessage }}"</p>
</div>
<script>
export default {
  data() {
    return {
      message: 'hello'
    }
  },
  computed: {
    reversedMessage: function() {
      return this.message.split('').reverse().join('');
    }
  }
}
</script>
```

**计算属性缓存 vs 方法**

你可能已经注意到我们可以通过在表达式中调用方法来达到同样的效果：
```html
<div id="example">
  <p>Original message: "{{ message }}"</p>
  <p>Computed reversed message: "{{ reversedMessage() }}"</p>
</div>
<script>
export default {
  data() {
    return {
      message: 'hello'
    }
  },
  methods: {
    reversedMessage: function() {
      return this.message.split('').reverse().join('');
    }
  }
}
</script>
```
虽然两种方式的最终结果确实是完全相同的，但是计算属性是基于它们的响应式依赖进行缓存的。只在相关响应式依赖发生改变时它们才会重新求值。这就意味着只要 `message` 还没有发生改变，多次访问 `reversedMessage` 计算属性会立即返回之前的计算结果，而不必再次执行函数。

这也就意味着当计算属性中没有响应式数据时，不会触发更新。
```js
// 值用于不变
computed: {
  now: function () {
    return Date.now()
  }
}
```

我们为什么需要缓存？假设我们有一个性能开销比较大的计算属性 A，它需要遍历一个巨大的数组并做大量的计算。然后我们可能有其他的计算属性依赖于 A。如果没有缓存，我们将不可避免的多次执行 A 的 getter！如果你不希望有缓存，请用方法来替代。

**计算属性 vs 侦听属性**

Vue 提供了一种更通用的方式来观察和响应 Vue 实例上的数据变动：侦听属性（`watch`）。当你有一些数据需要随着其它数据变动而变动时，你很容易滥用 `watch`。然而，通常更好的做法是使用计算属性而不是命令式的 `watch` 回调。

区别：
1. 计算属性在调用时需要在模板中渲染，修改计算所依赖元数据；watch在调用时只需修改元数据。
2. 计算属性默认深度依赖，watch默认浅度观测。
3. 计算属性适合做筛选，不可异步；watch适合做执行异步或开销较大的操作。

`computed`
> computed 是计算属性，它会根据你所依赖的数据动态显示新的计算结果

计算属性将被加入到 Vue 实例中。所有 `getter` 和 `setter` 的 `this` 上下文自动地绑定为 Vue 实例

通过计算出来的属性不需要调用直接可以在 DOM 里使用。

如果数据要通过复杂逻辑来得出结果，推荐使用计算属性。

`watch`
>一个对象，键是 data 对应的数据，值是对应的回调函数。值也可以是方法名，或者包含选项的对象，当 data 的数据发生变化时，就会发生一个回调，他有两个参数，一个 val （修改后的 data 数据），一个 oldVal（原来的 data 数据）   
Vue 实例将会在实例化时调用$watch()，遍历 watch 对象的每一个属性。

注意：**不应该使用箭头函数来定义 `watcher` 函数**，因为箭头函数没有 this，它的 this 会继承它的父级函数，但是它的父级函数是 window，导致箭头函数的 this 指向 window，而不是 Vue 实例。

- deep 控制是否要看这个对象里面的属性变化。
- immediate 控制是否在第一次渲染是执行这个函数。

```html
<div id="example">
  <button @click="obj.a += 'hi'">obj.a + 'hi'</button>
</div>
<script>
export default {
  data() {
    return {
      obj: {
        a:  'a'
      },
    }
  },
  watch: {
    obj: {
      handler: function(val) {
        console.log("obj改变了")
      },
      // 可以通过注释下面一行代码来看到区别，如deep为false，不会触发函数
      // deep: true,

      // 该属性设定该回调将会在侦听开始之后被立即调用
      immediate: true
    }
  },
}
</script>
```

总结：

如果一个数据需要经过复杂计算就用 `computed`

如果一个数据需要被监听并且对数据做一些操作就用 `watch`


**计算属性的setter**
计算属性默认只有 getter，不过在需要时你也可以提供一个 setter。
```js
computed: {
  fullName: {
    // getter
    get: function () {
      return this.firstName + ' ' + this.lastName
    },
    // setter
    set: function (newValue) {
      var names = newValue.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
    }
  }
}
```
运行`vm.fullName = 'John Doe'` 时，`setter` 会被调用，`vm.firstName` 和 `vm.lastName` 也会相应地被更新。


## 5、Class与Style绑定
操作元素的 class 列表和内联样式是数据绑定的一个常见需求。因为它们都是 attribute，所以我们可以用 `v-bind` 处理它们：只需要通过表达式计算出字符串结果即可。不过，字符串拼接麻烦且易错。因此，在将 `v-bind` 用于 `class` 和 `style` 时，Vue.js 做了专门的增强。表达式结果的类型除了字符串之外，还可以是对象或数组。

### 绑定 HTML Class

**对象语法**

可以传给 v-bind:class 一个对象，以动态地切换 class。
```html
<div v-bind:class="{ active: isActive }"></div>
```
active就是一个class属性值，这个class存在与否将取决于数据 `isActive` 的 truthiness。

你可以在对象中传入更多字段来动态切换多个 class。此外，v-bind:class 指令也可以与普通的 class attribute 共存。

```html
<div
  class="static"
  v-bind:class="{ active: isActive, 'text-danger': hasError }"
></div>

<script>
export default {
  data() {
    return {
      isActive: true,
      hasError: false
    }
  }
}
</script>
```

结果渲染为：
```html
<div class="static active"></div>
```
当 isActive 或者 hasError 变化时，class 列表将相应地更新。

绑定一个返回对象的计算属性。
```html
<div v-bind:class="classObject"></div>

<script>
export default {
  data() {
    return {
      isActive: true,
      hasError: false
    }
  },
  computed: {
    classObject: function () {
      return {
        active: this.isActive && !this.error,
        'text-danger': this.error && this.error.type === 'fatal'
      }
    }
  }
}
</script>
```

**数组语法**
`v-bind:class`上绑定一个数组。
```html
<div v-bind:class="[activeClass, errorClass]"></div>

<script>
export default {
  data() {
    return {
      activeClass: 'active',
      errorClass: 'text-danger'
    }
  }
}
</script>
```

### 绑定内联样式

**对象语法**
`v-bind:style` 的对象语法十分直观——看着非常像 CSS，但其实是一个 JavaScript 对象。CSS property 名可以用驼峰式 (camelCase) 或短横线分隔 (kebab-case，记得用引号括起来) 来命名。
```html
<div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
<script>
export default {
  data() {
    return {
      activeColor: 'red',
      fontSize: 30
    }
  }
}
</script>
```
直接绑定到对象上：
```html
<div v-bind:style="styleObject"></div>
<script>
export default {
  data() {
    return {
      styleObject: {
        activeColor: 'red',
        fontSize: 30
      }
    }
  }
}
</script>
```

绑定多个样式对象：
```html
<div v-bind:style="[baseStyles, overridingStyles]"></div>
```

## 6、条件渲染

### `v-if`
`v-if` 指令用于条件性地渲染一块内容。这块内容只会在指令的表达式返回 `truthy` 值的时候被渲染。
```html
<h1 v-if="awesome">Vue is awesome!</h1>
```
也可以用 `v-else` 添加一个“else 块”：
```html
<h1 v-if="awesome">Vue is awesome!</h1>
<h1 v-else>Oh no</h1>
```
`v-else` 元素必须紧跟在带 `v-if` 或者 `v-else-if` 的元素的后面，否则它将不会被识别。

**`v-else-if`**
`v-else-if`，顾名思义，充当 `v-if` 的“`else-if` 块”，可以连续使用。
```html
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Not A/B/C
</div>
```

类似于 `v-else`，`v-else-if` 也必须紧跟在带 `v-if` 或者`v-else-if` 的元素之后。


**用`key`管理可复用的元素**

Vue 会尽可能高效地渲染元素，通常会复用已有元素而不是从头开始渲染。
```html
<template v-if="loginType === 'username'">
  <label>Username</label>
  <input placeholder="Enter your username">
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Enter your email address">
</template>
```
那么在上面的代码中切换 `loginType` 将不会清除用户已经输入的内容。因为两个模板使用了相同的元素，\<input> 不会被替换掉——仅仅是替换了它的 `placeholder`。

这样也不总是符合实际需求，所以 `Vue` 为你提供了一种方式来表达“这两个元素是完全独立的，不要复用它们”。只需添加一个具有唯一值的 `key`属性即可。
```html
<template v-if="loginType === 'username'">
  <label>Username</label>
  <input placeholder="Enter your username" key="username-input">
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Enter your email address" key="email-input">
</template>
```
注意，\<label> 元素仍然会被高效地复用，因为它们没有添加 key 属性。

### `v-show`
另一个用于根据条件展示元素的选项是 v-show 指令。用法大致一样：
```html
<h1 v-show="ok">Hello!</h1>
```
不同的是带有 `v-show` 的元素始终会被渲染并保留在 `DOM`中。`v-show` 只是简单地切换元素的 CSS property display。

> 注意，v-show 不支持 \<template> 元素，也不支持 v-else。

### `v-if` vs `v-show`

`v-if` 是“真正”的条件渲染，因为它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建。

`v-if` 也是惰性的：如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块,此时`dom`树上才会出现对应的元素。

相比之下，`v-show` 就简单得多——不管初始条件是什么，元素总是会被渲染（`dom`树上一直都有，只不过元素的`display`值在`false`的情况下为`none`），并且只是简单地基于 CSS 进行切换。

一般来说，`v-if` 有更高的切换开销，而 `v-show` 有更高的初始渲染开销。因此，如果需要非常频繁地切换，则使用 `v-show` 较好；如果在运行时条件很少改变，则使用 `v-if` 较好。


### `v-if`与`v-for`
> 不推荐同时使用 `v-if` 和 `v-for`

当 `v-if` 与` v-for `一起使用时，`v-for `具有比 `v-if `更高的优先级




## 7、列表渲染

### 用`v-for`将数组渲染为一组元素。
> v-for 指令需要使用 item in items 形式的特殊语法，其中 items 是源数据数组，而 item 则是被迭代的数组元素的别名。

```html
<ul id="example-1">
  <li v-for="item in items" :key="item.message">
    {{ item.message }}
  </li>
</ul>
<script>
export default {
  data() {
    return {
      items: [
        { message: 'Foo' },
        { message: 'Bar' }
      ]
    }
  }
}
</script>
```

在 `v-for` 块中，我们可以访问所有父作用域的 property。`v-for` 还支持一个可选的第二个参数，即当前项的索引。
```html
<ul id="example-1">
  <li v-for="(item, index) in items" :key="index">
    {{ item.message }}
  </li>
</ul>
<script>
```


也可以用 `of` 替代 `in` 作为分隔符.
```html
<ul id="example-1">
  <li v-for="item of items" :key="item.message">
    {{ item.message }}
  </li>
</ul>
<script>
```

**`key`**

在上面的几个片段中，可以标签都有一个key属性。
`key`主要用于vue的虚拟DOM算法，在新旧 nodes 对比时辨识 VNodes。如果不使用 `key`，Vue 会使用一种最大限度减少动态元素并且尽可能的尝试就地修改/复用相同类型元素的算法。而使用 `key` 时，它会基于 `key` 的变化重新排列元素顺序，并且会移除 `key` 不存在的元素。

有相同父元素的子元素必须有独特的 `key`。重复的 `key` 会造成渲染错误。

`key`也可以用于强制替换元素/组件而不是重复使用它.
当你遇到如下场景时它可能会很有用：
- 完整地触发组件的生命周期钩子
- 触发过渡

```html
<transition>
  <span :key="text">{{ text }}</span>
</transition>
```
当 `text` 发生改变时，\<span> 总是会被替换而不是被修改，因此会触发过渡。

### 在`v-for`中使用对象

```html
<ul id="example-1">
  <li v-for="item in object">
    {{ item }}
  </li>
</ul>
<script>
export default {
  data() {
    return {
      object: {
        title: 'How to do lists in Vue',
        author: 'Jane Doe',
        publishedAt: '2016-04-10'
      }
    }
  }
}
</script>
```
第二个的参数为 property 名称 (也就是键名).

```html
<ul id="example-1">
  <li v-for="(item, value) in object">
    {{ item }} - {{value}}
  </li>
</ul>
<script>
export default {
  data() {
    return {
      object: {
        title: 'How to do lists in Vue',
        author: 'Jane Doe',
        publishedAt: '2016-04-10'
      }
    }
  }
}
</script>
```

第三个参数为索引：
```html
<ul id="example-1">
  <li v-for="(item, value, index) in object">
    {{ item }} - {{value}} - {{index}}
  </li>
</ul>
<script>
export default {
  data() {
    return {
      object: {
        title: 'How to do lists in Vue',
        author: 'Jane Doe',
        publishedAt: '2016-04-10'
      }
    }
  }
}
</script>
```

### 维护状态

当 Vue 正在更新使用 `v-for` 渲染的元素列表时，它默认使用“就地更新”的策略。如果数据项的顺序被改变，Vue 将不会移动 DOM 元素来匹配数据项的顺序，而是就地更新每个元素，并且确保它们在每个索引位置正确渲染。这个类似 `Vue 1.x` 的 `track-by="$index`"。

这个默认的模式是高效的，但是只适用于不依赖子组件状态或临时 DOM 状态 (例如：表单输入值) 的列表渲染输出。

为了给 Vue 一个提示，以便它能跟踪每个节点的身份，从而重用和重新排序现有元素，你需要为每项提供一个唯一 `key`属性。

### 数组更新检测

**变更方法**

Vue 将被侦听的数组的变更方法进行了包裹，所以它们也将会触发视图更新。这些被包裹过的方法包括：
- push
- pop
- shift
- unshift
- splice
- sort
- reverse

**替换数组**
变更方法，顾名思义，会变更调用了这些方法的原始数组。相比之下，也有非变更方法，例如 filter()、concat() 和 slice()。它们不会变更原始数组，而总是返回一个新数组。当使用非变更方法时，可以用新数组替换旧数组：
```js
example1.items = example1.items.filter(function (item) {
  return item.message.match(/Foo/)
})
```

你可能认为这将导致 Vue 丢弃现有 DOM 并重新渲染整个列表。幸运的是，事实并非如此。Vue 为了使得 DOM 元素得到最大范围的重用而实现了一些智能的启发式方法，所以用一个含有相同元素的数组去替换原来的数组是非常高效的操作。

**注意事项**

由于 JavaScript 的限制，Vue 不能检测数组和对象的变化。

### 显示过滤 / 排序后的结果

当我们需要过滤数据后才进行展示，可以使用一下方式：
1. 计算属性
```html
<li v-for="n in evenNumbers">{{ n }}</li>
<script>
export default {
  data() {
    return {
      numbers: [1, 2, 3, 4, 5]
    }
  },
  computed: {
    evenNumbers: function() {
      return this.numbers.filter(function (number) {
        return number % 2 === 0
      })
    }
  }
}
</script>
```
2. 嵌套`v-for`
```html
<ul v-for="set in sets">
  <li v-for="n in even(set)">{{ n }}</li>
</ul>
<script>
export default {
  data() {
    return {
      numbers: [[ 1, 2, 3, 4, 5 ], [6, 7, 8, 9, 10]]
    }
  },
  computed: {
    even: function(numbers) {
      return numbers.filter(function (number) {
        return number % 2 === 0
      })
    }
  }
}
</script>
```

### `v-for`使用值

`v-for` 也可以接受整数。在这种情况下，它会把模板重复对应次数。
```html
<div>
  <span v-for="n in 10">{{ n }} </span>
</div>
```

### 在\<template>中使用`v-for`
利用带有 `v-for`的 \<template> 来循环渲染一段包含多个元素的内容。

```html
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider" role="presentation"></li>
  </template>
</ul>
```

### 在组件上使用`v-for`

在自定义组件上，你可以像在任何普通元素上一样使用 `v-for`。
```html
<my-component v-for="item in items" :key="item.id"></my-component>
```

然而，任何数据都不会被自动传递到组件里，因为组件有自己独立的作用域。为了把迭代数据传递到组件里，我们要使用 `prop`：

```html
<myComponent v-for="item in items" :key="item.id" :title="item.message"></myComponent>

<script>
export default {
  components:{myComponent},
  data() {
    return {
      items: [
        { message: 'Foo' },
        { message: 'Bar' }
      ]
    }
  }
}
</script>
```

myComponent.vue
```html
<template>
  <div>
    <button>{{title}}</button>
  </div>
</template>

<script>
export default {
  props: ['title']
}
</script>
```

## 8、事件处理

### 事件监听

`v-on`指令监听DOM事件，可以用`@`简写，可以使用以下几个方式：



1. 直接运行js代码
```html
<div @click="a +='a'">
  add a {{a}}
</div>
<script>
export default {
  data() {
    return {
      a: "a"
    }
  }
}
</script>
```

2. 传入方法名，绑定一个方法
```html
<div @click="addA">
  add a {{a}}
</div>
<script>
export default {
  data() {
    return {
      a: "a"
    }
  },
  methods: {
    addA() {
      this.a += 'a'
    }
  }
}
</script>
```

3. 内联js语句调用方法
```html
<div @click="addVal('a')">
  add a {{a}}
</div>
<script>
export default {
  data() {
    return {
      a: "a"
    }
  },
  methods: {
    addA(val) {
      this.a += val;
    }
  }
}
</script>
```

4. 访问原始DOM事件

用特殊变量`$event`将其传入方法中。

```html
<div @click="addVal('a', $event)">
  add a {{a}}
</div>
<script>
export default {
  data() {
    return {
      a: "a"
    }
  },
  methods: {
    addA(val, event) {
      if(event) {
        event.preventDefault();
      }
      this.a += val;
    }
  }
}
</script>
```

### 事件修饰符
`v-on` 提供了事件修饰符。修饰符是由点开头的指令后缀来表示的。Vue提供了事件绑定的语法糖，我们在标签中可直接使用形如`v-on:click`，`@click`，`@focus`的形式绑定事件监听器，并且可以使用修饰符对事件进行`option`设置。

- `.stop` 阻止事件继续传播
- `.prevent` 阻止标签默认行为
- `.capture` 使用事件捕获模式,即元素自身触发的事件先在此处处理，然后才交由内部元素进行处理
- `.self` 只当在 event.target 是当前元素自身时触发处理函数
- `.once` 事件将只会触发一次
- `.passive` 告诉浏览器你不想阻止事件的默认行为

```html
<!-- 阻止单击事件继续传播 -->
<a v-on:click.stop="doThis"></a>

<!-- 提交事件不再重载页面 -->
<form v-on:submit.prevent="onSubmit"></form>

<!-- 修饰符可以串联 -->
<a v-on:click.stop.prevent="doThat"></a>

<!-- 只有修饰符 -->
<form v-on:submit.prevent></form>

<!-- 添加事件监听器时使用事件捕获模式 -->
<!-- 即内部元素触发的事件先在此处理，然后才交由内部元素进行处理 -->
<div v-on:click.capture="doThis">...</div>

<!-- 只当在 event.target 是当前元素自身时触发处理函数 -->
<!-- 即事件不是从内部元素触发的 -->
<div v-on:click.self="doThat">...</div>

<!-- 点击事件将只会触发一次 -->
<a v-on:click.once="doThis"></a>

<!-- 滚动事件的默认行为 (即滚动行为) 将会立即触发 -->
<!-- 而不会等待 `onScroll` 完成  -->
<!-- 这其中包含 `event.preventDefault()` 的情况 -->
<div v-on:scroll.passive="onScroll">...</div>
```

### 按键修饰符

在监听键盘事件时，我们经常需要检查详细的按键。Vue 允许为 v-on 在监听键盘事件时添加按键修饰符：
```html
<!-- 只有在 `key` 是 `Enter` 时调用 `vm.submit()` -->
<input v-on:keyup.enter="submit">
```
你可以直接将 `KeyboardEvent.key` 暴露的任意有效按键名转换为 `kebab-case` 来作为修饰符。

```html
<input v-on:keyup.page-down="onPageDown">
```


Vue 提供了绝大多数常用的按键码的别名：

- `.enter`
- `.tab`
- `.delete` (捕获“删除”和“退格”键)
- `.esc`
- `.space`
- `.up`
- `.down`
- `.left`
- `.right`

### 系统修饰键
可以用如下修饰符来实现仅在按下相应按键时才触发鼠标或键盘事件的监听器。

- `.ctrl`
- `.alt`
- `.shift`
- `.meta`

```html
<!-- Alt + C -->
<input v-on:keyup.alt.67="clear">

<!-- Ctrl + Click -->
<div v-on:click.ctrl="doSomething">Do something</div>
```

### `.exact` 修饰符

`.exact` 修饰符允许你控制由精确的系统修饰符组合触发的事件。
```html
<!-- 即使 Alt 或 Shift 被一同按下时也会触发 -->
<button v-on:click.ctrl="onClick">A</button>

<!-- 有且只有 Ctrl 被按下的时候才触发 -->
<button v-on:click.ctrl.exact="onCtrlClick">A</button>

<!-- 没有任何系统修饰符被按下的时候才触发 -->
<button v-on:click.exact="onClick">A</button>
```

### 鼠标按钮修饰符

- `.left`
- `.right`
- `.middle`

这些修饰符会限制处理函数仅响应特定的鼠标按钮。