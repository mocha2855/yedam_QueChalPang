<!-- 관리자 지원서관리 메인페이지. 담당자꺼 그대로 사용-->
<!-- views/components/SurveyTableAdmin.vue -->
<script setup>
import { onBeforeMount, ref } from 'vue'
import { useCounterStore } from '@/stores/member'
import axios from 'axios'
import router from '@/router'

const applicationList = ref([])
const member = useCounterStore().isLogIn.info

const getApplicationList = async () => {
  const result = await axios.get(
    `/api/searchApplicationById/${member.member_id}/${member.member_authority}`,
  )

  const rows = Array.isArray(result.data) ? result.data : []

  applicationList.value = rows.map((row) => {
    //계획서 개수
    const p1 = Number(row.p_i1 ?? 0)
    const p2 = Number(row.p_i2 ?? 0)
    const p3 = Number(row.p_i3 ?? 0)

    //결과서 개수
    const r1 = Number(row.r_i1 ?? 0)
    const r2 = Number(row.r_i2 ?? 0)
    const r3 = Number(row.r_i3 ?? 0)
    console.log('ROW CHECK', row.dependant_no, row.dependant_name, row.application_no)

    return {
      ...row,
      planningCount: p1 + p2 + p3, //계획서 총개수
      resultCount: r1 + r2 + r3, //결과서 총개수
      counts: {
        i1: p1 + r1,
        i2: p2 + r2,
        i3: p3 + r3,
      },
    }
  })
}

onBeforeMount(() => {
  getApplicationList()
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
</script>

<template>
  <div class="card">
    <div class="card-header pb-0">
      <div class="d-flex justify-content-between align-items-center">
        <h6 class="mb-0">지원신청 현황</h6>

        <button class="btn btn-primary btn-sm text-xxs p-1 mb-0" type="button" @click="addApp()">
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

              <td class="align-middle text-center text-sm">
                <span class="text-secondary text-xs font-weight-bold">
                  {{ changeDateFormat(row.application_date) }}
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
