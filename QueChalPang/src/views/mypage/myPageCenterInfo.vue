<template>
  <div class="fixed-top d-flex justify-content-end p-3 mt-6"></div>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card" v-if="myPage.centerInfo != ''">
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
                      <argon-input id="center_name" v-model="selectedCenter.center_name" disabled />
                    </div>
                    <div class="col-1">
                      <button
                        type="button"
                        class="p-2 btn btn-primary w-100"
                        @click="openCenterCode"
                        v-if="!changeMangerInfo"
                      >
                        기관 찾기
                      </button>
                    </div>
                    <hr class="mb-4" style="height: 1px; background-color: black" />
                  </div>

                  <div class="row px-0">
                    <div class="col-1 px-0">
                      <h6 class="mt-2">주소</h6>
                    </div>
                    <div class="col-5 mb-2">
                      <argon-input id="tel" v-model="centerAddress" :disabled="changeMangerInfo" />
                    </div>
                    <hr class="mb-4" style="height: 1px; background-color: black" />
                  </div>

                  <div class="row px-0">
                    <div class="col-1 px-0">
                      <h6 class="mt-2">전화번호</h6>
                    </div>
                    <div class="col-5 mb-2">
                      <argon-input id="tel" v-model="centerTel" :disabled="changeMangerInfo" />
                    </div>
                    <hr class="mb-4" style="height: 1px; background-color: black" />
                  </div>

                  <div class="row px-0">
                    <div class="col-1 px-0">
                      <h6 class="mt-2">기관 담당자 수</h6>
                    </div>
                    <div class="col-5 mb-2">
                      <argon-input
                        id="email"
                        type="email"
                        v-model="centerMember"
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
import { useRouter } from 'vue-router'
import { onMounted, onUnmounted } from 'vue'
import axios from 'axios'

import { onBeforeMount, ref } from 'vue'
import ArgonInput from '@/components/ArgonInput.vue'

const myPage = useMyPageStore()
const counter = useCounterStore()
const router = useRouter()

let centerAddress = ref()
let centerTel = ref()
let centerMember = ref()

onBeforeMount(async () => {
  if (counter.isLogIn.info.member_authority != 'a3') {
    alert('기관관리자만 접근가능합니다.')
    router.push({ name: 'Dashboard' })
  }
  // 관리자 정보
  await myPage.searchManagerInfo(counter.isLogIn.info.member_id)

  selectedCenter.value.center_name = myPage.managerInfo.center_name
  centerAddress.value = myPage.managerInfo.center_address
  centerTel.value = myPage.managerInfo.center_tel

  await myPage.searchAdminCenterInfo()

  myPage.centerInfo.forEach((data) => {
    console.log(data)
    if (data.center_name == selectedCenter.value.center_name) centerMember.value = data.memberCount
  })
})

// 수정시 disabled 해제
let changeMangerInfo = ref(true)

const changeInfo = () => {
  changeMangerInfo.value = false
}

// 취소 버튼
const returnInfo = () => {
  changeMangerInfo.value = true
  selectedCenter.value.center_name = myPage.managerInfo.center_name
  centerAddress.value = myPage.managerInfo.center_address
  centerTel.value = myPage.managerInfo.center_tel
  myPage.centerInfo.forEach((data) => {
    console.log(data)
    if (data.center_name == selectedCenter.value.center_name) centerMember.value = data.memberCount
  })
}

// 센터 찾기
onMounted(() => {
  const script = document.createElement('script')
  script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
  script.async = true
  document.head.appendChild(script)
  window.receiveCenterData = receiveCenterData
})
onUnmounted(() => {
  delete window.receiveCenterData
})

// 팝업에서 센터 정보 가져오는 함수,
const selectedCenter = ref({ center_name: '', center_no: 0 })

const receiveCenterData = (data) => {
  console.log('data: ', data)
  selectedCenter.value = data
  centerAddress.value = data.center_address
  centerTel.value = data.center_tel

  myPage.centerInfo.forEach((info, idx) => {
    console.log('지금', idx, info.center_name == selectedCenter.value.center_name)
    if (info.center_name == selectedCenter.value.center_name) {
      if (selectedCenter.value.center_name == myPage.managerInfo.center_name) {
        centerMember.value = info.memberCount
        return
      } else {
        centerMember.value = info.memberCount + 1
        if (info.memberCount == 0) {
          centerMember.value = 1
        }
      }
    }
  })
}

// 센터 주소
const openCenterCode = () => {
  window.open('/centerPopup', 'popupWindow', 'width=600, height=500, resizable=yes, scrollbars=yes')
}

// 변경완료 후
const completeChangeInfo = async () => {
  await axios //
    .put('/api/changeManagerInfo/' + myPage.managerInfo.member_id, {
      center_no: selectedCenter.value.center_no,
    })
  await axios //
    .put('/api/changeCenterInfo/' + selectedCenter.value.center_no, {
      center_address: centerAddress.value,
      center_tel: centerTel.value,
    })
  alert('변경완료')
  changeMangerInfo.value = true
}
</script>
