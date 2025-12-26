<!-- src/components/ReservationCright.vue -->
<script setup>
import { computed } from 'vue'

const props = defineProps({
  selectedDate: { type: Date, required: true },
  reservations: { type: Array, default: () => [] },
})

// 선택한 날짜표시
const selectedLabel = computed(() =>
  props.selectedDate ? props.selectedDate.toLocaleDateString() : '',
)

//시간값 변환하기 꼭필요
const timeText = (start_at) => {
  if (!start_at) return ''
  const d = new Date(start_at)

  return d.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}
</script>

<template>
  <div class="card p-3 h-100">
    <div class="card-header pb-0">
      <h6>{{ selectedLabel }}</h6>
    </div>

    <div class="card-body px-0 pt-0 pb-2">
      <div v-if="reservations.length === 0" class="px-3 py-3 text-muted">예약 없음</div>

      <div v-else class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                보호자
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                지원자
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                상담시작시간
              </th>
              <th class="text-secondary opacity-7"></th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="r in reservations" :key="r.resv_id ?? r.start_at">
              <td>
                <p class="text-xs font-weight-bold mb-0">{{ r.guardian_name }}</p>
              </td>

              <td class="align-middle text-center text-sm">
                <span class="text-xs font-weight-bold">{{ r.dependant_name }}</span>
              </td>

              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">
                  {{ timeText(r.start_at) }}
                </span>
              </td>

              <td class="align-middle">
                <a href="javascript:;" class="text-secondary font-weight-bold text-xs">
                  상담일지 작성
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
