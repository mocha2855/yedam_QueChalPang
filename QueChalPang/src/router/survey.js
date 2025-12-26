import SurveyList from '../views/surveyList.vue'
import SurveyInfo from '@/views/surveyInfo.vue'
import SurveyAdd from '../views/surveyAdd.vue'

const surveyRoutes = [
  {
    path: '/surveys',
    name: 'SurveyList',
    component: SurveyList,
  },
  {
    path: '/survey/:no',
    name: 'surveyInfo',
    component: SurveyInfo,
  },
  {
    path: '/surveyAdd',
    name: 'surveyAdd',
    component: SurveyAdd,
  },
]
export default surveyRoutes
