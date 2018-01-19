// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "babel-polyfill"
import Vue from 'vue'
import store from "./store"
import App from './App'
import fastclick from "fastclick"
import VueLazyLoad from "vue-lazyload"
import router from "./router"
import "@/common/stylus/index.styl"

Vue.config.productionTip = false
fastclick.attach(document.body)
Vue.use(VueLazyLoad, {
  // loading: require('@/common/images/default.png')
  loading: require('@/common/images/snowman.png')
})
// import vConsole from "vconsole"

// console.log("test");
/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: {App},
  router,
  store
});
