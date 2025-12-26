<script setup>
import { onBeforeUnmount, onBeforeMount, ref } from 'vue'
import { useStore } from 'vuex'
import ArgonInput from '@/components/ArgonInput.vue'
import ArgonButton from '@/components/ArgonButton.vue'
import CenterTable from './components/CenterTable.vue'
import axios from 'axios'
const body = document.getElementsByTagName('body')[0]

const store = useStore()
onBeforeMount(() => {
  store.state.hideConfigButton = false
  store.state.showNavbar = false
  store.state.showSidenav = false
  store.state.showFooter = false
  body.classList.remove('bg-gray-100')
})
onBeforeUnmount(() => {
  store.state.hideConfigButton = false
  store.state.showNavbar = false
  store.state.showSidenav = false
  store.state.showFooter = false
  // body.classList.add('bg-gray-100')
})
const value = ref('')
const key = ref('center_name')
const centerList = ref([])
const getCenterList = async () => {
  let result = await axios.get(`/api/centers?key=${key.value}&value=${value.value}`)
  console.log(result)
  centerList.value = result.data
}
</script>
<template>
  <div class="fixed-top d-flex justify-content-end p-3">
    <div class="col-4"></div>
  </div>
  <main class="main-content mt-0">
    <div
      class="page-header align-items-start min-vh-50 pt-5 pb-5 m-3 border-radius-lg"
      style="
        background-image: url('https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signup-cover.jpg');
        background-position: top;
      "
    >
      <span class="mask bg-gradient-dark opacity-6"></span>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-5 text-center mx-auto">
            <div class="row">
              <div class="col-4">
                <select class="form-select" name="key" id="key" v-model="key">
                  <option value="center_name" selected="true">센터명</option>
                  <option value="center_address">주소</option>
                  <option value="center_tel">연락처</option>
                </select>
              </div>
              <div class="col-6">
                <argon-input id="value" v-model="value" placeholder="검색" />
              </div>
              <div class="col-2">
                <argon-button
                  type="button"
                  class="p-2 btn btn-primary w-100"
                  @click="getCenterList"
                >
                  찾기
                </argon-button>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <center-table :list="centerList" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
