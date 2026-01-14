<script setup>
import { onBeforeUnmount, onBeforeMount, reactive, computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'
// import Navbar from '@/examples/PageLayout/Navbar.vue'
import ArgonInput from '@/components/ArgonInput.vue'
// import ArgonButton from '@/components/ArgonButton.vue'
import { Modal } from 'bootstrap'
import router from '@/router'

const body = document.getElementsByTagName('body')[0]
const store = useStore()
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

const fullNumber = computed(() => {
  return `${phoneNumbers.phone1}-${phoneNumbers.phone2}-${phoneNumbers.phone3}`
})
const member = reactive({
  name: '',
  phone: '',
})
let modalControl = null
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
const matchName = async () => {
  member.phone = fullNumber.value
  let result1 = await axios.get(`/api/member/${member.name}/${member.phone}/1`)
  result1 = result1.data[0]
  if (result1.count == 1) {
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
  } else {
    msg.value = '입력하신 번호와 성함이 일치하는 계정이 존재하지 않습니다.'
    openModal()
    return
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
const modalRef = ref(false)

// 모달 열기 함수
const openModal = () => {
  modalControl.show()
}
// 모달 닫기 함수
const closeModal = () => {
  modalControl.hide()
  if (isFound) {
    router.push({
      name: 'Signin',
      query: {
        id: member.id,
      },
    })
  }
}
let isFound = false
const showId = async () => {
  let result = await axios.get(`/api/member/${member.name}/${member.phone}/2`)
  console.log(result)
  member.id = result.data[0].member_id
  console.log(member)
  msg.value = `${member.name}님의 아이디는 ${member.id} 입니다.`
  isFound = true
  openModal()
}

// 뒤로가기 함수 추가
const goBack = () => {
  router.push({ name: 'Signin' })
}
</script>

<template>
  <!-- Modal -->
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
            <h6 style="color: #344767; font-weight: 400; margin: 0">
              {{ msg }}
            </h6>
          </div>
          <div class="modal-footer" style="border-top: 1px solid #e9ecef; padding: 16px 24px">
            <button
              type="button"
              class="btn"
              @click="closeModal"
              style="
                background-color: #e9ecef;
                color: #344767;
                border: none;
                padding: 8px 24px;
                border-radius: 8px;
              "
            >
              취소
            </button>
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
                  <!-- 뒤로가기 버튼 -->
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
                  <h4 style="color: #1e4d6b; font-weight: 700; margin-bottom: 8px">아이디 찾기</h4>
                  <p style="color: #67748e; font-size: 14px; margin: 0">
                    이름과 휴대폰 번호를 입력해주세요
                  </p>
                </div>
                <div class="card-body" style="padding: 24px 32px 40px">
                  <form v-on:submit.prevent="">
                    <!-- 이름 입력 -->
                    <div class="mb-3">
                      <label
                        style="
                          color: #344767;
                          font-size: 14px;
                          font-weight: 600;
                          margin-bottom: 8px;
                        "
                      >
                        이름
                      </label>
                      <argon-input
                        id="name"
                        type="text"
                        placeholder="이름을 입력하세요"
                        name="name"
                        size="lg"
                        v-model="member.name"
                        style="border-radius: 10px"
                      />
                    </div>

                    <!-- 휴대폰 번호 입력 -->
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
                            @click="matchName()"
                          >
                            본인인증
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- 인증번호 입력 -->
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
                              style="border-radius: 10px"
                            />
                            <label
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

                    <!-- 아이디 찾기 버튼 -->
                    <button
                      type="button"
                      class="btn w-100"
                      @click="showId()"
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
                      아이디 찾기
                    </button>
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
