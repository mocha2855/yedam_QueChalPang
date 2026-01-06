//survey.js
import { defineStore } from 'pinia'
import axios from 'axios'
export const useMyPageStore = defineStore('myPage', {
  //state
  state: () => {
    return {
      managerInfo: [], // 담당자 정보
      dependantInfo: [], // 지원자 정보
    }
  },
  actions: {
    // 담당자 정보
    async searchManagerInfo(id) {
      this.managerInfo = (await axios.get('/api/managerInfo/' + id)).data[0]
      const changeDateType = (day) => {
        let date = new Date(day)
        day = `${date.getFullYear(day)}-${date.getMonth(day) + 1}-${date.getDay(day)}`
        return day
      }
      this.managerInfo.center_start = changeDateType(this.managerInfo.center_start)
      this.managerInfo.member_date = changeDateType(this.managerInfo.member_date)
      console.log('담당자: ', this.managerInfo)
      return this.managerInfo
    },

    // 지원자 정보
    async searchDependantInfo(id) {
      this.dependantInfo = (await axios.get('/api/dependantInfo/' + id)).data[0]
      console.log('지원자: ', this.dependantInfo)
      return this.dependantInfo
    },
  },
})
