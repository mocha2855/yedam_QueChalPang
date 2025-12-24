<script setup>
import { defineProps } from 'vue'
const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
})
const selectCenter = (center) => {
  console.log(props)
  // 1. 부모 창(window.opener)이 살아있는지 확인
  if (window.opener && !window.opener.closed) {
    // 2. 부모 창에 등록된 receiveCenterData 함수 실행
    window.opener.receiveCenterData(center)
    // 3. 데이터 보냈으니 팝업 창 닫기
    window.close()
  } else {
    alert('부모 창을 찾을 수 없습니다.')
  }
}
</script>
<template>
  <div class="card mb-4">
    <div class="card-header pb-0">
      <h6>센터 목록</h6>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table class="table align-items-center justify-content-center mb-0">
          <thead>
            <tr>
              <th class="text-secondary text-xxs font-weight-bolder opacity-7">센터이름</th>
              <th class="text-secondary text-xxs font-weight-bolder opacity-7">주소</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="center in list" :key="center.id" @click="selectCenter(center)">
              <td>
                <div class="d-flex px-2">
                  <div class="my-auto">
                    <h6 class="mb-0 text-sm">
                      {{ center.center_name }}
                    </h6>
                  </div>
                </div>
              </td>
              <td>
                <div class="d-flex px-2">
                  <div class="my-auto">
                    <h6 class="mb-0 text-sm">{{ center.center_address }}</h6>
                  </div>
                </div>
              </td>
            </tr>
            <tr v-if="list.length === 0">
              <td colspan="3" class="text-center py-4 text-secondary">검색 결과가 없습니다.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
