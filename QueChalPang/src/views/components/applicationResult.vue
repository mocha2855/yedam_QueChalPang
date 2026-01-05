<template>
  <div>
    <div v-if="memAuthority == 'a2'">
      <div>
        <h5 style="float: left">지원결과 입력하기</h5>

        <button type="button" class="btn btn-primary btn-sm" @click="addResultForm">
          결과추가
        </button>
        <ApplicationModal v-if="selectPlan">
          <template v-slot:header><h2></h2></template>
          <template v-slot:body>
            <h4 style="text-align: center">결과서를 작성할<br />지원계획서를선택해주세요</h4>
            <div class="d-flex justify-content-center">
              <select
                class="btn btn-light"
                v-model="resultList"
                style="
                  text-align: center;
                  font-weight: bold;
                  font-size: large;
                  width: 200px;
                  height: 50px;
                "
              >
                <option
                  class="dropdown-item"
                  v-for="(plan, index) in application.planningSuccess"
                  :value="plan"
                  v-bind:key="index"
                >
                  지원계획서{{ plan.ranking }}
                </option>
              </select>
            </div>
          </template>
          <template v-slot:footer>
            <button class="btn-save" v-on:click="sucessResult">확인</button>
            <button class="btn-cancel" v-on:click="notChecked">취소</button>
          </template>
        </ApplicationModal>
      </div>

      <div class="card mb-3">
        <div class="card-body" v-if="memAuthority == 'a2' && addCount == 1">
          <div :value="realCount">
            <div v-if="!checked">
              <div class="d-flex justify-content-between">
                <div>
                  <h5>지원결과{{ realCount }} 입력</h5>
                </div>
                <div style="float: right">
                  <button type="button" class="btn btn-primary btn-sm">임시저장</button>
                  <button type="button" @click="delForm" class="btn btn-danger btn-sm">삭제</button>
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
                      v-model="memName"
                      class="form-control"
                      aria-describedby="passwordHelpInline"
                      readonly
                    />
                  </div>
                </div>

                <div class="row g-3 mb-2 align-items-center">
                  <div class="col-2">
                    <label for="title" class="col-form-label">결과</label>
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
            </div>
            <ApplicationModal v-if="checked">
              <template v-slot:header><h2></h2></template>
              <template v-slot:body
                ><h4 style="text-align: center">
                  지원결과서를<br />정말 승인요청하시겠습니까?
                </h4></template
              >
              <template v-slot:footer>
                <button class="btn-save" v-on:click="sucessResult">확인</button>
                <button class="btn-cancel" v-on:click="notChecked">취소</button>
              </template>
            </ApplicationModal>
          </div>
        </div>
      </div>

      <!-- 반려된 결과서 수정 -->
      <div
        class="card mb-3"
        v-if="
          memAuthority == 'a2' &&
          application.planningChanging.length > 0 &&
          application.planningChanging.planning_approvedDate != ''
        "
      >
        <div v-if="!changingChecked">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h5>
                  <span class="badge badge-sm bg-gradient-secondary">반려</span>지원결과{{
                    application.planningChanging[0].ranking
                  }}
                </h5>
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
                  <label for="title" class="col-form-label">결과</label>
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
              <div class="d-flex justify-content-between">
                <div class="row g-3 mb-2 align-items-center">
                  <div class="col-6">
                    <label for="planningtime" class="col-form-label">결재자</label>
                  </div>
                  <div class="col-5">
                    <input
                      type="text"
                      name="startDate"
                      id="startDate"
                      v-model="application.planningChanging[0].planning_rejecter"
                      class="form-control"
                      readonly
                    />
                  </div>
                </div>
                <div class="row g-3 mb-2 align-items-center">
                  <div class="col-5">
                    <label for="writer" class="col-form-label">반려일</label>
                  </div>
                  <div class="col-7">
                    <input
                      type="text"
                      name="writer"
                      id="writer"
                      class="form-control"
                      v-model="application.planningChanging[0].planning_reject_date"
                      readonly
                    />
                  </div>
                </div>
              </div>
              <div class="row g-3 mb-2 align-items-center">
                <div class="col-2">
                  <label for="rejectReason" class="col-form-label">반려사유</label>
                </div>
                <div class="col-10">
                  <input
                    type="text"
                    name="rejectReason"
                    id="rejectReason"
                    v-model="application.planningChanging[0].planning_reject"
                    class="form-control"
                    readonly
                  />
                </div>
              </div>
            </form>

            <div class="d-flex justify-content-end">
              <button type="button" class="btn btn-primary btn-sm" @click="modalOpen">
                승인요청
              </button>
              <button
                type="button"
                class="btn btn-danger btn-sm"
                @click="cancelPlanningInfo(application.planningChanging[0].planning_no)"
              >
                취소
              </button>
            </div>
          </div>
        </div>
        <ApplicationModal v-if="changingChecked">
          <template v-slot:header><h2></h2></template>
          <template v-slot:body
            ><h4 style="text-align: center">
              지원결과서를<br />정말 승인요청하시겠습니까?
            </h4></template
          >
          <template v-slot:footer>
            <button
              class="btn-save"
              v-on:click="submitChaingPlanningInfo(application.planningChanging[0].planning_no)"
            >
              확인
            </button>
            <button class="btn-cancel" v-on:click="notChecked">취소</button>
          </template>
        </ApplicationModal>
      </div>
    </div>

    <div style="height: 100%" v-else-if="memAuthority == 'a3'">
      <h5>지원결과 승인대기</h5>
    </div>

    <!-- 반려 검토중 -->
    <div
      class="card mb-3"
      v-for="plan in application.planningChangingReview"
      :key="plan.planning_no"
    >
      <div class="card-body" v-if="application.planningChangingReview.length > 0">
        <div v-if="!plan.checked && !plan.rejectChecked">
          <div class="d-flex justify-content-between">
            <div>
              <h5>
                <span class="badge badge-sm bg-gradient-secondary">반려</span>지원결과{{
                  plan.ranking
                }}
              </h5>
            </div>
            <div>
              <p>작성일: {{ plan.planning_date }}</p>
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
                  v-model="plan.planning_start"
                  class="form-control"
                />
              </div>
              <div class="col-3">
                <input
                  type="text"
                  name="endDate"
                  id="endDate"
                  v-model="plan.planning_end"
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
                <label for="title" class="col-form-label">결과</label>
              </div>
              <div class="col-10">
                <input
                  type="text"
                  name="title"
                  id="title"
                  v-model="plan.planning_title"
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
                  v-model="plan.planning_content"
                  class="form-control"
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
            <div class="d-flex justify-content-between">
              <div class="row g-3 mb-2 align-items-center">
                <div class="col-7">
                  <label for="planningtime" class="col-form-label">결재자</label>
                </div>
                <div class="col-5">
                  <input
                    type="text"
                    name="startDate"
                    id="startDate"
                    v-model="plan.planning_rejecter"
                    class="form-control"
                    readonly
                  />
                </div>
              </div>
              <div class="row g-3 mb-2 align-items-center">
                <div class="col-5">
                  <label for="writer" class="col-form-label">반려일</label>
                </div>
                <div class="col-7">
                  <input
                    type="text"
                    name="writer"
                    id="writer"
                    class="form-control"
                    v-model="plan.planning_reject_date"
                    readonly
                  />
                </div>
              </div>
            </div>
            <div class="row g-3 mb-2 align-items-center">
              <div class="col-2">
                <label for="rejectReason" class="col-form-label">반려사유</label>
              </div>
              <div class="col-10">
                <input
                  type="text"
                  name="rejectReason"
                  id="rejectReason"
                  v-model="plan.planning_reject"
                  class="form-control"
                  readonly
                />
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
        </div>

        <ApplicationModal v-if="plan.checked">
          <template v-slot:header><h2></h2></template>
          <template v-slot:body
            ><h4 style="text-align: center" :value="plan.ranking">
              지원결과서{{ plan.ranking }}를<br />정말 승인하시겠습니까?
            </h4></template
          >
          <template v-slot:footer>
            <button class="btn-save" v-on:click="sucessResult">확인</button>
            <button class="btn-cancel" v-on:click="notChecked(plan.planning_no)">취소</button>
          </template>
        </ApplicationModal>

        <ApplicationModal v-if="plan.rejectChecked">
          <template v-slot:header><h2></h2></template>
          <template v-slot:footer>
            <button class="btn-save" v-on:click="rejectResult">반려</button>
            <button class="btn-cancel" v-on:click="notChecked(plan.planning_no)">취소</button>
          </template>
        </ApplicationModal>
      </div>
    </div>

    <!--  검토중 결과서 -->
    <div
      v-if="
        application.planningReview.length > 0 && application.planningReview.planning_reject == null
      "
    >
      <div class="card mb-3" v-for="plan in application.planningReview" :key="plan">
        <div class="card-body" v-if="application.planningReview.length > 0">
          <div v-if="!plan.checked && !plan.rejectChecked">
            <div class="formTop">
              <h5 v-if="memAuthority == 'a2'">
                <span class="badge badge-sm bg-gradient-secondary">검토중</span>지원결과{{
                  plan.ranking
                }}
              </h5>
              <p v-if="memAuthority == 'a3'">지원결과{{ plan.ranking }}</p>
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
                  <label for="title" class="col-form-label">결과</label>
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
                class="btn btn-danger btn-sm"
                @click="modalClose(plan.planning_no)"
              >
                반려
              </button>
            </div>
          </div>
          <ApplicationModal v-if="plan.checked">
            <template v-slot:header><h2></h2></template>
            <template v-slot:body
              ><h4 style="text-align: center" :value="plan.ranking">
                지원결과서{{ plan.ranking }}를<br />정말 승인하시겠습니까?
              </h4></template
            >
            <template v-slot:footer>
              <button class="btn-save" v-on:click="sucessResult">확인</button>
              <button class="btn-cancel" v-on:click="notChecked(plan.planning_no)">취소</button>
            </template>
          </ApplicationModal>
          <ApplicationModal v-if="plan.rejectChecked">
            <template v-slot:header><h2></h2></template>
            <template v-slot:footer>
              <button class="btn-save" v-on:click="rejectResult">반려</button>
              <button class="btn-cancel" v-on:click="notChecked(plan.planning_no)">취소</button>
            </template>
          </ApplicationModal>
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
import { useModalStore } from '@/stores/Modal'
import ApplicationModal from './modal/ApplicationModal.vue'

const route = useRoute()
const modal = useModalStore()

const counters = useCounterStore()
const application = useApplicationStore()

// 권한 및 담당 지원자 일치 확인
let memAuthority = counters.isLogIn.info.member_authority // 권한
let memName = counters.isLogIn.info.member_name // 작성자
let realCount = ref(0) // 지원계획서 진짜 갯수

onBeforeMount(async () => {
  // 계획서 갯수 파악
  await application.countPlanning(route.params.id)
  addCount.value = application.planned.data[0].counts
  console.log('addCount: ', addCount.value)
  if (addCount.value != 0) {
    realCount.value = addCount.value + 1
    addCount.value = 0
  } else {
    realCount.value = 1
  }
  console.log(`realCount.value: ${realCount.value}`)
  console.log(`addCount.value: ${addCount.value}`)
})

// 계획 추가 버튼
let addCount = ref(0) // 계획추가 버튼용
let selectPlan = ref(false)

const addResultForm = () => {
  selectPlan.value = true
  if (addCount.value == 0) {
    if (application.planningChanging.length > 0) {
      alert('수정하던 작업을 마무리해주세요.')
      return
    }
    addCount.value = 1
    return
  }
  if (application.dependantInfo.status_status != 'i2') {
    alert('대기단계 선택을 먼저 완료해주세요')
    return
  }

  if (count.value != 1) {
    alert('작성하던 내용을 완료해주세요.')
  }

  application.planningState = 1
}

// 삭제 버튼
const delForm = () => {
  if (addCount.value == 1) {
    addCount.value = 0
    formData.value = {}
    application.planningState = 0
  }
}

// 승인요청 버튼(담당자)
let formData = ref({})
let count = ref(0) // 승인요청 횟수
let checked = ref(false)

const submitPlanningInfo = async () => {
  if (
    formData.value.startDate == undefined ||
    formData.value.endDate == undefined ||
    formData.value.title == undefined ||
    formData.value.content == undefined ||
    formData.value.startDate == '' ||
    formData.value.endDate == '' ||
    formData.value.title == '' ||
    formData.value.content == ''
  ) {
    alert('내용 입력을 완료해주세요')
    return
  }
  console.log('?: ', formData.value)
  count.value++
  checked.value = true
}

// 승인버튼
let planningNo = ref()
let changingChecked = ref(false)

const modalOpen = async (data) => {
  // 검토중
  if (memAuthority == 'a3') {
    application.planningReview.forEach((review) => {
      if (data == review.planning_no) {
        review.checked = !review.checked
        review.rejectChecked = false
      }
      planningNo.value = data
      console.log(planningNo.value)
      return
    })
    // 반려중
    application.planningChangingReview.forEach((review) => {
      if (data == review.planning_no) {
        review.checked = !review.checked
        review.rejectChecked = false
      }
      planningNo.value = data
      console.log(planningNo.value)
      return
    })
  }
  // 반려후 승인요청버튼(담당자)
  if (memAuthority == 'a2' && application.planningChanging != '') {
    console.log(
      'application.planningChanging.planning_start: ',
      application.planningChanging[0].planning_start,
    )
    if (
      application.planningChanging[0].planning_start == undefined ||
      application.planningChanging[0].planning_end == undefined ||
      application.planningChanging[0].planning_title == undefined ||
      application.planningChanging[0].planning_content == undefined ||
      application.planningChanging[0].planning_start == '' ||
      application.planningChanging[0].planning_end == '' ||
      application.planningChanging[0].planning_title == '' ||
      application.planningChanging[0].planning_content == ''
    ) {
      alert('내용 입력을 완료해주세요')
      return
    }
    changingChecked.value = true
    return
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
        application.countRealReview(route.params.id)
        realCount.value = application.planned.data[0].counts + 2
        console.log(realCount.value)
        checked.value = false
        addCount.value = 0
        formData.value = {}
        count.value = 1
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
        application.countRealReview(route.params.id)
      })
  }
}

// 승인모달창-취소버튼
const notChecked = (data) => {
  if (memAuthority == 'a2') {
    checked.value = false
    changingChecked.value = false
  }
  if (memAuthority == 'a3') {
    application.planningReview.forEach((review) => {
      if (data == review.planning_no) {
        review.checked = false
        review.rejectChecked = false
        modal.rejectReason = null
      }
    })
    application.planningChangingReview.forEach((review) => {
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
    application.planningChangingReview.forEach((review) => {
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
const rejectResult = async () => {
  if (modal.rejectReason == undefined) {
    alert('반려사유를 작성해주세요.')
    return
  }
  await axios //
    .put('/api/rejectPlanningInfo/' + planningNo.value, {
      planning_status: 'i3',
      planning_reject: modal.rejectReason,
    })
    .then((res) => {
      console.log(res)
      alert('반려했습니다.')
      modal.rejectReason = undefined
      application.countRealReview(route.params.id)
    })
}

// 반려 후 수정 중 취소 버튼(담당자)
const cancelPlanningInfo = async (data) => {
  console.log(data)
  await axios
    .put('/api/successPlanningInfo/' + data, {
      planning_status: 'i3',
    })
    .then(() => {
      application.planningChanging = []
      application.countRealReview(route.params.id)
    })
}

// 반려 후 승인요청 모달창 승인 버튼(담당자)
const submitChaingPlanningInfo = async (data) => {
  console.log(data)
  await axios //
    .put('/api/submitChangingPlanningInfo/' + data, {
      planning_id: application.dependantInfo.manager_id,
      planning_rejecter: application.dependantInfo.application_rejector,
      planning_start: application.planningChanging[0].planning_start,
      planning_end: application.planningChanging[0].planning_end,
      planning_title: application.planningChanging[0].planning_title,
      planning_content: application.planningChanging[0].planning_content,
      planning_approvedDate: null,
    })
    .then((res) => {
      console.log(res)
      application.planningChanging = []
      application.countRealReview(route.params.id)
      changingChecked.value = false
      alert('승인요청 완료')
    })
}
</script>
<style scoped>
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
