import SurveyList from '../views/survey/SurveyList.vue'
import SurveyInfo from '../views/survey/SurveyInfo.vue'
import SurveyAdd from '../views/survey/SurveyAdd.vue'
import SurveyUpdate from '../views/survey/SurveyUpdate.vue'

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
