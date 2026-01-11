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
                @click="delList"
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
                <tbody v-if="myPage.dependantInfo != ''">
                  <tr
                    v-for="member in myPage.dependantInfo"
                    :key="member.dependant_no"
                    style="cursor: pointer"
                  >
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
                <tbody v-else>
                  <h5>
                    담당지원자가 없습니다.<br />
                    지원자 등록을 진행해주세요
                  </h5>
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
import { useApplicationStore } from '@/stores/application'
import axios from 'axios'

const application = useApplicationStore()
const myPage = useMyPageStore()
const counter = useCounterStore()
const router = useRouter()

onBeforeMount(async () => {
  await myPage.searchDependantInfo(counter.isLogIn.info.member_id)
  await application.checkdependantInfo()
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
let length = ref(0)

const checking = (data) => {
  console.log(data)
  console.log('checkedIds: ', checkedIds.value)
  myPage.dependantInfo.forEach((info) => {
    if (info.dependant_no == data.dependant_no) {
      data.checked = !data.checked
      if (data.checked == true) {
        length.value++
        checkedIds.value = true
      } else {
        length.value--
        checkedIds.value = false
      }
      return
    }
  })
}
// 지원자 대기 단계

// 지원자 삭제
const delList = async () => {
  // 전체 삭제
  let count = 0
  if (isAllChecked.value == true) {
    myPage.dependantInfo.forEach((data) => {
      data.checked = true
      if (data.checked == true) {
        axios //
          .delete('/api/deleteDependantInfo/' + data.dependant_no)
          .then((res) => {
            count++
            if (res.data == '' || res.data == null) {
              console.log('count: ', count)
              checkedIds.value = false

              data.checked = false
              alert(`${data.dependant_name}님의 지원서가 존재하여 삭제가 불가합니다.`)
            }
            if (count == myPage.dependantInfo.length) {
              myPage.searchDependantInfo(counter.isLogIn.info.member_id)
              alert('삭제완료')
              return
            }
          })
      }
    })
    isAllChecked.value = false
    return
  }
  // 단건삭제

  myPage.dependantInfo.forEach((data) => {
    length
    if (data.checked == true) {
      axios //
        .delete('/api/deleteDependantInfo/' + data.dependant_no)
        .then((res) => {
          if (res.data == '' || res.data == null) {
            alert(`${data.dependant_name}님의 지원서가 존재하여 삭제가 불가합니다.`)
          }
          count++
          console.log(count, length)
          if (count == length.value) {
            alert('삭제완료')
            myPage.searchDependantInfo(counter.isLogIn.info.member_id)
            checkedIds.value = false
            data.checked = false
          }
        })
    }
  })
}
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
