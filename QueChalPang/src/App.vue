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

// 메인 대시보드도 풀화면
const isFullWidthPage = computed(() => {
  return isAuthPage.value || route.path === '/dashboard-default'
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
  /* background-color: rgb(255, 255, 255); */
  margin-left: 260px;
  position: relative;
  z-index: 1;
}

/* signin/signup 그리고 메인 대시보드에서는 꽉 차게 */
.app-main--full {
  margin-left: 0;
  padding: 0;
}
</style>
