<!-- views/Application.vue -->
<template>
  <div
    class="row page"
    v-if="
      application.dependantInfo?.manager_id == counter.isLogIn.info.member_id ||
      application.dependantInfo?.application_rejector == counter.isLogIn.info.member_id
    "
  >
    <!-- LEFT -->
    <div class="col content-wrapper">
      <div class="topbar">
        <RouterLink :to="{ name: 'TablesManager' }" class="back-link">
          ← 목록으로 돌아가기
        </RouterLink>
      </div>

      <p class="section-title mt-2">지원자 정보</p>

      <!-- 지원자 정보: 카드 1개만 깔끔하게 -->
      <div class="panel info-panel mb-3">
        <div class="row g-3">
          <div class="col-md-4 info-item">
            <span class="label">지원자</span>
            <span class="value">{{ dependantInfo.dependant_name }}</span>
          </div>

          <div class="col-md-4 info-item">
            <span class="label">보호자</span>
            <span class="value">{{ dependantInfo.member_name }}</span>
          </div>

          <div class="col-md-4 info-item">
            <span class="label">대기단계</span>
            <span class="value">{{ returnStatus(application.dependantInfo.status) }}</span>
          </div>

          <div class="col-md-4 info-item">
            <span class="label">성별</span>
            <span class="value">{{ dependantInfo?.despendant_gender ?? '' }}</span>
          </div>

          <div class="col-md-4 info-item">
            <span class="label">생일</span>
            <span class="value">{{ dependantInfo.dependant_birth }}</span>
          </div>

          <div class="col-md-4 info-item">
            <span class="label">장애유형</span>
            <span class="value">{{ dependantInfo.disability_name }}</span>
          </div>
        </div>
      </div>

      <!-- 탭 -->
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

      <!-- LEFT CONTENT: 기존 card 제거 → panel -->
      <div class="panel content-panel">
        <router-view name="right" />
      </div>
    </div>

    <!-- RIGHT -->
    <div class="col right-col">
      <div class="panel right-panel">
        <router-view v-slot="{ Component }">
          <component :is="Component" :dependantInfo="dependantInfo" />
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useApplicationStore } from '@/stores/application'
import { useCounterStore } from '@/stores/member'
import { onBeforeMount, onBeforeUnmount, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import axios from 'axios'

const application = useApplicationStore()
const counter = useCounterStore()
const store = useStore()
const route = useRoute()

const selectedAppNo = ref(null)
const applicationOptions = ref([])
const body = document.getElementsByTagName('body')[0]
let dependantInfo = ref({}) // 지원자 실명

const returnStatus = (stat) => {
  if (stat == 'e1') return '대기'
  if (stat == 'e2') return '검토중'
  if (stat == 'e3') return '계획'
  if (stat == 'e4') return '중점'
  if (stat == 'e5') return '긴급'
  return stat ?? ''
}

onBeforeMount(async () => {
  store.state.showSidenav = false

  await application.countRealReview(route.params.id)
  await application.countRealResult(route.params.id)

  // 지원자 정보(신청서)
  await application.checkdependantInfo(route.params.id)
  await application.searchdependantInfo(application.dependantInfo.dependant_no)

  // 지원자 정보(실명)
  const depNo = application.dependantInfo?.dependant_no
  if (depNo) {
    const res = await axios.get('/api/dependantInfo/' + depNo)
    const row = Array.isArray(res.data) ? res.data[0] : res.data

    if (!row) {
      dependantInfo.value = {}
    } else {
      const gender = row.despendant_gender === 'g1' ? '남' : '여'
      const b = row.dependant_birth ? new Date(row.dependant_birth) : null
      const birthText = b ? `${b.getFullYear()}-${b.getMonth() + 1}-${b.getDate()}` : ''

      dependantInfo.value = {
        ...row,
        despendant_gender: gender,
        dependant_birth: birthText,
      }
    }
  } else {
    dependantInfo.value = {}
  }
})
onBeforeUnmount(() => {
  store.state.hideConfigButton = false
  store.state.showConfig = false
  store.state.showNavbar = true
  store.state.showSidenav = true
  store.state.showFooter = true
  body.classList.add('bg-gray-100')
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
.page {
  background: #f6f7fb;
}

/* 좌측 여백 */
.content-wrapper {
  padding: 2rem 4rem;
}

/* 오른쪽 컬럼: 위쪽 기준 맞추기 + sticky */
.right-col {
  padding: 2rem 4rem 2rem 0;
  display: flex;
}

.panel {
  width: 100%;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 18px;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
  padding: 1.25rem 1.25rem;
}

.info-panel {
  padding: 1.1rem 1.25rem;
}

/* 왼쪽 하단 컨텐츠 패널 */
.content-panel {
  min-height: 520px;
}

/* 오른쪽 패널: 스티키로 “툴 패널” 느낌 */
.right-panel {
  position: sticky;
  top: 110px; /* 상단 네비 높이에 맞춰 조절 */
  align-self: flex-start;
  padding: 1.25rem;
}

/* 상단 */
.section-title {
  font-size: 0.95rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #344767;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.back-link {
  font-size: 1rem;
  font-weight: 700;
  color: #ffa229;
  text-decoration: none;
}

.back-link:hover {
  color: #ff863b;
  text-decoration: underline;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  font-size: 0.75rem;
  color: #6c757d;
}

.value {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1f2937;
}

.custom-tabs {
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.custom-tabs .nav-link {
  font-size: 0.85rem;
  padding: 0.5rem 0.85rem;
  color: #495057;
  border: none;
}

.custom-tabs .nav-link.active {
  font-weight: 700;
  color: #344767;
  border: none;
  border-bottom: 2px solid #5e72e4;
}

/* 반응형: 작은 화면에서는 오른쪽 아래로 내려오게 */
@media (max-width: 991px) {
  .content-wrapper {
    padding: 1.25rem;
  }

  .right-col {
    padding: 0 1.25rem 1.25rem 1.25rem;
  }

  .right-panel {
    position: static;
    top: auto;
  }
}
</style>
