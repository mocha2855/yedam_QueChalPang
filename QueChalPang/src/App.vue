<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useCounterStore } from '@/stores/member'
import Sidenav from './examples/Sidenav'
import Navbar from '@/examples/Navbars/Navbar.vue'
import AppFooter from '@/examples/Footer.vue'
import { storeToRefs } from 'pinia'

const counterStore = useCounterStore()
const store = useStore()
const { isLogIn } = storeToRefs(counterStore)
const isNavFixed = computed(() => store.state.isNavFixed)
const darkMode = computed(() => store.state.darkMode)
const isAbsolute = computed(() => store.state.isAbsolute)
const showSidenav = computed(() => store.state.showSidenav)
const layout = computed(() => store.state.layout)
const showNavbar = computed(() => store.state.showNavbar)
const showFooter = computed(() => store.state.showFooter)
const showConfig = computed(() => store.state.showConfig)
const hideConfigButton = computed(() => store.state.hideConfigButton)

const navClasses = computed(() => {
  return {
    'position-sticky bg-white left-auto top-2 z-index-sticky': isNavFixed.value && !darkMode.value,
    'position-sticky bg-default left-auto top-2 z-index-sticky': isNavFixed.value && darkMode.value,
    'position-absolute px-4 mx-0 w-100 z-index-2': isAbsolute.value,
    'px-0 mx-4': !isAbsolute.value,
  }
})
console.log(isLogIn)
</script>
<template>
  <div
    v-show="layout === 'landing'"
    class="landing-bg h-100 bg-gradient-primary position-fixed w-100"
  ></div>

  <sidenav v-if="showSidenav" />

  <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
    <!-- nav -->

    <navbar :class="[navClasses]" v-if="showNavbar" />

    <div class="py-4 container-fluid" style="min-height: 85vh">
      <router-view />
    </div>

    <app-footer v-show="showFooter" />

    <configurator
      :toggle="toggleConfigurator"
      :class="[showConfig ? 'show' : '', hideConfigButton ? 'd-none' : '']"
    />
  </main>
</template>
