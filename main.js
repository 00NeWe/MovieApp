import App from './App'
import store from './store' 
// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	store,
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import store from './store'
export function createApp() {
  const app = createSSRApp(App)
  app.use(store) // 注册 Vuex store
  return { app }
}
// #endif