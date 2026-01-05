<script setup>
import { useApprovalStore } from '@/stores/approval'
import { useRouter } from 'vue-router'
import { onBeforeMount, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import ArgonButton from '@/components/ArgonButton.vue'

const store = useApprovalStore()
const { managerList, managerPendingList } = storeToRefs(store)
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

const isAllChecked = computed({
  //개별선택 -> 전체 체크 반영
  get() {
    return checkedIds.value.length === managerList.value.length && managerList.length > 0
  },
  //전체선택 -> 개별 반영
  set(val) {
    if (val) {
      checkedIds.value = managerList.value.map((m) => m.member_id)
    } else {
      checkedIds.value = []
    }
  },
})

// 승인 처리
const handleApprove = async (id) => {
  if (confirm('승인하시겠습니까?')) {
    await store.approveMember(id)
    alert('승인되었습니다.')
  }
}
// 승인 거절 처리
const handleReject = async (id) => {
  if (confirm('거절하시겠습니까?')) {
    await store.rejectMember(id)
    alert('거절되었습니다.')
  }
}

//선택 승인 처리
const approveSelected = async () => {
  if (checkedIds.value.length === 0) return

  //승인대기만 필터링
  const pendingIds = checkedIds.value.filter((id) => {
    const member = managerList.value.find((m) => m.member_id === id)
    return member && member.member_confirm === 'l2'
  })

  //승인 대기가 없으면
  if (pendingIds.length === 0) {
    alert('승인 대기 중인 회원을 선택해주세요.')
    checkedIds.value = [] //체크 해제
    return
  }

  if (pendingIds.length < checkedIds.value.length) {
    const diff = checkedIds.value.length - pendingIds.length
    const ok = confirm(
      `${diff}명은 이미 처리되었습니다.\n${pendingIds.length}명만 승인하시겠습니까?`,
    )
    if (!ok) {
      checkedIds.value = [] // 체크 해제
      return
    }
  } else {
    // 전부 l2면 일반 확인창
    const ok = confirm(`${pendingIds.length}명을 승인하시겠습니까?`)
    if (!ok) return
  }

  // 승인 처리
  for (const id of pendingIds) {
    await store.approveMember(id)
  }

  alert(`${pendingIds.length}명이 승인되었습니다.`)
  checkedIds.value = []
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
          <div class="card-header pb-0 d-flex justify-content-between align-items-center">
            <h6>담당자 승인 관리</h6>
            <p class="text-sm mb-0" style="color: #000">
              승인 대기: {{ managerPendingList.length }}건
            </p>
          </div>
          <div class="card-header pb-0 d-flex justify-content-between align-items-center">
            <!-- 왼쪽: 회원추가 -->
            <button class="btn btn-sm btn-primary" @click="goToUserAdd">
              <i class="fas fa-plus"></i> 담당자추가
            </button>

            <!-- 오른쪽: 선택 버튼들 -->
            <div class="d-flex gap-2">
              <button
                class="btn btn-success btn-sm"
                :disabled="checkedIds.length === 0"
                @click="approveSelected"
              >
                선택 승인
              </button>

              <button
                class="btn btn-outline-danger btn-sm"
                :disabled="checkedIds.length === 0"
                @click="deleteSelected"
              >
                선택 삭제
              </button>
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
                      관리
                    </th>
                    <th
                      class="text-center text-uppercase text-secondary text-xxs font-weight-bolder"
                    >
                      수정
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="member in managerList" :key="member.member_id">
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
