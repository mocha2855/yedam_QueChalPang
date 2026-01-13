<!-- a2인 담당자 컴포넌트, 대기단계 관리자한테 승인요청 -->
<!-- ApplicationWaitA2.vue (부모) -->
<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { useApplicationStore } from '@/stores/application'
import ApplicationModal from '../modals/ApplicationModal.vue'
import Swal from 'sweetalert2'

const application = useApplicationStore()
const route = useRoute()

const checked = ref(false)
const selectedStatus = ref(null)

const statusList = [
  { label: '계획', code: 'e3' },
  { label: '중점', code: 'e4' },
  { label: '긴급', code: 'e5' },
]

//데이터에서 필요한 값 꺼내기
const currentStatus = computed(() => application.dependantInfo?.status ?? null)
const statusStatus = computed(() => application.dependantInfo?.status_status ?? null)
const rejectReason = computed(() => application.dependantInfo?.status_reject ?? '')

const dependantName = computed(() => application.dependantInfo?.dependant_name ?? '')
const statusLabel = computed(() => application.dependantInfo?.status_text ?? '')

const selectedLabel = computed(
  () => statusList.find((s) => s.code === selectedStatus.value)?.label ?? '',
)

// 1) 처음: e1 & null
const isInitial = computed(() => currentStatus.value === 'e1' && statusStatus.value == null)

// 2) 관리자에게 반려된 상태: e1 & i3
const isRejected = computed(() => currentStatus.value === 'e1' && statusStatus.value === 'i3')

// 3) 관리자 승인 대기중: i1
const isWaitingApproval = computed(() => statusStatus.value === 'i1')

// 4) 관리자 승인 완료: e3/e4/e5 + i2
const isApproved = computed(
  () => ['e3', 'e4', 'e5'].includes(currentStatus.value) && statusStatus.value === 'i2',
)

const openModal = async () => {
  if (!selectedStatus.value) {
    await Swal.fire({
      icon: 'warning',
      text: '대기단계를 선택해주세요',
      confirmButtonText: '확인',
    })
    return
  }

  checked.value = true
}

const submit = async () => {
  if (!selectedStatus.value) {
    await Swal.fire({
      icon: 'warning',
      text: '대기단계를 선택해주세요',
      confirmButtonText: '확인',
    })
    return
  }

  await axios.put(`/api/compApplication/${route.params.id}`, {
    status: selectedStatus.value, // 'e3' / 'e4' / 'e5'
  })

  checked.value = false
  await application.loadApplicationContext(route.params.id)
}
</script>

<template>
  <!-- 1. 처음 상태: 아직 아무 요청도 안 한 상태 (e1 + NULL) -->
  <div v-if="isInitial" class="wait-wrap">
    <p class="wait-title">
      <b>{{ dependantName }}</b> 님의<br />
      대기단계를 선택해 주세요.
    </p>

    <div class="wait-circles">
      <button
        v-for="s in statusList"
        :key="s.code"
        class="circle"
        :class="{ active: selectedStatus === s.code }"
        type="button"
        @click="selectedStatus = s.code"
      >
        {{ s.label }}
      </button>
    </div>

    <button class="btn-request" type="button" @click="openModal">승인요청</button>

    <ApplicationModal v-if="checked">
      <template #header> 대기단계 승인 요청하기 </template>

      <template #body>
        <p class="modal-text">
          대기단계로 {{ selectedLabel }} 을 선택하셨습니다.<br />
          관리자에게 승인요청 하시겠습니까?
        </p>
      </template>
      <template #footer>
        <button class="btn-request" @click="submit">확인</button>
        <button class="btn-cancel" @click="checked = false">취소</button>
      </template>
    </ApplicationModal>
  </div>

  <!-- 2. 관리자에게 반려된 상태: e1 + i3 -->
  <div v-else-if="isRejected" class="wait-wrap">
    <p class="wait-title">
      <b>{{ dependantName }}</b> 님의 대기단계 승인 요청이 <b>반려</b>되었습니다.
    </p>

    <p class="reject-reason" v-if="rejectReason">
      반려 사유: <br />
      <span>{{ rejectReason }}</span>
    </p>

    <p class="wait-title" style="margin-top: 12px">다시 대기단계를 선택하여 승인요청을 해주세요.</p>

    <div class="wait-circles">
      <button
        v-for="s in statusList"
        :key="s.code"
        class="circle"
        :class="{ active: selectedStatus === s.code }"
        type="button"
        @click="selectedStatus = s.code"
      >
        {{ s.label }}
      </button>
    </div>

    <button class="btn-request" type="button" @click="openModal">다시 승인요청</button>

    <ApplicationModal v-if="checked">
      <template #body>
        <p class="modal-text">{{ selectedLabel }} 단계로 다시 승인요청 하시겠습니까?</p>
      </template>
      <template #footer>
        <button class="btn-request" @click="submit">확인</button>
        <button class="btn-cancel" @click="checked = false">취소</button>
      </template>
    </ApplicationModal>
  </div>

  <!-- 3. 관리자 승인 대기중 (검토중: i1) -->
  <div v-else-if="isWaitingApproval" class="wait-wrap">
    <p class="wait-title">
      <b>{{ dependantName }}</b> 님의 대기단계 승인 요청이 접수되었습니다.<br />
      <b>관리자의 대기단계 승인을 기다리는 중입니다.</b>
    </p>

    <!-- 상태별 색깔 동그라미 -->
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

    <p class="wait-title">
      요청된 대기단계는 <b>{{ statusLabel }}</b> 입니다.
    </p>
  </div>

  <!-- 4. 관리자 승인 완료 -->
  <div v-else-if="isApproved" class="wait-wrap approved-wrap">
    <p class="approved-text">
      <b>{{ dependantName }}</b> 님의 대기단계는
    </p>

    <div class="approved-circle">
      {{ statusLabel }}
    </div>

    <p class="approved-text">입니다.</p>
  </div>

  <!-- 5. 그 외 상태 -->
  <h4 v-else>상담을 먼저 진행해주세요.</h4>
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
  cursor: pointer;
}

.circle.active {
  background: #16a34a;
  color: #fff;
  font-weight: 700;
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

.reject-reason {
  font-size: 14px;
  color: #b91c1c;
  text-align: center;
  white-space: pre-line;
}

.modal-text {
  font-size: 20px;
  color: black;
  line-height: 1.6;
  text-align: center;
  margin: 0;
}

/* 승인 완료 전용 */
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
