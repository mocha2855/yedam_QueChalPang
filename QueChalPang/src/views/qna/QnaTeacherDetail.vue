<!-- views/qna/QnaTeacherDetail.vue -->
<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { useCounterStore } from '@/stores/member'
import { storeToRefs } from 'pinia'

const route = useRoute()
const qnaNo = route.params.qnaNo

const counterStore = useCounterStore()
const { isLogIn } = storeToRefs(counterStore)
const teacherId = computed(() => isLogIn.value?.info?.member_id) // 답변자 id
const teacherName = computed(() => isLogIn.value?.info?.member_name) // 답변자 이름(표시용)

const qna = ref(null)

const showAnswerForm = ref(false)
const answerText = ref('')
const saving = ref(false)
const errorText = ref('')

// 오늘 날짜 YYYY-MM-DD
const todayText = computed(() => new Date().toISOString().slice(0, 10))

const fetchDetail = async () => {
  const res = await axios.get(`/api/qnaDetailByManager/${qnaNo}`)
  qna.value = res.data
}

onMounted(fetchDetail)

const openAnswerForm = () => {
  errorText.value = ''
  showAnswerForm.value = true
  answerText.value = '' // 새로 작성
}

const cancelAnswer = () => {
  showAnswerForm.value = false
  answerText.value = ''
  errorText.value = ''
}

const submitAnswer = async () => {
  errorText.value = ''
  if (!answerText.value.trim()) return (errorText.value = '답변 내용을 입력하세요.')
  if (!teacherId.value) return (errorText.value = '로그인 정보가 없습니다.')

  saving.value = true
  try {
    await axios.post(`/api/addAnswerByManager/${qnaNo}`, {
      answererId: teacherId.value,
      qanswer_content: answerText.value,
    })

    showAnswerForm.value = false
    answerText.value = ''
    await fetchDetail() // ✅ 답변/상태 갱신
  } catch (e) {
    errorText.value = '답변 등록에 실패했습니다.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="qna-detail" v-if="qna">
    <div class="qna-card">
      <div class="qna-title">{{ qna.qna_title }}</div>

      <div class="qna-meta">
        작성자 {{ qna.writer_name }} | 담당자 {{ qna.manager_name ?? '담당자 미배정' }} | 작성일
        {{ String(qna.qna_date).slice(0, 10) }}
      </div>

      <div class="qna-content">{{ qna.qna_content }}</div>

      <!-- 답변 있을 때 -->
      <div class="answer" v-if="qna.qanswer_no">
        <div class="answer-title">답변</div>
        <div class="answer-meta">
          답변자 {{ qna.answerer_name }} | 답변일 {{ String(qna.qanswer_date).slice(0, 10) }}
        </div>
        <div class="answer-content">{{ qna.qanswer_content }}</div>
      </div>

      <!-- 답변 없을 때 -->
      <div v-else class="no-answer">아직 답변이 등록되지 않았습니다.</div>

      <!-- 답변 등록 버튼 (답변 없을 때만) -->
      <div class="btn-row" v-if="!qna.qanswer_no && !showAnswerForm">
        <button class="btn primary" type="button" @click="openAnswerForm">답변등록하기</button>
      </div>

      <!-- 답변 등록 폼 -->
      <div v-if="showAnswerForm" class="answer-form">
        <div class="form-grid">
          <div class="field">
            <div class="label">답변자</div>
            <input class="input" :value="teacherName" readonly />
          </div>

          <div class="field">
            <div class="label">답변일</div>
            <input class="input" :value="todayText" readonly />
          </div>
        </div>

        <div class="field mt">
          <div class="label">답변 내용</div>
          <textarea
            v-model="answerText"
            class="textarea"
            rows="6"
            placeholder="답변 내용을 입력하세요"
          />
        </div>

        <p v-if="errorText" class="error">{{ errorText }}</p>

        <div class="btn-row">
          <button class="btn gray" type="button" :disabled="saving" @click="cancelAnswer">
            취소
          </button>
          <button class="btn primary" type="button" :disabled="saving" @click="submitAnswer">
            {{ saving ? '등록중...' : '등록' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.qna-detail {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.qna-card {
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  padding: 20px 22px;
}

.qna-title {
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 12px;
  color: #222;
}

.qna-meta {
  font-size: 13px;
  color: #666;
  margin-bottom: 18px;
}

.qna-content {
  font-size: 14px;
  line-height: 1.7;
  color: #222;
  white-space: pre-wrap;
  padding-bottom: 18px;
  border-bottom: 1px solid #eee;
}

.answer {
  margin-top: 18px;
}

.answer-title {
  font-size: 14px;
  font-weight: 800;
  color: #222;
  margin-bottom: 6px;
}

.answer-meta {
  font-size: 12px;
  color: #777;
  margin-bottom: 10px;
}

.answer-content {
  font-size: 14px;
  line-height: 1.7;
  color: #222;
  white-space: pre-wrap;
}

.no-answer {
  margin-top: 18px;
  font-size: 13px;
  color: #999;
  font-style: italic;
}
.btn-row {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
}

.btn {
  border: 1px solid #d9d9d9;
  background: #fff;
  border-radius: 8px;
  padding: 10px 14px;
  font-weight: 800;
  font-size: 13px;
  cursor: pointer;
}

.btn.primary {
  background: #0b4bb3;
  border-color: #0b4bb3;
  color: #fff;
}

.btn.gray {
  background: #f2f2f2;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.answer-form {
  margin-top: 16px;
  border-top: 1px solid #eee;
  padding-top: 16px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.field .label {
  font-size: 12px;
  font-weight: 800;
  color: #444;
  margin-bottom: 6px;
}

.input,
.textarea {
  width: 100%;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  padding: 10px 12px;
  outline: none;
  font-size: 13px;
}

.textarea {
  resize: none;
  line-height: 1.6;
}

.mt {
  margin-top: 12px;
}

.error {
  margin-top: 10px;
  color: #d11;
  font-weight: 800;
  font-size: 12px;
}
</style>
