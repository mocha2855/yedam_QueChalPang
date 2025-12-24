import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Tables from '../views/Tables.vue'
import Profile from '../views/Profile.vue'
import Signup from '../views/Signup.vue'
import Signin from '../views/Signin.vue'
import applicationWait from '../views/applicationWait.vue'
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
    path: '/applicationWait/:id',
    name: 'applicationWait',
    component: applicationWait,
  },
  ...reservationRoutes,
  {
    path: '/centerPopup',
    name: 'centerPopup',
    component: centerPopup,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: 'active',
})

export default router
