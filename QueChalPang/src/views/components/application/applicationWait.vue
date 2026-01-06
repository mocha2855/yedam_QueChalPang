<template>
  <div class="d-flex justify-content-center align-items-center vh-100">
    <!-- 담당자로 접속시 -->
    <div v-if="memAuthority == 'a2' && application.dependantInfo.manager_id == id">
      <div
        v-if="
          application.dependantInfo.resv_status == 'f3' &&
          application.dependantInfo.status == 'e1' &&
          application.dependantInfo.status_status == ''
        "
      >
        <div v-if="!checked">
          <h5 class="mb-4" :value="props.dependantInfo.member_name" style="text-align: center">
            {{ props.dependantInfo.dependant_name }}님의<br />대기 단계를 설정해주세요.
          </h5>
          <div>
            <div
              class="circle mx-2"
              v-for="statu in status"
              v-bind:class="{ changed: statu.complete }"
              v-bind:key="statu"
              v-on:click="showStatus(statu.status)"
            >
              <span>{{ statu.status }}</span>
            </div>
          </div>
          <button class="btn-save my-4" type="button" v-on:click="modalOpen" style="float: right">
            승인요청
          </button>
        </div>

        <ApplicationModal v-if="checked">
          <template v-slot:header><h2></h2></template>
          <template v-slot:body
            ><h2 style="text-align: center">
              대기단계를
              <span :value="result.status" style="color: orange">{{ result.status }}</span
              >으로 <br />승인요청하시겠습니까?
            </h2></template
          >
          <template v-slot:footer>
            <button class="btn-save" v-on:click="realResult">승인요청</button>
            <button class="btn-cancel" v-on:click="notChecked">취소</button>
          </template>
        </ApplicationModal>
      </div>

      <div
        v-else-if="
          application.dependantInfo.resv_status != 'f3' && application.dependantInfo.status == 'e1'
        "
      >
        <h4>상담 전입니다.<br />상담을 먼저 진행해주세요.</h4>
      </div>

      <div
        v-else-if="
          application.dependantInfo.resv_status == 'f3' &&
          application.dependantInfo.status !== 'e1' &&
          application.dependantInfo.status_status == 'i1'
        "
      >
        <h4>대기 단계 선택을 완료했습니다.</h4>
      </div>
      <div
        v-else-if="
          application.dependantInfo.resv_status == 'f3' &&
          application.dependantInfo.status != 'e1' &&
          application.dependantInfo.status != 'e2' &&
          application.dependantInfo.status_status == 'i2'
        "
      >
        <h4>대기단계 승인이 완료됐습니다.<br />지원계획서를 작성해주세요.</h4>
      </div>
      <!-- 반려되었을 경우 -->

      <div
        v-else-if="
          application.dependantInfo.resv_status == 'f3' &&
          application.dependantInfo.status !== 'e1' &&
          application.dependantInfo.status_status == 'i3'
        "
      >
        <div v-if="!checked">
          <h4 :value="props.dependantInfo.member_name" style="text-align: center">
            반려되셨습니다.<br />
            {{ props.dependantInfo.member_name }}님의 대기 단계를 다시 설정해주세요.
          </h4>
          <div class="mb-4">
            <div
              class="circle mx-2"
              v-for="statu in status"
              v-bind:class="{ changed: statu.complete }"
              v-bind:key="statu"
              v-on:click="showStatus(statu.status)"
            >
              <span>{{ statu.status }}</span>
            </div>
          </div>
          <textarea class="reason-input" v-model="application.dependantInfo.status_reject" disabled>
 application.dependantInfo.status_reject </textarea
          >
          <button type="button" class="btn-save" v-on:click="modalOpen" style="float: right">
            승인요청
          </button>
        </div>
        <ApplicationModal v-if="checked">
          <template v-slot:header><h2></h2></template>
          <template v-slot:body
            ><h2 style="text-align: center">
              대기단계를
              <span :value="result.status" style="color: orange">{{ result.status }}</span
              >으로 <br />재승인요청하시겠습니까?
            </h2></template
          >
          <template v-slot:footer>
            <button class="btn-save" v-on:click="realResult">승인요청</button>
            <button class="btn-cancel" v-on:click="notChecked">취소</button>
          </template>
        </ApplicationModal>
      </div>
    </div>
    
    <!-- 관리자로 접속시 -->
    <div v-else-if="memAuthority == 'a3' && application.dependantInfo.application_rejector == id">
      <div
        v-if="
          application.dependantInfo.resv_status == 'f3' &&
          application.dependantInfo.status != 'e1' &&
          application.dependantInfo.status != 'e2' &&
          application.dependantInfo.status_status == 'i1' &&
          application.dependantInfo.status_reject == null
        "
      >
        <div v-if="!checked && !rejectCheck">
          <h5 class="mb-4" :value="props.dependantInfo.member_name" style="text-align: center">
            {{ props.dependantInfo.dependant_name }}님의<br />대기 단계를 승인해주세요.
          </h5>
          <div class="mb-4">
            <div
              class="circle mx-2"
              v-for="statu in status"
              v-bind:class="{ changed: statu.complete }"
              v-bind:key="statu"
            >
              <span>{{ statu.status }}</span>
            </div>
          </div>
          <div style="float: right">
            <button class="btn-save" v-on:click="modalOpen">승인</button>
            <button class="btn-cancel" v-on:click="modalReject">반려</button>
          </div>
        </div>
        <!-- 승인 버튼 누를 경우 -->

        <ApplicationModal v-if="checked">
          <template v-slot:header><h2></h2></template>
          <template v-slot:body
            ><h2 style="text-align: center">
              대기단계를
              <span :value="result.status" style="color: orange">{{ result.status }}</span
              >으로 <br />승인하시겠습니까?
            </h2></template
          >
          <template v-slot:footer>
            <button class="btn-save" v-on:click="sucessResult">승인요청</button>
            <button class="btn-cancel" v-on:click="notChecked">취소</button>
          </template>
        </ApplicationModal>

        <!-- 반려버튼 누를 경우 -->

        <ApplicationModal v-if="rejectCheck">
          <template v-slot:header><h2></h2></template>
          <template v-slot:footer>
            <button class="btn-save" v-on:click="rejectResult">반려</button>
            <button class="btn-cancel" v-on:click="notChecked">취소</button>
          </template>
        </ApplicationModal>
      </div>
      <div
        v-else-if="
          application.dependantInfo.resv_status == 'f3' &&
          application.dependantInfo.status != 'e1' &&
          application.dependantInfo.status != 'e2' &&
          application.dependantInfo.status_status == 'i2'
        "
      >
        <h4>승인완료 하셨습니다.</h4>
      </div>
      <div
        v-else-if="
          application.dependantInfo.resv_status == 'f3' &&
          application.dependantInfo.status != 'e1' &&
          application.dependantInfo.status != 'e2' &&
          application.dependantInfo.status_status == 'i3'
        "
      >
        <h4>반려 하셨습니다.</h4>
      </div>
      <!-- 반려 후 재승인요청 -->
      <div
        v-if="
          application.dependantInfo.resv_status == 'f3' &&
          application.dependantInfo.status != 'e1' &&
          application.dependantInfo.status != 'e2' &&
          application.dependantInfo.status_status == 'i1' &&
          application.dependantInfo.status_reject != null
        "
      >
        <div v-if="!checked && !rejectCheck">
          <h5 class="mb-4" :value="props.dependantInfo.member_name" style="text-align: center">
            {{ props.dependantInfo.dependant_name }}님의<br />대기 단계를 승인해주세요.
          </h5>
          <div class="mb-4">
            <div
              class="circle mx-2"
              v-for="statu in status"
              v-bind:class="{ changed: statu.complete }"
              v-bind:key="statu"
            >
              <span>{{ statu.status }}</span>
            </div>
          </div>

          <textarea class="reason-input" v-model="application.dependantInfo.status_reject" disabled>
 application.dependantInfo.status_reject </textarea
          >
          <div style="float: right">
            <button class="btn-save" v-on:click="modalOpen">승인</button>
            <button class="btn-cancel" v-on:click="modalReject">반려</button>
          </div>
        </div>
      </div>
      <!-- 승인 버튼 누를 경우 -->

      <ApplicationModal v-if="checked">
        <template v-slot:header><h2></h2></template>
        <template v-slot:body
          ><h2 style="text-align: center">
            대기단계를
            <span :value="result.status" style="color: orange">{{ result.status }}</span
            >으로 <br />승인하시겠습니까?
          </h2></template
        >
        <template v-slot:footer>
          <button class="btn-save" v-on:click="sucessResult">승인</button>
          <button class="btn-cancel" v-on:click="notChecked">취소</button>
        </template>
      </ApplicationModal>

      <!-- 반려버튼 누를 경우 -->

      <ApplicationModal v-if="rejectCheck">
        <template v-slot:header><h2></h2></template>
        <template v-slot:footer>
          <button class="btn-save" v-on:click="rejectResult">반려</button>
          <button class="btn-cancel" v-on:click="notChecked">취소</button>
        </template>
      </ApplicationModal>
    </div>
  </div>
</template>
<script setup>
import { useRoute } from 'vue-router'
import { ref, reactive, onBeforeMount, defineProps } from 'vue'
import axios from 'axios'
import { useCounterStore } from '@/stores/member'
import { useApplicationStore } from '@/stores/application'
import { useModalStore } from '@/stores/Modal'
import ApplicationModal from '../modal/ApplicationModal.vue'

const application = useApplicationStore()
const counters = useCounterStore()
const modal = useModalStore()
const route = useRoute()
const props = defineProps({ dependantInfo: Object })
console.log('props.dependantInfo: ', props.dependantInfo)
let result = reactive({ status: '' })

let status = reactive([
  { status: '계획', complete: false },
  { status: '중점', complete: false },
  { status: '긴급', complete: false },
])

// 접속자 권한 구분
let memAuthority = counters.isLogIn.info.member_authority
let id = counters.isLogIn.info.member_id

// 대기 단계 상태 파악

onBeforeMount(async () => {
  if (memAuthority == 'a3') {
    status.forEach((statu) => {
      console.log(statu.status)
      if (statu.status == application.dependantInfo.status) {
        console.log(statu.status == application.dependantInfo.status)
        statu.complete = true
        result.status = application.dependantInfo.status
        console.log(result.status)
      }
    })
  }
  if (
    memAuthority == 'a2' &&
    application.dependantInfo.resv_status == 'f3' &&
    application.dependantInfo.status !== 'e1' &&
    application.dependantInfo.status_status == 'i3'
  ) {
    status.forEach((statu) => {
      if (statu.status == application.dependantInfo.status) {
        statu.complete = true
        result.status = application.dependantInfo.status
        console.log(result.status)
      }
    })
  }
  await application.loadApplicationContext(route.params.id)
})

// 대기단계 선택 값 출력

const showStatus = (req) => {
  if (req == result.status || result.status == '') {
    status.forEach((statu) => {
      if (statu.status == req) {
        statu.complete = !statu.complete
        console.log(req)
        result.status = req
      }
    })
    console.log(result)
  } else if (req != result.status) {
    status.forEach((statu) => {
      statu.complete = false
      if (statu.status == req) {
        statu.complete = !statu.complete
        console.log(req)
        result.status = req
      }
    })
  }
}

// 승인요청 버튼
let checked = ref(false)

const modalOpen = () => {
  // 반려후 대기단계 변경 안할시(담당자)
  if (
    memAuthority == 'a2' &&
    application.dependantInfo.status_status == 'i3' &&
    application.dependantInfo.status == result.status
  ) {
    alert('대기단계를 변경해주세요.')
    return
  }

  if (memAuthority == 'a3') {
    console.log(application.dependantInfo.status)
    checked.value = !checked.value
    return
  } else if ((memAuthority == 'a2', result.status != '')) {
    checked.value = !checked.value
    return
  } else {
    alert('대기단계를 선택해주세요')
    return
  }
}

// 반려 버튼
let rejectCheck = ref(false)
const modalReject = () => {
  if (checked.value == false) {
    rejectCheck.value = !rejectCheck.value
  } else {
    checked.value = false
    rejectCheck.value = true
  }
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

// 승인요청 모달창
const realResult = async () => {
  if (result.status == '계획') {
    result.status = 'e3'
  } else if (result.status == '중점') {
    result.status = 'e4'
  } else {
    result.status = 'e5'
  }

  alert('승인요청 완료')

  await axios //
    .put('/api/compApplication/' + route.params.id, {
      status: result.status,
    })
    .then((req) => {
      console.log(req)
    })

  await application.loadApplicationContext(route.params.id)
}

// 취소버튼
const notChecked = () => {
  checked.value = false
  rejectCheck.value = false
  modal.rejectReason = null
}

// 승인 모달창, 재승인
const sucessResult = async () => {
  await axios //
    .put('/api/compSuccessApplication/' + route.params.id, {
      status_status: 'i2',
      status_reject: null,
    })
    .then((res) => {
      console.log(res)
      alert('승인완료')
      checked.value = false
    })
  await application.checkdependantInfo(route.params.id)
}

// 반려모달창 확인 버튼

const rejectResult = async () => {
  if (modal.rejectReason == undefined) {
    alert('반려 사유 입력!')
    return
  } else {
    await axios //
      .put('/api/rejectstatus/' + route.params.id, {
        status_reject: modal.rejectReason,
      })
      .then((req) => {
        alert('반려 완료')
        console.log(req)
        rejectCheck.value = false
      })
    await application.checkdependantInfo(route.params.id)
  }
}
</script>
<style scoped>
.circle {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: blanchedalmond;
  display: inline-block;
  text-align: center;
  line-height: 150px;
  font-weight: bold;
  font-size: large;
}

.changed {
  background-color: green;
  color: #fff;
}

.btn-save,
.btn-cancel {
  padding: 12px 40px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-save {
  background: #2196f3;
  color: white;
}

.btn-save:hover {
  background: #1976d2;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
}

.btn-cancel {
  background: #f44336;
  color: white;
}

.btn-cancel:hover {
  background: #d32f2f;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(244, 67, 54, 0.3);
}
.reason-input {
  width: 100%;
  min-height: 150px;
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 15px;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
</style>
