<!-- qna/modals/QnaAddModal.vue -->
<script setup>
import { reactive, ref, computed, onMounted, watch } from 'vue'
import { useModalStore } from '@/stores/modal'
import { useQnaStore } from '@/stores/qna'
import { useCounterStore } from '@/stores/member'
import { storeToRefs } from 'pinia'

const modal = useModalStore()
const qnaStore = useQnaStore()

const counterStore = useCounterStore()
const { isLogIn } = storeToRefs(counterStore)
const memberId = computed(() => isLogIn.value?.info?.member_id)

const dependants = ref([])
const dependantNo = ref('')

const fetchDependants = async () => {
  if (!memberId.value) return
  await qnaStore.fetchDependantsByMember(memberId.value)
  dependants.value = qnaStore.dependants
}

onMounted(fetchDependants)

watch(memberId, (v) => {
  if (v) fetchDependants()
})

const form = reactive({
  qna_category: 'c1',
  qna_title: '',
  qna_content: '',
})

const errorText = ref('')
const loading = computed(() => qnaStore.loading)

const submit = async () => {
  errorText.value = ''

  if (!form.qna_title.trim()) return (errorText.value = '제목을 입력하세요')
  if (!form.qna_content.trim()) return (errorText.value = '내용을 입력하세요')
  if (!dependantNo.value) return (errorText.value = '지원자를 선택하세요')

  try {
    await qnaStore.addQnaByGuardian(memberId.value, {
      dependant_no: dependantNo.value,
      qna_category: form.qna_category,
      qna_title: form.qna_title,
      qna_content: form.qna_content,
    })

    modal.close()
  } catch (e) {
    errorText.value = '등록에 실패했습니다.'
  }
}
</script>

<template>
  <div class="qna-add">
    <h5 class="title">1:1 질문 작성</h5>
    <label class="label mt">지원자 선택</label>
    <select v-model="dependantNo" class="input">
      <option value="" disabled>지원자를 선택하세요</option>
      <option v-for="d in dependants" :key="d.dependant_no" :value="d.dependant_no">
        {{ d.dependant_name }}
      </option>
    </select>
    <div class="form">
      <label class="label">카테고리</label>
      <select v-model="form.qna_category" class="input">
        <option value="c1">상담</option>
        <option value="c2">지원자 등록</option>
        <option value="c3">지원계획서</option>
        <option value="c4">지원결과서</option>
        <option value="c5">기타</option>
      </select>

      <label class="label mt">제목</label>
      <input v-model="form.qna_title" class="input" placeholder="제목을 입력하세요" />

      <label class="label mt">내용</label>
      <textarea
        v-model="form.qna_content"
        class="textarea"
        rows="8"
        placeholder="문의 내용을 입력하세요"
      />

      <p v-if="errorText" class="error">{{ errorText }}</p>

      <div class="btn-row">
        <button class="btn cancel" type="button" @click="modal.close()">취소</button>
        <button class="btn submit" type="button" :disabled="loading" @click="submit">
          {{ loading ? '등록중...' : '등록' }}
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.qna-add {
  width: 560px;
  background: #fff;
  border-radius: 12px;
  padding: 18px;
}
.title {
  font-weight: 900;
  margin-bottom: 12px;
}
.label {
  font-size: 12px;
  font-weight: 800;
  color: #333;
}
.mt {
  margin-top: 10px;
}
.input,
.textarea {
  width: 100%;
  border: 1px solid #d9d9d9;
  border-radius: 10px;
  padding: 10px 12px;
  outline: none;
  margin-top: 6px;
}
.textarea {
  resize: none;
}
.error {
  margin-top: 10px;
  color: #d11;
  font-weight: 700;
  font-size: 12px;
}
.btn-row {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 14px;
}
.btn {
  border: none;
  border-radius: 10px;
  padding: 10px 14px;
  font-weight: 900;
  cursor: pointer;
}
.btn.cancel {
  background: #eee;
}
.btn.submit {
  background: #0b4bb3;
  color: #fff;
}
.btn.submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
