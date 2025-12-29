<script setup>
import { onBeforeUnmount, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { storeToRefs } from 'pinia'
import { useCounterStore } from '@/stores/member'
// import ArgonInput from '@/components/ArgonInput.vue'
// import ArgonButton from '@/components/ArgonButton.vue'
// import CenterTable from './components/CenterTable.vue'
// import axios from 'axios'
const counterStore = useCounterStore()
const { isLogIn } = storeToRefs(counterStore)
const router = useRouter();
const body = document.getElementsByTagName('body')[0]

const store = useStore()
onBeforeMount(() => {
  store.state.hideConfigButton = false
  store.state.showNavbar = false
  store.state.showSidenav = false
  store.state.showFooter = false
  body.classList.remove('bg-gray-100')
  clearInfo()
})
onBeforeUnmount(() => {
  store.state.hideConfigButton = true
  store.state.showNavbar = true
  store.state.showSidenav = true
  store.state.showFooter = true
  // body.classList.add('bg-gray-100')
})
// const value = ref('')
// const key = ref('center_name')
// const centerList = ref([])
// const getCenterList = async () => {
//   let result = await axios.get(`/api/centers?key=${key.value}&value=${value.value}`)
//   console.log(result)
//   centerList.value = result.data
// }

const clearInfo = () => {
  isLogIn.value.isLogIn = false
  isLogIn.value.info = { member_authority: '', member_name: '' }
}
const clickBtn = ()=>{
  router.push({name:'/'});
}
</script>
<template>
  <div class="fixed-top d-flex justify-content-end p-3">
    <div class="col-4"></div>
  </div>

  <main class="main-content mt-0">
    <div class="page-header min-vh-100 border-radius-lg d-flex align-items-center justify-content-center" 
         style="background-image: url('https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'); background-size: cover;">
      
      <span class="mask bg-gradient-light opacity-6"></span>

      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8 col-md-10 text-center position-relative z-index-1">
            
            <div class="mb-4">
              <img src="https://cdn-icons-png.flaticon.com/512/6329/6329090.png" 
                   alt="모래시계" 
                   style="width: 120px;">
            </div>

            <h2 class="text-black mb-3 fw-bolder">가입 승인 대기 중</h2>
            <p class="text-black lead mb-4 opacity-9">
              현재 회원님의 계정은 관리자에게 가입 승인 요청이 전달된 상태입니다.<br>
              승인까지는 일정 시간이 소요되오니 조금만 기다려 주시거나,<br>
              급한 용무는 <strong>담당 센터측으로 문의</strong> 부탁드립니다.
            </p>

            <div class="mt-5">
               <button class="btn btn-outline-white btn-lg px-5 border-radius-pill" @click="clickBtn()">돌아가기</button>
            </div>

          </div>
        </div>
      </div>
    </div>
  </main>
</template>
