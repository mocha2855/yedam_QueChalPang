// src/stores/qna.js
import { defineStore } from 'pinia'
import axios from 'axios'

export const useQnaStore = defineStore('qna', {
  state: () => ({
    rows: [],
    dependants: [],
    loading: false,
    error: null,
  }),

  getters: {
    // 화면에서 바로 쓸 가공된 rows
    filteredRows: (state) => {
      const statusMap = {
        k1: { label: '답변완료', class: 'status-done' },
        k2: { label: '답변미등록', class: 'status-wait' },
      }

      const categoryMap = {
        c1: { label: '상담' },
        c2: { label: '지원자 등록' },
        c3: { label: '지원계획서' },
        c4: { label: '지원결과서' },
        c5: { label: '기타' },
      }

      const statusInfo = (s) => statusMap[s] ?? { label: s ?? '', class: 'status-default' }
      const categoryInfo = (c) => categoryMap[c] ?? { label: c ?? '' }

      return state.rows.map((r) => {
        const s = statusInfo(r.status)
        const c = categoryInfo(r.category)
        const qna_no = r.qna_no || r.QNA_NO

        return {
          no: qna_no, //오류났던 이유: qna.js 에서 selectQlistByMid 에 q.qna_no가 없었음
          title: r.qna_title,
          category: c.label,
          writer: r.author_name,
          manager: r.manager_name ?? '미배정',
          responder: r.respondent_name ?? (r.respondent ? r.respondent : ''),
          date: String(r.date).slice(0, 10).replaceAll('-', '. ') + '.',
          status: s.label,
          statusClass: s.class,
          dependant: r.dependant_name ?? '-',
        }
      })
    },
  },

  actions: {
    async fetchByMemberId(memberId) {
      if (!memberId) return
      this.loading = true
      this.error = null

      try {
        const res = await axios.get(`/api/qlistByMid/${memberId}`)
        this.rows = res.data
      } catch (e) {
        this.error = e
        this.rows = []
      } finally {
        this.loading = false
      }
    },

    async addQnaByGuardian(memberId, payload) {
      if (!memberId) return
      this.loading = true
      this.error = null

      const res = await axios.post(`/api/addQnaByGuardian/${memberId}`, payload)

      await this.fetchByMemberId(memberId)
      return res.data
    },

    async fetchByManagerMain(managerId) {
      if (!managerId) return
      this.loading = true
      this.error = null

      try {
        const res = await axios.get(`/api/qlistByManagerMain/${managerId}`)
        this.rows = res.data
      } catch (e) {
        this.error = e
        this.rows = []
      } finally {
        this.loading = false
      }
    },
    async fetchDependantsByMember(memberId) {
      if (!memberId) return
      this.loading = true
      this.error = null

      try {
        const res = await axios.get(`/api/dependantsByMember/${memberId}`)
        this.dependants = res.data
      } catch (e) {
        this.error = e
        this.dependants = []
      } finally {
        this.loading = false
      }
    },

    clear() {
      this.rows = []
      this.dependants = []
      this.error = null
      this.loading = false
    },
  },
})
