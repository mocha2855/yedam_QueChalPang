import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore(
  'counter',
  () => {
    const isLogIn = ref({
      isLogIn: false,
      info: {},
    })
    const isRemembered = ref(false)
    const rememberedId = ref('')
    const clearRememberedId = () => {
      rememberedId.value = ''
      isRemembered.value = false
    }

    return { isLogIn, isRemembered, rememberedId, clearRememberedId }
  },
  { persist: true },
)
