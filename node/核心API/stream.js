const fs = require('fs');
// 文件操作
const read = fs.createReadStream('./data.txt'); // 创建一个读取流读取txt文件
const write = fs.createWriteStream('./cdata.txt'); // 创建一个写入流写入c文件
read.pipe(write); // 创建一个管道，读取流流入到写入流中

// 图片操作
const readImage = fs.createReadStream('../images/node-logo.png');
const writeImage = fs.createWriteStream('./cnode-logo.png');
readImage.pipe(writeImage);

