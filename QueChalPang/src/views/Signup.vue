<script setup>
import {
  onBeforeUnmount,
  onBeforeMount,
  ref,
  onMounted,
  onUnmounted,
  reactive,
  computed,
} from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'
import { Modal } from 'bootstrap'
import { useRouter } from 'vue-router'
// import Navbar from '@/examples/PageLayout/Navbar.vue'
// import AppFooter from '@/examples/PageLayout/Footer.vue'
import ArgonInput from '@/components/ArgonInput.vue'
import ArgonButton from '@/components/ArgonButton.vue'
import Swal from 'sweetalert2'
const body = document.getElementsByTagName('body')[0]
const router = useRouter()
const store = useStore()
//주소api에서 쓰는 ref
const postcode = ref('')
const address = ref('')
const detailAddress = ref('')
const extraAddress = ref('')
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  },
})
onBeforeMount(() => {
  store.state.hideConfigButton = true
  store.state.showNavbar = false
  store.state.showSidenav = false
  store.state.showFooter = false
  body.classList.remove('bg-gray-100')
})
onBeforeUnmount(() => {
  store.state.hideConfigButton = false
  store.state.showNavbar = true
  store.state.showSidenav = true
  store.state.showFooter = true
  body.classList.add('bg-gray-100')
})

onMounted(() => {
  const script = document.createElement('script')
  script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
  script.async = true
  document.head.appendChild(script)
  window.receiveCenterData = receiveCenterData
  modalControl = new Modal(modalRef.value)
})
onUnmounted(() => {
  delete window.receiveCenterData
})
// 주소 api에서 사용하는 함수들
const openCenterCode = () => {
  window.open('/centerPopup', 'popupWindow', 'width=800, height=500, resizable=yes, scrollbars=yes')
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
      address.value = addr // 기본 주소
      member.address = address.value
      console.log(member)
      // 상세주소로 포커스 이동은 ref를 사용하거나 직접 접근
      document.getElementById('detail_input').focus()
    },
  }).open()
}
// 기능 사용을 위해 정의한 변수들
const idBtn = ref(true)
const idBtnChecked = ref(false)
const emailBtn = ref(true)
const emailBtnChecked = ref(false)
const phoneBtn = reactive({
  phoneBtn: true,
  phoneBtnChecked: false,
  phoneAuth: true,
  phoneAuthChecked: false,
  auth: '',
})
const isSignUp = ref(false)
const msg = ref('')
const selectedCenter = ref({ center_name: '', center_no: 0 })
const authority = ref('a1')
const phone2 = ref('')
const timer = ref(180)
const timeFormat = computed(() => {
  let minute = `${Math.floor(timer.value / 60)}`
  let second = timer.value % 60 < 10 ? `0${timer.value % 60}` : `${timer.value % 60}`
  let times = `${minute}:${second}`
  if (timer.value == 0) {
    clearInterval(loseTime)
  }
  return times
})
const member = reactive({
  id: '',
  pw: '',
  name: '',
  email: '',
  phone: '',
  address: '',
  center_no: 0,
  authority: 'a1',
})
const pwc = ref('')
const isAuth = ref('')
let loseTime

// 함수들

// 상단 버튼으로 어떤 회원으로 가입할지 누를때 athority 변경되도록 하는 거
const selectAuth = (auth) => {
  authority.value = auth
  member.authority = auth
  console.log(member)
}
// 누른 authority에 따라 버튼 스타일 변경
const getColor = (id) => {
  return authority.value === id ? 'primary' : 'secondary'
}
// 아이디 중복체크
const idCheck = async () => {
  if (member.id == '') {
    Toast.fire({
      icon: 'error',
      title: '아이디가 입력되지 않았습니다. 아이디를 입력해주세요.',
    })
    return
  }
  if (member.id.length < 6) {
    Toast.fire({
      icon: 'error',
      title: '아이디는 최소 6자 이상 입력해야합니다.',
    })
    return
  } else if (member.id.length > 100) {
    Toast.fire({
      icon: 'error',
      title: '아이디는 100자를 넘을 수 없습니다.',
    })
    return
  }
  let result = await axios.get(`/api/member/id/${member.id}`)
  console.log(result.data.result[0].count)
  if (result.data.result[0].count == 1) {
    Toast.fire({
      icon: 'error',
      title: '이미 존재하는 아이디입니다.',
    })
    return
  } else {
    // 중복체크 성공하면 버튼 비활성화 및 스타일을 secondary로 변경
    idBtn.value = false
    idBtnChecked.value = true
  }
}
// 이메일 중복체크
const emailCheck = async () => {
  if (member.email == '') {
    Toast.fire({
      icon: 'error',
      title: '이메일이 입력되지 않았습니다. 이메일을 입력해주세요.',
    })
    return
  }
  const emailInput = document.querySelector('input[type="email"]')
  if (!emailInput.checkValidity()) {
    // 유효성 검사에 실패하면 사용자에게 오류 메시지 표시
    Toast.fire({
      icon: 'error',
      title: '유효하지 않은 이메일 주소입니다: ' + emailInput.validationMessage,
    })
    // 또는 브라우저 기본 UI 표시
    emailInput.reportValidity()
    return
  } else {
    Toast.fire({
      icon: 'success',
      title: '유효한 이메일 주소입니다!',
    })
  }
  let result = await axios.get(`/api/member/email/${member.email}`)
  console.log(result.data.result[0].count)
  if (result.data.result[0].count == 1) {
    Toast.fire({
      icon: 'error',
      title: '이미 가입된 이메일입니다.',
    })
    return
  } else {
    // 중복체크 성공하면 버튼 비활성화 및 스타일을 secondary로 변경
    emailBtn.value = false
    emailBtnChecked.value = true
  }
}
// 휴대폰 번호 인증을 위한 함수 1
const phoneCheck = async () => {
  if (phone2.value == '') {
    Toast.fire({
      icon: 'error',
      title: '휴대폰 번호가 입력되지 않았습니다.',
    })
    return
  } else if (isNaN(phone2.value)) {
    Toast.fire({
      icon: 'error',
      title: '번호가 아닌 문자가 입력되었습니다. 숫자만 입력해주세요.',
    })
    return
  }

  let phone = `${phone2.value.slice(0, 4)}-${phone2.value.slice(-4)}`
  member.phone = `010-${phone}`
  // 휴대폰 번호 중복체크
  let result = await axios.get(`/api/member/phone/${member.phone}`)
  console.log(result.data.result[0].count)
  if (result.data.result[0].count == 1) {
    Toast.fire({
      icon: 'error',
      title: '이미 가입된 번호입니다.',
    })
    return
  } else {
    // 성공시 버튼 비활성화 및 스타일 변경
    phoneBtn.phoneBtn = false
    phoneBtn.phoneBtnChecked = true
    // 인증번호 생성을 위한 axios 작업
    let res = await axios.post('/api/authenticate', { phone: member.phone })
    // 인증번호 생성 후 auto_increment로 생성된 sms_id값 받아오기
    isAuth.value = res.data.insertId
    console.log(isAuth.value)
    //인증은 3분간만 유효하기 때문에 타이머 180초로 세팅
    timer.value = 180
    //타이머 작동
    loseTime = setInterval(losingTime, 1000)
  }
}
// 인증번호 입력 후 인증번호 일치여부 확인하는 함수.
const authCheck = async () => {
  if (phoneBtn.phoneBtnChecked == false) {
    msg.value = '인증번호 발송이 되지 않았습니다.'
    openModal()
  } else if (phoneBtn.auth == '') {
    msg.value = '인증번호가 입력되지 않았습니다.'
    openModal()
  } else {
    console.log(`/api/authenticate/${isAuth.value}`)

    let res = await axios.post(`/api/authenticate/${isAuth.value}`, { auth: phoneBtn.auth })
    console.log(res.data[0].count)
    if (res.data[0].count > 0) {
      // 인증이 완료된 경우 확인버튼 비활성화 및 스타일 변경.
      phoneBtn.phoneAuth = false
      phoneBtn.phoneAuthChecked = true
      msg.value = '본인인증이 완료되었습니다.'
      openModal()
      //타이머 중단.
      clearInterval(loseTime)
    } else {
      msg.value = '인증번호가 일치하지 않습니다.'
      openModal()
    }
  }
}
// 인증 타이머 동작시 실행되는 함수.
const losingTime = () => {
  timer.value = timer.value - 1
}
// 알림작동 시키는 함수

// 팝업에서 센터 정보 가져오는 함수,
const receiveCenterData = (data) => {
  console.log(data)
  selectedCenter.value = data
  member.center_no = selectedCenter.value.center_no
}
// 최종 회원가입시 동작하는 함수.
const addMemberInfo = async () => {
  console.log(member)
  member.address = member.address + ' ' + detailAddress.value
  if (!member.id) {
    Toast.fire({
      icon: 'error',
      title: '아이디가 입력되지 않았습니다.',
    })
    return
  } else if (member.pw.length < 6) {
    Toast.fire({
      icon: 'error',
      title: '비밀번호는 최소 6글자 이상 입력이 필요합니다.',
    })
    return
  } else if (member.pw == '') {
    Toast.fire({
      icon: 'error',
      title: '비밀번호가 입력되지 않았습니다.',
    })
    return
  } else if (pwc.value == '') {
    Toast.fire({
      icon: 'error',
      title: '비밀번호 확인이 입력되지 않았습니다.',
    })

    return
  } else if (pwc.value != member.pw) {
    Toast.fire({
      icon: 'error',
      title: '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
    })

    return
  } else if (member.name == '') {
    Toast.fire({
      icon: 'error',
      title: '이름이 입력되지 않았습니다.',
    })

    return
  } else if (member.email == '') {
    Toast.fire({
      icon: 'error',
      title: '이메일이 입력되지 않았습니다.',
    })

    return
  } else if (member.phone == '') {
    Toast.fire({
      icon: 'error',
      title: '휴대폰번호가 입력되지 않았습니다.',
    })

    return
  } else if (address.value == '') {
    Toast.fire({
      icon: 'error',
      title: '주소가 입력되지 않았습니다.',
    })

    return
  } else if (member.center_no == 0) {
    Toast.fire({
      icon: 'error',
      title: '센터가 입력되지 않았습니다.',
    })

    return
  } else if (idBtn.value) {
    Toast.fire({
      icon: 'error',
      title: '아이디 중복확인이 되지 않았습니다.',
    })

    return
  } else if (emailBtn.value) {
    Toast.fire({
      icon: 'error',
      title: '이메일 중복확인이 되지 않았습니다.',
    })
    return
  } else if (phoneBtn.phoneBtn || phoneBtn.phoneAuth) {
    Toast.fire({
      icon: 'error',
      title: '휴대폰 인증이 진행되지 않았습니다.',
    })
    return
  }
  let result = await axios.post(`/api/member`, member)
  console.log(result)
  if (result.data.affectedRows > 0) {
    isSignUp.value = true
    msg.value = `회원가입이 완료되었습니다. 사이트 이용은 관리자 승인 후 이용이 가능합니다.`
    openModal()
  }
}

const modalRef = ref(false)
let modalControl = null
// 모달 열기 함수
const openModal = () => {
  modalControl.show()
}
// 모달 닫기 함수
const closeModal = () => {
  modalControl.hide()
  if (isSignUp.value) {
    router.push({ name: 'Signin', query: { id: member.id } })
  }
}
</script>
<template>
  <!-- Modal -->
  <Teleport to="body">
    <div class="modal fade" id="exampleModal" ref="modalRef" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="#4a90c8"
              >
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"></path></svg
              >알림
            </h5>

            <span
              @click="closeModal"
              style="cursor: pointer; font-size: 1.5rem; font-weight: bold; line-height: 1"
            >
              &times;
            </span>
          </div>
          <div class="modal-body text-center">
            <h6>
              {{ msg }}
            </h6>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">취소</button>
            <button
              type="button"
              class="btn"
              style="background-color: #4a90c8; color: white"
              @click="closeModal"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12">
        <navbar isBtn="bg-gradient-light" />
      </div>
    </div>
  </div>
  <main class="main-content mt-0">
    <div
      class="page-header align-items-start min-vh-50 pt-5 pb-11 m-3 border-radius-lg"
      style="background-image: url('/로그인찐막.jpg'); background-position: top"
    >
      <!--뒷 색깔 배경-->
      <span class="mask bg-gradient-dark opacity-3"></span>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-5 text-center mx-auto">
            <h1 class="text-white mb-2 mt-5">회원가입</h1>
            <p class="text-lead text-white">
              회원가입을 위해 아래 내용을 입력 후 가입 버튼을 눌러주세요
            </p>
            <div id="buttons" class="row mb-3 justify-content-center gap-3">
              <argon-button :color="getColor('a1')" class="col-3" v-on:click="selectAuth('a1')">
                일반회원
              </argon-button>
              <argon-button :color="getColor('a2')" class="col-3" v-on:click="selectAuth('a2')"
                >기관 담당자</argon-button
              >
              <argon-button :color="getColor('a3')" class="col-3" v-on:click="selectAuth('a3')"
                >기관관리자</argon-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row mt-lg-n10 mt-md-n11 mt-n10 justify-content-center">
        <div class="col-xl-4 col-lg-5 col-md-7 mx-auto">
          <div class="card z-index-0">
            <div class="card-header text-center pt-4">
              <h5>회원가입</h5>
            </div>

            <div class="card-body">
              <form role="form" v-on:submit.prevent="addMemberInfo()">
                <div class="row">
                  <div class="col-8">
                    <argon-input
                      id="id"
                      type="text"
                      placeholder="아이디"
                      aria-label="Id"
                      minlength="6"
                      maxlength="100"
                      v-model="member.id"
                      :disabled="idBtnChecked"
                      class="mb-0"
                    />
                    <label class="m-0" v-if="idBtnChecked" for="id"
                      >아이디 중복확인이 완료되었습니다.</label
                    >
                  </div>
                  <div class="col-4">
                    <button
                      type="button"
                      :class="{
                        'p-2': true,
                        btn: true,
                        'btn-blue': idBtn,
                        'btn-secondary': idBtnChecked,
                        disabled: idBtnChecked,
                        'w-100': true,
                      }"
                      @click="idCheck()"
                    >
                      중복확인
                    </button>
                  </div>
                </div>
                <argon-input
                  id="pw"
                  type="password"
                  placeholder="비밀번호"
                  aria-label="pw"
                  v-model="member.pw"
                />
                <argon-input
                  id="pwc"
                  type="password"
                  placeholder="비밀번호 확인"
                  aria-label="pwc"
                  v-model="pwc"
                />
                <argon-input
                  id="name"
                  type="text"
                  placeholder="이름"
                  aria-label="name"
                  v-model="member.name"
                />
                <div class="row">
                  <div class="col-8">
                    <argon-input
                      class="mb-0"
                      id="email"
                      type="email"
                      placeholder="example@example.com"
                      aria-label="email"
                      v-model="member.email"
                      :disabled="emailBtnChecked"
                    />
                    <label class="m-0" v-if="emailBtnChecked" for="email"
                      >이메일 중복확인이 완료되었습니다.</label
                    >
                  </div>
                  <div class="col-4">
                    <button
                      type="button"
                      :class="{
                        'p-2': true,
                        btn: true,
                        'btn-blue': emailBtn,
                        'btn-secondary': emailBtnChecked,
                        disabled: emailBtnChecked,
                        'w-100': true,
                      }"
                      @click="emailCheck()"
                    >
                      중복확인
                    </button>
                  </div>
                </div>
                <div class="row">
                  <div class="col-3 mb-0">
                    <argon-input id="phone" modelValue="010" disabled="true" class="mb-0" />
                  </div>

                  <div class="col-5 mb-0">
                    <argon-input
                      id="phone"
                      v-model="phone2"
                      maxlength="8"
                      :disabled="phoneBtn.phoneBtnChecked"
                      placeholder="00000000"
                      class="mb-0"
                    />
                  </div>

                  <div class="col-4 mb-0">
                    <button
                      type="button"
                      :class="{
                        'p-2': true,
                        btn: true,
                        'btn-blue': phoneBtn.phoneBtn,
                        'btn-secondary': phoneBtn.phoneBtnChecked,
                        disabled: phoneBtn.phoneBtnChecked,
                        'mb-0': phoneBtn.phoneBtnChecked,
                        'w-100': true,
                      }"
                      @click="phoneCheck()"
                    >
                      본인인증
                    </button>
                  </div>
                  <div v-if="phoneBtn.phoneBtnChecked" class="col-12">
                    <label for="phone">인증번호가 발송되었습니다.</label>
                  </div>
                </div>
                <div class="row">
                  <div class="col-8 position-relative">
                    <label
                      v-if="!phoneBtn.phoneAuthChecked"
                      for="certification"
                      class="position-absolute bottom-10 end-10 translate-middle-y"
                      >{{ timeFormat }}</label
                    >
                    <argon-input
                      id="certification"
                      v-model="phoneBtn.auth"
                      maxlength="6"
                      placeholder="인증번호"
                      :disabled="phoneBtn.phoneAuthChecked"
                      class="mb-0"
                    />
                    <label v-if="phoneBtn.phoneAuthChecked" for="certification"
                      >인증이 완료되었습니다.</label
                    >
                  </div>
                  <div class="col-4">
                    <button
                      type="button"
                      :class="{
                        'p-2': true,
                        btn: true,
                        'btn-blue': phoneBtn.phoneAuth,
                        'btn-secondary': phoneBtn.phoneAuthChecked,
                        disabled: phoneBtn.phoneAuthChecked,
                        'w-100': true,
                      }"
                      @click="authCheck()"
                    >
                      확인
                    </button>
                  </div>
                </div>
                <div class="row">
                  <div class="col-8">
                    <argon-input v-model="postcode" placeholder="우편번호" disabled />
                  </div>
                  <div class="col-4">
                    <button type="button" class="p-2 btn btn-blue w-100" @click="openPostcode">
                      주소 찾기
                    </button>
                  </div>
                </div>

                <argon-input v-model="address" placeholder="주소" disabled />

                <div class="row">
                  <div class="col-6">
                    <argon-input id="detail_input" v-model="detailAddress" placeholder="상세주소" />
                  </div>
                  <div class="col-6">
                    <argon-input v-model="extraAddress" placeholder="참고항목" disabled />
                  </div>
                </div>
                <div class="row">
                  <div class="col-8">
                    <argon-input
                      id="center_name"
                      v-model="selectedCenter.center_name"
                      placeholder="센터명"
                      disabled
                    />
                  </div>
                  <div class="col-4">
                    <button type="button" class="p-2 btn btn-blue w-100" @click="openCenterCode">
                      센터 찾기
                    </button>
                  </div>
                </div>
                <div class="text-center">
                  <argon-button fullWidth class="my-4 mb-2 btn-blue-main">회원가입</argon-button>
                </div>
                <p class="text-sm mt-3 mb-0">
                  이미 가입하셨습니까?
                  <router-link
                    :to="{ name: 'Signin' }"
                    class="font-weight-bold"
                    style="color: #1e4d6b"
                    >로그인</router-link
                  >
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  <app-footer />
</template>

<style scoped>
.btn-blue {
  background-color: #4a90c8;
  color: white;
  border: none;
}

.btn-blue:hover {
  background-color: #3a80b8;
}

.btn-blue-main {
  background-color: #1e4d6b !important;
  color: white !important;
  border: none !important;
}

.btn-blue-main:hover {
  background-color: #2a6080 !important;
}

/* 탭 버튼 색상 - 푸른 톤 */
#buttons .btn-primary {
  background-color: #4a90c8 !important;
  border-color: #4a90c8 !important;
  color: white !important;
}

#buttons .btn-primary:hover {
  background-color: #3a80b8 !important;
}

#buttons .btn-secondary {
  background-color: #6c757d !important;
  border-color: #6c757d !important;
}

.gap-3 {
  gap: 0.75rem;
}
</style>
