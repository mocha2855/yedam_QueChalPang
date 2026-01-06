<script setup>
defineProps({
  list: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['select'])

const selectCenter = (center) => {
  emit('select', center)
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
              <th class="text-secondary text-xxs font-weight-bolder opacity-7">선택</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="center in list" :key="center.id">
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
              <td>
                <button class="btn btn-sm btn-primary" @click="selectCenter(center)">선택</button>
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
