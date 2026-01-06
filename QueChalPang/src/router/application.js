import Application from '../views/Application.vue'
import applicationWait from '../views/components/application/applicationWait.vue' // 지원대기
import applicationPlanning from '../views/components/application/applicationPlanning.vue' //지원계획서(작성 및 검토중)
import applicationPlanningSuccess from '../views/components/application/applicationPlanningSuccess.vue' //지원계획서(승인, 반려)
import applicationResult from '../views/components/application/applicationResult.vue' //지원결과서(작성 및 검토중)
import applicationResultSuccess from '../views/components/application/applicationResultSuccess.vue' //지원결과서(승인, 반려)

import meetingLogList from '../views/components/meetingLog/meetingLogList.vue'
import meetingLogDetail from '../views/components/meetingLog/meetingLogDetail.vue'

const applicationRoutes = [
  {
    path: '/application/:id',
    name: 'Application',
    component: Application,
    children: [
      {
        path: '/applicationWait/:id',
        name: 'applicationWait',
        component: applicationWait,
      },
      {
        path: '/applicationPlanning/:id',
        name: 'applicationPlanning',
        components: {
          default: applicationPlanning,
          right: applicationPlanningSuccess,
        },
      },
      {
        path: '/applicationResult/:id',
        name: 'applicationResult',
        components: {
          default: applicationResult,
          right: applicationResultSuccess,
        },
      },
      {
        path: 'meetingLog',
        name: 'meetingLog',
        components: {
          default: meetingLogDetail,
          right: meetingLogList,
        },
      },
    ],
  },
]
export default applicationRoutes
