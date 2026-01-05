<template>
  <div
    class="row"
    v-if="
      application.dependantInfo.manager_id == counter.isLogIn.info.member_id ||
      application.dependantInfo.application_rejector == counter.isLogIn.info.member_id
    "
  >
    <div class="col">
      <p>지원자 정보</p>
      <div class="card mb-3">
        <div class="card-body row row-cols-3">
          <div class="fs-5 col" :value="dependantInfo.dependant_name">
            <span class="fs-5">지원자: </span>
            <span class="fw-bold fs-5">{{ dependantInfo.dependant_name }}</span>
          </div>
          <div class="fs-5 col" :value="dependantInfo.dependant_name">
            <span class="fs-5">보호자: </span>
            <span class="fw-bold fs-5">{{ dependantInfo.member_name }}</span>
          </div>
          <div class="fs-5 col" :value="application.dependantInfo.status">
            <span class="fs-5">대기단계: </span>
            <span class="fw-bold fs-5">{{ application.dependantInfo.status }}</span>
          </div>
          <div class="fs-5 col" :value="dependantInfo.despendant_gender">
            <span class="fs-5">성별: </span>
            <span class="fw-bold fs-5">{{ dependantInfo.despendant_gender }}</span>
          </div>
          <div class="fs-5 col" :value="dependantInfo.dependant_birth">
            <span class="fs-5">생일: </span>
            <span class="fw-bold fs-5">{{ dependantInfo.dependant_birth }}</span>
          </div>
          <div class="fs-5 col" :value="dependantInfo.disability_name">
            <span class="fs-5">장애유형: </span>
            <span class="fw-bold fs-5">{{ dependantInfo.disability_name }}</span>
          </div>
        </div>
      </div>
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <RouterLink
            v-bind:to="{
              name: 'applicationWait',
              params: { id: route.params.id },
            }"
            class="nav-link"
            >지원신청서</RouterLink
          >
        </li>
        <li class="nav-item">
          <RouterLink
            v-bind:to="{ name: 'applicationPlanning', params: { id: route.params.id } }"
            class="nav-link"
            >지원계획서
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink
            v-bind:to="{ name: 'applicationResult', params: { id: route.params.id } }"
            class="nav-link"
            >지원결과서</RouterLink
          >
        </li>
        <li class="nav-item">
          <a class="nav-link">상담내역</a>
        </li>
      </ul>
      <div class="card h-100" style="width: 100%">
        <div class="card-body h-100 w-100">
          <router-view name="right" />
        </div>
      </div>
    </div>
    <div class="col d-flex justify-content-center align-items-center h-100">
      <div class="card h-100 w-100">
        <div class="card-body">
          <router-view v-slot="{ Component }">
            <component :is="Component" :dependantInfo="dependantInfo"> </component>
          </router-view>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useApplicationStore } from '@/stores/application'
import { useCounterStore } from '@/stores/member'
import { onBeforeMount, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import axios from 'axios'

const application = useApplicationStore()
const counter = useCounterStore()
const store = useStore()

const route = useRoute()

let dependantInfo = ref({}) // 지원자 실명

onBeforeMount(async () => {
  store.state.showSidenav = false

  await application.countRealReview(route.params.id)
  await application.countRealResult(route.params.id)

  // 지원자 정보(신청서)
  await application.checkdependantInfo(route.params.id)
  console.log('checkdependantInfo: ', application.dependantInfo)
  await application.searchdependantInfo(application.dependantInfo.dependant_no)

  // 지원자 정보(실명)
  await axios //
    .get('/api/dependantInfo/' + application.dependantInfo.dependant_no)
    .then((res) => {
      if (res.data[0].despendant_gender == 'g1') {
        res.data[0].despendant_gender = '남'
      } else {
        res.data[0].despendant_gender = '여'
      }
      res.data[0].dependant_birth = `${new Date(res.data[0].dependant_birth).getFullYear()}-${new Date(res.data[0].dependant_birth).getMonth() + 1}-${new Date(res.data[0].dependant_birth).getDate()}`
      dependantInfo.value = res.data[0]
      console.log('dependant: ', dependantInfo.value)
    })
})
</script>
<style scoped></style>
