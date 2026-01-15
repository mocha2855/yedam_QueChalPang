<!-- views/qna/QnaTeacher.vue -->
<script setup>
import { computed, onMounted, watch } from 'vue'
import { useCounterStore } from '@/stores/member'
import { useQnaStore } from '@/stores/qna'
import { storeToRefs } from 'pinia'
import router from '@/router'

const counterStore = useCounterStore()
const { isLogIn } = storeToRefs(counterStore)

const qnaStore = useQnaStore()
const { filteredRows } = storeToRefs(qnaStore)

// 담당자(teacher) id
const managerId = computed(() => isLogIn.value?.info?.member_id)

const fetch = () => qnaStore.fetchByManagerMain(managerId.value)

onMounted(() => {
  if (managerId.value) fetch()
})

watch(managerId, (v) => {
  if (v) fetch()
})

const goDetail = (no) => {
  if (no) {
    // 담당자 상세 라우트로 갈 거면 이름 바꿔주면 됨
    router.push({ name: 'qnaTeacherDetail', params: { qnaNo: no } })
  }
}
</script>

<template>
  <div class="qna-teacher">
    <section class="content-area content-wrap">
      <!-- 상단 타이틀(버튼 대신) -->
      <div class="hero-row">
        <div class="hero-title">담당 질문목록</div>
      </div>

      <div class="list-card">
        <div class="list-header">
          <div class="list-title">문의내역</div>
        </div>

        <div class="table-wrap">
          <table class="table qna-table mb-0">
            <thead>
              <tr>
                <th>제목</th>
                <th style="width: 120px">카테고리</th>
                <th style="width: 120px">지원자</th>
                <th style="width: 100px">작성자</th>
                <th style="width: 100px">담당자</th>
                <th style="width: 100px">답변자</th>
                <th style="width: 120px">문의 날짜</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="r in filteredRows" :key="r.no" class="qna-row" @click="goDetail(r.no)">
                <td>
                  <div class="title-cell">
                    <span class="title-text">{{ r.title }}</span>

                    <span class="status-badge" :class="r.status === '답변완료' ? 'done' : 'wait'">
                      {{ r.status }}
                    </span>
                  </div>
                </td>

                <td class="text-center">{{ r.category }}</td>
                <td class="text-center">{{ r.dependant }}</td>
                <td class="text-center">{{ r.writer }}</td>
                <td class="text-center">{{ r.manager }}</td>
                <td class="text-center">{{ r.responder || '-' }}</td>
                <td class="text-center">
                  <span class="date-chip">{{ r.date }}</span>
                </td>
              </tr>

              <tr v-if="filteredRows.length === 0">
                <td colspan="6" class="text-center py-4 text-muted">조회 결과가 없습니다.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ===== Layout ===== */
.qna-teacher {
  padding: 18px;
  color: #111827;
}

.content-area {
  min-height: 520px;
}

.content-wrap {
  max-width: 980px;
  margin: 0 auto;
  width: 100%;
}

/* ===== Hero ===== */
.hero-row {
  display: flex;
  justify-content: center;
  margin: 8px 0 18px;
}

.hero-title {
  width: 100%;
  text-align: center;
  font-weight: 900;
  font-size: 22px;
  padding: 14px 16px;
  border-radius: 14px;

  /* 깔끔한 카드 느낌 */
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 28px rgba(17, 24, 39, 0.06);
  letter-spacing: -0.2px;
}

/* ===== Card ===== */
.list-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 10px 28px rgba(17, 24, 39, 0.05);
}

.list-header {
  padding: 12px 14px;
  border-bottom: 1px solid #eef2f7;
  background: #fbfbfc;
}

.list-title {
  font-weight: 900;
  color: #111827;
  letter-spacing: -0.2px;
}

/* ===== Table Wrapper ===== */
.table-wrap {
  overflow-x: auto;
}

/* 스크롤바 예쁘게(크롬) */
.table-wrap::-webkit-scrollbar {
  height: 10px;
}
.table-wrap::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 999px;
}
.table-wrap::-webkit-scrollbar-track {
  background: #f3f4f6;
}

/* ===== Table ===== */
.qna-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.qna-table th,
.qna-table td {
  vertical-align: middle;
  font-size: 13px;
  padding: 12px 12px;
  border-bottom: 1px solid #eef2f7;
}

.qna-table thead th {
  position: sticky;
  top: 0;
  z-index: 1;
  background: #f8fafc;
  font-weight: 900;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
}

.qna-table tbody tr:last-child td {
  border-bottom: 0;
}

/* ===== Row Hover / Active ===== */
.qna-row {
  cursor: pointer;
  transition:
    background 0.15s ease,
    transform 0.05s ease;
}

.qna-row:hover {
  background: #f6fbff;
}

.qna-row:active {
  transform: scale(0.999);
}

/* ===== Title Cell ===== */
.title-cell {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 260px;
}

.title-text {
  font-weight: 800;
  color: #111827;

  /* 제목 길면 줄임표 */
  max-width: 340px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ===== Status Badge ===== */
.status-badge {
  margin-left: auto;
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 999px;
  font-weight: 900;
  border: 1px solid transparent;
  white-space: nowrap;
  letter-spacing: -0.1px;
}

/* 답변완료 */
.status-badge.done {
  background: #eef2ff;
  color: #1d4ed8;
  border-color: #c7d2fe;
}

/* 답변대기 */
.status-badge.wait {
  background: #fff7ed;
  color: #c2410c;
  border-color: #fed7aa;
}

/* ===== Date Chip ===== */
.date-chip {
  display: inline-block;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  color: #374151;
  white-space: nowrap;
}

/* ===== Center Align cells readability ===== */
.text-center {
  color: #374151;
  white-space: nowrap;
}

/* empty row */
.qna-table tbody tr td.text-muted {
  color: #6b7280 !important;
}
</style>
