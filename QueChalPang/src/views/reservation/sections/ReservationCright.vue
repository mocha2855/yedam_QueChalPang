<!-- src/components/ReservationCright.vue -->
<!-- 자식 -->
<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
// import { useMeetingLogStore } from '@/stores/meetingLog'

const router = useRouter()
// const route = useRoute() // 0108
// const meetingLog = useMeetingLogStore()

const props = defineProps({
  selectedDate: { type: Date, required: true }, //부모가 무조건 selectedDate를 내려줘야 함
  reservations: { type: Array, default: () => [] },
})

// 선택한 날짜표시
const selectedLabel = computed(() =>
  props.selectedDate ? props.selectedDate.toLocaleDateString() : '',
)

//시간값 변환하기 꼭필요!!
const timeText = (start_at) => {
  if (!start_at) return ''
  const d = new Date(start_at)

  //toLocaleTimeString : 지역규칙 이용해 시간문자열 만듦
  return d.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

//예약상태 변환하고 클래스주기
const statusMap = {
  f1: { label: '확인중', class: 'status-wait' },
  f2: { label: '예약확정', class: 'status-confirm' },
  f3: { label: '상담완료', class: 'status-done' },
  f4: { label: '상담취소', class: 'status-cancel' },
}

// 현재 날짜 기점으로 상태 변화 -0108
// 날짜 변경
const statusInfo = (r) => {
  console.log(r)

  let today = new Date()
  console.log(today > new Date(r.resv_day) && r.status == 'f2')
  if (today > new Date(r.resv_day) && r.status == 'f2') {
    axios.put('/api/updateRstatus/', {
      resvId: r.resv_id,
      managerId: r.manager_id,
      resvStatus: 'f3',
      rejectReason: null,
    })
  }
  return statusMap[r.status] ?? { label: r.status ?? '', class: 'status-default' }
}

// 상담내역 작성하러가기 - 0108
const writingMeeting = (data) => {
  // meetingLog.fetchByAppNo(route.params.id)
  // meetingLog.logs.forEach((data) => {
  //   if (data.resv_no == id) {
  //     if (data.has_meeting_log === 1) {
  //       meetingLog.fetchDetailByResvId(data.resv_id)
  //     } else {
  //       meetingLog.startWrite(data)
  //     }
  //   }
  // })

  router.push({ name: 'meetingLog', params: { id: data } })
}
</script>

<template>
  <div class="card p-3 h-100">
    <div class="card-header pb-0">
      <h6>{{ selectedLabel }}</h6>
    </div>

    <div class="card-body px-0 pt-0 pb-2">
      <div v-if="reservations.length === 0" class="px-3 py-3 text-muted">
        해당 날짜에 예약이 없습니다.
      </div>

      <div v-else class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th class="text-center text-primary">보호자</th>
              <th class="text-center text-primary">지원자</th>
              <th class="text-center text-primary">상담시작시간</th>
              <th class="text-center text-primary">상태</th>
              <th class="text-center text-primary">일지</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="r in reservations" :key="r.resv_id ?? r.start_at">
              <td class="align-middle text-center text-sm">
                <span class="text-xs font-weight-bold text-dark mb-0">{{ r.guardian_name }}</span>
              </td>

              <td class="align-middle text-center text-sm">
                <span class="text-xs font-weight-bold text-dark">{{ r.dependant_name }}</span>
              </td>

              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold text-dark">
                  {{ timeText(r.start_at) }}
                </span>
              </td>

              <td class="align-middle text-center">
                <span class="status-badge" :class="statusInfo(r).class">
                  {{ statusInfo(r).label }}
                </span>
              </td>
              <!-- 0108 상담내역 작성하기 추가 -->
              <td class="align-middle text-center">
                <button class="btn btn-primary text-xs" @click="writingMeeting(r.application_no)">
                  작성하기
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<style>
.status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
  text-align: center;
  min-width: 72px;
}

.status-wait {
  background-color: #a2d1ff;
  color: rgb(0, 78, 194);
}

.status-confirm {
  background-color: #198754;
}

.status-done {
  background-color: #212529;
}

.status-cancel {
  background-color: #dc3545;
}

.status-default {
  background-color: #ebebeb;
}
</style>
