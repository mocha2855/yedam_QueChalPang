<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header pb-0 d-flex justify-content-between align-items-center">
            <h6>담당지원자 목록</h6>

            <div class="card-header pb-0 d-flex justify-content-end align-items-center gap-2 pt-0z">
              <button class="btn btn-dark btn-sm" @click="goAddDependant">지원자 등록</button>

              <button
                class="btn btn-outline-danger btn-sm"
                :disabled="!isAllChecked && !checkedIds"
              >
                선택 삭제
              </button>
            </div>
          </div>

          <div class="card-body px-0 pt-0 pb-2">
            <div class="table-responsive p-0">
              <table class="table align-items-center">
                <thead>
                  <tr>
                    <!--전체 선택 체크 박스-->
                    <th class="text-center">
                      <input type="checkbox" v-model="isAllChecked" />
                    </th>
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
                      보호자
                    </th>
                    <th
                      class="text-center text-uppercase text-secondary text-xxs font-weight-bolder"
                    >
                      대기단계
                    </th>
                    <th
                      class="text-center text-uppercase text-secondary text-xxs font-weight-bolder"
                    >
                      장애유형
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
                  <tr v-for="member in myPage.dependantInfo" :key="member.dependant_no">
                    <!-- 개별 선택 체크박스 -->
                    <td class="align-middle text-center">
                      <input
                        type="checkbox"
                        name="checkedBox"
                        :value="member.member_id"
                        v-model="member.checked"
                        :checked="isAllChecked"
                        @click="checking(member)"
                      />
                    </td>
                    <td class="align-middle text-center" @click="goDetail(member.dependant_no)">
                      <p class="text-sm font-weight-bold mb-0">
                        {{ member.dependant_name }}
                      </p>
                    </td>
                    <td class="text-sm text-center" @click="goDetail(member.dependant_no)">
                      {{ member.dependant_gender }}
                    </td>
                    <td class="text-sm text-center" @click="goDetail(member.dependant_no)">
                      {{ member.guardian_name }}
                    </td>
                    <td class="text-sm text-center" @click="goDetail(member.dependant_no)">
                      {{ member.guardian_name }}
                    </td>
                    <td class="align-middle text-center" @click="goDetail(member.dependant_no)">
                      {{ member.disability_name }}
                    </td>
                    <td class="align-middle text-center" @click="goDetail(member.dependant_no)">
                      {{ member.age }}
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
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMyPageStore } from '@/stores/mypage'
import { useCounterStore } from '@/stores/member'

const myPage = useMyPageStore()
const counter = useCounterStore()
const router = useRouter()

onBeforeMount(async () => {
  await myPage.searchDependantInfo(counter.isLogIn.info.member_id)
})

const goDetail = (e) => {
  router.push({ name: 'myPageDetail', params: { id: e } })
}

const goAddDependant = () => {
  router.push({ name: 'myPageAddDependant' })
}

// 전체 체크
const isAllChecked = ref(false)

// 개별 체크
const checkedIds = ref(false)

const checking = (data) => {
  console.log(data)
  console.log('checkedIds: ', checkedIds.value)
  myPage.dependantInfo.forEach((info) => {
    if (info.dependant_no == data.dependant_no) {
      data.checked = true
      checkedIds.value = !checkedIds.value
      return
    }
  })
}

// 지원자 삭제
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
