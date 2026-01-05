<!-- views/Application.vue -->
<template>
  <div
    class="row"
    v-if="
      application.dependantInfo.manager_id == counter.isLogIn.info.member_id ||
      application.dependantInfo.application_rejector == counter.isLogIn.info.member_id
    "
  >
    <div class="col content-wrapper">
      <div class="topbar">
        <RouterLink :to="{ name: 'TablesManager' }" class="back-link">
          ← 목록으로 돌아가기
        </RouterLink>
      </div>

      <p class="section-title mt-2">지원자 정보</p>

      <div class="card info-card mb-3">
        <div class="card-body row g-3">
          <div class="col-md-4 info-item">
            <span class="label">지원자 </span>
            <span class="value">{{ dependantInfo.dependant_name }}</span>
          </div>

          <div class="col-md-4 info-item">
            <span class="label">보호자 </span>
            <span class="value">{{ dependantInfo.member_name }}</span>
          </div>

          <div class="col-md-4 info-item">
            <span class="label">대기단계 </span>
            <span class="value">{{ returnStatus(application.dependantInfo.status) }}</span>
          </div>

          <div class="col-md-4 info-item">
            <span class="label">성별 </span>
            <span class="value">{{ dependantInfo.despendant_gender }}</span>
          </div>

          <div class="col-md-4 info-item">
            <span class="label">생일 </span>
            <span class="value">{{ dependantInfo.dependant_birth }}</span>
          </div>

          <div class="col-md-4 info-item">
            <span class="label">장애유형 </span>
            <span class="value">{{ dependantInfo.disability_name }}</span>
          </div>
        </div>
      </div>

      <ul class="nav nav-tabs custom-tabs mb-3">
        <li class="nav-item">
          <RouterLink
            :to="{ name: 'applicationWait', params: { id: route.params.id } }"
            class="nav-link"
            active-class="active"
          >
            지원신청서
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink
            :to="{ name: 'applicationPlanning', params: { id: route.params.id } }"
            class="nav-link"
            active-class="active"
          >
            지원계획서
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink
            :to="{ name: 'applicationResult', params: { id: route.params.id } }"
            class="nav-link"
            active-class="active"
          >
            지원결과서
          </RouterLink>
        </li>
        <li class="nav-item">
          <span class="nav-link disabled">상담내역</span>
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
import { onBeforeMount, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import axios from 'axios'

const application = useApplicationStore()
const counter = useCounterStore()
const store = useStore()
const route = useRoute()

const selectedAppNo = ref(null)
const applicationOptions = ref([])

let dependantInfo = ref({}) // 지원자 실명

const returnStatus = (stat) => {
  if (stat == 'e1') {
    return '대기'
  } else if (stat == 'e2') {
    return '검토중'
  } else if (stat == 'e3') {
    return '계획'
  } else if (stat == 'e4') {
    return '중점'
  } else if (stat == 'e5') {
    return '긴급'
  }
}

onBeforeMount(async () => {
  store.state.showSidenav = false

  await application.countRealReview(route.params.id)
  await application.countRealResult(route.params.id)

  // 지원자 정보(신청서)
  await application.checkdependantInfo(route.params.id)

  await application.searchdependantInfo(application.dependantInfo.dependant_no)

  // 지원자 정보(실명)
  await axios.get('/api/dependantInfo/' + application.dependantInfo.dependant_no).then((res) => {
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

const fetchApplicationOptions = async (dependantNo) => {
  const res = await axios.get(`/api/applicationsBydependant/${dependantNo}`)

  const rows = Array.isArray(res.data) ? res.data : []
  applicationOptions.value = rows.map((x) => ({
    application_no: x.application_no,
    label: `${new Date(x.application_date).toLocaleDateString('ko-KR')} (#${x.application_no})`,
  }))
}

watch(
  () => route.params.id,
  async (newId) => {
    if (!newId) return
    await application.checkdependantInfo(newId)
    await fetchApplicationOptions(application.dependantInfo.dependant_no)
    selectedAppNo.value = Number(newId)
  },
)
</script>
<style scoped>
/* 위아래 , 좌우 여백*/
.content-wrapper {
  padding: 3rem 4rem;
}

.section-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #344767;
}

.info-card {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 0.75rem;
  color: #6c757d;
  margin-bottom: 2px;
}

.value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #212529;
}

/* 탭 스타일 */
.custom-tabs .nav-link {
  font-size: 0.85rem;
  padding: 0.4rem 0.75rem;
  color: #495057;
}

.custom-tabs .nav-link.active {
  font-weight: 600;
  color: #344767;
  border-bottom: 2px solid #5e72e4;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.back-link {
  font-size: 0.9rem;
  color: #344767;
  text-decoration: none;
}
.back-link:hover {
  text-decoration: underline;
}

.app-select {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.app-select-label {
  font-size: 0.85rem;
  color: #6c757d;
  white-space: nowrap;
}

.app-select-input {
  width: 240px;
}
</style>
