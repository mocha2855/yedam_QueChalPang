<!-- components/modal/ConfirmModal.vue -->
<script setup>
defineProps({
  show: { type: Boolean, required: true },
  message: { type: String, default: '확인하시겠습니까?' },
})

const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <div v-if="show" class="confirm-backdrop" @click.self="emit('cancel')">
    <div class="modal-card">
      <p class="mb-4 text-center fw-semibold">
        {{ message }}
      </p>

      <div class="d-flex justify-content-center gap-2">
        <button class="btn btn-primary btn-sm" @click="emit('confirm')">확인</button>
        <button class="btn btn-outline-secondary btn-sm" @click="emit('cancel')">취소</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.confirm-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.modal-card {
  width: min(420px, calc(100vw - 32px));
  background: #fff;
  border-radius: 14px;
  padding: 20px 18px;
  border: 1px solid black;
}
</style>
