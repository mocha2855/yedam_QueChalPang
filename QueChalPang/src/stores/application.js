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
      planningChanging: [], // 반려 후 수정중 계획서
      planningChangingReview: [], // 반려 후 수정중 계획서
      planningState: 0, // 지원계획서 리로드용
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
      this.planningChanging = []
      this.planningChangingReview = []
      this.allPlanned = (await axios.get('/api/planningReview/' + no)).data
      for (let i = 0; i < this.allPlanned.length; i++) {
        const dateChange = (day) => {
          let date = new Date(day)
          let realDate = `${date.getFullYear(day)}.${date.getMonth(day) + 1}.${date.getDay(day)}`
          return realDate
        }
        this.allPlanned[i].planning_start = dateChange(this.allPlanned[i].planning_start)
        this.allPlanned[i].planning_end = dateChange(this.allPlanned[i].planning_end)
        if (this.allPlanned[i].planning_reject_date != null) {
          this.allPlanned[i].planning_reject_date = dateChange(
            this.allPlanned[i].planning_reject_date,
          )
        }
        this.allPlanned[i].planning_date = dateChange(this.allPlanned[i].planning_date)
        if (this.allPlanned[i].planning_approvedDate != null) {
          this.allPlanned[i].planning_approvedDate = dateChange(
            this.allPlanned[i].planning_approvedDate,
          )
        }

        if (
          this.allPlanned[i].planning_status === 'i1' &&
          this.allPlanned[i].planning_reject == null &&
          this.allPlanned[i].planning_reject_date == null &&
          this.allPlanned[i].planning_approvedDate == null
        ) {
          this.planningReview.push(this.allPlanned[i])
          console.log('검토중: ', this.planningReview)
        } else if (
          this.allPlanned[i].planning_status === 'i1' &&
          this.allPlanned[i].planning_reject != null &&
          this.allPlanned[i].planning_reject_date != null &&
          this.allPlanned[i].planning_approvedDate != null
        ) {
          this.planningChanging.push(this.allPlanned[i])
          console.log('반려수정중', this.planningChanging)
        } else if (
          this.allPlanned[i].planning_status === 'i1' &&
          this.allPlanned[i].planning_reject != null &&
          this.allPlanned[i].planning_reject_date != null &&
          this.allPlanned[i].planning_approvedDate == null
        ) {
          this.allPlanned[i].checked = false
          this.planningChangingReview.push(this.allPlanned[i])
          console.log('반려검토중', this.planningChangingReview)
        } else if (this.allPlanned[i].planning_status === 'i2') {
          this.planningSuccess.push(this.allPlanned[i])
          console.log('승인완료', this.planningSuccess)
        } else if (this.allPlanned[i].planning_status === 'i3') {
          this.planningRejected.push(this.allPlanned[i])
          console.log('반려', this.planningRejected)
        }
      }
    },
  },
})
