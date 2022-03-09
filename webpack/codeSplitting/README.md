# code splitting

主要有2种方式：
- 分离业务代码和第三方库
- 按需加载（利用`import`语法）

比如说我们引入了`axios`，准备用这个包来发送请求。

```js
module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: '[name].[hash].js',
    clean: true,
  }
};
```

当我们运行`npx webpack`时，只会生成了一个
