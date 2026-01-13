<template>
  <div class="py-4 container-fluid" v-if="mypage.guardianInfo[0] != null">
    <div class="row">
      <div class="col-12">
        <!-- 헤더 섹션 -->
        <div class="mb-4">
          <h3 class="mb-2" style="color: #2d3748; font-weight: 600">지원자 상세정보</h3>
          <p style="color: #718096">보호자 계정 정보를 확인하고 수정할 수 있습니다</p>
        </div>

        <!-- 메인 카드 -->
        <div class="card shadow-sm main-card" style="border: none; border-radius: 16px">
          <div class="card-body p-5">
            <form role="form">
              <!-- 아이디 -->
              <div class="mb-4">
                <label class="form-label" style="color: #4a5568; font-weight: 500; font-size: 14px"
                  >아이디</label
                >
                <argon-input
                  id="name"
                  type="text"
                  aria-label="Name"
                  v-model="mypage.guardianInfo[0].member_id"
                  disabled
                  style="background-color: #f7fafc"
                />
              </div>

              <!-- 비밀번호 변경 -->
              <div v-if="!changeMangerInfo" class="mb-4">
                <label class="form-label" style="color: #4a5568; font-weight: 500; font-size: 14px"
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

              <!-- 이름 -->
              <div class="mb-4">
                <label class="form-label" style="color: #4a5568; font-weight: 500; font-size: 14px"
                  >이름</label
                >
                <argon-input
                  v-model="mypage.guardianInfo[0].member_name"
                  disabled
                  style="background-color: #f7fafc"
                />
              </div>

              <!-- 이메일 -->
              <div class="mb-4">
                <label class="form-label" style="color: #4a5568; font-weight: 500; font-size: 14px"
                  >이메일</label
                >
                <argon-input
                  id="email_input"
                  v-model="mypage.guardianInfo[0].member_email"
                  v-bind:disabled="changeMangerInfo"
                  :style="changeMangerInfo ? 'background-color: #f7fafc' : ''"
                />
              </div>

              <!-- 연락처 -->
              <div class="mb-4">
                <label class="form-label" style="color: #4a5568; font-weight: 500; font-size: 14px"
                  >연락처</label
                >
                <argon-input
                  id="phone_input"
                  v-model="mypage.guardianInfo[0].member_phone"
                  v-bind:disabled="changeMangerInfo"
                  :style="changeMangerInfo ? 'background-color: #f7fafc' : ''"
                />
              </div>

              <!-- 주소 -->
              <div class="mb-4">
                <label class="form-label" style="color: #4a5568; font-weight: 500; font-size: 14px"
                  >주소</label
                >
                <div class="d-flex gap-2 mb-2">
                  <argon-input
                    v-model="detailAddress"
                    placeholder="주소"
                    disabled
                    style="flex: 1; background-color: #f7fafc"
                  />
                  <button
                    v-if="!changeMangerInfo"
                    type="button"
                    class="btn"
                    @click="openPostcode"
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
                    주소 찾기
                  </button>
                </div>
                <argon-input
                  v-if="!changeMangerInfo"
                  id="detail_input"
                  placeholder="상세주소를 입력해주세요"
                  v-model="writingAddress"
                />
              </div>

              <!-- 기관 -->
              <div class="mb-4">
                <label class="form-label" style="color: #4a5568; font-weight: 500; font-size: 14px"
                  >기관</label
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

              <!-- 가입일 -->
              <div class="mb-4">
                <label class="form-label" style="color: #4a5568; font-weight: 500; font-size: 14px"
                  >가입일</label
                >
                <argon-input
                  id="email"
                  type="email"
                  aria-label="email"
                  v-model="mypage.guardianInfo[0].member_date"
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
</template>

<script setup>
import { onBeforeMount, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMyPageStore } from '@/stores/mypage'
import { useCounterStore } from '@/stores/member'
import ArgonInput from '@/components/ArgonInput.vue'
import axios from 'axios'
import CryptoJS from 'crypto-js'
import Swal from 'sweetalert2'

const counter = useCounterStore()
const mypage = useMyPageStore()

const router = useRouter()

if (counter.isLogIn.info.member_authority != 'a1') {
  router.push({ name: 'Dashboard' })
  Swal.fire({
    icon: 'warning',
    title: '접근 권한 없음',
    text: '보호자만 접근가능합니다.',
    confirmButtonText: '확인',
  })
}
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
const checkOriginPassword = async () => {
  console.log()
  if (originPassword.value == null || originPassword.value == '') {
    await Swal.fire({
      icon: 'warning',
      title: '비밀번호를 입력해주세요',
      confirmButtonText: '확인',
    })
    return
  } else if (
    CryptoJS.SHA256(originPassword.value).toString() == mypage.guardianInfo[0].member_pass
  ) {
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
        id: mypage.managerInfo.member_id,
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
    await Swal.fire({
      icon: 'warning',
      title: '비밀번호 변경을 완료해주세요',
      confirmButtonText: '확인',
    })
    return
  } else if (
    mypage.guardianInfo[0].member_email == '' ||
    mypage.guardianInfo[0].member_email == null
  ) {
    document.getElementById('email_input').focus()
    await Swal.fire({
      icon: 'warning',
      title: '이메일을 입력해주세요',
      confirmButtonText: '확인',
    })
    return
  } else if (
    mypage.guardianInfo[0].member_phone == '' ||
    mypage.guardianInfo[0].member_phone == null
  ) {
    document.getElementById('phone_input').focus()
    await Swal.fire({
      icon: 'warning',
      title: '전화번호를 입력해주세요',
      confirmButtonText: '확인',
    })
    return
  } else if (count.value == 1 && (writingAddress.value == '' || writingAddress.value == null)) {
    document.getElementById('detail_input').focus()
    await Swal.fire({
      icon: 'warning',
      title: '상세주소를 입력해주세요',
      confirmButtonText: '확인',
    })
    return
  }

  await axios
    .put('/api/changeManagerInfo/' + mypage.guardianInfo[0].member_id, {
      member_address: `${detailAddress.value} ${writingAddress.value}`,
      member_phone: mypage.guardianInfo[0].member_phone,
      center_no: selectedCenter.value.center_no,
      member_email: mypage.guardianInfo[0].member_email,
    })
    .then(async (res) => {
      console.log(res)
      detailAddress.value = `${detailAddress.value} ${writingAddress.value}`

      writingAddress.value = ''
      count.value = 0

      changeMangerInfo.value = true
      await Swal.fire({
        icon: 'success',
        title: '수정되었습니다!',
        showConfirmButton: false,
        timer: 1500,
      })
    })
}
</script>
<style>
  .main-card {
  max-width: 800px;
  margin: 0 auto;   
}
table th,
table td {
  text-align: center;
  vertical-align: middle;
}
</style>

