<!-- views/ReservationMap.vue -->
<script setup>
import { computed } from 'vue'
import { onMounted } from 'vue'

//import naver from 'vue-naver-maps';
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()


const date = computed(() => route.query.date)
const time = computed(() => route.query.time)
const manager = computed(() => route.query.manager)
const guardian = computed(() => route.query.guardian)
const dependant = computed(() => route.query.dependant)

const scheduleLabel = computed(() => `${date.value} ${time.value}`)

console.log(scheduleLabel)

//확인버튼 누르면 홈으로
const goHome = () => router.push('/')

//카카오지도
onMounted(() => {
  if (!window.kakao || !window.kakao.maps) {
    console.error('카카오맵 SDK 로드 안됨')
    return
  }

  window.kakao.maps.load(() => {
    const container = document.getElementById('map')
    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.9780),
      level: 3,
    }

    new window.kakao.maps.Map(container, options)
  })
})


// }
</script>

<template>
  <div class="container-fluid py-4">
    <div class="d-flex justify-content-center">
      <div style="width: 900px; max-width: 100%">
        <div class="card p-4 text-center">
          <h4 class="fw-bold mb-2" >상담신청이 완료되었습니다!</h4>
          <div class="mb-3" style="font-size: 20px">{{ scheduleLabel }}</div>

          <div>담당자: <b>{{ manager }}</b></div>
          <div>보호자: <b>{{ guardian }}</b></div>
          <div>지원자: <b>{{ dependant }}</b></div>

          <div class="mt-3">
           <!-- 지도영역!!  -->
            <div id="map" style="width:100%; height:400px;"></div>
          </div>

          <div class="mt-4">
            <button class="btn btn-primary" @click="goHome">확인</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
