<script setup>
import { onBeforeUnmount, onBeforeMount, ref, onMounted, onUnmounted, reactive } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'

import Navbar from '@/examples/PageLayout/Navbar.vue'
import AppFooter from '@/examples/PageLayout/Footer.vue'
import ArgonInput from '@/components/ArgonInput.vue'
import ArgonButton from '@/components/ArgonButton.vue'
import ArgonAlert from '@/components/ArgonAlert.vue'
const body = document.getElementsByTagName('body')[0]

const store = useStore()
const postcode = ref('')
const address = ref('')
const detailAddress = ref('')
const extraAddress = ref('')
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
})
onUnmounted(() => {
  delete window.receiveCenterData
})
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
      address.value = addr // 기본 주소
      member.address = address.value
      console.log(member)
      // 상세주소로 포커스 이동은 ref를 사용하거나 직접 접근
      document.getElementById('detail_input').focus()
    },
  }).open()
}
const idBtn = ref(true)
const idBtnChecked = ref(false)
const emailBtn = ref(true)
const emailBtnChecked = ref(false)
const msg = ref('')
const argonAlert = ref(false)
const selectedCenter = ref({ center_name: '', center_no: 0 })
const authority = ref('a1')
const member = reactive({
  id: '',
  pass: '',
  name: '',
  email: '',
  phone: '',
  address: '',
  center_no: 0,
  authority: 'a1',
})
const pwc = ref('')
const isIdDisabled = ref(false)
const isEmailDisabled = ref(false)
const selectAuth = (auth) => {
  authority.value = auth
  member.authority = auth
  console.log(member)
}
const idCheck = async () => {
  if (member.id == '') {
    showAlert('아이디가 입력되지 않았습니다. 아이디를 입력해주세요.')
    return
  }
  let result = await axios.get(`/api/member/id/${member.id}`)
  console.log(result.data.result[0].count)
  if (result.data.result[0].count == 1) {
    showAlert('이미 존재하는 아이디입니다.')
    return
  } else {
    idBtn.value = false
    idBtnChecked.value = true
    isIdDisabled.value = true
  }
}
const emailCheck = async () => {
  if (member.email == '') {
    showAlert('이메일이 입력되지 않았습니다. 이메일을 입력해주세요.')
    return
  }
  let result = await axios.get(`/api/member/email/${member.email}`)
  console.log(result.data.result[0].count)
  if (result.data.result[0].count == 1) {
    showAlert('이미 존재하는 이메일입니다.')
    return
  } else {
    emailBtn.value = false
    emailBtnChecked.value = true
    isEmailDisabled.value = true
  }
}
const showAlert = (message) => {
  msg.value = message
  argonAlert.value = true
  setTimeout(() => {
    argonAlert.value = false
  }, 1500)
}
const receiveCenterData = (data) => {
  console.log(data)
  selectedCenter.value = data
  member.center_no = selectedCenter.value.center_no
}
const addMemberInfo = () => {
  console.log(member)
  member.address = member.address + ' ' + detailAddress.value
  if (!member.id) {
    showAlert('아이디가 입력되지 않았습니다.')
  } else if (!member.pw) {
    showAlert('비밀번호가 입력되지 않았습니다.')
  } else if (!pwc.value) {
    showAlert('비밀번호 확인이 입력되지 않았습니다.')
  } else if (!member.email) {
    showAlert('이메일이 입력되지 않았습니다.')
  } else if (!member.address) {
    showAlert('주소가 입력되지 않았습니다.')
  } else if (member.center_no == 0) {
    showAlert('센터가 입력되지 않았습니다.')
  }
  // let result = axios.post(`/member`,member)
  // console.log(result)
}
const getColor = (id) => {
  return authority.value === id ? 'primary' : 'secondary'
}
</script>
<template>
  <div class="fixed-top d-flex justify-content-end p-3">
    <div class="col-4">
      <ArgonAlert
        v-show="argonAlert"
        color="warning"
        icon="ni ni-bell-55"
        dismissible
        @close="argonAlert = false"
        >{{ msg }}</ArgonAlert
      >
    </div>
  </div>
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
      style="
        background-image: url('https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signup-cover.jpg');
        background-position: top;
      "
    >
      <span class="mask bg-gradient-dark opacity-6"></span>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-5 text-center mx-auto">
            <h1 class="text-white mb-2 mt-5">회원가입</h1>
            <p class="text-lead text-white">
              회원가입을 위해 아래 내용을 입력 후 가입 버튼을 눌러주세요
            </p>
            <div id="buttons" class="row mb-3 justify-content-center">
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
            <!-- <div class="row px-xl-5 px-sm-4 px-3">
              <div class="col-3 ms-auto px-1">
                <a class="btn btn-outline-light w-100" href="javascript:;">
                  <svg width="24px" height="32px" viewBox="0 0 64 64" version="1.1">
                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g transform="translate(3.000000, 3.000000)" fill-rule="nonzero">
                        <circle fill="#3C5A9A" cx="29.5091719" cy="29.4927506" r="29.4882047" />
                        <path
                          d="M39.0974944,9.05587273 L32.5651312,9.05587273 C28.6886088,9.05587273 24.3768224,10.6862851 24.3768224,16.3054653 C24.395747,18.2634019 24.3768224,20.1385313 24.3768224,22.2488655 L19.8922122,22.2488655 L19.8922122,29.3852113 L24.5156022,29.3852113 L24.5156022,49.9295284 L33.0113092,49.9295284 L33.0113092,29.2496356 L38.6187742,29.2496356 L39.1261316,22.2288395 L32.8649196,22.2288395 C32.8649196,22.2288395 32.8789377,19.1056932 32.8649196,18.1987181 C32.8649196,15.9781412 35.1755132,16.1053059 35.3144932,16.1053059 C36.4140178,16.1053059 38.5518876,16.1085101 39.1006986,16.1053059 L39.1006986,9.05587273 L39.0974944,9.05587273 L39.0974944,9.05587273 Z"
                          fill="#FFFFFF"
                        />
                      </g>
                    </g>
                  </svg>
                </a>
              </div>
              <div class="col-3 px-1">
                <a class="btn btn-outline-light w-100" href="javascript:;">
                  <svg width="24px" height="32px" viewBox="0 0 64 64" version="1.1">
                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g
                        transform="translate(7.000000, 0.564551)"
                        fill="#000000"
                        fill-rule="nonzero"
                      >
                        <path
                          d="M40.9233048,32.8428307 C41.0078713,42.0741676 48.9124247,45.146088 49,45.1851909 C48.9331634,45.4017274 47.7369821,49.5628653 44.835501,53.8610269 C42.3271952,57.5771105 39.7241148,61.2793611 35.6233362,61.356042 C31.5939073,61.431307 30.2982233,58.9340578 25.6914424,58.9340578 C21.0860585,58.9340578 19.6464932,61.27947 15.8321878,61.4314159 C11.8738936,61.5833617 8.85958554,57.4131833 6.33064852,53.7107148 C1.16284874,46.1373849 -2.78641926,32.3103122 2.51645059,22.9768066 C5.15080028,18.3417501 9.85858819,15.4066355 14.9684701,15.3313705 C18.8554146,15.2562145 22.5241194,17.9820905 24.9003639,17.9820905 C27.275104,17.9820905 31.733383,14.7039812 36.4203248,15.1854154 C38.3824403,15.2681959 43.8902255,15.9888223 47.4267616,21.2362369 C47.1417927,21.4153043 40.8549638,25.1251794 40.9233048,32.8428307 M33.3504628,10.1750144 C35.4519466,7.59650964 36.8663676,4.00699306 36.4804992,0.435448578 C33.4513624,0.558856931 29.7884601,2.48154382 27.6157341,5.05863265 C25.6685547,7.34076135 23.9632549,10.9934525 24.4233742,14.4943068 C27.7996959,14.7590956 31.2488715,12.7551531 33.3504628,10.1750144"
                        />
                      </g>
                    </g>
                  </svg>
                </a>
              </div>
              <div class="col-3 me-auto px-1">
                <a class="btn btn-outline-light w-100" href="javascript:;">
                  <svg width="24px" height="32px" viewBox="0 0 64 64" version="1.1">
                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g transform="translate(3.000000, 2.000000)" fill-rule="nonzero">
                        <path
                          d="M57.8123233,30.1515267 C57.8123233,27.7263183 57.6155321,25.9565533 57.1896408,24.1212666 L29.4960833,24.1212666 L29.4960833,35.0674653 L45.7515771,35.0674653 C45.4239683,37.7877475 43.6542033,41.8844383 39.7213169,44.6372555 L39.6661883,45.0037254 L48.4223791,51.7870338 L49.0290201,51.8475849 C54.6004021,46.7020943 57.8123233,39.1313952 57.8123233,30.1515267"
                          fill="#4285F4"
                        />
                        <path
                          d="M29.4960833,58.9921667 C37.4599129,58.9921667 44.1456164,56.3701671 49.0290201,51.8475849 L39.7213169,44.6372555 C37.2305867,46.3742596 33.887622,47.5868638 29.4960833,47.5868638 C21.6960582,47.5868638 15.0758763,42.4415991 12.7159637,35.3297782 L12.3700541,35.3591501 L3.26524241,42.4054492 L3.14617358,42.736447 C7.9965904,52.3717589 17.959737,58.9921667 29.4960833,58.9921667"
                          fill="#34A853"
                        />
                        <path
                          d="M12.7159637,35.3297782 C12.0932812,33.4944915 11.7329116,31.5279353 11.7329116,29.4960833 C11.7329116,27.4640054 12.0932812,25.4976752 12.6832029,23.6623884 L12.6667095,23.2715173 L3.44779955,16.1120237 L3.14617358,16.2554937 C1.14708246,20.2539019 0,24.7439491 0,29.4960833 C0,34.2482175 1.14708246,38.7380388 3.14617358,42.736447 L12.7159637,35.3297782"
                          fill="#FBBC05"
                        />
                        <path
                          d="M29.4960833,11.4050769 C35.0347044,11.4050769 38.7707997,13.7975244 40.9011602,15.7968415 L49.2255853,7.66898166 C44.1130815,2.91684746 37.4599129,0 29.4960833,0 C17.959737,0 7.9965904,6.62018183 3.14617358,16.2554937 L12.6832029,23.6623884 C15.0758763,16.5505675 21.6960582,11.4050769 29.4960833,11.4050769"
                          fill="#EB4335"
                        />
                      </g>
                    </g>
                  </svg>
                </a>
              </div>
              <div class="mt-2 position-relative text-center">
                <p
                  class="text-sm font-weight-bold mb-2 text-secondary text-border d-inline z-index-2 bg-white px-3"
                >
                  or
                </p>
              </div>
            </div> -->
            <div class="card-body">
              <form role="form" v-on:submit.prevent="addMemberInfo()">
                <div class="row">
                  <div class="col-8">
                    <argon-input
                      id="id"
                      type="text"
                      placeholder="아이디"
                      aria-label="Id"
                      v-model="member.id"
                      :disabled="isIdDisabled"
                    />
                  </div>
                  <div class="col-4">
                    <button
                      type="button"
                      :class="{
                        'p-2': true,
                        btn: true,
                        'btn-primary': idBtn,
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
                      id="email"
                      type="email"
                      placeholder="example@example.com"
                      aria-label="email"
                      v-model="member.email"
                      :disabled="isEmailDisabled"
                    />
                  </div>
                  <div class="col-4">
                    <button
                      type="button"
                      :class="{
                        'p-2': true,
                        btn: true,
                        'btn-primary': emailBtn,
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
                  <div class="col-8">
                    <argon-input id="phone" v-model="member.phone" placeholder="전화번호" />
                  </div>
                  <div class="col-4">
                    <button type="button" class="p-2 btn btn-primary w-100">본인인증</button>
                  </div>
                </div>
                <div class="row">
                  <div class="col-8">
                    <argon-input id="certification" placeholder="인증번호" disabled="true" />
                  </div>
                  <div class="col-4">
                    <button type="button" class="p-2 btn btn-primary w-100">확인</button>
                  </div>
                </div>
                <div class="row">
                  <div class="col-8">
                    <argon-input v-model="postcode" placeholder="우편번호" disabled />
                  </div>
                  <div class="col-4">
                    <button type="button" class="p-2 btn btn-primary w-100" @click="openPostcode">
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
                    <button type="button" class="p-2 btn btn-primary w-100" @click="openCenterCode">
                      센터 찾기
                    </button>
                  </div>
                </div>
                <div class="text-center">
                  <argon-button fullWidth color="dark" variant="gradient" class="my-4 mb-2"
                    >회원가입</argon-button
                  >
                </div>
                <p class="text-sm mt-3 mb-0">
                  이미 가입하셨습니까?
                  <a href="javascript:;" class="text-dark font-weight-bolder">로그인</a>
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
