// 创建一个长度为2字节以0填充的Buffer 
const buf = Buffer.alloc(2); 
console.log(buf);
// <Buffer 00 00>

// 创建一个Buffer包含ascii. 
const buf2 = Buffer.from('a') 
console.log(buf2) 
// <Buffer 61>

// 创建Buffer包含UTF-8字节 
// UFT-8：一种变长的编码方案，使用 1~6 个字节来存储； 
// UFT-32：一种固定长度的编码方案，不管字符编号大小，始终使用 4 个字节来存储； 
// UTF-16：介于 UTF-8 和 UTF-32之间，使用 2 个或者 4 个字节来存储，长度既固定又可变。
const buf3 = Buffer.from('实例'); 
console.log(buf3);
// <Buffer e5 ae 9e e4 be 8b>

// 采用toString()方法读取buffer数据
console.log(buf3.toString()); // 实例

// buffer数据也是可以合并的
const buf4 = Buffer.concat([buf2,buf3])
console.log(buf4)
// <Buffer 61 e5 ae 9e e4 be 8b> 就是将两个buffer结合起来
console.log(buf4.toString()); // a实例