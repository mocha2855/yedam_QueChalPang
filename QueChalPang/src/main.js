import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import './assets/css/nucleo-icons.css'
import './assets/css/nucleo-svg.css'
import ArgonDashboard from './argon-dashboard'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
const appInstance = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
appInstance.use(store)
appInstance.use(pinia)
appInstance.use(router)
appInstance.use(ArgonDashboard)
appInstance.mount('#app')
