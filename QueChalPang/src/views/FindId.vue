<script setup>
import { onBeforeUnmount, onBeforeMount, reactive, computed, ref } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'
import Navbar from '@/examples/PageLayout/Navbar.vue'
import ArgonInput from '@/components/ArgonInput.vue'
import ArgonButton from '@/components/ArgonButton.vue'

const body = document.getElementsByTagName('body')[0]
const store = useStore()
const phoneNumbers = reactive({
  phone1: '010',
  phone2: '',
  phone3: '',
})
const fullNumber = computed(() => {
  return `${phoneNumbers.phone1}-${phoneNumbers.phone2}-${phoneNumbers.phone3}`
})
const member = reactive({
  name: '',
  phone: '',
})
const certNum = ref('')

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

const matchName = async () => {
  member.phone = fullNumber.value
  let result1 = await axios.get(`/api/member/${member.name}/${member.phone}/1`)
  result1 = result1.data[0]
  if (result1.count == 1) {
    // let result2= await axios.post(`/api/authenticate`,{})
  } else {
    alert('입력하신 번호와 성함이 일치하는 계정이 존재하지 않습니다.')
  }
}
</script>
<template>
  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12">
        <navbar
          isBlur="blur  border-radius-lg my-3 py-2 start-0 end-0 mx-4 shadow"
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
                <h4 class="font-weight-bolder">아이디 찾기</h4>
                <p class="mb-0">아이디를 찾기 위해 이름과 휴대폰 번호를 입력해주세요.</p>
              </div>
              <div class="card-body">
                <form v-on:submit.prevent="">
                  <div class="mb-3">
                    <argon-input
                      id="name"
                      type="text"
                      placeholder="이름"
                      name="name"
                      size="lg"
                      v-model="member.name"
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
                    />
                    <button class="col-3 btn btn-primary" @click="matchName()">본인인증</button>
                  </div>
                  <div class="row d-flex justify-content-between">
                    <div class="col-9">
                      <argon-input
                        id="name"
                        type="text"
                        placeholder="인증번호"
                        name="name"
                        size="lg"
                        v-model="certNum"
                      />
                    </div>
                    <button class="col-3 btn btn-primary">확인</button>
                  </div>

                  <div class="text-center">
                    <argon-button
                      class="mt-4"
                      variant="gradient"
                      color="success"
                      fullWidth
                      size="lg"
                      >아이디 찾기
                    </argon-button>
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
