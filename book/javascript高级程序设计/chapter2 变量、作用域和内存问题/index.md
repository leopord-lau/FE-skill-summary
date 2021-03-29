## 2.变量、作用域和内存问题

### 2.1  基本类型和引用类型的值

基本类型： Undefined、Null、Boolean、Number、String，ES6新增了Symbol

引用类型值指可能由多个值构成的对象。引用类型的值是保存在内存中的对象。JavaScript不允许直接访问内存中的位置，也就是不能直接操作对象的内存空间。在操作对象的时候其实是在操作对象的引用。

#### 2.1.1 动态的属性
对于引用类型的值而言，可以为其添加属性和方法。
```javascript
var person = new Object();
person.name = "xiaoming";
alert(person.name);        // "xiaoming"
```
创建了一个对象并保存在person中，为对象添加了一个名为name的属性。如果对象不被销毁或者属性不被删除，则该属性会一直存在。

然而基本类型的值不能添加属性。
```javascript
var person = "person";
person.name = "xiaoming";
alert(person.name)               // undefined
```

#### 2.1.2 变量复制
基本类型值和引用类型值的复制存在不同。

```javascript
var num1 = 5;
var num2 = num1;
```
`num1`中保存数字5，当`num2`被初始化时也保存了5。`num1`和`num2`中的5都是独立的，`num2`中的5只是`num1`中的5的副本。

而引用类型值的复制虽然都是将值复制一份放到新变量分配的空间中，但是，由于复制的副本实际上只是一个`指针`，`指向存储在堆中的一个对象`，复制操作结束后，两个变量都`引用同一个变量`，改变其中一个变量，就会影响另一个变量。
```javascript
var obj1 = new Object();
var obj2 = obj1;
obj1.name = "xiaoming"
alert(obj2.name);          // xiaoming
obj2.name = "change"
alert(obj1.name)           // change
```
![对象地址引用](https://img-blog.csdnimg.cn/20210304205841905.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQyODgwNzE0,size_16,color_FFFFFF,t_70)

#### 2.1.3 参数传递

函数的参数都是按值传递（把函数外部的值复制给函数内部的参数），基本类型值的传递如同基本类型变量的复制一样，而引用类型值的传递也跟引用类型变量值的复制一样。

在向参数传递基本类型的值时，被传递的值会被复制给一个局部变量（即命名参数，或者用ECMAScript 的概念来说，就是 arguments 对象中的一个元素）。在向参数传递引用类型的值时，会把这个值在内存中的地址复制给一个局部变量，因此这个局部变量的变化会反映在函数的外部。

```javascript
function setName(obj) {
  obj.name = "xiaoming";
  obj = new Object();
  obj.name = "change";
}
var person = new Object();
setName(person);
alert(person.name);            // xiaoming
```
`setName`函数内部将一个新对象赋值给obj，并且改变了name的属性，但是外部并不受影响，因为在内部重写obj的时候变量引用的是一个局部的对象`Object`，这个局部对象会在函数执行完后被销毁。


#### 2.1.4 检测类型
 `typeof`用于检测基本数据类型。
 ```javascript
 alert(typeof 1)          // number
 alert(typeof "")         // string
 alert(typeof true)       // boolean
 alert(typeof {})         // object
 alert(typeof null)       // object
 alert(typeof undefined)  // undefined
 alert(typeof Symbol())   // symbol
 alert(typeof Symbol)     // function
 ```
 使用 typeof 操作符检测函数时，该操作符会返回"function"

`instanceof` 用于检测数据引用类型。
```javascript
alert([] instanceof Array)                // true
alert({} instanceof Object)               // true
alert(function() {} instanceof Function)  // true
alert([] instanceof Object)               // true
alert(function() {} instanceof Object)    // true
```
所有引用类型的值都是 Object 的实例。因此，在检测一个引用类型值和 Object 构造函数时，instanceof 操作符始终会返回 true。当然，如果使用 instanceof 操作符检测基本类型的值，则该操作符始终会返回 false，因为基本类型不是对象。

### 2.2  执行环境及作用域
执行环境定义了变量或函数有权访问的其他数据，决定了他们各自的行为。
每个执行环境都有一个与之关联的变量对象。环境中定义的所有变量和函数都保存在这个对象中。

全局执行环境是最外围的一个执行环境。在web浏览器中，window对象可视为全局执行环境。所有的全局变量和函数都是作为window对象的属性和方法创建的。
当某个执行环境的中代码执行完毕后环境就会被销毁，其内的所有的变量和函数也被销毁。

`每个函数都有自己的执行环境`。

当代码在环境中执行时，会创建变量对象的一个`作用域链`。作用域链的用途，是保证对执行环境有权访问的所有变量和函数的有序访问。作用域链中的下一个变量对象来自包含（外部）环境，而再下一个变量对象则来自下一个包含环境。这样，一直延续到全局执行环境；全局执行环境的变量对象始终都是作用域链中的最后一个对象。

```javascript
var color = "blue";
function changeColor() {
  if(color === 'blue') {
    color = 'red';
  } else {
    color = 'blue';
  }
}
changeColor();
alert(color);    // red
```
在`changeColor`函数的作用域链中包含了两个对象，一个是自身的变量的对象（定义了arguments对象）和全局环境的变量对象（`color`）。因此可以在函数内部访问变量color。


内部环境可以通过作用域链访问所有的外部环境，但是外部环境不能访问内部环境的任何变量和函数。
```javascript
var color = "blue";
function changeColor() {
  var inside = 'inside'
  if(color === 'blue') {
    color = 'red';
  } else {
    color = 'blue';
  }
}
changeColor();
alert(color);    // red
alert(inside);   // error inside is not defined
```

#### 2.3 垃圾回收

JavaScript具有自动垃圾回收机制。当变量没有被引用时就需要释放，垃圾收集器必须跟踪哪个变量有用哪个变量没用，对于不再有用的变量打上标记，以备将来收回其占用的内存。用于标识无用变量的策略可能会因实现而异，但具体到浏览器中的实现，则通常有两个策略。

##### 2.3.1 标记清除
最常用的垃圾回收方式。

当变量进入环境（例如在函数中声明一个变量），就标记为“进入环境”。当变量离开环境时，就可以标记为“离开环境”。
垃圾收集器在运行的时候会给存储在内存中的所有变量都加上标记（当然，可以使用任何标记方式）。然后，它会去掉环境中的变量以及被环境中的变量引用的变量的标记。而在此之后再被加上标记的变量将被视为准备删除的变量，原因是环境中的变量已经无法访问到这些变量了。最后，垃圾收集器完成内存清除工作，销毁那些带标记的值并回收它们所占用的内存空间。

##### 2.3.2 引用计数

另一种不太常见的垃圾收集策略叫做引用计数。引用计数的含义是跟踪记录每个值被引用的次数。当声明了一个变量并将一个引用类型值赋给该变量时，则这个值的引用次数就是 1。如果同一个值又被赋给另一个变量，则该值的引用次数加 1。相反，如果包含对这个值引用的变量又取得了另外一个值，则这个值的引用次数减 1。当这个值的引用次数变成 0 时，则说明没有办法再访问这个值了，因而就可以将其占用的内存空间回收回来。这样，当垃圾收集器下次再运行时，它就会释放那些引用次数为零的值所占用的内存。
