import { defineStore } from 'pinia'
import axios from 'axios'

export const useApprovalStore = defineStore('approval', {
  state: () => ({
    approvalList: [], // 승인 목록
    pendingCount: 0, // 대기 건수
    rejectedCount: 0, //거절 건수
    deletedCount: 0, //삭제 건수
  }),

  actions: {
    //회원상세 정보 가져오기
    async getMemberById(id) {
      try {
        const response = await axios.get(`/api/member/${id}`)
        return response.data
      } catch (error) {
        console.error('회원 정보 조회 실패:', error)
      }
    },
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

    // 승인 거절 처리
    async rejectMember(id) {
      try {
        await axios.post(`/api/member/${id}/reject`)
        await this.getApprovalList()
        await this.getRejectedCount()
      } catch (error) {
        console.error('승인 실패:', error)
      }
    },

    // 거절 건수 조회
    async getRejectedCount() {
      try {
        const response = await axios.get('/api/members/rejected/count')
        this.rejectedCount = response.data.count
      } catch (error) {
        console.error('건수 조회 실패:', error)
      }
    },

    // 회원 삭제 처리
    async deleteMember(id) {
      try {
        await axios.delete(`/api/member/${id}`)
        // 삭제 후 목록 다시 불러오기
        await this.getApprovalList()
        await this.getDeletedCount()
      } catch (error) {
        console.error('삭제 실패:', error)
      }
    },

    // 삭제 건수 조회
    async getDeletedCount() {
      try {
        const response = await axios.get('/api/members/deleted/count')
        this.deletedCount = response.data.count
      } catch (error) {
        console.error('건수 조회 실패:', error)
      }
    },
  },

  getters: {
    // 승인 완료 목록만 (member_confirm = 'l1')
    approvedList: (state) => {
      return state.approvalList.filter((member) => member.member_confirm === 'l1')
    },

    // 승인 대기 목록만 (member_confirm = 'l2')
    pendingList: (state) => {
      return state.approvalList.filter((member) => member.member_confirm === 'l2')
    },

    // 승인 거절 목록만 (member_confirm = 'l3')
    rejectedList: (state) => {
      return state.approvalList.filter((member) => member.member_confirm === 'l1')
    },

    // 삭제된 목록 추가 (member_confirm = 'l4')
    deletedList: (state) => {
      return state.approvalList.filter((member) => member.member_confirm === 'l4')
    },

    // 일반회원 삭제 목록
    userDeletedList: (state) => {
      return state.approvalList.filter(
        (member) => member.member_authority === 'a1' && member.member_confirm === 'l4',
      )
    },
    // 담당자 삭제 목록
    managerDeletedList: (state) => {
      return state.approvalList.filter(
        (member) => member.member_authority === 'a2' && member.member_confirm === 'l4',
      )
    },

    // 관리자 삭제 목록
    adminDeletedList: (state) => {
      return state.approvalList.filter(
        (member) => member.member_authority === 'a3' && member.member_confirm === 'l4',
      )
    },
    // 일반회원만 (member_authority = 'a1')
    userList: (state) => {
      return state.approvalList.filter((member) => member.member_authority === 'a1')
    },
    // 담당자만 (member_authority = 'a2')
    managerList: (state) => {
      return state.approvalList.filter((member) => member.member_authority === 'a2')
    },

    // 관리자만 (member_authority = 'a3')
    adminList: (state) => {
      return state.approvalList.filter((member) => member.member_authority === 'a3')
    },

    // 일반회원 대기 목록
    userPendingList: (state) => {
      return state.approvalList.filter(
        (member) => member.member_authority === 'a1' && member.member_confirm === 'l2',
      )
    },
    // 일반회원 거절 목록
    userRejectedList: (state) => {
      return state.approvalList.filter(
        (member) => member.member_authority === 'a1' && member.member_confirm === 'l3',
      )
    },
    //담당자 대기 목록
    managerPendingList: (state) => {
      return state.approvalList.filter(
        (member) => member.member_authority === 'a2' && member.member_confirm === 'l2',
      )
    },
    //담당자 거절 목록
    managerRejectedList: (state) => {
      return state.approvalList.filter(
        (member) => member.member_authority === 'a2' && member.member_confirm === 'l3',
      )
    },

    // 관리자 대기 목록
    adminPendingList: (state) => {
      return state.approvalList.filter(
        (member) => member.member_authority === 'a3' && member.member_confirm === 'l2',
      )
    },
    //관리자 거절 목록
    adminRejectedList: (state) => {
      return state.approvalList.filter(
        (member) => member.member_authority === 'a2' && member.member_confirm === 'l3',
      )
    },
  },
})
