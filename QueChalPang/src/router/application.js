import Application from '../views/application/Application.vue'

import applicationWait from '../views/application/waits/ApplicationWaitContainer.vue'
import applicationPlanning from '../views/application/ApplicationPlanning.vue'
import applicationPlanningSuccess from '../views/application/applicationPlanningSuccess.vue'
import applicationResult from '../views/application/applicationResult.vue'
import applicationResultSuccess from '../views/application/applicationResultSuccess.vue'

import addApplication from '../views/addApplication.vue'
import ApplicationInfo from '../views/application/ApplicationInfo.vue'

import meetingLogList from '../views/meetingLog/meetingLogList.vue'
import meetingLogDetail from '../views/meetingLog/meetingLogDetail.vue'

const applicationRoutes = [
  {
    path: '/application/:id',
    name: 'Application',
    component: Application,
    children: [
      // 기본 진입 → 지원신청서
      { path: '', redirect: { name: 'applicationWait' } },

      {
        path: 'wait',
        name: 'applicationWait',
        components: {
          default: applicationWait,
          right: ApplicationInfo,
        },
      },
      {
        path: 'planning',
        name: 'applicationPlanning',
        components: {
          default: applicationPlanning, // ← 여기서 ApplicationPlanning.vue
          right: applicationPlanningSuccess,
        },
      },
      {
        path: 'result',
        name: 'applicationResult',
        components: {
          default: applicationResult,
          right: applicationResultSuccess,
        },
      },
      {
        path: 'meetingLog',
        name: 'meetingLog',
        props: true,
        components: {
          default: meetingLogDetail,
          right: meetingLogList,
        },
      },
    ],
  },
  {
    path: '/addApplication',
    name: 'AddApplication',
    component: addApplication,
  },
]

export default applicationRoutes
