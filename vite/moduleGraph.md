# `moduleGraph`

## 存在三个映射
1. `urlToModuleMap`  文件相对路径 -> 文件moduleNode，但是不包含css中的@import引入
2. `idToModuleMap`   文件绝对路径 -> 文件moduleNode，不包含css文件中的@import引入
3. `fileToModuleMap` 文件绝对路径  -> set集合里边包含了文件的moduleNode,包含css文件中的@import引入

## plugins
```js
[
  {
    name: 'vite:pre-alias',
    configureServer: [Function: configureServer],
    resolveId: [Function: resolveId]
  },
  {
    name: 'alias',
    buildStart: [Function: buildStart],
    resolveId: [Function: resolveId]
  },
  {
    name: 'vite:modulepreload-polyfill',
    resolveId: [Function: resolveId],
    load: [Function: load]
  },
  {
    name: 'vite:resolve',
    configureServer: [Function: configureServer],
    resolveId: [Function: resolveId],
    load: [Function: load]
  },
  {
    name: 'vite:html-inline-script-proxy',
    resolveId: [Function: resolveId],
    buildStart: [Function: buildStart],
    load: [Function: load]
  },
  {
    name: 'vite:css',
    configureServer: [Function: configureServer],
    buildStart: [Function: buildStart],
    transform: [AsyncFunction: transform]
  },
  {
    name: 'vite:esbuild',
    configureServer: [Function: configureServer],
    transform: [AsyncFunction: transform]
  },
  { name: 'vite:json', transform: [Function: transform] },
  {
    name: 'vite:wasm',
    resolveId: [Function: resolveId],
    load: [AsyncFunction: load]
  },
  {
    name: 'vite:worker',
    load: [Function: load],
    transform: [AsyncFunction: transform]
  },
  {
    name: 'vite:asset',
    buildStart: [Function: buildStart],
    resolveId: [Function: resolveId],
    load: [AsyncFunction: load],
    renderChunk: [Function: renderChunk],
    generateBundle: [Function: generateBundle]
  },
  { name: 'vite:define', transform: [Function: transform] },
  {
    name: 'vite:css-post',
    buildStart: [Function: buildStart],
    transform: [AsyncFunction: transform],
    renderChunk: [AsyncFunction: renderChunk],
    generateBundle: [AsyncFunction: generateBundle]
  },
  { name: 'vite:client-inject', transform: [Function: transform] },
  {
    name: 'vite:import-analysis',
    configureServer: [Function: configureServer],
    transform: [AsyncFunction: transform]
  }
]
```

resolveId only return value at plugin resolve( and the value is the path of mjs file when id is mjs file ), load return null, transform run through every plugin that has transform function.

when request a url, transform this request and put this file into moduleGraph.

css file would be tranform into js language, what direct means?

no matter how deep css file is, the only importers is the main.css;


## find the path of file by url.
plugin resolve

默认root是根目录，在resolve这个插件中，采用path.resolve方法将root和url结合
path.resolve(root, url.slice(1));

之后对这个文件判断是否可访问。可访问的说明文件存在并且有权限访问，之后将`//`字符转换成`\`
