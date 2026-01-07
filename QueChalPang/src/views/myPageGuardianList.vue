<template>
  <div
    class="py-4 container-fluid"
    v-if="myPage.guardianInfo != '' && counter.isLogIn.info.member_authority == 'a1'"
  >
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header pb-0 d-flex justify-content-between align-items-center">
            <h6>지원자 목록</h6>

            <div class="card-header pb-0 d-flex justify-content-end align-items-center gap-2 pt-0z">
              <button class="btn btn-dark btn-sm" @click="goAddDependant">지원자 등록</button>
            </div>
          </div>

          <div class="card-body px-0 pt-0 pb-2">
            <div class="table-responsive p-0">
              <table class="table align-items-center">
                <thead>
                  <tr>
                    <th
                      class="text-center text-uppercase text-secondary text-xxs font-weight-bolder"
                    >
                      이름
                    </th>
                    <th
                      class="text-center text-uppercase text-secondary text-xxs font-weight-bolder"
                    >
                      성별
                    </th>
                    <th
                      class="text-center text-uppercase text-secondary text-xxs font-weight-bolder"
                    >
                      나이
                    </th>
                    <th
                      class="text-center text-uppercase text-secondary text-xxs font-weight-bolder"
                    >
                      등록일
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="member in myPage.guardianInfo" :key="member">
                    <td class="align-middle text-center" @click="goDetail(member.dependant_no)">
                      <p class="text-sm font-weight-bold mb-0">
                        {{ member.dependant_name }}
                      </p>
                    </td>
                    <td class="text-sm text-center" @click="goDetail(member.dependant_no)">
                      {{ member.dependant_gender }}
                    </td>
                    <td class="align-middle text-center" @click="goDetail(member.dependant_no)">
                      {{ member.dependant_birth }}
                    </td>

                    <td class="align-middle text-center" @click="goDetail(member.dependant_no)">
                      {{ member.dependant_date }}
                    </td>
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
<script setup>
import { onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useMyPageStore } from '@/stores/mypage'
import { useCounterStore } from '@/stores/member'

const myPage = useMyPageStore()
const counter = useCounterStore()
const router = useRouter()

onBeforeMount(async () => {
  await myPage.searchGuardianInfo(counter.isLogIn.info.member_id)
  console.log(myPage.guardianInfo)
})

const goDetail = (e) => {
  router.push({ name: 'myPageDetail', params: { id: e } })
}

const goAddDependant = () => {
  router.push({ name: 'myPageAddDependant' })
}

// 지원자 대기 단계
</script>
<style scoped>
/* 거절 row  */
.row-rejected {
  background-color: #f8f9fa;
  opacity: 0.6;
}

.row-rejected td {
  color: #adb5bd;
}

.row-rejected:hover {
  background-color: #f8f9fa;
}
</style>
