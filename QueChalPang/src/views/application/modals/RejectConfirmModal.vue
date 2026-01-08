<!-- application/modals/RejectConfirmModal.vue -->
<template>
  <ApplicationModal v-if="show">
    <template #header>지원계획서 반려</template>

    <template #body>
      <p class="modal-text" style="text-align: center" v-html="message"></p>
      <textarea
        class="reason-input"
        v-model="modal.rejectReason"
        placeholder="반려 사유를 입력해주세요."
      ></textarea>
    </template>

    <template #footer>
      <button class="btn-save" @click="$emit('reject')">반려</button>
      <button class="btn-cancel" @click="$emit('cancel')">취소</button>
    </template>
  </ApplicationModal>
</template>

<script setup>
import ApplicationModal from '../modals/ApplicationModal.vue'
import { useModalStore } from '@/stores/modal'

defineProps({
  show: { type: Boolean, default: false },
  message: { type: String, default: '' },
})

defineEmits(['reject', 'cancel'])

const modal = useModalStore()
</script>

<style scoped>
.reason-input {
  width: 100%;
  min-height: 150px;
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 15px;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.reason-input:focus {
  outline: none;
  border-color: #2196f3;
}
.btn-save,
.btn-cancel {
  padding: 12px 40px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.2s;
}
.btn-save {
  background: #2196f3;
  color: white;
}
.btn-cancel {
  background: #f44336;
  color: white;
}
</style>
