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
    await fetchDetail() 
  } catch (e) {
    errorText.value = '답변 등록에 실패했습니다.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="qna-detail" v-if="qna">
    <div>
      <button class="back-btn btn-warning btn-sm fs-6" @click="$router.back()">← 뒤로가기</button>
    </div>
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
            rows="8"
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
  max-width: 980px;
  margin: 0 auto;
  padding: 26px 16px;
  color: #111827;
}

/* ===== Back Button ===== */
.back-btn {
  border: 1px solid #e5e7eb;
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
  color: #111827;
  padding: 10px 14px;
  border-radius: 14px;
  font-weight: 900;
  cursor: pointer;
  transition: 0.12s ease;
  box-shadow: 0 8px 18px rgba(17, 24, 39, 0.06);
}

.back-btn:hover {
  background: #f8fafc;
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(17, 24, 39, 0.08);
}

/* ===== Card ===== */
.qna-card {
  margin-top: 14px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 22px 22px;
  box-shadow: 0 14px 30px rgba(17, 24, 39, 0.06);
}

/* ===== Title ===== */
.qna-title {
  font-size: 22px;
  font-weight: 900;
  margin-bottom: 10px;
  color: #111827;
  letter-spacing: -0.4px;
}

/* ===== Meta ===== */
.qna-meta {
  font-size: 13px;
  font-weight: 800;
  color: #6b7280;
  margin-bottom: 16px;
}

/* ===== Content ===== */
.qna-content {
  font-size: 14px;
  line-height: 1.9;
  color: #111827;
  white-space: pre-wrap;
  padding-bottom: 16px;
  border-bottom: 1px solid #eef2f7;
}

/* ===== Answer Section ===== */
.answer {
  margin-top: 18px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: linear-gradient(180deg, #fbfdff 0%, #ffffff 100%);
}

.answer-title {
  font-size: 15px;
  font-weight: 900;
  margin-bottom: 6px;
  color: #111827;
}

.answer-meta {
  font-size: 12px;
  font-weight: 800;
  color: #6b7280;
  margin-bottom: 10px;
}

.answer-content {
  font-size: 14px;
  line-height: 1.9;
  color: #111827;
  white-space: pre-wrap;
}

/* ===== No Answer ===== */
.no-answer {
  margin-top: 18px;
  padding: 14px;
  border-radius: 14px;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  color: #6b7280;
  font-size: 13px;
  font-weight: 800;
}

/* ===== Form ===== */
.answer-form {
  margin-top: 18px;
  border-top: 1px solid #eef2f7;
  padding-top: 16px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.field .label {
  font-size: 12px;
  font-weight: 900;
  color: #6b7280;
  margin-bottom: 6px;
}

.input,
.textarea {
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 10px 12px;
  outline: none;
  font-size: 13px;
  font-weight: 700;
  background: #fff;
  color: #111827;
  transition:
    border 0.15s ease,
    box-shadow 0.15s ease;
}

.input:focus,
.textarea:focus {
  border-color: #4e93cb;
  box-shadow: 0 0 0 3px rgba(78, 147, 203, 0.15);
}

.textarea {
  resize: none;
  line-height: 1.7;
}

.mt {
  margin-top: 12px;
}

/* ===== Buttons ===== */
.btn-row {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
}

.btn {
  border-radius: 3px !important;
  padding: 9px 14px;
  font-weight: 900;
  font-size: 13px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: 0.12s ease;
}

/* Primary */
.btn.primary {
  background: #4e93cb;
  border-color: #4e93cb;
  color: #fff;
  box-shadow: 0 6px 14px rgba(78, 147, 203, 0.35);
}

.btn.primary:hover {
  filter: brightness(0.95);
  transform: translateY(-1px);
}

/* Gray */
.btn.gray {
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  color: #6b7280;
}

.btn.gray:hover {
  background: #f1f5f9;
}

/* Disabled */
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

/* ===== Error ===== */
.error {
  margin-top: 10px;
  color: #dc2626;
  font-weight: 900;
  font-size: 12px;
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .qna-card {
    padding: 18px 16px;
  }
  .form-grid {
    grid-template-columns: 1fr;
  }
}

.back-btn {
  background: #4e93cb;
  border-color: #4e93cb;
  color: #fff;
  border-radius: 3px !important;
}

.back-btn:hover {
  filter: brightness(0.95);
  transform: translateY(-1px);
}
</style>
