import ApprovalUserList from '@/views/ApprovalUserList.vue'
import ApprovalManager from '@/views/ApprovalManager.vue'
import ApprovalAdminList from '@/views/ApprovalAdminList.vue'

import ApprovalUserUpdate from '@/views/ApprovalUserUpdate.vue'
import ApprovalManagerUpdate from '@/views/ApprovalManagerUpdate.vue'
import ApprovalAdminUpdate from '@/views/ApprovalAdminUpdate.vue'

const approvalRoutes = [
  {
    path: '/approvalUserList',
    name: 'ApprovalUserList',
    component: ApprovalUserList,
  },
  {
    path: '/approvalManagerList',
    name: 'ApprovalManagerList',
    component: ApprovalManager,
  },
  {
    path: '/approvalAdminList',
    name: 'ApprovalAdminList',
    component: ApprovalAdminList,
  },
  {
    path: '/approvaluserupdate/:id',
    name: 'ApprovalUserUpdate',
    component: ApprovalUserUpdate,
  },
  {
    path: '/approvalmanagerupdate/:id',
    name: 'ApprovalManagerUpdate',
    component: ApprovalManagerUpdate,
  },
  {
    path: '/approvaladminupdate/:id',
    name: 'ApprovalAdminUpdate',
    component: ApprovalAdminUpdate,
  },
]
export default approvalRoutes
