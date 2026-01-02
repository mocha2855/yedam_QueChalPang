<template>
  <div class="row">
    <div class="col">
      <p>지원자 정보</p>
      <div class="card">
        <div class="card-body"></div>
      </div>
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <RouterLink
            v-bind:to="{ name: 'applicationWait', params: { id: route.params.id } }"
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
          <a class="nav-link disabled" aria-disabled="true">상담내역</a>
        </li>
      </ul>
      <div class="card">
        <div class="card-body">
          <router-view name="right" />
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card">
        <div class="card-body">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useApplicationStore } from '@/stores/application'
const application = useApplicationStore()
import { watch, onBeforeMount } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const route = useRoute()
import { useRoute } from 'vue-router'

onBeforeMount(async () => {
  store.state.showSidenav = false

  // 지원자 정보
  await application.checkdependantInfo(route.params.id)
  console.log('checkdependantInfo: ', application.dependantInfo)

  await application.countRealReview(route.params.id)
})

// if (BeforeRouteLeave) {
//   alert('얍')
// }

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
