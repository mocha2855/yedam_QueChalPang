<!-- views/ReservationConfirm.vue -->
<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const applicationNo = computed(() => route.query.applicationNo)
//front용 format
const date = computed(() => route.query.date ?? '')
const time = computed(() => route.query.time ?? '')
const name = computed(() => route.query.name)
const dependant = computed(() => route.query.dependant)
const manager = computed(() => route.query.manager)

const scheduleLabel = computed(() => {
  if (!date.value && !time.value) return ''
  return `일정 ${date.value} ${time.value}`
})

const goBack = () => router.back()

//DB용 format
const resvDay = computed(() => route.query.resv_day)
const guardianId = computed(() => route.query.guardianId)
const managerId = computed(() => route.query.managerId)
const dependantNo = computed(() => route.query.dependantNo)

//[2025-12-26 14:00:00 ] 형태
const timeslotCal = () => {
  const start_at = `${resvDay.value} ${time.value}:00`

  //end_at시간 설정: start_at기준으로 한시간 더하기
  const startDate = new Date(`${resvDay.value}T${time.value}:00`) //객채 한개 만들어줌
  startDate.setHours(startDate.getHours() + 1) //만든 객체에서 시간 가져와서 +1

  const yyyy = startDate.getFullYear()
  const mm = String(startDate.getMonth() + 1).padStart(2, '0')
  const dd = String(startDate.getDate()).padStart(2, '0')
  const hh = String(startDate.getHours()).padStart(2, '0')
  const mi = String(startDate.getMinutes()).padStart(2, '0')

  const end_at = `${yyyy}-${mm}-${dd} ${hh}:${mi}:00`

  return { start_at, end_at }
}

//예약학 버튼을 누르면 다음 페이지로 쿼리를 함께 넘김
const submitReservation = async () => {
  if (
    !resvDay.value ||
    !guardianId.value ||
    !dependantNo.value ||
    !guardianId.value ||
    !managerId.value
  ) {
    alert('예약정보가 부족합니다. 다시 시도해주세요.')
  }

  const { start_at, end_at } = timeslotCal()

  const resvdata = {
    dependant_no: Number(dependantNo.value),
    application_no: Number(applicationNo.value),
    guardian_id: String(guardianId.value),
    manager_id: String(managerId.value),
    resv_day: String(resvDay.value),
    start_at,
    end_at,
  }

  const res = await axios.post(`/api/createReservation`, resvdata)

  router.push({
    name: 'ReservationGuardianMap',
    query: {
      date: date.value,
      time: time.value,
      guardian: name.value,
      dependant: dependant.value,
      manager: manager.value,
      resvId: res.data?.resvId,
    },
  })
}
</script>

<template>
  <div class="container-fluid py-4">
    <div class="d-flex justify-content-center">
      <div style="width: 900px; max-width: 100%">
        <!-- 안내문구 -->
        <div class="text-center mb-4" style="color: red; font-weight: 700">
          아래 내용이 맞는지 확인 해주세요
        </div>

        <!-- 예약정보 다시보기-->
        <div class="d-flex justify-content-center">
          <div
            class="card shadow-sm"
            style="width: 520px; border-radius: 14px; border: 1px solid #cfcfcf"
          >
            <div class="card-body py-4 text-center">
              <div class="mb-3" style="font-size: 20px; font-weight: 700">
                {{ scheduleLabel }}
              </div>

              <div class="mb-2" style="font-size: 16px">
                보호자 : <b>{{ name }}</b>
              </div>

              <div class="mb-2" style="font-size: 16px">
                지원자 : <b>{{ dependant }}</b>
              </div>

              <div style="font-size: 16px">
                담당자 : <b>{{ manager }}</b>
              </div>
            </div>
          </div>
        </div>

        <!-- 버튼 영역 -->
        <div class="d-flex justify-content-center gap-2 mt-4">
          <button class="btn btn-outline-secondary" @click="goBack">이전</button>

          <button class="btn btn-primary" @click="submitReservation">예약 신청하기</button>
        </div>
      </div>
    </div>
  </div>
</template>
