# CSS
## 1、盒子模型
标准盒子模型：宽度=内容宽度（content）+左右padding+左右margin+border
IE盒子模型（怪异盒子模型）：宽度=内容宽度（content+左右padding+border）+左右margin

box-sizing 属性允许以特定的方式定义匹配某个区域的特定元素。

box-sizing: content-box; 宽度和高度分别应用到元素的内容框。在宽度和高度之外绘制元素的内边距和边框。

box-sizing: border-box; 为元素设定的宽度和高度决定了元素的边框盒。就是说，为元素指定的任何内边距和边框都将在已设定的宽度和高度内进行绘制。通过从已设定的宽度和高度分别减去边框和内边距才能得到内容的宽度和高度。

即box-sizing属性可以指定盒子模型种类，content-box指定盒子模型为W3C（标准盒子模型），border-box为IE盒子模型（怪异盒子模型）。

## 2、css的各种常用选择器

id选择器(#myid)、类选择器(.myclassname)、标签选择器(div, h1, p)、相邻选择器(h1 + p)、子选择器（ul > li）、后代选择器（li a）、通配符选择器（*，所有元素）、属性选择器（a[rel=”external”]）、伪类选择器（a:hover, p:nth-child）

**选择器优先级：**
在属性后面使用 !important 会覆盖页面内任何位置定义的元素样式。

 - 元素内style属性中的样式（行内样式） 
 - id选择器 
 - 类选择器 
 - 标签选择器 
 - 通配符选择器 
 - 浏览器自定义或继承

优先级顺序：!important > 行内样式>ID选择器 > 类选择器 > 标签 > 通配符 > 继承 > 浏览器默认属性

**权重规则：**

第一等：代表内联样式，权值为1000。
第二等：代表id选择器，，权值为0100。
第三等：代表类，伪类和属性选择器，权值为0010。
第四等：代表类型选择器和伪元素选择器，如div p，权值为0001。
通配符、子选择器、相邻选择器等的。如*、>、+,权值为0000。

通过权重计算来实现样式的展示。

## 3、css中的常用的可继承属性和不可继承属性
可继承的属性：color，line-height，font，font-family，font-size，font-style，font-variant，font-weight，text-decoration，text-transform，direction等等。

不可继承的样式：border, padding, margin, width, height，display，overflow，position，left，right，top，bottom，z-index，float，clear，table-layout，vertical-align等等。

## 4、flexbox
Flex 是 Flexible Box 的缩写，意为"弹性布局"，用来为盒状模型提供最大的灵活性。设置为 Flex 布局以后，子元素的float、clear和vertical-align属性将失效。
采用 Flex 布局的元素，称为 Flex 容器。
**flex容器**里边有6个属性：
 - **flex-direction** （主轴方向； **row**(水平方向，左端开始) | **row-reverse**（水平方向，右端开始） | **column**（垂直方向，上边开始） | **column-reverse**（垂直方向，下边开始））
 - **flex-wrap** （换行； **nowrap**（不换行，超过的部分不显示） | **wrap**（换行，第一行在上边） | **wrap-reverse**（换行，第一行在下边））
 - **flex-flow** （是flex-direction属性和flex-wrap属性的简写形式）
 - **justify-content** （定义了容器内元素在主轴上的对齐方式；  **flex-start**（左对齐） | **flex-end**（右对齐） | **center**（居中） | **space-between** （两端对齐，容器内元素之间的间隔都相等）| **space-around** （容器内元素两侧的间隔相等。所以，各元素之间的间隔比元素与边框的间隔大一倍）;）
 - **align-items** （定义容器内元素在交叉轴上如何对齐，**flex-start** （交叉轴的起点对齐，例如主轴是左对齐，那么交叉轴为竖直的，起点就为上边） | **flex-end** （交叉轴的终点对齐） | **center**  （交叉轴的中点对齐）| **baseline**  （第一行文字的基线对齐）| **stretch** （如果元素未设置高度或设为auto，将占满整个容器的高度）
）
 - **align-content**  （定义了多根轴线的对齐方式。如果容器内的元素只有一根轴线，该属性不起作用； **flex-start** （与交叉轴的起点对齐）| **flex-end**（与交叉轴的终点对齐） | **center**（与交叉轴的中点对齐） | **space-between**（与交叉轴两端对齐，轴线之间的间隔平均分布） | **space-around**（每根轴线两侧的间隔都相等。所以，轴线之间的间隔比轴线与边框的间隔大一倍） | **stretch**（轴线占满整个交叉轴））

flex容器内各元素内的属性：

 - order   定义元素的排列顺序。数值越小，排列越靠前，默认为0
 - flex-grow  定义元素的放大比例，默认为0
 - flex-shrink  定义了元素的缩小比例，默认为1
 - flex-basis 
 - flex  flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto
 - align-self 允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性。默认值为auto，表示继承父元素的align-items属性，如果没有父元素，则等同于stretch

## 5、元素居中
1、
```javascript
#juzhong{
   width: 100px;
   height: 100px;
   margin: 0 auto;
   background-color: red;
}
```
2、绝对定位居中

```javascript
	#juzhong{
      width: 100px;
      height: 100px;
      background-color: red;
      position: absolute;
      left: 0;
      right: 0;
      margin: 0 auto;
    }
```
3、相对定位居中

```javascript
	#juzhong{
      width: 100px;
      height: 100px;
      background-color: red;
      position: relative;
      left: 50%;
      transform: translate(50%,0);
    }
```

3、浮动居中

```javascript
	#juzhong{
      width: 100px;
      height: 100px;
      background-color: red;
      position: absolute;
      float: left;
      left: 50%;
      margin: 0 -50px;
    }
```
4、flexbox居中

```javascript
	#juzhongfather{
      display: flex;
      justify-content: center;
    }
    #juzhong{
      width: 100px;
      height: 100px;
      background-color: red;
    }
```

## 6、元素垂直居中
1、绝对定位垂直居中
```javascript
#center{
  width: 100px;
  height: 100px;
  position: absolute;
  background-color: black;
  top: 0;
  bottom:0;
  left: 0;
  margin: auto;
  right: 0;
}
```
2、

```javascript
#center{
  width: 100px;
  height: 100px;
  position: absolute;
  background-color: black;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);     //transform可换成margin:-50px 0 0 -50px;   method3
}
```
3、flexbox垂直居中

```javascript
	#juzhongfather{
      display:flex;
      justify-content: center;
      align-items: center;
    }
    #juzhong{
      width: 100px;
      height: 100px;
      background-color: red;
    }
```

## 7、position的值
static（默认）：按照正常文档流进行排列；
relative（相对定位）：不脱离文档流，参考自身静态位置通过 top, bottom, left, right 定位；
absolute(绝对定位)：参考距其最近一个不为static的父级元素通过top, bottom, left, right 定位；
fixed(固定定位)：所固定的参照对像是可视窗口。

## 8、三列，左右宽度固定，中间宽度自适应
1、float布局

```javascript
<style>
.left{
  float: left;
  width: 200px;
  background-color: blue;
}
.right{
  float: right;
  width: 200px;
  background-color: gray;
}
.middle{
  margin-right: 200px;
  margin-left: 200px;
  background-color: red;
}
</style>
<body>
	<div class="left">left</div>  //div的顺序一定是左右中！！
	<div class="right">right</div>
    <div class="middle" >middle</div>
</body>
```
2、flex布局

```javascript
<style>
.content{
  flex: 1;
  flex-direction: row;
  display: flex;
}
.left{
  background-color: blue;
  height: 100px;
  width: 100px;
}
.middle{
  background-color: red;
  height: 100px;
  flex:1;
}
.right{
  background-color: pink;
  width: 100px;
}
</style>
<body>
	<div class="content">
      <div class="left"></div>   //flex布局就按照左中右
      <div class="middle" ></div>
      <div class="right"></div>
    </div>
</body>
```

## 9、css创建一个三角形
一般情况下, 我们设置盒子的宽高度, 及上下左右边框。会呈现如下效果
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200303131043511.png)
将盒子的宽高设置0后，效果如下：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200303131134805.png)
可以看到整个图形其实是由4个边界的样式构成，将其中3个边界的样式颜色设置transparent，后，就可以呈现出三角形的效果。
```javascript
.triangle{
  width: 0;
  height: 0;
  border-top: 40px solid #FF9600;
  border-left: 40px solid transparent;
  border-right: 40px solid transparent;
  border-bottom: 40px solid transparent;
}
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200303131651272.png)

## 10、品字布局

```javascript
.content{        //上边一个
  background-color: tomato;
  width: 100%;
  height: 600px;
}
.content1{      //下边两个用float设置为不换行
  float: left;
  width: 50%;
  height: 600px;
  background-color: violet;
}
.content2{
  float: right;
  width: 50%;
  background-color: teal;
  height: 600px;
}
```

## 10、回流与重绘
浏览器把获取到的HTML代码解析成1个DOM tree（包含了所有HTML标签，包括display:none隐藏，还有用JS动态添加的元素等），DOM tree与样式组合构建render tree（不包含隐藏的节点）。
**回流：**
当render tree中的一部分(或全部)因为元素的规模尺寸，布局，隐藏等改变而需要重新构建。这就称为回流(reflow)。每个页面至少需要一次回流，就是在页面第一次加载的时候，构建render tree。回流也被称为重排，其实从字面上来看，重排更容易让人形象易懂（即重新排版整个页面）

**重绘：**

当render tree中的一些元素需要更新属性，而这些属性只是影响元素的外观，风格，而不会影响布局的，比如background-color。则就叫称为重绘。

**回流必将引起重绘，而重绘不一定会引起回流**

**减少回流和重绘的方法：**

 1. 尽可能在DOM树的最末端改变class
 2. 避免设置多层内联样式
 3. 避免使用table布局
 4. 对于复杂动画效果,使用绝对定位让其脱离文档流
 5. 使用css3硬件加速，可以让transform、opacity、filters等动画效果不会引起回流重绘

## 11、display:none与visibility：hidden的区别
display：none 不显示对应的元素，在文档布局中不再分配空间（回流+重绘）
visibility：hidden 隐藏对应元素，在文档布局中仍保留原来的空间（重绘）

## 12、BFC
BFC（Block Formatting Context）格式化上下文，是Web页面中盒模型布局的CSS渲染模式，指一个独立的渲染区域或者说是一个隔离的独立容器。
**形成条件：**
 1. 浮动元素，float 除 none 以外的值；
 2. 定位元素，position（absolute，fixed）； 
 3. display 为以下其中之一的值 inline-block，table-cell，table-caption； 
 4. overflow 除了 visible 以外的值（hidden，auto，scroll）；

特性：
 1. 内部的Box会在垂直方向上一个接一个的放置。
 2. 垂直方向上的距离由margin决定 （bfc内部的元素之间margin会折叠，不是两个外边距之和，而是以较大的为准，例如有两个元素，一个的margin为10px，另一个为20px,第二个与第一个之间的margin不是30px，而是20px。）
 3. bfc的区域不会与float的元素区域重叠。（上边的三列）
 4. 计算bfc的高度时，浮动元素也参与计算 
 5. bfc就是页面上的一个独立容器，容器里面的子元素不会影响外面元素。

## 13、float浮动
CSS 的 Float（浮动），会使元素向左或向右移动，其周围的元素也会重新排列。
**特性：**
**1、浮动的元素脱标**
即浮动元素脱离正常的文档流
**2、浮动的元素互相贴靠**
**3、收缩**
一个浮动的元素，如果没有设置width，那么将自动收缩为内容的宽度
**4、浮动的元素会被包围**
即在浮动元素会被非浮动元素包围。

设置元素浮动后，该元素的display值为block。

浮动带来的问题：

 - 父元素的高度无法被撑开（如果父元素没有设置高度，其子元素全部浮动，父元素的高度为0）
 - 与浮动元素同级的非浮动元素（内联元素）会跟随其后（如果高度大于浮动元素就会形成包围）
 - 若非第一个元素浮动，则该元素之前的元素也需要浮动，否则会影响页面显示的结构。

清除浮动的方法：

 - 父级div定义height 
 - 最后一个浮动元素后加空div标签 并添加样式clear:both。
 - 包含浮动元素的父标签添加样式overflow为hidden或auto。 

## 14、常见的块级元素，行内元素
块级元素：
div、h1-h6、ul、ol、form、dl、dt、dd、p、table

行内元素：
span、a、b、strong、em、input、img、i、del、label

## 15、媒体查询@media
通过媒体查询可以为不同大小和尺寸的媒体定义不同的css，适应相应的设备的显示。
首先需要设置meta标签

```javascript
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```
格式：
```javascript
    /* 屏幕尺寸大于960px时（普通彩色屏幕） */
    @media only screen and (min-width:960px){ }

    /* 屏幕尺寸小于1440px时 */
    @media only screen and (max-width:1440px){ }

    /* 屏幕尺寸大于960px而小于1920px */
    @media only screen  (min-width: 960px) and (max-width: 1920px){ }

    /* 屏幕大于2000px时（MAC) */
    @media only screen and (min-width:2000px){ }

    /*  当设备可视宽度小于480px (iphone)*/
    @media only screen and (max-device-width:480px){ }

    /* 当设备可视宽度等于768px时 (iPad) */
    @media only screen and (device-width:768px){ }

    /* 屏幕尺寸大于481px而小于1024px (iPad 竖屏) */
    @media only screen and (min-device-width: 481px) and (max-device-width: 1024px) and (orientation:portrait) { }

    /* 屏幕尺寸大于481px而小于1024px (iPad横屏) */
    @media only screen and (min-device-width: 481px) and (max-device-width: 1024px) and (orientation:landscape) { }
```

## 16、css预处理
CSS预处理器是一种专门的编程语言，用来为CSS增加一些编程特性（CSS本身不是编程语言）。
不需要考虑浏览器兼容问题，因为CSS预处理器最终编译和输出的仍是标准的CSS样式。
可以在CSS预处理器中：使用变量、简单逻辑判断、函数等基本编程技巧。
**Sass：**
特点：

 1. 变量（所有变量以$开头；变量镶嵌在字符串中，必须写在#{}之中，允许代码使用算式）

```javascript
$blue:#1875e7;
div{
    color:$blue;
    border-#{$side}-radius:5px;
    margin:(14px/2);
    top:50px+100px;
    right:$var*10%;
}
```

 2. 嵌套规则
后代选择器，在一个class中内嵌其他class

```javascript
.father{
	.son{
		color:red
	}
	.son2{
		color:blue
	}
}
```
子选择器

```javascript
.father{
	>.son{
		color:red
	}
}
```
 3. 嵌套属性
 属性名称有些部分是一样的，可以写成如下
 

```javascript
.borderBox {
  border: {
    width: 10px;
    style: solid;
    color: red;
  }
}
相当于
.borderBox {
    border-width: 10px;
    border-style: solid;
    border-color: red;
}
```

 4. 混合器

混合器使用@mixin标识符定义，重复样式可以用到

```javascript
@mixin borderstyle {
  border: 1px solid red;
  font-size: 16px;
  font-weight: bold;
}
.testBox {
  @include borderstyle;
}
相当于
.testBox {
  border: 1px solid red;
  font-size: 16px;
  font-weight: bold;
}
```

## 17、margin和padding的适用场景

**margin：**
 - 需要在border外侧添加空白 
 - 空白处不需要背景色 
 - 上下相连的两个盒子之间的空白，需要相互抵消时。

**padding：**

 - 需要在border内侧添加空白 
 - 空白处需要背景颜色 
 - 上下相连的两个盒子的空白，希望为两者之和。

兼容性的问题：在IE5 IE6中，为float的盒子指定margin时，左侧的margin可能会变成两倍的宽度。通过改变padding或者指定盒子的display：inline解决。

## 18、响应式设计
响应式网站设计(Responsive Web design)是一个网站能够兼容多个终端。
基本原理是通过媒体查询检测不同的设备屏幕尺寸做处理。
页面头部必须有meta声明。

## 19、style标签写在body后与body前的区别
写在body标签前，因为页面加载是自上而下，所以会首先加载样式。
写在body标签后由于浏览器以逐行方式对HTML文档进行解析，当解析到写在尾部的样式表（外联或写在style标签）会导致浏览器停止之前的渲染，等待加载且解析样式表完成之后重新渲染，在windows的IE下可能会出现FOUC现象（即样式失效导致的页面闪烁问题）。

## 20、FOUC
文档样式短暂失效FOUC(Flash of Unstyled Content)

如果使用import方法对CSS进行导入,会导致某些页面在Windows 下的Internet Explorer出现一些奇怪的现象:以无样式显示页面内容的瞬间闪烁,这种现象称之为文档样式短暂失效，简称为FOUC。原因：

 1. 使用import方法导入样式表。
 2. 将样式表放在页面底部
 3. 存在多个style标签

   当样式表晚于结构性html加载，当加载到此样式表时，页面将停止之前的渲染。此样式表被下载和解析后，将重新渲染页面，也就出现了短暂的花屏现象。解决方法：使用LINK标签将样式表放在文档HEAD中。

## 21、CSS Sprites
CSS Sprites其实就是把网页中一些背景图片整合到一张图片文件中，再利用CSS的“background-image”，“background- repeat”，“background-position”的组合进行背景定位，background-position可以用数字能精确的定位出背景图片的位置。
CSS Sprites为一些大型的网站节约了带宽，让提高了用户的加载速度和用户体验，不需要加载更多的图片


## 22、transform、translate、transition 属性

 - transform 是指变换、变形，是 css3 的一个属性，和 width，height 属性一样；
 - translate 是 transform 的属性值，是指元素进行 2D(3D)维度上位移或范围变换;
 - transition 是指过渡效果，往往理解成简单的动画，需要有触发条件。
