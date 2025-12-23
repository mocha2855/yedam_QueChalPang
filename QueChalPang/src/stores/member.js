import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => {
    return {
      count: ref(0),
      isLogIn: ref({
        isLogIn: false,
        info: {},
      }),
    }
  },
  actions: {
    increment() {
      this.count++
    },
  },
  getters: {
    doubleCount: (state) => {
      return state.count * 2
    },
  },

  persist: true,
})
