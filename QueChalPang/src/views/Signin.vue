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
  if (member.id == '' || member.pass == '') {
    alert('아이디 또는 비밀번호가 입력되지 않았습니다. 입력해주세요.')
    return
  }
  let result = await axios.post(`/api/member/login`, member)
  result = result.data
  console.log(result)
  if (result.isCorrect) {
    isLogIn.value.isLogIn = true
    isLogIn.value.info = result.member[0]
    goToBoardInfo()
  } else {
    alert(result.msg)
    return
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
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row">
            <div class="mx-auto col-xl-5 col-lg-5 col-md-7 d-flex flex-column mx-lg-0">
              <div class="card card-plain">
                <div class="pb-0 card-header text-start">
                  <h4 class="font-weight-bolder">로그인</h4>
                  <p class="mb-0">로그인을 위해 아이디와 비밀번호를 입력해주세요.</p>
                </div>
                <div class="card-body">
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
                    <div class="row d-flex justify-content-between">
                      <div class="col-6">
                        <argon-switch id="rememberMe" name="remember-me"
                          >아이디 기억하기</argon-switch
                        >
                      </div>
                      <div class="col-6 text-end" style="font-size: small; cursor: pointer">
                        <span @click="toFindId()">아이디찾기</span> /
                        <span @click="toResetPassword()">비밀번호 재설정</span>
                      </div>
                    </div>
                    <div class="text-center">
                      <argon-button class="mt-4" color="success" fullWidth size="lg"
                        >로그인
                      </argon-button>
                    </div>
                  </form>
                </div>
                <div class="px-1 pt-0 text-center card-footer px-lg-2">
                  <p class="mx-auto mb-4 text-sm">
                    계정이 없으신가요?
                    <router-link
                      :to="{ name: 'Signup' }"
                      class="text-success text-gradient font-weight-bold"
                      >회원가입</router-link
                    >
                  </p>
                </div>
              </div>
            </div>
            <div
              class="top-0 my-auto text-center col-6 d-lg-flex d-none h-100 pe-0 position-absolute end-0 justify-content-center flex-column"
            >
              <div
                class="position-relative bg-gradient-primary h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden"
                style="
                  background-image: url('/로그인일러스트2.jpg');
                  background-size: auto 100%;
                  background-size: cover;
                  background-position: right;
                  background-repeat: no-repeat;
                "
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
