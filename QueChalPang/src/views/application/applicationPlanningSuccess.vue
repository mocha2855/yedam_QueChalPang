<!-- application/applicationPlanningSuccess.vue -->
<!-- 승인완료된 지원계획서와 반려된 지원계획서 나오는 왼쪽섹션 -->
<script setup>
import { useCounterStore } from '@/stores/member'
import { useApplicationStore } from '@/stores/application'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { watch, computed } from 'vue'
import Swal from 'sweetalert2'

const counters = useCounterStore()
const application = useApplicationStore()
const route = useRoute()

// 권한 및 담당 지원자 일치 확인
// let id = counters.isLogIn.info.member_id
let memAuthority = counters.isLogIn.info.member_authority // 권한
console.log(application.planningSuccess.length)
console.log(application.planningRejected.length)

// 반려된 계획서 수정버튼
const changePlanningStatus = async (data) => {
  if (application.planningState == 1) {
    await Swal.fire({
      icon: 'warning',
      text: '작성하던 계획서를 마무리해주세요!',
      confirmButtonText: '확인',
    })
    return
  }
  if (application.planningChanging.length != 0) {
    await Swal.fire({
      icon: 'warning',
      text: '수정하던 작업을 마무리해주세요.',
      confirmButtonText: '확인',
    })
    return
  }
  console.log(data)

  await axios
    .put('/api/successPlanningInfo/' + data, {
      planning_status: 'i1',
    })
    .then(async (res) => {
      console.log(res)
      await application.countRealReview(route.params.id)
      application.planningState = 2
      // application.countRealReview(route.params.id)
      //application.planningState = 2
      await application.fetchFilesForPlans(application.planningFistSave)
      await application.fetchFilesForPlans(application.planningSuccess)
      await application.fetchFilesForPlans(application.planningRejected)
      await application.fetchFilesForPlans(application.planningChanging)
      await application.fetchFilesForPlans(application.planningChangingReview)
      await application.fetchFilesForPlans(application.PlanningRejectedReviewList)
    })
}
// 1. 반려된 계획서(planningRejected)들의 파일 그룹 번호만 추출
const rejectedGroupIds = computed(() => {
  return application.planningRejected.map((p) => p.attachment_group)
})

// 2. 승인된 계획서(planningSuccess)들의 파일 그룹 번호만 추출
const successGroupIds = computed(() => {
  return application.planningSuccess.map((p) => p.attachment_group)
})

// 3. 반려 계획서 파일 조회 (그룹 ID 변경 감지)
watch(
  rejectedGroupIds,
  async (newIds) => {
    if (newIds && newIds.length > 0) {
      await application.fetchFilesForPlans(application.planningRejected)
    }
  },
  { immediate: true },
)

// 4. 승인 계획서 파일 조회 (그룹 ID 변경 감지)
watch(
  successGroupIds,
  async (newIds) => {
    if (newIds && newIds.length > 0) {
      await application.fetchFilesForPlans(application.planningSuccess)
    }
  },
  { immediate: true },
)
</script>
<template>
  <div>
    <div>
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
              <!-- 반려된 지원계획서 -->
              <div class="card-body">
                <div class="formTop">
                  <h5>
                    <span class="badge badge-sm bg-gradient-secondary">반려</span> 지원계획
                    {{ plan.ranking }}
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
                        v-model="plan.writer_name"
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
                      <textarea
                        name="content"
                        id="content"
                        v-model="plan.planning_content"
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
                    <div v-if="plan.fileList && plan.fileList.length > 0" class="col-10">
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
                    <div v-else class="col-10">
                      <input type="text" class="form-control" value="첨부파일 없음" readonly />
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

                  <!-- 반려계획서의 수정버튼은 담당자(a2)에만 보이게-->
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
                  <span class="badge badge-sm bg-gradient-success">승인</span> 지원계획
                  {{ plan.ranking }}
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
                        v-model="plan.writer_name"
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
                      <textarea
                        name="content"
                        id="content"
                        v-model="plan.planning_content"
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
                    <div v-if="plan.fileList && plan.fileList.length > 0" class="col-10">
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
                    <div v-else class="col-10">
                      <input type="text" class="form-control" value="첨부파일 없음" readonly />
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

<style scoped></style>
