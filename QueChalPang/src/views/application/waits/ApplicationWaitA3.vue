<!-- a3인 관리자 컴포넌트 , 대기단계 승인/반려 -->
<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useApplicationStore } from '@/stores/application'

// 모달 컴포넌트들
import ConformModal from '../modals/ConfirmModal.vue'
import StatusReasonModal from '../modals/StatusReasonModal.vue'

const application = useApplicationStore()
const route = useRoute()

// 모달 열고닫기 상태들
const showApproveModal = ref(false) // 승인 확인 모달
const showRejectConfirm = ref(false) // "정말 반려?" 확인 모달
const showRejectReason = ref(false) // 반려사유 입력 모달
const rejectReason = ref('') // textarea 내용

// DB에서 온 상태들
const currentStatus = computed(() => application.dependantInfo?.status ?? null) // e3/e4/e5
const statusStatus = computed(() => application.dependantInfo?.status_status ?? null) // i1/i2/i3
const dependantName = computed(() => application.dependantInfo?.dependant_name ?? '')
const statusLabel = computed(() => application.dependantInfo?.status_text ?? '')

// 승인 대기중(i1) + 요청된 단계가 e3/e4/e5 중 하나일 때만 화면 보여줌
const hasPending = computed(
  () => statusStatus.value === 'i1' && ['e3', 'e4', 'e5'].includes(currentStatus.value),
)

// 승인 모달에서 보여줄 문구
const approveMessage = computed(() =>
  statusLabel.value
    ? `해당 지원자의 대기단계를 '<b>${statusLabel.value}</b>' 로 승인하시겠습니까?`
    : '승인할 대기단계가 없습니다.',
)

// ====== 승인 흐름 ======
const openApprove = () => {
  if (!['e3', 'e4', 'e5'].includes(currentStatus.value)) {
    alert('요청된 대기단계가 없습니다.')
    return
  }
  showApproveModal.value = true
}

const confirmApprove = async () => {
  await application.approveWaitStatus(route.params.id)
  showApproveModal.value = false
}

const cancelApprove = () => {
  showApproveModal.value = false
}

// ====== 반려 흐름 ======
// 1) 버튼 클릭 → "정말 반려?" 모달
const openReject = () => {
  showRejectConfirm.value = true
}

const cancelRejectConfirm = () => {
  showRejectConfirm.value = false
}

// 2) "반려" 확인 → 사유 입력 모달로 이동
const goRejectReason = () => {
  showRejectConfirm.value = false
  rejectReason.value = ''
  showRejectReason.value = true
}

// 3) textarea에서 저장
const saveRejectReason = async (reasonFromChild) => {
  const finalReason = (reasonFromChild ?? rejectReason.value).trim()

  if (!finalReason) {
    alert('반려사유를 입력해주세요.')
    return
  }

  await application.rejectWaitStatus(route.params.id, finalReason)
  showRejectReason.value = false
}

const cancelRejectReason = () => {
  showRejectReason.value = false
}

const isApproved = computed(
  () => ['e3', 'e4', 'e5'].includes(currentStatus.value) && statusStatus.value === 'i2',
)
</script>

<template>
  <!-- 승인 대기중일 때만 동그라미 UI -->
  <div v-if="hasPending" class="wait-wrap">
    <p class="wait-title">
      <b>{{ dependantName }}</b> 님의<br />
      대기단계를 승인해주세요.
    </p>

    <div class="wait-circles">
      <button
        v-for="s in ['계획', '중점', '긴급']"
        :key="s"
        class="circle"
        :class="{
          active:
            (s === '계획' && currentStatus === 'e3') ||
            (s === '중점' && currentStatus === 'e4') ||
            (s === '긴급' && currentStatus === 'e5'),
        }"
        type="button"
        disabled
      >
        {{ s }}
      </button>
    </div>

    <p v-if="statusLabel" class="confirm-text">
      해당 지원자의 대기단계를 <b>{{ statusLabel }}</b> 로 승인하시겠습니까?
    </p>

    <div class="actions">
      <button class="btn-request" @click="openApprove">승인</button>
      <button class="btn-cancel" @click="openReject">반려</button>
    </div>

    <!--  승인 확인 모달 -->
    <ConformModal
      :show="showApproveModal"
      :message="approveMessage"
      @confirm="confirmApprove"
      @cancel="cancelApprove"
    />

    <!-- 정말 반려? -->
    <ConformModal
      :show="showRejectConfirm"
      message="정말 이 대기단계를 반려하시겠습니까?"
      @confirm="goRejectReason"
      @cancel="cancelRejectConfirm"
    />

    <!--사유 입력 textarea-->
    <StatusReasonModal
      :show="showRejectReason"
      v-model="rejectReason"
      @save="saveRejectReason"
      @cancel="cancelRejectReason"
    />
  </div>

  <!-- 4. 관리자 승인 완료 -->
  <div v-else-if="isApproved" class="wait-wrap approved-wrap">
    <p class="approved-text">
      <b>{{ dependantName }}</b> 님의 대기단계는
    </p>

    <div
      v-if="['e3', 'e4', 'e5'].includes(currentStatus)"
      class="status-circle"
      :class="{
        'status-plan': currentStatus === 'e3', // 계획
        'status-focus': currentStatus === 'e4', // 중점
        'status-emergency': currentStatus === 'e5', // 긴급
      }"
    >
      {{ statusLabel }}
    </div>

    <p class="approved-text">입니다.</p>
  </div>

  <!-- 승인 대기중인 요청이 없을 때 -->
  <div v-else class="wait-wrap">
    <p class="wait-title">현재 승인 대기 중인 대기단계 요청이 없습니다.</p>
  </div>
</template>

<style scoped>
.wait-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  padding: 36px 24px;
  border-radius: 18px;
  background: #fff;
  max-width: 720px;
  margin: 40px auto;
}

.wait-title {
  text-align: center;
  font-size: 20px;
  line-height: 1.5;
  margin: 0;
}

.wait-circles {
  display: flex;
  gap: 22px;
  justify-content: center;
  align-items: center;
}

.circle {
  width: 110px;
  height: 110px;
  border-radius: 999px;
  border: 0;
  background: #f1f1f1;
  font-size: 18px;
  cursor: default;
}

.circle.active {
  background: #16a34a;
  color: #fff;
  font-weight: 700;
}

/* 안내 문구 */
.confirm-text {
  font-size: 15px;
  color: #374151;
  text-align: center;
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-request {
  border: 0;
  padding: 10px 18px;
  border-radius: 999px;
  background: #f97316;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}

.btn-cancel {
  border: 0;
  padding: 10px 18px;
  border-radius: 999px;
  background: #e5e7eb;
  cursor: pointer;
}
.approved-wrap {
  box-shadow: none;
}

.approved-text {
  font-size: 18px;
  text-align: center;
  margin: 0;
  color: #111827;
}
.approved-circle {
  width: 120px;
  height: 120px;
  border-radius: 999px;
  background: #22c55e;
  color: #fff;
  font-size: 20px;
  font-weight: 700;

  display: flex;
  align-items: center;
  justify-content: center;

  animation: pop 0.25s ease-out;
}
.status-circle {
  width: 110px;
  height: 110px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 18px;
  font-weight: 700;

  /* 공통 기본 */
  background: #f1f1f1;
  color: #111827;
}
/*e3*/
.status-plan {
  background: #16a34a;
  color: #ffffff;
}

/* e4 */
.status-focus {
  background: #facc15;
  color: #111827;
}

/* e5 */
.status-emergency {
  background: #ef4444;
  color: #ffffff;
}
@keyframes pop {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
