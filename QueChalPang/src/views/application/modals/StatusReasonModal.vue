<!-- application/modals/StatusReasonModal.vue -->
<template>
  <ApplicationModal v-if="show">
    <template #header>
      <div class="header-row">
        <h2>수정사유 등록</h2>
        <button class="close-btn" @click="$emit('cancel')">X</button>
      </div>
    </template>

    <template #body>
      <div class="modal-body">
        <h3>반려사유를 적어주세요</h3>
        <textarea
          class="reason-input"
          v-model="localReason"
          placeholder="반려사유를 입력해주세요."
        ></textarea>
      </div>
    </template>

    <template #footer>
      <button class="btn-save" @click="onSave">저장</button>
      <button class="btn-cancel" @click="$emit('cancel')">취소</button>
    </template>
  </ApplicationModal>
</template>

<script setup>
import { ref, watch } from 'vue'
import ApplicationModal from './ApplicationModal.vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  modelValue: { type: String, default: '' }, // v-model용
})

const emit = defineEmits(['update:modelValue', 'save', 'cancel'])

const localReason = ref(props.modelValue)

watch(
  () => props.modelValue,
  (v) => {
    localReason.value = v
  }
)

const onSave = () => {
  emit('update:modelValue', localReason.value)
  emit('save', localReason.value)
}
</script>

<style scoped>
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: none;
  border: none;
  color: #111827;
  font-size: 22px;
  cursor: pointer;
}

/* 아래 부분은 기존 스타일 그대로 재사용 가능 */
.modal-body {
  padding: 10px 0;
  text-align: center;
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
