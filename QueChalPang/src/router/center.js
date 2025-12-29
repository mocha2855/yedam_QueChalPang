import centerList from '../views/CenterList.vue'
import centerInfo from '../views/CenterInfo.vue'
import centerAdd from '../views/CenterAdd.vue'
import centerUpdate from '@/views/CenterUpdate.vue'

const centerRoutes = [
  {
    path: '/centerList',
    name: 'centerList',
    component: centerList,
  },
  {
    path: '/center/:no',
    name: 'centerInfo',
    component: centerInfo,
  },
  {
    path: '/centerAdd',
    name: 'centerAdd',
    component: centerAdd,
  },
  {
    path: '/centerUpdate/:no',
    name: 'centerUpdate',
    component: centerUpdate,
  },
]
export default centerRoutes
