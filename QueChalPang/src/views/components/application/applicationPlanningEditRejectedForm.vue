<!-- 반려된 계획서 수정 -->
<template>
  <div class="card mb-3" v-if="plan && plan.planning_approvedDate != ''">
    <div v-if="!changingChecked">
      <div class="card-body">
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
              <input type="text" v-model="localPlan.planning_start" class="form-control" />
            </div>
            <div class="col-3">
              <input type="text" v-model="localPlan.planning_end" class="form-control" />
            </div>
            <div class="col-2"><label class="col-form-label">작성자</label></div>
            <div class="col-2">
              <input type="text" value="최강희" class="form-control" readonly />
            </div>
          </div>

          <div class="row g-3 mb-2 align-items-center">
            <div class="col-2"><label class="col-form-label">제목</label></div>
            <div class="col-10">
              <input type="text" v-model="localPlan.planning_title" class="form-control" />
            </div>
          </div>

          <div class="row g-3 mb-2 align-items-center">
            <div class="col-2"><label class="col-form-label">내용</label></div>
            <div class="col-10">
              <input type="text" v-model="localPlan.planning_content" class="form-control" />
            </div>
          </div>

          <div class="row g-3 mb-2 align-items-center">
            <div class="col-2"><label class="col-form-label">첨부파일</label></div>
            <div class="col-10"><input type="file" class="form-control" /></div>
          </div>

          <div class="d-flex justify-content-between">
            <div class="row g-3 mb-2 align-items-center">
              <div class="col-6"><label class="col-form-label">결재자</label></div>
              <div class="col-5">
                <input type="text" :value="plan.planning_rejecter" class="form-control" readonly />
              </div>
            </div>
            <div class="row g-3 mb-2 align-items-center">
              <div class="col-5"><label class="col-form-label">반려일</label></div>
              <div class="col-7">
                <input
                  type="text"
                  :value="plan.planning_reject_date"
                  class="form-control"
                  readonly
                />
              </div>
            </div>
          </div>

          <div class="row g-3 mb-2 align-items-center">
            <div class="col-2"><label class="col-form-label">반려사유</label></div>
            <div class="col-10">
              <input type="text" :value="plan.planning_reject" class="form-control" readonly />
            </div>
          </div>
        </form>

        <div class="d-flex justify-content-end">
          <button
            type="button"
            class="btn btn-primary btn-sm"
            @click="$emit('openConfirm', plan.planning_no, { ...localPlan })"
          >
            승인요청
          </button>
          <button
            type="button"
            class="btn btn-danger btn-sm"
            @click="$emit('cancelEdit', plan.planning_no)"
          >
            취소
          </button>
        </div>
      </div>
    </div>

    <ApplicationModal v-if="changingChecked">
      <template #header><h2></h2></template>
      <template #body>
        <h4 style="text-align: center">지원계획서를<br />정말 승인요청하시겠습니까?</h4>
      </template>
      <template #footer>
        <button class="btn-save" @click="$emit('confirm', plan.planning_no, { ...localPlan })">
          확인
        </button>
        <button class="btn-cancel" @click="$emit('cancel', plan.planning_no)">취소</button>
      </template>
    </ApplicationModal>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import ApplicationModal from '../modal/ApplicationModal.vue'

const props = defineProps({
  plan: Object,
  changingChecked: Boolean,
})

defineEmits(['openConfirm', 'confirm', 'cancel', 'cancelEdit'])

const localPlan = reactive({
  planning_start: '',
  planning_end: '',
  planning_title: '',
  planning_content: '',
})

watch(
  () => props.plan,
  (p) => {
    localPlan.planning_start = p?.planning_start ?? ''
    localPlan.planning_end = p?.planning_end ?? ''
    localPlan.planning_title = p?.planning_title ?? ''
    localPlan.planning_content = p?.planning_content ?? ''
  },
  { immediate: true, deep: true },
)
</script>
