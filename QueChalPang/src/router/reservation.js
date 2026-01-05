// router / reservation.js
import ReservationGuardian from '@/views/reservation/ReservationGuardian.vue'
import ReservationGuardianConfirm from '@/views/reservation/ReservationGuardianConfirm.vue'
import ReservationTeacher from '@/views/reservation/ReservationTeacher.vue'
import ReservationGuardianMap from '@/views/reservation/ReservationGuardianMap.vue'
import ReservationGuardianHistory from '@/views/reservation/ReservationGuardianHistory.vue'
import ReservationBlock from '@/views/reservation/ReservationBlock.vue'

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
