<!--a3 관리자만 띄우는 화면용임 계획서 반려 검토중 리스트(관리자). 여기서 a1도 볼수 있게 -->
<!-- application/sections/PlanningRejectedReviewList.vue -->
<template>
  <div class="card mb-3" v-for="plan in plans" :key="plan.planning_no">
    <div class="card-body" v-if="plans.length > 0">
      <div v-if="!isApproveOpen(plan.planning_no) && !isRejectOpen(plan.planning_no)">
        <div class="d-flex justify-content-between">
          <div>
            <h5>
              <span class="badge badge-sm bg-gradient-secondary">반려</span>지원계획{{
                plan.ranking
              }}
            </h5>
          </div>
          <div>
            <p>작성일: {{ plan.planning_date }}</p>
          </div>
        </div>

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
              <input type="text" :value="writerName" class="form-control" readonly />
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
            <div class="col-10"><input type="text" class="form-control" readonly /></div>
          </div>

          <div class="d-flex justify-content-between">
            <div class="col-2"><label class="col-form-label">결재자</label></div>
            <div class="col-4">
              <input
                type="text"
                class="form-control"
                :value="plan.planning_rejecter_name ?? plan.planning_rejecter ?? '-'"
                readonly
              />
            </div>
            <div class="row g-3 mb-2 align-items-center">
              <div class="col-6"><label class="col-form-label">반려일</label></div>
              <div class="col-6">
                <input
                  type="text"
                  v-model="plan.planning_reject_date"
                  class="form-control"
                  readonly
                />
              </div>
            </div>
          </div>

          <div class="row g-3 mb-2 align-items-center">
            <div class="col-2"><label class="col-form-label">반려사유</label></div>
            <div class="col-10">
              <textarea v-model="plan.planning_reject" class="form-control" readonly />
            </div>
            <textarea
              v-model="plan.planning_reject"
              class="form-control"
              :readonly="isReadOnlyViewer"
              v-if="props.memAuthority == 'a1'"
              :class="{ 'readonly-input': isReadOnlyViewer }"
            />
          </div>
        </form>

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
            class="btn btn-primary btn-sm"
            @click="openReject(plan.planning_no)"
          >
            반려
          </button>
        </div>
      </div>

      <ConfirmModal
        v-if="memAuthority === 'a3'"
        :show="isApproveOpen(plan.planning_no)"
        :message="`지원계획서${plan.ranking}를<br/> 승인하시겠습니까?`"
        @confirm="emit('approve', plan.planning_no)"
        @cancel="closeAll(plan.planning_no)"
      />

      <RejectConfirmModal
        v-if="memAuthority === 'a3'"
        :show="isRejectOpen(plan.planning_no)"
        :message="`지원계획서${plan.ranking}를<br/> 반려하시겠습니까?`"
        @reject="emit('reject', plan.planning_no)"
        @cancel="closeAll(plan.planning_no)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import ConfirmModal from '../modals/ConfirmModal.vue'
import RejectConfirmModal from '../modals/RejectConfirmModal.vue'

const props = defineProps({
  memAuthority: { type: String, required: true },
  plans: { type: Array, default: () => [] },
})

const isReadOnlyViewer = computed(() => props.memAuthority === 'a1')

const emit = defineEmits(['approve', 'reject'])

const writerName = computed(() => '최강희')

// UI 상태는 서버데이터에 섞지 말고 Set으로 관리
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
}

const closeAll = (id) => {
  approveOpenSet.value.delete(id)
  rejectOpenSet.value.delete(id)
}
</script>
