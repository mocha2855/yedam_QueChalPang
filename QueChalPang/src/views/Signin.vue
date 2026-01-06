<script setup>
import { onBeforeUnmount, onBeforeMount, reactive } from 'vue'
import { useStore } from 'vuex'
import { useCounterStore } from '@/stores/member'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import Navbar from '@/examples/PageLayout/Navbar.vue'
import ArgonInput from '@/components/ArgonInput.vue'
import ArgonSwitch from '@/components/ArgonSwitch.vue'
import ArgonButton from '@/components/ArgonButton.vue'
import { storeToRefs } from 'pinia'

const body = document.getElementsByTagName('body')[0]
const store = useStore()
const counterStore = useCounterStore()
const router = useRouter()
const route = useRoute()
const { isLogIn } = storeToRefs(counterStore)
const member = reactive({
  id: '',
  pass: '',
})

onBeforeMount(() => {
  store.state.hideConfigButton = true
  store.state.showConfig = false
  store.state.showNavbar = false
  store.state.showSidenav = false
  store.state.showFooter = false
  body.classList.remove('bg-gray-100')
  if (route.query.id != '') {
    member.id = route.query.id
  }
})

onBeforeUnmount(() => {
  store.state.hideConfigButton = false
  store.state.showConfig = false
  store.state.showNavbar = true
  store.state.showSidenav = true
  store.state.showFooter = true
  body.classList.add('bg-gray-100')
})

const logIn = async () => {
  let result = await axios.post(`/api/member/login`, member)
  result = result.data
  console.log(result)
  if (result.isCorrect) {
    isLogIn.value.isLogIn = true
    isLogIn.value.info = result.member[0]
    goToBoardInfo()
  }
  console.log(isLogIn.value)
}

const goToBoardInfo = () => {
  router.push({ name: '/' })
}
const toFindId = () => {
  router.push({ name: 'FindId' })
}
const toResetPassword = () => {
  router.push({ name: 'ResetPass' })
}
</script>
<template>
  <navbar v-bind:darkMode="true" />

  <main class="mt-0 main-content">
    <section>
      <div
        class="page-header min-vh-100"
        style="background: linear-gradient(to bottom, #d8e8f0 0%, #e5f0f5 50%, #f5f5e8 100%)"
      >
        <div class="container-fluid px-0">
          <div class="row justify-content-start">
            <div class="col-xl-5 col-lg-5 col-md-7 d-flex flex-column" style="padding-left: 14%">
              <div
                class="card card-plain"
                style="
                  background-color: white;
                  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
                  padding: 1.5rem;
                  max-width: 490px;
                "
              >
                <div class="pb-0 card-header text-start" style="border: none; padding-bottom: 1rem">
                  <h3 class="font-weight-bolder mb-2" style="color: #2d3748">로그인</h3>
                  <p class="mb-0" style="color: #718096; font-size: 0.95rem">
                    로그인을 위해 아이디와 비밀번호를 입력해주세요.
                  </p>
                </div>
                <div class="card-body" style="padding-top: 1rem">
                  <form v-on:submit.prevent="logIn()">
                    <div class="mb-3">
                      <argon-input
                        id="id"
                        type="text"
                        placeholder="아이디"
                        name="id"
                        size="lg"
                        v-model="member.id"
                      />
                    </div>
                    <div class="mb-3">
                      <argon-input
                        id="password"
                        type="password"
                        placeholder="비밀번호"
                        name="password"
                        size="lg"
                        v-model="member.pass"
                      />
                    </div>
                    <div class="row d-flex justify-content-between align-items-center mb-3">
                      <div class="col-6">
                        <argon-switch id="rememberMe" name="remember-me">
                          <span style="color: #4a5568; font-size: 0.9rem">아이디 기억하기</span>
                        </argon-switch>
                      </div>
                      <div class="col-6 text-end" style="font-size: 0.9rem; cursor: pointer">
                        <span @click="toFindId()" style="color: #5fc4b8">아이디찾기</span>
                        <span style="color: #cbd5e0; margin: 0 0.3rem">|</span>
                        <span @click="toResetPassword()" style="color: #5fc4b8"
                          >비밀번호 재설정</span
                        >
                      </div>
                    </div>
                    <div class="text-center">
                      <argon-button class="mt-3 login-btn" fullWidth size="lg">
                        로그인
                      </argon-button>
                    </div>
                  </form>
                </div>
                <div
                  class="px-1 pt-3 text-center card-footer px-lg-2"
                  style="border: none; background: transparent"
                >
                  <p class="mx-auto mb-3 text-sm" style="color: #718096">
                    계정이 없으신가요?
                    <router-link
                      :to="{ name: 'Signup' }"
                      class="font-weight-bold"
                      style="color: #5fc4b8; text-decoration: none; margin-left: 0.3rem"
                    >
                      회원가입
                    </router-link>
                  </p>
                </div>
              </div>
            </div>
            <div
              class="top-0 my-auto text-center col-6 d-lg-flex d-none h-100 pe-0 position-absolute end-0 justify-content-center flex-column"
              style="padding: 0"
            >
              <div
                class="position-relative h-100 d-flex flex-column justify-content-center overflow-hidden"
                style="
                  background-image: url('/로그인찐막.jpg');
                  background-size: cover;
                  background-position: center;
                  background-repeat: no-repeat;
                  margin: 0;
                  padding: 0;
                  border-radius: 0;
                "
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* 입력창 스타일 */
:deep(.form-control) {
  border-radius: 12px !important;
  border: 1.5px solid #e2e8f0 !important;
  padding: 1rem 1.3rem !important; /* 여기 수정 */
  font-size: 1rem !important; /* 이것도 추가 */
  transition: all 0.3s ease !important;
}

:deep(.form-control:focus) {
  border-color: #5fc4b8 !important;
  box-shadow: 0 0 0 3px rgba(95, 196, 184, 0.1) !important;
}

:deep(.form-control::placeholder) {
  color: #a0aec0 !important;
  font-size: 0.95rem !important; /* placeholder 크기 */
}

/* 로그인 버튼 스타일 */
.login-btn {
  background: linear-gradient(135deg, #5fc4b8 0%, #4db8ac 100%) !important;
  border: none !important;
  border-radius: 12px !important;
  padding: 0.9rem 2rem !important;
  font-weight: 600 !important;
  letter-spacing: 0.3px !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 15px rgba(95, 196, 184, 0.3) !important;
}

.login-btn:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 20px rgba(95, 196, 184, 0.4) !important;
}

/* 스위치 스타일 */
:deep(.form-check-input) {
  cursor: pointer;
}

:deep(.form-check-input:checked) {
  background-color: #5fc4b8 !important;
  border-color: #5fc4b8 !important;
}

/* 카드 푸터 */
.card-footer {
  padding-top: 1.5rem !important;
}
</style>
