<!-- components/ReservationTable.vue -->
<!-- 하단 승인대기중상담예약 섹션 -->
<script setup>
import { ref } from 'vue'
import ConfirmModal from './modal/ConfirmModal.vue'
import RejectReasonModal from './modal/RejectReasonModal.vue'

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
              <th class="text-secondary opacity-7">상태변경</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="r in pendingReservedList" :key="r.resv_id">
              <td>
                <h6 class="mb-0 text-sm">{{ r.guardian_name }}</h6>
              </td>
              <td>
                <p class="text-xs font-weight-bold mb-0">{{ r.dependant_name }}</p>
              </td>

              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">
                  {{ r.start_at.slice(0, 10) }}
                </span>
              </td>

              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">
                  {{ statusText(r.resv_status) }}
                </span>
              </td>

              <td class="align-middle text-center">
                {{ timeText(r.start_at) }}
              </td>

              <td class="align-middle">
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
