import UserList from '@/views/UserList.vue'
import UserListUpdate from '@/views/USerListUpdate.vue'

const userRoutes = [
  {
    path: '/userList',
    name: 'UserList',
    component: UserList,
  },
  {
    path: '/userListUpdate/:id',
    name: 'UserListUpdate',
    component: UserListUpdate,
  },
]
export default userRoutes
