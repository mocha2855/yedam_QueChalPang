<!-- src/components/ReservationHistory.vue -->
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
  <div class="card">
    <div class="card-header pb-0">
      <div class="topbar">
        <RouterLink
          :to="{
            name: 'ReservationGuardian',
          }"
          class="back-link"
        >
          ← 목록으로 돌아가기
        </RouterLink>
      </div>
      <h6>승인 대기 중인 상담예약</h6>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th class="text-secondary">상담일</th>
              <th class="text-secondary">상담시작시간</th>
              <th class="text-secondary">지원자</th>
              <th class="text-secondary">신청서번호 & 제출일</th>
              <th class="text-secondary">상담 상태</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in rows" :key="r.resv_id">
              <td>{{ dateText(r.start_at) }}</td>
              <td>{{ timeText(r.start_at) }}</td>
              <td>{{ r.dependant_name }}</td>
              <td>
                {{ r.application_no }}
                <span class="text-muted small ms-2">(제출 {{ dateText(r.created_at) }})</span>
              </td>
              <td>
                <span class="status-badge" :class="statusInfo(r.status).class">
                  {{ statusInfo(r.status).label }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style>
.status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
  text-align: center;
  min-width: 72px;
}

.status-wait {
  background-color: #a2d1ff;
  color: rgb(0, 78, 194);
}

.status-confirm {
  background-color: #198754;
}

.status-done {
  background-color: #212529;
}

.status-cancel {
  background-color: #dc3545;
}

.status-default {
  background-color: #ebebeb;
}

.topbar {
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
}
</style>
