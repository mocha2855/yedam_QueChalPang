<template>
  <div v-if="modal.visible" class="overlay" @click="modal.close()">
    <div class="custom-modal" @click.stop>
      <!--@click.stop:내부클릭시 안닫힘-->
      <!--팀원들이 여기에 추가 -->
      <ReasonModal v-if="modal.type === 'reason'" />
      <AssignManagerModal v-else-if="modal.type === 'assignManager'" />
    </div>
  </div>
</template>

<script setup>
import { useModalStore } from '@/stores/modal'
import ReasonModal from './ReasonModal.vue'
import AssignManagerModal from './AssignManagerModal.vue';

const modal = useModalStore()
// console.log(modal)
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
</style>
