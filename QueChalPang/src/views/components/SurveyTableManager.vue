<!-- 담당자의 지원서관리 메인페이지. -->
<!-- views/components/SurveyTableManager.vue -->
<script setup>
import { onBeforeMount } from 'vue'
import { useCounterStore } from '@/stores/member'
import { useSearchStore } from '@/stores/search'
import router from '@/router'
import { storeToRefs } from 'pinia'

const search = useSearchStore()
const { applicationList } = storeToRefs(search)

const member = useCounterStore().isLogIn.info
search.member = member

onBeforeMount(() => {
  setTimeout(() => {
    search.getApplicationList(member)
  }, 10)
})

const returnStatus = (stat, statStatus) => {
  // i2(승인) 상태가 아니면 무조건 '대기'
  if (statStatus !== 'i2') return '대기'

  if (stat === 'e3') return '계획'
  if (stat === 'e4') return '중점'
  if (stat === 'e5') return '긴급'

  if (stat === 'e1') return '대기'
  if (stat === 'e2') return '검토중'

  return stat ?? ''
}

const statusBadgeClass = (stat, statStatus) => {
  const label = returnStatus(stat, statStatus)
  if (label === '계획') return 'is-plan'
  if (label === '중점') return 'is-focus'
  if (label === '긴급') return 'is-urgent'
  return 'is-wait'
}

const changeDateFormat = (input) => {
  const date = new Date(input)
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}

const addApp = () => {
  router.push({ name: 'AddApplication' })
}

const goToApplication = (appNo) => {
  router.push({ name: 'applicationWait', params: { id: appNo } })
}

const goToPlanning = (applicationNo) => {
  router.push({ name: 'applicationPlanning', params: { id: applicationNo } })
}

const goToResult = (applicationNo) => {
  router.push({ name: 'applicationResult', params: { id: applicationNo } })
}

const goToMeetingLog = (applicationNo) => {
  router.push({ name: 'meetingLog', params: { id: applicationNo } })
}
</script>

<template>
  <div class="card">
    <div class="card-header">
      <div class="d-flex justify-content-between align-items-center">
        <h6 class="mb-0">지원신청 현황</h6>

        <button class="btn btn-add mb-0" type="button" @click="addApp()">지원신청서 등록</button>
      </div>
    </div>

    <div class="card-body">
      <div class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th>번호</th>
              <th>지원자명</th>
              <th>보호자명</th>
              <th>지원신청서번호</th>
              <th>지원신청일</th>
              <th>지원신청서</th>
              <th>담당자</th>
              <th>대기단계</th>
              <th>계획/결과 진행 상황</th>
              <th>지원계획</th>
              <th>상담내역</th>
              <th>지원결과</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(row, index) in applicationList"
              :key="row.application_no ?? `d-${row.dependant_no}`"
            >
              <td>{{ index + 1 }}</td>

              <td>{{ row.dependant_name }}</td>
              <td>{{ row.guardian_name }}</td>

              <td>{{ row.application_no ?? 'N/A' }}</td>

              <td>
                {{ row.application_date ? changeDateFormat(row.application_date) : 'N/A' }}
              </td>

              <!-- 지원신청서 -->
              <td>
                <template v-if="row.application_no">
                  <button
                    class="btn btn-sm btn-main"
                    type="button"
                    @click="goToApplication(row.application_no)"
                  >
                    보기
                  </button>
                </template>
                <template v-else>
                  <span class="badge bg-secondary">없음</span>
                </template>
              </td>

              <!-- 담당자 -->
              <td>
                <span class="cell-text">{{ row.manager_name ?? '-' }}</span>
              </td>

              <!-- 대기단계(뱃지) -->
              <td>
                <span :class="['status-badge', statusBadgeClass(row.status, row.status_status)]">
                  {{ returnStatus(row.status, row.status_status) }}
                </span>
              </td>

              <!-- 진행상황 -->
              <td>
                <div class="counts">
                  <div>검토 {{ row.counts?.i1 ?? 0 }}</div>
                  <div>승인 {{ row.counts?.i2 ?? 0 }}</div>
                  <div>반려 {{ row.counts?.i3 ?? 0 }}</div>
                </div>
              </td>

              <!-- 지원계획 -->
              <td>
                <template v-if="row?.application_no && Number(row.planningCount ?? 0) > 0">
                  <button
                    class="btn btn-sm btn-main"
                    type="button"
                    @click="goToPlanning(row.application_no)"
                  >
                    보기
                  </button>
                </template>
                <template v-else>
                  <span class="badge bg-secondary">없음</span>
                </template>
              </td>

              <!-- 상담내역 -->
              <td>
                <template v-if="row?.application_no && Number(row.meetingCount ?? 0) > 0">
                  <button
                    class="btn btn-sm btn-main"
                    type="button"
                    @click="goToMeetingLog(row.application_no)"
                  >
                    보기
                  </button>
                </template>
                <template v-else>
                  <span class="badge bg-secondary">없음</span>
                </template>
              </td>

              <!-- 지원결과 -->
              <td>
                <template v-if="row?.application_no && Number(row.resultCount ?? 0) > 0">
                  <button
                    class="btn btn-sm btn-main"
                    type="button"
                    @click="goToResult(row.application_no)"
                  >
                    보기
                  </button>
                </template>
                <template v-else>
                  <span class="badge bg-secondary">없음</span>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* =========================
   Card (투명 + 라운드 제거)
========================= */
.card {
  background: transparent !important;
  border: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  overflow: visible !important;
}

.card-header {
  background: transparent !important;
  border-bottom: 1px solid #e5e7eb;
  padding: 14px 0;
}

.card-body {
  padding: 0 !important;
}

.card-header h6 {
  font-size: 1.05rem;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.2px;
}

/* =========================
   Table Wrapper
========================= */
.table-responsive {
  overflow-x: auto;
}

/* =========================
   Table (세로선 포함 그리드)
========================= */
.table {
  width: 100%;
  min-width: 1100px;
  table-layout: fixed;

  border-collapse: collapse !important;
  border-spacing: 0 !important;

  border: 1px solid #e5e7eb;
  background: #fff;
}

/* 모든 칸: 세로선/가로선 + 중앙정렬 */
.table thead th,
.table tbody td {
  border: 1px solid #e5e7eb !important;
  text-align: center !important;
  vertical-align: middle !important;

  padding: 12px 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 헤더 */
.table thead th {
  position: sticky;
  top: 0;
  z-index: 1;

  background: #f9fafb;
  font-size: 0.85rem !important;
  font-weight: 700 !important;
  color: #111827 !important;

  text-transform: none !important;
  letter-spacing: -0.15px;
}

/* hover */
.table tbody tr:hover {
  background: #f9fafb;
}

/* 번호 칸 좁게 */
.table thead th:nth-child(1),
.table tbody td:nth-child(1) {
  width: 55px;
  min-width: 55px;
  font-weight: 800;
  background: #f9fafb;
}

/* 지원신청서 등록 버튼 (채워진 CTA) */
.btn-add {
  background: #4e93cb !important; /* 메인 원색 */
  color: #ffffff !important;
  border: 1px solid #4e93cb !important;

  /* 120% 정도 크게 */
  font-size: 1.02rem !important; /* 기존 대비 약 120% 느낌 */
  font-weight: 800 !important;
  padding: 10px 18px !important;
  border-radius: 4px !important;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  box-shadow: none !important;
}

.btn-add:hover {
  filter: brightness(0.95);
}
/* 테이블 안 “보기” 버튼 */

.btn-main {
  background: #4e93cb !important; /* 메인 원색 */
  color: #ffffff !important;
  border: 1px solid #4e93cb !important;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;

  font-size: 0.85rem;
  font-weight: 800;
  padding: 7px 14px;
  border-radius: 4px;
  box-shadow: none !important;
}

.btn-main:hover {
  filter: brightness(0.95);
}

/* '없음' 배지 */
.badge.bg-secondary {
  background: #f3f4f6 !important;
  color: #6b7280 !important;
  border: 1px solid #e5e7eb !important;
  border-radius: 999px;
  padding: 6px 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* =========================
   진행상황(검토/승인/반려) 줄맞춤
========================= */
.counts {
  display: inline-flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.85rem;
  color: #4b5563;
  font-weight: 700;
}

/* =========================
   Status Badge
========================= */
.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 64px;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 900;
  font-size: 0.82rem;
  border: 1px solid transparent;
}

/* 대기 */
.status-badge.is-wait {
  background: #f3f4f6;
  color: #374151;
  border-color: #e5e7eb;
}

/* 계획 */
.status-badge.is-plan {
  background: #ecfdf5;
  color: #065f46;
  border-color: #a7f3d0;
}

/* 중점 */
.status-badge.is-focus {
  background: #fffbeb;
  color: #92400e;
  border-color: #fcd34d;
}

/* 긴급 */
.status-badge.is-urgent {
  background: #fef2f2;
  color: #991b1b;
  border-color: #fecaca;
}
</style>
