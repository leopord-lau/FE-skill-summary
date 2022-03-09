# 彻底理解Vue的模板编译

## 原理

`Vue`的编译原理主要可以分成3个部分：
1. 解析： 将模板字符串转换成 `AST`
2. 优化：对`AST`进行静态节点标记，用来为虚拟DOM的渲染做优化
3. 代码生成：将`AST`转成代码

### 解析

例如：
```html
<div>
  <p>{{name}}</p>
</div>
```

转换成的`AST`：
```js
{
  tag: "div"
  type: 1,
  staticRoot: false,
  static: false,
  plain: true,
  parent: undefined,
  attrsList: [],
  attrsMap: {},
  children: [
      {
      tag: "p"
      type: 1,
      staticRoot: false,
      static: false,
      plain: true,
      parent: {tag: "div", ...},
      attrsList: [],
      attrsMap: {},
      children: [{
          type: 2,
          text: "{{name}}",
          static: false,
          expression: "_s(name)"
      }]
    }
  ]
}
```

解析器内部就是将模板字符串放到循环中，然后一段一段的截取，把截取到的每一小段字符串进行解析，直到最后截没了，也就解析完了。

通过正则匹配出标签及属性等信息进行截取。通过下面的`demo`来看看正则在解析模板时发挥的重要作用。

```js
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const ncname = '[a-zA-Z_][\\w\\-\\.]*'
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const startTagClose = /^\s*(\/?)>/

function parse(html) {
  let index = 0;
  const start = html.match(startTagOpen);

  const match = {
    tagName: start[1],
    attrs: [],
    start: 0,
  };
  html = html.substring(start[0].length);
  index += start[0].length;
  let end, attr;
  while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
    html = html.substring(attr[0].length);
    index += attr[0].length;
    match.attrs.push(attr);
  }
  if (end) {
    match.unarySlash = end[1];
    html = html.substring(end[0].length);
    index += end[0].length;
    match.end = index;
  }
  console.log(match);
}

parse(`<div class="content"></div>`)
```

**stack**

在解析模板字符串的时候，我们也需要维护一个栈来记录当前解析的DOM的深度。

更准确的说，当解析到一个 开始标签 或者 文本，无论是什么， `stack` 中的最后一项，永远是当前正在被解析的节点的 `parentNode` 父节点。

通过 `stack` 解析器就可以把当前解析到的节点 `push` 到 父节点的 `children` 中。

也可以把当前正在解析的节点的 `parent` 属性设置为 父节点。

事实上也确实是这么做的。

但并不是只要解析到一个标签的开始部分就把当前标签 `push` 到 `stack` 中。

因为在 `HTML` 中有一种 自闭合标签，比如 `input`。

`<input />` 这种 自闭合的标签 是不需要 `push` 到 `stack` 中的，因为 `input` 并不存在子节点。

所以当解析到一个标签的开始时，要判断当前被解析的标签是否是自闭合标签，如果不是自闭合标签才 `push` 到 `stack` 中。
```js
if (!unary) {
  currentParent = element
  stack.push(element)
}
```
现在有了 `DOM` 的层级关系，也可以解析出`DOM`的开始标签，这样每解析一个 开始标签 就生成一个 `ASTElement` (存储当前标签的`attrs`，`tagName` 等信息的`object`）

并且把当前的 `ASTElement` `push` 到 `parentNode` 的 `children` 中，同时给当前 `ASTElement` 的 `parent` 属性设置为 `stack` 中的最后一项.
```js
currentParent.children.push(element)
element.parent = currentParent
```

**< 开头的几种情况**

但并不是所有以 `<` 开头的字符串都是开始标签，以 `<` 开头的字符串有以下几种情况：

- 开始标签 `<div>`
- 结束标签 `</div>`
- HTML注释 `<!-- 我是注释 -->`
- Doctype `<!DOCTYPE html>`
- 条件注释（Downlevel-revealed conditional comment）

当然我们解析器在解析的过程中遇到的最多的是 开始标签 结束标签 和 注释。

