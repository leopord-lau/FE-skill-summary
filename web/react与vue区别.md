# react与vue的区别

`React` 的思路是 `HTML in JavaScript` 也可以说是 `All in JavaScript`，通过 `JavaScript` 来生成 `HTML`，所以设计了 `JSX` 语法，还有通过 `JS` 来操作 `CSS`，社区的`styled-component`、`JSS`等。

`Vue` 是把 `HTML`，`CSS`，`JavaScript` 组合到一起，用各自的处理方式，`Vue` 有单文件组件，可以把 `HTML`、`CSS`、`JS` 写到一个文件中，`HTML` 提供了模板引擎来处理。

## 1. 监听数据变化的实现原理不同

`Vue`通过 `getter/setter`以及一些函数的劫持，能精确知道数据变化。

`React`默认是通过比较引用的方式（`diff`）进行的，如果不优化可能导致大量不必要的`VDOM`的重新渲染。为什么`React`不精确监听数据变化呢？这是因为`Vue`和`React`设计理念上的区别，`Vue`使用的是可变数据，而React更强调数据的不可变，两者没有好坏之分，Vue更加简单，而React构建大型应用的时候更加鲁棒。

## 2. 数据流的不同

`vue`是双向绑定。所谓双向绑定，指的是vue实例中的data与其渲染的DOM元素的内容保持一致，无论谁被改变，另一方会相应的更新为相同的数据。这是通过设置属性访问器实现的。

`react`是单向数据流,`react`中通过将`state`（`Model`层）与`View`层数据进行双向绑定达数据的实时更新变化，具体来说就是在`View`层直接写`JS`代码`Model`层中的数据拿过来渲染，一旦像表单操作、触发事件、ajax请求等触发数据变化，则进行双同步

React 整体是函数式的思想，在 React 中是单向数据流，推崇结合 immutable 来实现数据不可变。而 Vue 的思想是响应式的，也就是基于是数据可变的，通过对每一个属性建立 Watcher 来监听，当属性变化的时候，响应式的更新对应的虚拟 DOM。

如上，所以 React 的性能优化需要手动去做，而Vue的性能优化是自动的，但是Vue的响应式机制也有问题，就是当 state 特别多的时候，Watcher 会很多，会导致卡顿。

## 生命周期

`react:`
- contructor: 创建组件
- componentWillMount: 组件挂载之前
- componentDidMount: 组件挂载之后
- componentWillReceiveProps: 父组件发生render的时候子组件调用该函数
- shouldComponentUpdate: 组件挂载之后每次调用setState后都会调用该函数判断是否需要重新渲染组件，默认返回true
- componentDidUpdate: 更新
- render 渲染
- componentWillUnmount: 组件被卸载时候用


`vue:`
- beforeCreate: 组件创建前
- created: 组件创建好
- beforeMount: 组件挂载前
- mounted: 挂载好
- beforeUpdate: data更新前
- updated: data更新
- beforeDestory： 组件卸载前
- destoryed: 卸载