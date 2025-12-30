import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', {
  //state
  state: () => ({
    //모달 기본값
    visible: false,
    type: null,
    payload: null,
  }),

  actions: {
    //모달창 열었을 때
    open(type, data = null) {
      this.type = type
      this.payload = data
      this.visible = true
    },
    close() {
      this.visible = false
    },
  },
})
