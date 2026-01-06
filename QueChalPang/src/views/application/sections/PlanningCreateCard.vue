<!-- 지원 계획서 신규 입력 -->
<template>
  <div>
    <div>
      <h5 style="float: left">지원계획 입력하기</h5>
      <button type="button" class="btn btn-primary btn-sm" @click="addPlanningForm">
        계획추가
      </button>
    </div>

    <div class="card mb-3">
      <div class="card-body" v-if="memAuthority === 'a2' && addCount === 1">
        <div :value="realCount">
          <div v-if="!checked">
            <div class="d-flex justify-content-between">
              <div>
                <h5>지원계획{{ realCount }} 입력</h5>
              </div>
              <div style="float: right">
                <button type="button" class="btn btn-primary btn-sm">임시저장</button>
                <button type="button" @click="delForm" class="btn btn-danger btn-sm">삭제</button>
              </div>
            </div>

            <form name="planning">
              <div class="row g-3 mb-2 align-items-center">
                <div class="col-2">
                  <label class="col-form-label">지원기간</label>
                </div>
                <div class="col-3">
                  <input type="date" v-model="formData.startDate" class="form-control" />
                </div>
                <div class="col-3">
                  <input type="date" v-model="formData.endDate" class="form-control" />
                </div>
                <div class="col-2">
                  <label class="col-form-label">작성자</label>
                </div>
                <div class="col-2">
                  <input type="text" :value="memName" class="form-control" readonly />
                </div>
              </div>

              <div class="row g-3 mb-2 align-items-center">
                <div class="col-2"><label class="col-form-label">제목</label></div>
                <div class="col-10">
                  <input type="text" v-model="formData.title" class="form-control" />
                </div>
              </div>

              <div class="row g-3 mb-2 align-items-center">
                <div class="col-2"><label class="col-form-label">내용</label></div>
                <div class="col-10">
                  <input type="text" v-model="formData.content" class="form-control" />
                </div>
              </div>

              <div class="row g-3 mb-2 align-items-center">
                <div class="col-2"><label class="col-form-label">첨부파일</label></div>
                <div class="col-10"><input type="file" class="form-control" /></div>
              </div>
            </form>

            <div class="d-flex justify-content-end">
              <button type="button" class="btn btn-primary btn-sm" @click="openConfirm">
                승인요청
              </button>
            </div>
          </div>

          <ConfirmModal
            :show="checked"
            message="지원계획서를<br/>정말 승인요청하시겠습니까?"
            @confirm="confirmSubmit"
            @cancel="closeConfirm"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ConfirmModal from '../modals/ConfirmModal.vue'

const props = defineProps({
  memAuthority: { type: String, required: true }, // 'a2'
  memName: { type: String, required: true },
  realCount: { type: Number, required: true },

  addCount: { type: Number, required: true }, // 부모에서 관리
  plannedStatus: { type: String, default: '' }, // application.dependantInfo.status_status
  hasChangingWork: { type: Boolean, default: false }, // application.planningChanging.length > 0
})

const emit = defineEmits([
  'update:addCount', // addCount를 부모에서 바꾸게
  'requestAdd', // 계획추가 눌렀을 때 상위에서 planningState 바꾸거나 체크
  'submitted', // 승인요청 최종 confirm 이후 부모가 axios 처리
  'deleted', // 삭제 처리
])

const formData = ref({})
const checked = ref(false)
const count = ref(0)

const addPlanningForm = () => {
  // 기존 로직 그대로 옮김
  if (props.addCount === 0) {
    if (props.hasChangingWork) {
      alert('수정하던 작업을 마무리해주세요.')
      return
    }
    emit('update:addCount', 1)
    emit('requestAdd')
    return
  }

  if (props.plannedStatus !== 'i2') {
    alert('대기단계 선택을 먼저 완료해주세요')
    return
  }

  if (count.value !== 1) {
    alert('작성하던 내용을 완료해주세요.')
  }

  emit('requestAdd')
}

const delForm = () => {
  emit('update:addCount', 0)
  formData.value = {}
  emit('deleted')
}

const openConfirm = () => {
  if (
    !formData.value.startDate ||
    !formData.value.endDate ||
    !formData.value.title ||
    !formData.value.content
  ) {
    alert('내용 입력을 완료해주세요')
    return
  }
  count.value++
  checked.value = true
}

const closeConfirm = () => {
  checked.value = false
}

const confirmSubmit = () => {
  // 실제 axios는 부모가 하게 emit으로 올림
  emit('submitted', { ...formData.value })
  checked.value = false
  // 폼 초기화는 “성공 후” 부모에서 내려주는 게 정석이지만,
  // 지금은 기존 동작 맞추려고 여기서도 초기화 가능.
}
</script>
