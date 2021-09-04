module.exports = {
  entry: {
    app: "./src/index.js",
    adminApp: "./src/index2.js",
  },
  output: {
    // filename: "[name].js",
    filename: "[name].[contenthash:8].js",
  },
};
