## 像素

在静态网页中，我们经常用像素（px）作为单位，来描述一个元素的宽高以及定位信息。在pc端，通常认为css中,1px所表示的真实长度是固定的。

像素是网页布局的基础，一个像素表示了计算机屏幕所能显示的最小区域，像素分为两种类型：css像素和物理像素。

我们在js或者css代码中使用的px单位就是指的是css像素，物理像素也称设备像素，只与设备或者说硬件有关，同样尺寸的屏幕，设备的密度越高，物理像素也就越多。下表表示css像素和物理像素的具体区别：

- css像素为web开发者提供，在css中使用的一个抽象单位物理像素只与设备的硬件密度有关，任何设备的物理像素都是固定的。


### 视口
广义的视口，是指浏览器显示内容的屏幕区域，狭义的视口包括了布局视口、视觉视口和理想视口。

1. 布局视口

布局视口定义了pc网页在移动端的默认布局行为，因为通常pc的分辨率较大，布局视口默认为980px。也就是说在不设置网页的viewport的情况下，pc端的网页默认会以布局视口为基准，在移动端进行展示。因此我们可以明显看出来，默认为布局视口时，根植于pc端的网页在移动端展示很模糊。

2. 视觉视口（visual viewport）

视觉视口表示浏览器内看到的网站的显示区域，用户可以通过缩放来查看网页的显示内容，从而改变视觉视口。视觉视口的定义，就像拿着一个放大镜分别从不同距离观察同一个物体，视觉视口仅仅类似于放大镜中显示的内容，因此视觉视口不会影响布局视口的宽度和高度。

3. 理想视口（ideal viewport）

理想视口或者应该全称为“理想的布局视口”，在移动设备中就是指设备的分辨率。换句话说，理想视口或者说分辨率就是给定设备物理像素的情况下，最佳的“布局视口”。


上述视口中，最重要的是要明确理想视口的概念，在移动端中，理想视口或者说分辨率跟物理像素之间有什么关系呢？

为了理清分辨率和物理像素之间的联系，我们介绍一个用DPR（Device pixel ratio）设备像素比来表示，则可以写成：
```js
DPR = 物理像素／分辨率
```
在不缩放的情况下，一个css像素就对应一个dpr，也就是说，在不缩放
```
1 CSS像素 = 物理像素／分辨率
```
此外，在移动端的布局中，我们可以通过viewport元标签来控制布局，比如一般情况下，我们可以通过下述标签使得移动端在理想视口下布局：
```html
<meta id="viewport" name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1; user-scalable=no;">
```
上述meta标签的每一个属性的详细介绍如下：

属性名取值描述width正整数定义布局视口的宽度，单位为像素height正整数定义布局视口的高度，单位为像素，很少使用initial-scale[0,10]初始缩放比例，1表示不缩放minimum-scale[0,10]最小缩放比例maximum-scale[0,10]最大缩放比例user-scalableyes／no是否允许手动缩放页面，默认值为yes

其中我们来看width属性，在移动端布局时，在meta标签中我们会将width设置称为device-width，device-width一般是表示分辨率的宽，通过width=device-width的设置我们就将布局视口设置成了理想的视口。

### px 与自适应

上述我们了解到了当通过viewport元标签，设置布局视口为理想视口时，1个css像素可以表示成：
```
1 CSS像素 = 物理像素／分辨率
```
我们直到，在pc端的布局视口通常情况下为980px，移动端以iphone6为例，分辨率为375 * 667，也就是说布局视口在理想的情况下为375px。比如现在我们有一个750px * 1134px的视觉稿，那么在pc端，一个css像素可以如下计算：
```
PC端： 1 CSS像素 = 物理像素／分辨率 = 750 ／ 980 =0.76 px
```
而在iphone6下：
```
iphone6：1 CSS像素 = 物理像素 ／分辨率 = 750 ／ 375 = 2 px
```
也就是说在PC端，一个CSS像素可以用0.76个物理像素来表示，而iphone6中 一个CSS像素表示了2个物理像素。此外不同的移动设备分辨率不同，也就是1个CSS像素可以表示的物理像素是不同的，因此如果在css中仅仅通过px作为长度和宽度的单位，造成的结果就是无法通过一套样式，实现各端的自适应。

### 百分比

1. 子元素height和width的百分比

子元素的height或width中使用百分比，是相对于子元素的直接父元素，width相对于父元素的width，height相对于父元素的height。比如：
```html
<div class="parent">
  <div class="child"></div>
</div>
```
如果设置： .father{ width:200px; height:100px; } .child{ width:50%; height:50%; }。

2. top和bottom 、left和right
子元素的top和bottom如果设置百分比，则相对于直接非static定位(默认定位)的父元素的高度。

同样子元素的left和right如果设置百分比，则相对于直接非static定位(默认定位的)父元素的宽度。


3. padding
子元素的padding如果设置百分比，不论是垂直方向或者是水平方向，都相对于直接父亲元素的width，而与父元素的height无关。
```css
.parent{
  width:200px;
  height:100px;
  background:green;
}
.child{
  width:0px;
  height:0px;
  background:blue;
  color:white;
  padding-top:50%;
  padding-left:50%;
}
```

4. margin

跟padding一样，margin也是如此，子元素的margin如果设置成百分比，不论是垂直方向还是水平方向，都相对于直接父元素的width。

5. border-radius

border-radius不一样，如果设置border-radius为百分比，则是相对于自身的宽度，举例来说：
```html
<div class="trangle"></div>
```
设置border-radius为百分比：
```css
.trangle{
  width:100px;
  height:100px;
  border-radius:50%;
  background:blue;
  margin-top:10px;
}
```

## `position`

### `stickly`
基本上，可以看出是`position:relative`和`position:fixed`的结合体——当元素在屏幕内，表现为`relative`，就要滚出显示器屏幕的时候，表现为`fixed`。

```css
nav {
    position: -webkit-sticky;
    position: sticky;
    top: 0;
}
```
随着页面的滚动，当导航距离上边缘0距离的时候，黏在了上边缘，表现如同position:fixed。

**sticky元素效果完全受制于父级元素们**，而fixed元素直抵页面根元素，其他父元素对其left/top定位无法限制


## 行内元素/块状元素

## flex

### flex布局

### 用flex实现九宫格

### flex: 1指的是什么， flex属性默认值

flex: flex-grow, flex-shrink 和 flex-basis的简写。
flex 的默认值是以上三个属性值的组合。假设以上三个属性同样取默认值，则 flex 的默认值是 0 1 auto。

当 flex 取值为一个非负数字，则该数字为 flex-grow 值，flex-shrink 取 1，flex-basis 取 0%，如下是等同的：
```css
.item {flex: 1;}
.item {
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: 0%;
}
```
当 flex 取值为 0 时，对应的三个值分别为 0 1 0%
```css
.item {flex: 0;}
.item {
    flex-grow: 0;
    flex-shrink: 1;
    flex-basis: 0%;
}
```
当 flex 取值为一个长度或百分比，则视为 flex-basis 值，flex-grow 取 1，flex-shrink 取 1，有如下等同情况（注意 0% 是一个百分比而不是一个非负数字）
```css
.item-1 {flex: 0%;}
.item-1 {
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: 0%;
}

.item-2 {flex: 24px;}
.item-2 {
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: 24px;
}
```
当 flex 取值为两个非负数字，则分别视为 flex-grow 和 flex-shrink 的值，flex-basis 取 0%，如下是等同的：
```css
.item {flex: 2 3;}
.item {
    flex-grow: 2;
    flex-shrink: 3;
    flex-basis: 0%;
}
```
- 当 flex 取值为一个非负数字和一个长度或百分比，则分别视为 flex-grow 和 flex-basis 的值，flex-shrink 取 1，如下是等同的：
```css
.item {flex: 11 32px;}
.item {
    flex-grow: 11;
    flex-shrink: 1;
    flex-basis: 32px;
}
```


### flex-shrink 和 flex-basis
```css
.item {
    flex-basis: <length> | auto;
}
```
`flex-basis`定义了在分配多余空间之前，项目占据的主轴空间，浏览器根据这个属性，计算主轴是否有多余空间。

**当主轴为水平方向的时候，当设置了 flex-basis，项目的宽度设置值会失效，flex-basis 需要跟 flex-grow 和 flex-shrink 配合使用才能发挥效果。**

- 当 flex-basis 值为 0 % 时，是把该项目视为零尺寸的，故即使声明该尺寸为 140px，也并没有什么用。
- 当 flex-basis 值为 auto 时，则跟根据尺寸的设定值(假如为 100px)，则这 100px 不会纳入剩余空间。


flex-grow: 定义项目的放大比例。

当所有的项目都以 flex-basis 的值进行排列后，仍有剩余空间，那么这时候 flex-grow 就会发挥作用了。
如果所有项目的 flex-grow 属性都为 1，则它们将等分剩余空间。(如果有的话)

如果一个项目的 flex-grow 属性为 2，其他项目都为 1，则前者占据的剩余空间将比其他项多一倍。

当然如果当所有项目以 flex-basis 的值排列完后发现空间不够了，且 flex-wrap：nowrap 时，此时 flex-grow 则不起作用了，这时候就需要接下来的这个属性。

flex-shrink: 定义了项目的缩小比例。

```css
.item {
    flex-shrink: <number>;
}
```
默认值: 1，即如果空间不足，该项目将缩小，负值对该属性无效。


### grid


## 1px

### 移动端1px问题如何解决

`window.devicePixelRatio=物理像素 /CSS像素`

目前主流的屏幕DPR=2 （iPhone 8）,或者3 （iPhone 8 Plus）。拿2倍屏来说，设备的物理像素要实现1像素，而DPR=2，所以css 像素只能是 0.5。一般设计稿是按照750来设计的，它上面的1px是以750来参照的，而我们写css样式是以设备375为参照的，所以我们应该写的0.5px就好了啊！ 试过了就知道，iOS 8+系统支持，安卓系统不支持。


解决方案：

1. 对IOS的方案
在 WWDC大会上，给出来了1px方案，当写 0.5px的时候，就会显示一个物理像素宽度的 border，而不是一个css像素的 border。 所以在iOS下，你可以这样写。
```js
border:0.5px solid #E5E5E5
```
可能你会问为什么在3倍屏下，不是0.3333px 这样的？经过我测试，在Chrome上模拟iPhone 8Plus，发现小于0.46px的时候是显示不出来。

优点：简单，没有副作用

缺点：支持iOS 8+，不支持安卓。后期安卓follow就好了。


2. 使用`box-shadow`
```css
box-shadow: 0  -1px 1px -1px #e5e5e5,   //上边线
            1px  0  1px -1px #e5e5e5,   //右边线
            0  1px  1px -1px #e5e5e5,   //下边线
            -1px 0  1px -1px #e5e5e5;   //左边线
```
前面两个值 x，y 主要控制显示哪条边，后面两值控制的是阴影半径、扩展半径。

优点：使用简单，圆角也可以实现

缺点：模拟的实现方法，仔细看谁看不出来这是阴影不是边框。


3. 使用伪元素

**best**

```css
.setOnePx{
  position: relative;
  &::after{
    position: absolute;
    content: '';
    background-color: #e5e5e5;
    display: block;
    width: 100%;
    height: 1px; /*no*/
    transform: scale(1, 0.5);
    top: 0;
    left: 0;
  }
}
```

可以看到，将伪元素设置绝对定位，并且和父元素的左上角对齐，将width 设置100%，height设置为1px，然后进行在Y方向缩小0.5倍。


4. 4条border
```css
.setBorderAll{
     position: relative;
       &:after{
           content:" ";
           position:absolute;
           top: 0;
           left: 0;
           width: 200%;
           height: 200%;
           transform: scale(0.5);
           transform-origin: left top;
           box-sizing: border-box;
           border: 1px solid #E5E5E5;
           border-radius: 4px;
      }
    }
```
复制代码同样为伪元素设置绝对定位，并且和父元素左上角对其。将伪元素的长和宽先放大2倍，然后再设置一个边框，以左上角为中心，缩放到原来的0.5倍
总结：


优点：全机型兼容，实现了真正的1px，而且可以圆角。


缺点：暂用了after 伪元素，可能影响清除浮动。



### rem方案和vw方案的优缺点
`rem`就是相对于根元素`<html>`的`font-size`来做计算。默认情况下，html元素的font-size为16px

rem布局的缺点：
在响应式布局中，必须通过js来动态控制根元素font-size的大小。
也就是说css样式和js代码有一定的耦合性。且必须将改变font-size的代码放在css样式之前。

- vw : 1vw 等于视窗宽度的1%
- vh : 1vh 等于视窗高度的1%
- vmin : 选取 vw 和 vh 中最小的那个
- vmax : 选取 vw 和 vh 中最大的那个

可以这样理解 100vw = window.innerwidth, 100vh = window.innerheight。

sass
```css
/* 以iphone7尺寸@2x 750像素宽的视觉稿为例 */
@function vw($px) {
    @return ($px / 750) * 100vw;
}
/* 假设一个div元素在视觉稿中，宽度为120px，字体大小为12px */
div {
    width: vw(120);
    font-size: vw(12);
}
```
vw单位和百分比%单位对比
- 那么100vw和我们平时用的width:100%有什么区别呢？
1. 百分比%是根据父元素宽度或者高度进行计算，而vw vh固定按照viewport来计算，不会受父元素宽高度影响。
2. 100vw包括了页面滚动条宽度（页面滚动条属于viewport范围内，100vw当然包括了页面滚动条宽度）。但把body或者html设置为width:100%时，是不包括页面滚动条的宽度的。也就是说100vw在有纵向滚动条的情况下，会比100%宽。 那么就会引发一个问题：pc端使用vw单位时，如果页面内容超出一屏长度，出现了纵向滚动条，同时有元素width:100vw， 则会导致出现条横向滚动条，因为元素（100vw + 滚动条宽度）超出了viewport宽度。（移动端滚动条不占位，所以不会有这个问题）不过pc端一般不需要弹性布局，还是尽量使用width:100%更保险。



### rem方案的font-size挂在哪里

### rem方案的移动端字体如何处理

## 回流重绘

### 概念

### 如何避免


## 居中/常见布局

### 布局概念

#### 1. 静态布局
直接使用px作为单位

#### 2. 流式布局
宽度使用%百分比，高度使用px作为单位

#### 3. 自适应布局
创建多个静态布局，每个静态布局对应一个屏幕分辨率范围。使用 @media媒体查询来切换多个布局。

#### 4. 响应式布局
通常是糅合了流式布局+弹性布局，再搭配媒体查询技术使用

#### 5. 弹性布局

通常指的是rem或em布局。rem是相对于html元素的font-size大小而言的，而em是相对于其父元素（非font-size的是相对于自身的font-size）



## 层叠上下文 （z-index）

## sass


## `box-shadow`

box-shadow 属性用于在元素的框架上添加阴影效果。你可以在同一个元素上设置多个阴影效果，并用逗号将他们分隔开。该属性可设置的值包括阴影的inset(阴影向内，可忽略)、X轴偏移量、Y轴偏移量、模糊半径、扩散半径和颜色。

`box-shadow: 0px 0px 0px 10px rgba(0, 0, 255, .2);`