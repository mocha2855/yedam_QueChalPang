<!-- views/ReservationMap.vue -->
<script setup>
import { ref, computed } from 'vue'
import { onMounted } from 'vue'
import axios from 'axios'
//import naver from 'vue-naver-maps';
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const resvId = computed(() => route.query.resvId)
const date = computed(() => route.query.date)
const time = computed(() => route.query.time)
const manager = computed(() => route.query.manager)
const guardian = computed(() => route.query.guardian)
const dependant = computed(() => route.query.dependant)

const scheduleLabel = computed(() => `${date.value} ${time.value}`)
console.log(scheduleLabel)

const centerName = ref('')
const centerAddr = ref('')

//확인버튼 누르면 홈으로
const goHome = () => router.push('/')

//카카오지도
onMounted(async () => {
  console.log('kakao exists?', !!window.kakao)
  console.log('kakao.maps exists?', !!window.kakao?.maps)
  console.log('kakao.maps.load exists?', typeof window.kakao?.maps?.load)
  console.log('kakao.maps.services exists?', !!window.kakao?.maps?.services)

  if (!window.kakao?.maps) return

  const res = await axios.get(`/api/centerAddrByResvId/${resvId.value}`)
  centerName.value = res.data.center_name
  centerAddr.value = res.data.center_address

  window.kakao.maps.load(() => {
    const container = document.getElementById('map')
    const map = new window.kakao.maps.Map(container, {
      center: new window.kakao.maps.LatLng(37.5665, 126.978),
      level: 3,
    })

    // 주소 → 좌표
    const geocoder = new window.kakao.maps.services.Geocoder()

    geocoder.addressSearch(centerAddr.value, (result, status) => {
      if (status !== window.kakao.maps.services.Status.OK) return

      const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x)

      // 지도 중심 이동
      map.setCenter(coords)

      // 마커
      const marker = new window.kakao.maps.Marker({
        map,
        position: coords,
      })

      // 인포윈도우
      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:6px;font-size:14px">${centerName.value}</div>`,
      })
      infowindow.open(map, marker)
    })
  })
})
</script>

<template>
  <div class="container-fluid py-4">
    <div class="d-flex justify-content-center">
      <div style="width: 900px; max-width: 100%">
        <div class="card p-4 text-center">
          <h4 class="fw-bold mb-2">상담신청이 완료되었습니다!</h4>
          <div class="mb-3" style="font-size: 20px">{{ scheduleLabel }}</div>

          <div>
            담당자: <b>{{ manager }}</b>
          </div>
          <div>
            보호자: <b>{{ guardian }}</b>
          </div>
          <div>
            지원자: <b>{{ dependant }}</b>
          </div>

          <div class="mt-3">
            <!-- 지도영역!!  -->
            <div id="map" style="width: 100%; height: 400px; border: 1px solid red"></div>
            <div class="mt-2 text-muted">
              <div>
                <b>{{ centerName }}</b>
              </div>
              <div>{{ centerAddr }}</div>
            </div>
            <div class="mt-4">
              <button class="btn btn-primary" @click="goHome">확인</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
