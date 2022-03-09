# 从vue源码上告诉你computed和watch的工作原理

我们都知道Vue中有`computed`和`watch`两个`api`,

- `computed`： 是计算属性，依赖其它属性值，并且 `computed` 的值有缓存，只有它依赖的属性值发生改变，下一次获取 `computed` 的值时才会重新计算 `computed` 的值；

- `watch`： 更多的是「观察」的作用，类似于某些数据的监听回调 ，每当监听的数据变化时都会执行回调进行后续操作。

以下是个简单例子

```js
data: {
  num: 1,
  question: '',
  answer: '',
},
computed: {
  // 计算属性的 getter
  getDouble: function () {
    return this.num * 2;
  }
},
watch: {
  question: function(new, old) {
    this.answer = 'searching ...';
    this.getAnswer();
  }
},
methods: {
  getAnswer() {
    const _  = this;
    axios.get('').then(res => { _.answer = res }).catch(err => { _.answer = "error"})    
  }
}
```

通过上面的例子，我们可以发现 `watch` 选项允许我们执行异步操作 (访问一个 `API`)，限制我们执行该操作的频率，并在我们得到最终结果前，设置中间状态。这些都是计算属性无法做到的。


**总结**

相同： `computed`和`watch`都起到监听/依赖一个数据，并进行处理的作用

异同：它们其实都是`vue`对监听器的实现，只不过`computed`主要用于对同步数据的处理，`watch`则主要用于观测某个值的变化去完成一段开销较大的复杂业务逻辑。能用`computed`的时候优先用`computed`，避免了多个数据影响其中某个数据时多次调用`watch`的尴尬情况。


## `computed`

我们知道`new Vue()`的时候会调用_init方法，该方法会初始化生命周期，初始化事件，初始化`render`，初始化`data`，`computed`，`methods`，`wacther`等等。

