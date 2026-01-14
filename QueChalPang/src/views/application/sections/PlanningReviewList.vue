<!-- 계획서 검토중 리스트 -->
<!-- application/sections/PlanningReviewList.vue -->
<template>
  <div v-if="show">
    <div class="card mb-3" v-for="plan in plans" :key="plan.planning_no">
      <div class="card-body">
        <div v-if="!isApproveOpen(plan.planning_no) && !isRejectOpen(plan.planning_no)">
          <div class="formTop">
            <!-- 담당자한테만 띄우기 -->
            <h5 v-if="memAuthority === 'a2'">
              <span class="badge badge-sm bg-gradient-secondary">검토중</span>지원계획{{
                plan.ranking
              }}
            </h5>
            <!-- 관리자한테만 띄우기 -->
            <p v-else-if="memAuthority === 'a3'">지원계획{{ plan.ranking }}</p>
            <p v-else-if="memAuthority === 'a1'">지원계획{{ plan.ranking }}</p>
          </div>

          <!-- 오른쪽에 나타나는 대기중인 지원계획 정보카드 -->
          <form name="planning">
            <div class="row g-3 mb-2 align-items-center">
              <div class="col-2"><label class="col-form-label">지원기간</label></div>
              <div class="col-3">
                <input type="text" v-model="plan.planning_start" class="form-control" readonly />
              </div>
              <div class="col-3">
                <input type="text" v-model="plan.planning_end" class="form-control" readonly />
              </div>
              <div class="col-2"><label class="col-form-label">작성자</label></div>
              <div class="col-2">
                <input type="text" v-model="plan.writer_name" class="form-control" readonly />
              </div>
            </div>

            <div class="row g-3 mb-2 align-items-center">
              <div class="col-2"><label class="col-form-label">제목</label></div>
              <div class="col-10">
                <input type="text" v-model="plan.planning_title" class="form-control" readonly />
              </div>
            </div>

            <div class="row g-3 mb-2 align-items-center">
              <div class="col-2"><label class="col-form-label">내용</label></div>
              <div class="col-10">
                <textarea v-model="plan.planning_content" class="form-control" rows="8" readonly />
              </div>
            </div>

            <div class="row g-3 mb-2 align-items-center">
              <div class="col-2"><label class="col-form-label">첨부파일</label></div>
              <div v-if="plan.attachment_no != null" class="col-10">
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

          <!-- 승인, 반려버튼은 관리자(a3)일때만 표시 -->
          <div class="d-flex justify-content-end" v-if="memAuthority === 'a3'">
            <button
              type="button"
              class="btn btn-primary btn-sm"
              @click="openApprove(plan.planning_no)"
            >
              승인
            </button>
            <button
              type="button"
              class="btn btn-danger btn-sm"
              @click="openReject(plan.planning_no)"
            >
              반려
            </button>
          </div>
        </div>

        <ConfirmModal
          :show="isApproveOpen(plan.planning_no)"
          :message="`지원계획서${plan.ranking}를<br/> 승인하시겠습니까?`"
          @confirm="emit('approve', plan.planning_no)"
          @cancel="closeAll(plan.planning_no)"
        />

        <RejectConfirmModal
          :show="isRejectOpen(plan.planning_no)"
          :message="`지원계획서${plan.ranking}를<br/> 반려 하시겠습니까?`"
          @reject="emit('reject', plan.planning_no)"
          @cancel="closeAll(plan.planning_no)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import ConfirmModal from '../modals/ConfirmModal.vue'
import RejectConfirmModal from '../modals/RejectConfirmModal.vue'
//import { useModalStore } from '@/stores/modal'
import { useApplicationStore } from '@/stores/application'
const application = useApplicationStore()

//const modal = useModalStore()

const props = defineProps({
  memAuthority: { type: String, required: true },
  plans: { type: Array, default: () => [] },
  show: { type: Boolean, default: true },
})

const emit = defineEmits(['approve', 'reject'])

const approveOpenSet = ref(new Set())
const rejectOpenSet = ref(new Set())

const isApproveOpen = (id) => approveOpenSet.value.has(id)
const isRejectOpen = (id) => rejectOpenSet.value.has(id)

const openApprove = (id) => {
  approveOpenSet.value.add(id)
  rejectOpenSet.value.delete(id)
}

const openReject = (id) => {
  rejectOpenSet.value.add(id)
  approveOpenSet.value.delete(id)
  //modal.rejectReason = ''
}

const closeAll = (id) => {
  approveOpenSet.value.delete(id)
  rejectOpenSet.value.delete(id)
  //modal.rejectReason = ''
}
const planGroupIds = computed(() => {
  return props.plans.map((p) => p.attachment_group)
})

watch(
  planGroupIds,
  async (newIds) => {
    // 데이터가 있고, ID가 하나라도 존재하면 실행
    if (newIds && newIds.length > 0) {
      // console.log('파일 목록 조회 시작 (그룹 ID 변경 감지)')
      await application.fetchFilesForPlans(props.plans)
    }
  },
  { immediate: true },
)
</script>
