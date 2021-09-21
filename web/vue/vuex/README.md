# `Vuex`

`Vuex` 是一个专为 `Vue.js` 应用程序开发的状态管理模式。每一个 `Vuex` 应用的核心就是 `store`（仓库）。`“store”` 基本上就是一个容器，它包含着你的应用中大部分的状态 ( `state` )。

（1）`Vuex` 的状态存储是响应式的。当 `Vue` 组件从 `store` 中读取状态的时候，若 `store` 中的状态发生变化，那么相应的组件也会相应地得到高效更新。

（2）改变 `store` 中的状态的唯一途径就是显式地提交 `(commit) mutation`。这样使得我们可以方便地跟踪每一个状态的变化。

主要包括以下几个模块：

- `State`：定义了应用状态的数据结构，可以在这里设置默认的初始状态。
- `Getter`：允许组件从 `Store` 中获取数据，`mapGetters` 辅助函数仅仅是将`store` 中的 `getter` 映射到局部计算属性。
- `Mutation`：是唯一更改 `store` 中状态的方法，且必须是同步函数。
- `Action`：用于提交 `mutation`，而不是直接变更状态，可以包含任意异步操作。
- `Module`：允许将单一的 `Store` 拆分为多个 `store` 且同时保存在单一的状态树中。

## 整合`vuex`
```bash
vue add vuex
```

## 状态和状态变更

`state`保存数据状态，`mutations`用于修改状态

```js
export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment(state) {
      state.count += 1;
    }
  },
  actions: {
  },
  modules: {
  }
})
```

使用：
```html
<template>
  <div>
    <div>num: {{$store.state.count}}</div>
    <button @click="add">加1</button>
  </div>
</template>
<script>
export default {
  methods: {
    add() {
      this.$store.commit("increment");
    }
  }
};
</script>
```


## 派生状态 - `getters`

从`state`派生出新状态，类似计算属性
```js
export default new Vuex.Store({
  getters: {
    left(state) { // 计算剩余数量
      return 10 - state.count;
    }
  }
})
```

使用：
```html
<div>left: {{$store.getters.left}}</div>
```

## 动作 - `actions`

复杂业务逻辑，类似于`controller`
```js
export default new Vuex.Store({
  // .. 
  actions: {
    increment({getters,commit}) {
      if(getters.left > 0) {
        commit('increment');
        return true;
      }
      return false;
    },
    asyncIncrement({dispatch}) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(dispatch('increment'))
        }, 1000)
      })
    }
  }
})

```


使用：
```html
<template>
  <div>
    <div>total: 10</div>
    <div>num : {{$store.state.count}}</div>
    <div>left: {{$store.getters.left}}</div>
    <button @click="add">add 1</button>
    <button @click="asyncAdd">add 1 async</button>
  </div>
</template>
<script>
export default {
  methods: {
    add() {
      // 即使action执行同步代码返回的结果依然是promise
      this.$store.dispatch("increment").then(res => {
        if(!res) {
          alert("add fail");
        }
      })
    },
    asyncAdd() {
      this.$store.dispatch("asyncIncrement").then(res => {
        if(!res) {
          alert("add fail");
        }
      })
    }
  }
};
</script>
```

## 模块化

按模块化的方式编写代码
```js
const count = {
  namespaced: true,
// ...
};
export default new Vuex.Store({
  modules: {a: count}
});
```

使用：
```html
<template>
  <div>
    <div>total: 10</div>
    <div>num : {{$store.state.a.count}}</div>
    <div>left: {{$store.getters['a/left']}}</div>
    <button @click="add">add 1</button>
    <button @click="asyncAdd">add 1 async</button>
  </div>
</template>
<script>
export default {
  methods: {
    add() {
      // 即使action执行同步代码返回的结果依然是promise
      this.$store.dispatch("a/increment").then(res => {
        if(!res) {
          alert("add fail");
        }
      })
    },
    asyncAdd() {
      this.$store.dispatch("a/asyncIncrement").then(res => {
        if(!res) {
          alert("add fail");
        }
      })
    }
  }
};
</script>
```


## `vuex`原理解析
```js
// 1.插件
let Vue;

function install(_Vue) {
    Vue = _Vue;

    // 混入store
    Vue.mixin({
        beforeCreate() {
            if (this.$options.store) {
                Vue.prototype.$store = this.$options.store;
            }
        }
    })
}

// 2.实现Store
class Store {
    constructor(options = {}) {
        // 响应化处理
        this.state = new Vue({
            data: options.state            
        })
        this.mutations = options.mutations || {};
        this.actions = options.actions || {};

    }

    // type是mutations中的函数名
    commit = (type, arg) => {
        this.mutations[type](this.state, arg)
    }

    dispatch(type, arg) {
        this.actions[type]({
            commit: this.commit,
            state: this.state
        }, arg)
    }
}

export default {Store, install}
```
