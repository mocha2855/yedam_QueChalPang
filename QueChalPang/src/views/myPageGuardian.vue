<template>
  <div class="py-4 container-fluid" v-if="mypage.guardianInfo[0] != null">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header pb-0 px-5 mx-5">
            <h5>지원자 상세정보</h5>
            <hr class="mb-4" style="height: 5px; background-color: black" />
          </div>
          <div class="card-body px-0 pt-0 pb-2">
            <div class="container px-0">
              <div class="card-body px-0 py-0">
                <form role="form">
                  <div class="row px-0">
                    <div class="col-1 px-0">
                      <h6 class="mt-2">아이디</h6>
                    </div>
                    <div class="col-5 mb-2">
                      <argon-input
                        id="name"
                        type="text"
                        aria-label="Name"
                        v-model="mypage.guardianInfo[0].member_id"
                        disabled
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
                      <h6 class="mt-2">이름</h6>
                    </div>
                    <div class="col-5 mb-2">
                      <argon-input v-model="mypage.guardianInfo[0].member_name" disabled />
                    </div>
                    <hr class="mb-4" style="height: 1px; background-color: black" />
                  </div>
                  <div class="row px-0">
                    <div class="col-1 px-0">
                      <h6 class="mt-2">이메일</h6>
                    </div>
                    <div class="col-5 mb-2">
                      <argon-input
                        id="email_input"
                        v-model="mypage.guardianInfo[0].member_email"
                        v-bind:disabled="changeMangerInfo"
                      />
                    </div>
                    <hr class="mb-4" style="height: 1px; background-color: black" />
                  </div>
                  <div class="row px-0">
                    <div class="col-1 px-0">
                      <h6 class="mt-2">연락처</h6>
                    </div>
                    <div class="col-5 mb-2">
                      <argon-input
                        id="phone_input"
                        v-model="mypage.guardianInfo[0].member_phone"
                        v-bind:disabled="changeMangerInfo"
                      />
                    </div>
                    <hr class="mb-4" style="height: 1px; background-color: black" />
                  </div>
                  <div class="row px-0">
                    <div class="col-1 px-0">
                      <h6 class="mt-2">주소</h6>
                    </div>

                    <div class="col-5 mb-2">
                      <argon-input v-model="detailAddress" placeholder="주소" disabled />
                    </div>
                    <div class="col-2">
                      <button
                        type="button"
                        class="p-2 btn btn-primary w-100"
                        @click="openPostcode"
                        v-if="!changeMangerInfo"
                      >
                        주소 찾기
                      </button>
                    </div>
                    <div class="row" v-if="!changeMangerInfo">
                      <div class="col-1 px-0"><h6 class="mt-2"></h6></div>
                      <div class="col-5 mb-2" v-if="!changeMangerInfo">
                        <argon-input
                          id="detail_input"
                          placeholder="상세주소"
                          v-model="writingAddress"
                        />
                      </div>
                    </div>
                    <hr class="mb-4" style="height: 1px; background-color: black" />
                  </div>

                  <div class="row px-0">
                    <div class="col-1 px-0">
                      <h6 class="mt-2">기관</h6>
                    </div>

                    <div class="col-5 mb-2">
                      <argon-input id="center_name" v-model="selectedCenter.center_name" disabled />
                    </div>
                    <div class="col-2">
                      <button
                        type="button"
                        class="p-2 btn btn-primary w-100"
                        @click="openCenterCode"
                        v-if="!changeMangerInfo"
                      >
                        기관 찾기
                      </button>
                    </div>
                  </div>

                  <div class="row px-0">
                    <div class="col-1 px-0">
                      <h6 class="mt-2">가입일</h6>
                    </div>
                    <div class="col-5 mb-2">
                      <argon-input
                        id="email"
                        type="email"
                        aria-label="email"
                        v-model="mypage.guardianInfo[0].member_date"
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
import { onBeforeMount, ref, onMounted, onUnmounted } from 'vue'
import { useMyPageStore } from '@/stores/mypage'
import { useCounterStore } from '@/stores/member'
import ArgonInput from '@/components/ArgonInput.vue'
import axios from 'axios'
import CryptoJS from 'crypto-js'

const counter = useCounterStore()
const mypage = useMyPageStore()

onBeforeMount(async () => {
  await mypage.searchGuardianInfo(counter.isLogIn.info.member_id)
  detailAddress.value = mypage.guardianInfo[0].member_address
  selectedCenter.value.center_name = mypage.guardianInfo[0].center_name
  selectedCenter.value.center_no = mypage.guardianInfo[0].center_no
})

// 수정시 d}isabled 해제
let changeMangerInfo = ref(true)

const changeInfo = () => {
  changeMangerInfo.value = false
}

// 취소버튼
const returnInfo = () => {
  changeMangerInfo.value = true
  postcode.value = ''
  extraAddress.value = ''
  detailAddress.value = mypage.guardianInfo[0].member_address
  count.value = 0
}

// 비밀번호 체크 및 변경
let originPassword = ref() // 원래 비밀번호 확인
let password = ref() // 입력한  새비밀번호
let passwordCheck = ref() // 입력한 새비밀번호 재확인

// 비밀번호 확인
let completeCheck = ref(true)
const checkOriginPassword = () => {
  console.log()
  if (originPassword.value == null || originPassword.value == '') {
    alert('비밀번호를 입력해주세요')
    return
  } else if (
    CryptoJS.SHA256(originPassword.value).toString() == mypage.guardianInfo[0].member_pass
  ) {
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
        id: mypage.managerInfo.member_id,
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
  console.log(data)
  selectedCenter.value = data
}

// 주소 api에서 사용하는 함수들
let count = ref(0)
const postcode = ref('')
const extraAddress = ref('')
const detailAddress = ref('')
const writingAddress = ref('')

// 주소 api에서 사용하는 함수들
const openCenterCode = () => {
  window.open('/centerPopup', 'popupWindow', 'width=600, height=500, resizable=yes, scrollbars=yes')
}
const openPostcode = () => {
  new window.daum.Postcode({
    oncomplete: (data) => {
      let addr = ''
      let extraAddr = ''

      if (data.userSelectedType === 'R') {
        addr = data.roadAddress
      } else {
        addr = data.jibunAddress
      }

      if (data.userSelectedType === 'R') {
        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
          extraAddr += data.bname
        }
        if (data.buildingName !== '' && data.apartment === 'Y') {
          extraAddr += extraAddr !== '' ? ', ' + data.buildingName : data.buildingName
        }
        if (extraAddr !== '') {
          extraAddr = ' (' + extraAddr + ')'
        }
        extraAddress.value = extraAddr // Vue 변수에 할당
      } else {
        extraAddress.value = ''
      }

      postcode.value = data.zonecode // 우편번호
      detailAddress.value = addr // 기본 주소

      // 상세주소로 포커스 이동은 ref를 사용하거나 직접 접근
      document.getElementById('detail_input').focus()
      count.value++
    },
  }).open()
}
// 저장버튼
// 주소 합체

const completeChangeInfo = async () => {
  if (completeCheck.value == false && passwordChange.value == false) {
    alert('비밀번호 변경을 완료해주세요')
    return
  } else if (
    mypage.guardianInfo[0].member_email == '' ||
    mypage.guardianInfo[0].member_email == null
  ) {
    document.getElementById('email_input').focus()
    alert('이메일을 입력해주세요')
    return
  } else if (
    mypage.guardianInfo[0].member_phone == '' ||
    mypage.guardianInfo[0].member_phone == null
  ) {
    document.getElementById('phone_input').focus()
    alert('전화번호를 입력해주세요')
    return
  } else if (count.value == 1 && (writingAddress.value == '' || writingAddress.value == null)) {
    document.getElementById('detail_input').focus()
    alert('상세주소를 입력해주세요')
    return
  }

  await axios //
    .put('/api/changeManagerInfo/' + mypage.guardianInfo[0].member_id, {
      member_address: `${detailAddress.value} ${writingAddress.value}`,
      member_phone: mypage.guardianInfo[0].member_phone,
      center_no: selectedCenter.value.center_no,
      member_email: mypage.guardianInfo[0].member_email,
    })
    .then((res) => {
      console.log(res)
      detailAddress.value = `${detailAddress.value} ${writingAddress.value}`

      writingAddress.value = ''
      count.value = 0

      changeMangerInfo.value = true
      alert('수정완료')
    })
}
</script>
