<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header pb-0 d-flex justify-content-between align-items-center">
            <h6>담당지원자 목록</h6>

            <div class="card-header pb-0 d-flex justify-content-end align-items-center gap-2 pt-0z">
              <button class="btn btn-dark btn-sm">지원자 등록</button>

              <button class="btn btn-outline-danger btn-sm">선택 삭제</button>
            </div>
          </div>

          <div class="card-body px-0 pt-0 pb-2">
            <div class="table-responsive p-0">
              <table class="table align-items-center">
                <thead>
                  <tr>
                    <!--전체 선택 체크 박스-->
                    <th class="text-center">
                      <input type="checkbox" v-model="isAllChecked" />
                    </th>
                    <th
                      class="text-center text-uppercase text-secondary text-xxs font-weight-bolder"
                    >
                      이름
                    </th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder">이름</th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder">성별</th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder">
                      보호자
                    </th>
                    <th
                      class="text-center text-uppercase text-secondary text-xxs font-weight-bolder"
                    >
                      대기단계
                    </th>
                    <th
                      class="text-center text-uppercase text-secondary text-xxs font-weight-bolder"
                    >
                      장애유형
                    </th>
                    <th
                      class="text-center text-uppercase text-secondary text-xxs font-weight-bolder"
                    >
                      나이
                    </th>
                    <th
                      class="text-center text-uppercase text-secondary text-xxs font-weight-bolder"
                    >
                      등록일
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="member in userList"
                    :key="member.member_id"
                    :class="{ 'row-rejected': member.member_confirm === 'l3' }"
                  >
                    <!-- 개별 선택 체크박스 -->
                    <td class="align-middle text-center">
                      <input type="checkbox" :value="member.member_id" v-model="checkedIds" />
                    </td>

                    <td class="align-middle text-center">
                      <p class="text-sm font-weight-bold mb-0">
                        {{ member.member_id }}
                      </p>
                    </td>
                    <td
                      class="text-sm"
                      @click="member.member_confirm !== 'l3' ? memberInfo(member.member_id) : null"
                      :style="{
                        cursor: member.member_confirm !== 'l3' ? 'pointer' : 'not-allowed',
                      }"
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
                          'badge-md': true,
                          'bg-gradient-success': member.member_confirm == 'l1',
                          'bg-gradient-warning': member.member_confirm == 'l2',
                          'bg-gradient-danger': member.member_confirm == 'l3',
                        }"
                      >
                        {{ getStatus(member.member_confirm) }}
                      </span>
                    </td>
                    <td class="align-middle text-center">
                      <div
                        v-if="member.member_confirm == 'l2'"
                        class="d-flex gap-1 justify-content-center"
                      >
                        <ArgonButton
                          color="success"
                          size="sm"
                          @click="handleApprove(member.member_id)"
                        >
                          승인
                        </ArgonButton>
                        <ArgonButton
                          color="danger"
                          size="sm"
                          @click="handleReject(member.member_id)"
                        >
                          거절
                        </ArgonButton>
                      </div>
                      <span v-else class="text-xs text-secondary">-</span>
                    </td>
                    <td class="align-middle text-center">
                      <button
                        v-if="member.member_confirm === 'l1'"
                        class="btn btn-sm btn-outline-secondary"
                        @click="surveyUpdate(survey.survey_no)"
                      >
                        수정하기
                      </button>
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
<script setup>
import { useRouter } from 'vue-router'
import { onBeforeMount, ref } from 'vue'
import ArgonButton from '@/components/ArgonButton.vue'

const router = useRouter()
const checkedIds = ref([]) // 선택 체크

// 회원 상세 페이지로 이동
const memberInfo = (id) => {
  router.push({ path: `/member/${id}` })
}

// 승인 상태 텍스트
const getStatus = (confirm) => {
  if (confirm == 'l1') return '승인완료'
  if (confirm == 'l2') return '승인대기'
  if (confirm == 'l3') return '거절'
}

onBeforeMount(async () => {})
</script>
<style scoped>
/* 거절 row  */
.row-rejected {
  background-color: #f8f9fa;
  opacity: 0.6;
}

.row-rejected td {
  color: #adb5bd;
}

.row-rejected:hover {
  background-color: #f8f9fa;
}
</style>
