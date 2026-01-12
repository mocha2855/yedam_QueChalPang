<!-- Sidenav/index.vue -->
<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import SidenavList from './SidenavList.vue'
import ApprovalSidenavList from './AprrovalSidenav' //승인관리 사이드바 추가
import MypageSidenav from './MypageSidenav.vue' //마이페이지 사이드바관리
import logo from '@/assets/img/logo-ct-dark.png'
import logoWhite from '@/assets/img/logo-ct.png'

import { useRoute } from 'vue-router'

const route = useRoute()
const store = useStore()
const layout = computed(() => store.state.layout)
const sidebarType = computed(() => store.state.sidebarType)
const darkMode = computed(() => store.state.darkMode)

// 이 부분 추가
const hiddenRoutes = [
  'dashboard-default',
  'signin',
  'signup',
  'find-id',
  'resetPassword',
  'surveys',
  'survey',
  'surveyAdd',
  'surveyUpdate',
  'resrvTeacher', // 담당자 상담 예약
  'resrvGuardian', // 보호자 상담 예약
  'resrvGuardianConfirm', // 상담 예약 확인
  'resrvGuardianMap', // 상담 지도
  'resrvGuardianHistory', // 상담 이력
  'resrvBlock', // 상담 차단
  // QnA 추가
  'qnaGuardian',
  'qnaGuardianDetail',
  'qnaTeacher',
  'qnaTeacherDetail',
]

const shouldHideSidenav = computed(() => {
  const currentRoute = route.path.split('/')[1]
  return hiddenRoutes.includes(currentRoute)
})

//승인관리
const isApprovalPage = computed(() => {
  const path = route.path.toLowerCase() // 이거 추가!
  return (
    !path.includes('mypage') && // 소문자로 체크
    (path.includes('approval') || path.includes('master01')) // 소문자로 체크
  )
})

// 마이페이지(내정보보기)
const isMyPage = computed(() => {
  return route.path.includes('myPage')
})
</script>
<template>
  <div
    v-show="layout === 'default'"
    class="min-height-300 position-absolute w-100"
    :class="`${darkMode ? 'bg-transparent' : 'bg-transparent'}`"
  />

  <aside
    v-if="!shouldHideSidenav"
    class="sidenav navbar navbar-vertical navbar-expand-xs border-radius-xl"
    id="sidenav-main"
  >
    <div class="sidenav-header">
      <i
        class="top-0 p-3 cursor-pointer fas fa-times text-secondary opacity-5 position-absolute end-0 d-none d-xl-none"
        aria-hidden="true"
        id="iconSidenav"
      ></i>

      <router-link class="m-0 navbar-brand" to="/">
        <img
          :src="darkMode || sidebarType === 'bg-default' ? logoWhite : logo"
          class="navbar-brand-img h-100"
          alt="main_logo"
        />

        <span class="ms-2 font-weight-bold me-2">발달장애인 프로그램</span>
      </router-link>
    </div>

    <hr class="mt-0 horizontal dark" />

    <!-- 승인 관리면 ApprovalSidenavList -->
    <ApprovalSidenavList v-if="isApprovalPage" />
    <!-- 마이페이지면 MypageSidenav -->
    <MypageSidenav v-else-if="isMyPage" />
    <!-- v-if 대신 v-else-if -->
    <!-- 아니면 기본 SidenavList -->
    <SidenavList v-else />
  </aside>
</template>

<style scoped>
#sidenav-main {
  position: fixed !important;
  top: 56px !important;
  left: 0;
  width: 260px;
  height: calc(100vh - 56px) !important;
  overflow-y: auto;
  z-index: 900;
}
</style>
