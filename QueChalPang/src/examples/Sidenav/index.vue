<!-- Sidenav/index.vue -->
<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import SidenavList from './SidenavList.vue'
import logo from '@/assets/img/logo-ct-dark.png'
import logoWhite from '@/assets/img/logo-ct.png'

const store = useStore()
const layout = computed(() => store.state.layout)
const sidebarType = computed(() => store.state.sidebarType)
const darkMode = computed(() => store.state.darkMode)
</script>
<template>
  <div
    v-show="layout === 'default'"
    class="min-height-300 position-absolute w-100"
    :class="`${darkMode ? 'bg-transparent' : 'bg-transparent'}`"
  />

  <aside class="sidenav navbar navbar-vertical navbar-expand-xs border-radius-xl" id="sidenav-main">
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

    <sidenav-list />
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
