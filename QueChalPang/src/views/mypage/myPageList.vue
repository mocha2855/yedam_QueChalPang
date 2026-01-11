<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <!-- 헤더 섹션 -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 class="mb-2" style="color: #2d3748; font-weight: 600">담당지원자 목록</h3>
            <p style="color: #718096; margin: 0">담당하고 있는 지원자 정보를 관리할 수 있습니다</p>
          </div>
          <div class="d-flex gap-2">
            <button
              class="btn"
              @click="goAddDependant"
              style="
                background-color: #5a67d8;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
              "
            >
              지원자 등록
            </button>
            <button
              class="btn"
              :disabled="!isAllChecked && !checkedIds"
              @click="delList"
              style="
                background-color: #fc8181;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
              "
              :style="
                !isAllChecked && !checkedIds ? 'opacity: 0.5; cursor: not-allowed;' : 'opacity: 1;'
              "
            >
              선택 삭제
            </button>
          </div>
        </div>

        <!-- 메인 카드 -->
        <div class="card" style="border: none; border-radius: 16px">
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table align-items-center mb-0">
                <thead style="background-color: #f7fafc">
                  <tr>
                    <th class="text-center" style="padding: 16px">
                      <input type="checkbox" v-model="isAllChecked" />
                    </th>
                    <th
                      class="text-center text-uppercase text-secondary text-xs font-weight-bolder"
                      style="padding: 16px; color: #4a5568"
                    >
                      이름
                    </th>
                    <th
                      class="text-center text-uppercase text-secondary text-xs font-weight-bolder"
                      style="padding: 16px; color: #4a5568"
                    >
                      성별
                    </th>
                    <th
                      class="text-center text-uppercase text-secondary text-xs font-weight-bolder"
                      style="padding: 16px; color: #4a5568"
                    >
                      보호자
                    </th>
                    <th
                      class="text-center text-uppercase text-secondary text-xs font-weight-bolder"
                      style="padding: 16px; color: #4a5568"
                    >
                      장애유형
                    </th>
                    <th
                      class="text-center text-uppercase text-secondary text-xs font-weight-bolder"
                      style="padding: 16px; color: #4a5568"
                    >
                      나이
                    </th>
                    <th
                      class="text-center text-uppercase text-secondary text-xs font-weight-bolder"
                      style="padding: 16px; color: #4a5568"
                    >
                      등록일
                    </th>
                  </tr>
                </thead>
                <tbody v-if="myPage.dependantInfo != ''">
                  <tr
                    v-for="member in myPage.dependantInfo"
                    :key="member.dependant_no"
                    style="transition: background-color 0.2s"
                    @mouseover="$event.currentTarget.style.backgroundColor = '#f7fafc'"
                    @mouseout="$event.currentTarget.style.backgroundColor = 'transparent'"
                  >
                    <!-- 개별 선택 체크박스 -->
                    <td class="align-middle text-center" style="padding: 16px">
                      <input
                        type="checkbox"
                        name="checkedBox"
                        :value="member.member_id"
                        v-model="member.checked"
                        :checked="isAllChecked"
                        @click="checking(member)"
                      />
                    </td>
                    <td
                      class="align-middle text-center"
                      @click="goDetail(member.dependant_no)"
                      style="padding: 16px; cursor: pointer"
                    >
                      <p class="text-sm font-weight-bold mb-0" style="color: #2d3748">
                        {{ member.dependant_name }}
                      </p>
                    </td>
                    <td
                      class="text-sm text-center"
                      @click="goDetail(member.dependant_no)"
                      style="padding: 16px; color: #4a5568; cursor: pointer"
                    >
                      {{ member.dependant_gender }}
                    </td>
                    <td
                      class="text-sm text-center"
                      @click="goDetail(member.dependant_no)"
                      style="padding: 16px; color: #4a5568; cursor: pointer"
                    >
                      {{ member.guardian_name }}
                    </td>
                    <td
                      class="align-middle text-center"
                      @click="goDetail(member.dependant_no)"
                      style="padding: 16px; color: #4a5568; cursor: pointer"
                    >
                      {{ member.disability_name }}
                    </td>
                    <td
                      class="align-middle text-center"
                      @click="goDetail(member.dependant_no)"
                      style="padding: 16px; color: #4a5568; cursor: pointer"
                    >
                      {{ member.age }}
                    </td>
                    <td
                      class="align-middle text-center"
                      @click="goDetail(member.dependant_no)"
                      style="padding: 16px; color: #4a5568; cursor: pointer"
                    >
                      {{ member.dependant_date }}
                    </td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr>
                    <td colspan="7" class="text-center" style="padding: 80px 20px">
                      <div style="color: #718096; font-size: 16px">
                        담당지원자가 없습니다.<br />
                        지원자 등록을 진행해주세요
                      </div>
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
import { useApplicationStore } from '@/stores/application'
import axios from 'axios'
import Swal from 'sweetalert2'

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
        axios.delete('/api/deleteDependantInfo/' + data.dependant_no).then(async (res) => {
          count++
          if (res.data == '' || res.data == null) {
            console.log('count: ', count)
            checkedIds.value = false

            data.checked = false
            await Swal.fire({
              icon: 'error',
              title: '삭제 불가',
              text: `${data.dependant_name}님의 지원서가 존재하여 삭제가 불가합니다.`,
              confirmButtonText: '확인',
            })
          }
          if (count == myPage.dependantInfo.length) {
            myPage.searchDependantInfo(counter.isLogIn.info.member_id)
            await Swal.fire({
              icon: 'success',
              title: '삭제되었습니다!',
              showConfirmButton: false,
              timer: 1500,
            })
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
      axios.delete('/api/deleteDependantInfo/' + data.dependant_no).then(async (res) => {
        if (res.data == '' || res.data == null) {
          await Swal.fire({
            icon: 'error',
            title: '삭제 불가',
            text: `${data.dependant_name}님의 지원서가 존재하여 삭제가 불가합니다.`,
            confirmButtonText: '확인',
          })
        }
        count++
        console.log(count, length)
        if (count == length.value) {
          await Swal.fire({
            icon: 'success',
            title: '삭제되었습니다!',
            showConfirmButton: false,
            timer: 1500,
          })
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
