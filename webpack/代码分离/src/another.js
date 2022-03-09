// 同样引入第三方代码
const obj = require("./third-party");
const _ = require("lodash");

obj.count++;
console.log("another ", obj.count);
console.log("another");
console.log(_.VERSION);
