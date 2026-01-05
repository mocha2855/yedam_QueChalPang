<!-- src/examples/Sidenav/ApprovalSidenavList.vue -->
<script setup>
import { useApprovalStore } from '@/stores/approval'
import { storeToRefs } from 'pinia'
import SidenavItem from './SidenavItem.vue'
import { useCounterStore } from '@/stores/member'

const counter = useCounterStore()

const store = useApprovalStore()
const { userPendingList, managerPendingList } = storeToRefs(store)
</script>

<template>
  <div class="w-auto h-auto h-100" id="sidenav-collapse-main">
    <ul class="navbar-nav">
      <li class="mt-3 nav-item">
        <h5 class="ps-4 text-uppercase ms-2">마이페이지</h5>
      </li>

      <li class="nav-item">
        <sidenav-item
          :to="{ name: 'myPage', params: { id: counter.isLogIn.info.member_id } }"
          navText="내 정보 보기"
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
        <sidenav-item to="/ApprovalManagerList" navText="지원자 등록">
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
    </ul>
  </div>
</template>
