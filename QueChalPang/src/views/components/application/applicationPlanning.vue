<template>
  <div>
    <!-- ===================== 오른쪽: 신규 계획 입력 ===================== -->
    <applicationPlanningCreateForm
      v-if="memAuthority === 'a2'"
      :memAuthority="memAuthority"
      :memName="memName"
      :realCount="realCount"
      :addCount="addCount"
      :checked="checked"
      :formData="formData"
      @add="addPlanningForm"
      @delete="delForm"
      @request="submitPlanningInfo"
      @confirm="sucessResult"
      @cancel="notChecked"
    />

    <!-- ===================== 왼쪽-> 오른쪽: 반려된 계획서 수정 ===================== -->
    <applicationPlanningEditRejectedForm
      v-if="memAuthority === 'a2' && application.planningChanging?.length > 0"
      :plan="application.planningChanging[0]"
      :changingChecked="changingChecked"
      @openConfirm="modalOpen"
      @confirm="submitChaingPlanningInfo"
      @cancel="notChecked"
      @cancelEdit="cancelPlanningInfo"
    />

    <!-- ===================== 오른쪽: 승인대기(검토중) ===================== -->
    <div v-if="memAuthority === 'a3'" style="height: 100%">
      <h5>지원계획 승인대기</h5>
    </div>

    <!-- ===================== 반려 검토중 (planningChangingReview) ===================== -->
    <div
      class="card mb-3"
      v-for="plan in application.planningChangingReview"
      :key="plan.planning_no"
    >
      <div class="card-body" v-if="application.planningChangingReview.length > 0">
        <applicationPlanningReviewCard
          :plan="plan"
          :memAuthority="memAuthority"
          v-model:rejectReason="modal.rejectReason"
          @approve="modalOpen"
          @rejectOpen="modalClose"
          @confirmApprove="sucessResult"
          @confirmReject="rejectResult"
          @cancel="notChecked"
        />
      </div>
    </div>

    <!-- ===================== a2/a3: 검토중 계획서 (planningReview) ===================== -->
    <div
      v-if="
        application.planningReview.length > 0 && application.planningReview.planning_reject == null
      "
    >
      <div class="card mb-3" v-for="plan in application.planningReview" :key="plan.planning_no">
        <div class="card-body" v-if="application.planningReview.length > 0">
          <applicationPlanningReviewCard
            :plan="plan"
            :memAuthority="memAuthority"
            v-model:rejectReason="modal.rejectReason"
            @approve="modalOpen"
            @rejectOpen="modalClose"
            @confirmApprove="sucessResult"
            @confirmReject="rejectResult"
            @cancel="notChecked"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { useCounterStore } from '@/stores/member'
import { useApplicationStore } from '@/stores/application'
import axios from 'axios'
import { useModalStore } from '@/stores/Modal'

import applicationPlanningCreateForm from './applicationPlanningCreateForm.vue'
import applicationPlanningEditRejectedForm from './applicationPlanningEditRejectedForm.vue'
import applicationPlanningReviewCard from './applicationPlanningReviewCard.vue'

const route = useRoute()
const modal = useModalStore()

const counters = useCounterStore()
const application = useApplicationStore()

// 권한/작성자
const memAuthority = counters.isLogIn.info.member_authority
const memName = counters.isLogIn.info.member_name

// 카운트
const realCount = ref(0)
const addCount = ref(0)

// 신규 입력 폼 데이터(자식에서 v-model로 편하게)
const formData = reactive({
  startDate: '',
  endDate: '',
  title: '',
  content: '',
})

// 승인요청 모달 (담당자 신규)
const checked = ref(false)
const count = ref(0) // 승인요청 횟수(원본 유지)

// 관리자 승인/반려 대상 planning_no
const planningNo = ref(null)

// 반려 후 수정 승인요청 모달(a2)
const changingChecked = ref(false)

onBeforeMount(async () => {
  await application.countPlanning(route.params.id)
  addCount.value = application.planned

  if (addCount.value !== 0) {
    realCount.value = addCount.value + 1
    addCount.value = 0
  } else {
    realCount.value = 1
  }
})

// 계획 추가 버튼
const addPlanningForm = () => {
  if (addCount.value === 0) {
    if (application.planningChanging.length > 0) {
      alert('수정하던 작업을 마무리해주세요.')
      return
    }
    addCount.value = 1
    return
  }

  if (application.dependantInfo.status_status !== 'i2') {
    alert('대기단계 선택을 먼저 완료해주세요')
    return
  }

  if (count.value !== 1) {
    alert('작성하던 내용을 완료해주세요.')
  }

  application.planningState = 1
}

// 삭제 버튼
const delForm = () => {
  if (addCount.value === 1) {
    addCount.value = 0
    formData.startDate = ''
    formData.endDate = ''
    formData.title = ''
    formData.content = ''
    application.planningState = 0
  }
}

// 승인요청 버튼(담당자 신규)
const submitPlanningInfo = (payload) => {
  if (!payload.startDate || !payload.endDate || !payload.title || !payload.content) {
    alert('내용 입력을 완료해주세요')
    return
  }

  formData.startDate = payload.startDate
  formData.endDate = payload.endDate
  formData.title = payload.title
  formData.content = payload.content

  checked.value = true
}

const modalOpen = async (data, payload) => {
  if (memAuthority === 'a3') {
    application.planningReview.forEach((review) => {
      if (data === review.planning_no) {
        review.checked = !review.checked
        review.rejectChecked = false
      }
      planningNo.value = data
    })
    application.planningChangingReview.forEach((review) => {
      if (data === review.planning_no) {
        review.checked = !review.checked
        review.rejectChecked = false
      }
      planningNo.value = data
    })
    return
  }

  if (memAuthority === 'a2') {
    if (
      !payload?.planning_start ||
      !payload?.planning_end ||
      !payload?.planning_title ||
      !payload?.planning_content
    ) {
      alert('내용 입력을 완료해주세요')
      return
    }

    if (application.planningChanging?.length > 0) {
      application.planningChanging[0].planning_start = payload.planning_start
      application.planningChanging[0].planning_end = payload.planning_end
      application.planningChanging[0].planning_title = payload.planning_title
      application.planningChanging[0].planning_content = payload.planning_content
    }

    changingChecked.value = true
  }
}

const modalClose = (data) => {
  if (memAuthority === 'a3') {
    application.planningReview.forEach((review) => {
      if (data === review.planning_no) {
        review.checked = false
        review.rejectChecked = !review.rejectChecked
      }
      planningNo.value = data
    })
    application.planningChangingReview.forEach((review) => {
      if (data === review.planning_no) {
        review.checked = false
        review.rejectChecked = !review.rejectChecked
      }
      planningNo.value = data
    })
  }
}

// 승인모달 취소(공통)
const notChecked = (data) => {
  if (memAuthority === 'a2') {
    checked.value = false
    changingChecked.value = false
    return
  }

  if (memAuthority === 'a3') {
    application.planningReview.forEach((review) => {
      if (data === review.planning_no) {
        review.checked = false
        review.rejectChecked = false
        modal.rejectReason = null
      }
    })
    application.planningChangingReview.forEach((review) => {
      if (data === review.planning_no) {
        review.checked = false
        review.rejectChecked = false
      }
    })
  }
}

// 승인 확정(모달 확인 버튼)
const sucessResult = async () => {
  // 담당자(a2): 신규 계획 승인요청 제출
  if (memAuthority === 'a2') {
    await axios.post('/api/submitPlanningInfo/' + route.params.id, {
      planning_id: application.dependantInfo.manager_id,
      planning_rejecter: application.dependantInfo.application_rejector,
      planning_start: formData.startDate,
      planning_end: formData.endDate,
      planning_title: formData.title,
      planning_content: formData.content,
    })

    alert('승인요청 완료')
    await application.countRealReview(route.params.id)

    realCount.value = application.planned + 2
    checked.value = false
    addCount.value = 0

    formData.startDate = ''
    formData.endDate = ''
    formData.title = ''
    formData.content = ''
    count.value = 1
    return
  }

  // 관리자(a3): 승인 처리
  if (memAuthority === 'a3') {
    await axios.put('/api/successPlanningInfo/' + planningNo.value, {
      planning_status: 'i2',
    })
    alert('승인완료했습니다.')
    await application.countRealReview(route.params.id)
  }
}

// 반려 확정(모달 확인 버튼)
const rejectResult = async () => {
  if (!modal.rejectReason) {
    alert('반려사유를 작성해주세요.')
    return
  }

  await axios.put('/api/rejectPlanningInfo/' + planningNo.value, {
    planning_status: 'i3',
    planning_reject: modal.rejectReason,
  })

  alert('반려했습니다.')
  modal.rejectReason = undefined
  await application.countRealReview(route.params.id)
}

// 반려 후 수정 중 취소 버튼(a2)
const cancelPlanningInfo = async (planning_no) => {
  await axios.put('/api/successPlanningInfo/' + planning_no, {
    planning_status: 'i3',
  })
  application.planningChanging = []
  await application.countRealReview(route.params.id)
}

// 반려 후 승인요청 확정 버튼(a2)
const submitChaingPlanningInfo = async (planning_no) => {
  const p = application.planningChanging[0]
  await axios.put('/api/submitChangingPlanningInfo/' + planning_no, {
    planning_id: application.dependantInfo.manager_id,
    planning_rejecter: application.dependantInfo.application_rejector,
    planning_start: p.planning_start,
    planning_end: p.planning_end,
    planning_title: p.planning_title,
    planning_content: p.planning_content,
    planning_approvedDate: null,
  })

  application.planningChanging = []
  await application.countRealReview(route.params.id)
  changingChecked.value = false
  alert('승인요청 완료')
}
</script>
