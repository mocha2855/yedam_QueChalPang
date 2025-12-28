<template>
  <div class="container" v-if="dependantInfo">
    <div
      class="card-header"
      v-if="
        memAuthority.member_authority == 'a2' &&
        dependantInfo.status_status == 'i2' &&
        dependantInfo.manager_id == id
      "
    >
      <h5>지원계획 입력하기</h5>
      <button type="button" @click="addPlanningForm">계획추가</button>
    </div>
    <div class="card-body" v-if="addCount[0] == 1">
      <div class="planningInfo" v-for="count in addCount" :key="count">
        <div class="formTop">
          <p>지원계획{{ count }} 입력</p>
          <button>임시저장</button>
          <button>삭제</button>
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
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { useCounterStore } from '@/stores/member'
import axios from 'axios'

const route = useRoute()

const counters = useCounterStore()

// 권한 및 담당 지원자 일치 확인
let id = counters.isLogIn.info.member_id
let memAuthority = ref() // 권한
let dependantInfo = ref() // 대기단계 승인확인

onBeforeMount(async () => {
  // 권한 확인
  await axios //
    .get(`/api/applicationAuthority/` + id)
    .then((res) => {
      memAuthority.value = res.data[0]
      console.log('memAuthority: ', memAuthority.value)
    })
  // 지원자 정보
  await axios //
    .get(`/api/application/` + route.params.id)
    .then((res) => {
      dependantInfo.value = res.data[0]
      console.log('dependantInfo: ', dependantInfo.value)
    })

  // 계획서 갯수 파악
  await axios //
    .get('/api/planning/' + route.params.id)
    .then((res) => {
      addCount.value[0] = res.data[0].counts
      console.log(addCount.value[0] === 0)
    })
})

// 계획 추가시 배열에 숫자 증가.
let addCount = ref([0])

const addPlanningForm = () => {
  if (addCount.value[0] == 0) {
    addCount.value[0] = 1
    return
  } else if (count != 1) {
    alert('작성하던 내용을 완료해주세요.')
  }
}

// form 태그 안 내용 보내기
let formData = ref({})
let count = 0 // 승인요청 횟수

const submitPlanningInfo = async () => {
  if (
    formData.value.startDate == null ||
    formData.value.endDate == null ||
    formData.value.title == null ||
    formData.value.content == null
  ) {
    alert('내용 입력을 완료해주세요')
    return
  }
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
    })
  count++
  console.log(count)
}
</script>
<style scoped>
.container {
  display: flex;
  padding: 0px;
  width: 100%;
  height: 448.5px;
  flex-direction: column;
  background-color: white;
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
