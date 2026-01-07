import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Tables from '../views/Tables.vue'
import TablesManager from '../views/TablesManager.vue'
import Signup from '../views/Signup.vue' //회원가입
import Signin from '../views/Signin.vue' //로그인
import FindId from '../views/FindId.vue' //아이디찾기
import ResetPass from '../views/ResetPass.vue' //비밀번호 재설정 페이지
import centerPopup from '../views/centerPopup.vue' //센터검색팝업
import notConfirmed from '../views/notConfirmed.vue' //지원대기상태인 경우 이동하는 페이지
import centerRoutes from './center' //센터관리페이지
import approvalRoutes from './approval' //멤버 승인 페이지
import myPage from '../views/myPage.vue' // 마이페이지(담당자 본인 정보 보기)
import myPageList from '@/views/myPageList.vue' // 마이페이지(담당자 지원자 목록)
import myPageDetail from '@/views/myPageDetail.vue' // 담당 지원자 마이페이지 상세보기(담당자)
import myPageAddDependant from '@/views/myPageAddDependant.vue' // 마이페이지 지원자 등록(담당자)
import myPageGuardian from '@/views/myPageGuardian.vue' // 마이페이지(보호자)

import qnaRoutes from './qna' //질문하기
import surveyRoutes from './survey' //시스템관리자 조사지
import reservationRoutes from './reservation' //상담예약
import applicationRoutes from './application' //지원서, 계획서, 결과서 띄우기

const routes = [
  {
    path: '/',
    name: '/',
    redirect: '/dashboard-default',
  },

  {
    path: '/dashboard-default',
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/tables',
    name: 'Tables',
    component: Tables,
  },
  {
    path: '/tablesManager',
    name: 'TablesManager',
    component: TablesManager,
  },
  {
    path: '/signin',
    name: 'Signin',
    component: Signin,
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
  },
  {
    path: '/findId',
    name: 'FindId',
    component: FindId,
  },
  {
    path: '/resetPassword',
    name: 'ResetPass',
    component: ResetPass,
  },
  {
    path: '/centerPopup',
    name: 'centerPopup',
    component: centerPopup,
  },
  {
    path: '/notConfirmed',
    name: 'notConfirmed',
    component: notConfirmed,
  },

  {
    path: '/myPage/:id',
    name: 'myPage',
    component: myPage,
  },
  {
    path: '/myPageList/:id',
    name: 'myPageList',
    component: myPageList,
  },
  {
    path: '/myPageDetail/:id',
    name: 'myPageDetail',
    component: myPageDetail,
  },
  {
    path: '/myPageAddDependant',
    name: 'myPageAddDependant',
    component: myPageAddDependant,
  },
  {
    path: '/myPageGuardian',
    name: 'myPageGuardian',
    component: myPageGuardian,
  },

  ...surveyRoutes,
  ...reservationRoutes,
  ...centerRoutes,
  ...approvalRoutes,
  ...qnaRoutes,
  ...applicationRoutes,
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: 'active',
})

export default router
