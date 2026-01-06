<script setup>
import { ref, watch, computed } from 'vue'
import { DatePicker } from 'v-calendar'
import axios from 'axios'
import 'v-calendar/style.css'

import { useCounterStore } from '@/stores/member'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import ReservationTable from '../components/reservation/ReservationTable.vue'
import ReservationCright from '../components/reservation/ReservationCright.vue'

const counterStore = useCounterStore()
const { isLogIn } = storeToRefs(counterStore)

const managerId = computed(() => isLogIn.value?.info?.member_id)

const selectedDate = ref(new Date())
const reservations = ref([])
const reservedDays = ref([])
const pendingReservedList = ref([])

const router = useRouter()

//DatePicker에서 Date 객체가 와서 서버 쿼리에 맞게 YYYY-MM-DD 문자열로 변환
//외우면 좋음.
const toYmd = (d) => {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

//오른쪽에 선택된 날짜 예약목록 불러오기
watch(
  [selectedDate, managerId],
  async ([newDate, mid]) => {
    if (!newDate || !mid) return

    const dateStr = toYmd(newDate)

    const res = await axios.get(`/api/resvByDate/${mid}/${dateStr}`)

    reservations.value = res.data
  },
  { immediate: true },
)

//Datepicker에 있는 attribute_점찍기기능
const calendarAttrs = computed(() => [
  {
    key: 'reserved-days',
    dates: reservedDays.value.map((d) => new Date(d)), // "2025-12-28" -> Date
    dot: {
      color: 'green',
    },
  },
  {
    key: 'today-outline',
    dates: new Date(),
    customData: { type: 'today' }, // 구분용
  },
])

//mid가 바뀔때 마다 달력에 예약존재하는 날에 새로 초록닷 찍기
watch(
  managerId,
  async (mid) => {
    if (!mid) return
    const res = await axios.get(`/api/resvByManager/${mid}`)
    reservedDays.value = res.data // ["2025-12-28", "2025-12-29"]
  },
  { immediate: true },
)

//mid가 바뀔때 마다 하단 테이블영역 승인예약리스트 불러오기
watch(
  managerId,
  async (mid) => {
    if (!mid) return
    const res = await axios.get(`/api/resvByPendingList/${mid}`)
    pendingReservedList.value = res.data
  },
  { immediate: true },
)

const lastSelectedDate = ref(selectedDate.value)

watch(selectedDate, (v) => {
  // v-calendar가 같은 날짜를 다시 누르면 null로 만들 수 있음
  if (v === null) {
    selectedDate.value = lastSelectedDate.value
    return
  }
  // 정상 선택이면 마지막 값 갱신
  lastSelectedDate.value = v
})

//모달창 여는거
const onAccept = async (row) => {
  const mid = managerId.value
  const d = selectedDate.value

  await axios.put('/api/updateRstatus', {
    resvId: row.resv_id,
    managerId: mid,
    resvStatus: 'f2',
    rejectReason: null,
  })

  //승인대기 목록 다시 조회 -> 해당 확인중예약 테이블에서 사라짐
  const res = await axios.get(`/api/resvByPendingList/${mid}`)
  pendingReservedList.value = res.data ?? []

  //cRight 다시조회 -> 자동업데이트
  const dateStr = toYmd(d)
  const cal = await axios.get(`/api/resvByDate/${mid}/${dateStr}`)
  reservations.value = cal.data ?? []
}

const onReject = async ({ row, reason }) => {
  const mid = managerId.value
  const d = selectedDate.value

  await axios.put('/api/updateRstatus', {
    resvId: row.resv_id,
    managerId: mid,
    resvStatus: 'f4',
    rejectReason: reason,
  })

  const res = await axios.get(`/api/resvByPendingList/${mid}`)
  pendingReservedList.value = res.data ?? []

  const dateStr = toYmd(d)
  const cal = await axios.get(`/api/resvByDate/${mid}/${dateStr}`)
  reservations.value = cal.data ?? []
}

const goTimeBlock = () => {
  router.push({
    name: 'ReservationBlock',
  })
}

//콘솔확인용_나중에지우기
console.log('counterStore:', counterStore)
console.log('isLogIn:', isLogIn)
console.log('isLogIn.value:', isLogIn.value)
console.log('login info:', isLogIn.value?.value?.info ?? isLogIn.value?.info)
</script>

<template>
  <div class="py-4 container-fluid">
    <div class="col-12 d-flex justify-content-start">
      <button class="btn btn-primary btn-lg fs-6" @click="goTimeBlock">상담시간 차단하기</button>
    </div>
    <!-- 캘린더 -->
    <div class="row g-4 mb-4">
      <div class="col-12 col-lg-6">
        <div class="card p-3 h-100">
          <h6 class="mb-3">날짜 선택</h6>
          <DatePicker v-model="selectedDate" expanded locale="ko" :attributes="calendarAttrs" />
        </div>
      </div>

      <!-- 캘린더 오른쪽섹션 -->
      <!-- 부모 -->
      <div class="col-12 col-lg-6">
        <ReservationCright :selectedDate="selectedDate" :reservations="reservations" />
      </div>
    </div>

    <!-- 하단 승인대기중상담예약 섹션 -->
    <div class="row">
      <div class="col-12">
        <ReservationTable
          :pendingReservedList="pendingReservedList"
          @accept="onAccept"
          @reject="onReject"
        />
      </div>
    </div>
  </div>
</template>
