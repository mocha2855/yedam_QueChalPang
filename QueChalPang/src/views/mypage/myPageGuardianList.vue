<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <!-- 헤더 섹션 -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 class="mb-2" style="color: #2d3748; font-weight: 600">지원자 목록</h3>
            <p style="color: #718096; margin: 0">등록된 지원자 정보를 확인할 수 있습니다</p>
          </div>
          <button
            class="btn"
            @click="goAddDependant"
            style="
              background-color: #5a67d8;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              font-size: 14px;
              font-weight: 500;
            "
          >
            지원자 등록
          </button>
        </div>

        <!-- 메인 카드 -->
        <div class="card" style="border: none; border-radius: 16px">
          <div
            class="card-body p-0"
            v-if="
              myPage.guardianDependantInfo != null && counter.isLogIn.info.member_authority == 'a1'
            "
          >
            <div class="table-responsive">
              <table class="table align-items-center mb-0">
                <thead style="background-color: #f7fafc">
                  <tr>
                    <th
                      class="text-center text-uppercase text-secondary text-xs font-weight-bolder"
                      style="padding: 16px; color: #4a5568"
                    >
                      이름
                    </th>
                    <th
                      class="text-center text-uppercase text-secondary text-xs font-weight-bolder"
                      style="padding: 16px; color: #4a5568"
                    >
                      성별
                    </th>
                    <th
                      class="text-center text-uppercase text-secondary text-xs font-weight-bolder"
                      style="padding: 16px; color: #4a5568"
                    >
                      나이
                    </th>
                    <th
                      class="text-center text-uppercase text-secondary text-xs font-weight-bolder"
                      style="padding: 16px; color: #4a5568"
                    >
                      등록일
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="member in myPage.guardianDependantInfo"
                    :key="member"
                    style="cursor: pointer; transition: background-color 0.2s"
                    @mouseover="$event.currentTarget.style.backgroundColor = '#f7fafc'"
                    @mouseout="$event.currentTarget.style.backgroundColor = 'transparent'"
                  >
                    <td
                      class="align-middle text-center"
                      @click="goDetail(member.dependant_no)"
                      style="padding: 16px"
                    >
                      <p class="text-sm font-weight-bold mb-0" style="color: #2d3748">
                        {{ member.dependant_name }}
                      </p>
                    </td>
                    <td
                      class="text-sm text-center"
                      @click="goDetail(member.dependant_no)"
                      style="padding: 16px; color: #4a5568"
                    >
                      {{ member.dependant_gender }}
                    </td>
                    <td
                      class="align-middle text-center"
                      @click="goDetail(member.dependant_no)"
                      style="padding: 16px; color: #4a5568"
                    >
                      {{ member.dependant_birth }}
                    </td>

                    <td
                      class="align-middle text-center"
                      @click="goDetail(member.dependant_no)"
                      style="padding: 16px; color: #4a5568"
                    >
                      {{ member.dependant_date }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div
            v-else
            class="text-center"
            style="padding: 80px 20px; color: #718096; font-size: 16px"
          >
            지원자가 없습니다. 등록해주세요
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useMyPageStore } from '@/stores/mypage'
import { useCounterStore } from '@/stores/member'
import Swal from 'sweetalert2'

const myPage = useMyPageStore()
const counter = useCounterStore()

const router = useRouter()

onBeforeMount(async () => {
  if (counter.isLogIn.info.member_authority != 'a1') {
    await Swal.fire({
      icon: 'warning',
      title: '접근 권한 없음',
      text: '보호자만 접근가능합니다.',
      confirmButtonText: '확인',
    })
    router.push({ name: 'Dashboard' })
  } else {
    await myPage.searchGuardianDependantInfo(counter.isLogIn.info.member_id)
  }
})

const goDetail = (data) => {
  router.push({ name: 'myPageDetail', params: { id: data } })
}

const goAddDependant = () => {
  router.push({ name: 'myPageAddDependant' })
}

// 지원자 대기 단계
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
