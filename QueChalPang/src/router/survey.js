import SurveyList from '../views/surveyList.vue'
import SurveyInfo from '@/views/surveyInfo.vue'

const surveyRoutes = [
  {
    path: '/surveys',
    name: '/surveyList',
    component: SurveyList,
  },
  {
    path: '/survey/:no',
    name: 'surveyInfo',
    component: SurveyInfo,
  },
]
export default surveyRoutes
