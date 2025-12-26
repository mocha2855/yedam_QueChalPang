<!-- Configurator.vue -->
<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { activateDarkMode, deactivateDarkMode } from '@/assets/js/dark-mode'

const store = useStore()
// state
// const isNavFixed = computed(() => store.state.isNavFixed)
// const sidebarType = computed(() => store.state.sidebarType)
const toggleConfigurator = () => store.commit('toggleConfigurator')

// mutations
// const navbarFixed = () => store.commit('navbarFixed')
const setSidebarType = (type) => store.commit('sidebarType', type)

//추가
const showConfig = computed(() => store.state.showConfig)
const hideConfigButton = computed(() => store.state.hideConfigButton)

// const sidebarColor = (color = 'success') => {
//   document.querySelector('#sidenav-main').setAttribute('data-color', color)
// }

const darkMode = () => {
  if (store.state.darkMode) {
    store.state.darkMode = false
    setSidebarType('bg-white')
    deactivateDarkMode()
    return
  } else {
    store.state.darkMode = true
    setSidebarType('bg-default')
    activateDarkMode()
  }
}
</script>

<template>
  <div class="fixed-plugin" :class="{ show: showConfig }">
    <!-- 톱니 버튼 -->
    <a
      v-show="!hideConfigButton"
      class="px-3 py-2 fixed-plugin-button text-dark position-fixed"
      @click="toggleConfigurator"
    >
      <i class="py-2 fa fa-cog"></i>
    </a>

    <!-- 설정 카드 -->
    <div class="shadow-lg card fixed-plugin-card">
      <!-- 헤더 -->
      <div class="pt-3 pb-0 bg-transparent card-header">
        <div class="float-start">
          <h5 class="mt-3 mb-0">다크모드 설정</h5>
        </div>

        <div class="mt-4 float-end">
          <button
            type="button"
            class="btn btn-link text-dark p-0 fixed-plugin-close"
            aria-label="Close configurator"
            @click="toggleConfigurator"
          >
            <i class="fa fa-times"></i>
          </button>
        </div>
      </div>

      <!-- <hr class="my-1 horizontal dark" /> -->

      <div class="pt-0 card-body pt-sm-3">
        <!-- Sidebar Colors -->
        <!-- <h6 class="mb-0">Sidebar Colors</h6> -->

        <!-- <a href="#" class="switch-trigger background-color">
          <div class="my-2 badge-colors text-start">
            <span
              class="badge filter bg-gradient-primary active"
              @click="sidebarColor('primary')"
            ></span>
            <span class="badge filter bg-gradient-dark" @click="sidebarColor('dark')"></span>
            <span class="badge filter bg-gradient-info" @click="sidebarColor('info')"></span>
            <span class="badge filter bg-gradient-success" @click="sidebarColor('success')"></span>
            <span class="badge filter bg-gradient-warning" @click="sidebarColor('warning')"></span>
            <span class="badge filter bg-gradient-danger" @click="sidebarColor('danger')"></span>
          </div>
        </a> -->

        <!-- Sidenav Type -->
        <!-- <div class="mt-3">
          <h6 class="mb-0">Sidenav Type</h6>
          <p class="text-sm">Choose between 2 different sidenav types.</p>
        </div> -->

        <!-- <div class="d-flex gap-2">
          <button
            class="btn w-100 px-3 mb-2"
            :class="sidebarType === 'bg-white' ? 'bg-gradient-success' : 'btn-outline-success'"
            @click="setSidebarType('bg-white')"
          >
            White
          </button>

          <button
            class="btn w-100 px-3 mb-2"
            :class="sidebarType === 'bg-default' ? 'bg-gradient-success' : 'btn-outline-success'"
            @click="setSidebarType('bg-default')"
          >
            Dark
          </button>
        </div>

        <div class="mt-3 d-flex">
          <h6 class="mb-0">Navbar Fixed</h6>
          <div class="form-check form-switch ps-0 ms-auto my-auto">
            <input
              class="mt-1 form-check-input"
              type="checkbox"
              :checked="isNavFixed"
              @click="navbarFixed"
            />
          </div>
        </div> -->

        <hr class="horizontal dark my-4" />

        <div class="mt-2 mb-5 d-flex">
          <h6 class="mb-0">Light / Dark</h6>
          <div class="form-check form-switch ps-0 ms-auto my-auto">
            <input
              class="form-check-input mt-1 ms-auto"
              type="checkbox"
              :checked="store.state.darkMode"
              @click="darkMode"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.fixed-plugin {
  position: fixed !important;
  top: 80px !important;
  right: 20px !important;
  z-index: 3000;
}

/* 🔴 기본 상태: 숨김 (화면 밖) */
.fixed-plugin-card {
  position: fixed;
  top: 80px;
  right: 20px;
  width: 360px;

  transform: translateX(380px);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;

  transition:
    transform 0.25s ease,
    opacity 0.25s ease;
}
/* ✅ showConfig === true */
.fixed-plugin.show .fixed-plugin-card {
  transform: translateX(0);
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}
.fixed-plugin-close {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 18px;
  opacity: 0.7;
}

.fixed-plugin-close:hover {
  opacity: 1;
}
</style>
