class Watcher {
  constructor(key) {
    Dep.target = this;
    this.key = key;
  }
  update() {
    console.log(`属性${this.key}更新了`);
  }
}

export default Watcher;