class Leo {
  constructor(options) {
    this.$options = options;
    this.$data = options.data;
    // 进行响应化
    this.observe(this.$data);
    // 代码测试
    new Watcher(this, 'test'); 
    this.test // 读取属性，触发依赖收集
  }

  observe(value) {
    // 对象类型
    if(!value || typeof value !== 'object') {
      return;
    }
    Object.keys(value).forEach(key => {
      // 响应化
      this.defineReactive(value, key, value[key]);
      
      // 执行代理
      this.proxyData(key);
    })
  }
  defineReactive(obj, key, val) {
    // 递归
    this.observe(val);

    const dep = new Dep();

    Object.defineProperty(obj, key, {
      get() {
        Dep.target && dep.addDep(Dep.target);
        return val;
      },
      set(newVal) {
        if(newVal === val) {
          return;
        }
        val = newVal;
        dep.notify();
      } 
    })
  }
  
  proxyData(key) {
    // 在实例上定义属性的话是需要this.$data.xxx的方法，我们采用defineProperty方式进行代理，使得能够通过this.xxx 进行处理
    Object.defineProperty(this, key, {
      get() {
        return this.$data[key];
      },
      set(newVal) {
        this.$data[key] = newVal;
      }
    })
  }
}

class Dep {
  constructor() {
    this.deps = [];
  }
  addDep(dep) {
    this.deps.push(dep);
  }
  notify() {
    this.deps.forEach(dep => dep.update())
  }
}

class Watcher {
  constructor(key) {
    // console.log(context);
    Dep.target = this;
    this.key = key;
  }
  update() {
    console.log(`属性${this.key}更新了`);
  }
}

const leo = new Leo({
  data: {
    test: "test"
  }
})
leo.test = 'change'