import SurveyList from '../views/SurveyList.vue'
import SurveyInfo from '../views/SurveyInfo.vue'
import SurveyAdd from '../views/SurveyAdd.vue'
import SurveyUpdate from '@/views/SurveyUpdate.vue'

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
  {
    path: '/surveyUpdate/:no',
    name: 'surveyUpdate',
    component: SurveyUpdate,
  },
]
export default surveyRoutes
