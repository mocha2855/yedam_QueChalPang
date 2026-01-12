<!-- 관리자 지원서관리 메인페이지. 담당자꺼 그대로 사용-->
<!-- views/components/SurveyTableAdmin.vue -->
<script setup>
import { onBeforeMount, ref } from 'vue'
import { useCounterStore } from '@/stores/member'
import { useSearchStore } from '@/stores/search'
import { storeToRefs } from 'pinia'
import axios from 'axios'
import router from '@/router'
import { useModalStore } from '@/stores/modal'

const search = useSearchStore()
const member = useCounterStore().isLogIn.info
search.member = member

const { applicationList } = storeToRefs(search)
const modal = useModalStore()

// 시스템 관리자용
const centerList = ref([])
const selectedCenter = ref(null)

// 센터 목록 가져오기
const getAdminCenterList = async () => {
  if (member.member_authority === 'a4') {
    const result = await axios.get('/api/centers', {
      params: {
        key: 'center_name',
        value: '',
        badge: '',
      },
    })
    centerList.value = result.data

    if (centerList.value.length > 0) {
      selectedCenter.value = centerList.value[0].center_no
      const memberData = { ...member, member_id: selectedCenter.value }
      search.member = memberData
      search.getApplicationList(memberData)
    }
  }
}
// 센터 변경 시
const onCenterChange = () => {
  const memberData = { ...member, member_id: selectedCenter.value }
  search.member = memberData
  search.getApplicationList(memberData)
}

const returnStatus = (stat, statStatus) => {
  if (statStatus !== 'i2') {
    return '대기'
  }

  if (stat === 'e3') return '계획'
  if (stat === 'e4') return '중점'
  if (stat === 'e5') return '긴급'

  if (stat === 'e1') return '대기'
  if (stat === 'e2') return '검토중'

  return stat ?? ''
}

const changeDateFormat = (input) => {
  let date = new Date(input)
  let result = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
  return result
}

// const addApp = () => {
//   router.push({ name: 'AddApplication' })
// }

//해당 지원자의 지원신청서 페이지로 이동
const goToApplication = (appNo) => {
  router.push({ name: 'applicationWait', params: { id: appNo } })
}

//담당자 배정
const openAssignManagerModal = (row) => {
  modal.open('assignManager', {
    applicationNo: row.application_no,
    dependantNo: row.dependant_no,
    dependantName: row.dependant_name,
    guardianName: row.guardian_name,
    onComplete: () => location.reload(),
  })
  console.log('해당데이터값', row)
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
onBeforeMount(() => {
  if (member.member_authority === 'a4') {
    setTimeout(() => {
      getAdminCenterList() // 시스템 관리자는 센터 목록 먼저
    }, 10)
  } else {
    setTimeout(() => {
      search.getApplicationList(member)
    }, 10)
    // 나머지는 바로 조회
  }
})
</script>

<template>
  <div class="card">
    <div class="card-header pb-0">
      <div class="d-flex justify-content-between align-items-center">
        <h6 class="mb-0">지원신청 현황</h6>
        <!--시스템 관리자 센터 선택-->
        <div v-if="member.member_authority === 'a4'">
          <select
            v-model="selectedCenter"
            @change="onCenterChange"
            class="form-select form-select-sm"
            style="width: 200px"
          >
            <option v-for="center in centerList" :key="center.center_no" :value="center.center_no">
              {{ center.center_name }}
            </option>
          </select>
        </div>
        <!-- <button
          v-else
          class="btn btn-primary btn-lg text-sm p-1 mb-0"          
          type="button"
          @click="addApp()"
        >
          지원신청서 등록
        </button> -->
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
                신청서번호
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
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
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
                  {{ row.application_no }}
                </p>
              </td>
              <!-- 지원신청서 제출날짜 -->
              <td class="align-middle text-center text-sm">
                <span class="text-secondary text-xs font-weight-bold">
                  {{ changeDateFormat(row.application_date) }}
                </span>
              </td>
              <!-- 지원신청서 번호 -->
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
              <!-- 담당자이름 -->
              <td class="align-middle text-center text-sm">
                <template v-if="row.manager_name">
                  <span class="text-secondary text-xs font-weight-bold">{{
                    row.manager_name
                  }}</span>
                </template>
                <template v-else>
                  <button
                    class="btn btn-success btn-sm mb-0"
                    type="button"
                    @click="openAssignManagerModal(row)"
                  >
                    담당자배정
                  </button>
                </template>
              </td>
              <!-- 대기단계 -->
              <td class="align-middle text-center text-sm">
                <span class="text-secondary text-xs font-weight-bold">
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
              <td class="align-middle text-center text-sm">
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
  border: 1px solid #eef1f5;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(17, 24, 39, 0.06);
  overflow: hidden;
  background: #fff;
}

/* ===== Header ===== */
.card-header {
  padding: 14px 18px;
  border-bottom: 1px solid #eef1f5;
  background: #fff;
}

.card-header h6 {
  font-size: 1.05rem;
  font-weight: 600;       
  color: #111827;
  letter-spacing: -0.2px;
}

/* ===== Table Layout ===== */
.table-responsive {
  overflow-x: auto;
}

.table {
  border-collapse: separate;
  border-spacing: 0;
  min-width: 1100px;
}

.table thead th {
  position: sticky;
  top: 0;
  z-index: 1;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;

  padding: 13px 14px;
  font-size: 0.85rem !important;     
  font-weight: 600;        
  color: #000000 !important;     
  text-transform: none !important;
  letter-spacing: -0.15px;
  white-space: nowrap;
}

.table tbody td {
  padding: 13px 14px;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
  font-size: 0.95rem;
  font-weight: 400;
  color: #111827;
}

.table tbody tr {
  background: #fff;
  transition: background 0.12s ease;
}

.table tbody tr:hover {
  background: #f9fafb;
}

.table tbody p {
  margin: 0;
  font-size: 0.95rem !important;
  font-weight: 400 !important;
  color: #111827;
  line-height: 1.4;
}

.table tbody .text-secondary {
  font-size: 0.93rem !important;
  font-weight: 400 !important;
  color: #6b7280 !important;
}

.table tbody td:nth-child(9) p {
  font-size: 0.9rem !important;
  color: #4b5563 !important;
}

.table .btn.btn-sm {
  font-size: 0.88rem;
  font-weight: 500;
  padding: 7px 13px;
  border-radius: 10px;
  box-shadow: none;
  border: 1px solid rgba(17, 24, 39, 0.08);
}

.table .btn.btn-success.btn-sm {
  background: #16a34a;
  border-color: rgba(22, 163, 74, 0.25);
}

.table .btn.btn-primary.btn-sm {
  background: #2563eb;
  border-color: rgba(37, 99, 235, 0.25);
}

.table .btn:hover {
  filter: brightness(0.97);
  transform: translateY(-1px);
  transition: transform 0.12s ease;
}

.empty-text {
  color: #9ca3af;
  font-size: 0.92rem;
  font-weight: 400;
}

.text-center {
  white-space: nowrap;
}

</style>