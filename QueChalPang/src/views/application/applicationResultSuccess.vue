<!-- 지원결과서 -->
<template>
  <div>
    <div
      v-if="
        id == application.dependantInfo.manager_id ||
        id == application.dependantInfo.application_rejector ||
        memAuthority == 'a1'
      "
    >
      <h5>지원결과서</h5>

      <div
        v-if="application.resultSuccess.length == 0 && application.resultRejected.length == 0"
        class="d-flex justify-content-center align-items-center h-100"
      >
        <h5>현재 지원결과서가<br />존재하지 않습니다.</h5>
      </div>
      <div class="card-body p-0" v-else>
        <div>
          <div v-if="application.resultRejected.length > 0">
            <div class="card mb-3" v-for="plan in application.resultRejected" :key="plan">
              <!-- 반려중 -->
              <div class="card-body">
                <div class="row row-cols-auto">
                  <div class="col">
                    <h5 class="badge badge-sm bg-gradient-secondary" style="height: 20px">반려</h5>
                  </div>
                  <div class="col px-0">
                    <h5 class="mb-0">지원결과{{ plan.ranking }}</h5>
                    <p>지원계획서{{ plan.ranking }}에 대한 지원결과서</p>
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
                        v-model="plan.manager_name"
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
                        v-model="plan.result_title"
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
                      <textarea
                        name="content"
                        id="content"
                        v-model="plan.result_content"
                        class="form-control"
                        rows="8"
                        readonly
                      />
                    </div>
                  </div>
                  <div class="row g-3 mb-2 align-items-center">
                    <div class="col-2">
                      <label for="attachmentFile" class="col-form-label">첨부파일</label>
                    </div>
                    <div class="col-10">
                      <div
                        v-if="plan.fileList && plan.fileList.length > 0"
                        class="card card-body p-2"
                      >
                        <div v-for="file in plan.fileList" :key="file.attachment_no" class="mb-1">
                          <a
                            href="#"
                            @click.prevent="application.downloadFile(file.attachment_no)"
                            class="text-decoration-none text-primary fw-bold"
                          >
                            💾 {{ file.attachment_orginal }}
                          </a>
                          <span class="text-muted ms-2" style="font-size: 0.8em">
                            ({{ (file.attachment_size / 1024).toFixed(1) }} KB)
                          </span>
                        </div>
                      </div>
                      <input
                        v-else
                        type="text"
                        class="form-control"
                        value="첨부파일 없음"
                        readonly
                      />
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
                          v-model="plan.result_reject_date"
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
                      <textarea
                        name="rejectReason"
                        id="rejectReason"
                        v-model="plan.result_reject"
                        class="form-control"
                        readonly
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    v-if="memAuthority == 'a2'"
                    @click="changeResultStatus(plan.result_no)"
                    class="float-end btn btn-primary btn-sm"
                  >
                    수정
                  </button>
                </form>
              </div>
            </div>
          </div>

          <!-- 승인완료된 계획서 -->
          <div v-if="application.resultSuccess.length > 0">
            <div class="card mb-3" v-for="plan in application.resultSuccess" :key="plan">
              <div class="card-body">
                <div class="row row-cols-auto">
                  <div class="col">
                    <h5 class="badge badge-sm bg-gradient-success" style="height: 20px">승인</h5>
                  </div>
                  <div class="col px-0">
                    <h5 class="mb-0">지원결과{{ plan.ranking }}</h5>
                    <p>지원계획서{{ plan.ranking }}에 대한 지원결과서</p>
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
                        v-model="plan.manager_name"
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
                        v-model="plan.result_title"
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
                      <textarea
                        name="content"
                        id="content"
                        v-model="plan.result_content"
                        class="form-control"
                        rows="8"
                        readonly
                      />
                    </div>
                  </div>
                  <div class="row g-3 mb-2 align-items-center">
                    <div class="col-2">
                      <label for="attachmentFile" class="col-form-label">첨부파일</label>
                    </div>
                    <div class="col-10">
                      <div
                        v-if="plan.fileList && plan.fileList.length > 0"
                        class="card card-body p-2"
                      >
                        <div v-for="file in plan.fileList" :key="file.attachment_no" class="mb-1">
                          <a
                            href="#"
                            @click.prevent="application.downloadFile(file.attachment_no)"
                            class="text-decoration-none text-primary fw-bold"
                          >
                            💾 {{ file.attachment_orginal }}
                          </a>
                          <span class="text-muted ms-2" style="font-size: 0.8em">
                            ({{ (file.attachment_size / 1024).toFixed(1) }} KB)
                          </span>
                        </div>
                      </div>
                      <input
                        v-else
                        type="text"
                        class="form-control"
                        value="첨부파일 없음"
                        readonly
                      />
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
import Swal from 'sweetalert2'

const counters = useCounterStore()
const application = useApplicationStore()
const route = useRoute()

// 권한 및 담당 지원자 일치 확인
let id = counters.isLogIn.info.member_id
let memAuthority = counters.isLogIn.info.member_authority // 권한

// 반려된 결과서 수정버튼
const changeResultStatus = async (data) => {
  if (application.planningState == 1) {
    await Swal.fire({
      icon: 'warning',
      text: '작성하던 계획서를 마무리해주세요!',
      confirmButtonText: '확인',
    })
    return
  }
  if (application.resultChanging.length != 0) {
    await Swal.fire({
      icon: 'warning',
      text: '수정하던 작업을 마무리해주세요.',
      confirmButtonText: '확인',
    })
    return
  }
  console.log(data)
  await axios
    .put('/api/successResultInfo/' + data, {
      result_status: 'i1',
    })
    .then((res) => {
      console.log(res)

      application.planningState = 2
    })
  await application.countRealResult(route.params.id)
  await application.fetchFilesForPlans(application.resultReview)
  await application.fetchFilesForPlans(application.resultfirstSave)
  await application.fetchFilesForPlans(application.resultSuccess)
  await application.fetchFilesForPlans(application.resultRejected)
  await application.fetchFilesForPlans(application.resultChanging)
  await application.fetchFilesForPlans(application.resultChangingReview)
}
</script>
<style scoped></style>
