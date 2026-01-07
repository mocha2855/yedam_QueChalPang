<!-- waits/ApplicationStatusRequest.vue -->
<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { useApplicationStore } from '@/stores/application'
import ApplicationModal from '../modals/ApplicationModal.vue'

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
const isInitial = computed(
  () => currentStatus.value === 'e1' && statusStatus.value == null,
)

// 2) 관리자에게 반려된 상태: e1 & i3
const isRejected = computed(
  () => currentStatus.value === 'e1' && statusStatus.value === 'i3',
)

// 3) 관리자 승인 대기중: i1
const isWaitingApproval = computed(
  () => statusStatus.value === 'i1',
)

// 4) 관리자 승인 완료: e3/e4/e5 + i2
const isApproved = computed(
  () =>
    ['e3', 'e4', 'e5'].includes(currentStatus.value) &&
    statusStatus.value === 'i2',
)

const openModal = () => {
  if (!selectedStatus.value) return alert('대기단계를 선택해주세요')
  checked.value = true
}

const submit = async () => {
  if (!selectedStatus.value) {
    alert('대기단계를 선택해주세요')
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
      <template #body>
        <h3 class="text-center">
          {{ selectedLabel }} 단계로 승인요청 하시겠습니까?
        </h3>
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

    <p class="wait-title" style="margin-top: 12px;">
      다시 대기단계를 선택하여 승인요청을 해주세요.
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

    <button class="btn-request" type="button" @click="openModal">다시 승인요청</button>

    <ApplicationModal v-if="checked">
      <template #body>
        <h3 class="text-center">
          {{ selectedLabel }} 단계로 다시 승인요청 하시겠습니까?
        </h3>
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
  </div>

  <!-- 4. 관리자 승인 완료 -->
  <div v-else-if="isApproved" class="wait-wrap">
    <p class="wait-title">
      해당 지원자의 대기단계는 <b>{{ statusLabel }}</b> 입니다.
    </p>
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
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.06);
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

.wait-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  padding: 36px 24px;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.06);
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
</style>
