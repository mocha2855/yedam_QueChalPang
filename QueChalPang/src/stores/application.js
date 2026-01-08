// stores / application.js
import { defineStore } from 'pinia'
import axios from 'axios'
import { useCounterStore } from '@/stores/member'

export const useApplicationStore = defineStore('application', {
  state: () => ({
    dependantRealInfo: {},
    dependantInfo: {},

    planned: 0,

    allPlanned: [],
    planningReview: [],
    planningSuccess: [],
    planningRejected: [],
    planningChanging: [],
    planningChangingReview: [],
    planningState: 0,

    allResult: [],
    resultReview: [],
    resultSuccess: [],
    resultRejected: [],
    resultChanging: [],
    resultChangingReview: [],
  }),

  actions: {
    //관리자가 일반회원 담당자 배정하기
    async assignManager(applicationNo, managerId) {
      const counterStore = useCounterStore()
      const adminId = counterStore.isLogIn.info.member_id // 배정한 관리자

      await axios.put(`/api/application/${applicationNo}/manager`, {
        manager_id: managerId,
        updater_id: adminId,
      })

      // 배정 후 해당 신청서 컨텍스트 다시 로딩
      await this.loadApplicationContext(applicationNo)
      return this.dependantInfo
    },

    // 대기단계 승인 (관리자)
    async approveWaitStatus(applicationNo) {
      const counterStore = useCounterStore()
      const approverId = counterStore.isLogIn.info.member_id

      await axios.put(`/api/approveStatus/${applicationNo}`, {
        approverId,
      })

      // 승인 후 상태 다시 불러오기
      await this.loadApplicationContext(applicationNo)
    },

    // 대기단계 반려 (관리자)
    async rejectWaitStatus(applicationNo, reason) {
      const counterStore = useCounterStore()
      const rejectorId = counterStore.isLogIn.info.member_id // 반려한 관리자

      await axios.put(`/api/rejectstatus/${applicationNo}`, {
        status_reject: reason,
        rejectorId,
      })

      // 반려 후 상태 다시 불러오기
      await this.loadApplicationContext(applicationNo)
    },

    // 지원자, 담당자, 보호자 실명
    async searchdependantInfo(dependantNo) {
      const res = await axios.get(`/api/dependantInfo/${dependantNo}`)
      const row = Array.isArray(res.data) ? res.data[0] : res.data
      this.dependantRealInfo = row ?? {}
      return this.dependantRealInfo
    },

    // 지원자 대기단계관련 확인 (application_no 기준)
    async checkdependantInfo(applicationNo) {
      const res = await axios.get(`/api/application/${applicationNo}`)
      const row = Array.isArray(res.data) ? res.data[0] : res.data

      if (!row) {
        this.dependantInfo = { status: 'e1', status_text: '대기' }
        return this.dependantInfo
      }

      const statusMap = { e1: '대기', e2: '검토중', e3: '계획', e4: '중점', e5: '긴급' }

      this.dependantInfo = {
        ...row,
        status_text: statusMap[row.status] ?? row.status,
      }

      return this.dependantInfo
    },

    // application_no로 들어오면 -> dependant_no 뽑아서 dependantInfo까지 같이 세팅
    async loadApplicationContext(applicationNo) {
      const info = await this.checkdependantInfo(applicationNo)

      const dependantNo = info?.dependant_no
      if (dependantNo) {
        await this.searchdependantInfo(dependantNo)
      } else {
        this.dependantRealInfo = {}
      }

      return { dependantInfo: this.dependantInfo, dependantRealInfo: this.dependantRealInfo }
    },

    // 계획서 갯수 파악 (application_no 기준)
    async countPlanning(applicationNo) {
      const res = await axios.get(`/api/planning/${applicationNo}`)
      // res.data가 {counts:...} / 배열 / 숫자 등 어떤 형태든 안전하게
      const row = Array.isArray(res.data) ? res.data[0] : res.data
      this.planned = Number(row?.counts ?? row ?? 0)
      return this.planned
    },

    // 계획서 대기상태별 분해 (application_no 기준)
    async countRealReview(applicationNo) {
      this.allPlanned = []
      this.planningReview = []
      this.planningSuccess = []
      this.planningRejected = []
      this.planningChanging = []
      this.planningChangingReview = []

      const res = await axios.get(`/api/planningReview/${applicationNo}`)
      this.allPlanned = Array.isArray(res.data) ? res.data : []

      const dateChange = (day) => {
        if (!day) return null
        const d = new Date(day)
        if (Number.isNaN(d.getTime())) return null
        return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`
      }

      for (let i = 0; i < this.allPlanned.length; i++) {
        const it = this.allPlanned[i]

        it.planning_start = dateChange(it.planning_start)
        it.planning_end = dateChange(it.planning_end)
        it.planning_reject_date = it.planning_reject_date
          ? dateChange(it.planning_reject_date)
          : null
        it.planning_date = dateChange(it.planning_date)
        it.planning_approvedDate = it.planning_approvedDate
          ? dateChange(it.planning_approvedDate)
          : null

        if (
          it.planning_status === 'i1' &&
          it.planning_reject == null &&
          it.planning_reject_date == null &&
          it.planning_approvedDate == null
        ) {
          this.planningReview.push(it)
        } else if (
          it.planning_status === 'i1' &&
          it.planning_reject != null &&
          it.planning_reject_date != null &&
          it.planning_approvedDate != null
        ) {
          this.planningChanging.push(it)
        } else if (
          it.planning_status === 'i1' &&
          it.planning_reject != null &&
          it.planning_reject_date != null &&
          it.planning_approvedDate == null
        ) {
          it.checked = false
          this.planningChangingReview.push(it)
        } else if (it.planning_status === 'i2') {
          this.planningSuccess.push(it)
        } else if (it.planning_status === 'i3') {
          this.planningRejected.push(it)
        }
      }

      return {
        allPlanned: this.allPlanned,
        planningReview: this.planningReview,
        planningSuccess: this.planningSuccess,
        planningRejected: this.planningRejected,
        planningChanging: this.planningChanging,
        planningChangingReview: this.planningChangingReview,
      }
    },

    // 결과서 대기상태별 분해 (application_no 기준)
    async countRealResult(applicationNo) {
      this.allResult = []
      this.resultReview = []
      this.resultSuccess = []
      this.resultRejected = []
      this.resultChanging = []
      this.resultChangingReview = []

      const res = await axios.get(`/api/resultReview/${applicationNo}`)
      this.allResult = Array.isArray(res.data) ? res.data : []

      const dateChange = (day) => {
        if (!day) return null
        const d = new Date(day)
        if (Number.isNaN(d.getTime())) return null
        return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`
      }

      for (let i = 0; i < this.allResult.length; i++) {
        const it = this.allResult[i]

        it.planning_start = dateChange(it.planning_start)
        it.planning_end = dateChange(it.planning_end)
        it.result_reject_date = it.result_reject_date ? dateChange(it.result_reject_date) : null
        it.result_date = dateChange(it.result_date)
        it.result_approvedDate = it.result_approvedDate ? dateChange(it.result_approvedDate) : null

        if (
          it.result_status === 'i1' &&
          it.result_reject == null &&
          it.result_reject_date == null &&
          it.result_approvedDate == null
        ) {
          this.resultReview.push(it)
        } else if (
          it.result_status === 'i1' &&
          it.result_reject != null &&
          it.result_reject_date != null &&
          it.result_approvedDate != null
        ) {
          this.resultChanging.push(it)
        } else if (
          it.result_status === 'i1' &&
          it.result_reject != null &&
          it.result_reject_date != null &&
          it.result_approvedDate == null
        ) {
          it.checked = false
          this.resultChangingReview.push(it)
        } else if (it.result_status === 'i2') {
          this.resultSuccess.push(it)
        } else if (it.result_status === 'i3') {
          this.resultRejected.push(it)
        }
      }

      return {
        allResult: this.allResult,
        resultReview: this.resultReview,
        resultSuccess: this.resultSuccess,
        resultRejected: this.resultRejected,
        resultChanging: this.resultChanging,
        resultChangingReview: this.resultChangingReview,
      }
    },
  },
})
