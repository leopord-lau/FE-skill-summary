# `Typescript`

`TypeScript` 是一种由微软开发的自由和开源的编程语言。它是 `JavaScript` 的一个超集，而且本质上向这个语言添加了可选的静态类型和基于类的面向对象编程。

与`JavaScript`的区别：
| typescript | javascript |
|--|--|
|JavaScript 的超集用于解决大型项目的代码复杂性 |	一种脚本语言，用于创建动态网页 |
|可以在编译期间发现并纠正错误 |	作为一种解释型语言，只能在运行时发现错误 |
|强类型，支持静态和动态类型 |	弱类型，没有静态类型选项 |
| 最终被编译成 JavaScript 代码，使浏览器可以理解 |	可以直接在浏览器中使用 |
|支持模块、泛型和接口 |	不支持模块，泛型或接口 |
|社区的支持仍在增长，而且还不是很大 |	大量的社区支持以及大量文档和解决问题的支持 |

**安装**
```shell
npm i -g typescript
```

## 基础类型

### 1、Boolean
```ts
let bool: boolean = true;
// ES5：var bool = true;
```

### 2、Number
```ts
let num: number = 1;
// ES5：var num = 1;
```
### 3、String
```ts
let name: string = "leo";
// ES5：var name = 'leo';
```
### 4、Symbol
```ts
const sym = Symbol();
let obj = {
  [sym]: "leo",
};
console.log(obj[sym]); // leo 
```
### 5、Array
```ts
let list: number[] = [1, 2, 3];
// ES5：var list = [1,2,3];

let list: Array<number> = [1, 2, 3]; // Array<number>泛型语法
// ES5：var list = [1,2,3];
```

### 6、Enum
使用枚举我们可以定义一些带名字的常量。 使用枚举可以清晰地表达意图或创建一组有区别的用例。 `TypeScript` 支持数字的和基于字符串的枚举。

**数字枚举**
```ts
enum Direction {
  NORTH,
  SOUTH,
  EAST,
  WEST,
}

let dir: Direction = Direction.NORTH;
```

默认情况下，NORTH 的初始值为 0，其余的成员会从 1 开始自动增长。换句话说，`Direction.SOUTH` 的值为 1，`Direction.EAST` 的值为 2，`Direction.WEST` 的值为 3。

以上的枚举示例经编译后，对应的 ES5 代码如下：
```js
"use strict";
var Direction;
(function (Direction) {
  Direction[(Direction["NORTH"] = 0)] = "NORTH";
  Direction[(Direction["SOUTH"] = 1)] = "SOUTH";
  Direction[(Direction["EAST"] = 2)] = "EAST";
  Direction[(Direction["WEST"] = 3)] = "WEST";
})(Direction || (Direction = {}));
var dir = Direction.NORTH;
```

当然我们也可以设置 `NORTH` 的初始值，比如：
```ts
enum Direction {
  NORTH = 3,
  SOUTH,
  EAST,
  WEST,
}
```
那么`Direction.SOUTH` 的值为 4，`Direction.EAST` 的值为 5，`Direction.WEST` 的值为 6。

**字符串美枚举**
在 `TypeScript 2.4` 版本，允许我们使用字符串枚举。在一个字符串枚举里，每个成员都必须用字符串字面量，或另外一个字符串枚举成员进行初始化。
```ts
enum Direction {
  NORTH = "NORTH",
  SOUTH = "SOUTH",
  EAST = "EAST",
  WEST = "WEST",
}
```
以上代码对应的 ES5 代码如下：
```js
"use strict";
var Direction;
(function (Direction) {
    Direction["NORTH"] = "NORTH";
    Direction["SOUTH"] = "SOUTH";
    Direction["EAST"] = "EAST";
    Direction["WEST"] = "WEST";
})(Direction || (Direction = {}));
```

通过观察数字枚举和字符串枚举的编译结果，我们可以知道数字枚举除了支持 从成员名称到成员值 的普通映射之外，它还支持 从成员值到成员名称 的反向映射：

```ts
enum Direction {
  NORTH,
  SOUTH,
  EAST,
  WEST,
}

let dirName = Direction[0]; // NORTH
let dirVal = Direction["NORTH"]; // 0
```

**常量枚举**
除了数字枚举和字符串枚举之外，还有一种特殊的枚举 —— 常量枚举。它是使用 `const` 关键字修饰的枚举，常量枚举会使用内联语法，不会为枚举类型编译生成任何 `JavaScript`。为了更好地理解这句话，我们来看一个具体的例子：
```ts
const enum Direction {
  NORTH,
  SOUTH,
  EAST,
  WEST,
}

let dir: Direction = Direction.NORTH;
```

以上代码对应的 ES5 代码如下：
```js
"use strict";
var dir = 0 /* NORTH */;
```

**异构枚举**

异构枚举的成员值是数字和字符串的混合：
```ts
enum Enum {
  A,
  B,
  C = "C",
  D = "D",
  E = 8,
  F,
}
```
以上代码对于的 ES5 代码如下：
```js
"use strict";
var Enum;
(function (Enum) {
    Enum[Enum["A"] = 0] = "A";
    Enum[Enum["B"] = 1] = "B";
    Enum["C"] = "C";
    Enum["D"] = "D";
    Enum[Enum["E"] = 8] = "E";
    Enum[Enum["F"] = 9] = "F";
})(Enum || (Enum = {}));
```
通过观察上述生成的 ES5 代码，我们可以发现数字枚举相对字符串枚举多了 “反向映射”：
```js
console.log(Enum.A) //输出：0
console.log(Enum[0]) // 输出：A
```

### 7、Any
在 `TypeScript` 中，任何类型都可以被归为 `any` 类型。这让 `any`类型成为了类型系统的顶级类型（也被称作全局超级类型）。
```ts
let notSure: any = 666;
notSure = "leo";
notSure = false;
```
`any` 类型本质上是类型系统的一个逃逸舱。作为开发者，这给了我们很大的自由：`TypeScript` 允许我们对 `any` 类型的值执行任何操作，而无需事先执行任何形式的检查。比如：
```ts
let value: any;

value.foo.bar; // OK
value.trim(); // OK
value(); // OK
new value(); // OK
value[0][1]; // OK
```
在许多场景下，这太宽松了。使用 `any` 类型，可以很容易地编写类型正确但在运行时有问题的代码。如果我们使用 `any` 类型，就无法使用 `TypeScript` 提供的大量的保护机制。为了解决 `any` 带来的问题，`TypeScript 3.0` 引入了 `unknown` 类型。


### 8、Unknown

就像所有类型都可以赋值给 `any`，所有类型也都可以赋值给 `unknown`。这使得 `unknown` 成为 `TypeScript` 类型系统的另一种顶级类型（另一种是 `any`）。下面我们来看一下 `unknown` 类型的使用示例：
```ts
let value: unknown;

value = true; // OK
value = 42; // OK
value = "Hello World"; // OK
value = []; // OK
value = {}; // OK
value = Math.random; // OK
value = null; // OK
value = undefined; // OK
value = new TypeError(); // OK
value = Symbol("type"); // OK
```
对 `value` 变量的所有赋值都被认为是类型正确的。但是，当我们尝试将类型为 `unknown` 的值赋值给其他类型的变量时会发生什么？
```ts
let value: unknown;

let value1: unknown = value; // OK
let value2: any = value; // OK
let value3: boolean = value; // Error
let value4: number = value; // Error
let value5: string = value; // Error
let value6: object = value; // Error
let value7: any[] = value; // Error
let value8: Function = value; // Error
```
`unknown` 类型只能被赋值给 `any` 类型和 `unknown` 类型本身。直观地说，这是有道理的：只有能够保存任意类型值的容器才能保存 `unknown` 类型的值。毕竟我们不知道变量 `value` 中存储了什么类型的值。

现在让我们看看当我们尝试对类型为 `unknown` 的值执行操作时会发生什么。以下是我们在之前 `any` 章节看过的相同操作：
```ts
let value: unknown;

value.foo.bar; // Error
value.trim(); // Error
value(); // Error
new value(); // Error
value[0][1]; // Error
```
将 `value` 变量类型设置为 `unknown` 后，这些操作都不再被认为是类型正确的。通过将 `any` 类型改变为 `unknown` 类型，我们已将允许所有更改的默认设置，更改为禁止任何更改。


### 9、Tuple
众所周知，数组一般由同种类型的值组成，但有时我们需要在单个变量中存储不同类型的值，这时候我们就可以使用元组。在 `JavaScript` 中是没有元组的，元组是 `TypeScript` 中特有的类型，其工作方式类似于数组。

元组可用于定义具有有限数量的未命名属性的类型。每个属性都有一个关联的类型。使用元组时，必须提供每个属性的值。为了更直观地理解元组的概念，我们来看一个具体的例子：
```ts
let tupleType: [number, boolean];
tupleType = [1, true];
```
在上面代码中，我们定义了一个名为 `tupleType` 的变量，它的类型是一个类型数组 `[string, boolean]`，然后我们按照正确的类型依次初始化 `tupleType` 变量。与数组一样，我们可以通过下标来访问元组中的元素：
```js
console.log(tupleType[0]); // 1
console.log(tupleType[1]); // true
```
在元组初始化的时候，如果出现类型不匹配的话，比如：
```js
tupleType = [true, "leo"];
```
此时，`TypeScript` 编译器会提示以下错误信息：
```
[0]: Type 'true' is not assignable to type 'string'.
[1]: Type 'string' is not assignable to type 'boolean'.
```
很明显是因为类型不匹配导致的。在元组初始化的时候，我们还必须提供每个属性的值，不然也会出现错误，比如：
```js
tupleType = ["semlinker"];
```
此时，`TypeScript` 编译器会提示以下错误信息：
```
Property '1' is missing in type '[string]' but required in type '[string, boolean]'.
```
### 10、Void
某种程度上来说，`void` 类型像是与 `any` 类型相反，它表示没有任何类型。当一个函数没有返回值时，你通常会见到其返回值类型是 `void`：
```ts
// 声明函数返回值为void
function warnUser(): void {
  console.log("This is my warning message");
}
```
以上代码编译生成的 ES5 代码如下：
```js
"use strict";
function warnUser() {
  console.log("This is my warning message");
}
```
需要注意的是，声明一个`void` 类型的变量没有什么作用，因为它的值只能为 `undefined` 或 `null`：
```ts
let unusable: void = undefined;
```

### 11、 Null 和 Undefined

`TypeScript` 里，`undefined` 和 `null` 两者有各自的类型分别为 `undefined` 和 `null`。
```ts
let u: undefined = undefined;
let n: null = null;
```
默认情况下 `null` 和 `undefined`是所有类型的子类型。 就是说你可以把 `null` 和 `undefined` 赋值给 `number` 类型的变量。然而，如果你指定了`--strictNullChecks` 标记，`null` 和 `undefined` 只能赋值给 `void` 和它们各自的类型。


### 12、object, Object 和 {}

**object**
`object` 类型是：TypeScript 2.2 引入的新类型，它用于表示非原始类型。

```ts
// node_modules/typescript/lib/lib.es5.d.ts
interface ObjectConstructor {
  create(o: object | null): any;
  // ...
}

const proto = {};

Object.create(proto);     // OK
Object.create(null);      // OK
Object.create(undefined); // Error
Object.create(1337);      // Error
Object.create(true);      // Error
Object.create("oops");    // Error
```

**Object**
`Object` 类型：它是所有 `Object` 类的实例的类型，它由以下两个接口来定义：

- `Object` 接口定义了 `Object.prototype` 原型对象上的属性；
```ts
// node_modules/typescript/lib/lib.es5.d.ts
interface Object {
  constructor: Function;
  toString(): string;
  toLocaleString(): string;
  valueOf(): Object;
  hasOwnProperty(v: PropertyKey): boolean;
  isPrototypeOf(v: Object): boolean;
  propertyIsEnumerable(v: PropertyKey): boolean;
}
```

- `ObjectConstructor` 接口定义了 `Object` 类的属性。
```ts
// node_modules/typescript/lib/lib.es5.d.ts
interface ObjectConstructor {
  /** Invocation via `new` */
  new(value?: any): Object;
  /** Invocation via function calls */
  (value?: any): any;
  readonly prototype: Object;
  getPrototypeOf(o: any): any;
  // ···
}

declare var Object: ObjectConstructor;
```
`Object` 类的所有实例都继承了 `Object` 接口中的所有属性。

**{}**
{} 类型描述了一个没有成员的对象。当你试图访问这样一个对象的任意属性时，`TypeScript` 会产生一个编译时错误。
```ts
// Type {}
const obj = {};

// Error: Property 'prop' does not exist on type '{}'.
obj.prop = "leo";
```
但是，你仍然可以使用在 `Object` 类型上定义的所有属性和方法，这些属性和方法可通过 `JavaScript` 的原型链隐式地使用：
```ts
// Type {}
const obj = {};

// "[object Object]"
obj.toString();
```


### 13、Never

`never` 类型表示的是那些永不存在的值的类型。 例如，`never` 类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型。
```ts
// 返回never的函数必须存在无法达到的终点
function error(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) {}
}
```
在 `TypeScript` 中，可以利用 `never` 类型的特性来实现全面性检查，具体示例如下：
```ts
type Foo = string | number;

function controlFlowAnalysisWithNever(foo: Foo) {
  if (typeof foo === "string") {
    // 这里 foo 被收窄为 string 类型
  } else if (typeof foo === "number") {
    // 这里 foo 被收窄为 number 类型
  } else {
    // foo 在这里是 never
    const check: never = foo;
  }
}
```
注意在 `else` 分支里面，我们把收窄为 `never` 的 `foo` 赋值给一个显示声明的 `never` 变量。如果一切逻辑正确，那么这里应该能够编译通过。但是假如后来有一天你的同事修改了 `Foo` 的类型：
```ts
type Foo = string | number | boolean;
```
然而他忘记同时修改 `controlFlowAnalysisWithNever` 方法中的控制流程，这时候 `else` 分支的 `foo` 类型会被收窄为 `boolean` 类型，导致无法赋值给 `never` 类型，这时就会产生一个编译错误。通过这个方式，我们可以确保

`controlFlowAnalysisWithNever` 方法总是穷尽了 `Foo` 的所有可能类型。 通过这个示例，我们可以得出一个结论：使用 `never` 避免出现新增了联合类型没有对应的实现，目的就是写出类型绝对安全的代码。


## TypeScript 断言


### 1、类型断言
有时候你会遇到这样的情况，你会比 `TypeScript` 更了解某个值的详细信息。通常这会发生在你清楚地知道一个实体具有比它现有类型更确切的类型。

通过类型断言这种方式可以告诉编译器，“相信我，我知道自己在干什么”。类型断言好比其他语言里的类型转换，但是不进行特殊的数据检查和解构。它没有运行时的影响，只是在编译阶段起作用。

类型断言有两种形式：

1. “尖括号” 语法
```ts
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;
```
2. as 语法
```ts
let someValue: any = "this is a string";
let strLength: number = (someValue as string).length;
```

### 2、非空断言

在上下文中当类型检查器无法断定类型时，一个新的后缀表达式操作符 `!` 可以用于断言操作对象是非 `null` 和非 `undefined` 类型。具体而言，`x!` 将从 `x` 值域中排除 `null` 和 `undefined` 。

那么非空断言操作符到底有什么用呢？下面我们先来看一下非空断言操作符的一些使用场景。

1. 忽略 `undefined` 和 `null` 类型
```ts
function myFunc(maybeString: string | undefined | null) {
  // Type 'string | null | undefined' is not assignable to type 'string'.
  // Type 'undefined' is not assignable to type 'string'. 
  const onlyString: string = maybeString; // Error
  const ignoreUndefinedAndNull: string = maybeString!; // Ok
}
```
2. 调用函数时忽略 `undefined` 类型
```ts
type NumGenerator = () => number;

function myFunc(numGenerator: NumGenerator | undefined) {
  // Object is possibly 'undefined'.(2532)
  // Cannot invoke an object which is possibly 'undefined'.(2722)
  const num1 = numGenerator(); // Error
  const num2 = numGenerator!(); //OK
}
```
因为 `!` 非空断言操作符会从编译生成的 `JavaScript` 代码中移除，所以在实际使用的过程中，要特别注意。比如下面这个例子：
```ts
const a: number | undefined = undefined;
const b: number = a!;
console.log(b); 
```
以上 TS 代码会编译生成以下 ES5 代码：
```js
"use strict";
const a = undefined;
const b = a;
console.log(b);
```
虽然在 TS 代码中，我们使用了非空断言，使得 `const b: number = a!`; 语句可以通过 `TypeScript` 类型检查器的检查。但在生成的 ES5 代码中，`!` 非空断言操作符被移除了，所以在浏览器中执行以上代码，在控制台会输出 `undefined`。


3. 确定赋值断言
在 TypeScript 2.7 版本中引入了确定赋值断言，即允许在实例属性和变量声明后面放置一个 `!` 号，从而告诉 `TypeScript` 该属性会被明确地赋值。为了更好地理解它的作用，我们来看个具体的例子：
```ts
let x: number;
initialize();
// Variable 'x' is used before being assigned.(2454)
console.log(2 * x); // Error

function initialize() {
  x = 10;
}
```
很明显该异常信息是说变量 `x` 在赋值前被使用了，要解决该问题，我们可以使用确定赋值断言：
```ts
let x!: number;
initialize();
console.log(2 * x); // Ok

function initialize() {
  x = 10;
}
```
通过 `let x!: number;` 确定赋值断言，`TypeScript` 编译器就会知道该属性会被明确地赋值。


## 类型守卫

类型保护是可执行运行时检查的一种表达式，用于确保该类型在一定的范围内。 换句话说，类型保护可以保证一个字符串是一个字符串，尽管它的值也可以是一个数值。类型保护与特性检测并不是完全不同，其主要思想是尝试检测属性、方法或原型，以确定如何处理值。目前主要有四种的方式来实现类型保护：

### 1、 in
```ts
interface Admin {
  name: string;
  privileges: string[];
}

interface Employee {
  name: string;
  startDate: Date;
}

type UnknownEmployee = Employee | Admin;

function printEmployeeInformation(emp: UnknownEmployee) {
  console.log("Name: " + emp.name);
  if ("privileges" in emp) {
    console.log("Privileges: " + emp.privileges);
  }
  if ("startDate" in emp) {
    console.log("Start Date: " + emp.startDate);
  }
}
```

### 2、typeof
```ts
function padLeft(value: string, padding: string | number) {
  if (typeof padding === "number") {
      return Array(padding + 1).join(" ") + value;
  }
  if (typeof padding === "string") {
      return padding + value;
  }
  throw new Error(`Expected string or number, got '${padding}'.`);
}
```
`typeof` 类型保护只支持两种形式：`typeof v === "typename"` 和 `typeof v !== typename`，`"typename"` 必须是 `"number"`， `"string"`， `"boolean"` 或 `"symbol"`。 但是 `TypeScript` 并不会阻止你与其它字符串比较，语言不会把那些表达式识别为类型保护。

### 3、instanceof
```ts
interface Padder {
  getPaddingString(): string;
}

class SpaceRepeatingPadder implements Padder {
  constructor(private numSpaces: number) {}
  getPaddingString() {
    return Array(this.numSpaces + 1).join(" ");
  }
}

class StringPadder implements Padder {
  constructor(private value: string) {}
  getPaddingString() {
    return this.value;
  }
}

let padder: Padder = new SpaceRepeatingPadder(6);

if (padder instanceof SpaceRepeatingPadder) {
  // padder的类型收窄为 'SpaceRepeatingPadder'
}
```
### 4、自定义类型保护的类型谓词
```ts
function isNumber(x: any): x is number {
  return typeof x === "number";
}

function isString(x: any): x is string {
  return typeof x === "string";
}
```
