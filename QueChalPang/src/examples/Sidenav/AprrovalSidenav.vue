<!-- src/examples/Sidenav/ApprovalSidenavList.vue -->
<script setup>
import { useRoute } from 'vue-router'
import { useApprovalStore } from '@/stores/approval'
import { storeToRefs } from 'pinia'
import SidenavItem from './SidenavItem.vue'

const store = useApprovalStore()
const { userPendingList, managerPendingList } = storeToRefs(store)

const getRoute = () => {
  const route = useRoute()
  const routeArr = route.path.split('/')
  return routeArr[routeArr.length - 1]
}
</script>

<template>
  <div class="w-auto h-auto h-100" id="sidenav-collapse-main">
    <ul class="navbar-nav">
      <li class="mt-3 nav-item">
        <h6 class="text-xs ps-4 text-uppercase font-weight-bolder opacity-6 ms-2">
          회원 승인 관리
        </h6>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/ApprovalUserList"
          :class="getRoute() === 'ApprovalUserList' ? 'active' : ''"
          navText="일반회원"
        >
          <template v-slot:icon>
            <i class="ni ni-single-02 text-primary text-sm opacity-10"></i>
          </template>
          <template v-slot:badge v-if="userPendingList?.length > 0">
            <span class="badge bg-warning text-dark ms-auto">
              {{ userPendingList.length }}
            </span>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/ApprovalManagerList"
          :class="getRoute() === 'ApprovalManagerList' ? 'active' : ''"
          navText="담당자"
        >
          <template v-slot:icon>
            <i class="ni ni-badge text-success text-sm opacity-10"></i>
          </template>
          <template v-slot:badge v-if="managerPendingList?.length > 0">
            <span class="badge bg-warning text-dark ms-auto">
              {{ managerPendingList.length }}
            </span>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/ApprovalAdminList"
          :class="getRoute() === 'ApprovalAdminList' ? 'active' : ''"
          navText="관리자"
        >
          <template v-slot:icon>
            <i class="ni ni-single-02 text-primary text-sm opacity-10"></i>
          </template>
          <template v-slot:badge v-if="adminPendingList?.length > 0">
            <span class="badge bg-warning text-dark ms-auto">
              {{ adminPendingList.length }}
            </span>
          </template>
        </sidenav-item>
      </li>
    </ul>
  </div>
</template>
