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
      <div class="card">
        <div class="card-body row row-cols-3">
          <div class="fs-5 col" :value="dependantInfo.dependant_name">
            지원자: {{ dependantInfo.dependant_name }}
          </div>
          <div class="fs-5 col" :value="dependantInfo.dependant_name">
            보호자: {{ dependantInfo.member_name }}
          </div>
          <div class="fs-5 col" :value="application.dependantInfo.status">
            대기단계: {{ application.dependantInfo.status }}
          </div>
          <div class="fs-5 col" :value="dependantInfo.despendant_gender">
            성별: {{ dependantInfo.despendant_gender }}
          </div>
          <div class="fs-5 col" :value="dependantInfo.dependant_birth">
            생일: {{ dependantInfo.dependant_birth }}
          </div>
          <div class="fs-5 col" :value="dependantInfo.disability_name">
            장애유형: {{ dependantInfo.disability_name }}
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
          <a class="nav-link" href="#">지원결과서</a>
        </li>
        <li class="nav-item">
          <a class="nav-link">상담내역</a>
        </li>
      </ul>
      <div class="card h-100">
        <div class="card-body">
          <router-view name="right" />
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card h-100">
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
import { watch, onBeforeMount, ref } from 'vue'
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

  // 지원자 정보(신청서)
  await application.checkdependantInfo(route.params.id)
  console.log('checkdependantInfo: ', application.dependantInfo)

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

// 검토중 즉각으로 가져오기
watch(
  () => application.planningState,
  async () => {
    await application.countRealReview(route.params.id)
  },
  { immediate: true },
)
</script>
<style scoped></style>
