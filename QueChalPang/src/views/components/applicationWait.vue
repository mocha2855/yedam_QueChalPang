<template>
  <div>
    <!-- 담당자로 접속시 -->
    <div v-if="memAuthority == 'a2' && dependantWait.manager_id == id">
      <div class="card-header">
        <h5>대기단계 승인요청</h5>
        <div class="card-body">
          <div
            v-if="
              dependantWait.resv_status == 'f3' &&
              dependantWait.status == 'e1' &&
              dependantWait.status_status == null
            "
          >
            <p>최강희님의 대기 단계를 설정해주세요.</p>
            <div
              class="three"
              v-for="statu in status"
              v-bind:class="{ changed: statu.complete }"
              v-bind:key="statu"
              v-on:click="showStatus(statu.status)"
            >
              <span>{{ statu.status }}</span>
            </div>
            <button v-on:click="modalOpen">승인요청</button>

            <rejecterModalLayout class="modal-wrap" v-show="checked">
              <!-- <template v-slot:header>승인요청 받을 기관관리자를 선택해주세요.</template>
        <template v-slot:body>
          <select name="rejector" id="rejector" v-on:change="showValue()">
            <option value="">관리자 선택</option>
            <option v-for="reject in rejected" v-bind:key="reject" v-bind:value="reject">
              {{ reject }}
            </option>
          </select>
        </template> -->
              <template v-slot:body>승인요청하시겠습니까?</template>
              <template v-slot:footer>
                <button v-on:click="realResult">승인요청</button>
                <button v-on:click="notChecked">취소</button>
              </template>
            </rejecterModalLayout>
          </div>
          <div v-else-if="dependantWait.resv_status !== 'f3' && dependantWait.status == 'e1'">
            <p>상담 전입니다. 상담을 먼저 진행해주세요.</p>
          </div>
          <div
            v-else-if="
              dependantWait.resv_status == 'f3' &&
              dependantWait.status !== 'e1' &&
              dependantWait.status_status == 'i1'
            "
          >
            <p>대기 단계 선택을 완료했습니다.</p>
          </div>
          <div
            v-else-if="
              dependantWait.resv_status == 'f3' &&
              dependantWait.status != 'e1' &&
              dependantWait.status != 'e2' &&
              dependantWait.status_status == 'i2'
            "
          >
            <p>대기단계 승인이 완료됐습니다. 지원계획서를 작성해주세요.</p>
          </div>
          <!-- 반려되었을 경우 -->
          <div
            v-else-if="
              dependantWait.resv_status == 'f3' &&
              dependantWait.status !== 'e1' &&
              dependantWait.status_status == 'i3'
            "
          >
            <p>반려되셨습니다.</p>
            <p>최강희님의 대기 단계를 다시 설정해주세요.</p>
            <div
              class="three"
              v-for="statu in status"
              v-bind:class="{ changed: statu.complete }"
              v-bind:key="statu"
              v-on:click="showStatus(statu.status)"
            >
              <span>{{ statu.status }}</span>
            </div>
            <textarea v-model="dependantWait.status_reject" readonly>
 dependantWait.status_reject </textarea
            >
            <button v-on:click="modalOpen">승인요청</button>

            <rejecterModalLayout class="modal-wrap" v-show="checked">
              <template v-slot:body>승인요청하시겠습니까?</template>
              <template v-slot:footer>
                <button v-on:click="realResult">승인요청</button>
                <button v-on:click="notChecked">취소</button>
              </template>
            </rejecterModalLayout>
          </div>
        </div>
      </div>
    </div>
    <!-- 관리자로 접속시 -->
    <div v-else-if="memAuthority == 'a3' && dependantWait.application_rejector == id">
      <div class="card-header">
        <h5>대기단계 승인요청</h5>
        <div class="card-body">
          <div
            v-if="
              dependantWait.resv_status == 'f3' &&
              dependantWait.status != 'e1' &&
              dependantWait.status != 'e2' &&
              dependantWait.status_status == 'i1' &&
              dependantWait.status_reject == null
            "
          >
            <p>최강희님의 대기 단계를 승인해주세요.</p>
            <div
              class="three"
              v-for="statu in status"
              v-bind:class="{ changed: statu.complete }"
              v-bind:key="statu"
            >
              <span>{{ statu.status }}</span>
            </div>
            <button v-on:click="modalOpen">승인</button>
            <button v-on:click="modalReject">반려</button>
            <!-- 승인 버튼 누를 경우 -->
            <rejecterModalLayout class="modal-wrap" v-show="checked">
              <template v-slot:body>정말 승인하시겠습니까?</template>
              <template v-slot:footer>
                <button v-on:click="sucessResult">확인</button>
                <button v-on:click="notChecked">취소</button>
              </template>
            </rejecterModalLayout>
            <!-- 반려버튼 누를 경우 -->

            <rejecterModalLayout class="modal-wrap" v-show="rejectCheck">
              <template v-slot:header>반려사유를 적어주세요.</template>
              <template v-slot:body>
                <textarea v-model="rejectReason"> rejectReason </textarea>
              </template>
              <template v-slot:footer>
                <button v-on:click="rejectResult">확인</button>
                <button v-on:click="notChecked">취소</button>
              </template>
            </rejecterModalLayout>
          </div>
          <div
            v-else-if="
              dependantWait.resv_status == 'f3' &&
              dependantWait.status != 'e1' &&
              dependantWait.status != 'e2' &&
              dependantWait.status_status == 'i2'
            "
          >
            <p>승인완료 하셨습니다.</p>
          </div>
          <div
            v-else-if="
              dependantWait.resv_status == 'f3' &&
              dependantWait.status != 'e1' &&
              dependantWait.status != 'e2' &&
              dependantWait.status_status == 'i3'
            "
          >
            <p>반려 하셨습니다.</p>
          </div>
          <!-- 반려 후 재승인요청 -->
          <div
            v-if="
              dependantWait.resv_status == 'f3' &&
              dependantWait.status != 'e1' &&
              dependantWait.status != 'e2' &&
              dependantWait.status_status == 'i1' &&
              dependantWait.status_reject != null
            "
          >
            <p>최강희님의 대기 단계를 재승인해주세요.</p>
            <div
              class="three"
              v-for="statu in status"
              v-bind:class="{ changed: statu.complete }"
              v-bind:key="statu"
            >
              <span>{{ statu.status }}</span>
            </div>
            <textarea v-model="dependantWait.status_reject" readonly>
dependantWait.status_reject </textarea
            >
            <button v-on:click="modalOpen">승인</button>
            <button v-on:click="modalReject">반려</button>
            <!-- 승인 버튼 누를 경우 -->
            <rejecterModalLayout class="modal-wrap" v-show="checked">
              <template v-slot:body>정말 승인하시겠습니까?</template>
              <template v-slot:footer>
                <button v-on:click="sucessResult">확인</button>
                <button v-on:click="notChecked">취소</button>
              </template>
            </rejecterModalLayout>
            <!-- 반려버튼 누를 경우 -->

            <rejecterModalLayout class="modal-wrap" v-show="rejectCheck">
              <template v-slot:header>반려사유를 적어주세요.</template>
              <template v-slot:body>
                <textarea v-model="rejectReason"> rejectReason </textarea>
              </template>
              <template v-slot:footer>
                <button v-on:click="rejectResult">확인</button>
                <button v-on:click="notChecked">취소</button>
              </template>
            </rejecterModalLayout>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useRoute } from 'vue-router'
import { ref, reactive, onBeforeMount } from 'vue'
import axios from 'axios'
import rejecterModalLayout from '../layouts/rejecterModalLayout.vue'
import { useCounterStore } from '@/stores/member'

const counters = useCounterStore()
const route = useRoute()
let result = reactive({ status: '' })

let status = reactive([
  { status: '계획', complete: false },
  { status: '중점', complete: false },
  { status: '긴급', complete: false },
])

// 접속자 권한 구분
let memAuthority = ref()
let id = counters.isLogIn.info.member_id
// 대기 단계 상태 파악
let dependantWait = ref([])

onBeforeMount(async () => {
  await axios //
    .get(`/api/application/${route.params.id}`)
    .then((res) => {
      console.log(res.data[0])
      let data = res.data
      console.log(data[0].application_no)
      dependantWait.value = data[0]
      console.log(dependantWait.value.manager_id == id)
    }),
    await axios //
      .get(`/api/applicationAuthority/` + id)
      .then((req) => {
        console.log(req.data[0])
        memAuthority.value = req.data[0].member_authority
        console.log(memAuthority.value)

        if (memAuthority.value == 'a3') {
          console.log(memAuthority.value == 'a3')
          if (dependantWait.value.status == 'e3') {
            dependantWait.value.status = '계획'
          } else if (dependantWait.value.status == 'e4') {
            dependantWait.value.status = '중점'
          } else {
            dependantWait.value.status = '긴급'
          }
          console.log(result.status)
          console.log('ㅁ', dependantWait.value.status)

          status.forEach((statu) => {
            console.log(statu.status)
            if (statu.status == dependantWait.value.status) {
              console.log(statu.status == dependantWait.value.status)
              statu.complete = true
              result.status = dependantWait.value.status
              console.log(result.status)
            }
          })
        }
        if (
          memAuthority.value == 'a2' &&
          dependantWait.value.resv_status == 'f3' &&
          dependantWait.value.status !== 'e1' &&
          dependantWait.value.status_status == 'i3'
        ) {
          if (dependantWait.value.status == 'e3') {
            dependantWait.value.status = '계획'
          } else if (dependantWait.value.status == 'e4') {
            dependantWait.value.status = '중점'
          } else {
            dependantWait.value.status = '긴급'
          }

          status.forEach((statu) => {
            if (statu.status == dependantWait.value.status) {
              statu.complete = true
              result.status = dependantWait.value.status
              console.log(result.status)
            }
          })
        }
      })
})

// 지원자 확인

// 대기단계 보낼 값
//let result = reactive({ status: '', rejecor: '' })

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
  if (rejectCheck.value == false)
    if (memAuthority.value == 'a3') {
      console.log(dependantWait.value.status)
      checked.value = !checked.value
    } else if ((memAuthority.value == 'a2', result.status != '')) {
      checked.value = !checked.value
    } else alert('대기단계를 선택해주세요')
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

// const showValue = () => {
//   console.log(event.target.value)
//   // result.rejector = event.target.value
//   //console.log(result)
// }

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
  await axios //
    .get('/api/application/' + route.params.id)
    .then((res) => {
      console.log(res)
      let data = res.data
      console.log(data[0].application_no)
      dependantWait.value = data[0]
    })
}

// 취소버튼
const notChecked = () => {
  checked.value = false
  rejectCheck.value = false
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
    })
  alert('승인완료')
  await axios //
    .get('/api/application/' + route.params.id)
    .then((res) => {
      console.log(res)
      let data = res.data
      console.log(data[0].application_no)
      dependantWait.value = data[0]
    })
}

// 반려모달창 확인 버튼
let rejectReason = ref()

const rejectResult = async () => {
  if (rejectReason.value == undefined) {
    alert('반려 사유 입력!')
    return
  } else {
    await axios //
      .put('/api/rejectstatus/' + route.params.id, {
        status_reject: rejectReason.value,
      })
      .then((req) => {
        console.log(req)
      })
    alert('반려 완료')
    await axios //
      .get('/api/application/' + route.params.id)
      .then((res) => {
        console.log(res)
        let data = res.data
        console.log(data[0].application_no)
        dependantWait.value = data[0]
      })
  }
}
</script>
<style scoped>
.card-header {
  display: flex;
  width: 100%;
  height: 448.5px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.card-body {
  display: flex;
  justify-content: center;
  align-items: center;
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
.changed {
  background-color: green;
  color: #fff;
}
</style>
