<template>
  <div class="fixed-top d-flex justify-content-end p-3 mt-6"></div>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div v-if="myPage.centerInfo != ''">
          <!-- 헤더 섹션 -->
          <div class="mb-4">
            <h3 class="mb-2" style="color: #2d3748; font-weight: 600">기관정보</h3>
            <p style="color: #718096">기관 정보를 확인하고 수정할 수 있습니다</p>
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
                  <div class="d-flex gap-2">
                    <argon-input
                      id="center_name"
                      v-model="selectedCenter.center_name"
                      disabled
                      style="flex: 1; background-color: #f7fafc"
                    />
                    <button
                      v-if="!changeMangerInfo"
                      type="button"
                      class="btn"
                      @click="openCenterCode"
                      style="
                        background-color: #5a67d8;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 8px;
                        font-size: 14px;
                        font-weight: 500;
                        white-space: nowrap;
                      "
                    >
                      기관 찾기
                    </button>
                  </div>
                </div>

                <!-- 주소 -->
                <div class="mb-4">
                  <label
                    class="form-label"
                    style="color: #4a5568; font-weight: 500; font-size: 14px"
                    >주소</label
                  >
                  <argon-input
                    id="tel"
                    v-model="centerAddress"
                    :disabled="changeMangerInfo"
                    :style="changeMangerInfo ? 'background-color: #f7fafc' : ''"
                  />
                </div>

                <!-- 전화번호 -->
                <div class="mb-4">
                  <label
                    class="form-label"
                    style="color: #4a5568; font-weight: 500; font-size: 14px"
                    >전화번호</label
                  >
                  <argon-input
                    id="tel"
                    v-model="centerTel"
                    :disabled="changeMangerInfo"
                    :style="changeMangerInfo ? 'background-color: #f7fafc' : ''"
                  />
                </div>

                <!-- 기관 담당자 수 -->
                <div class="mb-4">
                  <label
                    class="form-label"
                    style="color: #4a5568; font-weight: 500; font-size: 14px"
                    >기관 담당자 수</label
                  >
                  <argon-input
                    id="email"
                    type="email"
                    v-model="centerMember"
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
import { useCounterStore } from '@/stores/member'
import { useRouter } from 'vue-router'
import { onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

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
    await Swal.fire({
      icon: 'warning',
      title: '접근 권한 없음',
      text: '기관관리자만 접근가능합니다.',
      confirmButtonText: '확인',
    })
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
  await axios.put('/api/changeManagerInfo/' + myPage.managerInfo.member_id, {
    center_no: selectedCenter.value.center_no,
  })
  await axios.put('/api/changeCenterInfo/' + selectedCenter.value.center_no, {
    center_address: centerAddress.value,
    center_tel: centerTel.value,
  })
  await Swal.fire({
    icon: 'success',
    title: '변경되었습니다!',
    showConfirmButton: false,
    timer: 1500,
  })
  changeMangerInfo.value = true
}
</script>
