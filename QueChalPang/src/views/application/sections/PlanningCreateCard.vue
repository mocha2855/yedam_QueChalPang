<!-- a2가 왼쪽 지원 계획서 신규 입력섹션 -->
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
        <div :value="planNum">
          <div v-if="!checked">
            <div class="d-flex justify-content-between">
              <div>
                <h5>지원계획{{ planNum }} 입력</h5>
              </div>
              <div style="float: right">
                <button type="button" class="btn btn-primary btn-sm" @click="saveForm">
                  임시저장
                </button>
                <button type="button" @click="delForm" class="btn btn-danger btn-sm">삭제</button>
              </div>
            </div>

            <form name="planning">
              <div class="row g-3 mb-2 align-items-center">
                <div class="col-2">
                  <label class="col-form-label">지원기간</label>
                </div>
                <div class="col-3">
                  <input
                    v-if="writeSave == true && formData.planning_start != null"
                    type="date"
                    v-model="formData.planning_start"
                    class="form-control"
                  />
                  <input
                    type="date"
                    v-else
                    v-model="formData.planning_start"
                    class="form-control"
                  />
                </div>
                <div class="col-3">
                  <input
                    v-if="writeSave == true && formData.planning_end != null"
                    type="date"
                    v-model="formData.planning_end"
                    class="form-control"
                  />
                  <input v-else type="date" v-model="formData.planning_end" class="form-control" />
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
                  <input type="text" v-model="formData.planning_title" class="form-control" />
                </div>
              </div>

              <div class="row g-3 mb-2 align-items-center">
                <div class="col-2"><label class="col-form-label">내용</label></div>
                <div class="col-10">
                  <textarea v-model="formData.planning_content" class="form-control" rows="8" />
                </div>
              </div>

              <div class="row g-3 mb-2 align-items-center">
                <div class="col-2"><label class="col-form-label">첨부파일</label></div>
                <div v-if="application.planningFistSave == ''" class="col-10">
                  <input type="file" class="form-control" multiple @change="application.getFile" />
                </div>
                <div
                  v-else-if="
                    application.planningFistSave.length &&
                    application.planningFistSave[0].attachment_no > 0
                  "
                  class="col-10"
                >
                  <div
                    v-for="file in application.planningFistSave[0].fileList"
                    :key="file.attachment_no"
                    class="mb-1"
                  >
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
          <!--임시저장 0111   -->
          <ConfirmModal
            :show="saveChecked"
            message="작성하던 내용을<br/>정말 임시저장하시겠습니까?"
            @confirm="saveSubmit"
            @cancel="closeConfirm"
          />

          <ConfirmModal
            :show="callFirstSave"
            message="작성하던 내용을<br/>불러오시겠습니까?"
            @confirm="callSaveInfo"
            @cancel="closeCallSaveInfo"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ConfirmModal from '../modals/ConfirmModal.vue'
import { useApplicationStore } from '@/stores/application'
import Swal from 'sweetalert2'

const application = useApplicationStore()
const props = defineProps({
  memAuthority: { type: String, required: true },
  memName: { type: String, required: true },
  realCount: { type: Number, required: true },
  firstSave: { type: Array, required: true },

  addCount: { type: Number, required: true },
  plannedStatus: { type: String, default: '' },
  hasChangingWork: { type: Boolean, default: false },
  dependantInfo: { type: Array, required: true },
})

const emit = defineEmits(['update:addCount', 'requestAdd', 'submitted', 'deleted', 'saved'])

const formData = ref({})
const checked = ref(false)
const count = ref(0)

const callFirstSave = ref(false)
const planNum = ref(0)

const addPlanningForm = async () => {
  if (props.dependantInfo.status_status != 'i2') {
    await Swal.fire({
      icon: 'warning',
      text: '대기단계 선택을 먼저 완료해주세요',
      confirmButtonText: '확인',
    })
    return
  }
  planNum.value = props.realCount
  // 기존 로직 그대로 옮김
  if (props.addCount === 0) {
    if (props.hasChangingWork) {
      await Swal.fire({
        icon: 'warning',
        text: '수정하던 작업을 마무리해주세요.',
        confirmButtonText: '확인',
      })
      return
    }
    if (props.firstSave.length > 0) {
      callFirstSave.value = !callFirstSave.value
      planNum.value = props.realCount
      emit('update:addCount', 1)
      emit('requestAdd')
      return
    }
    emit('update:addCount', 1)
    emit('requestAdd')
    return
  }

  if (count.value !== 1) {
    await Swal.fire({
      icon: 'warning',
      text: '작성하던 내용을 완료해주세요.',
      confirmButtonText: '확인',
    })
    return
  }

  emit('requestAdd')
}

const delForm = () => {
  emit('update:addCount', 0)
  formData.value = {}

  emit('deleted')
}

const openConfirm = async () => {
  if (
    !formData.value.planning_start ||
    !formData.value.planning_end ||
    !formData.value.planning_title ||
    !formData.value.planning_content
  ) {
    await Swal.fire({
      icon: 'warning',
      text: '내용 입력을 완료해주세요.',
      confirmButtonText: '확인',
    })
    return
  }
  count.value++
  checked.value = true
}

const closeConfirm = () => {
  checked.value = false

  saveChecked.value = false
}

const confirmSubmit = () => {
  emit('submitted', { ...formData.value })
  formData.value = {}
  checked.value = false
}

// 임시저장 0111
let saveChecked = ref(false)
const saveForm = () => {
  saveChecked.value = true
}

const saveSubmit = () => {
  console.log({ ...formData.value })
  emit('saved', { ...formData.value })
  saveChecked.value = false
}

let writeSave = ref(false)

const callSaveInfo = () => {
  callFirstSave.value = false

  formData.value = props.firstSave[0]
  planNum.value = props.realCount
  writeSave.value = true
}

const closeCallSaveInfo = () => {
  callFirstSave.value = false
  planNum.value = props.realCount
  writeSave.value = false
  formData.value = []
  emit('update:addCount', 1)
  emit('requestAdd')
  emit('cancelSaved')
}
</script>
