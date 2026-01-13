<!-- views/components/meetingLog/MeetingLogView.vue -->
<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMeetingLogStore } from '@/stores/meetingLog'

const store = useMeetingLogStore()
const { detail, detailLoading, logs, selectedResvId } = storeToRefs(store)

// 선택된 row가 logs에서 몇번째인지 -> "N회차" 계산
const sessionNo = computed(() => {
  if (!selectedResvId.value || !Array.isArray(logs.value)) return null
  const idx = logs.value.findIndex((x) => x.resv_id === selectedResvId.value)
  if (idx < 0) return null
  return logs.value.length - idx // list에서 보여주던 방식 그대로
})

const dateText = computed(() => detail.value?.resv_day?.slice(0, 10) ?? '')
const createdText = computed(() => (detail.value?.log_date ? String(detail.value.log_date).slice(0, 16) : ''))
</script>

<template>
  <div class="log-view">
    <div v-if="detailLoading" class="hint">불러오는 중...</div>

    <div v-else-if="!detail" class="hint">내역보기 버튼을 눌러주세요.</div>

    <div v-else class="card log-card">
      <div class="log-head">
        <div class="log-title">
          <span v-if="sessionNo" class="chip">{{ sessionNo }}회차</span>
          <span class="label">상담일</span>
          <span class="value">{{ dateText }}</span>
        </div>
      </div>

      <div class="divider" />

      <div v-if="!detail.log_id" class="hint">상담일지가 아직 작성되지 않았습니다.</div>

      <div v-else class="log-body">
        <div class="meta">
          <div class="meta-row"><span class="label">제목</span><span class="value">{{ detail.log_title }}</span></div>
          <div class="meta-row"><span class="label">작성자</span><span class="value">{{ detail.member_id }}</span></div>
          <div class="meta-row"><span class="label">작성일</span><span class="value">{{ createdText }}</span></div>
        </div>

        <div class="content">
          {{ detail.log_content }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.log-view {
  color: #111827; /* 전체 기본 글자색: 검정톤 */
}

/* 카드 */
.log-card {
  border: 1px solid #eef1f5;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(17, 24, 39, 0.06);
  background: #fff;
  padding: 16px;
}

/* 상단 */
.log-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.log-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.chip {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #1f2937;
  background: rgba(94, 114, 228, 0.12);
}

.label {
  font-weight: 700;
  color: #111827;
}

.value {
  color: #111827;
}

/* 구분선 */
.divider {
  height: 1px;
  background: #eef1f5;
  margin: 12px 0;
}

/* 안내문(회색 말고 살짝만 톤다운) */
.hint {
  color: #374151;
  font-size: 0.95rem;
}

/* 메타 */
.meta {
  display: grid;
  gap: 6px;
  margin-bottom: 12px;
}

.meta-row {
  display: grid;
  grid-template-columns: 70px 1fr;
  gap: 10px;
  align-items: center;
}

/* 본문 */
.content {
  padding: 14px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #eef1f5;
  white-space: pre-line;
  line-height: 1.6;
  color: #111827;
}
</style>
