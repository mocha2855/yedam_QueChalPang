import ReservationGuardian from '@/views/ReservationGuardian.vue'
import ReservationGuardianConfirm from '@/views/ReservationGuardianConfirm.vue'
import ReservationTeacher from '@/views/ReservationTeacher.vue'
import ReservationGuardianMap from '@/views/ReservationGuardianMap.vue'
import ReservationGuardianHistory from '@/views/ReservationGuardianHistory.vue'

const reservationRoutes = [
  {
    path: '/reservTeacher',
    name: 'reservationTeacher',
    component: ReservationTeacher,
  },

  {
    path: '/reservGuardian',
    name: 'reservationGuardian',
    component: ReservationGuardian,
  },
  {
    path: '/reservGuardianConfirm',
    name: 'reservationGuardianConfirm',
    component: ReservationGuardianConfirm,
  },
  {
    path: '/reservGuardianMap',
    name: 'ReservationGuardianMap',
    component: ReservationGuardianMap,
  },
  {
    path: '/resrvGuardianHistory',
    name: 'ReservationGuardianHistory',
    component: ReservationGuardianHistory,
  },
]

export default reservationRoutes
