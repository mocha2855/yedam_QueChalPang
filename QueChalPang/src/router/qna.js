// router / qna.js
import QnaGuardian from '@/views/qna/QnaGuardian.vue'
import QnaGuardianDetail from '@/views/qna/QnaGuardianDetail.vue'
import QnaTeacher from '@/views/qna/QnaTeacher.vue'
import QnaTeacherDetail from '@/views/qna/QnaTeacherDetail.vue'

const qnaRoutes = [
  {
    path: '/qnaGuardian',
    name: 'qnaGuardian',
    component: QnaGuardian,
  },
  {
    path: '/qnaGuardianDetail/:qnaNo',
    name: 'qnaGuardianDetail',
    component: QnaGuardianDetail,
  },
  {
    path: '/qnaTeacher',
    name: 'qnaTeacher',
    component: QnaTeacher,
  },
  {
    path: '/qnaTeacherDetail/:qnaNo',
    name: 'qnaTeacherDetail',
    component: QnaTeacherDetail,
  },
]

export default qnaRoutes
