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
  console.log('클릭된 번호:', no)
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
.qna-row {
  cursor: pointer;
}

.qna-teacher {
  padding: 16px;
}

.content-area {
  min-height: 520px;
}

.content-wrap {
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}

/* 상단 */
.hero-row {
  display: flex;
  justify-content: center;
  margin: 6px 0 18px;
}

.hero-title {
  width: 100%;
  text-align: center;
  font-weight: 900;
  font-size: 22px;
  padding: 12px 14px;
  border: 1px solid #d9d9d9;
  border-radius: 12px;
  background: #fff;
  color: #222;
}

/* 카드 */
.list-card {
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 10px;
  overflow: hidden;
}

.list-header {
  padding: 10px 12px;
  border-bottom: 1px solid #e9e9e9;
  background: #fafafa;
}

.list-title {
  font-weight: 900;
}

/* 테이블 */
.table-wrap {
  overflow-x: auto;
}

.qna-table th,
.qna-table td {
  vertical-align: middle;
  font-size: 13px;
}

.qna-table thead th {
  background: #f4f4f4;
  font-weight: 900;
  border-bottom: 1px solid #e6e6e6;
}

.qna-row:hover {
  background: #f7fbff;
}

/* 제목 + 상태 배지 */
.title-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.title-text {
  font-weight: 700;
}

.status-badge {
  margin-left: auto;
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 999px;
  font-weight: 900;
  border: 1px solid transparent;
  white-space: nowrap;
}

.status-badge.done {
  background: #0b4bb3;
  color: #fff;
}

.status-badge.wait {
  background: #fff;
  border-color: #0b4bb3;
  color: #0b4bb3;
}

.date-chip {
  display: inline-block;
  background: #f2f2f2;
  border: 1px solid #d8d8d8;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}
</style>
