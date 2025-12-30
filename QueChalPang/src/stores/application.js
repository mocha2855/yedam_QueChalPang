//survey.js
import { defineStore } from 'pinia'
import axios from 'axios'
export const useApplicationStore = defineStore('application', {
  //state
  state: () => {
    return {
      dependantInfo: [], // 지원자 정보
      planned: [], // 계획 추가 시 몇번째 파악
      allPlanned: [], // 계획서 불러오기
      planningReview: [], // 검토중 계획서
      planningSuccess: [], // 승인완료 계획서
      planningRejected: [], // 반려된 계획서
      planningState: 0,
    }
  },
  actions: {
    // 지원자 정보 확인
    async checkdependantInfo(no) {
      this.dependantInfo = (await axios.get(`/api/application/` + no)).data[0]
      return this.dependantInfo
    },

    // 계획서 갯수 파악
    async countPlanning(no) {
      this.planned = await axios.get('/api/planning/' + no)
      return this.planned
    },

    // 계획서 대기상태별 분해
    async countRealReview(no) {
      this.allPlanned = []
      this.planningReview = []
      this.planningSuccess = []
      this.planningRejected = []
      this.allPlanned = (await axios.get('/api/planningReview/' + no)).data
      for (let i = 0; i < this.allPlanned.length; i++) {
        console.log(this.allPlanned[i])
        if (this.allPlanned[i].planning_status === 'i1') {
          this.planningReview.push(this.allPlanned[i])
        } else if (this.allPlanned[i].planning_status === 'i2') {
          this.planningSuccess.push(this.allPlanned[i])
        } else if (this.allPlanned[i].planning_status === 'i3') {
          this.planningRejected.push(this.allPlanned[i])
        }
      }
    },
  },
})
