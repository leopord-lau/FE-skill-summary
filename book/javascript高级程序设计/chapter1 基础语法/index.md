## 基本概念

#### 1.1 语法

##### 1.1.1 区分大小写

变量、函数名和操作符都是区分大小写的。

##### 1.1.2 标识符

- 第一个字符必须是一个字母、下划线(_) 或者美元符号（$）
- 其他字符可以是字母、下划线、美元符号或者数字


标识符采用驼峰大小写格式。

##### 1.1.3 注释

// 单行注释

/*
 * 多行注释
 */

##### 1.1.4 严格模式

`strict mode`

##### 1.1.5 语句

ECMAScript中的语句以一个分号结尾。

##### 1.1.6 关键字和保留字

**ECMAScript的关键字：**

break    、    do       、   instanceof  、 typeof
case     、    else     、   new         、 var
catch    、    finally  、   return      、 void
continue 、    for      、   switch      、 while
debugger 、    function 、   this        、 with
delete   、    in       、   try

**ECMA-262第三版保留字**

abstract    、   enum        、   int        、  short
boolean     、   export      、   interface  、  static
byte        、   extends     、   long       、  super
char        、   final       、   native     、  synchronized
class       、   float       、   package    、  throws
const       、   goto        、   private    、  transient
debugger    、   implements  、   protected  、  volatile
double      、   import      、   public




#### 1.2变量

使用`var`操作符定义变量。

注意；
使用var定义的变量将成为定义该变量的作用域中的局部变量。
```javascript
function test() {
  var message = 'hi';
}
test();
alert(message) // error
```

可以使用一条语句定义多个变量
```javascript
var message = "hi", found = false;
```

严格模式下，不能定义名为`eval`或者`arguments`的变量，否则会报错。

#### 1.3数据类型

基本数据类型：
undefined 、 null 、 boolean 、 number 、 string

ES6新增了一个symbol类型。


##### 1.3.1 typeof操作符

用于检测变量的类型

返回值：
undefined      -   未定义
boolean        -   布尔值
string         -   字符串
number         -   数值
object         -   对象或者`null`(null 被认为是一个空的对象引用)
function       -   函数

##### 1.3.2 Undefined

在使用var声明变量但是未赋值时，该变量的值就是undefined。

值为undefined的变量和未被定义的变量是不一样的

```javascript
var message;
alert(message); // undefined
alert(msg) // error
```

对于没有定义的变量使用typeof去判断返回undefined

```javascript
var message;
alert(typeof message); // undefined
alert(typeof msg) // undefined
```

###### 1.3.3 Null
null 表示一个空对象的指针， 因此使用typeof判断时返回的是 object

undefined是派生于null，ECMA规定对他们的相等性测试要返回true

```javascript
alert(null == undefined) // true
// === 符号则为false
```

##### 1.3.4 Boolean

有两个字面值： true 和 false。

所有类型的值都有与这两个值等价的值， 将一个值转换成对应的Boolean，可以调用转型函数Boolean().

|数据类型| 转成true | 转成false |
|-|-|-|
|Boolean| true | false |
|String| 任何非空字符串 | "" （空字符串） |
|Number| 任何非0数字值（包括无穷大） | 0 和 NaN |
|Object| 任何对象 | null |
|Undefined| 不适用 | undefined |

if语句自动执行相应的Boolean()


##### 1.3.5 Number

使用IEEE754格式来表示整数和浮点数值。

最基本的数值字面量格式是十进制整数

```javascript
var intNumber = 1;
```

数值还可以通过八进制或者十六禁止的字面值表示。
八进制字面量的第一位必须是0，数字序列（0~7）,如果字面量中的数值超过范围，前导0自动忽略,使用十进制进行解析。

```javascript
var octalNum1 = 070 // 56
var octalNum2 = 079 // 无效, 解析为79
var octalNum3 = 08 // 无效， 解析为8
```

十六进制字面量的前两位必须是0x,后跟任何十六进制数字（0-9及A-F）,字母A-F大小写都可。
```javascript
var hexNum1 = 0xA; // 十六进制的 10
var hexNum2 = 0x1f; // 十六进制的 31
```

**浮点数值**
数值中包含了一个小数点，且小数点后必须至少有一位数字。

```javascript
var floatNum1 = 1.1
var floatNum2 = 0.1
var floatNum3 = .1 // 有效，不建议
```

保存浮点数值需要的内存空间是保存整数值的两倍，因此ECMAScript会不时将浮点数值转成为整数值。
小数点后边没有任何数字、浮点数值本身就是一个整数都会被转成整数。

```javascript
var floatNum4 = 1.    // 小数点后没有数字，解析成1
var floatNum5 = 1.0   // 整数， 解析成1
```

对于极大或者极小的数值，可以使用e表示法（科学计数法）表示的浮点数值表示。用e表示法表示的数值等于e前面的数值乘以10的指数次幂。ECMAScript 中 e 表示法的格式也是如此，即前面是
一个数值（可以是整数也可以是浮点数），中间是一个大写或小写的字母 E，后面是 10 的幂中的指数，
该幂值将用来与前面的数相乘。
```javascript
var floatNum6 = 3.2e7 // 等于32000000
```

浮点数值的最高精度是17位小数，在算术计算时精度不如整数。例如 0.1 + 0.2 的结果不是 0.3， 而是 0.30000000000000004。

**数值范围**

ECMAScript能够表示的最小数值保存在Number.MIN_VALUE，对于大部分浏览器，这个值5e-324; 能够表示的最大数值保存在Number.MAX_VALUE,对于大部分浏览器来说，这个值是1.7976931348623157e+308。如果某次计算的结果得到了一个超出JavaScript数值的值，那么会被转成特殊的Infinity值。如果是负值，则是-Infinity。

如果某次计算返回了正或负的Infinity值，该值无法继续参与下一次的计算。isFinity()用于判断是否超出范围。

**NaN**
非数值。用于表示一个本来要返回数值的操作数未返回数值的情况。在ECMAScript中，任何数值除以0都会返回NaN。

任何涉及NaN的操作都会返回NaN。`NaN与任何值都不相等，包括NaN本身`

```javascript
alert(NaN == NaN)
```

isNaN() 用于判断是否 “不是数值”

```javascript
alert(isNaN(NaN)); //true
alert(isNaN(10)); //false（10 是一个数值）
alert(isNaN("10")); //false（可以被转换成数值 10）
alert(isNaN("blue")); //true（不能转换成数值）
alert(isNaN(true)); //false（可以被转换成数值 1）
```

**数值转换**

将非数值转换成为数值：
Number() :  可以任何数据类型
parseInt() ：  把字符串转成数值
parseFloat() ：  把字符串转成数值

1. Number规则：
 - Boolean值，true、false分别被转换成1、0
 - 数字，直接返回
 - null 返回 0
 - undefined返回 0
 - 字符串
 - - 只包含了数字的字符串，转成十进制数值，即使`"1"`转成 `1` , `"12"`转成`12`, `"010"` 转成 `10`
 - - 包含有效的浮点格式， `"1.1"` 转成 `1.1`
 - - 包含了有效的十六进制格式, 如： `"0xf"`转成相同大小的十进制整数值 `15`
 - - 字符串为空，转成`0`
 - - 如果非以上几种情况的字符串格式，则返回NaN
 - Object类型， 调用对象的valueOf() 方法， 然后依照前面的规则进行转换。如果转成的结果是NaN, 则调用对象的toString()方法，在按照之前的字符串规则进行转换。

```javascript
Number("hello world")  // NaN 不包含任何有意义的数字值
Number("")             // 0
Number("0011")         // 11
Number(true)           // 1
```

> 一员加操作符的操作与Number()作用相同


2. parseInt

处理整数的时候更常用parseInt()。parseInt()函数在转换字符串时，更多的是看其是否符合数值模式。它会忽略字符串前面的空格，直至找到第一个非空格字符。如果第一个字符不是数字字符或者负号，parseInt()就会返回 NaN；也就是说，用 parseInt()转换空字符串会返回 NaN（Number()对空字符返回 0）。如果第一个字符是数字字符，parseInt()会继续解析第二个字符，直到解析完所有后续字符或者遇到了一个非数字字符。例如，"1234blu会被转换为 1234，因为"blue"会被完全忽略。类似地，"22.5"会被转换为 22，因为小数点并不是有效的数字字符。

如果字符串中的第一个字符是数字字符，parseInt()也能够识别出各种整数格式（即前面讨论的十进制、八进制和十六进制数）。也就是说，如果字符串以"0x"开头且后跟数字字符，就会将其当作一个十六进制整数；如果字符串以"0"开头且后跟数字字符，则会将其当作一个八进制数来解析。

```javascript
parseInt("123abc")      // 132
parseInt("")            // NaN
parseInt("0xA")         // 10  十六进制
parseInt("22.5")        // 22
parseInt("070")         // ECMAScript 3 认为是 56（八进制），ECMAScript 5 认为是 70（十进制）
parseInt("70")          // 70  十进制
parseInt("0xf")         // 15  十六进制
```

在 ECMAScript 3 JavaScript 引擎中，"070"被当成八进制字面量，因此转换后的值是十进制的 56。而在 ECMAScript 5 JavaScript 引擎中，parseInt()已经不具有解析八进制值的能力，因此前导的零会被认为无效，从而将这个值当成"70"，结果就得到十进制的 70。在 ECMAScript 5 中，即使是在非严格模式下也会如此。为了消除在使用 parseInt()函数时可能导致的上述困惑，可以为这个函数提供第二个参数：转换时使用的基数（即多少进制）。如果知道要解析的值是十六进制格式的字符串，那么指定基数 16 作为第二个参数，可以保证得到正确的结果，例如：

```javascript
parseInt("0xAF", 16)     // 175
```
实际上，如果指定了 16 作为第二个参数，字符串可以不带前面的"0x" :

```javascript
parseInt("AF", 16)       // 175
parseInt("AF")           // NaN
```
第一个转换成功了，而第二个则失败了。差别在于第一个转换传入了基数，明确告诉parseInt()要解析一个十六进制格式的字符串；而第二个转换发现第一个字符不是数字字符，因此就自动终止了.

指定基数会影响转成结果：

```javascript
parseInt("10", 2);        // 2  二进制解析
parseInt("10", 8);        // 8  八进制解析
parseInt("10", 10);       // 10  十进制解析
parseInt("10", 16);       // 16  十六进制解析
```

`为了避免错误的解析， 建议无论什么情况下都明确指定基数`

3. parseFloat()

与 parseInt()函数类似，parseFloat()也是从第一个字符（位置 0）开始解析每个字符。而且也是一直解析到字符串末尾，或者解析到遇见一个无效的浮点数字字符为止。也就是说，字符串中的第一个小数点是有效的，而第二个小数点就是无效的了，因此它后面的字符串将被忽略。举例来说，"22.34.5"将会被转换为 22.34。

除了第一个小数点有效之外，parseFloat()与 parseInt()的第二个区别在于它始终都会忽略前导的零。parseFloat()可以识别前面讨论过的所有浮点数值格式，也包括十进制整数格式。但十六进制格式的字符串则始终会被转换成 0。由于 parseFloat()只解析十进制值，因此它没有用第二个参数指定基数的用法。最后还要注意一点：如果字符串包含的是一个可解析为整数的数（没有小数点，或者小数点后都是零），parseFloat()会返回整数。

```javascript
parseFloat("123Abc")      // 123
parseFloat("0xA")         // 0
parseFloat("22.5")        // 22.5
parseFloat("0908.5")      // 908.5
parseFloat("3.125e7")     // 3.1250000
```

##### 1.3.6 String

表示由零或多个16位Unicode字符组成的字符序列。 可以使用双引号`""` 或者 单引号 `''`

1. 字符字面量
   具有特殊用途的字符，转义序列
|-字面量-|-含义-|
|--|--|
| \n |  换行 |
| \t |  制表 |
| \b |  空格 |
| \r |  回车 |
| \f |  进制 |
| \\ |  斜杠 |
| \' |  单引号 |
| \" |  双引号 |
| \xnn |  以十六进制代码nn表示的一个字符（其中n为0～F）。例如，\x41表示"A" |
| \xnnnn |  以十六进制代码nnnn表示的一个Unicode字符（其中n为0～F）。例如，\u03a3表示希腊字符Σ |

\xnn 或者 \xnnnn 都只表示一个字符， 获取的length都是1。

2. 特点

ECMAScript中的字符串不可变。字符串一旦创建，值不能改变。 要改变只能先摧毁原来的字符串，在用另一个包含新字符串的值填充变量。
```javascript
var str = "java";
str = str + "script";
```

str 一开始只包含 `"java"`。第二行直接把str 变成 `"java"` 和 `"script"`的组合。
操作过程：
创建一个10个字符的新字符串，然后填充`java`和`script`。然后销毁原来的字符串`java` 和字符换 `script`。

3. 转成字符串

toString(), 几乎每个值都有toString()方法。
```javascript
(1).toString()       // "1"
true.toString()      // "true"
```

数值、布尔值、对象和字符串（返回该字符串的副本）都有一个toString() 方法， null、undefined没有。

多数情况下，调用toString() 都不需要传参。调用数值的时候可以传递一个参数：数值的基数。toString()方法以十进制格式返回数值的字符串表示。
toString可以输出二进制、八进制、十六进制或者其他进制格式表示的字符串值。
```javascript
(10).toString()      // "10"
(10).toString(2)      // "1010"
(10).toString(8)      // "12"
(10).toString(10)      // "10"
(10).toString(16)      // "a"
```

默认基数为10.

在不知道值是否为null或者undefined，可以使用String()方法。
String转换规则：
- 值有toString() 方法， 调用该方法并返回相应的结果
- 值为null，返回null
- 值为undefined， 返回undefined


```javascript
String("10")       // "10"
String(true)       // "true"
String(null)       // "null"
String(undefined)  // "undefined"
```

##### 1.3.7 Object
对象就是一组数据和功能的集合。

在ECAMScript中，Object类型是所有它的实例的基础。也就是说，`object类型所具有的任何属性和方法同样存在于更具体的对象中`。

Object实例都具有一下属性和方法：
- constructor: 保存着用于创建当前对象的函数。 `var o = new Object();`, o的构造函数就是Object()
- hasOwnProperty(propertyName): 用于检查给定的属性在当前对象实例中是否存在（而不是在原型中）， propertyName必须为字符串
- isPrototypeOf(Object): 用于检查传入的对象是否是传入对象的原型。
- propertyIsEnumerable(propertyName): 用于检查给定额属性是否能够使用for-in语句来枚举。
- toLocaleString(): 返回对象的字符串表示，该字符串与执行环境的地区对应。
- toString(): 返回对象的字符串表示。
- valueOf(): 返回对象的字符串、数值或者布尔值表示，通常与toString()方法的返回值相同。




#### 1.4 操作符
ECMAScript 操作符的与众不同之处在于，它们能够适用于很多值，例如字符串、数字值、布尔值，甚至对象。不过，在应用于对象时，相应的操作符通常都会调用对象的 valueOf()和（或）toString()方法，以便取得可以操作的值。

##### 1.4.1 一元操作符

1. 递增和递减操作符
  存在两种，前置和后置。前置位于要操作的变量前，后置则位于操作的变量后。
  ```javascript
  var age = 20;
  ++age; // 相当于 age = age + 1, --age 同理，为age = age - 1
  ```
  执行前置递增和递减操作时，变量的值都是在语句被求值以前改变的。（在计算机科学领域，这种情况通常被称作副效应。）
  ```javascript
  var age = 20;
  var age2 = --age + 2;
  alert(age)      // 19   递减
  alert(age2)     // 21   先执行递减后加2
  ```
  后置的递增和递减，是包含他们的语句被求值后才执行。
  ```javascript
  var num1 = 2;
  var num2 = 20;
  var num3 = num1-- + num2;
  var num4 = num1 + num2 
  alert(num3)      // 22    先使用原始值2进制加法运算后在递减
  alert(num4)      // 21
  ```
  以上4个操作符不仅适用与整数，还可以用于字符串、布尔值、浮点数值和对象，在应用不同的值时，遵循以下规则
  - 包含有效数字字符的字符串，会将其转换成数字值，在执行递增或递减值。同时将原本的字符串变成数值变量
  - 不包含有效数字字符的字符串，将变量设置为NaN,同时将原本的字符串变成数值变量
  - 布尔值false，转成0后递增或递减，布尔值变为数值
  - 布尔值true，转成0后递增或递减，布尔值变为数值
  - 浮点数值， 直接递增或递减。（浮点数值相加减存在误差）
  - 对象, 先调用对象的 valueOf()方法以取得一个可供操作的值。然后对该值应用前述规则。如果结果是 NaN，则在调用 toString()方法后再应用前述规则。对象变量变成数值变量。

  ```javascript
  var s1 = "1";
  var s2 = "a";
  var b = false;
  var f = 1.1
  var o = {
    valueOf: function() {
      return -1;
    }
  };
  alert(s1++)   // 2
  alert(s2++)   // NaN
  alert(b++)    // 1
  alert(f--)    // 0.10000000000000009（由于浮点舍入错误所致）
  alert(o--)    // -2
  ```

2. 一元加和减操作符
  
  一元加操作符以一个加号（+）表示，放在数值前面，对数值不会产生任何影响。
  ```javascript
  var num = 5
  num  = +num   // 5
  ```
  在对非数值应用一元加操作符时，会像Number()一样对值进行转换。布尔值true和false分别被转换成1和0.字符串值会被按照一组特殊的规则进行析，而对象是先调用它们的 valueOf()和（或）toString()方法，再转换得到的值。
  ```javascript
  var s1 = "01";
  var s2 = "1.1";
  var s3 = "a";
  var f = 1.1
  var b = false;
  var o = {
    valueOf: function() {
      return -1;
    }
  };
  alert(+s1)   // 1
  alert(+s2)   // 1.1
  alert(+s3)   // NaN
  alert(+b)    // 0
  alert(+f)    // 1.1
  alert(+o)    // -1
  ```

  一元减操作符主要用于表示负数。
  ```javascript
  var num = 5
  num  = -num   // -5
  ```
  在对非数值应用一元减操作符时，遵循一元加小姑娘同规则，在将得到的数值转换成负数。
  ```javascript
  var s1 = "01";
  var s2 = "1.1";
  var s3 = "a";
  var f = 1.1
  var b = false;
  var o = {
    valueOf: function() {
      return -1;
    }
  };
  alert(-s1)   // -1
  alert(-s2)   // -1.1
  alert(-s3)   // NaN
  alert(-b)    // 0
  alert(-f)    // -1.1
  alert(-o)    // 1
  ```


##### 1.4.2 位操作符

位操作符用于在最基本的层次上，即按内存中表示数值的位来操作数值。ECMAScript 中的所有数值都以 IEEE-754 64 位格式存储，但位操作符并不直接操作 64 位的值。而是先将 64 位的值转换成 32 位的整数，然后执行操作，最后再将结果转换回 64 位。对于开发人员来说，由于 64 位存储格式是透明的，因此整个过程就像是只存在 32 位的整数一样。

对于有符号的整数，32 位中的前 31 位用于表示整数的值。第 32 位用于表示数值的符号：0 表示正数，1 表示负数。这个表示符号的位叫做符号位，符号位的值决定了其他位数值的格式。其中，正数以纯二进制格式存储，31 位中的每一位都表示 2 的幂。第一位（叫做位 0）表示 2^0，第二位表示 2^1，以此类推。没有用到的位以 0 填充，即忽略不计。例如，数值 18 的二进制表示是00000000000000000000000000010010，或者更简洁的 10010。

负数同样以二进制码存储，但使用的格式是二进制补码。计算一个数值的二进制补码，需要经过下
列 3 个步骤：
 1.  求这个数值绝对值的二进制码（例如，要求18 的二进制补码，先求 18 的二进制码）；
 2.  求二进制反码，即将 0 替换为 1，将 1 替换为 0；
 3.  得到的二进制反码加 1。
   
要根据这 3 个步骤求得-18 的二进制码，首先就要求得 18 的二进制码，即：
0000 0000 0000 0000 0000 0000 0001 0010
然后，求其二进制反码，即 0 和 1 互换：
1111 1111 1111 1111 1111 1111 1110 1101
最后，二进制反码加 1：
1111 1111 1111 1111 1111 1111 1110 1101
                                      1
\---------------------------------------
1111 1111 1111 1111 1111 1111 1110 1110
这样，就求得了-18 的二进制表示，即 11111111111111111111111111101110。要注意的是，在处理有
符号整数时，是不能访问位 31 的。

ECMAScript 会尽力向我们隐藏所有这些信息。换句话说，在以二进制字符串形式输出一个负数时，我们看到的只是这个负数绝对值的二进制码前面加上了一个负号。
```javascript
var num = -18;
alert(num.toString(2)); // "-10010" 
```
要把数值18 转换成二进制字符串时，得到的结果是"-10010"。这说明转换过程理解了二进制补码并将其以更合乎逻辑的形式展示了出来。

1. 按位非（NOT）
  按位非操作符由一个波浪线（~）表示，执行按位非的结果就是返回数值的反码。按位非是ECMAScript 操作符中少数几个与二进制计算有关的操作符之一。
  ```javascript
  var num1 = 25;        // 二进制 00000000000000000000000000011001 
  var num2 = ~num1;     // 二进制 11111111111111111111111111100110 
  alert(num2);          // -26
  ```
  这里，对 25 执行按位非操作，结果得到了26。这也验证了按位非操作的本质：操作数的负值减 1。
  其实相当于
  ```javascript
  var num2 = -num1 - 1;
  ```
  虽然以上代码也能返回同样的结果，但由于按位非是在数值表示的最底层执行操作，因此速度更快。

2. 按位与（AND）
  用符号 `&` 表示，
  | -第一个数值位- | -第二个数值位- |     -结果-    | 
  |       --      |       --      |       --      |
  |       1       |       1       |       1       |
  |       1       |       0       |       0       |
  |       0       |       1       |       0       |
  |       0       |       0       |       0       |

  按位与操作只在两个数值的对应位都是 1 时才返回 1，任何一位是 0，结果都是 0。

  ```javascript
  var result  = 25 & 3;
  alert(result);           // 1
  ```
  25 = 0000 0000 0000 0000 0000 0000 0001 1001
   3 = 0000 0000 0000 0000 0000 0000 0000 0011
 ---------------------------------------------
 AND = 0000 0000 0000 0000 0000 0000 0000 0001 


3. 按位或（OR）
   用符号 `|` 表示，
  | -第一个数值位- | -第二个数值位- |     -结果-    | 
  |       --      |       --      |       --      |
  |       1       |       1       |       1       |
  |       1       |       0       |       1       |
  |       0       |       1       |       1       |
  |       0       |       0       |       0       |

  按位或操作在有一个位是 1 的情况下就返回 1，而只有在两个位都是 0 的情况下才返回 0
  ```javascript
  var result  = 25 | 3;
  alert(result);           // 27
  ```
  25 = 0000 0000 0000 0000 0000 0000 0001 1001
   3 = 0000 0000 0000 0000 0000 0000 0000 0011
  --------------------------------------------
  OR = 0000 0000 0000 0000 0000 0000 0001 1011 


4. 按位异或（XOR）
   用符号 `^` 表示.
   | -第一个数值位- | -第二个数值位- |     -结果-    | 
  |       --      |       --      |       --      |
  |       1       |       1       |       0       |
  |       1       |       0       |       1       |
  |       0       |       1       |       1       |
  |       0       |       0       |       0       |

  按位异或与按位或的不同之处在于，这个操作在两个数值对应位上只有一个 1 时才返回 1，如果对应的两位都是 1 或都是 0，则返回 0。

  ```javascript
  var result  = 25 ^ 3;
  alert(result);           // 26
  ```
  25 = 0000 0000 0000 0000 0000 0000 0001 1001
   3 = 0000 0000 0000 0000 0000 0000 0000 0011
 ---------------------------------------------
 XOR = 0000 0000 0000 0000 0000 0000 0001 1010 

5. 左移
  用`<<`符号表示，这个操作符会将数值的所有位向左移动指定的位数。
  ```javascript
  var oldValue = 2;
  var newValue = oldValue << 5;
  ```
  0000 0000 0000 0000 0000 0000 0000 0010
  向左移动5位
  0000 0000 0000 0000 0000 0000 0100 0000

  左移不会影响操作数的符号位。换句话说，如果将-2 向左移动 5 位，结果将是-64，而非 64。


6. 有符号的右移
   用`>>`符号表示，这个操作符会将数值向右移动，保留符号位（正负符号标记）。
  ```javascript
  var oldValue = 64;
  var newValue = oldValue >> 5;     // 等于二进制的10
  ```
  第一位是符号位
  0 000 0000 0000 0000 0000 0000 0100 0000
  向右移动5位
  0 000 0000 0000 0000 0000 0000 0000 0010

  前面的空位有`符号位`进行填充。

7. 无符号右移
  用`>>>`符号表示。
  ```javascript
  var oldValue = 64;
  var newValue = oldValue >>> 5;     // 等于二进制的10
  ```
  对于正数的无符号右移与有符号右移结果相同，因为正数的符号位是0。负数的话结果则不相同，无符号右移操作符会把负数的二进制码当成正数的二进制码。而且，由于负数以其绝对值的二进制补码形式表示，因此就会导致无符号右移后的结果非常之大。
  ```javascript
  var oldValue = -64;                // 等于二进制的 11111111111111111111111111000000 
  var newValue = oldValue >>> 5;     // 等于十进制的 134217726
  ```
  -64 =  1111 1111 1111 1111 1111 1111 1100 0000
      
  右移后 0000 0111 1111 1111 1111 1111 1111 1110

##### 1.5.3 布尔操作符
有3个：非（NOT）、与（AND）、或（OR）

1. 逻辑非
   用`!`符号表示，可以应用于ECMAScript中的所有值。任何数据使用了该符号都会返回一个布尔值。
   逻辑非操作符就是将操作数转换成一个布尔值后取反。
   规则：
   - 对象， 返回false
   - 空字符串， 返回true
   - 非空字符串， 返回false
   - 数值0， 返回true
   - 非0数值（包括infinity），返回false
   - null， 返回true
   - NaN, 返回true
   - undefined，返回true

  ```javascript
  alert(!false)           // true
  alert(!"blue")          // false
  alert(!0)               // true
  alert(!NaN)             // true
  alert(!"")              // true
  alert(!12345)           // false
  ```
  
  执行两个`!!`符号，就会模拟`Boolean()`转型函数， 得到这个值真正对应的布尔值。

2. 逻辑与
   用`&&`符号表示，有两个操作数。
   |    第一个操作数    |    第二个操作数    |      结果       |
   |      --           |       --          |       --        |
   |       true        |       true        |       true      |
   |       true        |      false        |      false      |
   |      false        |       true        |      false      |
   |      false        |      false        |      false      |

   规则：
   - 第一个是对象， 返回第二个；
   - 有一个是null，返回null
   - 有一个是NaN， 返回NaN
   - 有一个是undefined， 返回undefined

  如果第一个操作数能决定结果，就不会对第二个操作数求值。 如果第一个是false，那么不管第二个操作数，直接返回false。

3. 逻辑或
  用`||`符号表示，有两个操作数。
  |    第一个操作数    |    第二个操作数    |      结果       |
  |      --           |       --          |       --        |
  |       true        |       true        |       true      |
  |       true        |      false        |       true      |
  |      false        |       true        |       true      |
  |      false        |      false        |      false      |

  规则：
  - 第一个是对象，返回第一个
  - 第一个是false，返回第二个
  - 两个都是对象，返回第一个
  - 两个都是null，返回null
  - 两个都是NaN，返回NaN
  - 两个都是undefined， 返回undefined

  如果第一个操作数能决定结果，就不会对第二个操作数求值。 如果第一个是true，那么不管第二个操作数，直接返回true。


#### 1.5.4 乘性操作符
ECMAScript定义了3个乘性操作符：乘法、除法、求模。
如果参与乘性计算的某个操作数不是数值，后台会先使用 Number()转型函数将其转换为数值。也就是说，空字符串将被当作0，布尔值 true 将被当作 1。

1. 乘法
  用`*`符号表示，用于计算两个数值的乘积。
  规则：
  - 两个操作符都是数值，执行常规乘法计算。如果乘积超过ECMAScript数值的表示范围，返回`Infinity`或`-Infinity`
  - 有一个是NaN，返回NaN
  - `Infinity`与0相乘，返回NaN
  - `Infinity`与非0相乘，返回`Infinity`或`-Infinity`，符号取决于非0数值。
  - `Infinity`相乘，返回`Infinity`
  - 存在非数值，后台调用`Number()`函数后在运用上述规则

2. 除法
  用`/`符号表示。
  规则：
  - 两个操作符都是数值，执行常规除法计算。如果乘积超过ECMAScript数值的表示范围，返回`Infinity`或`-Infinity`
  - 有一个是NaN，返回NaN
  - 0被0除，返回NaN
  - `Infinity`被任何非0数值除，返回`Infinity`或`-Infinity`，符号取决于非0数值。
  - `Infinity`相除，返回NaN
  - 存在非数值，后台调用`Number()`函数后在运用上述规则


3. 求模
  求模也就是求余数，用`%`符号表示。
  规则：
  - 两个操作符都是数值，执行常规除法计算， 返回余数
  - 被除数无穷大而除数有限大，返回NaN
  - 被除数有限大而除数为0，返回NaN
  - Infinity 被 Infinity 除，则结果是 NaN
  - 被除数是有限大的数值而除数是无穷大的数值，则结果是被除数
  - 被除数是零，则结果是零
  - 存在非数值，后台调用`Number()`函数后在运用上述规则


#### 1.5.5 加性操作符
分为加法和减法两种

1. 加法
  用`+`符号表示。
  规则：
  - 两个操作符都是数值，则执行常规的算术加法操作并返回结果
  - 有个操作符为NaN, 返回NaN
  - Infinity 加 Infinity，则结果是 Infinity
  - -Infinity 加-Infinity，则结果是-Infinity
  - Infinity 加-Infinity，则结果是 NaN
  - +0 加+0，则结果是+0
  - -0 加-0，则结果是-0
  - +0 加-0，则结果是+0
  - 如果有个操作符是字符串
  - - 两个都是字符串，则拼接起来
  - - 只有一个是字符串，则将另一个转成字符串，之后进行拼接
  
  ```javascript
  var result1 = 5 + 5               // 10
  var result2 = 5 + "5"             // "55"
  var result3 = "java" + "script"   // "javascript"
  ```

2. 减法
   用`-`符号表示。
  规则：
  - 两个操作符都是数值，则执行常规的算术减法操作并返回结果
  - 有个操作符为NaN, 返回NaN
  - Infinity 减 Infinity，则结果是 NaN
  - -Infinity 减-Infinity，则结果是 NaN
  - Infinity 减 -Infinity，则结果是 Infinity
  - -Infinity 减Infinity，则结果是-Infinity
  - Infinity 减-Infinity，则结果是 NaN
  - +0 减+0，则结果是+0
  - -0 减-0，则结果是+0
  - +0 减-0，则结果是-0
  - 有一个操作数是字符串、布尔值、null 或 undefined，则先在后台调用 Number()函数将其转换为数值，然后再根据前面的规则执行减法计算。如果转换的结果是 NaN，则减法的结果就是 NaN
  - 有一个操作数是对象，则调用对象的 valueOf()方法以取得表示该对象的数值。如果得到的值是 NaN，则减法的结果就是 NaN。如果对象没有 valueOf()方法，则调用其 toString()方法并将得到的字符串转换为数值。


#### 1.5.6 关系操作符
小于（<）、大于（>）、小于等于（<=）和大于等于（>=）

规则：
- 两个操作数都是数值，则执行数值比较
- 两个操作数都是字符串，则比较两个字符串对应的字符编码值
- 一个操作数是数值，则将另一个操作数转换为一个数值，然后执行数值比较
- 一个操作数是对象，则调用这个对象的 valueOf()方法，用得到的结果按照前面的规则执行比较。如果对象没有 valueOf()方法，则调用 toString()方法，并用得到的结果根据前面的规则执行比较
- 一个操作数是布尔值，则先将其转换为数值，然后再执行比较
```javascript
var result = "Brick" < "alphabet";                                //true  B的字符编码为66 ， a的字符编码为97 
var result = "Brick".toLowerCase() < "alphabet".toLowerCase();    //false 
var result = "23" < "3";                                          //true  "2"的字符编码是 50，而"3"的字符编码是 51
var result = "23" < 3;                                            //false  字符串"23"会被转换成数值 23，然后再与 3 进行比较
var result = "a" < 3;                                             // false，因为"a"被转换成了 NaN 
var result1 = NaN < 3;                                            //false
var result2 = NaN >= 3;                                           //false 
```
任何操作数与 NaN 进行关系比较，结果都是 false。



#### 1.5.6 关系操作符
有两组关系操作符

相等和不相等 —— 先转换再比较
全等和不全等 —— 仅比较而不转换

1. 相等和不相等
  用`==`、`!=`符号表示，都会先转换操作数（通常称为强制转型），然后再比较它们的相等性。

  规则：
  - 有一个操作数是布尔值，则在比较相等性之前先将其转换为数值——false 转换为 0，而true 转换为 1
  - 一个操作数是字符串，另一个操作数是数值，在比较相等性之前先将字符串转换为数值
  - 一个操作数是对象，另一个操作数不是，则调用对象的 valueOf()方法，用得到的基本类型值按照前面的规则进行比较
  - - null 和 undefined 相等
  - - 要比较相等性之前，不能将 null 和 undefined 转换成其他任何值
  - - 有一个操作数是 NaN，则相等操作符返回 false，而不相等操作符返回 true。重要提示：即使两个操作数都是 NaN，相等操作符也返回 false；因为按照规则，`NaN 不等于 NaN`
  - - 两个操作数都是对象，则比较它们是不是同一个对象。如果两个操作数都指向同一个对象, 则相等操作符返回 true；否则，返回 false

|        判断         |     值    |
|  null == undefined  |    true   |
|     true == 1       |    true   |
|     "5" == 5        |    true   |
|    NaN != NaN       |    true   |
|     false == 0      |    true   |
|   "NaN" == NaN      |   false   |
|      5 == NaN       |   false   |
|    NaN == NaN       |   false   |
|    true == 2        |   false   |
|   undefined == 0    |   false   |
|     null == 0       |   false   |

2. 全等和不全等
  用`===`、`!==`符号表示，只在两个操作数未经转换就相等的情况下返回 true。
  ```javascript
  var result1 = ("55" == 55); //true，因为转换后相等
  var result2 = ("55" === 55); //false，因为不同的数据类型不相等

  var result1 = ("55" != 55); //false，因为转换后相等
  var result2 = ("55" !== 55); //true，因为不同的数据类型不相等
  ```
  null === undefined 返回 false


##### 1.5.8 条件操作符
```javascript
var variable = boolean_expression ? true_value: false_value
```
就是对boolean_expression 进行求值， 结果为true， 变量variable赋值为true_value， 为false就赋值为false_value


##### 1.5.9 赋值操作符

`=`是最简单的赋值

复合赋值
- 乘 赋值 （`*=`）
- 除 赋值 （`/=`）
- 模 赋值 （`%=`）
- 加 赋值 （`+=`）
- 减 赋值 （`-=`）
- 左移 赋值 （`<<=`）
- 有符号右移 赋值 （`>>=`）
- 无符号右移 赋值 （`>>>=`）

设计这些操作符的主要目的就是简化赋值操作。使用它们不会带来任何性能的提升。

#####  1.5.10 逗号操作符
使用逗号操作符可以在一条语句中执行多个操作。
```javascript
var num1 = 1, num2 = 2, num3 = 3;
```

#### 1.6 语句

##### 1.6.1 if

语法:
```javascript
if(condition) statement1 else statement2;
```
condition 可以是任意表示式， Boolean() 会将表达式结果转换成布尔值， 结果为true就会执行 statement1, 否则执行 statement2

##### 1.6.2 do...while...

后测试循环语句，也就是说循环体内的代码至少会被执行一次。

语法:
```javascript
do {
  statement
} while (expression)
```
先执行do循环体中的代码，后判断while中的表达式。


##### 1.6.3  while
前测试循环语句
对于while而言，循环体内的代码可以永远都不会被执行。

语法：
```javascript
while(expression) statement;
```

##### 1.6.4 for
前测试循环语句， 它具有在执行循环之前初始化变量和定义循环后要执行的代码的能力。

语法：
```javascript
for(initialization; expression; post-loop-expression) statement;
```

例如：
```javascript
var count = 5;
for(var i = 0; i < count; i++) {
  alert(i);
}
```

初始化了变量i为0，只有当 i < count 为true时才会进行循环，因此for循环也可能一次也不会执行。在执行循环体内的代码后会对执行表达式（i++）.

当然变量的初始化也可以在外部执行
```javascript
var count = 5;
var i = 0
for(i; i < count; i++) {
  alert(i);
}
```

由于ES新增了块级作用域和let、const关键字, 在变量初始化的时候最好采用let进行声明，来看个例子

```javascript
var count = 5;
for(var i = 0; i < count; i++) {
  setTimeout(() => {
    console.log(i)
  })
}
// 5 5 5 5 5

for(let i = 0; i < count; i++) {
  setTimeout(() => {
    console.log(i)
  })
}
// 0 1 2 3 4
```
为什么出现这种情况？
简单来说就是使用`let`时在for() 表达式圆括号之内会存在一个隐藏的作用域。

在每次执行循环体之前，js引擎都会在循环体的上下文中重新声明和初始化i;
相当于：
```javascript
(let i = 0) {
  setTimeout(() => {
    console.log(i)
  })
}
(let i = 1) {
  setTimeout(() => {
    console.log(i)
  })
}
(let i = 2) {
  setTimeout(() => {
    console.log(i)
  })
}
(let i = 3) {
  setTimeout(() => {
    console.log(i)
  })
}
(let i = 4) {
  setTimeout(() => {
    console.log(i)
  })
}
```

而var由于变量提升至for()外部，因此其实var只声明了一次，因此结果都是5个5.



##### 1.6.5 for-in

用来枚举对象的属性

语法：
```javascript
for(property in expression) statement
```

如果表示要迭代的对象的变量值为 null 或 undefined，for-in 语句会抛出错误。ECMAScript 5 更正了这一行为；对这种情况不再抛出错误，而只是不执行循环体。在使用 for-in 循环之前，先检测确认该对象的值不是 null 或 undefined.

##### 1.6.6 label
使用label可以在代码中添加标签，以便将来使用。
加标签的语句一般都要与 for 语句等循环语句配合使用

语法：
```javascript
label: statement;
```

示例：
```javascript
var num = 0;
outermost:
for (var i=0; i < 10; i++) {
    for (var j=0; j < 10; j++) {
        if (i == 5 && j == 5) {
            break outermost;
        }
        num++;
    }
}
alert(num); // 55 
```

label能快速定位到程序的位置。


##### 1.6.7 break和continue
break 跳出循环；
continue 跳过当前循环，执行下一个循环；

```javascript
var num = 0;
outermost:
for (var i=0; i < 5; i++) {
  if(i == 2) {
    break outermost;
  }
  console.log(i)
}
// 0 1
```
当i和j为5跳出循环，因此num 为55

```javascript

outermost:
for (var i=0; i < 5; i++) {
  if(i == 2) {
    continue outermost;
  }
  console.log(i)
}
// 0 1 3 4
```


##### 1.6.8 with

将代码的作用域设置到一个特定的对象中,用于简化多次编写同一个对象的工作。

语法：
```javascript
with (expression) statement;
```

示例：
```javascript
var qs = location.search.substring(1)
var hostName = location.hostName;
var url = location.url
```
上述的代码都包含了location对象，使用with可以改写成
```javascript
with(location) {
  var qs = search.substring(1)
  var hostName = hostName
  var url = url
}
```
使用 with 语句关联了 location 对象。这意味着在 with 语句的代码块内部，每个变量首先被认为是一个局部变量，而如果在局部环境中找不到该变量的定义，就会查询location 对象中是否有同名的属性。如果发现了同名属性，则以 location 对象属性的值作为变量的值。
严格模式下不允许使用 with 语句，否则将视为语法错误。


##### 1.6.9 switch

语法：
```javascript
switch(expression) {
  case value:
    statement;
    break;
  case value:
    statement;
    break;
  default:
    statement;
}
```
switch 语句中的每一种情形（case）的含义是：“如果表达式等于这个值（value），则执行后面的语句（statement）”。而 break 关键字会导致代码执行流跳出 switch 语句。如果省略 break 关键字，就会导致执行完当前 case 后，继续执行下一个 case。最后的 default 关键字则用于在表达式不匹配前面任何一种情形的时候，执行机动代码（因此，也相当于一个 else 语句）.

如果没有break，则会执行多个case
```javascript
switch (i) {
 case 25:
 /* 合并两种情形 */
 case 35:
 alert("25 or 35");
 break;
 case 45:
 alert("45");
 break;
 default:
 alert("Other");
} 
```

可以在switch 语句中使用任何数据类型,每个 case 的值不一定是常量，可以是变量，甚至是表达式。

```javascript
switch ("hello world") {
 case "hello" + " world":
 alert("Greeting was found.");
 break;
 case "goodbye":
 alert("Closing was found.");
 break;
 default:
 alert("Unexpected message was found.");
} 

var num = 25;
switch (true) {
 case num < 0:
 alert("Less than 0.");
 break;
 case num >= 0 && num <= 10:
 alert("Between 0 and 10.");
 break;
 case num > 10 && num <= 20:
 alert("Between 10 and 20.");
 break;
 default:
 alert("More than 20.");
} 
```

**switch 语句在比较值时使用的是全等操作符，因此不会发生类型转换（例如，字符串"10"不等于数值 10**


#### 1.7 函数

语法：
```javascript
function functionName(arg0, arg1, ...argN) {
  statements
}
```
如果函数内存在`return`，那么位于return语句之后的所有代码都不会执行，return表示函数会返回一个值。
```javascript
function sum(num1, num2) {
  return num1 + num2;
  alert('hello world');     // 永远都不会执行
}
```

当然，一个函数中也可以包含多个return语句
```javascript
function diff(num1, num2) {
  if(num1 < num2) {
    return num2 - num1
  } else {
    return num1 - num2
  }
}
```
如果return后边没有任何返回值，函数在停止后会返回undefined。这种情况通常用于提前停止函数而不需要返回值。


##### 1.7.1 参数

函数体内可以通过arguments对象来访问传入函数的所有参数。
arguments 对象只是与数组类似（它并不是 Array 的实例），因为可以使用方括号语法访问它的每一个元素（即第一个元素是 arguments[0]，第二个元素是 argumetns[1]，以此类推）使用 length 属性来确定传递进来多少个参数。

arguments的值永远与对应命名参数的值保持同步。
```javascript
function sum(num1, num2) {
  arguments[1] = 20;
  console.log(num1 + num2);
}
sum(10, 0)  // 30
```
执行sum()函数时会重写第二个参数，将第二个参数的值修改20。 arguments对象的值会自动反映到对应的命名参数，修改arguments[1]就是修改num2。这并不是说读取这两个值会访问相同的内存空间；它们的内存空间是独立的，但它们的值会同步。另外还要记住，如果只传入了一个参数，那么为 arguments[1]设置的值不会反应到命名参数中。
没有传递值的命名参数将自动被赋予 undefined 值。这就跟定义了变量但又没有初始化一样。 如果sum() 函数中没有传入第二个参数，num2为undefined。

##### 1.7.2 函数没有重载
ECMAScript 函数不能像传统意义上那样实现重载。如果在 ECMAScript 中定义了两个名字相同的函数，则该名字只属于后定义的函数。
```javascript
function addSomeNumber(num){
 return num + 100;
}
function addSomeNumber(num) {
 return num + 200;
}
var result = addSomeNumber(100); //300 
```