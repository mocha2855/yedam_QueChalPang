<script setup>
import { useApprovalStore } from '@/stores/approval'
import { useCounterStore } from '@/stores/member'

import { useRouter } from 'vue-router'
import { onBeforeMount, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import ArgonPagination from '@/components/ArgonPagination.vue'
import ArgonPaginationItem from '@/components/ArgonPaginationItem.vue'
import Swal from 'sweetalert2'

const store = useApprovalStore()
const member = useCounterStore()
const { userList, userPendingList } = storeToRefs(store)
const router = useRouter()
const checkedIds = ref([]) // 선택 체크

// 페이지네이션 추가
const currentPage = ref(1) // 현재 페이지 번호 (처음엔 1페이지)
const itemsPerPage = 10 // 한 페이지에 보여줄 개수

// 총 페이지 수
const totalPages = computed(() => {
  return Math.ceil(userList.value.length / itemsPerPage)
})

// 현재 페이지에 표시할 데이터
const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage // 시작 인덱스
  const end = start + itemsPerPage // 끝 인덱스
  return userList.value.slice(start, end) // 해당 범위만 잘라내기
})

// 페이지 변경
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    // 유효한 페이지인지 확인
    currentPage.value = page // 페이지 변경
    checkedIds.value = [] // 페이지 변경시 체크 초기화
  }
}

// 승인 상태 텍스트
const getStatus = (confirm) => {
  if (confirm == 'l1') return '승인완료'
  if (confirm == 'l2') return '승인대기'
  if (confirm == 'l3') return '거절'
  if (confirm == 'l4') return '삭제됨'
}
const isAllChecked = computed({
  //개별선택 -> 전체 체크 반영
  get() {
    return checkedIds.value.length === userList.value.length && userList.length > 0
  },
  //전체선택 -> 개별 반영
  set(val) {
    if (val) {
      checkedIds.value = userList.value.map((m) => m.member_id)
    } else {
      checkedIds.value = []
    }
  },
})
// 승인 처리
const handleApprove = async (id) => {
  const result = await Swal.fire({
    icon: 'question',
    title: '승인하시겠습니까?',
    showCancelButton: true,
    confirmButtonText: '승인',
    cancelButtonText: '취소',
  })
  if (result.isConfirmed) {
    await store.approveMember(id)
    await Swal.fire({
      icon: 'success',
      title: '승인되었습니다!',
      showConfirmButton: false,
      timer: 1500,
    })
  }
}
// 승인 거절 처리
const handleReject = async (id) => {
  const result = await Swal.fire({
    icon: 'question',
    title: '거절하시겠습니까?',
    showCancelButton: true,
    confirmButtonText: '거절',
    cancelButtonText: '취소',
  })
  if (result.isConfirmed) {
    await store.rejectMember(id)
    await Swal.fire({
      icon: 'success',
      title: '거절되었습니다!',
      showConfirmButton: false,
      timer: 1500,
    })
  }
}

//선택 승인 처리
const approveSelected = async () => {
  if (checkedIds.value.length === 0) return

  //승인대기만 필터링
  const pendingIds = checkedIds.value.filter((id) => {
    const member = userList.value.find((m) => m.member_id === id)
    return member && member.member_confirm === 'l2'
  })

  //승인 대기가 없으면
  if (pendingIds.length === 0) {
    await Swal.fire({
      icon: 'warning',
      title: '승인 대기 중인 회원을 선택해주세요',
      confirmButtonText: '확인',
    })
    checkedIds.value = [] //체크 해제
    return
  }

  if (pendingIds.length < checkedIds.value.length) {
    const diff = checkedIds.value.length - pendingIds.length
    const result = await Swal.fire({
      icon: 'question',
      title: `${diff}명은 이미 처리되었습니다`,
      text: `${pendingIds.length}명만 승인하시겠습니까?`,
      showCancelButton: true,
      confirmButtonText: '승인',
      cancelButtonText: '취소',
    })
    if (!result.isConfirmed) {
      checkedIds.value = [] // 체크 해제
      return
    }
  } else {
    // 전부 l2면 일반 확인창
    const result = await Swal.fire({
      icon: 'question',
      title: `${pendingIds.length}명을 승인하시겠습니까?`,
      showCancelButton: true,
      confirmButtonText: '승인',
      cancelButtonText: '취소',
    })
    if (!result.isConfirmed) return
  }

  // 승인 처리
  for (const id of pendingIds) {
    await store.approveMember(id)
  }

  await Swal.fire({
    icon: 'success',
    title: `${pendingIds.length}명이 승인되었습니다!`,
    showConfirmButton: false,
    timer: 1500,
  })
  checkedIds.value = []
}
const deleteSelected = async () => {
  if (checkedIds.value.length === 0) return

  // 삭제 가능한 것만 필터링 (l4가 아닌 것들)
  const deletableIds = checkedIds.value.filter((id) => {
    const member = userList.value.find((m) => m.member_id === id)
    return member && member.member_confirm !== 'l4'
  })

  if (deletableIds.length === 0) {
    await Swal.fire({
      icon: 'warning',
      title: '삭제 가능한 회원을 선택해주세요',
      confirmButtonText: '확인',
    })
    checkedIds.value = []
    return
  }

  if (deletableIds.length < checkedIds.value.length) {
    const di = checkedIds.value.length - deletableIds.length
    const result = await Swal.fire({
      icon: 'question',
      title: `${di}명은 이미 삭제되었습니다`,
      text: `${deletableIds.length}명을 삭제하시겠습니까?`,
      showCancelButton: true,
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
    })
    if (!result.isConfirmed) {
      checkedIds.value = []
      return
    }
  } else {
    const result = await Swal.fire({
      icon: 'question',
      title: `${deletableIds.length}명을 삭제하시겠습니까?`,
      showCancelButton: true,
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
    })
    if (!result.isConfirmed) return
  }

  for (const id of deletableIds) {
    await store.deleteMember(id)
  }

  await Swal.fire({
    icon: 'success',
    title: `${deletableIds.length}명이 삭제되었습니다!`,
    showConfirmButton: false,
    timer: 1500,
  })
  checkedIds.value = []
}

onBeforeMount(async () => {
  const authority = member.isLogIn.info.member_authority

  if (authority !== 'a4') {
    // a4아니면 막음
    await Swal.fire({
      icon: 'warning',
      title: '접근 권한 없음',
      text: '시스템 관리자만 접근할 수 있습니다.',
      confirmButtonText: '확인',
    })
    router.push({ name: 'Dashboard' })
    return
  }
  await store.getApprovalList()
})
const approvalUserUpdate = (id) => {
  router.push({ name: 'ApprovalUserUpdate', params: { id: id } })
}
// hover 스타일 적용 여부 확인
const canHover = (confirm) => {
  return confirm !== 'l3' && confirm !== 'l4'
}
</script>

<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <!-- 헤더 섹션 -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 class="mb-2" style="color: #2d3748; font-weight: 600">일반회원 승인 관리</h3>
            <p style="color: #718096; margin: 0; font-size: 14px">
              일반회원의 가입 승인을 관리할 수 있습니다
            </p>
          </div>
          <div style="text-align: right">
            <p class="mb-2" style="color: #2d3748; font-weight: 600; font-size: 15px">
              승인 대기: {{ userPendingList?.length || 0 }}건
            </p>
            <div class="d-flex gap-2">
              <button
                class="btn"
                :disabled="checkedIds.length === 0"
                @click="approveSelected"
                :style="
                  checkedIds.length === 0
                    ? 'background-color: #cbd5e0; color: #718096; border: none; padding: 8px 18px; border-radius: 8px; font-size: 13px; cursor: not-allowed;'
                    : 'background-color: #48bb78; color: white; border: none; padding: 8px 18px; border-radius: 8px; font-size: 13px; font-weight: 500;'
                "
              >
                선택 승인
              </button>
              <button
                class="btn"
                :disabled="checkedIds.length === 0"
                @click="deleteSelected"
                :style="
                  checkedIds.length === 0
                    ? 'background-color: #cbd5e0; color: #718096; border: none; padding: 8px 18px; border-radius: 8px; font-size: 13px; cursor: not-allowed;'
                    : 'background-color: #fc8181; color: white; border: none; padding: 8px 18px; border-radius: 8px; font-size: 13px; font-weight: 500;'
                "
              >
                선택 삭제
              </button>
            </div>
          </div>
        </div>

        <!-- 메인 카드 -->
        <div class="card" style="border: none; border-radius: 16px">
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table align-items-center mb-0">
                <thead style="background-color: #f7fafc">
                  <tr>
                    <th class="text-center" style="padding: 14px">
                      <input type="checkbox" v-model="isAllChecked" />
                    </th>
                    <th
                      class="text-center text-uppercase text-secondary text-xs font-weight-bolder"
                      style="padding: 14px; color: #4a5568"
                    >
                      아이디
                    </th>
                    <th
                      class="text-uppercase text-secondary text-xs font-weight-bolder"
                      style="padding: 14px; color: #4a5568"
                    >
                      이름
                    </th>
                    <th
                      class="text-uppercase text-secondary text-xs font-weight-bolder"
                      style="padding: 14px; color: #4a5568"
                    >
                      이메일
                    </th>
                    <th
                      class="text-uppercase text-secondary text-xs font-weight-bolder"
                      style="padding: 14px; color: #4a5568"
                    >
                      가입일
                    </th>
                    <th
                      class="text-center text-uppercase text-secondary text-xs font-weight-bolder"
                      style="padding: 14px; color: #4a5568"
                    >
                      상태
                    </th>
                    <th
                      class="text-center text-uppercase text-secondary text-xs font-weight-bolder"
                      style="padding: 14px; color: #4a5568"
                    >
                      관리
                    </th>
                    <th
                      class="text-center text-uppercase text-secondary text-xs font-weight-bolder"
                      style="padding: 14px; color: #4a5568"
                    >
                      수정
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="member in paginatedList"
                    :key="member.member_id"
                    :class="{
                      'row-rejected': member.member_confirm === 'l3',
                      'row-deleted': member.member_confirm === 'l4',
                      'row-hover': canHover(member.member_confirm),
                    }"
                  >
                    <!-- 개별 선택 체크박스 -->
                    <td class="align-middle text-center" style="padding: 14px">
                      <input type="checkbox" :value="member.member_id" v-model="checkedIds" />
                    </td>

                    <td class="align-middle text-center" style="padding: 14px">
                      <p class="text-xs font-weight-bold mb-0" style="color: #2d3748">
                        {{ member.member_id }}
                      </p>
                    </td>
                    <td class="text-xs" style="padding: 14px; color: #4a5568">
                      {{ member.member_name }}
                    </td>
                    <td class="text-xs" style="padding: 14px; color: #4a5568">
                      {{ member.member_email }}
                    </td>
                    <td class="text-xs" style="padding: 14px; color: #4a5568">
                      {{ member.member_date.substring(0, 10) }}
                    </td>
                    <td class="align-middle text-center" style="padding: 14px">
                      <span
                        :class="{
                          badge: true,
                          'badge-sm': true,
                          'bg-gradient-success': member.member_confirm == 'l1',
                          'bg-gradient-warning': member.member_confirm == 'l2',
                          'bg-gradient-danger': member.member_confirm == 'l3',
                          'bg-gradient-secondary': member.member_confirm == 'l4',
                        }"
                        style="font-size: 11px"
                      >
                        {{ getStatus(member.member_confirm) }}
                      </span>
                    </td>
                    <td class="align-middle text-center" style="padding: 14px">
                      <div
                        v-if="member.member_confirm == 'l2'"
                        class="d-flex gap-1 justify-content-center"
                      >
                        <button
                          class="btn btn-sm"
                          @click="handleApprove(member.member_id)"
                          style="
                            background-color: #48bb78;
                            color: white;
                            border: none;
                            padding: 5px 14px;
                            border-radius: 6px;
                            font-size: 12px;
                          "
                        >
                          승인
                        </button>
                        <button
                          class="btn btn-sm"
                          @click="handleReject(member.member_id)"
                          style="
                            background-color: #fc8181;
                            color: white;
                            border: none;
                            padding: 5px 14px;
                            border-radius: 6px;
                            font-size: 12px;
                          "
                        >
                          거절
                        </button>
                      </div>
                      <span v-else class="text-xs text-secondary">-</span>
                    </td>
                    <td class="align-middle text-center" style="padding: 14px">
                      <button
                        v-if="member.member_confirm === 'l1'"
                        class="btn btn-sm btn-no-hover"
                        @click="approvalUserUpdate(member.member_id)"
                        style="
                          background-color: #f7fafc;
                          color: #4a5568;
                          border: 1px solid #e2e8f0;
                          padding: 5px 14px;
                          border-radius: 6px;
                          font-size: 12px;
                        "
                      >
                        수정하기
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- 페이지네이션 추가! -->
            <div class="d-flex justify-content-center mt-3 mb-3">
              <argon-pagination color="success">
                <!-- 이전 버튼 -->
                <argon-pagination-item
                  prev
                  :disabled="currentPage === 1"
                  @click="goToPage(currentPage - 1)"
                />

                <!-- 페이지 번호들 -->
                <argon-pagination-item
                  v-for="page in totalPages"
                  :key="page"
                  :label="String(page)"
                  :active="currentPage === page"
                  @click="goToPage(page)"
                />

                <!-- 다음 버튼 -->
                <argon-pagination-item
                  next
                  :disabled="currentPage === totalPages"
                  @click="goToPage(currentPage + 1)"
                />
              </argon-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
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

/* hover 효과 */
.row-hover {
  transition: background-color 0.2s;
}

.row-hover:hover {
  background-color: #f7fafc;
}

/* 수정하기 버튼 호버 제거 */
.btn-no-hover {
  transition: none !important;
}

.btn-no-hover:hover {
  background-color: #f7fafc !important;
  color: #4a5568 !important;
  border: 1px solid #e2e8f0 !important;
}
/* 체크박스 색상 변경 */
input[type='checkbox'] {
  accent-color: #000000;
}
</style>
