<script setup>
import { useApprovalStore } from '@/stores/approval'
import { useRouter } from 'vue-router'
import { onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'
import ArgonButton from '@/components/ArgonButton.vue'

const store = useApprovalStore()
const { userList, userPendingList } = storeToRefs(store)
const router = useRouter()

// 회원 상세 페이지로 이동
const memberInfo = (id) => {
  router.push({ path: `/member/${id}` })
}

// 승인 상태 텍스트
const getStatus = (confirm) => {
  return confirm == 'l1' ? '승인완료' : '승인대기'
}

// 승인 처리
const handleApprove = async (id) => {
  if (confirm('승인하시겠습니까?')) {
    await store.approveMember(id)
    alert('승인되었습니다.')
  }
}

onBeforeMount(async () => {
  await store.getApprovalList()
})
</script>

<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header pb-0">
            <h6>일반회원 승인 관리</h6>
            <p class="text-sm mb-0">승인 대기: {{ userPendingList.length }}건</p>
          </div>

          <div class="card-body px-0 pt-0 pb-2">
            <div class="table-responsive p-0">
              <table class="table align-items-center">
                <thead>
                  <tr>
                    <th
                      class="text-center text-uppercase text-secondary text-xxs font-weight-bolder"
                    >
                      아이디
                    </th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder">이름</th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder">
                      이메일
                    </th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder">
                      가입일
                    </th>
                    <th
                      class="text-center text-uppercase text-secondary text-xxs font-weight-bolder"
                    >
                      상태
                    </th>
                    <th
                      class="text-center text-uppercase text-secondary text-xxs font-weight-bolder"
                    >
                      수정
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="member in userList" :key="member.member_id">
                    <td class="align-middle text-center">
                      <p class="text-sm font-weight-bold mb-0">
                        {{ member.member_id }}
                      </p>
                    </td>
                    <td
                      class="text-sm"
                      @click="memberInfo(member.member_id)"
                      style="cursor: pointer"
                    >
                      {{ member.member_name }}
                    </td>
                    <td class="text-sm">
                      {{ member.member_email }}
                    </td>
                    <td class="text-sm">
                      {{ member.member_date.substring(0, 10) }}
                    </td>
                    <td class="align-middle text-center">
                      <span
                        :class="{
                          badge: true,
                          'badge-sm': true,
                          'bg-gradient-success': member.member_confirm == 'l1',
                          'bg-gradient-warning': member.member_confirm == 'l2',
                        }"
                      >
                        {{ getStatus(member.member_confirm) }}
                      </span>
                    </td>
                    <td class="align-middle text-center">
                      <ArgonButton
                        v-if="member.member_confirm == 'l2'"
                        color="success"
                        size="sm"
                        @click="handleApprove(member.member_id)"
                      >
                        승인
                      </ArgonButton>
                      <span v-else class="text-xs text-secondary">
                        <button
                          class="btn btn-sm btn-outline-secondary"
                          @click="surveyUpdate(survey.survey_no)"
                        >
                          수정하기
                        </button></span
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
