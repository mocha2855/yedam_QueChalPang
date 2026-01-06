<!-- components/modal/RejectReasonModal.vue -->
<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: { type: Boolean, required: true },
  title: { type: String, default: '예약신청 반려 사유작성' },
  placeholder: { type: String, default: '반려 사유를 입력해주세요.' },
  maxLength: { type: Number, default: 1000 },
})

const emit = defineEmits(['confirm', 'cancel'])

const reason = ref('')

// 모달 열릴 때마다 입력값 초기화(원하면 유지로 바꿔도 됨)
watch(
  () => props.show,
  (v) => {
    if (v) reason.value = ''
  },
)

const onConfirm = () => {
  const trimmed = reason.value.trim()

  if (!trimmed) {
    alert('사유가 입력되지 않았습니다.\n반려 사유를 입력하세요.')
    return
  }

  emit('confirm', trimmed)
}
</script>

<template>
  <div v-if="show" class="modal-backdrop" @click.self="emit('cancel')">
    <div class="modal-card">
      <h6 class="mb-3">{{ title }}</h6>

      <textarea
        v-model="reason"
        class="form-control"
        :maxlength="maxLength"
        rows="5"
        :placeholder="placeholder"
      />

      <div class="d-flex justify-content-between align-items-center mt-2">
        <small class="text-muted">{{ reason.length }} / {{ maxLength }}</small>

        <div class="d-flex gap-2">
          <button class="btn btn-outline-secondary btn-sm" @click="emit('cancel')">취소</button>
          <button class="btn btn-danger btn-sm" @click="onConfirm">확인</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.modal-card {
  width: min(520px, calc(100vw - 32px));
  background: #fff;
  border-radius: 14px;
  padding: 18px 18px 14px;
  border: 1px solid black;
}
</style>
