//index.js
import { createStore } from 'vuex'

export default createStore({
  state: {
    hideConfigButton: false,
    isPinned: false,
    showConfig: false,
    sidebarType: 'bg-white',
    isRTL: false,
    mcolor: '',
    darkMode: false,
    isNavFixed: false,
    isAbsolute: false,
    showNavs: true,
    showSidenav: true,
    showNavbar: true,
    showFooter: true,
    showMain: true,
    layout: 'default',
  },
  mutations: {
    toggleConfigurator(state) {
      state.showConfig = !state.showConfig
    },
    sidebarMinimize(state) {
      let sidenav_show = document.querySelector('#app')
      if (state.isPinned) {
        sidenav_show.classList.add('g-sidenav-hidden')
        sidenav_show.classList.remove('g-sidenav-pinned')
        state.isPinned = false
      } else {
        sidenav_show.classList.add('g-sidenav-pinned')
        sidenav_show.classList.remove('g-sidenav-hidden')
        state.isPinned = true
      }
    },
    sidebarType(state, payload) {
      state.sidebarType = payload
    },
    navbarFixed(state) {
      if (state.isNavFixed === false) {
        state.isNavFixed = true
      } else {
        state.isNavFixed = false
      }
    },
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode

      const body = document.body

      if (state.darkMode) {
        body.classList.add('dark-version')
        body.classList.remove('bg-gray-100')
      } else {
        body.classList.remove('dark-version')
        body.classList.add('bg-gray-100')
      }
    },
  },
  actions: {
    toggleSidebarColor({ commit }, payload) {
      commit('sidebarType', payload)
    },
  },
  getters: {},
})
