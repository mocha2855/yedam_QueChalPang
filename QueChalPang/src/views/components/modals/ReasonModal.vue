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
        v-model="modal.rejectReason"
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
  modal.payload?.onSubmit(reason.value) //? => payload 있을 때 실행 없으면 무시
  modal.close()
}
</script>
<style scoped>
.reason-modal-wrapper {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  width: 550px;
  max-width: 90vw;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

/* 헤더 */
.modal-header {
  background: #2c3e50;
  color: white;
  padding: 20px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  color: white;
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 28px;
  cursor: pointer;
  padding: 0;
  width: 35px;
  height: 35px;
  line-height: 1;
  transition: opacity 0.2s;
}

.close-btn:hover {
  opacity: 0.7;
}

/* 본문 */
.modal-body {
  padding: 30px 25px;
}

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

.reason-input::placeholder {
  color: #999;
}

/* 하단 버튼 */
.modal-footer {
  padding: 20px 25px;
  background: #f8f9fa;
  display: flex;
  gap: 12px;
  justify-content: center;
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
