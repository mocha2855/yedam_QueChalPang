<!-- views/components/meetingLog/meetingLogDetail.vue -->
<script setup>
import { storeToRefs } from 'pinia'
import { useMeetingLogStore } from '@/stores/meetingLog'

import MeetingLogView from './meetingLogView.vue'
import MeetingLogWrite from './meetingLogWrite.vue'

const store = useMeetingLogStore()
const { mode, selectedLog } = storeToRefs(store)
</script>

<template>
  <div>
    <h5 class="mb-3">상담 내용</h5>

    <div v-if="!selectedLog" class="text-secondary">
      상담을 선택해주세요.
    </div>

    <MeetingLogWrite v-else-if="mode === 'write'" />

    <MeetingLogView v-else-if="mode === 'view'" />

    <div v-else class="text-secondary">
      내역보기 또는 작성하기를 선택해주세요.
    </div>
  </div>
</template>
