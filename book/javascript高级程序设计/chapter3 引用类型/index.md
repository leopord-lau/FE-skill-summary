## 3.引用类型
引用类型的值是引用类型的一个实例。
在ECMAScript中，引用类型是一种数据结构，用于将数据和功能组织在一i。

### 3.1 Object
大多数的引用类型值都是Object类型的实例。

创建Object的方法
1. new
   ```javascript
   var person = new Object();
   person.name = "xiaoming"
   ```
2. 对象字面量
  简化创建包含大量属性的对象的过程
  ```javascript
  var person = {
    name: "xiaoming",
    "age": 23
  }
  ```
  属性之间用逗号分隔开，属性可以使用字符串定义。
  如果留空花括号，则可以定义只包含默认属性和方法的对象。
  ```javascript
  var person = {};
  person.name = "xiaoming"
  ```

  在通过对象字面量定义对象时，实际上不会调用 Object 构造函数（Firefox 2 及更早版本会调用 Object 构造函数；但 Firefox 3 之后就不会了）。

  一般来说，访问对象属性的时候使用的都是点表示。不过，也可使用放括号来访问对象的属性。在使用方括号语法时，应该将要访问的属性以字符串的形式放在方括号中。
  ```javascript
  person["name"]
  ```
  方括号语法的主要优点是可以通过变量来访问属性，
  ```javascript
  var propertyName = "name"
  person[property]
  ```

#### 3.2 Array

除了Object类型外，Array应该是最常用的了。
Array中的每一项都可以保存任何类型的数据。也就是说可以用第一个保存字符串，第二个保存数值，第三个保存对象。数组的大小是可以动态调整的，即可以随着数据的添加自动增长以容纳新增数据。
创建数组的方式有两种：
1. 构造函数创建
  ```javascript
  var colors = new Array();
  ```
  可以在构造函数上定义数组的长度。
  ```javascript
  var colors = new Array(10);
  ```
  也可以预先插入项
  ```javascript
  var colors = new Array("red", "blue");
  ```
  如果传参插入的是数值，创建某长度的数组；传入的是其他类型的参数，就会创建包含了该参数的数组。

  当然，也可以省略new操作符。
  ```javascript
  var colors1 = Array(3)
  var colors2 = new Array("red", "blue");
  ```

2. 字面量表示法
  ```javascript
  var colors = ["red", "blue"];
  var nums = [];
  var values = [1,2];
  var options = [,,,,]             // 不建议这样，会创建包含4或5项的空数组
  ```
  与对象一样，在使用数组字面量表示法时，也不会调用 Array 构造函数（Firefox 3及更早版本除外）。

  在读取和设置数组的值时，要使用方括号并提供相应值的基于 0 的数字索引。
  ```javascript
  var colors = ["red", "blue"];
  colors[0]                         // red
  colors[1] = "orange"              // 修改第二项的值
  colors[2] = "black"               // 新增第三项
  colors[5] = "brown"               // 新增第六项的值为brown，并且新增4、5项，4、5项为空
  ```
  数组的 length 属性很有特点——它不是只读的。因此，通过设置这个属性，可以从数组的末尾移除项或向数组中添加新项。
  ```javascript
  var colors = ["red", "blue"];
  colors.length = 1                    // 移除第二项
  colors[1]                            // undefined
  colors.length = 4                    // 新增3项，新增的项均为undefined
  ```
  colors一开始有两个值，将length设置为1会移除最后一项，所以访问colors[1]返回undefined，设置length属性，使其大于数组的项数，则会新增项，使数组的长度等于length，新增项的值为undefined。
  
  利用 length 属性也可以方便地在数组末尾添加新项。
  ```javascript
  var colors = ["red", "blue"];
  colors[colors.length] = "black"      // 添加一种颜色
  ```

##### 3.2.1 检测数组

`Array.isArray(value)`用于检测是否是数组。

##### 3.2.2 转换方法
所有对象都具有 toLocaleString()、toString()和 valueOf()方法。其中，调用数组的 toString()方法会返回由数组中每个值的字符串形式拼接而成的一个以逗号分隔的字符串。而调用 valueOf()返回的还是数组。实际上，为了创建这个字符串会调用数组每一项的 toString()方法。

```javascript
var colors = ["red", "blue", "green"]; // 创建一个包含 3 个字符串的数组
console.log(colors.toString()); // red,blue,green
console.log(colors.valueOf()); // red,blue,green
console.log(colors); // red,blue,green 
```

`join()`方法接收一个参数，即用作分割符的字符串，返回包含了所有数组项的字符串。
```javascript
var colors = ["red", "blue", "green"]; // 创建一个包含 3 个字符串的数组
console.log(colors.join(".")); // red.blue.green
console.log(colors.join("-")); // red-blue-green
```
如果不给 join()方法传入任何值，或者给它传入 undefined，则使用逗号作为分隔符。IE7 及更早版本会错误的使用字符串"undefined"作为分隔符。

> 如果数组中的某一项的值是 null 或者 undefined，那么该值在 join()、toLocaleString()、toString()和 valueOf()方法返回的结果中以空字符串表示.


##### 3.2.3 栈方法
ECMAScript 数组也提供了一种让数组的行为类似于其他数据结构的方法。具体说来，数组可以表现得就像栈一样，后者是一种可以限制插入和删除项的数据结构。栈是一种 LIFO（Last-In-First-Out，后进先出）的数据结构，也就是最新添加的项最早被移除。而栈中项的插入（叫做推入）和移除（叫做弹出），只发生在一个位置——栈的顶部。ECMAScript 为数组专门提供了 push()和 pop()方法，以便实现类似栈的行为。
push()方法可以接收任意数量的参数，把它们逐个添加到数组末尾，并返回修改后数组的长度。而pop()方法则从数组末尾移除最后一项，减少数组的 length 值，然后返回移除的项。

```javascript
var colors = new Array();                // 创建一个数组
var count = colors.push("red", "green"); // 推入两项
alert(count);                            //2
count = colors.push("black");            // 推入另一项
alert(count);                            //3
var item = colors.pop();                 // 取得最后一项
alert(item);                             //"black"
alert(colors.length);                    //2 
```


##### 3.2.4 队列方法
栈数据结构的访问规则是 LIFO（后进先出），而队列数据结构的访问规则是 FIFO（First-In-First-Out，先进先出）。队列在列表的末端添加项，从列表的前端移除项。由于 push()是向数组末端添加项的方法，因此要模拟队列只需一个从数组前端取得项的方法。实现这一操作的数组方法就是 shift()，它能够移除数组中的第一个项并返回该项，同时将数组长度减 1。结合使用 shift()和 push()方法，可以像使用队列一样使用数组。
ECMAScript 还为数组提供了一个 unshift()方法。顾名思义，unshift()与 shift()的用途相反：它能在数组前端添加任意个项并返回新数组的长度。因此，同时使用 unshift()和 pop()方法，可以从相反的方向来模拟队列，即在数组的前端添加项，从数组末端移除项.
```javascript
var colors = new Array();                //创建一个数组
var count = colors.push("red", "green"); //推入两项
alert(count);                            //2
count = colors.push("black");            //推入另一项
alert(count);                            //3
var item = colors.shift();               //取得第一项
alert(item);                             //"red"
alert(colors.length);                    //2 
```

##### 3.2.5 重排序方法
数组中存在两种重排序的方法：`reverse()`和`sort()`;
1. reverse()
  反转数组项的顺序
  ```javascript
  var values = [1, 2, 3, 4, 5];
  values.reverse();
  console.log(values);                 //[5,4,3,2,1]
  ```
  只能对数组进行反转，不灵活。
  
2. sort()
  在默认情况下，sort()方法按升序排列数组项——即最小的值位于最前面，最大的值排在最后面。sort()方法会调用每个数组项的 toString()转型方法，然后比较得到的字符串，以确定如何排序。即使数组中的每一项都是数值，sort()方法`比较的也是字符串`。
  ```javascript
  var values = [0, 1, 5, 10, 15];
  values.sort();
  console.log(values);                //[0,1,10,15,5] 
  ```
  即使例子中值的顺序没有问题，但 sort()方法也会根据测试字符串的结果改变原来的顺序。因为数值 5 虽然小于 10，但在进行字符串比较时，"10"则位于"5"的前面，于是数组的顺序就被修改了。

  sort()方法可以接收一个比较函数作为参数，以便我们指定哪个值位于哪个值的前面。
  
  比较函数接收两个参数，如果第一个参数应该位于第二个之前则返回一个负数，如果两个参数相等则返回 0，如果第一个参数应该位于第二个之后则返回一个正数。
  ```javascript
  function compare(value1, value2) {
    if (value1 < value2) {
      return -1;
    } else if (value1 > value2) {
      return 1;
    } else {
      return 0;
    }
  } 

  var values = [0, 1, 5, 10, 15];
  values.sort(compare);
  alert(values); //0,1,5,10,15 
  ```
  对于数值类型或者其 valueOf()方法会返回数值类型的对象类型，可以使用一个更简单的比较函数。这个函数只要用第二个值减第一个值即可。
  ```javascript
  function compare(value1, value2){
    return value2 - value1;
  } 
  ```


##### 3.2.6 操作方法
1. `concat()` 
基于当前数组创建一个新数组。会先创建当前数组一个副本，然后将接收到的参数添加到这个副本的末尾，最后返回新构建的数组。如果没有传递参数，则只是复制当前数组。
```javascript
var colors = ["red", "green", "blue"];
var colors2 = colors.concat();                     // 复制副本
var colors3 = colors.concat("yellow")              // ["red", "green", "blue", "yellow"]
var colors4 = colors.concat(["black", "brown"])    // ["red", "green", "blue", "black", "brown"]
```

传递给`concat()`的值不是数组的话，就简单的添加到数组末尾。如果是数组的话就会将数组内的所有项添加上去。

注意：
`concat()`方法只能解析一层的数组，嵌套的数组并不能解析出来.
```javascript
var color5 = colors.concat([["orange", "white"],["pink"]])   // ["red", "green", "blue", ["orange", "white"],["pink"]]
```

2. `slice()`
基于当前数组中的一项或者多项创建一个新数组（截取数组），接收零个、一个或者两个参数，截取数组的起始位置和结束位置（不包含结束位置项），如果只传入一个参数结束位置默认到最后。如果没有参数或者只有一个参数且为0，相当于复制了数组。
```javascript
var colors = ["red", "green", "blue", "yellow", "purple"];
var colors1 = colors.slice(1);      // ["green", "blue", "yellow", "purple"]
var colors2 = colors.slice(1,4);    // ["green", "blue", "yellow"]  不包括索引为4的结束项
var colors3 = colors.slice();       // ["red", "green", "blue", "yellow", "purple"]
var colors3 = colors.slice(0);       // ["red", "green", "blue", "yellow", "purple"]
```

3. `splice()`
最强大的数组方法。可以实现删除、插入、替换。
- 删除， 可以删除任意数量的项，传入两个参数（要删除的第一项的位置和要删除的项数）。
- 插入， 在指定位置插入任意数量的项，传入3个及以上参数（插入的起始位置，0，插入项（第三个及之后的参数））。
-  替换， 替换掉指定位置的项，且可以插入任意数量的项，传入3个及以上的参数（起始位置，要替换的项数，插入的项）。如果要替换的项数为0的话就是插入操作了。
该方法返回一个数组，该数组为原始数组中删除的项组合成的数组。由于`splice()`方法是在原数组上直接进行操作，因此需要注意是否会影响到其他有使用到该数组的代码。

```javascript
var colors = ["red", "green", "blue", "yellow", "purple"];
var colors1Copy = colors.slice();
var colors1 = colors1Copy.splice(0, 1);                                  // ["red"]
console.log(colors1Copy);                                                // ["green", "blue", "yellow", "purple"]

var colors2Copy = colors.slice()
var colors2 = colors2Copy.splice(1, 0, "pink", "white", "orange");       // []
console.log(colors2Copy);                                                // ["red", "pink", "white", "orange", "green", "blue", "yellow", "purple"]  在索引1的项后边插入3项

var colors3Copy = colors.slice()
var colors3 = colors3Copy.splice(2, 1, "pink");                          // ["blue"]
console.log(colors3Copy);                                                // ["red", "green", "pink", "yellow", "purple"]  替换掉索引2的项的后一位

var colors4Copy = colors.slice();
var colors4 = colors4Copy.splice(2, 1, "pink", "white");                 // ["blue"]
console.log(colors4Copy);                                                // ["red", "green", "pink", "white", "yellow", "purple"]  替换掉索引2的项的后一位后插入多一项
```

##### 3.2.7 位置方法
`indexOf()` 和 `lastIndexOf()`，接收两个参数（要查找的项和查找起点项的索引值（可选））。`indexOf()` 从数组的开头开始查找，`lastIndexOf()`方法则从数组末尾开始往前找。如果查找到项则返回对应的索引值，否则返回-1, 如果存在两个相同的项，则返回最先找到的项的索引值。在比较的时候使用全等操作符（===）
```javascript
var numbers = [1,2,3,4,5,4,3,2,1];
console.log(numbers.indexOf(4));        // 3
console.log(numbers.lastIndexOf(4))     // 5
console.log(numbers.indexOf(4,4))       // 5
console.log(numbers.lastIndexOf(4,4))   // 3

var person = {name: "xiaoming"};
var people = [{name: "xiaoming"}];

var morePeople = [person];
console.log(people.indexOf(person))     // -1 people中的第一个对象跟person对象是不同的，所以返回-1
console.log(morePeople.indexOf(person)) // 0
``` 

##### 3.2.8 迭代方法
数组有5个迭代方法，每个方法接收两个参数（在每一项上执行的函数（函数接收三个参数（数组项的值， 数组项的索引值， 数组本身））， 运行该函数的作用域对象（this指向））。

- `every()` ， 对数组中的每一项都执行对应函数，如果所有都返回true，则返回true
- `filter()`,  对数组中的每一项都执行对应函数，返回该函数返回true的项组成的数组
- `forEach()`, 对数组中的每一项都执行对应函数，没有返回值
- `map()`, 对数组中的每一项都执行对应函数, 返回每次函数调用的结果组成的数组
- `some()`， 对数组中的每一项都执行对应函数,如果存在函数返回true，就返回true
以上方法都不会修改数组中的包含的值。

```javascript
var numbers = [1,2,3,4,5,4,3,2,1];
var everyResult = numbers.every(function(item, index, array) {
  return item > 2;
})
// false

var filterResult = numbers.filter(function(item, index, array) {
  return item > 2;
})
// [3, 4, 5, 4, 3]

var someResult = numbers.some(function(item, index, array) {
  return item > 2;
})
// true

var mapResult = numbers.map(function(item, index, array) {
  return item * 2;
})
// [2, 4, 6, 8, 10, 8, 6, 4, 2]

numbers.forEach(function(item, index, array) {
  // 没有返回值，执行forEach操作，比如
  console.log(item * 2 )
})
```


##### 3.2.9  归并方法
`reduce()`和`reduceRight()`，这两个都会迭代数组的所有项，然后构建一个最终返回的值。
`reduce()`从数组的第一项开始遍历到最后，`reduceRight()`则从数组的最后一项开始往前遍历。
两个方法都接收两个参数（在每一项上调用的函数（函数接收4个参数（前一个值，当前值，项的索引和数组对象），这个函数返回的任何值都会作为第一个参数自动传给下一项。`第一次迭代发生在数组的第二项上`，因此第一个参数是数组的第一项，第二个参数就是数组的第二项），基础值）
使用reduce方法计算数组中所有值的和。
```javascript
var values = [1,2,3,4,5]
var sum = values.reduce(function(prev, cur, index, array) {
  return prev + cur
});
console.log(sum)              // 15
var sum2 = values.reduce(function(prev, cur, index, array) {
  return prev + cur
}, 10);
console.log(sum2)             // 25  存在初始值10
```

#### 3.3 Date
Date类型使用自UTC(Coordinated Universal Time，国际协调时间),1970 年 1 月 1 日午夜（零时）开始经过的毫秒数来保存日期.
通过new就可以直接创建一个日期对象。
```javascript
var now = new Date();
```
创建特定的日期对象需要传入该日期的毫秒数。
```javascript
var getDate = new Date(1615103109272);
```

`Date.parse()` 接收一个表示日期的字符串参数，然后尝试根据这个字符串返回相应日期的毫秒数。
通常接受以下日期格式：
- "月/日/年"， 如7/3/2021
- "英文 月 日, 年", 如 March 7, 2021
- "英文星期几 英文月名 日 年 时:分:秒 时区" 如 Sunday March 7 2021 15:53:00 GMT-0700
- ISO 8601 扩展格式 YYYY-MM-DDTHH:mm:ss.sssZ（例如 2004-05-25T00:00:00）。只有兼容ECMAScript 5 的实现支持这种格式。

```javascript
var date1 = new Date(Date.parse("7/3/2021"));
var date2 = new Date(Date.parse("March 7, 2021"))
var date3 = new Date(Date.parse("Sunday March 7 2021 15:53:00 GMT-0700"))
var date4 = new Date(Date.parse("2021-03-07T15:56:00"))
```

如果传入 Date.parse()方法的字符串不能表示日期，那么它会返回 NaN。实际上，如果直接将表示日期的字符串传递给 Date 构造函数，也会在后台调用 Date.parse()。也就说在new Date()里边可以不用写上Date.parse, new Date("7/3/2021")即可。

`Date.UTC()`方法同样也返回表示日期的毫秒数，但它与 Date.parse()在构建值时使用不同的信息。Date.UTC()的参数分别是年份、基于 0 的月份（一月是 0，二月是 1，以此类推）、月中的哪一天（1 到 31）、小时数（0 到 23）、分钟、秒以及毫秒数。在这些参数中，只有前两个参数（年和月）是必需的。如果没有提供月中的天数，则假设天数为 1；如果省略其他参数，则统统假设为 0.

```javascript
var date = new Date(Date.UTC(2021, 2))
```

如同模仿 Date.parse()一样，Date 构造函数也会模仿 Date.UTC()，但有一点明显不同：日期和时间都基于本地时区而非 GMT 来创建.
如果第一个参数是数值，Date 构造函数就会假设该值是日期中的年份，而第二个参数是月份，以此类推.
```javascript
var date = new Date(2021,2)
```

`Date.now()`方法，获取当前时间的毫秒值。支持 Data.now()方法的浏览器包括 IE9+、Firefox 3+、Safari 3+、Opera 10.5 和 Chrome。在不支持它的浏览器中，使用+操作符把 Data 对象转换成字符串，也可以达到同样的目的。
```javascript
Date.now();
+new Date();
```

##### 3.3.1 继承的方法
Date也跟其他引用类型一样，重写了toLocaleString()、toString()、valueOf()方法。
Date 类型的 toLocaleString()方法会按照与浏览器设置的地区相适应的格式返回日期和时间。
toString()方法则通常返回带有时区信息的日期和时间。
valueOf()方法，则根本不返回字符串，而是返回日期的毫秒表示。


### 3.4  RegExp

1. 字面量形式定义正则表达式
语法：
```javascript
var expression = / pattern / flags;
```
pattern是正则表达式，flags用以标明正则表达式的行为。
flags支持下列3个标志：
- g: 表示全局（global）模式，应用于所有字符串（匹配所有），如果没有g标识，则在匹配到第一项时就停止了。
- i: 标识不区分大小写（case-insensitive）模式，匹配时会忽略大小写。
- m: 多行（multiline）模式，在到达一行文本末尾时还会继续查找下一行中是否存在与模式匹配的项。
  
以 `/` 开头，如果没有标识的话也是`/`结尾，有标识最后边就是标识。

```javascript
var pattern1 = /at/g;              // 匹配所有at的字符串
var pattern2 = /[bc]at/i;          // 匹配第一个bat或者cat的字符，不区分大小写
var pattern3 = /.at/gi;            // 匹配所有的以at结尾的3个字符组合，不区分大小写
```
模式中使用的所有元字符都必须转义。正则表达式中的元字符包括
```javascript
( [ { \ ^ $ | ) ? * + .]} 
```

1. 使用RegExp构造函数
接受两个参数（要匹配的字符串模式(也可以是字符串)，标志字符串（可选））
```javascript
var pattern = new RegExp("[bc]at", "i")
var pettern = new RegExp(/[bc]at/, "i")
```
字符串中需要对元字符进行额外的转义
|  字面量模式         |        等价的字符串     |
|     --             |          --            |
|     /\[bc\]at/     |     "\\[bc\\]at"       |
|        /\.at       |       "\\.at"          |
|     /name\/age/    |      "name\\/age"      |
|     /\d.\d{1,2}/   |     "\\d.\\d{1,2}"     |
|   /\w\\hello\\123  |  "\\w\\\\hello\\\\123" |

使用正则表达式字面量和直接调用RegExp构造函数一样，都是一个新实例。

##### RegExp 实例属性
RegExp的每个实例都具有以下属性。
- global: 布尔值。 是否设置了g 标志。
- ignoreCase: 布尔值， 是否设置了i 标志。
- lastIndex: 整数，开始搜索下一个匹配项的字符位置，从0开始。
- multiline：布尔值，是否设置了m 标志。
- source： 正则表达式的字符串表示, 按照字面量形式而非传入构造函数中的字符串模式返回。

```javascript
var pattern1 = /\[bc\]at/i;
alert(pattern1.global); //false
alert(pattern1.ignoreCase); //true
alert(pattern1.multiline); //false
alert(pattern1.lastIndex); //0
alert(pattern1.source); //"\[bc\]at"  如果是字面量形式的表达式，就是少了开头和结尾的/字符后的字符串
var pattern2 = new RegExp("\\[bc\\]at", "i");
alert(pattern2.global); //false
alert(pattern2.ignoreCase); //true
alert(pattern2.multiline); //false
alert(pattern2.lastIndex); //0
alert(pattern2.source); //"\[bc\]at"  如果是字符串形式，需要反转义一下
```

##### 3.4.2 RegExp实例方法

1. `exec()`
RegExp对象的主要方法是`exec()`,该方法是专门为捕获组而设计的。

exec()接受一个参数，即要应用模式的字符串，然后返回包含第一个匹配项信息的数组；或者在没有匹配项的情况下返回 null。
返回的数组虽然是 Array 的实例，但包含两个额外的属性：index 和 input。其中，index 表示匹配项在字符串中的位置，而 input 表示应用正则表达式的字符串。在数组中，第一项是与整个模式匹配的字符串，其他项是与模式中的捕获组匹配的字符串（如果模式中没有捕获组，则该数组只包含一项）。

```javascript
var text = "a mom and dad and baby";
var pattern = /mom( and dad( and baby)?)?/gi;
var matches = pattern.exec(text);
console.log(matches)                           // ["mom and dad", " and dad", undefined, index: 0, input: "mom and dad and baby", groups: undefined]
console.log(matches.index)                     // 0
console.log(matches.input)                     // "mom and dad and baby"
console.log(matches[0])                        // "mom and dad and baby"
console.log(matches[1])                        // "and dad and baby"
console.log(matches[2])                        // "and baby"
```

这个例子中的模式包含两个捕获组.最内部的捕获组匹配"and baby"，而包含它的捕获组匹配"and dad"或者"and dad and baby"。当把字符串传入 exec()方法中之后，发现了一个匹配项。因为整个字符串本身与模式匹配，所以返回的数组 matchs 的 index 属性值为 0。数组中的第一项是匹配的整个字符串，第二项包含与第一个捕获组匹配的内容，第三项包含与第二个捕获组匹配的内容。

对于 exec()方法而言，即使在模式中设置了全局标志（g），它每次也只会返回一个匹配项。在不设置全局标志的情况下，在同一个字符串上多次调用 exec()将始终返回第一个匹配项的信息。而在设置全局标志的情况下，每次调用 exec()则都会在字符串中继续查找新匹配项，

```javascript
var text = "cat, bat, sat, fat";
var pattern = /.at/;
var matches = pattern.exec(text);
console.log(matches)              // ["cat,", index: 0, input: "cat, bat, sat, fat", groups: undefined]
matches = pattern.exec(text);
console.log(matches)              // ["cat,", index: 0, input: "cat, bat, sat, fat", groups: undefined]

var pattern2 = /.at/g;
var matches2 = pattern2.exec(text);
console.log(matches2)              // ["cat,", index: 0, input: "cat, bat, sat, fat", groups: undefined]
matches2 = pattern2.exec(text);
console.log(matches2)              // ["bat", index: 5, input: "cat, bat, sat, fat", groups: undefined]
```

2. `test()`
接受一个字符串参数，在模式与该参数匹配的情况下返回true；否则，返回 false。在只想知道目标字符串与某个模式是否匹配，但不需要知道其文本内容的情况下，使用这个方法非常方便。

```javascript
var text = "000-00-0000";
var pattern = /\d{3}-\d{2}-\d{4}/;
console.log(pattern.test(text))     // true
```

##### 3.4.3 RegExp构造函数属性
RegExp 构造函数包含一些适用与作用域中的所有正则表达式属性，并且基于所执行的最近一次正则表达式操作而变化。这些属性分别有一个长属性名和一个短属性名。

|       长属性名      |       短属性名    |           说明                        |
|         --         |       - -        |               --                      |
|       input        |        $_        |     最近一次要匹配的字符串              |
|     lastMatch      |        $&        |     最近一次的匹配项                   |
|     lastParen      |        $+        |     最近一次匹配的捕获组               |
|    leftContext     |        $`        |    input字符串中lastMatch之前的文本    |
|      multiline     |        $*        |   布尔值，是否所有的表达式都适用多行模式 |
|   rightContext     |        $'        |     input字符串中lastMatch之后的文本   |


```javascript
var text = "this has been a short summer";
var pattern = /(.)hort/g;
if (pattern.test(text)){
 alert(RegExp.input); // this has been a short summer
 alert(RegExp.leftContext); // this has been a
 alert(RegExp.rightContext); // summer
 alert(RegExp.lastMatch); // short
 alert(RegExp.lastParen); // s
 alert(RegExp.multiline); // false
} 

if (pattern.test(text)){
 alert(RegExp.$_); // this has been a short summer
 alert(RegExp["$`"]); // this has been a
 alert(RegExp["$'"]); // summer
 alert(RegExp["$&"]); // short
 alert(RegExp["$+"]); // s
 alert(RegExp["$*"]); // false
} 
```

除了上面介绍的几个属性之外，还有多达 9 个用于存储捕获组的构造函数属性。访问这些属性的语法是 RegExp.$1、RegExp.$2…RegExp.$9，分别用于存储第一、第二……第九个匹配的捕获组。调用 exec()或 test()方法时，这些属性会被自动填充。
```javascript
var text = "this has been a short summer";
var pattern = /(..)or(.)/g;

if (pattern.test(text)){
 alert(RegExp.$1); //sh
 alert(RegExp.$2); //t
} 
```

### 3.5 Function

函数实际上是对象。每个函数都是Function类型的实例，而且都与其他引用类型一样具有属性和方法。由于函数是对象，因此函数名实际上也是一个指向函数对象的指针，不会与某个函数绑定。

创建函数的方式：
1. 函数声明式
  ```javascript
  function sum(num1, num2) {
    return num1 + num2;
  }
  ```

2. 函数表达式
  函数表达式function关键字后面不需要函数名，通过变量sum即可引用函数。
  ```javascript
  var sum = function(num1, num2) {
    return num1 + num2;
  }
  ```

3. 使用构造函数
  Function 构造函数可以接收任意数量的参数，但最后一个参数始终都被看成是函数体，而前面的参数则枚举出了新函数的参数。
  ```javascript
  var sum = new Function("num1", "num2", "return num1 + num2"); // 不推荐
  ```

由于函数名仅仅是指向函数的指针，因此函数名与包含对象指针的其他变量没有什么不同.
  ```javascript
  function sum(num1, num2) {
    return num1 + num2;
  }
  alert(sum(10,10)); //20
  var anotherSum = sum;
  alert(anotherSum(10,10)); //20
  sum = null;
  alert(anotherSum(10,10)); //20 
  ```

#### 3.5.1 函数声明与函数表达式
解析器对函数声明和函数表达式的解析是不一样的。解析器会首先读取函数声明，并使其在执行任何代码之前都可用（函数提升）。至于函数表达式，则是需要等到解析器执行到所在的代码行后才执行（变量提升）。

```javascript
alert(sum(10,10));           // 20
function sum(num1, num2){
  return num1 + num2;
} 
```

因为在代码开始执行之前，解析器就已经通过一个名为函数声明提升（function declaration hoisting）的过程，读取并将函数声明添加到执行环境中。
对代码求值时，JavaScript引擎在第一遍会声明函数并将它们放到源代码树的顶部。所以，即使声明函数的代码在调用它的代码后面，JavaScript 引擎也能把函数声明提升到顶部。

```javascript
alert(sum(10,10));           // undefined
var sum = function(num1, num2){
  return num1 + num2;
} 
```

变量提升，会使得sum在代码最顶部进行声明，所以不会报错，但是初始值是undefined，只有执行到赋值的代码行时才会存在值。


#### 3.5.2  作为值的函数
函数名本身就是变量，所以函数也可以作为值来使用。也就是说，不仅可以像传递参数一样把一个函数传递给另一个函数，而且可以将一个函数作为另一个函数的结果返回。
```javascript
function callSomeFunction(someFunction, someArgument){
  return someFunction(someArgument);
} 
```
这个函数接受两个参数。第一个参数应该是一个函数，第二个参数应该是要传递给该函数的一个值。然后，就可以像下面的例子一样传递函数了。
```javascript
function add10(num){
 return num + 10;
}
var result1 = callSomeFunction(add10, 10);
alert(result1); //20
function getGreeting(name){
 return "Hello, " + name;
}
var result2 = callSomeFunction(getGreeting, "Nicholas");
alert(result2); //"Hello, Nicholas" 
```


#### 3.5.4 函数内部属性
在函数内部，有两个特殊的对象，`arguments`和`this`。
1. `arguments`
一个类数组对象，包含传入函数中的所有参数。该对象中有一个`callee`属性，该
属性是一个指针，指向拥有这个`arguments`对象的函数。


```javascript
function factorial(num) {
  if(num <= 1) {
    return 1;
  }else {
    return num * factorial(num - 1);
  }
}
```
上面是一个阶乘的例子。可以看到函数的执行与函数名factorial耦合在一起，可以使用`arguments.callee`消除。

```javascript
function factorila(num) {
  if(num <= 1) {
    return 1;
  } else {
    return num * arguments.callee(num -1);
  }
}
```

2. `this`
  `this`引用的是函数据以执行的环境对象（当在页面的全局作用域中调用函数时，`this`引用的是`window`）。
  ```javascript
  window.color = "red";
  var o = {color: "blue"};
  function sayColor() {
    alert(this.color)
  }
  sayColor()                // red
  o.sayColor = sayColor;
  o.sayColor();             // blue
  ```
  上面的例子中，`sayColor`函数中引用的this对象并不明确，在代码执行过程中引用不同的对象。在全局作用域中调用该函数，`this`引用的就是全局对象`window`.
  而把这个函数赋给对象o并调用后，`this`引用的是对象o，因此会在对象o中查找color属性。

> 函数的名字仅仅是一个包含指针的变量而已。因此，即使是
在不同的环境中执行，全局的 sayColor()函数与 o.sayColor()指向的仍然是同一
个函数。

ECMAScript5也规范了另一个函数对象的属性： `caller`，这个属性中保存着调用当前函数的函数的引用，如果是在全局作用域中调用当前函数，它的值为 null

```javascript
function outer() {
  inner();
}
function inner() {
  alert(inner.caller)
}
outer();
```
在上面代码中，会显示`outer`函数的源代码，因为`outer`调用了`inner`，所以`inner.caller`指向`outer`.可以结合`arugments.callee`实现解耦
```javascript
function outer() {
  inner()
}
function inner() {
  alert(arguments.callee.caller)
}
outer()
```

>当函数在严格模式下运行时，访问 arguments.callee 会导致错误。ECMAScript 5 还定义了arguments.caller 属性，但在严格模式下访问它也会导致错误，而在非严格模式下这个属性始终是undefined。定义这个属性是为了分清 arguments.caller 和函数的 caller 属性。以上变化都是为了加强这门语言的安全性，这样第三方代码就不能在相同的环境里窥视其他代码了。


#### 3.5.5 函数属性和方法

函数是对象，因此函数也有属性和方法。每个函数都包含两个属性：`length` 和 `prototype`。其中，`length` 属性表示函数希望接收的命名参数的个数。
```javascript
function sayName(name) {
  alert(name)
}
function sum(num1, num2) {
  return num1 + num2;
}
function sayHi() {
  alert("hi");
}
alert(sayName.length);        // 1
alert(sum.length);            // 2
alert(sayHi.length);          // 0
```

`prototype`是保存所有实例方法的真正所在，像`toString`、`valueOf`等方法都是保存在`prototype`下。在创建自定义引用类型以及实现继承时，`prototype` 属性的作用是极为重要的,在 ECMAScript 5 中，prototype 属性是不可枚举的，因此使用 for-in 无法发现.

每个函数都包含两个非继承而来的方法：apply()和 call()。这两个方法的用途都是在特定的作用域中调用函数，实际上等于设置函数体内 this 对象的值。首先，apply()方法接收两个参数：一个是在其中运行函数的作用域，另一个是参数数组。其中，第二个参数可以是 Array 的实例，也可以是arguments 对象。

```javascript
function sum(num1, num2) {
  return num1 + num2;
}
function callSum1(num1, num2) {
  return sum.apply(this, arguments)
}
function callSum2(num1, num2) {
  return sum.apply(this, [num1, num2])
}
alert(callSum1(10, 10))                   // 20
alert(callSum1(10, 10))                   // 20
```

>在严格模式下，未指定环境对象而调用函数，则 this 值不会转型为 window。除非明确把函数添加到某个对象或者调用 apply()或 call()，否则 this 值将是undefined。

call()方法与 apply()方法的作用相同，它们的区别仅在于接收参数的方式不同。对于 call()方法而言，第一个参数是 this 值没有变化，变化的是其余参数都直接传递给函数。换句话说，在使用call()方法时，传递给函数的参数必须逐个列举出来，
```javascript
function sum(num1, num2) {
  return num1 + num2;
}
function callSum(num1, num2) {
  return sum.call(this, num1, num2);
}
alert(callSum(10, 10))                   // 20
```

在使用 call()方法的情况下，callSum()必须明确地传入每一个参数。结果与使用 apply()没有什么不同。至于是使用 apply()还是 call()，完全取决于你采取哪种给函数传递参数的方式最方便。如果你打算直接传入 arguments 对象，或者包含函数中先接收到的也是一个数组，那么使用 apply()肯定更方便；否则，选择 call()可能更合适。（在不给函数传递参数的情况下，使用哪个方法都无所谓。）

`apply`和`call`最强大的地方是扩充作用域。
```javascript
  window.color = "red";
  var o = {color: "blue"};
  function sayColor() {
    alert(this.color);
  }
  sayColor();                // red
  sayColor.call(this);       // red
  sayColor.call(window);     // red
  sayColor.call(o);          // blue
```
sayColor()也是作为全局函数定义的，而且当在全局作用域中调用它时，它确实会显示"red"——因为对 this.color 的求值会转换成对 window.color 的求值。而 sayColor.call(this)和 sayColor.call(window)，则是两种显式地在全局作用域中调用函数的方式，结果当然都会显示"red"。当运行 sayColor.call(o)时，函数的执行环境就不一样了，因为此时函数体内的 this 对象指向了 o，于是结果显示的是"blue"。

ECMAScript 5 还定义了一个方法：bind()。这个方法会创建一个函数的实例，其 this 值会被绑定到传给 bind()函数的值。
```javascript
  window.color = "red";
  var o = {color: "blue"};
  function sayColor() {
    alert(this.color);
  }
  var obj = sayColor.bind(o);
  obj();                          // blue
```


### 3.6 基本包装类型
ECMAScript提供了三个特殊的引用类型：`Boolean`、 `Number` 、`String`。
每当读取一个基本类型值的时候，后台就会创建一个对应的基本包装类型的对象，从而让我们能够调用一些方法来操作这些数据。
```javascript
var string1 = "some text";
var string2 = string1.substring(2);
```
基本类型值不是对象，因而从逻辑上讲它们不应该有方法.其实，为了让我们实现这种直观的操作，后台已经自动完成了一系列的处理。当第二行代码访问 string1 时，访问过程处于一种读取模式，也就是要从内存中读取这个字符串的值。而在读取模式中访问字符串时，后台都会自动完成下列处理:
1. 创建String类型的一个实例
2. 在实例上调用指定的方法
3. 销毁实例

可以将上面的代码理解成如下：
```javascript
var string1 = new String("some text");
var String2 = string1.substring(2)
string1 = null;
```
上述理解也适用与`Boolean`跟`Number`对应的布尔值和数值。

引用类型与基本包装类型的主要区别就是对象的生存期。使用 new 操作符创建的引用类型的实例，在执行流离开当前作用域之前都一直保存在内存中。而自动创建的基本包装类型的对象，则只存在于一行代码的执行瞬间，然后立即被销毁。这意味着我们不能在运行时为基本类型值添加属性和方法。
```javascript
var string1 = "some text";
string1.color = "red"
alert(string1.color);        // undefined
```
在此，第二行代码试图为字符串 string1 添加一个 color 属性。但是，当第三行代码再次访问 string1 时，其 color 属性不见了。问题的原因就是第二行创建的 String 对象在执行第三行代码时已经被销毁了。第三行代码又创建自己的 String 对象，而该对象没有 color 属性。

Object 构造函数也会像工厂方法一样，根据传入值的类型返回相应基本包装类型的实例。
```javascript
var obj = new Object("some text");
alert(obj instanceof String);         //true 
var num = new Object(2)
alert(num instanceof Number);         //true 
```

使用 new 调用基本包装类型的构造函数，与直接调用同名的转型函数是不一样的.
```javascript
var value = "25";
var number = Number(value);           //转型函数
alert(typeof number);                 //"number"
var obj = new Number(value);          //构造函数
alert(typeof obj);                    //"object" 
```

#### 3.6.1 Boolean
Boolean 类型是与布尔值对应的引用类型。要创建 Boolean 对象，可以像下面这样调用 Boolean构造函数并传入 true 或 false 值。
```javascript
var booleanObj = new Boolean(true)
```

Boolean 类型的实例重写了valueOf()方法，返回基本类型值true 或false；重写了toString()方法，返回字符串"true"和"false"。

`布尔表达式中的所有对象都会被转换为 true`
比如说
```javascript
var falseObject = new Boolean(false);
var result = falseObject && true;
alert(result);                            // true
var falseValue = false;
result = falseValue && true;
alert(result);                            // false 
```
在布尔运算中，false && true 等于 false。可是，示例中的这行代码是对falseObject 而不是对它的值（false）进行求值。因此会返回true

基本类型与引用类型的布尔值还有两个区别。首先，typeof 操作符对基本类型返回"boolean"，而对引用类型返回"object"。其次，由于 Boolean 对象是 Boolean 类型的实例，所以使用 instanceof操作符测试 Boolean 对象会返回 true，而测试基本类型的布尔值则返回 false。
```javascript
alert(typeof falseObject);                //object
alert(typeof falseValue);                 //boolean
alert(falseObject instanceof Boolean);    //true
alert(falseValue instanceof Boolean);     //false 
```

> 建议永远不要使用 Boolean 对象。


#### 3.6.2 Number

Number 是与数字值对应的引用类型。要创建 Number 对象，可以在调用 Number 构造函数时向其中传递相应的数值。
```javascript
var numberObj = new Number(1)
```

与 Boolean 类型一样，Number 类型也重写了 valueOf()、toLocaleString()和 toString()方法。重写后的 valueOf()方法返回对象表示的基本类型的数值，另外两个方法则返回字符串形式的数值。可以为toString()方法传递一个表示基数的参数。
```javascript
var num = 10;
alert(num.toString());   //"10"
alert(num.toString(2));  //"1010"
alert(num.toString(8));  //"12"
alert(num.toString(10)); //"10"
alert(num.toString(16)); //"a" 
```

除了继承的方法之外，Number 类型还提供了一些用于将数值格式化为字符串的方法。

1. `toFixed()`
  按照指定的小数位返回数值的字符串表示。
```javascript
var num = 10;
alert(num.toFixed(2))   // "10.00"
```
如果数值本身包含的小数位比指定的还多，那么接近指定的最大小数位的值就会舍入.
```javascript
var num = 10.005;
alert(num.toFixed(2));  //"10.01" 
```

2. `toExponential()`
  返回以指数表示法（e表示法）表示的数值的字符串形式。
  ```javascript
  var num = 10;
  alert(num.toExponential(1))    // "1.0e+1"
  ```

3. `toPrecision()`
  toPrecision()方法可能会返回固定大小（fixed）格式，也可能返回指数（exponential）格式；
  ```javascript
  var num = 99;
  alert(num.toPrecision(1));  //"1e+2"
  alert(num.toPrecision(2));  //"99"
  alert(num.toPrecision(3));  //"99.0" 
  ```
  以上代码首先完成的任务是以一位数来表示 99，结果是"1e+2"，即 100。因为一位数无法准确地表示 99，因此 toPrecision()就将它向上舍入为 100，这样就可以使用一位数来表示它了。而接下来的用两位数表示 99，当然还是"99"。最后，在想以三位数表示 99 时，toPrecision()方法返回了"99.0"。实际上，toPrecision()会根据要处理的数值决定到底是调用 toFixed()还是调用 toExponential()。而这三个方法都可以通过向上或向下舍入，做到以最准确的形式来表示带有正确小数位的值。

#### 3.6.3 String
String 类型是字符串的对象包装类型，可以像下面这样使用 String 构造函数来创建。
```javascript
var stringObj = new String("some text")
```
String 对象的方法也可以在所有基本的字符串值中访问到。其中，继承的 valueOf()、toLocaleString()和 toString()方法，都返回对象所表示的基本字符串值。

String 类型的每个实例都有一个 length 属性，表示字符串中包含多个字符.
```javascript
var string = "some text";
alert(string.length);     // 9
```

String类型存在非常多方法，用于解析和操作字符：
1. 字符方法
  `charAt()`、`charCodeAt()`两个用与访问字符串中特定字符的方法。 `charAt()`方法以单字符字符串的形式返回给定位置的那个字符, 而`charCodeAt()`返回的是字符的编码。
  ```javascript
  var string = "hello world";
  alert(string.charAt(1))     // "e"
  alert(string.charCodeAt(1)) // 111  小写字母"e"的字符编码
  ```

  ECMAScript 5 还定义了另一个访问个别字符的方法。在支持此方法的浏览器中，可以使用方括号加数字索引来访问字符串中的特定字符.
  ```javascript
  var string = "hello world";
  alert(string[1]);           //"e" 
  ```

2. 字符串操作方法
  `concat()`拼接字符串，可以接受任意多个参数。
  ```javascript
  var string1 = "hello ";
  var result = string1.concat("world");
  alert(result);                               // hello world
  var result2 = string1.concat("world", " !");
  alert(result2);                              // hello world !
  ```
  虽然`concat()`是专门用来拼接字符的方法，但是使用`+`操作符更加简便。

  `slice()`、`substr()`、`substring()`三个都是基于字符串创建新字符串的方法（截取字符）。这三个方法都会返回被操作字符串的一个子字符串，而且也都接受一或两个参数。第一个参数指定子字符串的开始位置，第二个参数（在指定的情况下）表示子字符串到哪里结束。具体来说，slice()和substring()的第二个参数指定的是子字符串最后一个字符后面的位置(`不包括最后一个字符`)。而 substr()的第二个参数指定的则是返回的字符个数。如果没有给这些方法传递第二个参数，则将字符串的长度作为结束位置。与concat()方法一样，slice()、substr()和 substring()也不会修改字符串本身的值——它们只是返回一个基本类型的字符串值，对原始字符串没有任何影响。
  ```javascript
  var stringValue = "hello world";
  alert(stringValue.slice(3));       //"lo world"
  alert(stringValue.substring(3));   //"lo world"
  alert(stringValue.substr(3));      //"lo world"
  alert(stringValue.slice(3, 7));    //"lo w" 
  alert(stringValue.substring(3,7)); //"lo w"
  alert(stringValue.substr(3, 7));   //"lo worl" 
  ```

在传递给这些方法的参数是负值的情况下，它们的行为就不尽相同了。其中，slice()方法会将传入的负值与字符串的长度相加(也可理解为从字符末尾开始截取)，substr()方法将负的第一个参数加上字符串的长度(也可理解为从字符末尾开始截取)，而将负的第二个参数转换为 0。最后，substring()方法会把所有负值参数都转换为 0。
```javascript
var stringValue = "hello world";
alert(stringValue.slice(-3));        //"rld"
alert(stringValue.substring(-3));    //"hello world"
alert(stringValue.substr(-3));       //"rld"
alert(stringValue.slice(3, -4));     //"lo w"
alert(stringValue.substring(3, -4)); //"hel"  -4 转换为0后与3交换位置， 变成substring(0, 3)
alert(stringValue.substr(3, -4));    //""（空字符串）
```
注意： `substring()`会将较小的数作为开始位置，将较大的数作为结束位置。

3. 字符串位置方法
  `indexOf()`和`lastIndexOf()`这两个方法都是从一个字符串中搜索给定的子字符串，然后返子字符串的位置（如果没有找到该子字符串，则返回-1）。这两个方法的区别在于：indexOf()方法从字符串的开头向后搜索子字符串，而 lastIndexOf()方法是从字符串的末尾向前搜索子字符串。

  ```javascript
  var string = "hello world";
  alert(string.indexOf("o"))      // 4
  alert(string.lastIndexOf("o"))  // 7
  ```

  这两个方法都可以接收可选的第二个参数，表示从字符串中的哪个位置开始搜索。
  ```javascript
  var string = "hello world";
  alert(string.indexOf("o", 6))      // 7
  alert(string.lastIndexOf("o", 4))  // 4
  ```

4. `trim()`方法
  这个方法会创建一个字符串的副本，删除前置及后缀的所有空格，然后返回结果。
  ```javascript
  var stringValue = " hello world ";
  var trimmedStringValue = stringValue.trim();
  alert(stringValue); //" hello world "
  alert(trimmedStringValue); //"hello world" 
  ```

  >此外，Firefox 3.5+、Safari 5+和 Chrome 8+还支持非标准的 trimLeft()和 trimRight()方法，分别用于删除字符串开头和末尾的空格。

5. 字符串大小写转换方法
  `toLowerCase()`、`toLocaleLowerCase()`、`toUpperCase()`和 `toLocaleUpperCase()`。
  其中，toLowerCase()和 toUpperCase()是两个经典的方法.而 toLocaleLowerCase()和 toLocaleUpperCase()方法则是针对特定地区的实现。
  ```javascript
  var stringValue = "hello world";
  alert(stringValue.toLocaleUpperCase());  //"HELLO WORLD"
  alert(stringValue.toUpperCase());        //"HELLO WORLD"
  alert(stringValue.toLocaleLowerCase());  //"hello world"
  alert(stringValue.toLowerCase());        //"hello world" 
  ```

6. 字符串的模式匹配方法
  - `match()`方法，在字符串上调用这个方法，本质上与调用`RegExp`的`exec()`方法相同，`match`方法只接受一个参数，要么是一个正则表达式，要么是一个RegExp对象。
  ```javascript
  var text = "cat, bat, sat, fat";
  var pattern = /.at/;

  var matches = text.match(pattern);
  alert(matches.index)                // 0
  alert(matches[0])                   // cat
  ```
  match()方法返回了一个数组；如果是调用 RegExp 对象的 exec()方法并传递本例中的字符串作为参数，那么也会得到与此相同的数组：数组的第一项是与整个模式匹配的字符串，之后的每一项（如果有）保存着与正则表达式中的捕获组匹配的字符串。
  - `search`这个方法的唯一参数与 match()方法的参数相同：由字符串或 RegExp 对象指定的一个正则表达式。search()方法返回字符串中第一个匹配项的索引；如果没有找到匹配项，则返回-1。而且，search()方法始终是从字符串开头向后查找模式。
  ```javascript
  var text = "cat, bat, sat, fat";
  var pos = text.search(/at/);
  alert(pos)                          // 1
  ```
  - `replace()`这个方法接受两个参数：第一个参数可以是一个 RegExp 对象或者一个字符串（这个字符串不会被转换成正则表达式），第二个参数可以是一个字符串或者一个函数。如果第一个参数是字符串，那么只会替换第一个子字符串。要想替换所有子字符串，唯一的办法就是提供一个正则表达式，而且要指定全局（g）标志，
  ```javascript
  var text = "cat, bat, sat, fat";
  var result = text.replace("at", "ond");
  alert(result);                           // cond, bat, sat, fat

  result = text.replage(/at/g, "ond");
  alert(result);                           // cond, bond, sond, fond
  ```
  replace()方法的第二个参数也可以是一个函数。在只有一个匹配项（即与模式匹配的字符串）的情况下，会向这个函数传递 3 个参数：模式的匹配项、模式匹配项在字符串中的位置和原始字符串。
  ```javascript
  function htmlEscape(text){
    return text.replace(/[<>"&]/g, function(match, pos, originalText){
      switch(match){
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case "&":
          return "&amp;";
        case "\"":
          return "&quot;";
      }
    });
  }
  alert(htmlEscape("<p class=\"greeting\">Hello world!</p>"));
  //&lt;p class=&quot;greeting&quot;&gt;Hello world!&lt;/p&gt; 
  ```
  - `split()`法可以基于指定的分隔符将一个字符串分割成多个子字符串，并将结果放在一个数组中。分隔符可以是字符串，也可以是一个 RegExp 对象
  split()方法可以接受可选的第二个参数，用于指定数组的大小，以便确保返回的数组不会超过既定大小。
  ```javascript
  var colorText = "red,blue,green,yellow";
  var colors1 = colorText.split(",");      //["red", "blue", "green", "yellow"]
  var colors2 = colorText.split(",", 2);   //["red", "blue"]
  var colors3 = colorText.split(/[^\,]+/); //["", ",", ",", ",", ""] 
  ```

7. fromCharCode()
  String 构造函数本身还有一个静态方法：fromCharCode()。这个方法的任务是接收一或多个字符编码，然后将它们转换成一个字符串。从本质上来看，这个方法与实例方法 charCodeAt()执行的是相反的操作。
  ```javascript
  alert(String.fromCharCode(104, 101, 108, 108, 111)); //"hello" 
  ```

### 3.7 单体内置对象
ECMA-262 对内置对象的定义是：“由 ECMAScript 实现提供的、不依赖于宿主环境的对象，这些对象在 ECMAScript 程序执行之前就已经存在了。”

#### 3.7.1 Global对象
所有在全局作用域中定义的属性和函数，都是 Global 对象的属性。
1. URI编码方法
  Global 对象的 encodeURI()和 encodeURIComponent()方法可以对 URI（Uniform Resource Identifiers，通用资源标识符）进行编码，以便发送给浏览器。
  encodeURI()主要用于整个 URI（例如，http://www.wrox.com/illegal value.htm），而 encodeURIComponent()主要用于对 URI 中的某一段（例如前面 URI 中的 illegal value.htm）进行编码。它们的主要区别在于，encodeURI()不会对本身属于 URI 的特殊字符进行编码，例如冒号、正斜杠、问号和井字号；而 encodeURIComponent()则会对它发现的任何非标准字符进行编码。
  ```javascript
  var uri = "http://www.wrox.com/illegal value.htm#start";
  alert(encodeURI(uri))             //"http://www.wrox.com/illegal%20value.htm#start"
  alert(encodeURIComponent(uri))    // "http%3A%2F%2Fwww.wrox.com%2Fillegal%20value.htm%23start"
  ```
  `decodeURI()`和`decodeURIComponent()`分别对应`encodeURI`和`encodeComponent`。decodeURI()只能对使用 encodeURI()替换的字符进行解码。，decodeURIComponent()能够解码任何特殊字符的编码。
  ```javascript
  var uri = "http%3A%2F%2Fwww.wrox.com%2Fillegal%20value.htm%23start";
  //http%3A%2F%2Fwww.wrox.com%2Fillegal value.htm%23start        %23不能解析出来，因为不是由encodeURI进行编码的
  alert(decodeURI(uri));
  //http://www.wrox.com/illegal value.htm#start
  alert(decodeURIComponent(uri)); 
  ```

2. `eval()`
  类似一个解析器。只接受一个参数，即要执行的 ECMAScript（或 JavaScript）字符串。
  ```javascript
  eval("alert('hi')"); 
  // 相当于
  alert("hi")
  ```
  eval内部代码是`包含在执行环境`的一部分
  ```javascript
  var msg = "hi";
  eval("alert(msg)") // hi

  eval("function sayHi(){ alert('hi') }");
  sayHi()            // hi
  ```
  `在 eval()中创建的任何变量或函数都不会被提升`，因为在解析代码的时候，它们被包含在一个字符串中；它们只在 eval()执行的时候创建。

3. Global对象的所有属性
  |       属性       |        说明         |
  |       --        |          --         |
  |     undefined   |    特殊值undefined   |
  |        NaN      |    特殊值 NaN        |
  |     Infinity    |    特殊值 Infinity   |
  |     Object      |    特殊值 Object     |
  |     Array       |    特殊值 Array      |
  |     Function    |    特殊值 Function   |
  |     Boolean     |    特殊值 Boolean    |
  |     String      |    特殊值 String     |
  |     Number      |    特殊值 Number     |
  |     Date        |    构造函数 Date       |
  |     RegExp      |    构造函数 RegExp     |
  |     Error       |    构造函数 Error      |
  |     EvalError   |    构造函数 EvalError  |
  |     RangeError  |    构造函数 RangeError |
  | ReferenceError  |    构造函数ReferenceError |
  |    SyntaxError  |    构造函数SyntaxError |
  |     TypeError   |    构造函数TypeError   |
  |     URIError    |    构造函数 URIError   |


#### 3.7.2 window对象
ECMAScript 虽然没有指出如何直接访问 Global 对象，但 Web 浏览器都是将这个全局对象作为window 对象的一部分加以实现的。因此，在全局作用域中声明的所有变量和函数，就都成为了 window对象的属性。


#### 3.7.3 Math对象

1. Math对象的属性
用于计算数学公式。
|       属性        |       说明            |
|        --         |         --           |
|     Math.E        |   自然对数的底数，常量e|             
|     Math.LN10     |   10的自然对数        |
|     Math.LN2      |   2的自然对数         |    
|     Math.LOG2E    |   以2为底e的对数      |    
|     Math.LOG10E   |   以10为底e的对数     |    
|     Math.PI       |   Π的值              |    
|     Math.SQRT1_2  |   1/2的平方根         |    
|     Math.SQRT2    |   2的平方根           |    

2. min() 和 max() 方法
  min()和 max()方法用于确定一组数值中的最小值和最大值。
  ```javascript
  var nums = [1,2,3,4,5,6];
  alert(Math.min(nums));    // 1 
  alert(Math.max(nums));    // 6
  ```

3. 舍入方法
  - Math.ceil() ， 向上取整
  - Math.floor(), 向下取整
  - Math.round(), 四舍五入
  ```javascript
  alert(Math.ceil(4.4))    // 5
  alert(Math.floor(4.5))   // 4
  alert(Math.round(4.5))   // 5
  alert(Math.round(4.4))   // 4
  ```
  
4. random()
  随机取值

5. 其他方法
|      方法              |        说明            |
|      --                |         --             |
|    Math.abs(num)       |    返回绝对值           |
|    Math.exp(num)       |    返回Math.E的num次幂  |
|    Math.log(num)       |    返回num的自然对数     |
|    Math.pow(num,power) |    返回num的power次幂    |
|    Math.sqrt(num)      |    返回num的平方根       |
|    Math.acos(x)        |    返回x的反余弦值       |
|    Math.asin(x)        |    返回x的反正弦值       |
|    Math.atan(x)        |    返回x的反正切值       |
|    Math.atan2(y,x)     |    返回y/x的反正切值     |
|    Math.cos(x)         |    返回x的余弦值         |
|    Math.sin(x)         |    返回x的正弦值         |
|    Math.tan(x)         |    返回x的正切值         |

