<template>
  <div class="container">
    <div class="card mb-2" v-if="memAuthority == 'a2'">
      <div class="card-body">
        <div class="row row-cols-auto">
          <div class="col">
            <h5>지원계획 입력하기</h5>
          </div>
          <div class="col">
            <button type="button" class="btn btn-primary btn-sm" @click="addPlanningForm">
              계획추가
            </button>
          </div>
        </div>
      </div>

      <div class="card mb-3">
        <div class="card-body" v-if="memAuthority == 'a2' && addCount == 1">
          <div class="planningInfo" :value="realCount">
            <div class="d-flex justify-content-between">
              <div>
                <p>지원계획{{ realCount }} 입력</p>
              </div>
              <div class="btn-group-sm" role="group">
                <button type="button" @click="delForm" class="btn btn-light">삭제</button>
                <button type="button" class="btn btn-light">임시저장</button>
              </div>
            </div>

            <form name="planning">
              <div class="row g-3 mb-2 align-items-center">
                <div class="col-2">
                  <label for="planningtime" class="col-form-label">지원기간</label>
                </div>
                <div class="col-3">
                  <input
                    type="date"
                    name="startDate"
                    id="startDate"
                    v-model="formData.startDate"
                    class="form-control"
                    aria-describedby="passwordHelpInline"
                  />
                </div>
                <div class="col-3">
                  <input
                    type="date"
                    name="endDate"
                    id="endDate"
                    v-model="formData.endDate"
                    class="form-control"
                    aria-describedby="passwordHelpInline"
                  />
                </div>
                <div class="col-2">
                  <label for="writer" class="col-form-label">작성자</label>
                </div>
                <div class="col-2">
                  <input
                    type="text"
                    name="writer"
                    id="writer"
                    value="최강희"
                    class="form-control"
                    aria-describedby="passwordHelpInline"
                  />
                </div>
              </div>

              <div class="row g-3 mb-2 align-items-center">
                <div class="col-2">
                  <label for="title" class="col-form-label">제목</label>
                </div>
                <div class="col-10">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    v-model="formData.title"
                    class="form-control"
                    aria-describedby="passwordHelpInline"
                  />
                </div>
              </div>
              <div class="row g-3 mb-2 align-items-center">
                <div class="col-2">
                  <label for="content" class="col-form-label">내용</label>
                </div>
                <div class="col-10">
                  <input
                    type="text"
                    name="content"
                    id="content"
                    v-model="formData.content"
                    class="form-control"
                  />
                </div>
              </div>
              <div class="row g-3 mb-2 align-items-center">
                <div class="col-2">
                  <label for="attachmentFile" class="col-form-label">첨부파일</label>
                </div>
                <div class="col-10">
                  <input type="file" class="form-control" />
                </div>
              </div>
            </form>
            <div class="d-flex justify-content-end">
              <button type="button" class="btn btn-primary btn-sm" @click="submitPlanningInfo">
                승인요청
              </button>
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

      <!-- 반려된 계획서 수정 -->
      <div class="card mb-3">
        <div
          class="card-body"
          v-if="memAuthority == 'a2' && application.planningChanging.length > 0"
        >
          <div class="card">
            <div class="d-flex justify-content-between">
              <div>
                <p>
                  <span class="badge badge-sm bg-gradient-secondary">반려</span>지원계획{{
                    application.planningChanging[0].ranking
                  }}
                </p>
              </div>
              <div>
                <p>작성일: {{ application.planningChanging[0].planning_date }}</p>
              </div>
            </div>

            <form action="#" name="planning">
              <div class="row g-3 mb-2 align-items-center">
                <div class="col-2">
                  <label for="planningtime" class="col-form-label">지원기간</label>
                </div>
                <div class="col-3">
                  <input
                    type="text"
                    name="startDate"
                    id="startDate"
                    v-model="application.planningChanging[0].planning_start"
                    class="form-control"
                  />
                </div>
                <div class="col-3">
                  <input
                    type="text"
                    name="endDate"
                    id="endDate"
                    v-model="application.planningChanging[0].planning_end"
                    class="form-control"
                  />
                </div>
                <div class="col-2">
                  <label for="writer" class="col-form-label">작성자</label>
                </div>
                <div class="col-2">
                  <input
                    type="text"
                    name="writer"
                    id="writer"
                    value="최강희"
                    class="form-control"
                    readonly
                  />
                </div>
              </div>
              <div class="row g-3 mb-2 align-items-center">
                <div class="col-2">
                  <label for="title" class="col-form-label">제목</label>
                </div>
                <div class="col-10">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    v-model="application.planningChanging[0].planning_title"
                    class="form-control"
                  />
                </div>
              </div>
              <div class="row g-3 mb-2 align-items-center">
                <div class="col-2">
                  <label for="content" class="col-form-label">내용</label>
                </div>
                <div class="col-10">
                  <input
                    type="text"
                    name="content"
                    id="content"
                    v-model="application.planningChanging[0].planning_content"
                    class="form-control"
                  />
                </div>
              </div>
              <div class="row g-3 mb-2 align-items-center">
                <div class="col-2">
                  <label for="attachmentFile" class="col-form-label">첨부파일</label>
                </div>
                <div class="col-10">
                  <input type="file" class="form-control" />
                </div>
              </div>
            </form>

            <div class="d-flex justify-content-end">
              <button type="button" class="btn btn-primary btn-sm" @click="submitPlanningInfo">
                승인요청
              </button>
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
    </div>

    <!-- 검토중인 계획서 -->

    <div class="card mb-2" v-else-if="memAuthority == 'a3'">
      <div class="card-body">
        <div class="row row-cols-auto">
          <div class="col">
            <h5>지원계획 승인대기</h5>
          </div>
        </div>
      </div>
    </div>

    <div v-if="application.planningReview.length > 0 && application.planning_reject == ''">
      <div class="card mb-3" v-for="plan in application.planningReview" :key="plan">
        <div class="card-body" v-if="application.planningReview.length > 0">
          <div class="formTop">
            <p v-if="memAuthority == 'a2'">
              <span class="badge badge-sm bg-gradient-secondary">검토중</span>지원계획{{
                plan.ranking
              }}
            </p>
            <p v-if="memAuthority == 'a3'">지원계획{{ plan.ranking }}</p>
          </div>
          <form action="#" name="planning">
            <div class="row g-3 mb-2 align-items-center">
              <div class="col-2">
                <label for="planningtime" class="col-form-label">지원기간</label>
              </div>
              <div class="col-3">
                <input
                  type="text"
                  name="startDate"
                  id="startDate"
                  v-model="plan.planning_start"
                  class="form-control"
                  readonly
                />
              </div>
              <div class="col-3">
                <input
                  type="text"
                  name="endDate"
                  id="endDate"
                  v-model="plan.planning_end"
                  class="form-control"
                  readonly
                />
              </div>
              <div class="col-2">
                <label for="writer" class="col-form-label">작성자</label>
              </div>
              <div class="col-2">
                <input
                  type="text"
                  name="writer"
                  id="writer"
                  value="최강희"
                  class="form-control"
                  readonly
                />
              </div>
            </div>
            <div class="row g-3 mb-2 align-items-center">
              <div class="col-2">
                <label for="title" class="col-form-label">제목</label>
              </div>
              <div class="col-10">
                <input
                  type="text"
                  name="title"
                  id="title"
                  v-model="plan.planning_title"
                  class="form-control"
                  readonly
                />
              </div>
            </div>
            <div class="row g-3 mb-2 align-items-center">
              <div class="col-2">
                <label for="content" class="col-form-label">내용</label>
              </div>
              <div class="col-10">
                <input
                  type="text"
                  name="content"
                  id="content"
                  v-model="plan.planning_content"
                  class="form-control"
                  readonly
                />
              </div>
            </div>
            <div class="row g-3 mb-2 align-items-center">
              <div class="col-2">
                <label for="attachmentFile" class="col-form-label">첨부파일</label>
              </div>
              <div class="col-10">
                <input type="text" class="form-control" readonly />
              </div>
            </div>
          </form>

          <div class="d-flex justify-content-end" v-if="memAuthority == 'a3'">
            <button
              type="button"
              class="btn btn-primary btn-sm"
              @click="modalOpen(plan.planning_no)"
            >
              승인
            </button>
            <button
              type="button"
              class="btn btn-primary btn-sm"
              @click="modalClose(plan.planning_no)"
            >
              반려
            </button>
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
  </div>
</template>
<script setup>
import { ref, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { useCounterStore } from '@/stores/member'
import { useApplicationStore } from '@/stores/application'
import axios from 'axios'
import rejecterModalLayout from '../layouts/rejecterModalLayout.vue'

const route = useRoute()

const counters = useCounterStore()
const application = useApplicationStore()

console.log(application.planningReview.planning_reject)
// 권한 및 담당 지원자 일치 확인
// let id = counters.isLogIn.info.member_id
let memAuthority = counters.isLogIn.info.member_authority // 권한
let realCount = ref() // 지원계획서 진짜 갯수

onBeforeMount(async () => {
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

// 승인요청 버튼(담당자)
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
        planning_id: application.dependantInfo.manager_id,
        planning_rejecter: application.dependantInfo.application_rejector,
        planning_start: formData.value.startDate,
        planning_end: formData.value.endDate,
        planning_title: formData.value.title,
        planning_content: formData.value.content,
      })
      .then((res) => {
        console.log(res)
        alert('승인요청 완료')
        application.planningState++
        addCount.value = 0
        formData.value = {}
        count++
      })
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
</script>
<style scoped></style>
