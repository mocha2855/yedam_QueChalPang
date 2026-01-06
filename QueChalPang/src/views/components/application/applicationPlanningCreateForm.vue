<!-- 신규 계획 입력 폼 & 승인요청 모달 -->
<template>
  <div v-if="memAuthority === 'a2'">
    <div>
      <h5 style="float: left">지원계획 입력하기</h5>
      <button type="button" class="btn btn-primary btn-sm" @click="$emit('add')">계획추가</button>
    </div>

    <div class="card mb-3">
      <div class="card-body" v-if="addCount === 1">
        <div v-if="!checked">
          <div class="d-flex justify-content-between">
            <div>
              <h5>지원계획{{ realCount }} 입력</h5>
            </div>
            <div style="float: right">
              <button type="button" class="btn btn-primary btn-sm">임시저장</button>
              <button type="button" class="btn btn-danger btn-sm" @click="$emit('delete')">
                삭제
              </button>
            </div>
          </div>

          <form name="planning">
            <div class="row g-3 mb-2 align-items-center">
              <div class="col-2"><label class="col-form-label">지원기간</label></div>
              <div class="col-3">
                <input type="date" v-model="localForm.startDate" class="form-control" />
              </div>
              <div class="col-3">
                <input type="date" v-model="localForm.endDate" class="form-control" />
              </div>
              <div class="col-2"><label class="col-form-label">작성자</label></div>
              <div class="col-2">
                <input type="text" :value="memName" class="form-control" readonly />
              </div>
            </div>

            <div class="row g-3 mb-2 align-items-center">
              <div class="col-2"><label class="col-form-label">제목</label></div>
              <div class="col-10">
                <input type="text" v-model="localForm.title" class="form-control" />
              </div>
            </div>

            <div class="row g-3 mb-2 align-items-center">
              <div class="col-2"><label class="col-form-label">내용</label></div>
              <div class="col-10">
                <input type="text" v-model="localForm.content" class="form-control" />
              </div>
            </div>

            <div class="row g-3 mb-2 align-items-center">
              <div class="col-2"><label class="col-form-label">첨부파일</label></div>
              <div class="col-10"><input type="file" class="form-control" /></div>
            </div>
          </form>

          <div class="d-flex justify-content-end">
            <button
              type="button"
              class="btn btn-primary btn-sm"
              @click="$emit('request', { ...localForm })"
            >
              승인요청
            </button>
          </div>
        </div>

        <ApplicationModal v-if="checked">
          <template #header><h2></h2></template>
          <template #body>
            <h4 style="text-align: center">지원계획서를<br />정말 승인요청하시겠습니까?</h4>
          </template>
          <template #footer>
            <button class="btn-save" @click="$emit('confirm')">확인</button>
            <button class="btn-cancel" @click="$emit('cancel')">취소</button>
          </template>
        </ApplicationModal>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import ApplicationModal from '../modal/ApplicationModal.vue'

const props = defineProps({
  memAuthority: String,
  memName: String,
  realCount: Number,
  addCount: Number,
  checked: Boolean,
  formData: { type: Object, default: () => ({}) },
})

defineEmits(['add', 'delete', 'request', 'confirm', 'cancel'])

const localForm = reactive({
  startDate: '',
  endDate: '',
  title: '',
  content: '',
})

// 부모 formData가 바뀌면(삭제 등) 로컬도 동기화
watch(
  () => props.formData,
  (v) => {
    localForm.startDate = v?.startDate ?? ''
    localForm.endDate = v?.endDate ?? ''
    localForm.title = v?.title ?? ''
    localForm.content = v?.content ?? ''
  },
  { immediate: true, deep: true },
)
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
</style>
