const http = require('http'); 
const fs = require('fs');
// const server = http.createServer((request, response) => {
//   console.log('有个请求');
//   response.end('响应了'); 
// }); 

// 路由匹配
const server = http.createServer((request, response) => { 
  const { url, method, headers } = request;
  if(url === '/' && method === 'GET'){
    response.end('响应请求')
  } else if(url === '/api' && method === "GET"){ // 返回一个json数据
    response.writeHead(200,{'Content-Type':'application/json'})
    response.end(JSON.stringify([{code:200,message:'访问成功'}]))
  } else 
  if( url === '/image' && method === "GET") {
    fs.createReadStream('../images/node-logo.png').pipe(response);
  }
}); 

server.listen(3000,()=>{
  console.log(`server start at localhost:3000`)
});
