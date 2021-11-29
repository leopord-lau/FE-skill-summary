const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      //html编译插件
      template: path.resolve(__dirname, "./src/index.html"),
      scriptLoading: "blocking",
    }),
  ],
  devServer: {
    //配置服务端口号
    port: 9000,
    // 打开热更新开关
    hot: true,
    //服务器的IP地址，可以使用IP也可以使用localhost
    host: "localhost",
    //服务端压缩是否开启
    compress: true,
  },
};
