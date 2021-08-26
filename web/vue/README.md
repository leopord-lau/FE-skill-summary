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
