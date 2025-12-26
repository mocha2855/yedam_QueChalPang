<!-- src/components/ReservationTable.vue -->
<script setup>
const { pendingReservedList } = defineProps({
  pendingReservedList: { type: Array, required: true },
})

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
}

const statusText = (status) => {
  return statusMap[status] ?? status
}
</script>

<template>
  <div class="card">
    <div class="card-header pb-0">
      <h6>승인 대기 중인 상담예약</h6>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                보호자
              </th>
              <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
              >
                지원자
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                예약 날짜
              </th>
                <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                예약 상태
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                상담 시간
              </th>
              <th class="text-secondary opacity-7"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in pendingReservedList" :key="r.resv_id">
              <td>
                <div class="d-flex px-2 py-1">
                  <div class="d-flex flex-column justify-content-center">
                    <h6 class="mb-0 text-sm">{{ r.guardian_name }}</h6>
                  </div>
                </div>
              </td>
              <td>
                <p class="text-xs font-weight-bold mb-0">{{ r.dependant_name }}</p>
              </td>
              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold"
                  >{{ r.start_at.slice(0, 10) }}</span
                >
              </td>
              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold"
                  >{{ statusText(r.resv_status)}}</span
                >
              </td>
              <td class="align-middle text-center">
                  {{ timeText(r.start_at)}}
              </td>
              <td class="align-middle">
                <a
                  href="javascript:;"
                  class="text-secondary font-weight-bold text-xs"
                  data-toggle="tooltip"
                  data-original-title="Edit user"
                  >수락/반려</a
                >
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
