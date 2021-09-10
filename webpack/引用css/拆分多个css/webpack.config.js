const path = require("path");
const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");
// let commonCss = new ExtractTextWebpackPlugin("./src/common.css");
let indexLess = new ExtractTextWebpackPlugin("./src/index.less");
let indexCss = new ExtractTextWebpackPlugin("./src/index.css");
module.exports = {
  mode: "development",
  entry: {
    index: path.resolve(__dirname, "./src/index.js"),
  },
  output: {
    filename: "[name].[hash].js",
    path: path.resolve(__dirname, "./dist"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: indexCss.extract({
          use: ["css-loader"],
        }),
      },
      {
        test: /\.less$/,
        use: indexLess.extract({
          use: ["less-loader"],
        }),
      },
    ],
  },
  plugins: [indexLess, indexCss],
};
