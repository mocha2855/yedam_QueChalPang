import ApprovalUserList from '@/views/ApprovalUserList.vue'
import ApprovalManager from '@/views/ApprovalManager.vue'
import ApprovalUpdate from '@/views/ApprovalUpdate.vue'

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
  {
    path: '/approvalupdate/:id',
    name: 'ApprovalUpdate',
    component: ApprovalUpdate,
  },
]
export default approvalRoutes
