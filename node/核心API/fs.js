const fs = require('fs');
const path = require("path");

// sync
// 代码会阻塞在这里
// const data= fs.readFileSync('./data.txt');
// console.log('同步读取，等到文件读取完后才会执行');
// console.log(data.toString());

// async
// fs.readFile('./data.txt', (err, data) => {
//   if(err) throw err;
//   console.log(data.toString());
// })
// console.log("执行其他操作");


// 搭配path
fs.readFile(path.resolve(path.resolve(__dirname,'./data.txt')), (err, data) => { 
  if (err) throw err; 
  console.log(data.toString()); 
});
