<!-- views/ReservationGuardianHistory.vue -->
<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCounterStore } from '@/stores/member'
import axios from 'axios'

const counterStore = useCounterStore()
const { isLogIn } = storeToRefs(counterStore)

const guardianId = computed(() => isLogIn.value?.info?.member_id)

const statusMap = {
  f1: { label: '확인중', class: 'status-wait' },
  f2: { label: '예약확정', class: 'status-confirm' },
  f3: { label: '상담완료', class: 'status-done' },
  f4: { label: '상담취소', class: 'status-cancel' },
}

const rows = ref([])

//statusMap[s]값이 statusMap에 있으면 그 값을,
//A ?? B : 값은 있지만 map안에 없으면 A를, 값이 undefiend, null이면 B를 쓴다.
//const statusText = (s) => statusMap[s] ?? s ?? ''

const statusInfo = (s) => {
  return statusMap[s] ?? { label: s ?? '', class: 'status-default' }
}

const dateText = (dt) => (dt ? String(dt).slice(0, 10) : '')
const timeText = (dt) => (dt ? String(dt).slice(11, 16) : '') // "HH:MM"

const fetchHistory = async () => {
  if (!guardianId.value) return

  const res = await axios.get(`/api/gresvByDate/${guardianId.value}`)
  rows.value = res.data ?? []
}

onMounted(fetchHistory)
</script>
<template>
  <div class="page-wrap">
    <div class="card history-card">
      <div class="card-header">
        <h2 class="page-title">상담예약 리스트</h2>
        <p class="page-sub">나의 상담 예약 내역을 확인할 수 있습니다.</p>
      </div>

      <div class="card-body px-0 pt-0 pb-2">
        <div class="table-responsive p-0">
          <table class="table align-items-center mb-0 history-table">
            <thead>
              <tr>
                <th>상담일</th>
                <th>상담시작시간</th>
                <th>지원자</th>
                <th>신청서번호 & 제출일</th>
                <th>상담 상태</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="r in rows" :key="r.resv_id">
                <td>{{ dateText(r.start_at) }}</td>
                <td>{{ timeText(r.start_at) }}</td>
                <td>{{ r.dependant_name }}</td>
                <td>
                  <span class="app-no">{{ r.application_no }}</span>
                  <span class="muted">(제출 {{ dateText(r.created_at) }})</span>
                </td>
                <td>
                  <span class="status-badge" :class="statusInfo(r.status).class">
                    {{ statusInfo(r.status).label }}
                  </span>
                </td>
              </tr>

              <tr v-if="rows.length === 0">
                <td colspan="5" class="empty">예약 내역이 없습니다.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-top {
  max-width: 1300px;
  margin: 0 auto 10px auto;
  display: flex;
  justify-content: flex-start;
}

.back-btn {
  border-radius: 10px;
  font-weight: 700;
}

.page-wrap {
  max-width: 100%;
  margin: 0 auto;
}

.history-card {
  border: 1px solid #eef1f5;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(17, 24, 39, 0.06);
  overflow: hidden;
  background: #fff;
}

.card-header {
  padding: 18px 20px;
  border-bottom: 1px solid #eef1f5;
  background: #fff;
}

.page-title {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.2px;
}

.page-sub {
  margin: 6px 0 0 0;
  font-size: 0.95rem;
  color: #6b7280;
}

.history-table {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
}

.history-table thead th {
  position: sticky;
  top: 0;
  z-index: 1;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;

  padding: 14px 16px;
  font-size: 0.9rem;
  font-weight: 700;
  color: #111827;
  white-space: nowrap;
}

.history-table tbody td {
  padding: 14px 16px;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
  font-size: 0.95rem;
  color: #111827;
}

.history-table tbody tr:hover {
  background: #f9fafb;
}

.app-no {
  font-weight: 800;
  color: #111827;
}

.muted {
  margin-left: 8px;
  font-size: 0.85rem;
  color: #6b7280;
}

.empty {
  text-align: center;
  padding: 22px 0;
  color: #6b7280;
  font-weight: 600;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 800;
  min-width: 92px;
}

.status-wait {
  background: rgba(59, 130, 246, 0.15);
  color: #1d4ed8;
}

.status-confirm {
  background: rgba(16, 185, 129, 0.15);
  color: #047857;
}

.status-done {
  background: rgba(17, 24, 39, 0.12);
  color: #111827;
}

.status-cancel {
  background: rgba(239, 68, 68, 0.15);
  color: #b91c1c;
}

.status-default {
  background: rgba(107, 114, 128, 0.15);
  color: #374151;
}

.history-table thead th,
.history-table tbody td {
  padding: 14px 16px;
}

.history-table thead th:first-child,
.history-table tbody td:first-child {
  padding-left: 28px;
}

.history-table thead th:last-child,
.history-table tbody td:last-child {
  padding-right: 20px;
  text-align: left;
}

.status-badge {
  min-width: 80px;
}
</style>
