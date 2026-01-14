<script setup>
import { onBeforeUnmount, onBeforeMount, reactive, computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'
// import Navbar from '@/examples/PageLayout/Navbar.vue'
import ArgonInput from '@/components/ArgonInput.vue'
import { Modal } from 'bootstrap'
import router from '@/router'

const body = document.getElementsByTagName('body')[0]
const store = useStore()

// --- 상태 관리 (기존 resetPass 로직 유지) ---
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
  userId: '',
  phone: '',
})

let modalControl = null
const modalRef = ref(null)

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

// 뒤로가기 함수 (findID 디자인에 포함됨)
const goBack = () => {
  router.push({ name: 'Signin' })
}

// 1. 회원 존재 여부 확인 (아이디 + 핸드폰) 및 인증번호 발송
const matchId = async () => {
  if (!member.userId || !phoneNumbers.phone2 || !phoneNumbers.phone3) {
    msg.value = '아이디와 휴대폰 번호를 모두 입력해주세요.'
    openModal()
    return
  }

  member.phone = fullNumber.value

  try {
    let result1 = await axios.get(`/api/member/${member.userId}/${member.phone}/3`)
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

      msg.value = '본인인증이 완료되었습니다.\n새로운 비밀번호를 입력해주세요.'
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

    if (result.affectedRows > 0) {
      msg.value = '비밀번호가 성공적으로 변경되었습니다.\n로그인 페이지로 이동합니다.'
      isPasswordChanged = true
      openModal()
      return
    } else {
      msg.value = '비밀번호가 변경되지 않았습니다.\n입력하신 비밀번호가 기존 비밀번호와 일치합니다.'
      isPasswordChanged = true // 편의상 이동
      openModal()
      return
    }
  } catch (error) {
    console.error(error)
    msg.value = '비밀번호 변경 중 오류가 발생했습니다.'
    openModal()
  }
}

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
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" style="border-radius: 12px; border: none">
          <div class="modal-header" style="border-bottom: 1px solid #e9ecef; padding: 24px">
            <h5 class="modal-title" style="color: #1e4d6b; font-weight: 600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="#4a90c8"
                style="margin-right: 8px; vertical-align: middle"
              >
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"></path>
              </svg>
              알림
            </h5>
            <span
              @click="closeModal"
              style="
                cursor: pointer;
                font-size: 24px;
                font-weight: 300;
                line-height: 1;
                color: #666;
              "
            >
              &times;
            </span>
          </div>
          <div class="modal-body text-center" style="padding: 32px 24px">
            <h6 style="color: #344767; font-weight: 400; margin: 0; white-space: pre-line">
              {{ msg }}
            </h6>
          </div>
          <div class="modal-footer" style="border-top: 1px solid #e9ecef; padding: 16px 24px">
            <button
              type="button"
              class="btn"
              @click="closeModal"
              style="
                background-color: #4a90c8;
                color: white;
                border: none;
                padding: 8px 24px;
                border-radius: 8px;
              "
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12">
        <navbar
          isBlur="blur border-radius-lg my-3 py-2 start-0 end-0 mx-4 shadow"
          v-bind:darkMode="true"
          isBtn="bg-gradient-success"
        />
      </div>
    </div>
  </div> -->

  <main class="mt-0 main-content">
    <section>
      <div
        class="page-header min-vh-100"
        style="background: linear-gradient(to bottom, #d8e8f0 0%, #e5f0f5 50%, #f5f5e8 100%)"
      >
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-5 col-md-7">
              <div
                class="card"
                style="
                  border-radius: 16px;
                  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                  border: none;
                "
              >
                <div
                  class="card-header text-center"
                  style="background: transparent; border: none; padding: 40px 32px 16px"
                >
                  <div style="padding: 12px 0 0 8px">
                    <button
                      @click="goBack"
                      class="btn"
                      style="
                        background: transparent;
                        border: none;
                        padding: 8px;
                        color: #4a90c8;
                        font-size: 24px;
                        line-height: 1;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        cursor: pointer;
                      "
                      onmouseover="this.style.background='transparent'"
                      onmouseout="this.style.background='transparent'"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                      </svg>
                    </button>
                  </div>
                  <h4 style="color: #1e4d6b; font-weight: 700; margin-bottom: 8px">
                    비밀번호 재설정
                  </h4>
                  <p style="color: #67748e; font-size: 14px; margin: 0">
                    아이디와 휴대폰 번호로 본인인증을 진행해주세요
                  </p>
                </div>

                <div class="card-body" style="padding: 24px 32px 40px">
                  <form v-on:submit.prevent="">
                    <div class="mb-3">
                      <label
                        style="
                          color: #344767;
                          font-size: 14px;
                          font-weight: 600;
                          margin-bottom: 8px;
                        "
                      >
                        아이디
                      </label>
                      <argon-input
                        id="userId"
                        type="text"
                        placeholder="아이디를 입력하세요"
                        name="userId"
                        size="lg"
                        v-model="member.userId"
                        :disabled="isStep2"
                        style="border-radius: 10px"
                      />
                    </div>

                    <div class="mb-3">
                      <label
                        style="
                          color: #344767;
                          font-size: 14px;
                          font-weight: 600;
                          margin-bottom: 8px;
                        "
                      >
                        휴대폰 번호
                      </label>
                      <div class="row g-2">
                        <div class="col-3">
                          <argon-input
                            id="phone1"
                            type="text"
                            placeholder="010"
                            name="phone1"
                            size="lg"
                            v-model="phoneNumbers.phone1"
                            disabled
                            style="border-radius: 10px"
                          />
                        </div>
                        <div class="col-3">
                          <argon-input
                            maxlength="4"
                            id="phone2"
                            type="text"
                            placeholder="0000"
                            name="phone2"
                            size="lg"
                            v-model="phoneNumbers.phone2"
                            :disabled="phoneBtn.phoneBtnChecked"
                            style="border-radius: 10px"
                          />
                        </div>
                        <div class="col-3">
                          <argon-input
                            maxlength="4"
                            id="phone3"
                            type="text"
                            placeholder="0000"
                            name="phone3"
                            size="lg"
                            v-model="phoneNumbers.phone3"
                            :disabled="phoneBtn.phoneBtnChecked"
                            style="border-radius: 10px"
                          />
                        </div>
                        <div class="col-3">
                          <button
                            :class="{
                              btn: true,
                              'w-100': true,
                              disabled: phoneBtn.phoneBtnChecked,
                            }"
                            :style="{
                              backgroundColor: phoneBtn.phoneBtnChecked ? '#e9ecef' : '#4a90c8',
                              color: phoneBtn.phoneBtnChecked ? '#adb5bd' : 'white',
                              border: 'none',
                              borderRadius: '10px',
                              fontSize: '14px',
                              fontWeight: '600',
                              padding: '10px 8px',
                            }"
                            @click="matchId()"
                          >
                            본인인증
                          </button>
                        </div>
                      </div>
                    </div>

                    <div class="mb-4">
                      <label
                        style="
                          color: #344767;
                          font-size: 14px;
                          font-weight: 600;
                          margin-bottom: 8px;
                        "
                      >
                        인증번호
                      </label>
                      <div class="row g-2">
                        <div class="col-9">
                          <div class="position-relative">
                            <argon-input
                              id="certification"
                              type="text"
                              placeholder="인증번호를 입력하세요"
                              name="certification"
                              size="lg"
                              v-model="phoneBtn.auth"
                              :disabled="phoneBtn.phoneAuthChecked"
                              style="border-radius: 10px"
                            />
                            <label
                              v-if="!phoneBtn.phoneAuthChecked && phoneBtn.phoneBtnChecked"
                              for="certification"
                              class="position-absolute top-50 translate-middle-y"
                              style="
                                right: 15px;
                                z-index: 5;
                                color: #4a90c8;
                                font-size: 14px;
                                font-weight: 600;
                                pointer-events: none;
                                margin: 0;
                              "
                            >
                              {{ timeFormat }}
                            </label>
                          </div>
                        </div>
                        <div class="col-3">
                          <button
                            :class="{
                              btn: true,
                              'w-100': true,
                              disabled: phoneBtn.phoneAuthChecked,
                            }"
                            :style="{
                              backgroundColor: phoneBtn.phoneAuthChecked ? '#e9ecef' : '#4a90c8',
                              color: phoneBtn.phoneAuthChecked ? '#adb5bd' : 'white',
                              border: 'none',
                              borderRadius: '10px',
                              fontSize: '14px',
                              fontWeight: '600',
                              padding: '10px 8px',
                            }"
                            @click="authCheck()"
                          >
                            확인
                          </button>
                        </div>
                      </div>
                    </div>

                    <div v-if="isStep2">
                      <hr style="border-top: 1px dashed #c0c6cc; margin: 20px 0 30px" />

                      <div class="mb-3">
                        <label
                          style="
                            color: #344767;
                            font-size: 14px;
                            font-weight: 600;
                            margin-bottom: 8px;
                          "
                        >
                          새 비밀번호
                        </label>
                        <argon-input
                          id="newPassword"
                          type="password"
                          placeholder="새 비밀번호를 입력하세요"
                          name="newPassword"
                          size="lg"
                          v-model="passwordData.password"
                          style="border-radius: 10px"
                        />
                      </div>

                      <div class="mb-4">
                        <label
                          style="
                            color: #344767;
                            font-size: 14px;
                            font-weight: 600;
                            margin-bottom: 8px;
                          "
                        >
                          비밀번호 확인
                        </label>
                        <argon-input
                          id="confirmPassword"
                          type="password"
                          placeholder="비밀번호를 다시 입력하세요"
                          name="confirmPassword"
                          size="lg"
                          v-model="passwordData.passwordConfirm"
                          style="border-radius: 10px"
                        />
                      </div>

                      <button
                        type="button"
                        class="btn w-100"
                        @click="resetPassword()"
                        style="
                          background-color: #1e4d6b;
                          color: white;
                          border: none;
                          padding: 12px;
                          border-radius: 10px;
                          font-size: 16px;
                          font-weight: 600;
                        "
                      >
                        비밀번호 변경하기
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
