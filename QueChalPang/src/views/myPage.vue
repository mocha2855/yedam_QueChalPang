<template>
  <div class="fixed-top d-flex justify-content-end p-3 mt-6"></div>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card" v-if="myPage.managerInfo.data != ''">
          <div class="card-header pb-0">
            <h5>내 정보</h5>
          </div>
          <div class="card-body px-0 pt-0 pb-2">
            <div class="container px-0">
              <div class="card-body">
                <form role="form">
                  <div class="row">
                    <div>
                      <h6>기관명</h6>
                    </div>
                    <div class="col-9">
                      <argon-input
                        id="name"
                        type="text"
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
                      <argon-input id="tel" v-model="myPage.managerInfo.member_phone" disabled />
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
                        v-model="myPage.managerInfo.member_email"
                        aria-label="email"
                        disabled
                      />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-2">
                      <h6>가입일</h6>
                    </div>
                    <div class="col-5">
                      <argon-input
                        id="email"
                        type="email"
                        v-model="myPage.managerInfo.member_date"
                        aria-label="email"
                        disabled
                      />
                    </div>
                  </div>

                  <div class="float-sm-end">
                    <button>수정</button>
                    <button>취소</button>
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
const route = useRoute()

const myPage = useMyPageStore()

import { onBeforeMount } from 'vue'
import ArgonInput from '@/components/ArgonInput.vue'

onBeforeMount(async () => {
  // 담당자 정보
  await myPage.searchManagerInfo(route.params.id)
  console.log('managerInfo', myPage.managerInfo)

  // 지원자 정보
  await myPage.searchDependantInfo(route.params.id)
  console.log('dependantInfo', myPage.dependantInfo)
})
</script>
