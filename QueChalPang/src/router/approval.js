//리스트 테이블
import ApprovalUserList from '@/views/Sadmin/ApprovalUserList.vue'
import ApprovalManager from '@/views/Sadmin/ApprovalManager.vue'
import ApprovalAdminList from '@/views/Sadmin/ApprovalAdminList.vue'

//회원정보 수정
import ApprovalUserUpdate from '@/views/Sadmin/ApprovalUserUpdate.vue'
import ApprovalManagerUpdate from '@/views/Sadmin/ApprovalManagerUpdate.vue'
import ApprovalAdminUpdate from '@/views/Sadmin/ApprovalAdminUpdate.vue'

//담당자&관리자 등록
import ApprovalManagerAdd from '@/views/Sadmin/ApprovalManagerAdd.vue'
import ApprovalAdminAdd from '@/views/Sadmin/ApprovalAdminAdd.vue'

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
  {
    path: '/approvalmanageradd',
    name: 'ApprovalManagerAdd',
    component: ApprovalManagerAdd,
  },
  {
    path: '/approvaladminadd',
    name: 'ApprovalAdminAdd',
    component: ApprovalAdminAdd,
  },
]
export default approvalRoutes
