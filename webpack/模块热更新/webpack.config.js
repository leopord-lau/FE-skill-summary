const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  //   // 默认false
  //   watch: true,
  //   // 只有watch为true时watchOptions才生效
  //   watchOptions: {
  //     // exclude file or directory
  //     ignored: /node_modules/,

  //     // default 300ms
  //     aggregateTimeout: 300,

  //     // 轮询判断文件是否更改
  //     // 默认 1000ms
  //     poll: 1000,
  //   },

  devServer: {
    // 从目录提供静态文件的选项（默认是 'public' 文件夹）。将其设置为 false 以禁用
    static: {
      directory: path.join(__dirname, "public"),
    },
    // 启用 gzip compression：
    compress: true,
    // 在服务器已经启动后打开浏览器
    open: true,
    // 端口
    port: 9000,
    hot: true,
  },
  plugins: [new HtmlWebpackPlugin({ title: "auto compile" })],
};
