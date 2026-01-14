<!-- src/components/ReservationCright.vue -->
<!-- 자식 -->
<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import RejectReasonModal from '../modals/RejectReasonModal.vue'

const router = useRouter()
// const route = useRoute() // 0108
// const meetingLog = useMeetingLogStore()

const props = defineProps({
  selectedDate: { type: Date, required: true }, //부모가 무조건 selectedDate를 내려줘야 함
  reservations: { type: Array, default: () => [] },
  managerId: { type: String, required: true },
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

const statusMap = {
  f1: { label: '확인중', btnClass: 'status-wait' },
  f2: { label: '예약확정', btnClass: 'status-confirm' },
  f3: { label: '상담완료', btnClass: 'status-done' },
  f4: { label: '상담취소', btnClass: 'status-cancel' },
}

// 날짜 지나면 f2 → f3 자동변경 (중요: statusInfo는 "표시용"으로만)
const normalizeStatus = async (r) => {
  const today = new Date()
  if (today > new Date(r.resv_day) && r.status === 'f2') {
    await axios.put('/api/updateRstatus', {
      resvId: r.resv_id,
      managerId: r.manager_id,
      resvStatus: 'f3',
      rejectReason: null,
    })
    r.status = 'f3'
  }
}

const statusInfo = (r) =>
  statusMap[r.status] ?? { label: r.status ?? '', btnClass: 'status-default' }

const showCancelModal = ref(false)
const cancelTarget = ref(null)

const openCancelModal = (row) => {
  cancelTarget.value = row
  showCancelModal.value = true
}

const closeCancelModal = () => {
  showCancelModal.value = false
  cancelTarget.value = null
}

const onCancelConfirm = async (reason) => {
  if (!cancelTarget.value) return

  await axios.put('/api/updateRstatus', {
    resvId: cancelTarget.value.resv_id,
    managerId: cancelTarget.value.manager_id,
    resvStatus: 'f4',
    rejectReason: reason,
  })

  cancelTarget.value.status = 'f4'
  closeCancelModal()
}

watch(
  () => props.reservations,
  (list) => {
    if (!list) return
    list.forEach((r) => {
      normalizeStatus(r)
    })
  },
  { immediate: true },
)

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
              <th class="text-center text-primary">예약취소</th>

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
                <div class="cell-center">
                  <button
                    class="btn btn-outline-danger btn-sm text-xs"
                    :disabled="r.status !== 'f2'"
                    @click="openCancelModal(r)"
                  >
                    취소하기
                  </button>
                </div>
              </td>

              <td class="align-middle text-center">
                <div class="cell-center">
                  <button
                    type="button"
                    class="btn btn-sm text-xs status-btn"
                    :class="statusInfo(r).btnClass"
                    disabled
                  >
                    {{ statusInfo(r).label }}
                  </button>
                </div>
              </td>

              <td class="align-middle text-center">
                <div class="cell-center">
                  <button
                    class="btn btn-primary btn-sm text-xs"
                    @click="writingMeeting(r.application_no)"
                  >
                    작성하기
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <RejectReasonModal
          :show="showCancelModal"
          title="예약 취소 사유 작성"
          placeholder="취소 사유를 입력해주세요."
          @cancel="closeCancelModal"
          @confirm="onCancelConfirm"
        />
      </div>
    </div>
  </div>
</template>
<style>
.table .btn-outline-danger.btn-sm {
  padding: 6px 8px !important; /* 좌우 padding 줄이기 */
  min-width: auto !important; /* Bootstrap 기본 min-width 제거 */
  width: auto !important; /* 글자 길이만큼만 */
}
.cell-center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.btn-primary {
  padding: 6px 15px !important;
}

/* 상태버튼 공통 */
.status-btn {
  min-width: 88px;
  font-weight: 700;
  border: 0 !important;
  background: transparent;
  padding: 6px 8px !important;
}

.status-btn:disabled {
  opacity: 1;
}

.status-wait {
  background-color: #a2d1ff !important;
  color: rgb(0, 78, 194) !important;
}

.status-confirm {
  background-color: #198754 !important;
  color: #fff !important;
}

.status-done {
  background-color: #212529 !important;
  color: #fff !important;
}

.status-cancel {
  background-color: #dc3545 !important;
  color: #fff !important;
}

.status-default {
  background-color: #ebebeb !important;
  color: #333 !important;
}
/* ===== 액션 버튼 통일 ===== */

/* 취소하기 → 메인컬러 아웃라인 */
.table .btn-outline-danger.btn-sm {
  border: 1px solid #4e93cb !important;
  color: #4e93cb !important;
  background: transparent !important;
  padding: 5px 10px !important;
  border-radius: 4px !important;
  font-weight: 700;
}

.table .btn-outline-danger.btn-sm:hover {
  background: rgba(78, 147, 203, 0.08) !important;
}

/* 작성하기 → 메인컬러 채움 */
.table .btn-primary.btn-sm {
  background: #4e93cb !important;
  border: 1px solid #4e93cb !important;
  color: #fff !important;
  padding: 5px 12px !important;
  border-radius: 4px !important;
  font-weight: 800;
}

.table .btn-primary.btn-sm:hover {
  filter: brightness(0.95);
}

/* ===== 상태 배지 ===== */

.status-btn {
  min-width: auto !important;
  padding: 5px 10px !important;
  border-radius: 999px !important;
  font-weight: 800 !important;
  font-size: 0.75rem !important;
}

/* 확인중 (대기) */
.status-wait {
  background: #e8f4ff !important;
  color: #2b6cb0 !important;
  border: 1px solid #cfe8ff;
}

/* 예약확정 */
.status-confirm {
  background: #ecfdf5 !important;
  color: #065f46 !important;
  border: 1px solid #a7f3d0;
}

/* 상담완료 */
.status-done {
  background: #f3f4f6 !important;
  color: #374151 !important;
  border: 1px solid #e5e7eb;
}

/* 상담취소 */
.status-cancel {
  background: #fef2f2 !important;
  color: #991b1b !important;
  border: 1px solid #fecaca;
}

.table .btn-outline-danger.btn-sm:disabled {
  border: 1px solid #cbd5e1 !important;
  color: #94a3b8 !important;
  background: #f8fafc !important;
  cursor: not-allowed !important;
  opacity: 1 !important; /* 흐리기 대신 명확한 비활성톤 */
}
</style>
