const ConsoleLogOnBuildWebpackPlugin = require("./src/consolelog-plugin");
module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
  },
  plugins: [new ConsoleLogOnBuildWebpackPlugin()],
};
