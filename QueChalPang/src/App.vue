<!-- src/App.vue -->
<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

import Navbar from '@/examples/Navbars/Navbar.vue'
import Sidenav from './examples/Sidenav'
import Configurator from '@/examples/Configurator.vue'
import AllModal from './views/components/modals/AllModal.vue'

const store = useStore()
const route = useRoute()

const showNavbar = computed(() => store.state.showNavbar)
const showSidenav = computed(() => store.state.showSidenav)

//인증 페이지면 풀화면
const isAuthPage = computed(() => {
  return (
    route.path.indexOf('sign') > 0 ||
    route.path.indexOf('application') > 0 ||
    route.path === '/centerPopup' ||
    route.path === '/notConfirmed' ||
    route.path.indexOf('Id') > 0
  )
})

// 서베이 페이지 체크 추가
const isSurveyPage = computed(() => {
  return (
    route.path.startsWith('/surveys') ||
    route.path.startsWith('/survey') ||
    route.path.startsWith('/surveyAdd') ||
    route.path.startsWith('/surveyUpdate')
  )
})
// QnA 페이지 체크 추가
const isQnaPage = computed(() => {
  return route.path.startsWith('/qna')
})

// 메인 대시보드, 인증 페이지, 서베이 페이지 모두 풀화면
const isFullWidthPage = computed(() => {
  return (
    isAuthPage.value ||
    route.path === '/dashboard-default' ||
    isSurveyPage.value ||
    isReservationPage.value ||
    isQnaPage.value
  )
})

// 상담(예약) 페이지 체크 추가
const isReservationPage = computed(() => {
  return route.path.startsWith('/resrv')
})
</script>

<template>
  <!-- 상단 네비바 -->
  <Navbar v-if="showNavbar" class="app-navbar" />

  <!-- 좌우 레이아웃 -->
  <div class="app-layout">
    <Sidenav v-if="showSidenav" />

    <main class="app-main" :class="{ 'app-main--full': isFullWidthPage }">
      <router-view />
    </main>
  </div>
  <Configurator />
  <AllModal />
</template>

<style>
@font-face {
  font-family: 'Cubano';
  src: url('@/assets/fonts/Cubano.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

.app-navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
}

.app-layout {
  display: flex;
  min-height: 100vh;
}

.app-main {
  flex: 1;
  padding: 24px;
  min-width: 0;
  margin-left: 260px;
  position: relative;
  z-index: 1;
}

/* signin/signup, 메인 대시보드, 서베이 페이지에서는 꽉 차게 */
.app-main--full {
  margin-left: 0;
  padding: 40px 24px 24px 24px; /* 상단 40px, 좌우하단 24px */
}

/* 대시보드는 패딩 없이 */
.app-main--full:has([class*='dashboard']) {
  padding: 0;
}
</style>
