<template>
  <div class="fixed-top d-flex justify-content-end p-3 mt-6"></div>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header pb-0">
            <h5>내 정보</h5>
          </div>
          <div class="card-body px-0 pt-0 pb-2">
            <div class="position-relative">
              <!-- <div class="position-absolute bottom-0 end-8">
                <ArgonButton color="danger" class="p-1 mr-1">선택 삭제</ArgonButton>
              </div> -->
            </div>
            <div class="container">
              <div class="card-body">
                <form role="form" v-on:submit.prevent="">
                  <div class="row">
                    <div class="col-2">
                      <h6>기관명</h6>
                    </div>
                    <div class="col-5">
                      <argon-input
                        id="name"
                        type="text"
                        placeholder="센터명"
                        v-model="myPage.managerInfo.center_name"
                        aria-label="Name"
                        disabled
                      />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-2">
                      <h6>아이디</h6>
                    </div>
                    <div class="col-5">
                      <argon-input v-model="myPage.managerInfo.member_id" disabled />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-2">
                      <h6>연락처</h6>
                    </div>
                    <div class="col-5">
                      <argon-input id="tel" v-model="center.tel" disabled />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-2">
                      <h6>이메일</h6>
                    </div>
                    <div class="col-5">
                      <argon-input
                        id="email"
                        type="email"
                        v-model="center.email"
                        aria-label="email"
                        disabled
                      />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-2">
                      <h6>이메일</h6>
                    </div>
                    <div class="col-5">
                      <argon-input
                        id="email"
                        type="email"
                        v-model="center.email"
                        aria-label="email"
                        disabled
                      />
                    </div>
                  </div>

                  <div class="row">
                    <div
                      :class="{
                        'col-4': store.centerInfo.center_status == 'b1',
                        'col-5': store.centerInfo.center_status == 'b2',
                      }"
                    ></div>
                    <div class="text-center col-2">
                      <argon-button
                        fullWidth
                        color="info"
                        variant="gradient"
                        class="my-4 mb-2 p-2"
                        @click="toUpdate()"
                      >
                        수정
                      </argon-button>
                    </div>
                    <div class="text-center col-2">
                      <argon-button
                        fullWidth
                        color="danger"
                        variant="gradient"
                        class="my-4 mb-2 p-2"
                        @click="endCenter()"
                        v-if="store.centerInfo.center_status == 'b1'"
                      >
                        취소
                      </argon-button>
                    </div>
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
// import { useCounterStore } from '@/stores/member'
import { useRoute } from 'vue-router'
const route = useRoute()

const myPage = useMyPageStore()
// const counter = useCounterStore()

import { onBeforeMount } from 'vue'
import ArgonButton from '@/components/ArgonButton.vue'
import ArgonInput from '@/components/ArgonInput.vue'

onBeforeMount(async () => {
  await myPage.searchManagerInfo(route.params.id)
  console.log('managerInfo', myPage.managerInfo)
})
</script>
