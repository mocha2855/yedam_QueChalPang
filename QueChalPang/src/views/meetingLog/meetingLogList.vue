<!-- views/components/meetingLog/meetingLogList.vue -->
<script setup>
import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useMeetingLogStore } from '@/stores/meetingLog'

const route = useRoute()
const store = useMeetingLogStore()
const { logs, selectedResvId, detailLoading } = storeToRefs(store)

const openByQuery = async () => {
  const resvId = route.query.resvId
  const mode = route.query.mode

  if (!resvId) return

  const row = logs.value.find((x) => String(x.resv_id) === String(resvId))
  if (!row) return

  if (row.has_meeting_log === 1) {
    await store.fetchDetailByResvId(row.resv_id) // mode를 view로 바꾸고 detail 로드
    return
  }

  if (mode === 'write') {
    store.startWrite(row)
  }
}

onMounted(async () => {
  await store.fetchByAppNo(route.params.id)
  await nextTick()
  await openByQuery()
})

watch(
  () => route.params.id,
  async (newId) => {
    if (!newId) return
    await store.fetchByAppNo(newId)
    await nextTick()
    await openByQuery()
  },
)

const pick = (row) => {
  store.select(row.resv_id)
}

// 시간 포맷
const timeText = (start_at) => {
  if (!start_at) return ''
  const d = new Date(start_at)
  return d.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

const statusMap = {
  f1: { label: '확인중', class: 'status-wait' },
  f2: { label: '예약확정', class: 'status-confirm' },
  f3: { label: '상담완료', class: 'status-done' },
  f4: { label: '상담취소', class: 'status-cancel' },
}

const statusInfo = (s) => statusMap[s] ?? { label: s ?? '', class: 'status-default' }

const viewLog = async (row) => {
  await store.fetchDetailByResvId(row.resv_id)
}

const writeLog = (row) => {
  store.startWrite(row)
}
</script>

<template>
  <div>
    <h5 class="mb-3">상담 목록</h5>

    <div v-if="detailLoading" class="text-secondary">불러오는 중...</div>

    <table v-else class="table align-items-center mb-0">
      <thead>
        <tr>
          <th>회차</th>
          <th>상담일</th>
          <th>상담 시작시간</th>
          <th>상태</th>
          <th>상담일지</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="(row, idx) in logs"
          :key="row.resv_id"
          style="cursor: pointer"
          :class="{ 'table-active': row.resv_id === selectedResvId }"
          @click="pick(row)"
        >
          <td>
            <span class="round-badge">{{ logs.length - idx }}회차</span>
          </td>

          <td>{{ row.resv_day?.slice(0, 10) }}</td>

          <td>{{ timeText(row.start_at) }}</td>

          <td>
            <span class="status-badge" :class="statusInfo(row.resv_status).class">
              {{ statusInfo(row.resv_status).label }}
            </span>
          </td>

          <td>
            <button
              v-if="row.has_meeting_log === 1"
              class="btn btn-sm btn-outline-primary"
              @click.stop="viewLog(row)"
            >
              내역보기
            </button>

            <button
              v-else
              class="btn btn-sm"
              :class="
                row.resv_status === 'f4' ? 'btn-outline-secondary disabled' : 'btn-outline-primary'
              "
              :disabled="row.resv_status === 'f4'"
              @click.stop="row.resv_status !== 'f4' && writeLog(row)"
            >
              작성하기
            </button>
          </td>
        </tr>

        <tr v-if="logs.length === 0">
          <td colspan="5" class="text-center text-secondary py-4">상담내역이 없습니다.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.round-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #344767;
  background: rgba(94, 114, 228, 0.12);
}

.status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
}

.status-wait {
  background: rgba(255, 193, 7, 0.15);
  color: #b45309;
}

.status-confirm {
  background: rgba(59, 130, 246, 0.15);
  color: #1d4ed8;
}

.status-done {
  background: rgba(16, 185, 129, 0.15);
  color: #047857;
}

.status-cancel {
  background: rgba(239, 68, 68, 0.15);
  color: #b91c1c;
}

.status-default {
  background: rgba(107, 114, 128, 0.15);
  color: #374151;
}

tbody tr {
  transition: background 0.15s ease;
}

tbody tr:hover {
  background: rgba(94, 114, 228, 0.06);
}

.row-active {
  background: rgba(94, 114, 228, 0.12) !important;
}
</style>
