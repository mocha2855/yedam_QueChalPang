import ReservationGuardian from "@/views/ReservationGuardian.vue";
import ReservationTeacher from "@/views/ReservationTeacher.vue";

const reservationRoutes = [
  {
    path: '/reservTeacher',
    name: '/reservationTeacher',
    component: ReservationTeacher,
  },

  {
    path: '/reservGuardian',
    name: '/reservationGuardian',
    component: ReservationGuardian,
  },
]

export default reservationRoutes;