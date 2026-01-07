<!-- application/modals/RejectConformModal.vue -->
<!-- 반려 확인만 담당 -->
<template>
  <ApplicationModal v-if="show">
    <template #header><h2></h2></template>
    <template #footer>
      <button class="btn-save" @click="$emit('reject')">반려</button>
      <button class="btn-cancel" @click="$emit('cancel')">취소</button>
    </template>
  </ApplicationModal>
</template>

<script setup>
import ApplicationModal from '../modals/ApplicationModal.vue'

defineProps({
  show: { type: Boolean, default: false },
})

defineEmits(['reject', 'cancel'])
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
.btn-cancel {
  background: #f44336;
  color: white;
}
</style>
