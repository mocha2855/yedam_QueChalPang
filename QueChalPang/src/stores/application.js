// stores / application.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
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
    planningFistSave: [],
    planningState: 0,

    allResult: [],
    resultReview: [],
    resultSuccess: [],
    resultRejected: [],
    resultChanging: [],
    resultChangingReview: [],
    resultfirstSave: [],

    attachmentFiles: ref([]),
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
      this.planningFistSave = []

      const res = await axios.get(`/api/planningReview/${applicationNo}`)
      this.allPlanned = Array.isArray(res.data) ? res.data : []

      const dateChange = (day) => {
        if (!day) return null

        const d = new Date(day)
        if (Number.isNaN(d.getTime())) return null
        if (d.getMonth() + 1 > 10) {
          if (d.getDate() < 10) {
            return `${d.getFullYear()}-${d.getMonth() + 1}-0${d.getDate()}`
          }
          return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
        } else {
          if (d.getDate() < 10) {
            return `${d.getFullYear()}-0${d.getMonth() + 1}-0${d.getDate()}`
          }
          return `${d.getFullYear()}-0${d.getMonth() + 1}-${d.getDate()}`
        }
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
        }
        // 임시저장 0111
        else if (it.planning_status === 'i0' && it.planning_reject == null) {
          this.planningFistSave.push(it)
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

        // if (it.planning_status === 'i1') {
        //   if (it.planning_reject == null) {
        //     // 1. 신규 검토중 (반려 사유 없음)
        //     this.planningReview.push(it)
        //   } else {
        //     // 반려 사유가 있는 경우 (i1이면서 reject가 있음)
        //     if (it.planning_approvedDate != null) {
        //       // 2. 담당자가 수정 버튼을 막 누른 상태 (수정 폼 노출 대상)
        //       this.planningChanging.push(it)
        //     } else {
        //       // 3. 담당자가 수정을 마치고 다시 승인 요청을 보낸 상태 (관리자 검토 대상)
        //       it.checked = false
        //       this.planningChangingReview.push(it)
        //     }
        //   }
        // } else if (it.planning_status === 'i2') {
        //   this.planningSuccess.push(it)
        // } else if (it.planning_status === 'i3') {
        //   this.planningRejected.push(it)
        // }
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
      this.resultfirstSave = []

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
        } else if (it.result_status === 'i0') {
          this.resultfirstSave.push(it)
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
    async getFile(e) {
      console.log(e.target.files)
      this.attachmentFiles.value = Array.from(e.target.files)
      console.log('선택된 파일들:', this.attachmentFiles.value)
    },
    async downloadFile(attachmentNo) {
      // 백엔드 다운로드 API 주소를 호출하여 브라우저가 다운로드하게 함
      window.location.href = `http://localhost:3000/api/download/${attachmentNo}`
      // 포트번호(3000)나 도메인은 환경에 맞게 수정하세요.
      // 프록시가 설정되어 있다면 '/api/download/...' 만 써도 됩니다.
    },
    async fetchFilesForPlans(plans) {
      // 리스트가 비어있으면 종료
      if (!plans || plans.length === 0) return
      console.log(plans)
      // 리스트 하나하나(plan)를 꺼내서 확인
      for (const plan of plans) {
        // 1. 그룹 ID가 있는지 확인 (파일이 있는 결과서인지)
        if (plan.attachment_no && plan.attachment_no !== 0) {
          try {
            // 2. 백엔드에 파일 목록 요청
            const res = await axios.get(`/api/attachments/${plan.attachment_no}`)

            // 3. 가져온 파일 목록을 해당 plan 객체 안에 'fileList'라는 이름으로 심어줌
            // 이렇게 해야 템플릿(HTML)에서 v-for="file in plan.fileList"로 보여줄 수 있음
            plan.fileList = res.data
            console.log('plan: ', this.planningFistSave)

            console.log(`파일 로드 완료 (그룹 ${plan.attachment_no}):`, plan.fileList)
          } catch (err) {
            console.error(`파일 목록 조회 실패 (Group: ${plan.attachment_no})`, err)
          }
        }
      }
    },
  },
})
