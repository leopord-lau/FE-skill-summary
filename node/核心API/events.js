const events = require('events')
const emitter = new events.EventEmitter();
emitter.on('event1',(...args)=>{
  console.log('监听event',...args)
})
emitter.emit('event1','触发吧')