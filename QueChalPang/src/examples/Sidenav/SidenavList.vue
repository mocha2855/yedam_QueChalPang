<!-- Sidenav/SidenavList.vue -->
<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
// import SidenavItem from './SidenavItem.vue'
import SearchAppSideNavCard from '../Cards/SearchAppSideNavCard.vue'
import SearchCenterSideNavCardCopy from '../Cards/SearchCenterSideNavCard.vue'
const getRoute = () => {
  const route = useRoute()
  const routeArr = route.path.split('/')
  return routeArr[1]
}

// 사이드바를 숨길 경로 목록
const hiddenRoutes = ['dashboard-default']

const shouldShowSidenav = computed(() => {
  return !hiddenRoutes.includes(getRoute())
})
</script>

<template>
  <div v-if="shouldShowSidenav" class="w-auto h-auto h-100" id="sidenav-collapse-main">
    <ul class="navbar-nav">
      <SearchAppSideNavCard v-if="getRoute().includes('tables')"></SearchAppSideNavCard>
      <SearchCenterSideNavCardCopy v-if="getRoute() === 'centerList'"></SearchCenterSideNavCardCopy>
    </ul>
  </div>
</template>
