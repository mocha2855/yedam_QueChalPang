<!-- 담당자가 하는 반려건에 대한 수정 -->
<!-- application/sections/PlanningRejectedEditCard.vue -->
<template>
  <div class="card mb-3" v-if="show">
    <div v-if="!changingChecked">
      <div class="card-body">
        <div class="d-flex justify-content-between">
          <div>
            <h5>
              <span class="badge badge-sm bg-gradient-secondary">반려</span>
              지원계획{{ localPlan.ranking }}
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
              <input type="date" v-model="localPlan.planning_start" class="form-control" />
            </div>
            <div class="col-3">
              <input type="date" v-model="localPlan.planning_end" class="form-control" />
            </div>
            <div class="col-2"><label class="col-form-label">작성자</label></div>
            <div class="col-2">
              <input type="text" :value="localPlan.member_name" class="form-control" readonly />
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
              <textarea v-model="localPlan.planning_content" class="form-control" rows="8" />
            </div>
          </div>

          <div class="row g-3 mb-2 align-items-center">
            <div class="col-2"><label class="col-form-label">첨부파일</label></div>
            <div v-if="localPlan.fileList && localPlan.fileList.length > 0" class="col-10">
              <div v-for="file in localPlan.fileList" :key="file.attachment_no" class="mb-1">
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
              <textarea
                v-model="localPlan.planning_reject"
                class="form-control"
                rows="3"
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

    <!-- <ConfirmModal
      :show="changingChecked"
      message="지원계획서를<br/>정말 승인요청하시겠습니까?"
      @confirm="emit('submitChanging', localPlan.planning_no)"
      @cancel="changingChecked = false"
    /> -->
    <ConfirmModal
      :show="changingChecked"
      message="지원계획서를<br/>정말 승인요청하시겠습니까?"
      @confirm="emit('submitChanging', { ...localPlan })"
      @cancel="changingChecked = false"
    />
  </div>
</template>

<script setup>
import { reactive, watch, ref } from 'vue'
import ConfirmModal from '../modals/ConfirmModal.vue'
import { useApplicationStore } from '@/stores/application'
const application = useApplicationStore()

const props = defineProps({
  plan: { type: Object, required: true },
  show: { type: Boolean, default: true },
})

const emit = defineEmits(['update:plan', 'submitChanging', 'cancel'])

const localPlan = reactive({})
const changingChecked = ref(false)

// props.plan 이 바뀔 때마다 localPlan으로 복사
watch(
  () => props.plan,
  (p) => {
    Object.assign(localPlan, p || {})
  },
  { immediate: true, deep: true },
)

const openConfirm = () => {
  // 유효성 체크 필요하면 여기서
  if (!localPlan.planning_title || !localPlan.planning_content) {
    alert('제목과 내용을 입력해주세요.')
    return
  }
  changingChecked.value = true
}
</script>
