<!-- views/ManagerScheduleBlock.vue -->
<script setup>
import { ref, computed, watch } from 'vue'
import { DatePicker } from 'v-calendar'
import 'v-calendar/style.css'
import axios from 'axios'

import { useCounterStore } from '@/stores/member'
import { storeToRefs } from 'pinia'

const counterStore = useCounterStore()
const { isLogIn } = storeToRefs(counterStore)
const managerId = computed(() => isLogIn.value?.info?.member_id)

const selectedDate = ref(new Date())
const lastSelectedDate = ref(selectedDate.value)

const lunchTime = ref('') // "12:00"
const reservedTimes = ref(new Set())
const blockedTimes = ref(new Set())

//날짜선택 - 오늘부터 2주간.
const today = new Date()
today.setHours(0, 0, 0, 0)

const maxDate = new Date(today)
maxDate.setDate(maxDate.getDate() + 14)

const disabledDates = computed(() => [
  { start: null, end: new Date(today.getTime() - 1000 * 60 * 60 * 24) },
  { start: new Date(maxDate.getTime()), end: null },
])

// 날짜 포맷
const dateLabel = computed(() => {
  const d = selectedDate.value
  if (!d) return ''
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
})

const toYmdDash = computed(() => {
  const d = selectedDate.value
  if (!d) return ''
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
})

const baseSlots = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']

const slots = computed(() =>
  baseSlots.map((t) => {
    const isLunch = lunchTime.value === t
    const isReserved = reservedTimes.value.has(t)
    const isBlocked = blockedTimes.value.has(t)

    const locked = isLunch || isReserved

    let state = 'open'
    if (isLunch) state = 'lunch'
    else if (isReserved) state = 'reserved'
    else if (isBlocked) state = 'blocked'

    return {
      time: t,
      state,
      locked,
      hint:
        state === 'lunch'
          ? '점심'
          : state === 'reserved'
            ? '예약됨'
            : state === 'blocked'
              ? '차단됨'
              : '',
    }
  }),
)

const blockedList = computed(() => Array.from(blockedTimes.value).sort())

// Guardian fetchAvailability 패턴 그대로
const fetchAvailabilityByManager = async () => {
  if (!managerId.value || !selectedDate.value) return

  try {
    const res = await axios.get(`/api/managerAvailability/${managerId.value}/${toYmdDash.value}`)

    lunchTime.value = res.data.centerLunch ? String(res.data.centerLunch).slice(0, 5) : ''
    reservedTimes.value = new Set((res.data.reservedTimes ?? []).map((t) => String(t).slice(0, 5)))
    blockedTimes.value = new Set((res.data.blockedTimes ?? []).map((t) => String(t).slice(0, 5)))
  } catch (e) {
    console.log('fetchAvailabilityByManager error:', e)
    // 실패해도 화면이 깨지지 않게 초기화
    lunchTime.value = ''
    reservedTimes.value = new Set()
    blockedTimes.value = new Set()
  }
}

watch(
  [selectedDate, managerId],
  async ([d, mid]) => {
    // v-calendar가 같은 날짜 다시 누르면 null 될 수 있음
    if (d === null) {
      selectedDate.value = lastSelectedDate.value
      return
    }

    lastSelectedDate.value = d

    if (!d || !mid) return
    await fetchAvailabilityByManager()
  },
  { immediate: true },
)

// 토글(차단/해제)
// 클릭하면 바로 DB에 저장/삭제 후 다시 조회
const toggleBlock = async (slot) => {
  if (slot.locked) return
  if (!managerId.value) return

  const date = toYmdDash.value
  const time = slot.time

  try {
    // 1) 이미 차단된 상태면 => 삭제(해제)
    if (blockedTimes.value.has(time)) {
      await axios.delete('/api/scheduleBlock', {
        data: { managerId: managerId.value, date, time },
      })
    } else {
      // 2) 차단 안 된 상태면 => 저장(차단)
      await axios.post('/api/scheduleBlock', {
        managerId: managerId.value,
        date,
        time,
      })
    }

    await fetchAvailabilityByManager()
  } catch (e) {
    console.log('toggleBlock error:', e)
    alert('차단 변경에 실패했습니다.')
  }
}

const clearDayBlocks = async () => {
  if (!managerId.value) return
  const date = toYmdDash.value

  try {
    for (const time of blockedList.value) {
      await axios.delete('/api/scheduleBlock', {
        data: { managerId: managerId.value, date, time },
      })
    }

    await fetchAvailabilityByManager()
  } catch (e) {
    console.log('clearDayBlocks error:', e)
    alert('전체 해제에 실패했습니다.')
  }
}

const calendarAttrs = computed(() => [
  { key: 'selected', dates: selectedDate.value, highlight: { fillMode: 'solid' } },
])
</script>

<template>
  <div class="py-4 container-fluid">
    <div class="row g-4">
      <div>
        <button class="btn btn-warning btn-lg fs-6" @click="$router.back()">← 뒤로가기</button>   
      </div>
      <!-- 좌: 달력 -->
      <div class="col-12 col-lg-5">
        <div class="card p-3 h-100 shadow-sm">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <div>
              <h6 class="mb-1">상담 가능시간 설정 (차단)</h6>
              <div class="small text-muted">날짜를 선택하고 시간 버튼을 눌러 차단/해제하세요.</div>
            </div>
            <div class="small text-muted">~ {{ maxDate.toLocaleDateString('ko-KR') }}</div>
          </div>

          <DatePicker
            v-model="selectedDate"
            expanded
            locale="ko"
            :disabled-dates="disabledDates"
            :attributes="calendarAttrs"
          />

          <div class="mt-3 small text-muted">
            * 점심시간/예약된 시간은 잠금 처리되어 변경할 수 없습니다.
          </div>
        </div>
      </div>

      <!-- 우 -->
      <div class="col-12 col-lg-7">
        <div class="card p-3 shadow-sm">
          <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
            <div class="d-flex align-items-center gap-2">
              <h6 class="mb-0">선택 날짜</h6>
              <span class="fw-semibold">{{ dateLabel }}</span>
            </div>

            <div class="d-flex align-items-center gap-2">
              <button
                class="btn btn-outline-danger btn-sm"
                :disabled="blockedList.length === 0"
                @click="clearDayBlocks"
              >
                차단 전체해제
              </button>
            </div>
          </div>

          <div class="legend mb-3">
            <span class="legend-item"><span class="legend-dot dot-open"></span> 가능</span>
            <span class="legend-item"
              ><span class="legend-dot dot-blocked"></span> 차단됨(클릭하면 해제)</span
            >
            <span class="legend-item"
              ><span class="legend-dot dot-reserved"></span> 예약됨(잠금)</span
            >
            <span class="legend-item"><span class="legend-dot dot-lunch"></span> 점심(잠금)</span>
          </div>

          <div class="slot-grid">
            <button
              v-for="s in slots"
              :key="s.time"
              class="slot-btn"
              :class="[
                s.state === 'open' && 'is-open',
                s.state === 'blocked' && 'is-blocked',
                s.state === 'reserved' && 'is-reserved',
                s.state === 'lunch' && 'is-lunch',
              ]"
              :disabled="s.locked"
              @click="toggleBlock(s)"
              type="button"
            >
              <div class="slot-time">{{ s.time }}</div>
              <div class="slot-hint" v-if="s.hint">{{ s.hint }}</div>
            </button>
          </div>

          <!-- 선택 날짜 차단 목록 -->
          <div class="mt-3">
            <div class="d-flex align-items-center justify-content-between">
              <div class="fw-semibold">선택 날짜 차단 목록</div>
              <div class="small text-muted">{{ blockedList.length }}건</div>
            </div>

            <div v-if="blockedList.length === 0" class="mt-2 text-muted small">
              차단된 시간이 없습니다.
            </div>

            <div v-else class="mt-2 d-flex flex-wrap gap-2">
              <span
                v-for="t in blockedList"
                :key="t"
                class="badge bg-danger-subtle text-danger border"
              >
                {{ t }}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 범례 */
.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: #666;
}
.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 99px;
  display: inline-block;
}
.dot-open {
  background: #e9ecef;
  border: 1px solid #cfd4da;
}
.dot-blocked {
  background: #dc3545;
}
.dot-reserved {
  background: #6c757d;
}
.dot-lunch {
  background: #adb5bd;
}

/* 슬롯 */
.slot-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.slot-btn {
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 12px 10px;
  background: #fff;
  text-align: center;
  transition:
    transform 0.05s ease,
    box-shadow 0.12s ease;
  min-height: 64px;
}

.slot-btn:active {
  transform: scale(0.99);
}
.slot-btn:disabled {
  cursor: not-allowed;
  opacity: 0.75;
}

/* 상태별 스타일 */
.is-open {
  background: #f8f9fa;
}
.is-open:hover {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
}

.is-blocked {
  background: #dc3545;
  color: #fff;
  border-color: #dc3545;
}
.is-blocked:hover {
  box-shadow: 0 2px 14px rgba(220, 53, 69, 0.25);
}

.is-reserved {
  background: #6c757d;
  color: #fff;
  border-color: #6c757d;
}

.is-lunch {
  background: #adb5bd;
  color: #fff;
  border-color: #adb5bd;
}

.slot-time {
  font-weight: 800;
  font-size: 1.02rem;
}
.slot-hint {
  font-size: 0.82rem;
  opacity: 0.9;
  margin-top: 2px;
}
</style>
