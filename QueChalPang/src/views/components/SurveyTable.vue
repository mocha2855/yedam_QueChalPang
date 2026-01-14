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
  //i2가 아닌 상태엔 e 코드값과 관련없이 항당 대기로 표시
  if (statStatus !== 'i2') {
    return '대기'
  }

  //status_status = i2 일때만 텍스트 표시
  if (stat === 'e3') return '계획'
  if (stat === 'e4') return '중점'
  if (stat === 'e5') return '긴급'

  //텍스트 표시 안전장치
  if (stat === 'e1') return '대기'
  if (stat === 'e2') return '검토중'

  return stat ?? ''
}

const changeDateFormat = (input) => {
  let date = new Date(input)
  let result = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
  return result
}

const addApp = () => {
  router.push({ name: 'AddApplication' })
}

//해당 지원자의 지원신청서 페이지로 이동
const goToApplication = (appNo) => {
  router.push({ name: 'applicationWait', params: { id: appNo } })
}

//지원계획서
const goToPlanning = (applicationNo) => {
  router.push({ name: 'applicationPlanning', params: { id: applicationNo } })
}

//지원결과서
const goToResult = (applicationNo) => {
  router.push({ name: 'applicationResult', params: { id: applicationNo } })
}

//상담내역
const goToMeetingLog = (applicationNo) => {
  router.push({ name: 'meetingLog', params: { id: applicationNo } })
}

const statusBadgeClass = (stat, statStatus) => {
  const label = returnStatus(stat, statStatus)

  if (label === '계획') return 'is-plan'
  if (label === '중점') return 'is-focus'
  if (label === '긴급') return 'is-urgent'

  // '대기', '검토중', 그 외는 기본 회색
  return 'is-wait'
}
</script>

<template>
  <div class="card">
    <div class="card-header pb-0">
      <div class="d-flex justify-content-between align-items-center">
        <h6 class="mb-0">지원신청 현황</h6>

        <button class="btn btn-primary btn-lg text-sm p-1 mb-0" type="button" @click="addApp()">
          지원신청서 등록
        </button>
      </div>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                번호
              </th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                지원자명
              </th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                보호자명
              </th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                지원신청서번호
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                지원신청일
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                지원신청서
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                담당자
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                대기단계
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                계획/결과 진행 상황
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                지원계획
              </th>
              <th
                v-if="member.member_authority != 'a1'"
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                style="display: none"
              >
                상담내역
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                지원결과
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, index) in applicationList"
              :key="row.application_no ?? `d-${row.dependant_no}`"
            >
              <td class="align-middle text-center text-sm">
                <p class="text-xs font-weight-bold mb-0">{{ index + 1 }}</p>
              </td>
              <td>
                <p class="text-xs font-weight-bold mb-0">{{ row.dependant_name }}</p>
              </td>
              <td>
                <p class="text-xs font-weight-bold mb-0">{{ row.guardian_name }}</p>
              </td>
              <td class="align-middle text-center text-sm">
                <p class="text-xs font-weight-bold mb-0">
                  {{ row.application_no ?? 'N/A' }}
                </p>
              </td>

              <td class="align-middle text-center text-sm">
                <span class="text-secondary text-xs font-weight-bold">
                  {{ row.application_date ? changeDateFormat(row.application_date) : 'N/A' }}
                </span>
              </td>
              <td class="align-middle text-center">
                <template v-if="row.application_no">
                  <button
                    class="btn btn-success btn-sm mb-0"
                    type="button"
                    @click="goToApplication(row.application_no)"
                  >
                    보기
                  </button>
                </template>
                <template v-else>
                  <span class="badge badge-sm bg-secondary">없음</span>
                </template>
              </td>
              <td class="align-middle text-center text-sm">
                <span class="text-secondary text-xs font-weight-bold">{{ row.manager_name }}</span>
              </td>
              <td class="align-middle text-center text-sm">
                <span :class="['status-badge', statusBadgeClass(row.status, row.status_status)]">
                  {{ returnStatus(row.status, row.status_status) }}
                </span>
              </td>
              <td class="align-middle text-center text-sm pt-1 pb-1">
                <p class="text-secondary text-xs mt-1 mb-1 font-weight-bold">
                  검토 : {{ row.counts.i1 }}
                </p>
                <p class="text-secondary text-xs mt-1 mb-1 font-weight-bold">
                  승인 : {{ row.counts.i2 }}
                </p>
                <p class="text-secondary text-xs mt-1 mb-1 font-weight-bold">
                  반려 : {{ row.counts.i3 }}
                </p>
              </td>
              <td class="align-middle text-center text-sm">
                <template v-if="row?.application_no && row.planningCount > 0">
                  <button
                    class="btn btn-success btn-sm mb-0"
                    type="button"
                    @click="goToPlanning(row.application_no)"
                  >
                    보기
                  </button>
                </template>
                <template v-else>
                  <span class="badge badge-sm bg-secondary">없음</span>
                </template>
              </td>
              <td
                v-if="member.member_authority != 'a1'"
                class="align-middle text-center text-sm"
                style="display: none"
              >
                <template v-if="row?.application_no && Number(row.meetingCount ?? 0) > 0">
                  <button
                    class="btn btn-success btn-sm mb-0"
                    type="button"
                    @click="goToMeetingLog(row.application_no)"
                  >
                    보기
                  </button>
                </template>
                <template v-else>
                  <span class="badge badge-sm bg-secondary">없음</span>
                </template>
              </td>

              <td class="align-middle text-center text-sm">
                <template v-if="row?.application_no && row.resultCount > 0">
                  <button
                    class="btn btn-success btn-sm mb-0"
                    type="button"
                    @click="goToResult(row.application_no)"
                  >
                    보기
                  </button>
                </template>
                <template v-else>
                  <span class="badge badge-sm bg-secondary">없음</span>
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
.card {
  background: transparent !important;
  border: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  overflow: visible !important;
}

/* Header */
.card-header {
  background: transparent !important;
  border-bottom: 1px solid #e5e7eb;
  padding: 14px 0 !important;
}

.card-header h6 {
  font-size: 1.05rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.2px;
}

.card-body {
  padding: 0 !important;
}

.table-responsive {
  overflow-x: auto;
}

.table {
  width: 100%;
  min-width: 1100px;
  table-layout: fixed;

  border-collapse: collapse !important;
  border-spacing: 0 !important;

  border: 1px solid #e5e7eb;
  background: #fff;
}

.table thead th,
.table tbody td {
  border: 1px solid #e5e7eb !important;
  text-align: center !important;
  vertical-align: middle !important;

  padding: 12px 10px !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 헤더 */
.table thead th {
  position: sticky;
  top: 0;
  z-index: 1;

  background: #f7fbff;
  font-size: 0.85rem !important;
  font-weight: 800 !important;
  color: #0f172a !important;

  text-transform: none !important;
  letter-spacing: -0.15px;
}

/* 바디 */
.table tbody td {
  font-size: 0.92rem;
  color: #111827;
  background: #fff;
}

.table tbody tr:hover {
  background: #f9fafb;
}

.table tbody p,
.table tbody span {
  margin: 0 !important;
  line-height: 1.2 !important;
  display: inline-block;
}

.table thead th:nth-child(1),
.table tbody td:nth-child(1) {
  width: 55px;
  min-width: 55px;
  font-weight: 900;
  background: #f7fbff;
}

.table .btn.btn-sm {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;

  font-size: 0.85rem;
  font-weight: 900;
  padding: 7px 14px;
  border-radius: 4px;

  box-shadow: none !important;
  transform: none !important;
}

.table .btn.btn-success.btn-sm {
  background: #4e93cb !important;
  border: 1px solid #4e93cb !important;
  color: #ffffff !important;
}

.table .btn.btn-success.btn-sm:hover {
  filter: brightness(0.95);
}

.btn.btn-primary.btn-lg {
  background: #4e93cb !important;
  border: 1px solid #4e93cb !important;
  color: #ffffff !important;

  font-size: 1.02rem !important; /* 약 120% */
  font-weight: 900 !important;
  padding: 10px 18px !important;
  border-radius: 4px !important;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;

  box-shadow: 0 12px 24px rgba(78, 147, 203, 0.22) !important;
}

.btn.btn-primary.btn-lg:hover {
  filter: brightness(0.95);
}

/* hover lift(촌스러운 튀는 모션 제거) */
.table .btn:hover {
  transform: none !important;
}

/* =========================
   '없음' 배지: 통일 톤
========================= */
.badge.bg-secondary,
.badge.badge-sm.bg-secondary {
  background: #f3f4f6 !important;
  color: #6b7280 !important;
  border: 1px solid #e5e7eb !important;
  border-radius: 999px;
  padding: 6px 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* 텍스트 유틸 */
.text-center {
  white-space: nowrap;
}

/* 9번째 컬럼(계획/결과 진행 상황)만 줄바꿈 허용 */
.table thead th:nth-child(9),
.table tbody td:nth-child(9) {
  white-space: normal !important;
}

/* 내부 p는 블록으로 유지해서 줄바꿈 확실히 */
.table tbody td:nth-child(9) p {
  display: block !important;
  margin: 4px 0 !important;
}
/* ===== status badge (관리자 화면과 동일) ===== */
.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 64px;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.82rem;
  border: 1px solid transparent;
}

/* 대기/기본: 회색 */
.status-badge.is-wait {
  background: #f3f4f6;
  color: #374151;
  border-color: #e5e7eb;
}

/* 계획: 연초록 */
.status-badge.is-plan {
  background: #ecfdf5;
  color: #065f46;
  border-color: #a7f3d0;
}

/* 중점: 연노랑 */
.status-badge.is-focus {
  background: #fffbeb;
  color: #92400e;
  border-color: #fcd34d;
}

/* 긴급: 빨강 */
.status-badge.is-urgent {
  background: #fef2f2;
  color: #991b1b;
  border-color: #fecaca;
}
</style>
