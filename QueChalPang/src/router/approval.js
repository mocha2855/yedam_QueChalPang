import ApprovalUserList from '@/views/ApprovalUserList.vue'
import ApprovalManager from '@/views/ApprovalManager.vue'

const approvalRoutes = [
  {
    path: '/ApprovalUserList',
    name: 'ApprovalUserList',
    component: ApprovalUserList,
  },
  {
    path: '/ApprovalManagerList',
    name: 'ApprovalManagerList',
    component: ApprovalManager,
  },
]
export default approvalRoutes
