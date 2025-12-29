<script setup>
//survey이 active 한 건만 목록조회
import { useCenterStore } from '@/stores/center'
import { useRouter, useRoute } from 'vue-router'
import { onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'
import ArgonButton from '@/components/ArgonButton.vue'
const store = useCenterStore()
const route = useRoute()
const { centerInfo } = storeToRefs(store)
const router = useRouter()
const centerList = () => {
  router.push({ name: `centerList` })
}
console.log(route)
onBeforeMount(async () => {
  store.getInfo(getNo())
})
const getNo = () => {
  const routeArr = route.path.split('/')
  return routeArr[2]
}
const getStatus = (status) => {
  return status == 'b1' ? '운영중' : '운영종료'
}
console.log(getNo())
const chageDate = (input) => {
  console.log(input)
  let date = new Date(input)
  console.log(date)
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 `
}
</script>

<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header pb-0">
            <h6>센터 정보</h6>
          </div>
          <div class="card-body px-0 pt-0 pb-2">
            <div class="position-relative">
              <div class="position-absolute bottom-0 end-2">
                <ArgonButton color="danger" class="p-1 m-2">운영종료</ArgonButton>
                <ArgonButton color="info" class="p-1 m-2">정보수정</ArgonButton>
                <ArgonButton color="success" class="p-1 m-2" @click="centerList()"
                  >목록으로</ArgonButton
                >
              </div>
              <!-- <div class="position-absolute bottom-0 end-10">
                <ArgonButton color="info" class="p-1">수정</ArgonButton>
              </div>
              <div class="position-absolute bottom-0 end-6">
                <ArgonButton color="success" class="p-1" @click="centerList()">목록</ArgonButton>
              </div> -->
            </div>
            <div class="table-responsive p-0">
              <table class="table align-items-center">
                <tbody>
                  <tr>
                    <!-- <th><ArgonCheckbox @click="checkAll()" /></th> -->
                    <th class="text-uppercase text-secondary text-sm font-weight-bolder">번호</th>
                    <td class="text-sm">{{ centerInfo.center_no }}</td>
                    <th class="text-uppercase text-secondary text-sm font-weight-bolder">센터명</th>
                    <td class="text-sm">
                      {{ centerInfo.center_name }}
                    </td>
                    <th class="text-uppercase text-secondary text-sm font-weight-bolder">상태</th>
                    <td class="text-sm">{{ getStatus(centerInfo.center_status) }}</td>
                  </tr>
                  <tr>
                    <th class="text-uppercase text-secondary text-sm font-weight-bolder">연락처</th>
                    <td class="text-sm">
                      {{ centerInfo.center_tel }}
                    </td>
                    <th class="text-uppercase text-secondary text-sm font-weight-bolder">이메일</th>
                    <td class="text-sm" colspan="3">
                      {{ centerInfo.center_email }}
                    </td>
                  </tr>
                  <tr>
                    <th class="text-uppercase text-secondary text-sm font-weight-bolder">등록일</th>
                    <td class="text-sm" colspan="2">
                      {{ chageDate(centerInfo.center_start) }}
                    </td>
                    <th class="text-uppercase text-secondary text-sm font-weight-bolder">
                      운영종료일
                    </th>
                    <td class="text-sm" colspan="2">
                      {{
                        centerInfo.center_end == null
                          ? '운영이 종료되지 않았습니다.'
                          : chageDate(centerInfo.center_end)
                      }}
                    </td>
                  </tr>
                  <tr>
                    <th
                      class="text-uppercase text-secondary text-sm font-weight-bolder"
                      colspan="1"
                    >
                      주소
                    </th>
                    <td class="text-sm" colspan="6">
                      {{ centerInfo.center_address }}
                    </td>
                  </tr>
                  <tr></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
