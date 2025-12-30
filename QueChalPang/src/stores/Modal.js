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
      this.type = type //모달타입
      this.payload = data //모달에 전달할 데이터
      this.visible = true
    },
    close() {
      this.visible = false
      this.type = null // 초기화 해주기(안해주면 이전 모달 남아있게 됨)
      this.payload = null // 초기화 해주기(안해주면 이전 모달 남아있게 됨)
    },
  },
})
