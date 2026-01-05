<script setup>
import { onBeforeMount, ref, computed } from 'vue'
import { useCounterStore } from '@/stores/member'
import axios from 'axios'
import router from '@/router'

const applicationList = ref([])
const member = useCounterStore().isLogIn.info
// 요약된 리스트 생성 (Computed Property)
const summaryList = computed(() => {
  const map = {}

  applicationList.value.forEach((item) => {
    const id = item.dependant_no

    // 1. 아직 맵에 없는 사람이면 초기화
    if (!map[id]) {
      map[id] = {
        dependant_no: id,
        dependant_name: item.dependant_name, // 이름은 대표로 하나만 가져옴
        survey_no: item.survey_no,
        member_id: item.member_id,
        application_date: item.application_date,
        status: item.status,
        application_rejector: item.application_rejector,
        status_reject: item.status_reject,
        counts: {
          i1: 0,
          i2: 0,
          i3: 0,
        },
      }
    }

    // 2. status_status 값에 따라 카운트 증가
    // 값이 'i1', 'i2', 'i3'인 경우에만 해당 카운터를 1 증가시킴
    const status = item.status_status
    if (status && map[id].counts[status] !== undefined) {
      map[id].counts[status]++
    }
    if (item.application_date < map[id].application_date) {
      map[id].application_date = item.application_date
    }
  })

  // 객체(Map)를 배열로 변환해서 반환
  return Object.values(map)
})
const getApplicationList = async () => {
  console.log(member)
  let result = await axios.get(
    `/api/searchApplicationById/${member.member_id}/${member.member_authority}`,
  )
  console.log(result)
  console.log(result.data)
  // let newResult = []
  // for( data in result.data){
  //   let statuses = {i1:0,i2:0,i3:0}
  //  if(data.status_status
  // }
  applicationList.value = result.data
}
onBeforeMount(() => {
  getApplicationList()
})
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
const changeDateFormat = (input) => {
  let date = new Date(input)
  let result = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
  return result
}
const addApp = () => {
  router.push({ name: 'AddApplication' })
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
            <tr v-for="(person, index) in summaryList" :key="person.dependant_no">
              <td class="align-middle text-center text-sm">
                <p class="text-xs font-weight-bold mb-0">{{ index + 1 }}</p>
              </td>
              <td>
                <p class="text-xs font-weight-bold mb-0">{{ person.dependant_name }}</p>
              </td>
              <td class="align-middle text-center text-sm">
                <span class="text-secondary text-xs font-weight-bold">{{
                  changeDateFormat(person.application_date)
                }}</span>
              </td>
              <td class="align-middle text-center">
                <span class="badge badge-sm bg-gradient-success" style="cursor: pointer">보기</span>
              </td>
              <td class="align-middle text-center text-sm">
                <span class="text-secondary text-xs font-weight-bold">{{
                  person.application_rejector
                }}</span>
              </td>
              <td class="align-middle text-center text-sm">
                <span class="text-secondary text-xs font-weight-bold">{{
                  returnStatus(person.status)
                }}</span>
              </td>
              <td class="align-middle text-center text-sm pt-1 pb-1">
                <p class="text-secondary text-xs mt-1 mb-1 font-weight-bold">
                  검토 : {{ person.counts.i1 }}
                </p>
                <p class="text-secondary text-xs mt-1 mb-1 font-weight-bold">
                  승인 : {{ person.counts.i2 }}
                </p>
                <p class="text-secondary text-xs mt-1 mb-1 font-weight-bold">
                  반려 : {{ person.counts.i3 }}
                </p>
              </td>
              <td class="align-middle text-center text-sm">
                <span
                  class="badge badge-sm"
                  :class="{ 'bg-secondary': true, 'bg-gradient-success': false }"
                  :style="{ cursor: 'pointer' }"
                  >없음</span
                >
              </td>
              <td class="align-middle text-center text-sm">
                <span
                  class="badge badge-sm"
                  :class="{ 'bg-secondary': true, 'bg-gradient-success': false }"
                  :style="{ cursor: 'pointer' }"
                  >없음</span
                >
              </td>
              <td class="align-middle text-center text-sm">
                <span
                  class="badge badge-sm"
                  :class="{ 'bg-secondary': false, 'bg-gradient-success': true }"
                  :style="{ cursor: 'pointer' }"
                  >보기</span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
