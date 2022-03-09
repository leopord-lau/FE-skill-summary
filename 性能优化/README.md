# 性能优化

## 打包优化

### 图片压缩
将图片的大小进行压缩。
[tinyPNG](https://tinypng.com/)
[改图鸭](https://www.gaituya.com/)


### webpack

#### loader

#### dll

#### happypack

#### 代码压缩

#### tree shaking

前端中的`tree-shaking`可以理解为通过工具"摇"我们的`JS`文件，将其中用不到的代码"摇"掉，是一个性能优化的范畴。具体来说，在 `webpack` 项目中，有一个入口文件，相当于一棵树的主干，入口文件有很多依赖的模块，相当于树枝。实际情况中，虽然依赖了某个模块，但其实只使用其中的某些功能。通过 `tree-shaking`，将没有使用的模块摇掉，这样来达到删除无用代码的目的。

**uglify**
`uglify`目前不会跨文件去做`DCE`

**原理**

利用`AST`做死区分析

`Tree-shaking`的本质是消除无用的js代码。无用代码消除在广泛存在于传统的编程语言编译器中，编译器可以判断出某些代码根本不影响输出，然后消除这些代码，这个称之为`DCE`（`dead code elimination`）。

`Tree-shaking` 是 `DCE` 的一种新的实现，`Javascript`同传统的编程语言不同的是，`javascript`绝大多数情况需要通过网络进行加载，然后执行，加载的文件大小越小，整体执行时间更短，所以去除无用代码以减少文件体积，对`javascript`来说更有意义。`Tree-shaking` 和传统的 `DCE`的方法又不太一样，传统的`DCE` 消灭不可能执行的代码，而`Tree-shaking`更关注宇消除没有用到的代码。


`tree-shaking`的消除原理是依赖于`ES6`的模块特性。

`ES6 module` 特点：

- 只能作为模块顶层的语句出现
- `import` 的模块名只能是字符串常量
- `import binding` 是 `immutable`的

ES6模块依赖关系是确定的，和运行时的状态无关，可以进行可靠的静态分析，这就是`tree-shaking`的基础。

- `rollup`只处理函数和顶层的`import/export`变量，不能把没用到的类的方法消除掉
- `javascript`动态语言的特性使得静态分析比较困难
- 下部分的代码就是副作用的一个例子，如果静态分析的时候删除里`run`或者`jump`，程序运行时就可能报错，那就本末倒置了，我们的目的是优化，肯定不能影响执行

```js
import Menu from './menu.js'

// .. 下面代码并没有使用Menu
```

```js
function Menu() {
}

Menu.prototype.show = function() {
}

var a = 'Arr' + 'ay'
var b
if(a == 'Array') {
    b = Array
} else {
    b = Menu
}

b.prototype.unique = function() {
    // 将 array 中的重复元素去除
}

export default Menu;
```

`webpack`目前使用`terser`替代`uglify`，可以将上述的情况也`shake`掉

#### scope hoisting

#### code splitting

### 图片 base64

## 网络优化

### DNS

### CDN

### 缓存

### preload / prefetch / 懒加载

### SSR

## 代码优化

### 骨架屏


### web worker


### 虚拟列表


### 懒加载


### dom / style 批量更新