<template>
  <div class="fixed-top d-flex justify-content-end p-3 mt-6"></div>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card" v-if="myPage.managerInfo != ''">
          <div class="card-header pb-0 px-5 mx-5">
            <h5>기관정보</h5>
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
                      <h6 class="mt-2">주소</h6>
                    </div>

                    <div class="col-5 mb-2">
                      <argon-input
                        v-model="myPage.managerInfo.center_address"
                        placeholder="주소"
                        disabled
                      />
                    </div>
                    <div class="col-1">
                      <button
                        type="button"
                        class="p-2 btn btn-primary w-100"
                        @click="openPostcode"
                        v-bind:disabled="changeMangerInfo"
                      >
                        주소 찾기
                      </button>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-1 px-0"><h6 class="mt-2"></h6></div>
                    <div class="col-5 mb-2">
                      <argon-input
                        id="detail_input"
                        placeholder="상세주소"
                        v-model="writingAddress"
                        v-if="changeMangerInfo"
                      />
                    </div>
                  </div>
                  <hr class="mb-4" style="height: 1px; background-color: black" />

                  <div class="row px-0">
                    <div class="col-1 px-0">
                      <h6 class="mt-2">전화번호</h6>
                    </div>
                    <div class="col-5 mb-2">
                      <argon-input
                        id="tel"
                        v-model="myPage.managerInfo.center_tel"
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
import { useCounterStore } from '@/stores/member'
import { useRoute } from 'vue-router'
import axios from 'axios'
const route = useRoute()

const myPage = useMyPageStore()
const counter = useCounterStore()

import { onBeforeMount, ref } from 'vue'
import ArgonInput from '@/components/ArgonInput.vue'

onBeforeMount(async () => {
  // 관리자 정보
  await myPage.searchManagerInfo(counter.isLogIn.info.member_id)
  console.log('managerInfo', myPage.managerInfo)
})

// 수정시 disabled 해제
let changeMangerInfo = ref(true)

const changeInfo = () => {
  changeMangerInfo.value = false
}

const returnInfo = () => {
  changeMangerInfo.value = true
}

// 변경완료 후
const completeChangeInfo = async () => {
  await axios //
    .put('/api/changeManagerInfo/' + myPage.managerInfo.member_id, {
      member_phone: myPage.managerInfo.member_phone,
      member_email: myPage.managerInfo.member_email,
    })
  alert('변경완료')
  changeMangerInfo.value = true
  myPage.searchManagerInfo(route.params.id)
}
</script>
