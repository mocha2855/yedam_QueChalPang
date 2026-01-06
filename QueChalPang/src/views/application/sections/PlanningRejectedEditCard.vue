<!-- 반려 수정 -->
<template>
  <div class="card mb-3" v-if="show">
    <div v-if="!changingChecked">
      <div class="card-body">
        <div class="d-flex justify-content-between">
          <div>
            <h5>
              <span class="badge badge-sm bg-gradient-secondary">반려</span>지원계획{{
                localPlan.ranking
              }}
            </h5>
          </div>
          <div>
            <p>작성일: {{ localPlan.planning_date }}</p>
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
              <input type="text" :value="writerName" class="form-control" readonly />
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
                <input
                  type="text"
                  v-model="localPlan.planning_rejecter"
                  class="form-control"
                  readonly
                />
              </div>
            </div>

            <div class="row g-3 mb-2 align-items-center">
              <div class="col-5"><label class="col-form-label">반려일</label></div>
              <div class="col-7">
                <input
                  type="text"
                  class="form-control"
                  v-model="localPlan.planning_reject_date"
                  readonly
                />
              </div>
            </div>
          </div>

          <div class="row g-3 mb-2 align-items-center">
            <div class="col-2"><label class="col-form-label">반려사유</label></div>
            <div class="col-10">
              <input
                type="text"
                v-model="localPlan.planning_reject"
                class="form-control"
                readonly
              />
            </div>
          </div>
        </form>

        <div class="d-flex justify-content-end">
          <button type="button" class="btn btn-primary btn-sm" @click="openConfirm">
            승인요청
          </button>
          <button
            type="button"
            class="btn btn-danger btn-sm"
            @click="emit('cancel', localPlan.planning_no)"
          >
            취소
          </button>
        </div>
      </div>
    </div>

    <ConfirmModal
      :show="changingChecked"
      message="지원계획서를<br/>정말 승인요청하시겠습니까?"
      @confirm="emit('submitChanging', localPlan.planning_no)"
      @cancel="changingChecked = false"
    />
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  plan: { type: Object, required: true },
})

const emit = defineEmits(['update:plan', 'submit', 'cancel'])

const localPlan = reactive({})

// props 변경 시 로컬로 복사
watch(
  () => props.plan,
  (p) => {
    Object.assign(localPlan, p || {})
  },
  { immediate: true, deep: true },
)

// 필요하면 "임시저장/승인요청" 같은 버튼에서 부모로 올림
// const syncToParent = () => {
//   emit('update:plan', { ...localPlan })
// }
</script>
