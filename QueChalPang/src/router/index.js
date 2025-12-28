import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Tables from '../views/Tables.vue'
import Profile from '../views/Profile.vue'
import Signup from '../views/Signup.vue'
import Signin from '../views/Signin.vue'
import application from '../views/application.vue' // 각종 지원서
import applicationWait from '../views/components/applicationWait.vue' // 지원대기
import applicationPlanning from '../views/components/applicationPlanning.vue' //지원계획서(작성 및 검토중)
import surveyRoutes from './survey' //시스템관리자 조사지
import centerPopup from '../views/centerPopup.vue'
import reservationRoutes from './reservation'

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
    path: '/application',
    name: 'application',
    component: application,
    children: [
      {
        path: '/applicationWait/:id',
        name: 'applicationWait',
        component: applicationWait,
      },
      {
        path: '/applicationPlanning/:id',
        name: 'applicationPlanning',
        component: applicationPlanning,
      },
    ],
  },

  {
    path: '/centerPopup',
    name: 'centerPopup',
    component: centerPopup,
  },
  ...surveyRoutes,
  ...reservationRoutes,
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: 'active',
})

export default router
