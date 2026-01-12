<!-- application/modals/ConformModal.vue -->
<template>
  <ApplicationModal v-if="show">
    <template #header><h2></h2></template>
    <template #body>
      <p class="modal-text" style="text-align: center" v-html="message"></p>
    </template>
    <template #footer>
      <button class="btn-save" @click="$emit('confirm')">확인</button>
      <button class="btn-cancel" @click="$emit('cancel')">취소</button>
    </template>
  </ApplicationModal>
</template>

<script setup>
import ApplicationModal from '../modals/ApplicationModal.vue'

defineProps({
  header: { type: String, default: '' },
  show: { type: Boolean, default: false },
  message: { type: String, default: '' },
})

defineEmits(['confirm', 'cancel'])
</script>

<style scoped>
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
.btn-save:hover {
  background: #1976d2;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
}

.btn-cancel {
  background: #f44336;
  color: white;
}
.btn-cancel:hover {
  background: #d32f2f;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(244, 67, 54, 0.3);
}
</style>
