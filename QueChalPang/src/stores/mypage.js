//survey.js
import { defineStore } from 'pinia'
import axios from 'axios'
export const useMyPageStore = defineStore('myPage', {
  //state
  state: () => {
    return {
      managerInfo: [], // 담당자 정보
    }
  },
  actions: {
    async searchManagerInfo(id) {
      this.managerInfo = await axios.get('/api/managerInfo/' + id)
      return this.managerInfo
    },
  },
})
