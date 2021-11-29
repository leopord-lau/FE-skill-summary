# `HTML` 事件汇总

`HTML`事件包含`Window`事件、`document`事件`、Form`事件、`Keybord`事件、`Mouse`事件和`Media`事件。

## `window`事件

`window`事件是针对`window`对象触发的事件。

语法：`window.addEventListener()`

| 属性            | 类型                  | 描述                                           | 备注                                                                |
| --------------- | --------------------- | ---------------------------------------------- | ------------------------------------------------------------------- |
| load            | Event                 | 页面结束加载之后触发                           | -                                                                   |
| resize          | Event                 | 当浏览器窗口被调整大小时触发                   | -                                                                   |
| error           | Event                 | 在错误发生时触发                               | -                                                                   |
| copy            | ClipboardEvent        | 文本复制时触发                                 | 元素上可以监听该事件，不过会冒泡到 window                           |
| paste           | ClipboardEvent        | 文本粘贴时触发                                 | 元素上可以监听该事件，不过会冒泡到 window                           |
| cut             | ClipboardEvent        | 文本剪切时触发                                 | 元素上可以监听该事件，不过会冒泡到 window                           |
| afterprint      | Event                 | 文档打印之后触发                               | -                                                                   |
| beforeprint     | Event                 | 文档打印之前触发                               | -                                                                   |
| beforunload     | Event                 | 文档卸载之前触发                               | -                                                                   |
| error           | Event 或者 ErrorEvent | 在错误发生时触发                               | -                                                                   |
| hashchange      | HashChangeEvent       | 当文档已改变时触发                             | -                                                                   |
| message         | MessageEvent          | 在消息被触发时触发                             | -                                                                   |
| messageerror    | MessageEvent          | 读取消息异常时触发                             | -                                                                   |
| languagechange  | Event                 | 用户语言设置改变时触发                         | -                                                                   |
| online          | Event                 | 当文档上线时触发                               | -                                                                   |
| offline         | Event                 | 当文档离线时触发                               | -                                                                   |
| pagehide        | PageTransitionEvent   | 当窗口隐藏时触发                               | -                                                                   |
| pageshow        | PageTransitionEvent   | 当窗口成为可见时触发                           | -                                                                   |
| popstate        | PopStateEvent         | 当窗口历史记录改变时触发                       | -                                                                   |
| storage         | ✔MDN StorageEvent     | 在 Web Storage 区域更新后触发                  | -                                                                   |
| unload          | Event                 | 一旦页面已下载时触发（或者浏览器窗口已被关闭） | -                                                                   |
| focus           | Event 或者 FocusEvent | 元素聚焦时触发                                 | form 相关元素也可监听，不会冒泡至 window。不过事件类型为 FocusEvent |
| blur            | Event 或者 FocusEvent | 元素失焦时触发                                 | form 相关元素也可监听，不会冒泡至 window，不过事件类型为 FocusEvent |
| unhandledreject | PromiseRejectionEvent | 异步错误未捕获时触发                           | -                                                                   |

## `document`事件

针对`document`对象触发。

语法：`document.addEventListener()`

| 属性             | 类型  | 描述                                     | 备注                  |
| ---------------- | ----- | ---------------------------------------- | --------------------- |
| visibilitychange | Event | 当窗口成为可见时触发                     | window 也可监听该事件 |
| readystatechange | Event | 文档解析完成且所有的子资源都加载完成触发 | -                     |
| DOMContentLoaded | Event | 文档解析完成触发                         | -                     |

## `form`事件

由 `html` 表单内的动作触发的事件（应用到几乎所有 `html` 元素，但最常用在 `form` 元素中）

| 属性       | 类型       | 描述                                     | 备注                  |
| ---------- | ---------- | ---------------------------------------- | --------------------- |
| formchange | Event      | 当窗口成为可见时触发                     | window 也可监听该事件 |
| forminput  | Event      | 文档解析完成且所有的子资源都加载完成触发 | -                     |
| invalid    | Event      | 文档解析完成触发                         | -                     |
| reset      | Event      | 文档解析完成且所有的子资源都加载完成触发 | -                     |
| select     | Event      | 文档解析完成触发                         | -                     |
| submit     | Event      | 文档解析完成且所有的子资源都加载完成触发 | -                     |
| change     | Event      | 文档解析完成触发                         | -                     |
| blur       | FocusEvent | 元素失焦时触发                           | window 也可监听该事件 |
| focus      | FocusEvent | 元素聚焦时触发                           | window 也可监听该事件 |
