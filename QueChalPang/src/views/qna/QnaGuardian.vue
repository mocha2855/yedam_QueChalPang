<!-- views/QnaGuardian.vue -->
<script setup>
import { computed, onMounted, watch } from 'vue'
import { useCounterStore } from '@/stores/member'
import { useQnaStore } from '@/stores/qna'
import { storeToRefs } from 'pinia'
import { useModalStore } from '@/stores/modal'
// import { useRouter } from 'vue-router'
import router from '@/router'
// import QnaGuardianDetail from './QnaGuardianDetail.vue'

const counterStore = useCounterStore()
const { isLogIn } = storeToRefs(counterStore)

const qnaStore = useQnaStore()
const modal = useModalStore()
const { filteredRows } = storeToRefs(qnaStore)

const memberId = computed(() => isLogIn.value?.info?.member_id)

const fetch = () => qnaStore.fetchByMemberId(memberId.value)

onMounted(fetch)

watch(memberId, (v) => {
  if (v) fetch()
})

const qnaWrite = () => {
  modal.open('qnaAdd')
}

const goDetail = (no) => {
  if (no) {
    router.push({ name: 'qnaGuardianDetail', params: { qnaNo: no } })
  }
}
</script>

<template>
  <div class="qna-guardian">
    <section class="content-wrap">
      <header class="page-header">
        <div class="header-left">
          <h3 class="page-title">문의내역</h3>
          <p class="page-sub">센터 담당자에게 1:1 문의를 남기고 답변 상태를 확인할 수 있어요.</p>
        </div>

        <div class="header-right">
          <button type="button" class="btn-primary-soft" @click="qnaWrite">1:1 질문작성</button>
        </div>
      </header>

      <!-- 카드 -->
      <div class="list-card">
        <!-- 테이블 -->
        <div class="table-wrap">
          <table class="qna-table">
            <thead>
              <tr>
                <th class="col-title">제목</th>
                <th class="col-sm">지원자</th>
                <th class="col-sm">카테고리</th>
                <th class="col-xs">작성자</th>
                <th class="col-xs">담당자</th>
                <th class="col-xs">답변자</th>
                <th class="col-date">문의 날짜</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="r in filteredRows" :key="r.no" class="qna-row" @click="goDetail(r.no)">
                <td class="td-title">
                  <div class="title-cell">
                    <span class="title-text" :title="r.title">{{ r.title }}</span>

                    <span class="status-badge" :class="r.status === '답변완료' ? 'done' : 'wait'">
                      {{ r.status }}
                    </span>
                  </div>
                </td>

                <td class="text-center">{{ r.dependant }}</td>
                <td class="text-center">{{ r.category }}</td>
                <td class="text-center">{{ r.writer }}</td>
                <td class="text-center">{{ r.manager }}</td>
                <td class="text-center">{{ r.responder || '-' }}</td>
                <td class="text-center">
                  <span class="date-chip">{{ r.date }}</span>
                </td>
              </tr>

              <tr v-if="filteredRows.length === 0">
                <td colspan="7" class="empty">
                  <div class="empty-box">
                    <div class="empty-title">조회 결과가 없습니다.</div>
                    <div class="empty-sub">새 문의를 작성해보세요.</div>
                    <button type="button" class="btn-outline-soft" @click="qnaWrite">
                      + 1:1 질문작성
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <p class="footnote">* 제목을 클릭하면 상세 페이지로 이동합니다.</p>
    </section>
  </div>
</template>

<style scoped>
.qna-guardian {
  padding: 24px 16px;
}

.content-wrap {
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin: 6px 0 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid #e9ecef;
}

.page-title {
  margin: 0;
  font-size: 22px;
  font-weight: 900;
  letter-spacing: -0.4px;
  color: #1f2a37;
}

.page-sub {
  margin: 6px 0 0;
  font-size: 13px;
  color: #6b7280;
}

.btn-primary-soft {
  border: 1px solid #0b4bb3;
  background: #0b4bb3;
  color: #fff;
  padding: 10px 14px;
  border-radius: 12px;
  font-weight: 900;
  letter-spacing: -0.2px;
  cursor: pointer;
  transition: 0.15s;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
}

.btn-primary-soft:hover {
  transform: translateY(-1px);
  background: #083f99;
  border-color: #083f99;
}

.btn-outline-soft {
  border: 1px solid #0b4bb3;
  background: #fff;
  color: #0b4bb3;
  padding: 9px 12px;
  border-radius: 12px;
  font-weight: 900;
  cursor: pointer;
  transition: 0.15s;
}

.btn-outline-soft:hover {
  background: #f3f7ff;
}

.list-card {
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.06);
}

.table-wrap {
  overflow-x: auto;
}

.qna-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 920px;
}

.qna-table thead th {
  position: sticky;
  top: 0;
  z-index: 1;
  background: #f8fafc;
  color: #374151;
  font-weight: 900;
  font-size: 12px;
  letter-spacing: -0.2px;
  text-align: center;
  padding: 12px 10px;
  border-bottom: 1px solid #e9ecef;
}

.qna-table tbody td {
  font-size: 13px;
  color: #111827;
  padding: 14px 10px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.qna-row {
  cursor: pointer;
  transition: background 0.15s ease;
}

.qna-row:hover {
  background: #f7fbff;
}

.col-title {
  text-align: left !important;
  min-width: 360px;
}

.col-sm {
  width: 140px;
}

.col-xs {
  width: 110px;
}

.col-date {
  width: 140px;
}

.td-title {
  text-align: left;
}

.title-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.title-text {
  font-weight: 800;
  letter-spacing: -0.2px;
  max-width: 520px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-badge {
  margin-left: auto;
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 999px;
  font-weight: 900;
  white-space: nowrap;
  border: 1px solid transparent;
}

.status-badge.done {
  background: #0b4bb3;
  color: #fff;
}

.status-badge.wait {
  background: #fff;
  color: #0b4bb3;
  border-color: #0b4bb3;
}

.date-chip {
  display: inline-block;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  color: #374151;
}

.empty {
  padding: 0 !important;
  border-bottom: 0 !important;
}

.empty-box {
  padding: 32px 16px;
  text-align: center;
  color: #6b7280;
}

.empty-title {
  font-weight: 900;
  color: #111827;
  font-size: 15px;
}

.empty-sub {
  margin-top: 6px;
  font-size: 13px;
  margin-bottom: 14px;
}

.footnote {
  margin: 10px 2px 0;
  font-size: 12px;
  color: #6b7280;
}

@media (max-width: 768px) {
  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .btn-primary-soft {
    width: 100%;
    justify-content: center;
  }
}
</style>
