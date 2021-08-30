
class Dep {
  constructor() {
    // 定义一个数组用于保存已经收集到更新方法
    this.subs = new Set();
  }
  depend(dep) { 
    this.subs.add(dep);
  }
  notify() {
    // 执行所有收集到的更新方法
    this.subs.forEach(function(sub) {
      // 调用收集到的代码块中的update方法
      sub.update()
    });
  }
}

// 通过这个来保存当前调用data的上下文
Dep.target = null;

export default Dep;