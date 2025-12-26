<!-- src/components/ReservationCright.vue -->
 <!-- 자식 -->
<script setup>
import { computed } from 'vue'

const props = defineProps({
  selectedDate: { type: Date, required: true }, //부모가 무조건 selectedDate를 내려줘야 함 
  reservations: { type: Array, default: () => [] },
})

// 선택한 날짜표시
const selectedLabel = computed(() =>
  props.selectedDate ? props.selectedDate.toLocaleDateString() : '',
)

//시간값 변환하기 꼭필요!!
const timeText = (start_at) => {
  if (!start_at) return ''
  const d = new Date(start_at)

  //toLocaleTimeString : 지역규칙 이용해 시간문자열 만듦
  return d.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

//예약상태 변환하기 !!! 
const statusMap = {
  f1: '확인중',
  f2: '예약확정',
  f3: '상담완료',
  f4: '취소',
}

const statusText = (status) => {
  return statusMap[status] ?? status
}
</script>

<template>
  <div class="card p-3 h-100">
    <div class="card-header pb-0">
      <h6>{{ selectedLabel }}</h6>
    </div>

    <div class="card-body px-0 pt-0 pb-2">
      <div v-if="reservations.length === 0" class="px-3 py-3 text-muted"> 해당 날짜에 예약이 없습니다.
</div>

      <div v-else class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th class="text-center text-primary">
                보호자
              </th>
                   <th class="text-center text-primary">

                지원자
              </th>
                    <th class="text-center text-primary">

                상담시작시간
              </th>
              <th class="text-center text-primary">
                상태
              </th>
              <th class="text-center text-primary">일지</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="r in reservations" :key="r.resv_id ?? r.start_at">
              <td class="align-middle text-center text-sm">
                <span class="text-xs font-weight-bold text-dark mb-0">{{ r.guardian_name }}</span>
              </td>

              <td class="align-middle text-center text-sm">
                <span class="text-xs font-weight-bold text-dark">{{ r.dependant_name }}</span>
              </td>

              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold text-dark ">
                  {{ timeText(r.start_at) }}
                </span>
              </td>

               <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold text-dark">
                  {{statusText(r.status)}}
                </span>
              </td>

               <td class="align-middle text-center">
                <button>
                  작성
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
