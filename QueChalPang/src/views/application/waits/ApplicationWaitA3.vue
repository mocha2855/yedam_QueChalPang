<!-- a3인 관리자 컴포넌트 -->
<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { useApplicationStore } from '@/stores/application'
import ApplicationModal from '../modals/ApplicationModal.vue'

const application = useApplicationStore()
const route = useRoute()

const approveOpen = ref(false)
const rejectOpen = ref(false)

const approve = async () => {
  await axios.put(`/api/compSuccessApplication/${route.params.id}`, {
    status_status: 'i2',
    status_reject: null,
  })
  approveOpen.value = false
  await application.checkdependantInfo(route.params.id)
}

const reject = async (reason) => {
  await axios.put(`/api/rejectstatus/${route.params.id}`, {
    status_reject: reason,
  })
  rejectOpen.value = false
  await application.checkdependantInfo(route.params.id)
}
</script>

<template>
  <div>
    <h5 class="text-center mb-4">대기 단계를 승인해주세요</h5>

    <button class="btn-save" @click="approveOpen = true">승인</button>
    <button class="btn-cancel" @click="rejectOpen = true">반려</button>

    <ApplicationModal v-if="approveOpen">
      <template #footer>
        <button class="btn-save" @click="approve">승인</button>
        <button class="btn-cancel" @click="approveOpen = false">취소</button>
      </template>
    </ApplicationModal>

    <ApplicationModal v-if="rejectOpen">
      <template #footer>
        <button class="btn-save" @click="reject('반려사유')">반려</button>
        <button class="btn-cancel" @click="rejectOpen = false">취소</button>
      </template>
    </ApplicationModal>
  </div>
</template>
