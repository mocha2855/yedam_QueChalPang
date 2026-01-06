<!-- views/components/meetingLog/MeetingLogWrite.vue -->
<script setup>
import { storeToRefs } from 'pinia'
import { useMeetingLogStore } from '@/stores/meetingLog'

const store = useMeetingLogStore()
const { writeForm } = storeToRefs(store)

const submit = () => store.submitWriteForm()
const cancel = () => store.cancelWriteForm()
</script>

<template>
  <div class="card p-3">
    <div class="mb-2"><b>예약번호:</b> {{ writeForm.resv_id }}</div>
    <div class="mb-2"><b>작성일:</b> {{ writeForm.log_date }}</div>

    <div class="mb-3">
      <label class="form-label">제목</label>
      <input
        class="form-control"
        v-model="writeForm.log_title"
        placeholder="상담일지 제목"
      />
    </div>

    <div class="mb-3">
      <label class="form-label">내용</label>
      <textarea
        class="form-control"
        rows="8"
        v-model="writeForm.log_content"
        placeholder="상담 내용/메모를 작성하세요"
      />
    </div>

    <div class="d-flex justify-content-end gap-2">
      <button class="btn btn-outline-secondary btn-sm" @click="cancel">
        취소
      </button>
      <button class="btn btn-primary btn-sm" @click="submit">
        저장
      </button>
    </div>
  </div>
</template>
