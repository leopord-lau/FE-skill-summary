const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  // 1.入口起点
  //   entry: {
  //     index: "./src/index.js",
  //     another: "./src/another.js",
  //   },
  // 2. 防止重复
  //   entry: {
  //     index: {
  //       import: "./src/index.js",
  //       dependOn: ["sharedModule", "sharedLodash"],
  //     },
  //     another: {
  //       import: "./src/another.js",
  //       dependOn: ["sharedModule", "sharedLodash"],
  //     },
  //     sharedModule: "./src/third-party.js",
  //     sharedLodash: "lodash",
  //   },

  // 3、动态导入
  entry: "./src/dynamic.js",
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  plugins: [new HtmlWebpackPlugin({ title: "code split" })],
};
