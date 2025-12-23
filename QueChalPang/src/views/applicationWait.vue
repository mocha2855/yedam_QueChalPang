<template>
  <!-- <div class="container"> -->
  <div class="container" v-if="dependantWait.resv_status == 'f3' && dependantWait.status == 'e1'">
    <p>최강희님의 대기 단계를 설정해주세요.</p>
    <div class="three" v-for="statu in status" v-bind:key="statu" v-on:click="showStatus(statu)">
      <p>{{ statu }}</p>
    </div>
    <button v-on:click="modalOpen">관리자 선택</button>

    <rejecterModalLayout class="modal-wrap" v-show="checked">
      <template v-slot:header>승인요청 받을 기관관리자를 선택해주세요.</template>
      <template v-slot:body>
        <select name="rejector" id="rejector" v-on:change="showValue()">
          <option value="">관리자 선택</option>
          <option v-for="reject in rejected" v-bind:key="reject" v-bind:value="reject">
            {{ reject }}
          </option>
        </select>
      </template>
      <template v-slot:footer>
        <button v-on:click="realResult">최종제출</button>
        <button v-on:click="notChecked">취소</button>
      </template>
    </rejecterModalLayout>
  </div>
  <div v-else-if="dependantWait.resv_status !== 'f3' && dependantWait.status == 'e1'">
    <p>상담 전입니다. 상담을 먼저 진행해주세요.</p>
  </div>
  <div v-else-if="dependantWait.resv_status == 'f3' && dependantWait.status == 'e2'">
    <p>대기 단계 선택을 완료했습니다.</p>
  </div>
</template>
<script setup>
import { useRoute } from 'vue-router'
import { ref, reactive } from 'vue'
import axios from 'axios'
import rejecterModalLayout from './layouts/rejecterModalLayout.vue'

const route = useRoute()

// 대기단계 보낼 값
let result = reactive({ status: '' })
//let result = reactive({ status: '', rejecor: '' })

// 대기 단계 상태 파악
let dependantWait = ref([])

axios //
  .get('/api/application/' + route.params.id)
  .then((res) => {
    console.log(res)
    let data = res.data
    console.log(data[0].application_no)
    dependantWait.value = data[0]
    result.dependant_id = data[0].application_no
  })
// 대기단계 선택 값 출력
let status = ref(['계획', '중점', '긴급'])

const showStatus = (req) => {
  console.log(req)
  result.status = req
  console.log(result)
}

// 관리자 선택 버튼
let checked = ref(false)

const modalOpen = () => {
  checked.value = true
}

// 결재자 정보
let rejected = ref([])
axios //
  .get('/api/rejectApplication/')
  .then((res) => {
    // console.log(res.data[0]['member_name'])
    let result = res.data
    for (let i = 0; i < result.length; i++) {
      rejected.value.push(result[i]['member_name'])
    }
    console.log(rejected.value)
  })

const showValue = () => {
  console.log(event.target.value)
  // result.rejector = event.target.value
  //console.log(result)
}

// 최종제출 버튼
const realResult = async () => {
  if (result.status == '계획') {
    result.status = 'e3'
  } else if (result.status == '중점') {
    result.status = 'e4'
  } else {
    result.status = 'e5'
  }

  await axios //
    .put('/api/compApplication/' + route.params.id, {
      status: result.status,
    })
    .then((res) => {
      console.log(res)
    })
}

// 취소버튼
const notChecked = () => {
  checked.value = false
}
</script>
<style scoped>
div {
  width: 400px;
}
.container p {
  text-align: center;
}
.three {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: blanchedalmond;
  display: inline-block;
  text-align: center;
}
.three p {
  text-align: center;
  line-height: 100px;
}
button {
  clear: both;
  display: block;
  margin: 0 auto;
}
</style>
