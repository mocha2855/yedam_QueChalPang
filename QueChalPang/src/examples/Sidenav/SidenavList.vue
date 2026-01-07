<!-- Sidenav/SidenavList.vue -->
<script setup>
import { useRoute } from 'vue-router'

import SidenavItem from './SidenavItem.vue'
import ArgonButton from '@/components/ArgonButton.vue'
import { reactive } from 'vue'
const getRoute = () => {
  const route = useRoute()
  const routeArr = route.path.split('/')
  return routeArr[1]
}

const badges = reactive({
  wait: true,
  review: true,
  planning: true,
  emphasis: true,
  urgency: true,
})
</script>

<template>
  <div class="w-auto h-auto h-100" id="sidenav-collapse-main">
    <ul class="navbar-nav">
      <li class="mt-3 nav-item">
        <h6 class="text-xs ps-4 text-uppercase font-weight-bolder opacity-6 ms-2">계정 관리</h6>
      </li>

      <li class="nav-item">
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
      </li>
    </ul>
  </div>
  <div class="card ms-3 pe-4">
    <div class="card-header pb-0">
      <h6>검색</h6>
    </div>

    <div class="card-bodyp-2">
      <div class="position-relative">
        <!-- <div class="position-absolute bottom-0 end-8">
                <ArgonButton color="danger" class="p-1 mr-1">선택 삭제</ArgonButton>
              </div> -->
        <div class="position-absolute bottom-0 end-2"></div>
      </div>
      <div class="p-2">
        <ul style="list-style: none">
          <li class="d-flex justify-content-around">
            <span
              style="cursor: pointer"
              class="badge badge-sm"
              :class="{ 'bg-primary': badges.wait, 'bg-secondary': !badges.wait }"
              @click="badges.wait ? (badges.wait = false) : (badges.wait = true)"
            >
              대기
            </span>
            <span
              style="cursor: pointer"
              class="badge badge-sm"
              :class="{ 'bg-primary': badges.review, 'bg-secondary': !badges.review }"
              @click="badges.review ? (badges.review = false) : (badges.review = true)"
            >
              검토중
            </span>
            <span
              style="cursor: pointer"
              class="badge badge-sm"
              :class="{ 'bg-primary': badges.planning, 'bg-secondary': !badges.planning }"
              @click="badges.planning ? (badges.planning = false) : (badges.planning = true)"
            >
              계획
            </span>
          </li>
          <li class="d-flex justify-content-around mt-1">
            <span
              style="cursor: pointer"
              class="badge badge-sm"
              :class="{ 'bg-primary': badges.emphasis, 'bg-secondary': !badges.emphasis }"
              @click="badges.emphasis ? (badges.emphasis = false) : (badges.emphasis = true)"
            >
              중점
            </span>
            <span
              style="cursor: pointer"
              class="badge badge-sm"
              :class="{ 'bg-primary': badges.urgency, 'bg-secondary': !badges.urgency }"
              @click="badges.urgency ? (badges.urgency = false) : (badges.urgency = true)"
            >
              긴급
            </span>
          </li>
          <li>
            <span>
              <label for="option">검색조건</label>
              <select class="text-center input-group mb-3" name="option" id="option">
                <option value="dependant_name">지원자명</option>
                <option value="application_no">신청서 번호</option>
                <option value="manager_main">담당자</option>
              </select>
            </span>
          </li>
          <li>
            <span>
              <input
                class="form-control"
                style="display: flex"
                type="text"
                name="value"
                id="value"
                maxlength="30"
                placeholder="검색"
              />
            </span>
          </li>
          <li class="d-flex justify-content-end mt-2">
            <argon-button class="pb-1 pt-1 ps-2 pe-2">검색</argon-button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
