import { defineStore } from 'pinia'
import axios from 'axios'

export const useApprovalStore = defineStore('approval', {
  state: () => ({
    approvalList: [], // 승인 목록
    pendingCount: 0, // 대기 건수
  }),

  actions: {
    // 승인 목록 조회
    async getApprovalList() {
      try {
        const response = await axios.get('/api/members/approval')
        this.approvalList = response.data
      } catch (error) {
        console.error('목록 조회 실패:', error)
      }
    },

    // 승인 처리
    async approveMember(id) {
      try {
        await axios.post(`/api/member/${id}/approve`)
        // 승인 후 목록 다시 불러오기
        await this.getApprovalList()
        await this.getPendingCount()
      } catch (error) {
        console.error('승인 실패:', error)
      }
    },

    // 대기 건수 조회
    async getPendingCount() {
      try {
        const response = await axios.get('/api/members/approval/count')
        this.pendingCount = response.data.count
      } catch (error) {
        console.error('건수 조회 실패:', error)
      }
    },
  },

  getters: {
    // 승인 대기 목록만 (member_confirm = 'l2')
    pendingList: (state) => {
      return state.approvalList.filter((member) => member.member_confirm === 'l2')
    },

    // 승인 완료 목록만 (member_confirm = 'l1')
    approvedList: (state) => {
      return state.approvalList.filter((member) => member.member_confirm === 'l1')
    },

    // 일반회원만 (member_authority = 'ul')
    userList: (state) => {
      return state.approvalList.filter((member) => member.member_authority === 'u1')
    },

    // 관리자만 (member_authority = 'a3')
    adminList: (state) => {
      return state.approvalList.filter((member) => member.member_authority === 'a3')
    },

    // 일반회원 대기 목록
    userPendingList: (state) => {
      return state.approvalList.filter(
        (member) => member.member_authority === 'u1' && member.member_confirm === 'l2',
      )
    },

    // 관리자 대기 목록
    adminPendingList: (state) => {
      return state.approvalList.filter(
        (member) => member.member_authority === 'a3' && member.member_confirm === 'l2',
      )
    },
  },
})
