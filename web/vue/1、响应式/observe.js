
import Dep from './Dep';
import Watcher from './watcher';
// let context = this;

function observe(obj) {
  // 遍历data中的所有键
  Object.keys(obj).forEach(key => {
    // 获取键对应的值
    let value = obj[key];
    let dep = new Dep();
    Object.defineProperty(obj, key, {
      get() {
        // 收集
        // dep.depend(context);
        Dep.target && dep.depend(Dep.target);
        console.log(`${key}': `, value);
        return value;
      },
      set(newVal) {
        if(value !== newVal) {
          console.log(`set ${newVal} to ${key}`);
          value = newVal;
          // 更新
          dep.notify();
        }
      }
    })
  })
}

const obj = {
  count: 0
}
observe(obj);

new Watcher(this, "count");
// 触发收集
console.log(obj.count);

// 触发更新
obj.count = 2;

// console.log(obj.count);

// function update() {
//   console.log("updated")
//   console.log(obj.count);
// }

// obj.count = 2;