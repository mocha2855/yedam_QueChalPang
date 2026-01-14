<template>
  <div class="fixed-top d-flex justify-content-end p-3 mt-6"></div>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div v-if="myPage.managerInfo.data != ''">
          <!-- 헤더 섹션 -->
          <div class="mb-4">
            <h3 class="mb-2" style="color: #2d3748; font-weight: 600">내 정보</h3>
            <p style="color: #718096">담당자 계정 정보를 확인하고 수정할 수 있습니다</p>
          </div>

          <!-- 메인 카드 -->
          <div class="card shadow-sm" style="border: none; border-radius: 16px">
            <div class="card-body p-5">
              <form role="form">
                <!-- 기관명 -->
                <div class="mb-4">
                  <label
                    class="form-label"
                    style="color: #4a5568; font-weight: 500; font-size: 14px"
                    >기관명</label
                  >
                  <argon-input
                    id="name"
                    type="text"
                    v-model="myPage.managerInfo.center_name"
                    aria-label="Name"
                    disabled
                    style="background-color: #f7fafc"
                  />
                </div>

                <!-- 아이디 -->
                <div class="mb-4">
                  <label
                    class="form-label"
                    style="color: #4a5568; font-weight: 500; font-size: 14px"
                    >아이디</label
                  >
                  <argon-input
                    v-model="myPage.managerInfo.member_id"
                    disabled
                    style="background-color: #f7fafc"
                  />
                </div>

                <!-- 연락처 -->
                <div class="mb-4">
                  <label
                    class="form-label"
                    style="color: #4a5568; font-weight: 500; font-size: 14px"
                    >연락처</label
                  >
                  <argon-input
                    id="tel"
                    v-model="myPage.managerInfo.member_phone"
                    v-bind:disabled="changeMangerInfo"
                    :style="changeMangerInfo ? 'background-color: #f7fafc' : ''"
                  />
                </div>

                <!-- 이메일 -->
                <div class="mb-4">
                  <label
                    class="form-label"
                    style="color: #4a5568; font-weight: 500; font-size: 14px"
                    >이메일</label
                  >
                  <argon-input
                    id="email"
                    type="email"
                    v-model="myPage.managerInfo.member_email"
                    aria-label="email"
                    v-bind:disabled="changeMangerInfo"
                    :style="changeMangerInfo ? 'background-color: #f7fafc' : ''"
                  />
                </div>

                <!-- 비밀번호 변경 -->
                <div v-if="!changeMangerInfo" class="mb-4">
                  <label
                    class="form-label"
                    style="color: #4a5568; font-weight: 500; font-size: 14px"
                    >비밀번호 변경</label
                  >

                  <div class="mb-3">
                    <label class="form-label" style="color: #718096; font-size: 13px"
                      >현재 비밀번호</label
                    >
                    <div class="d-flex gap-2">
                      <argon-input
                        style="flex: 1"
                        id="email"
                        type="password"
                        v-model="originPassword"
                        aria-label="email"
                        v-bind:disabled="!completeCheck"
                      />
                      <button
                        class="btn"
                        @click.prevent="checkOriginPassword"
                        style="
                          background-color: #4a5568;
                          color: white;
                          border: none;
                          padding: 12px 20px;
                          border-radius: 8px;
                          font-size: 14px;
                          white-space: nowrap;
                        "
                      >
                        비밀번호 확인
                      </button>
                    </div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label" style="color: #718096; font-size: 13px"
                      >새 비밀번호</label
                    >
                    <argon-input
                      id="email"
                      type="password"
                      v-model="password"
                      aria-label="email"
                      v-bind:disabled="completeCheck || passwordChange"
                    />
                  </div>

                  <div class="mb-3">
                    <label class="form-label" style="color: #718096; font-size: 13px"
                      >비밀번호 재확인</label
                    >
                    <argon-input
                      id="email"
                      type="password"
                      v-model="passwordCheck"
                      aria-label="email"
                      v-bind:disabled="completeCheck || passwordChange"
                    />
                  </div>

                  <button
                    class="btn"
                    @click.prevent="changePassword"
                    style="
                      background-color: #4a5568;
                      color: white;
                      border: none;
                      padding: 10px 24px;
                      border-radius: 8px;
                      font-size: 14px;
                    "
                  >
                    비밀번호 변경
                  </button>
                </div>

                <!-- 가입일 -->
                <div class="mb-4">
                  <label
                    class="form-label"
                    style="color: #4a5568; font-weight: 500; font-size: 14px"
                    >가입일</label
                  >
                  <argon-input
                    id="email"
                    type="email"
                    v-model="myPage.managerInfo.member_date"
                    aria-label="email"
                    disabled
                    style="background-color: #f7fafc"
                  />
                </div>

                <!-- 버튼 그룹 -->
                <div class="d-flex justify-content-end gap-2 mt-5">
                  <button
                    v-if="changeMangerInfo"
                    type="button"
                    class="btn"
                    @click="changeInfo"
                    style="
                      background-color: #5a67d8;
                      color: white;
                      border: none;
                      padding: 12px 32px;
                      border-radius: 8px;
                      font-size: 14px;
                      font-weight: 500;
                    "
                  >
                    수정
                  </button>

                  <template v-if="!changeMangerInfo">
                    <button
                      type="button"
                      class="btn"
                      @click="returnInfo"
                      style="
                        background-color: #f7fafc;
                        color: #4a5568;
                        border: 1px solid #e2e8f0;
                        padding: 12px 32px;
                        border-radius: 8px;
                        font-size: 14px;
                        font-weight: 500;
                      "
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      class="btn"
                      @click="completeChangeInfo"
                      style="
                        background-color: #5a67d8;
                        color: white;
                        border: none;
                        padding: 12px 32px;
                        border-radius: 8px;
                        font-size: 14px;
                        font-weight: 500;
                      "
                    >
                      저장
                    </button>
                  </template>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMyPageStore } from '@/stores/mypage'
import { useRoute } from 'vue-router'
import CryptoJS from 'crypto-js'
import axios from 'axios'
import Swal from 'sweetalert2'
const route = useRoute()

const myPage = useMyPageStore()

import { onBeforeMount, ref } from 'vue'
import ArgonInput from '@/components/ArgonInput.vue'

onBeforeMount(async () => {
  // 담당자 정보
  await myPage.searchManagerInfo(route.params.id)

  // 지원자 정보
  await myPage.searchDependantInfo(route.params.id)
})

// 수정시 disabled 해제
let changeMangerInfo = ref(true)

const changeInfo = () => {
  changeMangerInfo.value = false
}

const returnInfo = () => {
  changeMangerInfo.value = true
}

// 비밀번호 체크 및 변경
let originPassword = ref() // 원래 비밀번호 확인
let password = ref() // 입력한 새비밀번호
let passwordCheck = ref() // 입력한 새비밀번호 재확인

// 비밀번호 확인
let completeCheck = ref(true)
const checkOriginPassword = async () => {
  if (originPassword.value == null || originPassword.value == '') {
    await Swal.fire({
      icon: 'warning',
      title: '비밀번호를 입력해주세요',
      confirmButtonText: '확인',
    })
    return
  } else if (CryptoJS.SHA256(originPassword.value).toString() == myPage.managerInfo.member_pass) {
    await Swal.fire({
      icon: 'success',
      title: '비밀번호가 일치합니다',
      showConfirmButton: false,
      timer: 1500,
    })
    completeCheck.value = false

    return
  } else {
    await Swal.fire({
      icon: 'error',
      title: '비밀번호가 일치하지 않습니다',
      confirmButtonText: '확인',
    })
    return
  }
}

// 비밀번호 변경
let passwordChange = ref(false)
const changePassword = async () => {
  // 빈칸일 때 알림창
  if (
    password.value == null ||
    passwordCheck.value == null ||
    password.value == '' ||
    passwordCheck.value == ''
  ) {
    await Swal.fire({
      icon: 'warning',
      title: '비밀번호를 입력해주세요',
      confirmButtonText: '확인',
    })
    return
  } else if (password.value != passwordCheck.value) {
    await Swal.fire({
      icon: 'error',
      title: '비밀번호가 일치하지 않습니다',
      confirmButtonText: '확인',
    })
    return
  } else if (password.value == originPassword.value) {
    await Swal.fire({
      icon: 'warning',
      title: '원래 비밀번호와 동일합니다',
      confirmButtonText: '확인',
    })

    return
  } else {
    await axios
      .put('/api/modifyMemberPass', {
        id: myPage.managerInfo.member_id,
        password: password.value,
      })
      .then(async (res) => {
        console.log(res)
        await Swal.fire({
          icon: 'success',
          title: '비밀번호가 변경되었습니다',
          showConfirmButton: false,
          timer: 1500,
        })
        passwordChange.value = true
        completeCheck.value = true
      })
  }
}

// 변경완료 후
const completeChangeInfo = async () => {
  if (completeCheck.value == false) {
    await Swal.fire({
      icon: 'warning',
      title: '비밀번호 변경을 완료해주세요',
      confirmButtonText: '확인',
    })
    return
  }
  await axios
    .put('/api/changeManagerInfo/' + myPage.managerInfo.member_id, {
      member_phone: myPage.managerInfo.member_phone,
      member_email: myPage.managerInfo.member_email,
    })
    .then(async () => {
      await Swal.fire({
        icon: 'success',
        title: '변경되었습니다!',
        showConfirmButton: false,
        timer: 1500,
      })
      changeMangerInfo.value = true
      originPassword.value = ''
      password.value = ''
      passwordCheck.value = ''
      passwordChange.value = false
      completeCheck.value = true
      myPage.searchManagerInfo(route.params.id)
    })
}
</script>
