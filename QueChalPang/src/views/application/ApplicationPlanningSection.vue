<!-- application/ApplicationPlanningSection.vue -->
<template>
  <div>
    <!-- 담당자(a2)가 계획서 신규 입력 -->
    <div v-if="memAuthority === 'a2'">
      <PlanningCreateCard
        :mem-authority="memAuthority"
        :mem-name="memName"
        :real-count="realCount"
        :add-count="addCount"
        :planned-status="application.dependantInfo?.status_status"
        :has-changing-work="application.planningChanging?.length > 0"
        @update:addCount="(v) => (addCount = v)"
        @requestAdd="onRequestAdd"
        @deleted="onDeletedCreate"
        @submitted="onSubmitCreate"
      />

      <!-- 담당자(a2) 반려된거 수정 -->
      <PlanningRejectedEditCard
        v-if="showRejectedEdit"
        :mem-authority="memAuthority"
        :plan="application.planningChanging[0]"
        @submitChanging="onSubmitChanging"
        @cancel="onCancelChanging"
      />
    </div>

    <!-- 관리자(a3) 상단 안내 -->
    <div v-else-if="memAuthority === 'a3'" style="height: 100%">
      <h5>지원계획 승인대기</h5>
    </div>

    <!-- 반려 검토중(관리자 & 담당자 같이 줘야함) -->
    <PlanningRejectedReviewList
      v-if="(memAuthority === 'a3' || memAuthority === 'a1') && application.planningChangingReview?.length > 0"
      :mem-authority="memAuthority"
      :plans="application.planningChangingReview"
      @approve="approvePlan"
      @reject="rejectPlan"
    />

    <!-- 검토중인 계획서 리스트 (관리자, 담당자 모두) -->
    <PlanningReviewList
      :show="showPlanningReview"
      :mem-authority="memAuthority"
      :plans="application.planningReview"
      @approve="approvePlan"
      @reject="rejectPlan"
    />
  </div>
</template>

<script setup>
import { computed, ref, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

import { useCounterStore } from '@/stores/member'
import { useApplicationStore } from '@/stores/application'
import { useModalStore } from '@/stores/modal'

import PlanningCreateCard from './sections/PlanningCreateCard.vue'
import PlanningRejectedEditCard from './sections/PlanningRejectedEditCard.vue'
import PlanningRejectedReviewList from './sections/PlanningRejectedReviewList.vue'
import PlanningReviewList from './sections/PlanningReviewList.vue'

const route = useRoute()
const modal = useModalStore()

const counters = useCounterStore()
const application = useApplicationStore()

// 권한/이름은 computed로(로그인 정보 바뀌어도 안전)
const memAuthority = computed(() => counters.isLogIn.info.member_authority)
const memName = computed(() => counters.isLogIn.info.member_name)

const realCount = ref(0)
let addCount = ref(0)

const refresh = async () => {
  await application.countRealReview(route.params.id)
}

onBeforeMount(async () => {
  await application.countPlanning(route.params.id)
  await refresh()

  addCount.value = application.planned

  if (addCount.value !== 0) {
    realCount.value = addCount.value + 1
    addCount.value = 0
  } else {
    realCount.value = 1
  }
})

const onRequestAdd = () => {
  // 기존에 application.planningState = 1 하던거
  application.planningState = 1
}

const onDeletedCreate = () => {
  application.planningState = 0
}

// 신규 승인요청(담당자 a2) - axios는 부모에서!
const onSubmitCreate = async (payload) => {
  await axios.post('/api/submitPlanningInfo/' + route.params.id, {
    planning_id: application.dependantInfo.manager_id,
    planning_rejecter: application.dependantInfo.application_rejector,
    planning_start: payload.startDate,
    planning_end: payload.endDate,
    planning_title: payload.title,
    planning_content: payload.content,
  })

  alert('승인요청 완료')
  await refresh()

  // 기존 동작 맞추기: 카운트/폼 상태 리셋
  realCount.value = application.planned + 2
  addCount.value = 0
  application.planningState = 0
}

// 반려 수정 카드 노출 조건(기존 조건을 안전하게)
const showRejectedEdit = computed(() => {
  const arr = application.planningChanging
  if (memAuthority.value !== 'a2') return false
  if (!arr || arr.length === 0) return false
  // 기존 조건: planning_approvedDate != ''
  return arr[0].planning_approvedDate !== ''
})

// 반려 수정 -> 승인요청
const onSubmitChanging = async (plan) => {
  await axios.put('/api/submitChangingPlanningInfo/' + plan.planning_no, {
    planning_id: application.dependantInfo.manager_id,
    planning_rejecter: application.dependantInfo.application_rejector,
    // 날짜는 기존 그대로 두고, 제목/내용만 수정
    planning_title: plan.planning_title,
    planning_content: plan.planning_content,
    planning_approvedDate: null, // 이걸 null로 바꿔야 planningChangingReview로 분류됨
  })

  alert('승인요청 완료')
  application.planningState = 0 // 수정 모드 종료
  await refresh()
}

// 반려 수정 취소(담당자)
const onCancelChanging = async (planningNo) => {
  await axios.put('/api/successPlanningInfo/' + planningNo, {
    planning_status: 'i3',
  })
  application.planningState = 0
  await refresh()
}

// 관리자 승인(검토중/반려검토중 공용)
const approvePlan = async (planningNo) => {
  await axios.put('/api/successPlanningInfo/' + planningNo, {
    planning_status: 'i2',
  })
  alert('승인완료했습니다.')
  await refresh()
}

// 관리자 반려(반려사유는 modal store에서 가져오는 기존 방식 유지)
const rejectPlan = async (planningNo) => {
  if (modal.rejectReason == undefined) {
    alert('반려사유를 작성해주세요.')
    return
  }

  // await axios.put('/api/rejectPlanningInfo/' + planningNo, {
  //   planning_status: 'i3',
  //   planning_reject: modal.rejectReason,
  // })

  await axios.put(`/api/rejectPlanningInfo/${planningNo}`, {
    planning_status: 'i3',
    planning_reject: modal.rejectReason, // textarea에서 v-model로 받은 값
  })

  alert('반려했습니다.')
  modal.rejectReason = undefined
  await refresh()
}

// 검토중 계획서 노출 조건(기존 조건)
// const showPlanningReview = computed(() => {
//   return (
//     application.planningReview?.length > 0 && application.planningReview.planning_reject == null
//   )
// })
const showPlanningReview = computed(() => {
  return application.planningReview && application.planningReview.length > 0
})
</script>
