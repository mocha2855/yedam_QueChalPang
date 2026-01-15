<!-- components/ReservationTable.vue -->
<!-- 하단 승인대기중상담예약 섹션 -->
<script setup>
import { ref } from 'vue'
import ConfirmModal from '../modals/ConfirmModal.vue'
import RejectReasonModal from '../modals/RejectReasonModal.vue'

const { pendingReservedList } = defineProps({
  pendingReservedList: { type: Array, required: true },
})

//accept를 부모한테(ResersavionTeacher.vue) 보내게 해줌.
const emit = defineEmits(['accept', 'reject'])

const timeText = (start_at) => {
  if (!start_at) return ''
  const d = new Date(start_at)
  return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })
}

const statusMap = { f1: '확인중' }
const statusText = (status) => statusMap[status] ?? status ?? ''

const selectedRow = ref(null)
const showConfirm = ref(false)
const showReject = ref(false)

//수락 버튼 클릭하면 모달창 실행
//매개변수 row : 테이블 한 줄의 데이터 -> resv_id, guardian_name, ...
const openAcceptModal = (row) => {
  selectedRow.value = row
  showConfirm.value = true
}

const confirmAccept = () => {
  emit('accept', selectedRow.value)
  closeModal()
}

//반려버튼
const openRejectModal = (row) => {
  selectedRow.value = row
  showReject.value = true
}

const confirmReject = (reason) => {
  emit('reject', { row: selectedRow.value, reason })
  closeModal()
}

const closeModal = () => {
  selectedRow.value = null
  showConfirm.value = false
  showReject.value = false
}
</script>

<template>
  <div class="card">
    <div class="card-header pb-0">
      <h6>승인 대기 중인 상담예약</h6>
    </div>

    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th class="text-secondary opacity-7">보호자</th>
              <th class="text-secondary opacity-7">지원자</th>
              <th class="text-secondary opacity-7">예약 날짜</th>
              <th class="text-secondary opacity-7">예약 상태</th>
              <th class="text-secondary opacity-7">상담 시간</th>
              <th class="text-secondary opacity-7 px-6">상태변경</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="r in pendingReservedList" :key="r.resv_id">
              <td>
                <h6 class="mb-0 mx-3 text-sm">{{ r.guardian_name }}</h6>
              </td>
              <td>
                <h6 class="mb-0 mx-3 text-sm">{{ r.dependant_name }}</h6>
              </td>

              <td>
                <h6 class="mb-0 mx-3 text-sm">
                  {{ r.start_at.slice(0, 10) }}
                </h6>
              </td>

              <td>
                <h6 class="mb-0 mx-3 px-2 text-sm">
                  {{ statusText(r.resv_status) }}
                </h6>
              </td>

              <td>
                <h6 class="mb-0 mx-3 px-2 text-sm">
                  {{ timeText(r.start_at) }}
                </h6>
              </td>

              <td>
                <button class="btn btn-success btn-sm me-2" v-on:click="openAcceptModal(r)">
                  <!-- openAcceptModel(r)의 r은 현재 클릭한 행의 데이터들.  -->
                  수락
                </button>
                <button class="btn btn-danger btn-sm" v-on:click="openRejectModal(r)">반려</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- emit('confirm')이 호출되면 confirmAccept함수 실행 -->
  <ConfirmModal
    :show="showConfirm"
    message="예약을 확정하시겠습니까?"
    v-on:confirm="confirmAccept"
    v-on:cancel="closeModal"
  />

  <RejectReasonModal
    :show="showReject"
    title="예약신청 반려 사유 작성"
    v-on:confirm="confirmReject"
    v-on:cancel="closeModal"
  />
</template>
<style scoped>
.btn-success {
  border-radius: 2px !important;
  background-color: #4e93cb !important;
}

.btn-danger {
  border-radius: 2px !important;
  background-color: #e87b86 !important;
}

.card-header h6 {
  font-size: 0.95rem;
  font-weight: 700;
  color: #344767;
  margin: 0;
}

/* 테이블 헤더 */
.table thead th {
  font-size: 0.75rem;
  font-weight: 600;
  color: #8392ab;
  text-transform: none;
  letter-spacing: -0.2px;
  padding: 0.9rem 1rem;
  white-space: nowrap;
  border-bottom: 1px solid #e9ecef;
}

/* 테이블 바디 */
.table tbody td {
  padding: 0.85rem 1rem;
  vertical-align: middle;
  border-top: 1px solid #f1f3f5;
  font-size: 0.875rem;
  color: #344767;
}

/* 보호자(왼쪽 첫 컬럼) */
.table tbody td h6 {
  font-size: 0.9rem;
  font-weight: 700;
  color: #344767;
  margin: 0;
  line-height: 1.2;
}

/* 지원자 */
.table tbody td p {
  font-size: 0.8rem;
  font-weight: 600;
  color: #344767;
  margin: 0;
  line-height: 1.2;
}

/* 날짜/상태 텍스트(중앙 정렬 칸) */
.table tbody td .text-secondary {
  font-size: 0.8rem !important;
  font-weight: 600 !important;
  color: #67748e !important;
}

/* 상담 시간 */
.table tbody td:nth-child(5) {
  font-size: 0.85rem;
  font-weight: 700;
  color: #344767;
  text-align: center;
  white-space: nowrap;
}

/* 상태변경 버튼 영역 정렬 */
.table tbody td:last-child {
  text-align: center;
  white-space: nowrap;
}

/* 버튼 크기/모양 통일 */
.table tbody .btn.btn-sm {
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.45rem 0.9rem;
  /* border-radius: 0.6rem; */
  box-shadow: none;
}

.table tbody .btn + .btn {
  margin-left: 0.5rem;
}

.table tbody .btn:hover {
  transform: translateY(-1px);
  transition: transform 0.12s ease;
}

.table-responsive {
  overflow-x: auto;
}
.table {
  min-width: 720px;
}
</style>
