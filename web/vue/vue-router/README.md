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


## 源码实现

