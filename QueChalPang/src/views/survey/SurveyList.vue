<script setup>
//survey이 active 한 건만 목록조회
import { useSurveyStore } from '@/stores/survey'
import { useCounterStore } from '@/stores/member'
import { useRouter } from 'vue-router'
import { computed, onMounted } from 'vue'

const store = useSurveyStore()
const member = useCounterStore()
const router = useRouter()

const surveyList = computed(() => store.survey)

onMounted(async () => {
  if (member.isLogIn.info.member_authority != 'a4') {
    alert('시스템 관리자만 접근할 수 있습니다.')
    router.push({ name: 'Dashboard' })
    return
  }
  store.fetchSurvey()
})

function surveyInfo(no) {
  router.push({ name: 'surveyInfo', params: { no: no } })
}

const surveyUpdate = (no) => {
  router.push({ name: 'surveyUpdate', params: { no: no } })
}

const goTosurveyAdd = () => {
  router.push({ name: 'surveyAdd' })
}
</script>

<template>
  <div class="container-fluid compact-container">
    <div class="row justify-content-center">
      <div class="col-12 col-xl-11">
        <div class="card compact-card">
          <!-- 헤더 -->
          <div class="card-header d-flex justify-content-between align-items-center pb-2">
            <h6 class="mb-0 compact-title">지원서 목록</h6>
          </div>

          <!-- 테이블 -->
          <div class="card-body px-0 pt-2 pb-2">
            <div class="table-responsive p-0">
              <table class="table align-items-center mb-0 compact-table">
                <thead>
                  <tr>
                    <th
                      class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-3"
                      style="width: 12%"
                    >
                      번호
                    </th>
                    <th
                      class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                      style="width: 45%"
                    >
                      제목
                    </th>
                    <th
                      class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                      style="width: 18%"
                    >
                      버전
                    </th>
                    <th
                      class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                      style="width: 25%"
                    >
                      관리
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="survey in surveyList" :key="survey.survey_no">
                    <td class="ps-3">
                      <p class="text-sm font-weight-bold mb-0">{{ survey.survey_no }}</p>
                    </td>
                    <td>
                      <p class="text-sm mb-0">{{ survey.survey_title }}</p>
                    </td>
                    <td>
                      <p class="text-sm mb-0">{{ survey.survey_version }}</p>
                    </td>
                    <td class="text-center">
                      <button
                        class="btn btn-sm btn-info me-2 compact-action-btn"
                        @click="surveyInfo(survey.survey_no)"
                      >
                        상세보기
                      </button>
                      <button
                        class="btn btn-sm btn-secondary compact-action-btn"
                        @click="surveyUpdate(survey.survey_no)"
                      >
                        수정하기
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- 데이터 없을 때 -->
              <div v-if="!surveyList || surveyList.length === 0" class="text-center py-4">
                <p class="text-muted mb-2 compact-text">등록된 조사지가 없습니다.</p>
                <button class="btn btn-sm btn-primary compact-btn" @click="goTosurveyAdd">
                  <i class="fas fa-plus"></i> 항목추가
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 라운드 제거 - 모든 요소 각지게 */
* {
  border-radius: 0 !important;
}

/* 컨테이너 축소 */
.compact-container {
  padding: 0.3rem 1rem !important;
}

/* 카드 스타일 */
.compact-card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  border: 1px solid #dee2e6;
}

.compact-card .card-header {
  padding: 0.4rem 0.8rem !important;
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.compact-card .card-body {
  padding: 0.5rem !important;
}

/* 제목 크기 */
.compact-title {
  font-size: 0.9rem !important;
  font-weight: 600;
  color: #333;
}

/* 버튼 크기 및 색상 */
.compact-btn {
  padding: 0.25rem 0.5rem !important;
  font-size: 0.75rem !important;
  background-color: #5b9bd5;
  border-color: #5b9bd5;
  color: white;
}

.compact-action-btn {
  padding: 0.25rem 0.5rem !important;
  font-size: 0.7rem !important;
  white-space: nowrap;
  font-weight: 500;
}

.btn-info {
  background-color: #5b9bd5 !important;
  border-color: #5b9bd5 !important;
  color: white !important;
}

.btn-secondary {
  background-color: #e0e0e0 !important;
  border-color: #d0d0d0 !important;
  color: #333 !important;
}

/* 파란 버튼은 계속 파란색 유지 */
.btn-info:hover,
.btn-info:focus,
.btn-info:active {
  background-color: #5b9bd5 !important;
  border-color: #5b9bd5 !important;
  color: white !important;
  box-shadow: none !important;
  outline: none !important;
}

/* 회색 버튼은 계속 회색 유지 */
.btn-secondary:hover,
.btn-secondary:focus,
.btn-secondary:active {
  background-color: #e0e0e0 !important;
  border-color: #d0d0d0 !important;
  color: #333 !important;
  box-shadow: none !important;
  outline: none !important;
}

/* 기본 버튼도 색 고정 */
.compact-btn:hover,
.compact-btn:focus,
.compact-btn:active {
  background-color: #5b9bd5 !important;
  border-color: #5b9bd5 !important;
  color: white !important;
  box-shadow: none !important;
  outline: none !important;
}

/* 테이블 스타일 */
.compact-table {
  font-size: 0.8rem !important;
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
}

.compact-table thead th {
  padding: 0.4rem 0.6rem !important;
  font-size: 0.65rem !important;
  background-color: #f5f5f5;
  border: 1px solid #dee2e6;
  font-weight: 600;
  color: #555;
}

.compact-table tbody td {
  padding: 0.5rem 0.6rem !important;
  border: 1px solid #dee2e6;
}

.compact-table tbody tr {
  background-color: white;
}

/* 호버 효과 완전 제거 */
.compact-table tbody tr:hover {
  background-color: white !important;
}

.compact-table tbody td p {
  font-size: 0.75rem !important;
  margin-bottom: 0 !important;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #333;
}

/* 빈 데이터 메시지 */
.compact-text {
  font-size: 0.85rem !important;
}

/* 여백 축소 */
.py-4 {
  padding-top: 1rem !important;
  padding-bottom: 1rem !important;
}

.mb-2 {
  margin-bottom: 0.3rem !important;
}

.me-2 {
  margin-right: 0.3rem !important;
}
</style>
