<script setup>
//survey이 active 한 건만 목록조회
import { useCenterStore } from '@/stores/center'
import { useRouter } from 'vue-router'
import { onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'
import ArgonButton from '@/components/ArgonButton.vue'
// import ArgonCheckbox from '@/components/ArgonCheckbox.vue'
const store = useCenterStore()
const { centerList } = storeToRefs(store)
const router = useRouter()
const centerInfo = (no) => {
  router.push({ path: `/center/${no}` })
}
const centerAdd = () => {
  router.push({ name: 'centerAdd' })
}
onBeforeMount(async () => {
  store.getCenterList()
})
// const checked = ref(false)
const getStatus = (status) => {
  return status == 'b1' ? '운영' : '운영종료'
}
// const checkAll = () => {
//   if (checked.value == false) {
//     checked.value = true
//   } else {
//     checked.value = false
//   }
// }
</script>

<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header pb-0">
            <h6>센터목록</h6>
          </div>
          <div class="card-body px-0 pt-0 pb-2">
            <div class="position-relative">
              <!-- <div class="position-absolute bottom-0 end-8">
                <ArgonButton color="danger" class="p-1 mr-1">선택 삭제</ArgonButton>
              </div> -->
              <div class="position-absolute bottom-0 end-2">
                <ArgonButton color="success" class="p-1" @click="centerAdd()"
                  >센터 등록</ArgonButton
                >
              </div>
            </div>
            <div class="table-responsive p-0">
              <table class="table align-items-center">
                <thead>
                  <tr>
                    <!-- <th><ArgonCheckbox @click="checkAll()" /></th> -->
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder">번호</th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder">
                      센터명
                    </th>

                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder">
                      연락처
                    </th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder">상태</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="center in centerList" :key="center.center_no">
                    <!-- <td><ArgonCheckbox :id="center.center_no" :checked="checked" /></td> -->
                    <td class="text-sm">{{ center.center_no }}</td>
                    <td class="text-sm" @click="centerInfo(center.center_no)">
                      {{ center.center_name }}
                    </td>
                    <td class="text-sm" @click="centerInfo(center.center_no)">
                      {{ center.center_tel }}
                    </td>
                    <td class="text-sm">{{ getStatus(center.center_status) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
