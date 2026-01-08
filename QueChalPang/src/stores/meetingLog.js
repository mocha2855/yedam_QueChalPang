import { defineStore } from 'pinia'
import axios from 'axios'

export const useMeetingLogStore = defineStore('meetingLog', {
  state: () => ({
    logs: [],
    selectedResvId: null,

    // 오른쪽 패널 모드
    // idle | view | write
    mode: 'idle',

    // 내역보기(상세)
    detail: null,
    detailLoading: false,

    // 작성하기(폼)
    writeForm: {
      resv_id: null,
      log_title: '',
      log_content: '',
      log_date: '',
    },
  }),

  getters: {
    selectedLog(state) {
      return state.logs.find((x) => x.resv_id === state.selectedResvId) || null
    },
  },

  actions: {
    async fetchByAppNo(appNo) {
      const res = await axios.get(`/api/logByAppNo/${appNo}`)
      this.logs = Array.isArray(res.data) ? res.data : []
      this.selectedResvId = this.logs[0]?.resv_id ?? null

      // 목록 로드 후 오른쪽 초기화
      this.mode = 'idle'
      this.detail = null
      this.writeForm = { resv_id: null, log_title: '', log_content: '', log_date: '' }
    },

    select(resvId) {
      this.selectedResvId = resvId
    },

    // 내역보기 버튼 눌렀을 때
    async fetchDetailByResvId(resvId) {
      this.mode = 'view'
      this.detailLoading = true
      try {
        const res = await axios.get(`/api/meetingLogDetail/${resvId}`)
        this.detail = res.data || null
      } finally {
        this.detailLoading = false
      }
    },

    // 작성하기 버튼 눌렀을 때
    openWriteForm(row) {
      this.mode = 'write'
      this.selectedResvId = row.resv_id
      this.detail = null

      this.writeForm = {
        resv_id: row.resv_id,
        log_title: '',
        log_content: '',
        log_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      }
    },

    cancelWriteForm() {
      this.mode = 'idle'
      this.writeForm = { resv_id: null, log_title: '', log_content: '', log_date: '' }
    },

    startWrite(row) {
      this.mode = 'write'
      this.selectedResvId = row.resv_id
      this.detail = null

      this.writeForm = {
        resv_id: row.resv_id,
        log_date: new Date().toISOString().slice(0, 16).replace('T', ' '), // 화면용
        log_title: '',
        log_content: '',
      }
    },

    // ✅ 저장 버튼 (백 POST 연결)
    async submitWriteForm() {
      // 기본 검증
      if (!this.writeForm.resv_id) {
        alert('예약을 먼저 선택해주세요.')
        return
      }
      if (!this.writeForm.log_title?.trim() || !this.writeForm.log_content?.trim()) {
        alert('제목/내용을 입력해주세요.')
        return
      }

      // 작성자(member_id) 필요 -> 로그인 스토어에서 가져오는게 제일 안전
      // (너 프로젝트는 useCounterStore 존재하니까 거기서 꺼내자)
      const { useCounterStore } = await import('@/stores/member')
      const counter = useCounterStore()
      const memberId = counter.isLogIn?.info?.member_id

      if (!memberId) {
        alert('로그인 정보가 없습니다.')
        return
      }

      // POST
      const payload = {
        resv_id: this.writeForm.resv_id,
        member_id: memberId,
        log_title: this.writeForm.log_title,
        log_content: this.writeForm.log_content,
      }

      const res = await axios.post('/api/meetingLog', payload)

      // 성공하면 상담상태 f3변환
      // if(res.data){
      // const changeReulst = await axios.post('')
      // }

      // 성공하면: detail 채우고 view로 전환
      this.detail = res.data || null
      this.mode = 'view'

      // 목록 갱신 (has_meeting_log 1로 바뀌게)
      const appNo = this.selectedLog?.application_no
      if (appNo) await this.fetchByAppNo(appNo)

      // 그리고 다시 방금 resv 선택 + detail 재조회(갱신 fetchByAppNo가 초기화해버리니까)
      this.selectedResvId = payload.resv_id
      await this.fetchDetailByResvId(payload.resv_id)
    },
  },
})
