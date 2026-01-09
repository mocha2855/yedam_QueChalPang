<!-- views/components/meetingLog/MeetingLogView.vue -->
<script setup>
import { storeToRefs } from 'pinia'
import { useMeetingLogStore } from '@/stores/meetingLog'

const store = useMeetingLogStore()
const { detail, detailLoading } = storeToRefs(store)
</script>

<template>
  <div>
    <div v-if="detailLoading" class="text-secondary">불러오는 중...</div>

    <div v-else-if="!detail" class="text-secondary">내역보기 버튼을 눌러주세요.</div>

    <div v-else class="card p-3">
      <div class="mb-2"><b>상담일:</b> {{ detail.resv_day?.slice(0, 10) }}</div>
      <div class="mb-2"><b>상태:</b> {{ detail.resv_status }}</div>

      <hr />

      <div v-if="!detail.log_id" class="text-secondary">상담일지가 아직 작성되지 않았습니다.</div>

      <div v-else>
        <div class="mb-2"><b>제목:</b> {{ detail.log_title }}</div>
        <div class="mb-2"><b>작성자:</b> {{ detail.member_id }}</div>
        <div class="mb-3"><b>작성일:</b> {{ String(detail.log_date).slice(0, 16) }}</div>

        <div class="p-3" style="background: #f8fafc; border-radius: 12px; white-space: pre-line">
          {{ detail.log_content }}
        </div>
      </div>
    </div>
  </div>
</template>
