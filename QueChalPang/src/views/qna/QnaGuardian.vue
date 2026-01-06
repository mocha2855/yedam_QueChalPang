<!-- views/QnaGuardian.vue -->
<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

import { useCounterStore } from '@/stores/member'
import { storeToRefs } from 'pinia'
//import { useRouter } from 'vue-router'

const counterStore = useCounterStore()
const { isLogIn } = storeToRefs(counterStore)

//const router = useRouter();

const memberId = computed(()=> isLogIn.value?.info?.member_id)

const statusMap = {
  k1: { label: '답변완료', class: 'status-done' },
  k2: { label: '답변미등록', class: 'status-wait' },
}

const categoryMap = {
  c1: { label: '상담' },
  c2: { label: '지원자 등록'},
  c3: { label: '지원계획서'},
  c4: { label: '지원결과서'},
  c5: { label: '기타'},
}

const statusInfo = (s) => {
  return statusMap[s] ?? { label: s ?? '', class: 'status-default' }
}
const categoryInfo = (c) => {
  return categoryMap[c] ?? { label: c ?? '' }
}

const rows = ref([])

//백에서 받은 데이터를 프론트에 뿌리기위한 작업
const filteredRows = computed(() => {
  return rows.value.map((r) => {
    
    const s = statusInfo(r.status)         
    const c = categoryInfo(r.category)     

    return {
      title: r.qna_title,
      category: c.label,
      writer: r.author_name,
      manager: r.manager_name ?? '미배정',
      responder: r.respondent_name ?? (r.respondent ? r.respondent : ''),
      date: String(r.date).slice(0, 10).replaceAll('-', '. ')+'.',
      status: s.label,
    }
  })
})

const fetchQlist = async()=>{
  if(!memberId.value) return
  
  const res = await axios.get(`/api/qlistByMid/${memberId.value}`)
  rows.value = res.data;
}

onMounted(fetchQlist)

// const selectedRow = ref(null)


//질문작성하기 버튼
const qnaWrite = () => {
  console.log('질문작성 클릭')
}

</script>

<template>
  <div class="qna-guardian">
   
      <!-- 오른쪽 메인 콘텐츠 -->
      <section class="content-area content-wrap">
        <!-- 상단 버튼 -->
        <div class="hero-row">
          <button type="button" class="hero-btn" @click="qnaWrite">1:1 질문작성</button>
        </div>

        <!-- 질문내역테이블 -->
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
                  <th style="width: 100px">작성자</th>
                  <th style="width: 100px">담당자</th>
                  <th style="width: 100px">답변자</th>
                  <th style="width: 120px">문의 날짜</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="r in filteredRows" :key="r.no" class="qna-row">
                  <td>
                    <div class="title-cell">
                      <span class="title-text">{{ r.title }}</span>

                      <span
                        class="status-badge"
                        :class="r.status === '답변완료' ? 'done' : 'wait'"
                      >
                        {{ r.status }}
                      </span>
                    </div>
                  </td>

                  <td class="text-center">{{ r.category }}</td>
                  <td class="text-center">{{ r.writer }}</td>
                  <td class="text-center">{{ r.manager }}</td>
                  <td class="text-center">{{ r.responder || '-' }}</td>
                  <td class="text-center">
                    <span class="date-chip">{{ r.date }}</span>
                  </td>
                </tr>

                <tr v-if="filteredRows.length === 0">
                  <td colspan="7" class="text-center py-4 text-muted">조회 결과가 없습니다.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
</template>

<style scoped>
.qna-guardian {
  padding: 16px;
}

.qna-grid {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 20px;
  align-items: start;
}

.filter-card {
  background: #f6f6f6;
  border: 1px solid #d9d9d9;
  padding: 14px;
  border-radius: 8px;
}

.filter-title {
  font-weight: 800;
  margin-bottom: 10px;
}

.filter-section {
  margin: 14px 0;
}

.filter-label {
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #444;
}

.date-range {
  display: grid;
  grid-template-columns: 1fr 24px 1fr;
  gap: 6px;
  align-items: center;
}

.date-dash {
  text-align: center;
  color: #666;
  font-weight: 700;
}

.pill-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pill {
  border: 1px solid #bfbfbf;
  background: #fff;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  cursor: pointer;
  line-height: 1;
  transition: 0.15s;
}

.pill:hover {
  border-color: #2f6df6;
}

.pill.active {
  background: #ff8a00;
  border-color: #ff8a00;
  color: #fff;
  font-weight: 800;
}


.content-area {
  min-height: 520px;
}

.content-wrap {
  max-width: 900px;   
  margin: 0 auto;      
  width: 100%;
}

.hero-row {
  display: flex;
  justify-content: center;
  margin: 6px 0 18px;
}

.hero-btn {
  background: #0b4bb3;
  color: #fff;
  border: none;
  padding: 18px 40px;
  border-radius: 12px;
  font-size: 28px;
  font-weight: 900;
  letter-spacing: -0.5px;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  transition: 0.15s;
}

.hero-btn:hover {
  transform: translateY(-1px);
  background: #083f99;
}

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

.title-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-badge {
  margin-left: auto; 
}
</style>
