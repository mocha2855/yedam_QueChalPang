<template>
  <div
    class="container"
    v-if="
      id == application.dependantInfo.manager_id ||
      id == application.dependantInfo.application_rejector
    "
  >
    <div class="card-header">
      <h6>지원계획서</h6>
    </div>

    <div class="none" v-if="application.planningSuccess.length == 0">
      <h5>현재 지원계획서가<br />존재하지 않습니다.</h5>
    </div>
    <div v-else>
      <!-- 반려중 -->
      <div v-if="application.planningRejected.length > 0">
        <div class="planningInfo" v-for="plan in application.planningRejected" :key="plan">
          <div class="formTop">
            <p><span>반려중 </span>지원계획{{ plan.ranking }}</p>
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
          <button
            type="button"
            v-if="memAuthority == 'a2'"
            @click="changePlanningStatus(plan.planning_no)"
          >
            수정
          </button>
        </div>
      </div>
      <!-- 승인완료된 계획서 -->
      <div v-if="application.planningSuccess.length > 0">
        <div class="planningInfo" v-for="plan in application.planningSuccess" :key="plan">
          <div class="formTop">
            <p><span>승인완료 </span>지원계획{{ plan.ranking }}</p>
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
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { useCounterStore } from '@/stores/member'
import { useApplicationStore } from '@/stores/application'
// import axios from 'axios'

const route = useRoute()

const counters = useCounterStore()
const application = useApplicationStore()

// 권한 및 담당 지원자 일치 확인
let id = counters.isLogIn.info.member_id
let memAuthority = counters.isLogIn.info.member_authority // 권한

onBeforeMount(async () => {
  // 지원자 정보
  await application.checkdependantInfo(route.params.id)
  console.log(application.dependantInfo)

  // 승인계획서 불러오기
  await application.countRealReview(route.params.id)
  for (let i = 0; i < application.planningSuccess.length; i++) {
    application.planningSuccess[i].planning_start = dateChange(
      application.planningSuccess[i].planning_start,
    )
    application.planningSuccess[i].planning_end = dateChange(
      application.planningSuccess[i].planning_end,
    )
    application.planningSuccess[i].checked = false
    application.planningSuccess[i].rejectChecked = false
  }
  console.log('승인완료', application.planningSuccess)

  // 승인계획서 불러오기
  for (let i = 0; i < application.planningRejected.length; i++) {
    application.planningRejected[i].planning_start = dateChange(
      application.planningRejected[i].planning_start,
    )
    application.planningRejected[i].planning_end = dateChange(
      application.planningRejected[i].planning_end,
    )
    application.planningRejected[i].checked = false
    application.planningRejected[i].rejectChecked = false
  }
  console.log('반려', application.planningRejected)
})

// 검토중 계획서 날짜 형식 변경
const dateChange = (day) => {
  let date = new Date(day)
  let realDate = `${date.getFullYear(day)}.${date.getMonth(day) + 1}.${date.getDay(day)}`
  return realDate
}

// 반려된 계획서 수정버튼
const changePlanningStatus = async (data) => {
  console.log(data)
}
</script>
<style scoped>
.container {
  display: flex;
  padding: 0px;
  width: 100%;
  height: 100%;
  flex-direction: column;
  background-color: beige;
  overflow: hidden;
  height: 100%;
}
h5 {
  display: flex;
}
.none {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.card-header {
  display: flex;
  flex-direction: row;
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
