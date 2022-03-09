# vite源码解析

`vite`其实是可以分为三部分的，一部分是开发过程中的`client`部分；一部分是开发过程中的`server`部分；另外一部分就是与生产有关系的打包编译部分，由于`vite`打包编译其实是用的`rollup`，我们不做解析，只看前两部分。

## `client`
`vite`的`client`其实是作为一个单独的模块进行处理的，它的源码是放在`packages/vite/src/client`，这里面有四个文件:

- `client.ts`：主要的文件入口

- `env.ts`：环境相关的配置，将项目中的`vite.config.js`文件配置进行读取

- `overlay.ts`: 这个是一个错误蒙层的展示，将错误信息进行展示

- `tsconfig.json`：`ts`的配置文件


create a http server & a websocket server.

watch file.

create a pluginContainer to control all plugins.

create a viteDevServer that container all things above.

