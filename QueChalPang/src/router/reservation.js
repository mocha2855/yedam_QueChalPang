import ReservationGuardian from '@/views/ReservationGuardian.vue'
import ReservationGuardianConfirm from '@/views/ReservationGuardianConfirm.vue'
import ReservationTeacher from '@/views/ReservationTeacher.vue'
import ReservationGuardianMap from '@/views/ReservationGuardianMap.vue'
import ReservationGuardianHistory from '@/views/ReservationGuardianHistory.vue'
import ReservationBlock from '@/views/ReservationBlock.vue'

const reservationRoutes = [
  {
    path: '/resrvTeacher',
    name: 'reservationTeacher',
    component: ReservationTeacher,
  },

  {
    path: '/resrvGuardian',
    name: 'reservationGuardian',
    component: ReservationGuardian,
  },
  {
    path: '/resrvGuardianConfirm',
    name: 'reservationGuardianConfirm',
    component: ReservationGuardianConfirm,
  },
  {
    path: '/resrvGuardianMap',
    name: 'ReservationGuardianMap',
    component: ReservationGuardianMap,
  },
  {
    path: '/resrvGuardianHistory',
    name: 'ReservationGuardianHistory',
    component: ReservationGuardianHistory,
  },
  {
    path: '/resrvBlock',
    name: 'ReservationBlock',
    component: ReservationBlock,
  },
]

export default reservationRoutes
