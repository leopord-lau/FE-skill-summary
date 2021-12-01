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
| storage         | StorageEvent          | 在 Web Storage 区域更新后触发                  | -                                                                   |
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

## `keyboard`事件

键盘输入触发该事件

| 属性     | 类型          | 描述                 | 备注                                                                                |
| -------- | ------------- | -------------------- | ----------------------------------------------------------------------------------- |
| keydown  | KeyboardEvent | 在用户按下按键时触发 | window、document 也可监听该事件, Element 元素可以通过设置防止冒泡来阻止 window 事件 |
| keyup    | KeyboardEvent | 当用户释放按键时触发 | window、document 也可监听该事件, Element 元素可以通过设置防止冒泡来阻止 window 事件 |
| keypress | KeyboardEvent | 在用户敲击按钮时触发 | window、document 也可监听该事件, Element 元素可以通过设置防止冒泡来阻止 window 事件 |

## `mouse`事件

鼠标事件

| 属性       | 类型       | 描述                                   | 备注                                                                                |
| ---------- | ---------- | -------------------------------------- | ----------------------------------------------------------------------------------- |
| click      | MouseEvent | 元素上发生鼠标点击时触发               | window、document 也可监听该事件, Element 元素可以通过设置防止冒泡来阻止 window 事件 |
| dbclick    | MouseEvent | 元素上发生鼠标双击时触发               | window、document 也可监听该事件, Element 元素可以通过设置防止冒泡来阻止 window 事件 |
| drag       | MouseEvent | 元素被拖动时触发                       | window、document 也可监听该事件, Element 元素可以通过设置防止冒泡来阻止 window 事件 |
| dragend    | MouseEvent | 在拖动操作末端触发                     | window、document 也可监听该事件, Element 元素可以通过设置防止冒泡来阻止 window 事件 |
| dragenter  | MouseEvent | 当元素元素已被拖动到有效拖放区域时触发 | window、document 也可监听该事件, Element 元素可以通过设置防止冒泡来阻止 window 事件 |
| dragleave  | MouseEvent | 当元素离开有效拖放目标时触发           | window、document 也可监听该事件, Element 元素可以通过设置防止冒泡来阻止 window 事件 |
| dragover   | MouseEvent | 当元素在有效拖放目标上正在被拖动时触发 | window、document 也可监听该事件, Element 元素可以通过设置防止冒泡来阻止 window 事件 |
| dragstart  | MouseEvent | 在拖动操作开端触发                     | window、document 也可监听该事件, Element 元素可以通过设置防止冒泡来阻止 window 事件 |
| drop       | MouseEvent | 当被拖元素正在被拖放时触发             | window、document 也可监听该事件, Element 元素可以通过设置防止冒泡来阻止 window 事件 |
| mousedown  | MouseEvent | 当元素上按下鼠标按钮时触发             | window、document 也可监听该事件, Element 元素可以通过设置防止冒泡来阻止 window 事件 |
| mousemove  | MouseEvent | 当鼠标指针移动到元素上时触发           | window、document 也可监听该事件, Element 元素可以通过设置防止冒泡来阻止 window 事件 |
| mouseout   | MouseEvent | 当鼠标指针移出元素时触发               | window、document 也可监听该事件, Element 元素可以通过设置防止冒泡来阻止 window 事件 |
| mouseover  | MouseEvent | 当鼠标指针移动到元素上时触发           | window、document 也可监听该事件, Element 元素可以通过设置防止冒泡来阻止 window 事件 |
| mouseup    | MouseEvent | 当在元素上释放鼠标按钮时触发           | window、document 也可监听该事件, Element 元素可以通过设置防止冒泡来阻止 window 事件 |
| mousewheel | MouseEvent | 当鼠标滚轮正在被滚动时触发             | window、document 也可监听该事件, Element 元素可以通过设置防止冒泡来阻止 window 事件 |
| scroll     | MouseEvent | 当元素滚动条被滚动时触发               | window、document 也可监听该事件, Element 元素可以通过设置防止冒泡来阻止 window 事件 |

## `media`事件

由媒介（比如视频、图像和音频）触发的事件（适用于所有 `HTML` 元素，但常见于媒介元素中，比如 `<audio>`、`<embed>`、`<img>`、`<object>` 以及 `<video>`）:

| 属性             | 类型  | 描述                                                                 | 备注 |
| ---------------- | ----- | -------------------------------------------------------------------- | ---- |
| abort            | Event | 在退出时触发                                                         | -    |
| canplay          | Event | 当文件就绪可以开始播放时触发（缓冲已足够开始时）                     | -    |
| canplaythrough   | Event | 当媒介能够无需因缓冲而停止即可播放至结尾时触发                       | -    |
| durationchange   | Event | 当媒介长度改变时触发                                                 | -    |
| emptied          | Event | 当发生故障并且文件突然不可用时触发（比如连接意外断开时）             | -    |
| ended            | Event | 当媒介已到达结尾时触发（可发送类似“感谢观看”之类的消息）             | -    |
| error            | Event | 当在文件加载期间发生错误时触发                                       | -    |
| loadeddata       | Event | 当媒介数据已加载时触发                                               | -    |
| loadedmetadata   | Event | 当元数据（比如分辨率和时长）被加载时触发                             | -    |
| loadstart        | Event | 在文件开始加载且未实际加载任何数据前触发                             | -    |
| pause            | Event | 当媒介被用户或程序暂停时触发                                         | -    |
| play             | Event | 当媒介已就绪可以开始播放时触发                                       | -    |
| playing          | Event | 当媒介已开始播放时触发                                               | -    |
| progress         | Event | 当浏览器正在获取媒介数据时触发                                       | -    |
| ratechange       | Event | 每当回放速率改变时触发（比如当用户切换到慢动作或快进模式）           | -    |
| readystatechange | Event | 每当就绪状态改变时触发（就绪状态监测媒介数据的状态）                 | -    |
| seeked           | Event | 当 seeking 属性设置为 false（指示定位已结束）时触发                  | -    |
| seeking          | Event | 当 seeking 属性设置为 true（指示定位是活动的）时触发                 | -    |
| stalled          | Event | 在浏览器不论何种原因未能取回媒介数据时触发                           | -    |
| suspend          | Event | 在媒介数据完全加载之前不论何种原因终止取回媒介数据时触发             | -    |
| timeupdate       | Event | 当播放位置改变时（比如当用户快进到媒介中一个不同的位置时）触发       | -    |
| volumechange     | Event | 每当音量改变时（包括将音量设置为静音）时触发                         | -    |
| waiting          | Event | 当媒介已停止播放但打算继续播放时（比如当媒介暂停已缓冲更多数据）触发 | -    |
