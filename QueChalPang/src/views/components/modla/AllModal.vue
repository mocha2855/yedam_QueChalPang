<template>
  <div v-if="modal.visible" class="overlay">
    <div class="modal">
      <!--팀원들이 여기에 추가 -->
      <ReasonModal v-if="modal.type === 'reason'" />
    </div>
  </div>
</template>

<script setup>
import { useModalStore } from '@/stores/Modal'
import ReasonModal from './ReasonModal.vue'

const modal = useModalStore()
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  padding: 20px;
  max-width: 500px;
}
</style>
