import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import App from './App.vue'
import './style.css'

// Setup Vue Composition API untuk Vue 2.5.17
Vue.use(VueCompositionAPI)

// Disable Vue production tip
Vue.config.productionTip = false

// Create Vue instance with proper Vue 2 syntax
new Vue({
  render: h => h(App),
}).$mount('#app')