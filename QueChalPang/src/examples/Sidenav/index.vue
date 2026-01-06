<!-- Sidenav/index.vue -->
<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import SidenavList from './SidenavList.vue'
import ApprovalSidenavList from './AprrovalSidenav' //승인관리 사이드바 추가
import MypageSidenav from './MypageSidenav.vue'
import logo from '@/assets/img/logo-ct-dark.png'
import logoWhite from '@/assets/img/logo-ct.png'

import { useRoute } from 'vue-router'

const route = useRoute()
const store = useStore()
const layout = computed(() => store.state.layout)
const sidebarType = computed(() => store.state.sidebarType)
const darkMode = computed(() => store.state.darkMode)
const isApprovalPage = computed(() => {
  return route.path.includes('Approval')
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

  <aside class="sidenav navbar navbar-vertical navbar-expand-xs border-radius-xl" id="sidenav-main">
    <div class="sidenav-header" v-if="!isMyPage">
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
    <MypageSidenav v-if="isMyPage" />
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
