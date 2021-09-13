const os = require('os')
const mem = os.freemem() / os.totalmem() * 100; 
console.log(`内存占用率${mem.toFixed(2)}%`)