const mypageRoutes = [
  {
    path: '/myPage/:id',
    name: 'myPage',
    component: () => import('../views/mypage/myPage.vue'), // 마이페이지(담당자 본인 정보 보기)
  },
  {
    path: '/myPageList/:id',
    name: 'myPageList',
    component: () => import('../views/mypage/myPageList.vue'), // 마이페이지(담당자 지원자 목록)
  },
  {
    path: '/myPageDetail/:id',
    name: 'myPageDetail',
    component: () => import('../views/mypage/myPageDetail.vue'), // 담당 지원자 마이페이지 상세보기(담당자)
  },
  {
    path: '/myPageAddDependant',
    name: 'myPageAddDependant',
    component: () => import('../views/mypage/myPageAddDependant.vue'), // 마이페이지 지원자 등록(담당자/보호자)
  },
  {
    path: '/myPageGuardian',
    name: 'myPageGuardian',
    component: () => import('../views/mypage/myPageGuardian.vue'), // 마이페이지(보호자)
  },
  {
    path: '/myPageGuardianList',
    name: 'myPageGuardianList',
    component: () => import('../views/mypage/myPageGuardianList.vue'), // 마이페이지 지원자 목록(보호자)
  },

  {
    path: '/myPageCenterInfo',
    name: 'myPageCenterInfo',
    component: () => import('../views/mypage/myPageGuardianList.vue'), // 마이페이지 센터 정보(관리자)
  },
]

export default mypageRoutes
