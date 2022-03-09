// 引入第三方代码
const obj = require("./third-party");
const _ = require("lodash");

obj.count++;
console.log("index ", obj.count);
console.log(_.VERSION);
console.log("index");
