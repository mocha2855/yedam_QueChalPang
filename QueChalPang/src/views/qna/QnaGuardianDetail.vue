<!-- views/QnaGuardianDetal.vue -->
<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
console.log('route.params.qnaNo =', route.params.qnaNo)

const qnaNo = route.params.qnaNo

const qna = ref(null)

const fetchDetail = async () => {
  const res = await axios.get(`/api/qnaDetailByGuardian/${qnaNo}`)
  console.log('GET URL =', `/api/qnaDetailByGuardian/${qnaNo}`)

  qna.value = res.data
}

onMounted(fetchDetail)
</script>

<template>
  <div class="qna-detail" v-if="qna">
    <section class="content-wrap">
      <!-- 상단 헤더 -->
      <header class="page-header">
        <button class="btn-back" @click="$router.back()">목록으로</button>

        <div class="header-right">
          <span class="status-chip" :class="qna.qanswer_no ? 'done' : 'wait'">
            {{ qna.qanswer_no ? '답변완료' : '답변대기' }}
          </span>
        </div>
      </header>

      <!-- 본문 카드 -->
      <article class="card">
        <h1 class="title">{{ qna.qna_title }}</h1>

        <div class="meta">
          <div class="meta-row">
            <span class="meta-label">작성자</span>
            <span class="meta-value">{{ qna.writer_name }}</span>
          </div>

          <div class="meta-row">
            <span class="meta-label">담당자</span>
            <span class="meta-value">{{ qna.manager_name ?? '담당자 미배정' }}</span>
          </div>

          <div class="meta-row">
            <span class="meta-label">작성일</span>
            <span class="meta-value">{{ String(qna.qna_date).slice(0, 10) }}</span>
          </div>
        </div>

        <div class="content">
          {{ qna.qna_content }}
        </div>

        <!-- 답변 -->
        <section class="answer" v-if="qna.qanswer_no">
          <div class="answer-head">
            <h2 class="answer-title">답변</h2>
            <span class="answer-date">{{ String(qna.qanswer_date).slice(0, 10) }}</span>
          </div>

          <div class="answer-meta">
            <span class="meta-label">답변자</span>
            <span class="meta-value">{{ qna.answerer_name }}</span>
          </div>

          <div class="answer-content">
            {{ qna.qanswer_content }}
          </div>
        </section>

        <!-- 답변 없음 -->
        <div v-else class="empty-answer">아직 답변이 등록되지 않았습니다.</div>
      </article>

      <p class="footnote">
        * 문의 내용과 답변은 저장되며, 수정/삭제는 운영 정책에 따라 제한될 수 있어요.
      </p>
    </section>
  </div>
</template>

<style scoped>
.qna-detail {
  padding: 24px 16px;
}

.content-wrap {
  max-width: 980px;
  margin: 0 auto;
  width: 100%;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 6px 0 14px;
}

.btn-back {
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #111827;
  padding: 9px 12px;
  border-radius: 12px;
  font-weight: 900;
  cursor: pointer;
  transition: 0.15s;
}

.btn-back:hover {
  background: #f8fafc;
  transform: translateY(-1px);
}

.status-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 900;
  border: 1px solid transparent;
  white-space: nowrap;
}

.status-chip.done {
  background: #0b4bb3;
  color: #fff;
}

.status-chip.wait {
  background: #fff;
  color: #0b4bb3;
  border-color: #0b4bb3;
}

.card {
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 14px;
  padding: 22px 22px;
  box-shadow: 0 12px 26px rgba(0, 0, 0, 0.06);
}

.title {
  margin: 0 0 12px;
  font-size: 22px;
  font-weight: 900;
  letter-spacing: -0.4px;
  color: #111827;
}

.meta {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  padding: 12px 14px;
  background: #f8fafc;
  border: 1px solid #eef2f7;
  border-radius: 12px;
  margin-bottom: 16px;
}

.meta-row {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.meta-label {
  font-size: 12px;
  font-weight: 900;
  color: #6b7280;
}

.meta-value {
  font-size: 13px;
  font-weight: 800;
  color: #111827;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.content {
  font-size: 14px;
  line-height: 1.8;
  color: #111827;
  white-space: pre-wrap;
  padding: 14px 2px 6px;
  border-bottom: 1px solid #f1f5f9;
}

.answer {
  margin-top: 16px;
  padding: 14px;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  background: #fbfdff;
}

.answer-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}

.answer-title {
  margin: 0;
  font-size: 15px;
  font-weight: 900;
  letter-spacing: -0.2px;
  color: #111827;
}

.answer-date {
  font-size: 12px;
  color: #6b7280;
  font-weight: 800;
}

.answer-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.answer-content {
  font-size: 14px;
  line-height: 1.8;
  color: #111827;
  white-space: pre-wrap;
}

.empty-answer {
  margin-top: 16px;
  padding: 14px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px dashed #d1d5db;
  color: #6b7280;
  font-size: 13px;
  font-weight: 800;
}

.footnote {
  margin: 10px 2px 0;
  font-size: 12px;
  color: #6b7280;
}

@media (max-width: 768px) {
  .meta {
    grid-template-columns: 1fr;
  }

  .card {
    padding: 18px 16px;
  }
}
</style>
