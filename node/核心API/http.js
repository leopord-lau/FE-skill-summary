const http = require('http'); 
const server = http.createServer((request, response) => {
  console.log('有个请求');
  response.end('响应了'); 
}); 
server.listen(3000,()=>{
  console.log(`server start at localhost:3000`)
});