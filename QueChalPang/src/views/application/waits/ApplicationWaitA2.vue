<!-- a2인 담당자 컴포넌트 -->
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

const canSelect = computed(() => {
  return application.dependantInfo.resv_status === 'f3' && application.dependantInfo.status === 'e1'
})

const openModal = () => {
  if (!selectedStatus.value) {
    alert('대기단계를 선택해주세요')
    return
  }
  checked.value = true
}

const submit = async () => {
  await axios.put(`/api/compApplication/${route.params.id}`, {
    status: selectedStatus.value,
  })
  checked.value = false
  await application.loadApplicationContext(route.params.id)
}
</script>

<template>
  <div v-if="canSelect">
    <h5 class="text-center mb-4">대기 단계를 설정해주세요</h5>

    <div class="mb-4">
      <button
        v-for="s in statusList"
        :key="s.code"
        class="circle"
        :class="{ changed: selectedStatus === s.code }"
        @click="selectedStatus = s.code"
      >
        {{ s.label }}
      </button>
    </div>

    <button class="btn-save" @click="openModal">승인요청</button>

    <ApplicationModal v-if="checked">
      <template #body>
        <h3 class="text-center">{{ selectedStatus }} 단계로 승인요청 하시겠습니까?</h3>
      </template>
      <template #footer>
        <button class="btn-save" @click="submit">확인</button>
        <button class="btn-cancel" @click="checked = false">취소</button>
      </template>
    </ApplicationModal>
  </div>

  <h4 v-else>상담을 먼저 진행해주세요.</h4>
</template>
