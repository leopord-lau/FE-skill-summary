# immer 源码阅读

## 前言
`JS` 里面的变量类型可以大致分为基本类型和引用类型。在使用过程中，引用类型经常会产生一些无法意识到的副作用，所以在现代 `JS` 开发过程中，有经验的开发者都会在特定位置有意识的写下断开引用的不可变数据类型。

`immer`想解决的问题，是利用元编程简化 Immutable 使用的复杂度。举个例子，我们写一个纯函数：
```js
const addProducts = products => {
  const cloneProducts = products.slice()
  cloneProducts.push({ text: "shoes" })
  return cloneProducts
}
```
如果我们想添加一个`item`，就需要将`products`先拷贝一份，然后调用`push`方法添加一个`item`后再返回。

在简单的需求中，我们可以通过深拷贝来处理一些副作用。
```js
// 一个简单的深拷贝函数，只做了简单的判断
// 用户态这里输入的 obj 一定是一个 Plain Object，并且所有 value 也是 Plain Object
function deepClone(obj) {
  const keys = Object.keys(obj)
  return keys.reduce((memo, current) => {
    const value = obj[current]
    if (typeof value === 'object') {
      // 如果当前结果是一个对象，那我们就继续递归这个结果
      return {
        ...memo,
        [current]: deepClone(value),
      }
    }
    return {
      ...memo,
      [current]: value,
    }
  }, {})
}
```

但是，在真正的生产工作中，我们可能要考虑更多的因素
- `key` 里面 `getter`，`setter` 以及原型链上的内容如何处理？
- `value` 是一个 Symbol 如何处理？
- `value` 是其他非 `Plain Object` 如何处理？
- `value` 内部出现了一些循环引用如何处理？

因为有太多不确定因素，所以在真正的工程实践中，还是推荐大家使用大型开源项目里面的工具函数。

## 概念
更简单，更快速的创建不可变数据类型。

- `currentState` 被操作对象的最初状态
- `draftState` 根据 `currentState` 生成的草稿状态，它是 `currentState` 的代理，对 `draftState` 所做的任何修改都将被记录并用于生成 `nextState` 。在此过程中，`currentState` 将不受影响
- `nextState` 根据 `draftState` 生成的最终状态
- `produce` 用来生成 `nextState` 或 `producer` 的函数
- `producer` 通过 `produce` 生成，用来生产 `nextState` ，每次执行相同的操作
- `recipe` 用来操作 `draftState` 的函数

基础语法：
`produce(currentState, recipe: (draftState) => void | draftState, ?PatchListener): nextState`


```js
const produce = require('immer')

const state = {
  done: false,
  val: 'string',
}

// 所有具有副作用的操作，都可以放入 produce 函数的第二个参数内进行
// 最终返回的结果并不影响原来的数据
const newState = produce(state, (draft) => {
  draft.done = true
})

console.log(state.done)    // false
console.log(newState.done) // true
```

## 原理解析

`Immer` 源码中，使用了一个 `ES6` 的新特性 `Proxy` 对象。`Proxy` 对象允许拦截某些操作并实现自定义行为，但大多数 `JS` 同学在日常业务中可能并不经常使用这种元编程模式，所以这里简单且快速的介绍一下它的使用。

**`Proxy`**
`Proxy` 对象接受两个参数，第一个参数是需要操作的对象，第二个参数是设置对应拦截的属性，这里的属性同样也支持 `get`，`set` 等等，也就是劫持了对应元素的读和写，能够在其中进行一些操作，最终返回一个 `Proxy` 对象实例。
```js
const proxy = new Proxy({}, {
  get(target, key) {
    // 这里的 target 就是 Proxy 的第一个参数对象
    console.log('proxy get key', key)
  },
  set(target, key, value) {
    console.log('value', value)
  }
})

// 所有读取操作都被转发到了 get 方法内部
proxy.info     // 'proxy get key info'

// 所有设置操作都被转发到了 set 方法内部
proxy.info = 1 // 'value 1'
```
上面这个例子中传入的第一个参数是一个空对象，当然我们可以用其他已有内容的对象代替它，也就是函数参数中的 `target`。


在`immer`中，使用`proxy`维护一份 `state` 在内部，劫持所有操作，内部来判断是否有变化从而最终决定如何返回。

```js
produce(obj, draft => {
  draft.count++
})
```

`produce` 方法就包括了整个 `currentState` -> `draftState` -> `nextState`过程。

`draft` 是 `obj` 的代理，对 `draft` `mutable` 的修改都会流入到自定义 `setter` 函数，它并不修改原始对象的值，而是递归父级不断浅拷贝，最终返回新的顶层对象，作为 `produce` 函数的返回值。

src/core/immerClass.ts
```js
export class Immer implements ProducersFns {
  produce: (base, recipe, patchListener) => {
    ...
    // 创建代理
    const proxy = createProxy(this, base, undefined);
    ...
  }
}
```

`createProxy`方法考虑到多种情况，现在我们只介绍非`map`、`set`对象的Proxy方法。
```js
export function createProxy(immer, value, parent) {
  const draft = isMap(value)
		? getPlugin("MapSet").proxyMap_(value, parent)
		: isSet(value)
		? getPlugin("MapSet").proxySet_(value, parent)
		: immer.useProxies_
		? createProxyProxy(value, parent)
		: getPlugin("ES5").createES5Proxy_(value, parent)

    ...
}
```


src/core/proxy.ts  `createProxyProxy()`
第一步，也就是将 `obj` 转为 `draft` 这一步，为了提高 `Immutable` 运行效率，需要一些额外信息，因此将 `obj` 封装成一个包含额外信息的代理对象：
```js
{
  type_, // 数组还是对象
  scope_, // 追踪哪个produce触发的
  modified_, // 是否被修改过
  finalized_, // 是否已经完成（所有 setter 执行完，并且已经生成了 copy）
  assigned， // 标记哪些值是被新添加,修改的（true）和删除的（false）
  parent_, // 父级对象
  base_, // 原始对象（也就是 obj）
  draft_, // 代理
  copy_, // base（也就是 obj）的浅拷贝，使用 Object.assign(Object.create(null), obj) 实现
  revoke_, // 用来取消代理
  isManual_
}
```
在这个代理对象上，绑定了自定义的 `getter` `setter`，然后直接将其扔给 `produce` 执行。

```js
export function createProxyProxy(base, parent) {
  // 区别数组跟对象
  ...
  const {revoke, proxy} = Proxy.revocable(target, traps)
	state.draft_ = proxy
	state.revoke_ = revoke
	return proxy
}
```

根据数据是否是对象还是数组来生成对应的代理，以下是代理所拦截的操作
`objectTraps`
```js
export const objectTraps {
  get(state, prop){},
  has(state, prop){},
  ownKeys(state){},
  set(state, prop, value){},
  deleteProperty(state, prop){},
  getOwnPropertyDescriptor(state, prop){},
  defineProperty(){},
  getPrototypeOf(state){},
  setPrototypeOf(){}
}
```

重点关注`get`和`set`方法就行了，因为这是最常用的，搞明白这两个方法基本原理也搞明白`immer`的核心。

```js
get(state, prop) {
  // 暴露state
	if (prop === DRAFT_STATE) return state

  ...

  if (value === peek(state.base_, prop)) {
			// 复制
			prepareCopy(state)

			// 副本上的值进行代理
			return (state.copy_![prop as any] = createProxy(
				state.scope_.immer_,
				value,
				state
			))
		}
}
```

`getter` 主要用来懒初始化代理对象，也就是当代理对象子属性被访问的时候，才会生成其代理对象。

举个例子，下面是原始 `obj`：
```js
{
  a: {},
  b: {},
  c: {}
}
```

那么初始情况下，`draft` 是 `obj` 的代理，所以访问 `draft.a` `draft.b` `draft.c` 时，都能触发 `getter` `setter`，进入自定义处理逻辑。可是对 `draft.a.x` 就无法监听了，因为代理只能监听一层。

代理懒初始化就是要解决这个问题，当访问到 `draft.a` 时，自定义 `getter` 已经悄悄生成了新的针对 `draft.a` 对象的代理 `draftA`，因此 `draft.a.x` 相当于访问了 `draftA.x`，所以能递归监听一个对象的所有属性。

同时，如果代码中只访问了 `draft.a`，那么只会在内存生成 `draftA` 代理，`b` `c` 属性因为没有访问，因此不需要浪费资源生成代理 `draftB` `draftC`。

当然 `immer` 做了一些性能优化，以及在对象被修改过（`modified`）获取其 `copy` 对象，为了保证 `base` 是不可变的。



```js
set(state, prop, value) {
  ...
  if(!state.modified_) {
    ...
    prepareCopy(state)
    markChanged(state)
  }
  ...
  // 将值放在copy_属性下
	state.copy_![prop] = value
	// assigned_是一个map用于记录key是否已经被记录
	state.assigned_[prop] = true
}
```
 
如果第一次修改对象，直接会触发`markChanged`方法，把自身的`modified`标记为`true`，接着一直冒泡到根对象调用`markChanged`方法同时会对基础对象进行一次浅拷贝并赋值给`copy_`。

`set`方法总结：

当对 `draft` 修改时，会对 `base` 也就是原始值进行浅拷贝，保存到 `copy` 属性，同时将 `modified` 属性设置为 `true`。这样就完成了最重要的 `Immutable` 过程，而且浅拷贝并不是很消耗性能，加上是按需浅拷贝，因此 `Immer` 的性能还可以。
同时为了保证整条链路的对象都是新对象，会根据 `parent` 属性递归父级，不断浅拷贝，直到这个叶子结点到根结点整条链路对象都换新为止。
完成了 `modified` 对象再有属性被修改时，会将这个新值保存在 `copy` 对象上。

到这里完成了刚开始的`currentState` -> `draftState`的转换了，之后就是`draftState` -> `nextState`的转换。



src/core/finalize.ts `processResult`
```js
export function processResult(result, scope) {
  ...
  result = finalize(scope, result);
} 
```

当执行完 `produce` 后，用户的所有修改已经完成（所以 `immer` 没有支持异步），如果 `modified` 属性为 `false`，说明用户根本没有改这个对象，那直接返回原始 `base` 属性即可。

如果 `modified` 属性为 `true`，说明对象发生了修改，返回 `copy` 属性即可。但是 `setter` 过程是递归的，`draft` 的子对象也是 `draft`（包含了 `base` `copy` `modified` 等额外属性的代理），我们必须一层层递归，拿到真正的值。

所以在这个阶段，所有 `draft` 的 `finalized` 都是 `false`，`copy` 内部可能还存在大量 `draft` 属性，因此递归 `base` 与 `copy`的子属性，如果相同，就直接返回；如果不同，递归一次整个过程（从这小节第一行开始）。

最后返回的对象是由 `base` 的一些属性（没有修改的部分）和 `copy` 的一些属性（修改的部分）最终拼接而成的。最后使用 `freeze` 冻结 `copy` 属性，将 `finalized` 属性设置为 `true`。

至此，返回值生成完毕，我们将最终值保存在 `copy` 属性上，并将其冻结，返回了 `Immutable` 的值。