
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
