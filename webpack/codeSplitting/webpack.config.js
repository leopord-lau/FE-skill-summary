const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');
const happyPack = require('happypack');
// const autoAddDllRes = () => {
//   const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
//   return new AddAssetHtmlPlugin([
//     {
//       // 往html中注入dll js
//       publicPath: path.resolve(__dirname, 'dll/'), // 注入到html中的路径
//       outputPath: 'dll', // 最终输出的目录
//       filepath: path.resolve('src/assets/dll/*.js'),
//       includeSourcemap: false,
//       typeOfAsset: 'js', // options js、css; default js
//     },
//   ]);
// };

module.exports = {
  mode: 'development',
  entry: {
    app: {
      import: './src/index.js',
      dependOn: ['axios'],
    },
    axios: 'axios',
  },
  output: {
    filename: '[name].[hash].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['happypack/loader?id=babel'],
        exclude: path.resolve(__dirname, ' ./node_modules'),
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html'),
    }),
    ...[
      new DllReferencePlugin({
        manifest: require('./axios.dll.manifest.json'),
      }),
    ],
    new happyPack({
      id: 'babel',
      loaders: ['babel-loader?cacheDirectory'],
      threads: 1,
    }),
    // ...[autoAddDllRes()],
  ],
  //   externals: {
  //     axios: 'axios',
  //   },
};
