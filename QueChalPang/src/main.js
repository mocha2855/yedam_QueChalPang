import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import './assets/css/nucleo-icons.css'
import './assets/css/nucleo-svg.css'
import ArgonDashboard from './argon-dashboard'
import './assets/css/override.css'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
//import naver from 'vue-naver-maps'

const appInstance = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
appInstance.use(store)
appInstance.use(pinia)
appInstance.use(router)
appInstance.use(ArgonDashboard)
appInstance.mount('#app')

// Vue.use(naver, {
//   clientID: 'Client ID',
//   useGovAPI: false, //공공 클라우드 API 사용 (선택)
//   subModules: '' // 서브모듈 (선택)
// });