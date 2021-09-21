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