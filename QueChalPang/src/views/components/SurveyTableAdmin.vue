<!-- 관리자 지원서관리 메인페이지. 담당자꺼 그대로 사용-->
<!-- views/components/SurveyTableAdmin.vue -->
<script setup>
import { onBeforeMount, ref } from 'vue'
import { useCounterStore } from '@/stores/member'
import { useSearchStore } from '@/stores/search'
import { storeToRefs } from 'pinia'
import axios from 'axios'
import router from '@/router'
import Swal from 'sweetalert2'
import { useApplicationStore } from '@/stores/application'

const search = useSearchStore()
const member = useCounterStore().isLogIn.info
search.member = member

const { applicationList } = storeToRefs(search)
const applicationStore = useApplicationStore()

// 시스템 관리자용
const centerList = ref([])
const selectedCenter = ref(null)

// 센터 목록 가져오기
const getAdminCenterList = async () => {
  if (member.member_authority === 'a4') {
    const result = await axios.get('/api/centers', {
      params: {
        key: 'center_name',
        value: '',
        badge: '',
        _t: Date.now(),
      },
      headers: { 'Cache-Control': 'no-cache' },
    })

    centerList.value = result.data

    if (centerList.value.length > 0) {
      selectedCenter.value = centerList.value[0].center_no
      const memberData = { ...member, member_id: selectedCenter.value }
      search.member = memberData
      search.getApplicationList(memberData)
    }
  }
}

// 센터 변경 시
const onCenterChange = () => {
  const memberData = { ...member, member_id: selectedCenter.value }
  search.member = memberData
  search.getApplicationList(memberData)
}

// 상태 텍스트
const returnStatus = (stat, statStatus) => {
  if (statStatus !== 'i2') return '대기'
  if (stat === 'e3') return '계획'
  if (stat === 'e4') return '중점'
  if (stat === 'e5') return '긴급'
  if (stat === 'e1') return '대기'
  if (stat === 'e2') return '검토중'
  return stat ?? ''
}

const changeDateFormat = (input) => {
  const date = new Date(input)
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}

// 페이지 이동
const goToApplication = (appNo) => {
  router.push({ name: 'applicationWait', params: { id: appNo } })
}
const goToPlanning = (applicationNo) => {
  router.push({ name: 'applicationPlanning', params: { id: applicationNo } })
}
const goToResult = (applicationNo) => {
  router.push({ name: 'applicationResult', params: { id: applicationNo } })
}
const goToMeetingLog = (applicationNo) => {
  router.push({ name: 'meetingLog', params: { id: applicationNo } })
}


//SweetAlert 담당자 배정
const openAssignManagerModal = async (row) => {
  try {
    // 1. 담당자 목록 조회
    const { data } = await axios.get(`/api/dependants/${row.dependant_no}/managers`)
    const list = Array.isArray(data) ? data : (data.rows ?? [])

    if (!list.length) {
      await Swal.fire({
        icon: 'info',
        title: '배정 가능한 담당자가 없습니다',
        confirmButtonColor: '#3b82f6',
      })
      return
    }

    // 2. option HTML 생성
    const optionsHtml = list
      .map(
        (m) =>
          `<option value="${m.member_id}">${m.member_name} (${m.member_id})</option>`
      )
      .join('')

    // 3. Swal select 모달
    const { value: selectedId } = await Swal.fire({
      title: '담당자 배정',

      width: 650,

      padding: '20px 24px 24px 24px',
      // buttonsStyling: true, 
      buttonsStyling: false, 
      customClass: {
        popup: 'assign-manager-popup',
        title: 'assign-manager-title',
        htmlContainer: 'assign-manager-html',
        confirmButton: 'btn btn-success px-4 py-2 m-1', 
        cancelButton: 'btn btn-danger px-4 py-2 m-1' // 오렌지색 계열이 보통 danger나 warning
      },
      html: `
        <div style="text-align:left; font-size:20px; margin-bottom:12px;">
          <div><b>${row.guardian_name}</b> 보호자의 <b>${row.dependant_name}</b> 지원자</div>
          <div style="color:#64748b; font-size:20ppx; margin-top:4px;">
            신청서 번호 : ${row.application_no}
          </div>
        </div>

        <select id="swal-manager" class="swal2-select"
          style="width:80%; padding:10px 12px; border-radius:10px;">
          <option value="">담당자 선택</option>
          ${optionsHtml}
        </select>
      `,
  
      showCancelButton: true,
  
      confirmButtonText: '배정하기',
      cancelButtonText: '취소',
      focusConfirm: false,
      preConfirm: () => {
        const v = document.getElementById('swal-manager').value
        if (!v) {
          Swal.showValidationMessage('담당자를 선택해주세요')
        }
        return v
      },
    })

    if (!selectedId) return

    // 4. 배정 API 호출 (store 그대로 사용)
    await applicationStore.assignManager(row.application_no, selectedId)

    // 5. 완료 알림
    await Swal.fire({
      icon: 'success',
      title: '담당자 배정 완료',
      confirmButtonColor: '#3b82f6',
    })

    // 6. 목록 새로고침
    search.getApplicationList(search.member)

  } catch (err) {
    console.error(err)
    await Swal.fire({
      icon: 'error',
      title: '담당자 배정 실패',
      text: '담당자 배정 중 오류가 발생했습니다.',
      confirmButtonColor: '#3b82f6',
    })
  }
}


onBeforeMount(() => {
  if (member.member_authority === 'a4') {
    setTimeout(getAdminCenterList, 10)
  } else {
    setTimeout(() => search.getApplicationList(member), 10)
  }
})
</script>


<template>
  <div class="card">
    <div class="card-header pb-0">
      <div class="d-flex justify-content-between align-items-center">
        <h6 class="mb-0">지원신청 현황</h6>

        <!-- 시스템 관리자 센터 선택 -->
        <div v-if="member.member_authority === 'a4'">
          <select
            v-model="selectedCenter"
            @change="onCenterChange"
            class="form-select form-select-sm"
            style="width: 200px"
          >
            <option v-for="center in centerList" :key="center.center_no" :value="center.center_no">
              {{ center.center_name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th>번호</th>
              <th>지원자명</th>
              <th>보호자명</th>
              <th>신청서번호</th>
              <th class="text-center">지원신청일</th>
              <th class="text-center">지원신청서</th>
              <th class="text-center">담당자</th>
              <th class="text-center">대기단계</th>
              <th class="text-center">계획/결과 진행</th>
              <th class="text-center">지원계획</th>
              <th class="text-center">상담내역</th>
              <th class="text-center">지원결과</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(row, index) in applicationList" :key="row.application_no">
              <td class="text-center">{{ index + 1 }}</td>
              <td>{{ row.dependant_name }}</td>
              <td>{{ row.guardian_name }}</td>
              <td class="text-center">{{ row.application_no }}</td>
              <td class="text-center">{{ changeDateFormat(row.application_date) }}</td>

              <td class="text-center">
                <button class="btn btn-success btn-sm"
                  @click="goToApplication(row.application_no)">
                  보기
                </button>
              </td>

              <!-- 담당자 -->
              <td class="text-center">
                <template v-if="row.manager_name">
                  {{ row.manager_name }}
                </template>
                <template v-else>
                  <button class="btn btn-success btn-sm"
                    @click="openAssignManagerModal(row)">
                    담당자 배정
                  </button>
                </template>
              </td>

              <td class="text-center">
                {{ returnStatus(row.status, row.status_status) }}
              </td>

              <td class="text-center text-xs">
                검토 {{ row.counts.i1 }}<br />
                승인 {{ row.counts.i2 }}<br />
                반려 {{ row.counts.i3 }}
              </td>

              <td class="text-center">
                <button v-if="row.planningCount > 0"
                  class="btn btn-success btn-sm"
                  @click="goToPlanning(row.application_no)">
                  보기
                </button>
                <span v-else class="badge bg-secondary">없음</span>
              </td>

              <td class="text-center">
                <button v-if="row.meetingCount > 0"
                  class="btn btn-success btn-sm"
                  @click="goToMeetingLog(row.application_no)">
                  보기
                </button>
                <span v-else class="badge bg-secondary">없음</span>
              </td>

              <td class="text-center">
                <button v-if="row.resultCount > 0"
                  class="btn btn-success btn-sm"
                  @click="goToResult(row.application_no)">
                  보기
                </button>
                <span v-else class="badge bg-secondary">없음</span>
              </td>
            </tr>
          </tbody>

        </table>
      </div>
    </div>
  </div>
</template>


<style scoped>
.card {
  border: 1px solid #eef1f5;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(17, 24, 39, 0.06);
  overflow: hidden;
  background: #fff;
}

/* ===== Header ===== */
.card-header {
  padding: 14px 18px;
  border-bottom: 1px solid #eef1f5;
  background: #fff;
}

.card-header h6 {
  font-size: 1.05rem;
  font-weight: 600;
  color: #111827;
  letter-spacing: -0.2px;
}

/* ===== Table Layout ===== */
.table-responsive {
  overflow-x: auto;
}

.table {
  border-collapse: separate;
  border-spacing: 0;
  min-width: 1100px;
}

.table thead th {
  position: sticky;
  top: 0;
  z-index: 1;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;

  padding: 13px 14px;
  font-size: 0.85rem !important;
  font-weight: 600;
  color: #000000 !important;
  text-transform: none !important;
  letter-spacing: -0.15px;
  white-space: nowrap;
}

.table tbody td {
  padding: 13px 14px;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
  font-size: 0.95rem;
  font-weight: 400;
  color: #111827;
}

.table tbody tr {
  background: #fff;
  transition: background 0.12s ease;
}

.table tbody tr:hover {
  background: #f9fafb;
}

.table tbody p {
  margin: 0;
  font-size: 0.95rem !important;
  font-weight: 400 !important;
  color: #111827;
  line-height: 1.4;
}

.table tbody .text-secondary {
  font-size: 0.93rem !important;
  font-weight: 400 !important;
  color: #6b7280 !important;
}

.table tbody td:nth-child(9) p {
  font-size: 0.9rem !important;
  color: #4b5563 !important;
}

.table .btn.btn-sm {
  font-size: 0.88rem;
  font-weight: 500;
  padding: 7px 13px;
  border-radius: 10px;
  box-shadow: none;
  border: 1px solid rgba(17, 24, 39, 0.08);
}

.table .btn.btn-success.btn-sm {
  background: #16a34a;
  border-color: rgba(22, 163, 74, 0.25);
}

.table .btn.btn-primary.btn-sm {
  background: #2563eb;
  border-color: rgba(37, 99, 235, 0.25);
}

.table .btn:hover {
  filter: brightness(0.97);
  transform: translateY(-1px);
  transition: transform 0.12s ease;
}

.empty-text {
  color: #9ca3af;
  font-size: 0.92rem;
  font-weight: 400;
}

.text-center {
  white-space: nowrap;
}

/* style 섹션에 추가 */
:deep(.swal2-cancel) {
  background-color: #ed4d02 !important;
  color: white !important;
  border: none !important;
  box-shadow: none !important;
}

/* 호버 시 색상 변화도 주고 싶다면 */
:deep(.swal2-cancel:hover) {
  background-color: #d14302 !important;
}

/* SweetAlert2 버튼 스타일 강제 오버라이드 */
body :deep(.swal2-container .swal2-actions .swal2-cancel) {
  background-color: #ed4d02 !important;
  color: #ffffff !important;
  border: none !important;
  box-shadow: none !important;
  opacity: 1 !important;
  display: inline-block !important; /* 가끔 display:none 되는 경우 방지 */
}

body :deep(.swal2-container .swal2-actions .swal2-cancel:hover) {
  background-color: #d14302 !important;
}

/* 확인 버튼도 통일감을 주려면 */
body :deep(.swal2-container .swal2-actions .swal2-confirm) {
  background-color: #16A34A !important;
  box-shadow: none !important;
}
</style>
