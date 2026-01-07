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

//*** 여기 나중에 체크하기 e1이고 f3일때 라고 조건 줄건지 말지 */
// e1이면 무조건 보이게
const canSelect = computed(() => application.dependantInfo?.status === 'e1')

const openModal = () => {
  if (!selectedStatus.value) return alert('대기단계를 선택해주세요')
  checked.value = true
}

const submit = async () => {
  await axios.put(`/api/compApplication/${route.params.id}`, {})
  checked.value = false
  await application.loadApplicationContext(route.params.id)
}

const dependantName = computed(() => application.dependantInfo?.dependant_name ?? '')
const selectedLabel = computed(
  () => statusList.find((s) => s.code === selectedStatus.value)?.label ?? '',
)
</script>

<template>
  <div v-if="canSelect" class="wait-wrap">
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
        <h3 class="text-center">{{ selectedLabel }} 단계로 승인요청 하시겠습니까?</h3>
      </template>
      <template #footer>
        <button class="btn-request" @click="submit">확인</button>
        <button class="btn-cancel" @click="checked = false">취소</button>
      </template>
    </ApplicationModal>
  </div>

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
</style>
