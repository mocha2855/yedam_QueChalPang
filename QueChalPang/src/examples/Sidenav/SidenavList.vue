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
const hiddenRoutes = ['dashboard-default'] // 메인 대시보드 경로 추가

const shouldShowSidenav = computed(() => {
  return !hiddenRoutes.includes(getRoute())
})
</script>

<template>
  <div v-if="shouldShowSidenav" class="w-auto h-auto h-100" id="sidenav-collapse-main">
    <ul class="navbar-nav">
      <!-- <li class="nav-item">
        <sidenav-item
          to="/signin"
          :class="getRoute() === 'signin' ? 'active' : ''"
          navText="로그인"
        >
          <template v-slot:icon>
            <i class="ni ni-single-copy-04 text-danger text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/signup"
          :class="getRoute() === 'signup' ? 'active' : ''"
          navText="회원가입"
        >
          <template v-slot:icon>
            <i class="ni ni-collection text-info text-sm opacity-10"></i>
          </template>
        </sidenav-item> 
      </li>-->
      <SearchAppSideNavCard v-if="getRoute().includes('tables')"></SearchAppSideNavCard>
      <SearchCenterSideNavCardCopy v-if="getRoute() === 'centerList'"></SearchCenterSideNavCardCopy>
    </ul>
  </div>
</template>
