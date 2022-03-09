const DllPlugin = require('webpack/lib/DllPlugin');
const path = require('path');
module.exports = {
  mode: 'development',
  entry: {
    axios: ['axios'],
    // webpack: ['webpack'],
  },
  output: {
    filename: '[name].dll.js',
    path: path.resolve(__dirname, './src/assets/dll'),
    library: '_dll_[name]',
    clean: true,
  },
  plugins: [
    new DllPlugin({
      name: '_dll_[name]',
      // manifest.json 描述动态链接库包含了哪些内容
      path: path.join(__dirname, './', '[name].dll.manifest.json'),
    }),
  ],
};
