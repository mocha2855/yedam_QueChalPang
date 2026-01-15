<!-- views/ReservationMap.vue -->
<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
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

const centerName = ref('')
const centerAddr = ref('') // 화면 표시용(원본 그대로)
const isMapReady = ref(false)
const mapError = ref('')

// 확인버튼 누르면 홈으로
const goHome = () => router.push('/tables')

// ✅ 지오코딩용 주소 정리: | 제거 + 공백 정리
const cleanForGeocode = (addr) =>
  (addr ?? '')
    .replace(/\|/g, ' ')   // 핵심: 파이프 제거
    .replace(/\s+/g, ' ') // 연속 공백 정리
    .trim()

onMounted(async () => {
  try {
    if (!window.kakao?.maps) {
      mapError.value = '카카오 지도 SDK가 로드되지 않았습니다.'
      return
    }

    // 1) 예약ID로 센터 주소 조회
    const res = await axios.get(`/api/centerAddrByResvId/${resvId.value}`)
    centerName.value = res.data.center_name
    centerAddr.value = res.data.center_address

    // 2) 카카오 지도 로드
    window.kakao.maps.load(() => {
      const container = document.getElementById('map')
      if (!container) {
        mapError.value = '지도 컨테이너를 찾을 수 없습니다.'
        return
      }

      const map = new window.kakao.maps.Map(container, {
        center: new window.kakao.maps.LatLng(37.5665, 126.978), // 초기값(서울)
        level: 3,
      })

      const geocoder = new window.kakao.maps.services.Geocoder()

      // ✅ 여기서 정리된 주소로 지오코딩
      const geocodeAddr = cleanForGeocode(centerAddr.value)

      // ✅ 모호하면 센터명까지 붙여서 더 정확하게 시도(권장)
      const query = `${centerName.value} ${geocodeAddr}`.trim()

      geocoder.addressSearch(query, (result, status) => {
        // 1차(센터명+주소) 실패하면 2차(주소만)로 재시도
        if (status !== window.kakao.maps.services.Status.OK || !result?.length) {
          geocoder.addressSearch(geocodeAddr, (result2, status2) => {
            if (status2 !== window.kakao.maps.services.Status.OK || !result2?.length) {
              mapError.value = '주소를 좌표로 변환하지 못했습니다.'
              return
            }
            renderMarker(map, result2[0], centerName.value)
            isMapReady.value = true
          })
          return
        }

        renderMarker(map, result[0], centerName.value)
        isMapReady.value = true
      })
    })
  } catch (e) {
    console.error(e)
    mapError.value = '센터 주소를 불러오는 중 오류가 발생했습니다.'
  }
})

// 마커+인포윈도우 렌더링 함수 분리
const renderMarker = (map, firstResult, name) => {
  const coords = new window.kakao.maps.LatLng(firstResult.y, firstResult.x)
  map.setCenter(coords)

  const marker = new window.kakao.maps.Marker({
    map,
    position: coords,
  })

  const infowindow = new window.kakao.maps.InfoWindow({
    content: `<div style="padding:6px;font-size:14px">${name}</div>`,
  })
  infowindow.open(map, marker)
}
</script>

<template>
  <div class="container-fluid py-4">
    <div class="d-flex justify-content-center">
      <div style="width: 900px; max-width: 100%">
        <div class="card p-4 text-center">
          <h4 class="fw-bold mb-2">상담신청이 완료되었습니다!</h4>
          <div class="mb-3" style="font-size: 20px">{{ scheduleLabel }}</div>

          <div>담당자: <b>{{ manager }}</b></div>
          <div>보호자: <b>{{ guardian }}</b></div>
          <div>지원자: <b>{{ dependant }}</b></div>

          <div class="mt-3">
            <!-- 지도영역 -->
            <div
              id="map"
              style="width: 100%; height: 400px; border: 1px solid #e2e8f0; border-radius: 10px"
            ></div>

            <!-- 에러 표시(있으면) -->
            <div v-if="mapError" class="mt-2 text-danger">
              {{ mapError }}
            </div>

            <div class="mt-2 text-muted">
              <div><b>{{ centerName }}</b></div>
              <!-- ✅ 화면 표시용은 원본 그대로 -->
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
