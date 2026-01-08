<template>
  <div class="fixed-top d-flex justify-content-end p-3 mt-6"></div>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card" v-if="myPage.managerInfo.data != ''">
          <div class="card-header pb-0 px-5 mx-5">
            <h5>내 정보</h5>
            <hr class="mb-4" style="height: 5px; background-color: black" />
          </div>
          <div class="card-body px-0 pt-0 pb-2">
            <div class="container px-0">
              <div class="card-body px-0 py-0">
                <form role="form">
                  <div class="row px-0">
                    <div class="col-1 px-0">
                      <h6 class="mt-2">기관명</h6>
                    </div>
                    <div class="col-5 mb-2">
                      <argon-input
                        id="name"
                        type="text"
                        v-model="myPage.managerInfo.center_name"
                        aria-label="Name"
                        disabled
                      />
                    </div>
                    <hr class="mb-4" style="height: 1px; background-color: black" />
                  </div>
                  <div class="row px-0">
                    <div class="col-1 px-0">
                      <h6 class="mt-2">아이디</h6>
                    </div>
                    <div class="col-5 mb-2">
                      <argon-input v-model="myPage.managerInfo.member_id" disabled />
                    </div>
                    <hr class="mb-4" style="height: 1px; background-color: black" />
                  </div>

                  <div class="row px-0">
                    <div class="col-1 px-0">
                      <h6 class="mt-2">연락처</h6>
                    </div>
                    <div class="col-5 mb-2">
                      <argon-input
                        id="tel"
                        v-model="myPage.managerInfo.member_phone"
                        v-bind:disabled="changeMangerInfo"
                      />
                    </div>
                    <hr class="mb-4" style="height: 1px; background-color: black" />
                  </div>

                  <div class="row px-0">
                    <div class="col-1 px-0">
                      <h6 class="mt-2">이메일</h6>
                    </div>
                    <div class="col-5 mb-2">
                      <argon-input
                        id="email"
                        type="email"
                        v-model="myPage.managerInfo.member_email"
                        aria-label="email"
                        v-bind:disabled="changeMangerInfo"
                      />
                    </div>
                    <hr class="mb-4" style="height: 1px; background-color: black" />
                  </div>
                  <div class="row px-0" v-if="!changeMangerInfo">
                    <div class="col-1 px-0">
                      <h6 class="mt-2">비밀번호 변경</h6>
                    </div>
                    <div class="col-5 mb-2">
                      <h6 class="mt-2">현재 비밀번호</h6>
                      <div class="row">
                        <argon-input
                          class="col-9"
                          id="email"
                          type="password"
                          v-model="originPassword"
                          aria-label="email"
                          v-bind:disabled="!completeCheck"
                        />
                        <button class="col-3 btn btn-dark" @click.prevent="checkOriginPassword">
                          비밀번호 확인
                        </button>
                      </div>

                      <h6 class="mt-2">새 비밀번호</h6>
                      <argon-input
                        id="email"
                        type="password"
                        v-model="password"
                        aria-label="email"
                        style="width: 74.5%"
                        v-bind:disabled="completeCheck || passwordChange"
                      />
                      <h6 class="mt-2">비밀번호 재확인</h6>
                      <argon-input
                        id="email"
                        type="password"
                        v-model="passwordCheck"
                        aria-label="email"
                        style="width: 74.5%"
                        v-bind:disabled="completeCheck || passwordChange"
                      />
                      <button class="btn btn-dark" @click.prevent="changePassword">
                        비밀번호 변경
                      </button>
                    </div>
                    <hr class="mb-4" style="height: 1px; background-color: black" />
                  </div>

                  <div class="row px-0">
                    <div class="col-1 px-0">
                      <h6 class="mt-2">가입일</h6>
                    </div>
                    <div class="col-5 mb-2">
                      <argon-input
                        id="email"
                        type="email"
                        v-model="myPage.managerInfo.member_date"
                        aria-label="email"
                        disabled
                      />
                    </div>
                    <hr class="mb-2" style="height: 1px; background-color: black" />
                  </div>

                  <div class="float-sm-end">
                    <button
                      type="button"
                      class="btn btn-primary"
                      @click="changeInfo"
                      v-if="changeMangerInfo"
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      class="btn btn-primary"
                      v-if="!changeMangerInfo"
                      @click="completeChangeInfo"
                    >
                      저장
                    </button>

                    <button
                      type="button"
                      class="btn btn-dark"
                      v-if="!changeMangerInfo"
                      @click="returnInfo"
                    >
                      취소
                    </button>
                  </div>
                </form>
              </div>
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
const route = useRoute()

const myPage = useMyPageStore()

import { onBeforeMount, ref } from 'vue'
import ArgonInput from '@/components/ArgonInput.vue'

onBeforeMount(async () => {
  // 담당자 정보
  await myPage.searchManagerInfo(route.params.id)
  console.log('managerInfo', myPage.managerInfo)

  // 지원자 정보
  await myPage.searchDependantInfo(route.params.id)
  console.log('dependantInfo', myPage.dependantInfo)
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
const checkOriginPassword = () => {
  if (originPassword.value == null || originPassword.value == '') {
    alert('비밀번호를 입력해주세요')
    return
  } else if (CryptoJS.SHA256(originPassword.value).toString() == myPage.managerInfo.member_pass) {
    alert('비밀번호가 일치합니다.')
    completeCheck.value = false

    return
  } else {
    alert('비밀번호가 일치하지않습니다..')
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
    alert('비밀번호를 입력해주세요')
    return
  } else if (password.value != passwordCheck.value) {
    alert('비밀번호가 일치하지 않습니다.')
    return
  } else if (password.value == originPassword.value) {
    alert('원래 비밀번호와 동일합니다.')

    return
  } else {
    await axios //
      .put('/api/modifyMemberPass', {
        id: myPage.managerInfo.member_id,
        password: password.value,
      })
      .then((res) => {
        console.log(res)
        alert('비밀번호 변경 완료')
        passwordChange.value = true
        completeCheck.value = true
      })
  }
}

// 변경완료 후
const completeChangeInfo = async () => {
  if (completeCheck.value == false) {
    alert('비밀번호 변경을 완료해주세요')
    return
  }
  await axios //
    .put('/api/changeManagerInfo/' + myPage.managerInfo.member_id, {
      member_phone: myPage.managerInfo.member_phone,
      member_email: myPage.managerInfo.member_email,
    })
  alert('변경완료')
  changeMangerInfo.value = true
  originPassword.value = ''
  password.value = ''
  passwordCheck.value = ''
  passwordChange.value = false
  completeCheck.value = true
  myPage.searchManagerInfo(route.params.id)
}
</script>
