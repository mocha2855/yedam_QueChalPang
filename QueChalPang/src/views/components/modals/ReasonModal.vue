<!-- components/modal/ReasonModal.vue -->

<template>
  <div class="reason-modal-wrapper">
    <div class="modal-header">
      <h2>수정이력등록</h2>
      <button class="close-btn" @click="modal.close()">X</button>
    </div>
    <div class="modal-body">
      <h3>수정사유</h3>
      <textarea
        class="reason-input"
        v-model="reason"
        placeholder="수정사유를 입력해주세요."
      ></textarea>
    </div>
    <div class="modal-footer">
      <button class="btn-save" @click="save">저장</button>
      <button class="btn-cancel" @click="modal.close()">취소</button>
    </div>
  </div>
</template>

<script setup>
import { useModalStore } from '@/stores/modal'
import { ref } from 'vue'

const modal = useModalStore()
const reason = ref('')

function save() {
  modal.payload?.onSubmit(reason.value)
  modal.close()
}
</script>
