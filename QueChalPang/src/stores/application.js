//survey.js
import { defineStore } from 'pinia'
import axios from 'axios'
export const useApplicationStore = defineStore('application', {
  //state
  state: () => {
    return {
      dependantRealInfo: [], // 지원자, 담당자, 보호자 실명
      dependantInfo: [], // 지원자 대기단계 정보
      planned: 0, // 계획 추가 시 몇번째 파악
      allPlanned: [], // 계획서 불러오기
      planningReview: [], // 검토중 계획서
      planningSuccess: [], // 승인완료 계획서
      planningRejected: [], // 반려된 계획서
      planningChanging: [], // 반려 후 수정중 계획서
      planningChangingReview: [], // 반려 후 수정중 계획서
      planningState: 0, // 지원계획서 리로드용
      allResult: [], // 결과서 불러오기
      resultReview: [], // 검토중 결과서
      resultSuccess: [], // 승인완료 결과서
      resultRejected: [], // 반려된 결과서
      resultChanging: [], // 반려 후 수정중 결과서
      resultChangingReview: [], // 반려 후 수정중 결과서
    }
  },
  actions: {
    // 지원자, 담당자, 보호자 실명
    async searchdependantInfo(no) {
      this.dependantRealInfo = (await axios.get(`/api/dependantInfo/` + no)).data[0]
      return this.dependantRealInfo
    },

    // 지원자 대기단계관련 확인
    async checkdependantInfo(no) {
      this.dependantInfo = (await axios.get(`/api/application/` + no)).data[0]
      if (this.dependantInfo.status == 'e3') {
        this.dependantInfo.status = '계획'
      }
      if (this.dependantInfo.status == 'e4') {
        this.dependantInfo.status = '중점'
      }
      if (this.dependantInfo.status == 'e5') {
        this.dependantInfo.status = '긴급'
      }

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

    // 결과서 대기상태별 분해
    async countRealResult(no) {
      this.allResult = []
      this.resultReview = []
      this.resultSuccess = []
      this.resultRejected = []
      this.resultChanging = []
      this.resultChangingReview = []
      this.allResult = (await axios.get('/api/reulstReview/' + no)).data
      for (let i = 0; i < this.allResult.length; i++) {
        const dateChange = (day) => {
          let date = new Date(day)
          let realDate = `${date.getFullYear(day)}.${date.getMonth(day) + 1}.${date.getDay(day)}`
          return realDate
        }
        this.allResult[i].planning_start = dateChange(this.allResult[i].planning_start)
        this.allResult[i].planning_end = dateChange(this.allResult[i].planning_end)
        if (this.allResult[i].result_reject_date != null) {
          this.allResult[i].result_reject_date = dateChange(this.allResult[i].result_reject_date)
        }
        this.allResult[i].result_date = dateChange(this.allResult[i].result_date)
        if (this.allResult[i].result_approvedDate != null) {
          this.allResult[i].result_approvedDate = dateChange(this.allResult[i].result_approvedDate)
        }

        if (
          this.allResult[i].result_status === 'i1' &&
          this.allResult[i].result_reject == null &&
          this.allResult[i].result_reject_date == null &&
          this.allResult[i].result_approvedDate == null
        ) {
          this.resultReview.push(this.allResult[i])
          console.log('검토중: ', this.resultReview)
        } else if (
          this.allResult[i].result_status === 'i1' &&
          this.allResult[i].result_reject != null &&
          this.allResult[i].result_reject_date != null &&
          this.allResult[i].result_approvedDate != null
        ) {
          this.resultChanging.push(this.allResult[i])
          console.log('반려수정중', this.resultChanging)
        } else if (
          this.allResult[i].result_status === 'i1' &&
          this.allResult[i].result_reject != null &&
          this.allResult[i].result_reject_date != null &&
          this.allResult[i].result_approvedDate == null
        ) {
          this.allResult[i].checked = false
          this.resultChangingReview.push(this.allResult[i])
          console.log('반려검토중', this.resultChangingReview)
        } else if (this.allResult[i].result_status === 'i2') {
          this.resultSuccess.push(this.allResult[i])
          console.log('승인완료', this.resultSuccess)
        } else if (this.allResult[i].result_status === 'i3') {
          this.resultRejected.push(this.allResult[i])
          console.log('반려', this.resultRejected)
        }
      }
    },
  },
})
