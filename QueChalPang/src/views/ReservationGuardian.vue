<!-- views/ReservationGuardian.vue -->
<script setup>
import { ref, computed, watch } from 'vue'
import { DatePicker } from 'v-calendar'
import 'v-calendar/style.css'
import axios from 'axios'

import { useCounterStore } from '@/stores/member'
import { storeToRefs } from 'pinia'

const counterStore = useCounterStore()
const { isLogIn } = storeToRefs(counterStore)

const guardianId = computed(() => isLogIn.value?.info?.member_id)

const dependantList = ref([]) // [{ dependant_no, dependant_name }, ...]
const dependantNo = ref(null) // 선택된 dependant_no

const fetchMyDependants = async () => {
  if (!guardianId.value) return

  // ✅ 서버에 /api/dependants/:guardianId 라우터 만들어둔 기준
  const res = await axios.get(`/api/dependants/${guardianId.value}`)
  dependantList.value = res.data ?? []

  // 기본값: 첫번째 자동 선택
  dependantNo.value = dependantList.value[0]?.dependant_no ?? null
}

const reservedTimes = ref(new Set())
const blockedTimes = ref(new Set())
const lunchTime = ref('')
const selectedTime = ref('')

// ========================
// 날짜 범위 (내일부터 2주)
// ========================
const today = new Date()
today.setHours(0, 0, 0, 0)

const maxDate = new Date(today)
maxDate.setDate(maxDate.getDate() + 14)

const selectedDate = ref(new Date(today))

//vcalendar 날짜막기
const disabledDates = computed(() => [
  { start: null, end: new Date(today.getTime() - 1000 * 60 * 60 * 24) }, // 오늘 이전 전체 비활성
  { start: new Date(maxDate.getTime()), end: null }, // maxDate 다음날 이후 전체 비활성
])

// ========================
// 날짜 포맷 (표시용 / API용) 통일
// ========================
const selectedYmdKorean = computed(() => {
  const d = selectedDate.value
  if (!d) return ''
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}년 ${mm}월 ${dd}일`
})

const selectedYmdDash = computed(() => {
  const d = selectedDate.value
  if (!d) return ''
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
})

// ========================
// 시간 슬롯
// ========================
const baseSlots = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']

const timeSlots = computed(() =>
  baseSlots.map((t) => {
    const isLunch = lunchTime.value === t
    const isReserved = reservedTimes.value.has(t)
    const isBlocked = blockedTimes.value.has(t)

    return {
      time: t,
      available: !(isLunch || isReserved || isBlocked),
      // 필요 없으면 reason 제거 가능
      reason: isLunch ? '점심' : isReserved ? '예약됨' : isBlocked ? '차단' : '',
    }
  }),
)

const selectTime = (slot) => {
  if (!slot.available) return
  selectedTime.value = slot.time
}

// ========================
// API 호출
// ========================
const fetchAvailability = async () => {
  if (!dependantNo.value || !selectedDate.value) return
  const res = await axios.get(`/api/availability/${dependantNo.value}/${selectedYmdDash.value}`)
  lunchTime.value = res.data.centerLunch ? res.data.centerLunch.slice(0, 5) : ''
  reservedTimes.value = new Set((res.data.reservedTimes ?? []).map((t) => t.slice(0, 5)))
  blockedTimes.value = new Set((res.data.blockedTimes ?? []).map((t) => t.slice(0, 5)))
}

// ========================
// DatePicker 하이라이트
// ========================
const calendarAttrs = computed(() => [
  {
    key: 'selected',
    dates: selectedDate.value,
    highlight: { fillMode: 'solid' },
  },
])

const lastSelectedDate = ref(selectedDate.value)

watch(
  selectedDate,
  async (v) => {
    // 같은 날짜 다시 눌러 null 되는 케이스 방어
    if (v === null) {
      selectedDate.value = lastSelectedDate.value
      return
    }

    lastSelectedDate.value = v
    selectedTime.value = ''
    await fetchAvailability()
  },
  { immediate: true },
)

// 로그인 정보 들어오면 dependant 리스트 가져오기
watch(
  guardianId,
  async () => {
    await fetchMyDependants()
    selectedTime.value = ''
    await fetchAvailability()
  },
  { immediate: true },
)
</script>

<template>
  <div class="py-4 container-fluid">
    <!--dependant 드롭다운!  -->
    <div class="row justify-content-center mb-3">
      <div class="col-12 col-md-10 col-lg-7 col-xl-6">
        <div class="card p-3 shadow-sm">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <h6 class="mb-0">대상자 선택</h6>
            <div class="small text-muted" v-if="dependantList.length === 0">
              대상자 정보가 없습니다.
            </div>
          </div>

          <select class="form-select" v-model="dependantNo" :disabled="dependantList.length === 0">
            <option v-for="d in dependantList" :key="d.dependant_no" :value="d.dependant_no">
              {{ d.dependant_name }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <!-- 캘린더 -->
    <div class="row justify-content-center">
      <div class="col-12 col-md-10 col-lg-7 col-xl-6">
        <div class="card p-3 shadow-sm">
          <div class="d-flex align-items-center gap-2 mb-2">
            <h6 class="mb-0">날짜선택</h6>
            <div class="fw-semibold">당일 예약은 불가합니다.</div>
          </div>

          <DatePicker
            v-model="selectedDate"
            expanded
            locale="ko"
            :disabled-dates="disabledDates"
            :attributes="calendarAttrs"
          />
        </div>
      </div>
    </div>

    <!-- 시간슬롯 선택 -->
    <div class="row justify-content-center mt-3">
      <div class="col-12 col-md-10 col-lg-7 col-xl-6">
        <div class="card p-3 shadow-sm">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <div class="d-flex align-items-center gap-2">
              <h6 class="mb-0">선택된 날짜</h6>
              <div class="fw-semibold">{{ selectedYmdKorean }}</div>
            </div>

            <button class="btn btn-primary btn-sm" :disabled="!selectedTime">다음</button>
          </div>

          <div class="time-grid">
            <button
              v-for="slot in timeSlots"
              :key="slot.time"
              class="time-btn"
              :class="{
                selected: selectedTime === slot.time,
                disabled: !slot.available,
              }"
              @click="selectTime(slot)"
              :disabled="!slot.available"
            >
              {{ slot.time }}
            </button>
          </div>

          <div class="mt-2 small text-muted">* 오늘 기준 2주(14일) 이내만 예약 가능합니다.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.time-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.time-btn {
  border: 0;
  border-radius: 999px;
  padding: 10px 12px;
  font-weight: 600;
  background: #e9ecef;
  color: #333;
  cursor: pointer;
  transition: transform 0.05s ease;
}

.time-btn:active {
  transform: scale(0.98);
}

.time-btn.selected {
  background: #2f55ff;
  color: #fff;
}

.time-btn.disabled {
  background: #d9dde3;
  color: #8a8f98;
  cursor: not-allowed;
}
</style>
