<script setup>
import { onBeforeUnmount, onBeforeMount, reactive, computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'
import Navbar from '@/examples/PageLayout/Navbar.vue'
import ArgonInput from '@/components/ArgonInput.vue'
import ArgonButton from '@/components/ArgonButton.vue'
import { Modal } from 'bootstrap'
import router from '@/router'

const body = document.getElementsByTagName('body')[0]
const store = useStore()

// --- 상태 관리 ---
const phoneNumbers = reactive({
  phone1: '010',
  phone2: '',
  phone3: '',
})

const phoneBtn = reactive({
  phoneBtn: true,
  phoneBtnChecked: false,
  phoneAuth: true,
  phoneAuthChecked: false,
  auth: '',
})

const isAuth = ref('')
const isStep2 = ref(false)

// 비밀번호 입력 데이터
const passwordData = reactive({
  password: '',
  passwordConfirm: '',
})

const fullNumber = computed(() => {
  return `${phoneNumbers.phone1}-${phoneNumbers.phone2}-${phoneNumbers.phone3}`
})

const member = reactive({
  userId: '', // [수정] 이름 대신 아이디를 사용
  phone: '',
})

let modalControl = null

// --- 라이프사이클 훅 ---
onBeforeMount(() => {
  store.state.hideConfigButton = true
  store.state.showConfig = false
  store.state.showNavbar = false
  store.state.showSidenav = false
  store.state.showFooter = false
  body.classList.remove('bg-gray-100')
})

onBeforeUnmount(() => {
  store.state.hideConfigButton = false
  store.state.showConfig = false
  store.state.showNavbar = true
  store.state.showSidenav = true
  store.state.showFooter = true
  body.classList.add('bg-gray-100')
})

onMounted(() => {
  modalControl = new Modal(modalRef.value)
})

// --- 기능 로직 ---

// 1. 회원 존재 여부 확인 (아이디 + 핸드폰) 및 인증번호 발송
const matchId = async () => {
  // 함수명 변경 matchName -> matchId
  if (!member.userId || !phoneNumbers.phone2 || !phoneNumbers.phone3) {
    msg.value = '아이디와 휴대폰 번호를 모두 입력해주세요.'
    openModal()
    return
  }

  member.phone = fullNumber.value

  try {
    let result1 = await axios.get(`/api/member/${member.userId}/${member.phone}/3`)

    // 데이터 구조 안전하게 접근
    const userData = result1.data && result1.data[0] ? result1.data[0] : null

    if (userData && userData.count == 1) {
      phoneBtn.phoneBtn = false
      phoneBtn.phoneBtnChecked = true

      let res = await axios.post('/api/authenticate', { phone: member.phone })

      isAuth.value = res.data.insertId

      timer.value = 180
      loseTime = setInterval(losingTime, 1000)
    } else {
      msg.value = '입력하신 번호와 아이디가 일치하는 계정이 존재하지 않습니다.'
      openModal()
      return
    }
  } catch (error) {
    console.error(error)
    msg.value = '서버 통신 중 오류가 발생했습니다.'
    openModal()
  }
}

let loseTime
const msg = ref('')
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

const losingTime = () => {
  if (timer.value > 0) timer.value = timer.value - 1
}

// 2. 인증번호 확인
const authCheck = async () => {
  if (phoneBtn.phoneBtnChecked == false) {
    msg.value = '인증번호 발송이 되지 않았습니다.'
    openModal()
    return
  } else if (phoneBtn.auth == '') {
    msg.value = '인증번호가 입력되지 않았습니다.'
    openModal()
    return
  }

  try {
    let res = await axios.post(`/api/authenticate/${isAuth.value}`, { auth: phoneBtn.auth })

    if (res.data[0].count > 0) {
      phoneBtn.phoneAuth = false
      phoneBtn.phoneAuthChecked = true
      clearInterval(loseTime)

      msg.value = '본인인증이 완료되었습니다. 새로운 비밀번호를 입력해주세요.'
      isStep2.value = true
      openModal()
    } else {
      msg.value = '인증번호가 일치하지 않습니다.'
      openModal()
    }
  } catch (error) {
    console.error(error)
    msg.value = '인증 확인 중 오류가 발생했습니다.'
    openModal()
  }
}

// 3. 비밀번호 변경 요청
const resetPassword = async () => {
  if (passwordData.password === '') {
    msg.value = '새로운 비밀번호를 입력해주세요.'
    openModal()
    return
  }
  if (passwordData.password !== passwordData.passwordConfirm) {
    msg.value = '비밀번호가 일치하지 않습니다.'
    openModal()
    return
  }

  try {
    const payload = {
      id: member.userId,
      password: passwordData.password,
    }

    let result = await axios.put('/api/modifyMemberPass', payload)
    result = result.data
    console.log('Password Reset Payload:', payload)
    console.log(result)
    if (result.affectedRows > 0) {
      msg.value = '비밀번호가 성공적으로 변경되었습니다.\n로그인 페이지로 이동합니다.'
      isPasswordChanged = true
      openModal()
      return
    } else {
      msg.value = '비밀번호가 변경되지 않았습니다. 입력하신 비밀번호가 기존 비밀번호와 일치합니다.'
      isPasswordChanged = true
      openModal()
      return
    }
  } catch (error) {
    console.error(error)
    msg.value = '비밀번호 변경 중 오류가 발생했습니다.'
    openModal()
  }
}

const modalRef = ref(false)
let isPasswordChanged = false

const openModal = () => {
  modalControl.show()
}

const closeModal = () => {
  modalControl.hide()
  if (isPasswordChanged) {
    router.push({ name: 'Signin', query: { id: member.userId } })
  }
}
</script>

<template>
  <Teleport to="body">
    <div class="modal fade" id="exampleModal" ref="modalRef" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">알림</h5>
            <span
              @click="closeModal"
              style="cursor: pointer; font-size: 1.5rem; font-weight: bold; line-height: 1"
            >
              &times;
            </span>
          </div>
          <div class="modal-body text-center" style="white-space: pre-line">
            <h6>{{ msg }}</h6>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="closeModal">확인</button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>

  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12">
        <navbar
          isBlur="blur border-radius-lg my-3 py-2 start-0 end-0 mx-4 shadow"
          v-bind:darkMode="true"
          isBtn="bg-gradient-success"
        />
      </div>
    </div>
  </div>

  <main class="mt-0 main-content">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="mx-auto w-50">
            <div class="card card-plain">
              <div class="pb-0 card-header text-start">
                <h4 class="font-weight-bolder">비밀번호 재설정</h4>
                <p class="mb-0">아이디와 휴대폰 번호로 본인인증을 진행해주세요.</p>
              </div>
              <div class="card-body">
                <form v-on:submit.prevent="">
                  <div class="mb-3">
                    <argon-input
                      id="userId"
                      type="text"
                      placeholder="아이디"
                      name="userId"
                      size="lg"
                      v-model="member.userId"
                      :disabled="isStep2"
                    />
                  </div>

                  <div class="row mb-3">
                    <argon-input
                      class="col-3"
                      id="phone1"
                      type="text"
                      placeholder="010"
                      name="phone1"
                      size="lg"
                      v-model="phoneNumbers.phone1"
                      disabled
                    />
                    <argon-input
                      class="col-3"
                      maxlength="4"
                      id="phone2"
                      type="text"
                      placeholder="0000"
                      name="phone2"
                      size="lg"
                      v-model="phoneNumbers.phone2"
                      :disabled="phoneBtn.phoneBtnChecked"
                    />
                    <argon-input
                      class="col-3"
                      maxlength="4"
                      id="phone3"
                      type="text"
                      placeholder="0000"
                      name="phone3"
                      size="lg"
                      v-model="phoneNumbers.phone3"
                      :disabled="phoneBtn.phoneBtnChecked"
                    />
                    <button
                      :class="{
                        'col-3': true,
                        btn: true,
                        'btn-primary': phoneBtn.phoneBtn,
                        'btn-secondary': phoneBtn.phoneBtnChecked,
                        disabled: phoneBtn.phoneBtnChecked,
                      }"
                      @click="matchId()"
                    >
                      본인인증
                    </button>
                  </div>

                  <div class="row d-flex justify-content-between">
                    <div class="col-9 position-relative">
                      <argon-input
                        id="certification"
                        type="text"
                        placeholder="인증번호"
                        name="certification"
                        size="lg"
                        v-model="phoneBtn.auth"
                        :disabled="phoneBtn.phoneAuthChecked"
                      />
                      <label
                        v-if="!phoneBtn.phoneAuthChecked && phoneBtn.phoneBtnChecked"
                        for="certification"
                        class="position-absolute end-0 top-50 translate-middle-y me-4 mb-0"
                        style="z-index: 5; color: #666; font-size: 0.9rem; pointer-events: none"
                      >
                        {{ timeFormat }}
                      </label>
                    </div>
                    <button
                      :class="{
                        'col-3': true,
                        btn: true,
                        'btn-primary': phoneBtn.phoneAuth,
                        'btn-secondary': phoneBtn.phoneAuthChecked,
                        disabled: phoneBtn.phoneAuthChecked,
                      }"
                      @click="authCheck()"
                    >
                      확인
                    </button>
                  </div>

                  <div v-if="isStep2" class="mt-4">
                    <hr class="horizontal dark my-4" />
                    <p class="text-uppercase text-sm">새 비밀번호 입력</p>

                    <div class="mb-3">
                      <argon-input
                        id="newPassword"
                        type="password"
                        placeholder="새 비밀번호"
                        name="newPassword"
                        size="lg"
                        v-model="passwordData.password"
                      />
                    </div>
                    <div class="mb-3">
                      <argon-input
                        id="confirmPassword"
                        type="password"
                        placeholder="새 비밀번호 확인"
                        name="confirmPassword"
                        size="lg"
                        v-model="passwordData.passwordConfirm"
                      />
                    </div>
                  </div>

                  <div class="row text-center">
                    <div class="col-12">
                      <argon-button
                        v-if="isStep2"
                        class="mt-4"
                        variant="gradient"
                        color="success"
                        fullWidth
                        size="lg"
                        @click="resetPassword()"
                      >
                        비밀번호 변경
                      </argon-button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
