<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div v-for="(item, index) in stats" :key="index" class="col-lg-3 col-md-6 col-12 mb-4">
        <mini-statistics-card
          :title="item.title"
          :value="item.value"
          :description="item.description"
          :icon="item.icon"
        />
      </div>
    </div>
  </div>
  <div class="card w-100" style="min-height: 60vh">
    <div class="tab">
      <RouterLink to="{ name: applicationWait}">지원신청서</RouterLink>
      <RouterLink to="{ name: #}">지원계획서</RouterLink>
      <RouterLink to="{ name: #}">지원결과서</RouterLink>
      <RouterLink to="{ name: #}">상담내역</RouterLink>
    </div>
    <div class="tabLow">
      <!-- 담당자로 접속시 -->
      <div v-if="memAuthority == 'a2' && dependantWait.manager_id == id">
        <div class="card-header"><h5>대기단계 승인요청</h5></div>
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
            <textarea v-model="dependantWait.status_reject"> dependantWait.status_reject </textarea>
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
        </div>
      </div>
      <!-- 관리자로 접속시 -->
      <div v-else-if="memAuthority == 'a3' && dependantWait.application_rejector == id">
        <div class="card-header"><h5>대기단계 승인요청</h5></div>
        <div class="card-body">
          <div
            v-if="
              dependantWait.resv_status == 'f3' &&
              dependantWait.status != 'e1' &&
              dependantWait.status != 'e2'
            "
          >
            <p>최강희님의 대기 단계를 설정해주세요.</p>
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
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useRoute, RouterLink } from 'vue-router'
import { ref, reactive, onBeforeMount } from 'vue'
import axios from 'axios'
import rejecterModalLayout from './layouts/rejecterModalLayout.vue'
import { useCounterStore } from '@/stores/member'

const counters = useCounterStore()
const route = useRoute()

// 접속자 권한 구분
let memAuthority = ref()
let id = counters.isLogIn.info.member_id
// 대기 단계 상태 파악
let dependantWait = ref([])

onBeforeMount(async () => {
  await axios //
    .get(`/api/application/${route.params.id}`)
    .then((res) => {
      console.log(res)
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
        console.log(memAuthority)

        if (memAuthority.value == 'a3') {
          if (dependantWait.value.status == 'e3') {
            result.status = '계획'
          } else if (dependantWait.value.status == 'e4') {
            dependantWait.value.status = '중점'
          } else {
            result.status = '긴급'
          }

          status.forEach((statu) => {
            if (statu.status == dependantWait.value.status) {
              statu.complete = true
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
            result.status = '계획'
          } else if (dependantWait.value.status == 'e4') {
            dependantWait.value.status = '중점'
          } else {
            result.status = '긴급'
          }

          status.forEach((statu) => {
            if (statu.status == dependantWait.value.status) {
              statu.complete = true
            }
          })
        }
      })
})

// 지원자 확인

// 대기단계 보낼 값
let result = reactive({ status: '' })
//let result = reactive({ status: '', rejecor: '' })

// 대기단계 선택 값 출력
let status = reactive([
  { status: '계획', complete: false },
  { status: '중점', complete: false },
  { status: '긴급', complete: false },
])

const showStatus = (req) => {
  status.forEach((statu) => {
    if (statu.status == req) {
      statu.complete = !statu.complete
      console.log(req)
    }
  })
  result.status = req
  console.log(result)
}

// 승인요청 버튼
let checked = ref(false)

const modalOpen = () => {
  if (rejectCheck.value == false)
    if (memAuthority.value == 'a3') {
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

// 반려-확인 버튼
let rejectReason = ref()

const rejectResult = () => {
  axios //
    .put('/api/rejectstatus/' + route.params.id, {
      status_reject: rejectReason.value,
      status_status: 'i3',
    })
    .then((req) => {
      console.log(req)
    })
}
</script>
<style scoped>
.tab {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  max-width: 50%;
}
.tabLow {
  display: flex;
}
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
.changed {
  background-color: green;
  color: #fff;
}
</style>
