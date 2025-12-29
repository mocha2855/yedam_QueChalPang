<template>
  <div class="container" v-if="dependantInfo">
    <div
      class="card-header"
      v-if="
        memAuthority == 'a2' &&
        dependantInfo.status_status == 'i1' &&
        dependantInfo.manager_id == id
      "
    >
      <h5>지원계획 입력하기</h5>
      <button type="button" @click="addPlanningForm">계획추가</button>

      <div class="card-body" v-if="memAuthority == 'a2' && addCount == 1">
        <div class="planningInfo" :value="realCount">
          <div class="formTop">
            <p>지원계획{{ realCount }} 입력</p>
            <button type="button" @click="delForm">삭제</button>
            <button>임시저장</button>
          </div>
          <form action="#" name="planning">
            <label for="planningtime">지원기간</label>
            <input type="date" name="startDate" id="startDate" v-model="formData.startDate" />
            <span> ~ </span>
            <input type="date" name="endDate" id="endDate" v-model="formData.endDate" />

            <label class="writerRight"
              >작성자
              <input type="text" name="writer" id="writer" value="최강희" disabled />
            </label>
            <div class="titleInfo">
              <label for="title">제목</label>
              <input type="text" name="title" id="title" v-model="formData.title" />
            </div>
            <div class="contentInfo">
              <label for="content">내용</label>
              <input type="text" name="content" id="content" v-model="formData.content" />
            </div>
            <label for="attachmentFile">첨부파일</label>
            <button type="button">첨부파일</button>
            <input
              type="text"
              name="attachmentFile"
              id="attachmentFile"
              placeholder="다중 선택 가능합니다."
              disabled
            />
          </form>
          <div class="formBottom">
            <button type="button" @click="submitPlanningInfo">승인요청</button>
          </div>
          <rejecterModalLayout class="modal-wrap" v-if="checked">
            <template v-slot:body>정말 승인요청하시겠습니까?</template>
            <template v-slot:footer>
              <button v-on:click="notChecked">취소</button>
              <button v-on:click="sucessResult">확인</button>
            </template>
          </rejecterModalLayout>
        </div>
      </div>
    </div>
    <!-- 검토중인 계획서 -->
    <div
      class="card-header"
      v-else-if="
        memAuthority == 'a3' &&
        dependantInfo.status_status == 'i2' &&
        dependantInfo.application_rejector == id
      "
    >
      <h5>지원계획 승인대기</h5>
    </div>
    <div class="card-body" v-if="application.planningReview.length > 0" :style="reviewStyle">
      <div class="planningInfo" v-for="plan in application.planningReview" :key="plan">
        <div class="formTop">
          <p v-if="memAuthority == 'a2'"><span>검토중 </span>지원계획{{ plan.ranking }}</p>
          <p v-if="memAuthority == 'a3'">지원계획{{ plan.ranking }}</p>
        </div>
        <form action="#" name="planning">
          <label for="planningtime">지원기간</label>
          <input
            type="text"
            name="startDate"
            id="startDate"
            v-model="plan.planning_start"
            disabled
          />
          <span> ~ </span>
          <input type="text" name="endDate" id="endDate" v-model="plan.planning_end" disabled />

          <label class="writerRight"
            >작성자
            <input type="text" name="writer" id="writer" value="최강희" disabled />
          </label>
          <div class="titleInfo">
            <label for="title">제목</label>
            <input type="text" name="title" id="title" :value="plan.planning_title" disabled />
          </div>
          <div class="contentInfo">
            <label for="content">내용</label>
            <input
              type="text"
              name="content"
              id="content"
              :value="plan.planning_content"
              disabled
            />
          </div>
          <label for="attachmentFile">첨부파일</label>
          <input type="text" name="attachmentFile" id="attachmentFile" disabled />
        </form>
        <div class="formBottom" v-if="memAuthority == 'a3'">
          <button type="button" @click="modalClose(plan.planning_no)">반려</button>
          <button type="button" @click="modalOpen(plan.planning_no)">승인</button>
        </div>
        <rejecterModalLayout class="modal-wrap" v-if="plan.checked">
          <template v-slot:body>정말 승인하시겠습니까?</template>
          <template v-slot:footer>
            <button v-on:click="notChecked(plan.planning_no)">취소</button>
            <button v-on:click="sucessResult">확인</button>
          </template>
        </rejecterModalLayout>
        <rejecterModalLayout class="modal-wrap" v-if="plan.rejectChecked">
          <template v-slot:header>반려사유를 적어주세요.</template>
          <template v-slot:body>
            <textarea v-model="rejectReason"> rejectReason </textarea>
          </template>
          <template v-slot:footer>
            <button v-on:click="notChecked(plan.planning_no)">취소</button>
            <button v-on:click="rejectResult">확인</button>
          </template>
        </rejecterModalLayout>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onBeforeMount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCounterStore } from '@/stores/member'
import { useApplicationStore } from '@/stores/application'
import axios from 'axios'
import rejecterModalLayout from '../layouts/rejecterModalLayout.vue'

const route = useRoute()

const counters = useCounterStore()
const application = useApplicationStore()

// 권한 및 담당 지원자 일치 확인
let id = counters.isLogIn.info.member_id
let memAuthority = counters.isLogIn.info.member_authority // 권한
let dependantInfo = ref() // 대기단계 승인확인
let realCount = ref() // 지원계획서 진짜 갯수

onBeforeMount(async () => {
  // 지원자 정보
  await axios //
    .get(`/api/application/` + route.params.id)
    .then((res) => {
      dependantInfo.value = res.data[0]
      console.log('dependantInfo: ', dependantInfo.value)
    })

  // 계획서 갯수 파악
  const countplanned = await application.countPlanning(route.params.id)
  console.log(countplanned)
  addCount.value = countplanned.data[0].counts
  if (addCount.value != 0) {
    realCount.value = addCount.value + 1
    addCount.value = 0
  }
  console.log(`realCount.value: ${realCount.value}`)
  console.log(`addCount.value: ${addCount.value}`)

  // 검토중 계획서 불러오기.
  await application.countRealReview(route.params.id)
  for (let i = 0; i < application.planningReview.length; i++) {
    application.planningReview[i].planning_start = dateChange(
      application.planningReview[i].planning_start,
    )
    application.planningReview[i].planning_end = dateChange(
      application.planningReview[i].planning_end,
    )
    application.planningReview[i].checked = false
    application.planningReview[i].rejectChecked = false
  }
  console.log(application.planningReview)
})

// 검토중 계획서 날짜 형식 변경
const dateChange = (day) => {
  let date = new Date(day)
  let realDate = `${date.getFullYear(day)}.${date.getMonth(day) + 1}.${date.getDay(day)}`
  return realDate
}

// 검토중 계획서 스타일 적용
let reviewStyle = reactive({
  display: 'flex',
  'flex-direction': 'column',
  'margin-top': 'auto',
})

// 계획 추가시 배열에 숫자 증가.
let addCount = ref(0) // 계획추가 버튼용

const addPlanningForm = () => {
  if (addCount.value == 0) {
    addCount.value = 1
    return
  } else if (count != 1) {
    alert('작성하던 내용을 완료해주세요.')
  }
}

// 삭제 버튼
const delForm = () => {
  if (addCount.value == 1) {
    addCount.value = 0
    formData.value = {}
  }
}

// 승인요청 버튼(관리자)
let formData = ref({})
let count = 0 // 승인요청 횟수
let checked = ref(false)

const submitPlanningInfo = async () => {
  if (
    formData.value.startDate == undefined ||
    formData.value.endDate == undefined ||
    formData.value.title == undefined ||
    formData.value.content == undefined
  ) {
    alert('내용 입력을 완료해주세요')
    return
  }
  checked.value = true
}

// 승인버튼
let planningNo = ref()

const modalOpen = async (data) => {
  if (memAuthority == 'a3') {
    application.planningReview.forEach((review) => {
      if (data == review.planning_no) {
        review.checked = !review.checked
        review.rejectChecked = false
      }
      planningNo.value = data
      console.log(planningNo.value)
    })
  }
}

// 승인모달창-확인버튼
const sucessResult = async () => {
  console.log(memAuthority == 'a2')
  // 담당자
  if (memAuthority == 'a2') {
    await axios //
      .post('/api/submitPlanningInfo/' + route.params.id, {
        planning_id: dependantInfo.value.manager_id,
        planning_rejecter: dependantInfo.value.application_rejector,
        planning_start: formData.value.startDate,
        planning_end: formData.value.endDate,
        planning_title: formData.value.title,
        planning_content: formData.value.content,
      })
      .then((res) => {
        console.log(res)
        alert('승인요청 완료')
      })
    addCount.value = 0
    formData.value = {}
    count++
    application.planningState++
    return
  }
  // 관리자
  if (memAuthority == 'a3') {
    await axios //
      .put('/api/successPlanningInfo/' + planningNo.value, {
        planning_status: 'i2',
      })
      .then((res) => {
        console.log(res)
        alert('승인완료했습니다.')
      })
    await axios //
      .get('/api/planningReview/' + route.params.id)
      .then((res) => {
        res.data.forEach((data) => {
          data.planning_start = dateChange(data.planning_start)
          data.planning_end = dateChange(data.planning_end)
        })
      })
    application.planningState++
    return
  }
}

// 승인모달창-취소버튼
const notChecked = (data) => {
  if (memAuthority == 'a2') {
    checked.value = false
  }
  if (memAuthority == 'a3') {
    application.planningReview.forEach((review) => {
      if (data == review.planning_no) {
        review.checked = false
        review.rejectChecked = false
      }
    })
  }
}

// 반려버튼
const modalClose = (data) => {
  if (memAuthority == 'a3') {
    application.planningReview.forEach((review) => {
      if (data == review.planning_no) {
        review.checked = false
        review.rejectChecked = !review.rejectChecked
        console.log(review.planning_no, review.rejectChecked)
      }
      planningNo.value = data
    })
  }
}

// 반려모달창-확인버튼
let rejectReason = ref()
const rejectResult = async () => {
  if (rejectReason.value == undefined) {
    alert('반려사유를 작성해주세요.')
    return
  }
  await axios //
    .put('/api/rejectPlanningInfo/' + planningNo.value, {
      planning_status: 'i3',
      planning_reject: rejectReason.value,
    })
    .then((res) => {
      console.log(res)
      alert('반려했습니다.')
      rejectReason.value = undefined
      application.planningState++
    })
}

// 검토중 즉각으로 가져오기
watch(
  () => application.planningState,
  async () => {
    await application.countRealReview(route.params.id)
    console.log('관찰중')
  },
)
</script>
<style scoped>
.container {
  display: flex;
  padding: 0px;
  width: 100%;
  flex-direction: column;
  background-color: beige;
  overflow: hidden;
  height: 100%;
}
.card-header {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
}
h5 {
  margin: 0px;
}
p {
  margin: 0;
}
button {
  font-size: 10px;
  width: 40px;
  height: 20px;
  padding: 0px;
  border: 1px solid black;
  float: right;
}
label {
  display: inline-block;
}
.formTop {
  display: flex;
  flex-direction: row;
}
.formTop p {
  flex-grow: 15;
}
.formTop button {
  flex-grow: 1;
}
form {
  border: 1px solid #000;
}
input {
  border: 0px;
  font-size: 10px;
}
input[name='startDate'],
[name='endDate'] {
  width: 120px;
  font-size: 13px;
  text-align: center;
}
.writerRight {
  float: right;
}
input[name='writer'] {
  width: 60px;
}
.titleInfo {
  clear: both;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
}
.contentInfo {
  width: 100%;
  border-bottom: 1px solid #000;
}
.titleInfo label {
  width: 40px;
}
.contentInfo label {
  width: 40px;
}
</style>
