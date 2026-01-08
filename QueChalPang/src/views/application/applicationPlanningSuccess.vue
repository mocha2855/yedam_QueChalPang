<!-- application/applicationPlanningSuccess.vue -->

<template>
  <div>
    <div
      v-if="
        id == application.dependantInfo.manager_id ||
        id == application.dependantInfo.application_rejector
      "
    >
      <h5>지원계획서</h5>

      <div
        v-if="application.planningSuccess.length == 0 && application.planningRejected.length == 0"
        class="d-flex justify-content-center align-items-center h-100"
      >
        <h5>현재 지원계획서가<br />존재하지 않습니다.</h5>
      </div>
      
      <div class="card-body p-0" v-else>
        <div>
          <div v-if="application.planningRejected.length > 0">
            <div class="card mb-3" v-for="plan in application.planningRejected" :key="plan">
              <!-- 반려중 -->
              <div class="card-body">
                <div class="formTop">
                  <h5>
                    <span class="badge badge-sm bg-gradient-secondary">반려</span>지원계획{{
                      plan.ranking
                    }}
                  </h5>
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

                  <button
                    type="button"
                    v-if="memAuthority == 'a2'"
                    @click="changePlanningStatus(plan.planning_no)"
                    class="float-end btn btn-primary btn-sm"
                  >
                    수정
                  </button>
                </form>
              </div>
            </div>
          </div>

          <!-- 승인완료된 계획서 -->
          <div v-if="application.planningSuccess.length > 0">
            <div class="card mb-3" v-for="plan in application.planningSuccess" :key="plan">
              <div class="card-body">
                <h5>
                  <span class="badge badge-sm bg-gradient-success">승인</span>지원계획{{
                    plan.ranking
                  }}
                </h5>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useCounterStore } from '@/stores/member'
import { useApplicationStore } from '@/stores/application'
import { useRoute } from 'vue-router'
import axios from 'axios'
const counters = useCounterStore()
const application = useApplicationStore()
const route = useRoute()

// 권한 및 담당 지원자 일치 확인
let id = counters.isLogIn.info.member_id
let memAuthority = counters.isLogIn.info.member_authority // 권한

// 반려된 계획서 수정버튼
const changePlanningStatus = async (data) => {
  if (application.planningState == 1) {
    alert('작성하던 계획서를 마무리해주세요!')
    return
  }
  if (application.planningChanging.length != 0) {
    alert('수정하던 작업을 마무리해주세요.')
    return
  }
  console.log(data)
  await axios
    .put('/api/successPlanningInfo/' + data, {
      planning_status: 'i1',
    })
    .then((res) => {
      console.log(res)
      application.countRealReview(route.params.id)
      application.planningState = 2
    })
}
</script>
<style scoped></style>
