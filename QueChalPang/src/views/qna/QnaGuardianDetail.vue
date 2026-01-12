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
    <!-- <div class="topbar">
      <RouterLink :to="{ name: 'qnaGuardian' }" class="back-link"> ← 목록으로 돌아가기 </RouterLink>
    </div> -->
    <div class="qna-card">
      <div class="qna-title">
        {{ qna.qna_title }}
      </div>

      <div class="qna-meta">
        작성자 {{ qna.writer_name }} | 담당자 {{ qna.manager_name ?? '담당자 미배정' }} | 작성일
        {{ String(qna.qna_date).slice(0, 10) }}
      </div>

      <div class="qna-content">
        {{ qna.qna_content }}
      </div>

      <!-- 답변 있을 때 -->
      <div class="answer" v-if="qna.qanswer_no">
        <div class="answer-title">답변</div>
        <div class="answer-meta">
          답변자 {{ qna.answerer_name }} | 답변일 {{ String(qna.qanswer_date).slice(0, 10) }}
        </div>
        <div class="answer-content">
          {{ qna.qanswer_content }}
        </div>
      </div>

      <!-- 답변 없을 때 -->
      <div v-else class="no-answer">아직 답변이 등록되지 않았습니다.</div>
    </div>
  </div>
</template>
<style scoped>
.qna-detail {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

/* 전체 카드 */
.qna-card {
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  padding: 20px 22px;
}

/* 제목 */
.qna-title {
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 12px;
  color: #222;
}

/* 메타 (작성자, 담당자, 날짜) */
.qna-meta {
  font-size: 13px;
  color: #666;
  margin-bottom: 18px;
}

/* 본문 */
.qna-content {
  font-size: 14px;
  line-height: 1.7;
  color: #222;
  white-space: pre-wrap;
  padding-bottom: 18px;
  border-bottom: 1px solid #eee;
}

/* 답변 영역 */
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

/* 답변 없을 때 */
.no-answer {
  margin-top: 18px;
  font-size: 13px;
  color: #999;
  font-style: italic;
}

/* .topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.back-link {
  font-size: 1rem;
  font-weight: 700;
  color: #ffa229;
  text-decoration: none;
}

.back-link:hover {
  color: #ff863b;
  text-decoration: underline;
} */
</style>
