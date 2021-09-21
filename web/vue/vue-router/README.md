# `vue-router`

## 使用

安装：
```bash
vue add router
```

配置路由:
```js
{ path: '/', name: 'home', component: Home }
```

添加导航链接：
```html
<router-link to="/">Home</router-link>
<router-link to="/about">About</router-link>
```

挂载：
```js
new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
```

动态路由：

把某种模式匹配到的所有路由，全都映射到同一个组件。

- 创建`Detail.vue`
```html
<template>
  <div>
    <h2>商品详情</h2>
    <p>{{$route.params.id}}</p>
  </div>
</template>
```

- 详情页路由配置，`router.js`
```js
{
  path: '/detail/:id',
  name: 'detail',
  component: Detail
}
```

- 跳转，`Home.vue`
```html
<div v-for="item in items" :key="item.id">
  <router-link :to="`/detail/${item.id}`">
    {{ item.name }}
  </router-link>
</div>
```

- 路由嵌套：
```js
{
  path: '/',
  name: 'home',
  component: Home,
  children: [{
    path: '/detail/:id',
    name: 'detail',
    component: Detail
  }]
}
```

- 添加插座, `Home.vue`
```html
<template>
  <div class="home">
    <h1>首页</h1>
      <router-view></router-view>
  </div>
</template>
```


要理解`vue-router`原理，可以先从一下几方面入手:
1. 路由解析配置
2. url响应
3. 事件监听（`hashchange`）
4. 组件如何切换


## 原理简单实现

```js

let Vue;
class LeoRouter {
  constructor(options) {
    this.$options = options;
    this.routeMap = {};
    // current保存当前hash
    // vue使其响应式
    this.app = new Vue({
      data: {
        current: "/"
      }
    })
  }

  init() {
    this.bindEvents();
    this.createRouteMap();
    this.initComponent();
  }

  // hash变更检测
  bindEvents() {
    window.addEventListener("load", this.onHashChange.bind(this), false);
    window.addEventListener("hashchange", this.onHashChange.bind(this), false);
  }

  // 路径变更
  onHashChange() {
    this.app.current = window.location.hash.slice(1) || '/';
  }

  createRouteMap() {
    this.$options.routes.forEach(item => {
      this.routeMap[item.path] = item;
    })
  }

  initComponent() {
    Vue.component("leo-link", {
      props: {
        to: String,
      },
      render(h) {
        // return <a href = {this.to}>{this.$slots.defult}</a>;
        return h('a', {attrs: {href: '#'+this.to}}, [this.$slots.default])
      }
    });
    Vue.component("leo-view", {
      render: h => {
        const component = this.routeMap[this.app.current].component;
        return h(component);
      }
    })
  }
}

// 插件
LeoRouter.install = function(_Vue) {
  Vue = _Vue;

  Vue.mixin({
    beforeCreate() {
      if(this.$options.router) {
        Vue.prototype.$router = this.$options.router;
        this.$options.router.init();
      }
    }
  })
}

export default LeoRouter;

```

