<!-- views/ReservationConfirm.vue -->
<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const date = computed(() => route.query.date ?? '')
const time = computed(() => route.query.time ?? '')
const name = computed(() => route.query.name)
const dependant = computed(() => route.query.dependant)

const scheduleLabel = computed(() => {
  if (!date.value && !time.value) return ''
  return `일정 ${date.value} ${time.value}`
})

const goBack = () => router.back()

const submitReservation = async () => {
  // TODO: 여기서 서버로 예약신청 POST 넣으면 됨
  // await axios.post('/api/reservation', {...})
  alert('예약 신청(임시) 완료!') // 지금은 화면 확인용
  // router.push('/reservation/done') 같은 완료페이지로 보내도 됨
}

// const toYmd = computed(() => {
//   const d = selectedDate.value
//   if (!d) return ''
//   const yyyy = d.getFullYear()
//   const mm = String(d.getMonth() + 1).padStart(2, '0')
//   const dd = String(d.getDate()).padStart(2, '0')
//   return `${yyyy}년 ${mm}월 ${dd}일`
// })
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
