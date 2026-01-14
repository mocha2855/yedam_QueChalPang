<!-- src/views/reservation/ReservationGuardian.vue -->
<script setup>
import { ref, computed, watch } from 'vue'
import { DatePicker } from 'v-calendar'
import 'v-calendar/style.css'
import axios from 'axios'
import Swal from 'sweetalert2'

import { useCounterStore } from '@/stores/member'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import ReservationGuardianHistory from './ReservationGuardianHistory.vue'

// 피니아 로그인정보
const counterStore = useCounterStore()
const { isLogIn } = storeToRefs(counterStore)

// 라우터(다음 페이지로 이동은 유지)
const router = useRouter()

const activeTab = ref('reserve') // 'reserve' | 'history'

// 보호자의 지원자정보 가져옴(지원자이름 드롭다운)
const selectDependantName = computed(() => {
  const dependant = dependantList.value.find((d) => d.dependant_no == dependantNo.value)
  return dependant?.dependant_name ?? ''
})

// 선택한 지원서번호 받기
const selectApplicationNo = computed(() => {
  return selectedApplicationNo.value ?? ''
})

const guardianId = computed(() => isLogIn.value?.info?.member_id)

const managerName = ref('')
const managerId = ref('')

const dependantList = ref([])
const dependantNo = ref(null)
const applicationNo = ref([])
const selectedApplicationNo = ref(null)

const reservedTimes = ref(new Set())
const blockedTimes = ref(new Set())
const lunchTime = ref('')
const selectedTime = ref('')

// 날짜 범위 (내일부터 2주)
let date = new Date()
const today = new Date(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() + 1}`)
today.setHours(0, 0, 0, 0)

const maxDate = new Date(today)
maxDate.setDate(maxDate.getDate() + 14)

const selectedDate = ref(new Date(today))

// vcalendar - 날짜선택 막기
const disabledDates = computed(() => [
  { start: null, end: new Date(today.getTime() - 1000 * 60 * 60 * 24) },
  { start: new Date(maxDate.getTime()), end: null },
])

// 날짜 포맷
const toYmd = computed(() => {
  const d = selectedDate.value
  if (!d) return ''
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}년 ${mm}월 ${dd}일`
})

const toYmdDash = computed(() => {
  const d = selectedDate.value
  if (!d) return ''
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
})

// 시간 슬롯
const baseSlots = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']

const timeSlots = computed(() =>
  baseSlots.map((t) => {
    const isLunch = lunchTime.value == t
    const isReserved = reservedTimes.value.has(t)
    const isBlocked = blockedTimes.value.has(t)
    return {
      time: t,
      available: !(isLunch || isReserved || isBlocked),
      reason: isLunch ? '점심' : isReserved ? '예약됨' : isBlocked ? '차단' : '',
    }
  }),
)

const selectTime = (slot) => {
  if (!slot.available) return
  selectedTime.value = slot.time
}

const openConfirm = async () => {
  if (!selectedTime.value) return

  const result = await Swal.fire({
    title: '예약 정보 확인',
    html: `
      <div style="font-size:15px; line-height:1.6">
        <b>일정</b> : ${toYmd.value} ${selectedTime.value}<br/>
        <b>보호자</b> : ${isLogIn.value?.info?.member_name}<br/>
        <b>지원자</b> : ${selectDependantName.value}<br/>
        <b>담당자</b> : ${managerName.value}
      </div>
    `,
    icon: 'info',
    showCancelButton: true,
    confirmButtonText: '예약 신청하기',
    cancelButtonText: '취소',
    confirmButtonColor: '#2f55ff',
    cancelButtonColor: '#9ca3af',
  })

  // 사용자가 확인 눌렀을 때만 예약 실행
  if (result.isConfirmed) {
    submitReservation()
  }
}

const submitReservation = async () => {
  if (
    !toYmdDash.value ||
    !selectedTime.value ||
    !guardianId.value ||
    !dependantNo.value ||
    !managerId.value ||
    !selectedApplicationNo.value
  ) {
    await Swal.fire({
      icon: 'warning',
      title: '예약정보가 부족합니다',
      text: '대상자/신청서/날짜/시간을 다시 확인해주세요.',
    })
    return
  }

  const start_at = `${toYmdDash.value} ${selectedTime.value}:00`

  const startDate = new Date(`${toYmdDash.value}T${selectedTime.value}:00`)
  startDate.setHours(startDate.getHours() + 1)

  const yyyy = startDate.getFullYear()
  const mm = String(startDate.getMonth() + 1).padStart(2, '0')
  const dd = String(startDate.getDate()).padStart(2, '0')
  const hh = String(startDate.getHours()).padStart(2, '0')
  const mi = String(startDate.getMinutes()).padStart(2, '0')
  const end_at = `${yyyy}-${mm}-${dd} ${hh}:${mi}:00`

  const resvdata = {
    dependant_no: Number(dependantNo.value),
    application_no: Number(selectedApplicationNo.value),
    guardian_id: String(guardianId.value),
    manager_id: String(managerId.value),
    resv_day: String(toYmdDash.value),
    start_at,
    end_at,
  }

  try {
    const res = await axios.post(`/api/createReservation`, resvdata)

    // 성공 안내(선택)
    await Swal.fire({
      icon: 'success',
      title: '예약 신청 완료!',
      confirmButtonText: '확인',
      confirmButtonColor: '#2f55ff',
    })

    router.push({
      name: 'ReservationGuardianMap',
      query: {
        date: toYmd.value,
        time: selectedTime.value,
        guardian: isLogIn.value?.info?.member_name ?? '',
        dependant: selectDependantName.value,
        manager: managerName.value,
        resvId: res.data?.resvId,
      },
    })
  } catch (e) {
    console.error(e)
    await Swal.fire({
      icon: 'error',
      title: '예약 신청 실패',
      text: '잠시 후 다시 시도해주세요.',
    })
  }
}

// API 호출
const fetchManagerName = async () => {
  if (!dependantNo.value) return
  const mname = await axios.get(`/api/getManagerName/${dependantNo.value}`)
  managerName.value = mname.data.manager_name
  managerId.value = mname.data.manager_id
}

const fetchAvailability = async () => {
  if (!dependantNo.value || !selectedDate.value) return
  const res = await axios.get(`/api/availability/${dependantNo.value}/${toYmdDash.value}`)

  lunchTime.value = res.data.centerLunch ? res.data.centerLunch.slice(0, 5) : ''
  reservedTimes.value = new Set((res.data.reservedTimes ?? []).map((t) => t.slice(0, 5)))
  blockedTimes.value = new Set((res.data.blockedTimes ?? []).map((t) => t.slice(0, 5)))
}

const fetchMyDependants = async () => {
  if (!guardianId.value) return
  const res = await axios.get(`/api/dependants/${guardianId.value}`)
  dependantList.value = res.data ?? []
  dependantNo.value = dependantList.value[0]?.dependant_no ?? null
}

// DatePicker 하이라이트
const calendarAttrs = computed(() => [
  {
    key: 'selected',
    dates: selectedDate.value,
    highlight: { fillMode: 'solid' },
  },
])

const lastSelectedDate = ref(selectedDate.value)

const refreshForDependant = async () => {
  if (!dependantNo.value) return

  await fetchManagerName()

  const appRes = await axios.get(`/api/applicationList/${dependantNo.value}`)
  applicationNo.value = appRes.data ?? []
  selectedApplicationNo.value = applicationNo.value[0]?.application_no ?? null

  await fetchAvailability()
  selectedTime.value = ''
}

// 1) 로그인(guardianId) 들어오면 dependant 목록 가져오기
watch(
  guardianId,
  async (v) => {
    if (!v) return
    await fetchMyDependants()
    // dependantNo가 세팅되면 아래 watch(둘째)가 자동으로 refresh 돌림
  },
  { immediate: true },
)

// 2) dependantNo 또는 selectedDate 바뀌면 한 번에 갱신
watch(
  [dependantNo, selectedDate],
  async ([dno, d]) => {
    if (d === null) {
      selectedDate.value = lastSelectedDate.value
      return
    }
    lastSelectedDate.value = d

    if (!dno || !d) return
    await refreshForDependant()
  },
  { immediate: true },
)
</script>

<template>
  <div class="reserv-page">
    <div class="container-fluid py-4">
      <!-- 상단 이미지 -->
      <div class="row justify-content-center">
        <div class="col-12 col-md-10 col-lg-8 col-xl-7">
          <div class="hero-wrap">
            <img class="hero-img" src="/resvFinal.png" alt="reservation hero" />
          </div>
        </div>
      </div>

      <!--탭바 -->
      <div class="row justify-content-center mt-3">
        <div class="col-12 col-md-10 col-lg-8 col-xl-7">
          <div class="tabbar">
            <button
              class="tab"
              :class="{ active: activeTab === 'reserve' }"
              @click="activeTab = 'reserve'"
            >
              예약하기
            </button>
            <button
              class="tab"
              :class="{ active: activeTab === 'history' }"
              @click="activeTab = 'history'"
            >
              상담내역 확인하기
            </button>
          </div>
        </div>
      </div>

      <!-- 예약하기 탭 -->
      <div v-if="activeTab === 'reserve'">
        <!-- 대상자 / 신청서 선택 -->
        <div class="row justify-content-center mt-3">
          <div class="col-12 col-md-10 col-lg-8 col-xl-7">
            <div class="select-card">
              <div class="row g-3">
                <div class="col-12 col-md-6">
                  <label class="form-label fw-semibold mb-1">대상자 선택</label>
                  <select
                    class="form-select"
                    v-model="dependantNo"
                    :disabled="dependantList.length === 0"
                  >
                    <option
                      v-for="d in dependantList"
                      :key="d.dependant_no"
                      :value="d.dependant_no"
                    >
                      {{ d.dependant_name }}
                    </option>
                  </select>
                </div>

                <div class="col-12 col-md-6">
                  <label class="form-label fw-semibold mb-1">신청서 선택</label>
                  <select
                    class="form-select"
                    v-model="selectedApplicationNo"
                    :disabled="applicationNo.length === 0"
                  >
                    <option
                      v-for="a in applicationNo"
                      :key="a.application_no"
                      :value="a.application_no"
                    >
                      {{ a.application_no }} (신청일 {{ a.application_date?.slice(0, 10) }})
                    </option>
                  </select>
                </div>

                <div class="col-12">
                  <div class="select-summary">
                    <div class="pill">
                      <span class="k">지원자이름</span>
                      <span class="v">{{ selectDependantName }}</span>
                      <span class="dot"></span>
                      <span class="k">신청서번호</span>
                      <span class="v">{{ selectApplicationNo }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!--  날짜 시간 선택, 다음 버튼 -->
        <div class="row justify-content-center mt-3">
          <div class="col-12 col-md-10 col-lg-8 col-xl-7">
            <div class="picked-bar">
              <div class="picked-left">
                <div class="picked-item">
                  <span class="picked-label">선택된 날짜</span>
                  <span class="picked-chip">{{ toYmd }}</span>
                </div>

                <div class="picked-item">
                  <span class="picked-label">선택된 시간</span>
                  <span class="picked-chip">{{ selectedTime || '-' }}</span>
                </div>
              </div>

              <button class="btn-next-white" :disabled="!selectedTime" @click="openConfirm">
                다음
              </button>
            </div>
          </div>
        </div>

        <!-- 달력 시간슬롯 -->
        <div class="row justify-content-center mt-3">
          <div class="col-12 col-md-10 col-lg-8 col-xl-7">
            <div class="grid-2">
              <div class="panel">
                <h6 class="panel-title">날짜 선택</h6>
                <DatePicker
                  v-model="selectedDate"
                  expanded
                  locale="ko"
                  :disabled-dates="disabledDates"
                  :attributes="calendarAttrs"
                />
              </div>

              <div class="panel">
                <h6 class="panel-title">시간 선택</h6>

                <div class="time-grid">
                  <button
                    v-for="slot in timeSlots"
                    :key="slot.time"
                    class="time-btn"
                    :class="{ selected: selectedTime === slot.time, disabled: !slot.available }"
                    :disabled="!slot.available"
                    @click="selectTime(slot)"
                  >
                    {{ slot.time }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 상담내역 탭 -->
      <div v-else class="mt-3">
        <div class="row justify-content-center">
          <div class="col-12 col-md-10 col-lg-8 col-xl-7">
            <ReservationGuardianHistory />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.reserv-page {
  background: #fff;
  min-height: 100vh;
}

/* 상단 이미지 */
.hero-wrap {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #eef1f4;
}

.hero-img {
  width: 100%;
  display: block;
}

/* 탭 */
.tabbar {
  display: flex;
  gap: 28px;
  padding: 0 6px;
  border-bottom: 1px solid #e5e7eb;
  background: transparent;
}

/* 각 탭 */
.tab {
  position: relative;
  border: 0;
  background: transparent;
  padding: 12px 2px;
  font-weight: 700;
  color: #6b7280;
  cursor: pointer;
}

.tab.active {
  color: #2f55ff;
  font-weight: 900;
}

.tab.active::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -1px;
  width: 100%;
  height: 3px;
  background: #2f55ff;
  border-radius: 3px 3px 0 0;
}

/* 대상자 카드 */
.select-card {
  background: #fff;
  border: 1px solid #eef1f4;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 6px 18px rgba(16, 24, 40, 0.06);
}

.select-summary {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 999px;
  background: #f6f8fb;
  border: 1px solid #edf0f3;
}

.pill .k {
  font-size: 12px;
  color: #718096;
}

.pill .v {
  font-weight: 900;
  color: #2d3748;
}

.pill .dot {
  width: 4px;
  height: 4px;
  border-radius: 999px;
  background: #cbd5e0;
}

.picked-bar {
  background: #9fb6ae;
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.picked-left {
  display: flex;
  gap: 26px;
  flex-wrap: wrap;
}

.picked-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fff;
  font-weight: 900;
}

.picked-chip {
  background: rgba(255, 255, 255, 0.18);
  padding: 6px 10px;
  border-radius: 10px;
}

.btn-next-white {
  background: #fff;
  border: none;
  color: #2f55ff;
  font-weight: 900;
  padding: 8px 18px;
  border-radius: 10px;
  min-width: 84px;
}

.btn-next-white:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.panel {
  background: #fff;
  border: 1px solid #eef1f4;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 6px 18px rgba(16, 24, 40, 0.06);
}

.panel-title {
  font-weight: 900;
  margin-bottom: 12px;
}

.time-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.time-btn {
  border: none;
  border-radius: 999px;
  padding: 12px;
  font-weight: 900;
  background: #e9ecef;
  color: #111827;
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

@media (max-width: 992px) {
  .grid-2 {
    grid-template-columns: 1fr;
  }
}
</style>
