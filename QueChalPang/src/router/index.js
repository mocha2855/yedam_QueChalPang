import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Tables from '../views/Tables.vue'
import Profile from '../views/Profile.vue'
import Signup from '../views/Signup.vue' //회원가입
import Signin from '../views/Signin.vue' //로그인
import Application from '../views/application.vue' // 각종 지원서
import FindId from '../views/FindId.vue' //아이디찾기
import applicationWait from '../views/components/applicationWait.vue' // 지원대기
import applicationPlanning from '../views/components/applicationPlanning.vue' //지원계획서(작성 및 검토중)
import applicationPlanningSuccess from '../views/components/applicationPlanningSuccess.vue' //지원계획서(작성 및 검토중)
import surveyRoutes from './survey' //시스템관리자 조사지
import centerPopup from '../views/centerPopup.vue' //센터검색팝업
import reservationRoutes from './reservation'
import notConfirmed from '../views/notConfirmed.vue' //지원대기상태인 경우 이동하는 페이지
import centerRoutes from './center' //센터관리페이지
import approvalRoutes from './approval' //멤버 승인 페이지

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
    path: '/profile',
    name: 'Profile',
    component: Profile,
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
    path: '/application/:id',
    name: 'Application',
    component: Application,
    children: [
      {
        path: '/applicationWait/:id',
        name: 'applicationWait',
        component: applicationWait,
      },
      {
        path: '/applicationPlanning/:id',
        name: 'applicationPlanning',
        components: {
          default: applicationPlanning,
          right: applicationPlanningSuccess,
        },
      },
    ],
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
  ...surveyRoutes,
  ...reservationRoutes,
  ...centerRoutes,
  ...approvalRoutes,
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: 'active',
})

export default router
