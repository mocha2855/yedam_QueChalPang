<!-- 검토, 반려검토중 카드 -->
<template>
  <!-- plan.checked / plan.rejectChecked 토글은 "부모에서" 처리되고,
       여기서는 UI와 emit만 담당 -->
  <div>
    <div v-if="!plan.checked && !plan.rejectChecked">
      <div class="d-flex justify-content-between">
        <div>
          <h5 v-if="plan.planning_reject">
            <span class="badge badge-sm bg-gradient-secondary">반려</span>지원계획{{ plan.ranking }}
          </h5>
          <div v-else class="formTop">
            <h5 v-if="memAuthority === 'a2'">
              <span class="badge badge-sm bg-gradient-secondary">검토중</span>지원계획{{
                plan.ranking
              }}
            </h5>
            <p v-else>지원계획{{ plan.ranking }}</p>
          </div>
        </div>
        <div v-if="plan.planning_date">
          <p>작성일: {{ plan.planning_date }}</p>
        </div>
      </div>

      <form name="planning">
        <div class="row g-3 mb-2 align-items-center">
          <div class="col-2">
            <label class="col-form-label">지원기간</label>
          </div>
          <div class="col-3">
            <input type="text" :value="plan.planning_start" class="form-control" readonly />
          </div>
          <div class="col-3">
            <input type="text" :value="plan.planning_end" class="form-control" readonly />
          </div>
          <div class="col-2">
            <label class="col-form-label">작성자</label>
          </div>
          <div class="col-2">
            <input type="text" value="최강희" class="form-control" readonly />
          </div>
        </div>

        <div class="row g-3 mb-2 align-items-center">
          <div class="col-2">
            <label class="col-form-label">제목</label>
          </div>
          <div class="col-10">
            <input type="text" :value="plan.planning_title" class="form-control" readonly />
          </div>
        </div>

        <div class="row g-3 mb-2 align-items-center">
          <div class="col-2">
            <label class="col-form-label">내용</label>
          </div>
          <div class="col-10">
            <input type="text" :value="plan.planning_content" class="form-control" readonly />
          </div>
        </div>

        <div class="row g-3 mb-2 align-items-center">
          <div class="col-2">
            <label class="col-form-label">첨부파일</label>
          </div>
          <div class="col-10">
            <input type="text" class="form-control" readonly />
          </div>
        </div>

        <!-- 반려건이면 아래 정보 표시 -->
        <div v-if="plan.planning_reject" class="d-flex justify-content-between">
          <div class="row g-3 mb-2 align-items-center">
            <div class="col-7">
              <label class="col-form-label">결재자</label>
            </div>
            <div class="col-5">
              <input type="text" :value="plan.planning_rejecter" class="form-control" readonly />
            </div>
          </div>
          <div class="row g-3 mb-2 align-items-center">
            <div class="col-5">
              <label class="col-form-label">반려일</label>
            </div>
            <div class="col-7">
              <input type="text" :value="plan.planning_reject_date" class="form-control" readonly />
            </div>
          </div>
        </div>

        <div v-if="plan.planning_reject" class="row g-3 mb-2 align-items-center">
          <div class="col-2">
            <label class="col-form-label">반려사유</label>
          </div>
          <div class="col-10">
            <input type="text" :value="plan.planning_reject" class="form-control" readonly />
          </div>
        </div>
      </form>

      <!-- 관리자만 승인/반려 버튼 -->
      <div class="d-flex justify-content-end" v-if="memAuthority === 'a3'">
        <button
          type="button"
          class="btn btn-primary btn-sm"
          @click="$emit('approve', plan.planning_no)"
        >
          승인
        </button>
        <button
          type="button"
          class="btn btn-danger btn-sm"
          @click="$emit('rejectOpen', plan.planning_no)"
        >
          반려
        </button>
      </div>
    </div>

    <!-- 승인 모달 -->
    <ApplicationModal v-if="plan.checked">
      <template #header><h2></h2></template>
      <template #body>
        <h4 style="text-align: center">
          지원계획서{{ plan.ranking }}를<br />정말 승인하시겠습니까?
        </h4>
      </template>
      <template #footer>
        <button class="btn-save" @click="$emit('confirmApprove')">확인</button>
        <button class="btn-cancel" @click="$emit('cancel', plan.planning_no)">취소</button>
      </template>
    </ApplicationModal>

    <!-- 반려 모달 -->
    <ApplicationModal v-if="plan.rejectChecked">
      <template #header><h2></h2></template>

      <template #body>
        <textarea
          class="reason-input"
          placeholder="반려사유를 입력하세요"
          :value="rejectReason"
          @input="$emit('update:rejectReason', $event.target.value)"
        />
      </template>

      <template #footer>
        <button class="btn-save" @click="$emit('confirmReject')">반려</button>
        <button class="btn-cancel" @click="$emit('cancel', plan.planning_no)">취소</button>
      </template>
    </ApplicationModal>
  </div>
</template>

<script setup>
import ApplicationModal from '../modal/ApplicationModal.vue'

defineProps({
  plan: Object,
  memAuthority: String,
  rejectReason: String,
})

defineEmits([
  'approve',
  'rejectOpen',
  'confirmApprove',
  'confirmReject',
  'cancel',
  'update:rejectReason',
])
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
.btn-cancel {
  background: #f44336;
  color: white;
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
  box-sizing: border-box;
}
</style>
