<template>
  <h3>수정사유</h3>
  <textarea v-model="reason" placeholder="수정사유를 입력해주세요."></textarea>
  <button @click="save">저장</button>
  <button @click="modal.close()">취소</button>
</template>

<script setup>
import { useModalStore } from '@/stores/Modal'
import { ref } from 'vue'

const modal = useModalStore()
const reason = ref('')

function save() {
  modal.payload?.onSubmit(reason.value) //? => payload 있을 때 실행 없으면 무시
  modal.close()
}
</script>
