<!-- views/ReservationGuardian.vue -->
<script setup>
import { ref, computed, watch } from 'vue'
import { DatePicker } from 'v-calendar'
import 'v-calendar/style.css'
import axios from 'axios'

import { useCounterStore } from '@/stores/member'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

//피니아 로그인정보
const counterStore = useCounterStore()
const { isLogIn } = storeToRefs(counterStore)

//==========================================================================
//다음 버튼 누르면 예약확인 페이지로 넘어가기
//==========================================================================
const router = useRouter() //★괄호 빼먹지말기.

//다음 버튼 누르면서 정보 같이 넘겨야함
const goNext = () => {
  router.push({
    name: 'ReservationGuardianConfirm',
    query: {
      date: toYmd.value, //캘린더에서 선택한 날짜
      time: selectedTime.value, //타임슬롯에서 선택한 시간

      applicationNo: selectedApplicationNo.value,

      //DB저장
      resv_day: toYmdDash.value,
      guardianId: guardianId.value,
      managerId: managerId.value,
      dependantNo: dependantNo.value,

      //front
      name: isLogIn.value?.info?.member_name ?? '',
      dependant: selectDependantName.value, //드롭다운에서 고른 지원자 이름 같이 넘기기 - isLogIn에서 당연히 안꺼내짐.
      manager: managerName.value,
    },
  })
}

//보호자의 지원자정보 가져옴(지원자이름 드롭다운)
const selectDependantName = computed(() => {
  const dependant = dependantList.value.find((d) => d.dependant_no == dependantNo.value)
  return dependant?.dependant_name ?? ''
})

//선택한 지원서번호 받기
const selectApplicationNo = computed(() => {
  return selectedApplicationNo.value ?? ''
})

//================================================================

const guardianId = computed(() => isLogIn.value?.info?.member_id)

const managerName = ref('') //담당자 이름
const managerId = ref('') //담당자 이름

const dependantList = ref([])
const dependantNo = ref(null)
const applicationNo = ref([]) //목록
const selectedApplicationNo = ref(null) //선택값

const reservedTimes = ref(new Set())
const blockedTimes = ref(new Set())
const lunchTime = ref('')
const selectedTime = ref('')

// ========================
// 날짜 범위 (내일부터 2주)
// ========================
let date = new Date()
const today = new Date(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() + 1}`)
today.setHours(0, 0, 0, 0)

const maxDate = new Date(today)
maxDate.setDate(maxDate.getDate() + 14)

const selectedDate = ref(new Date(today))

//vcalendar - 날짜선택 막기
const disabledDates = computed(() => [
  { start: null, end: new Date(today.getTime() - 1000 * 60 * 60 * 24) },
  { start: new Date(maxDate.getTime()), end: null },
])

// ========================
// 날짜 포맷
// ========================
// 프론트 표시용
const toYmd = computed(() => {
  const d = selectedDate.value
  if (!d) return ''
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}년 ${mm}월 ${dd}일`
})

//DB에 넘기는 용
const toYmdDash = computed(() => {
  const d = selectedDate.value
  if (!d) return ''
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
})

// 시간 슬롯 설정
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

// ========================
// API 호출
// ========================
//담당자 이름 goNext로 같이 넘기기
const fetchManagerName = async () => {
  if (!dependantNo.value) return

  const mname = await axios.get(`/api/getManagerName/${dependantNo.value}`)
  //console.log(mname)
  managerName.value = mname.data.manager_name
  managerId.value = mname.data.manager_id
  console.log(managerName, managerId)
}

//예약가능한 담당자 시간 불러오기
const fetchAvailability = async () => {
  if (!dependantNo.value || !selectedDate.value) return

  const res = await axios.get(`/api/availability/${dependantNo.value}/${toYmdDash.value}`)

  lunchTime.value = res.data.centerLunch ? res.data.centerLunch.slice(0, 5) : ''
  reservedTimes.value = new Set((res.data.reservedTimes ?? []).map((t) => t.slice(0, 5)))
  blockedTimes.value = new Set((res.data.blockedTimes ?? []).map((t) => t.slice(0, 5)))
}

//담당자의ID로 지원자정보 불러오기
const fetchMyDependants = async () => {
  if (!guardianId.value) return
  const res = await axios.get(`/api/dependants/${guardianId.value}`)
  dependantList.value = res.data ?? []
  dependantNo.value = dependantList.value[0]?.dependant_no ?? null
}

// DatePicker 캘린더 하이라이트
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

// 로그인 정보 들어오면 드롭다운에 dependant 리스트 가져오기
watch(
  guardianId,
  async () => {
    await fetchMyDependants()
    selectedTime.value = ''
    await fetchAvailability()
  },
  { immediate: true },
)

//드롭다운에서 dependant바뀌면 매니저정보 바뀌게
watch(
  dependantNo,
  async () => {
    await fetchManagerName()
  },
  { immediate: true },
)

//드롭다운에서 dependant바뀌면 application 바뀌게
watch(
  dependantNo,
  async (ano) => {
    if (!ano) return
    const res = await axios.get(`/api/applicationList/${ano}`)
    applicationNo.value = res.data
  },
  { immediate: true },
)

const goReservHistory = () => {
  router.push({
    name: 'ReservationGuardianHistory',
  })
}
</script>

<template>
  <div class="py-4 container-fluid">
    <div class="row mb-3">
      <div class="col-12 d-flex justify-content-start">
        <button class="btn btn-outline-primary btn-sm" @click="goReservHistory">
          상담예약 확인하기
        </button>
      </div>
    </div>
    <!-- 대상자 + 신청서 -->
    <div class="py-4 container-fluid">
      <!-- 대상자 + 신청서 -->
      <div class="row justify-content-center mb-3">
        <div class="col-12 col-md-10 col-lg-7 col-xl-6">
          <div class="card p-3 shadow-sm">
            <!-- 2칸 레이아웃 - 왼쪽/오른쪽 -->
            <div class="row g-3">
              <!-- 왼쪽: 지원자 선택  -->
              <div class="col-12 col-md-6">
                <div class="field">
                  <div class="d-flex align-items-end justify-content-between mb-1">
                    <label class="form-label fw-semibold field-label mb-0">대상자 선택</label>

                    <div class="small text-muted" v-if="dependantList.length === 0">
                      대상자 정보가 없습니다.
                    </div>
                  </div>

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
              </div>

              <!-- 오른쪽: 신청서 선택 -->
              <div class="col-12 col-md-6">
                <div class="field">
                  <label class="form-label fw-semibold field-label mb-1 text-nowrap"
                    >신청서 선택</label
                  >
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
                      {{ a.application_no }} (신청일 {{ a.application_date.slice(0, 10) }} )
                    </option>
                  </select>
                </div>
              </div>

              <!-- 하단: 중앙 정렬 (가로) -->
              <div class="col-12">
                <div class="info-center-wrap">
                  <div class="info-pill">
                    <span class="text-muted small">지원자이름 </span>
                    <span class="fw-semibold">{{ selectDependantName }}</span>
                    <span class="divider"></span>
                    <span class="text-muted small">신청서번호</span>
                    <span class="fw-semibold">{{ selectApplicationNo }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
              <div class="fw-semibold">{{ toYmd }}</div>
            </div>

            <button class="btn btn-primary btn-sm" :disabled="!selectedTime" @click="goNext">
              다음
            </button>
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

.info-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
</style>
