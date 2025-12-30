<template>
  <div class="py-4 container-fluid"></div>
  <div class="card_w-100">
    <div class="tabLeft">
      <header>
        <p>지원자 정보</p>
      </header>
      <nav class="mb-3">
        <RouterLink v-bind:to="{ name: 'applicationWait', params: { id: route.params.id } }"
          >지원신청서</RouterLink
        >
        <RouterLink v-bind:to="{ name: 'applicationPlanning', params: { id: route.params.id } }">
          지원계획서
        </RouterLink>
        <p>지원결과서</p>
        <p>상담내역</p>
      </nav>
      <router-view name="right" />
    </div>
    <div class="tabRight">
      <router-view />
    </div>
  </div>
</template>
<script setup>
import { useApplicationStore } from '@/stores/application'
const application = useApplicationStore()
import { watch, onBeforeMount } from 'vue'

const route = useRoute()
import { useRoute } from 'vue-router'

onBeforeMount(async () => {
  // 지원자 정보
  await application.checkdependantInfo(route.params.id)
  console.log('checkdependantInfo: ', application.dependantInfo)

  await application.countRealReview(route.params.id).then(() => {
    // 검토중 계획서들 날짜 형식 변경
    for (let i = 0; i < application.planningReview.length; i++) {
      console.log(i)
      application.planningReview[i].planning_start = dateChange(
        application.planningReview[i].planning_start,
      )
      application.planningReview[i].planning_end = dateChange(
        application.planningReview[i].planning_end,
      )
      application.planningReview[i].checked = false
      application.planningReview[i].rejectChecked = false
    }
    console.log('검토중: ', application.planningReview)

    // 승인완료 계획서들 날짜 형식 변경
    for (let i = 0; i < application.planningSuccess.length; i++) {
      console.log(i)

      application.planningSuccess[i].planning_start = dateChange(
        application.planningSuccess[i].planning_start,
      )
      application.planningSuccess[i].planning_end = dateChange(
        application.planningSuccess[i].planning_end,
      )
    }
    console.log('승인완료', application.planningSuccess)

    // 반려 계획서들 날짜 형식 변경
    for (let i = 0; i < application.planningRejected.length; i++) {
      console.log(i)

      application.planningRejected[i].planning_start = dateChange(
        application.planningRejected[i].planning_start,
      )
      application.planningRejected[i].planning_end = dateChange(
        application.planningRejected[i].planning_end,
      )
      application.planningRejected[i].planning_reject_date = dateChange(
        application.planningRejected[i].planning_reject_date,
      )
      application.planningRejected[i].checked = false
      application.planningRejected[i].rejectChecked = false
    }
    console.log('반려', application.planningRejected)
  })
})

// 검토중 즉각으로 가져오기
watch(
  () => application.planningState,
  async () => {
    await application.countRealReview(route.params.id).then(() => {
      for (let i = 0; i < application.planningReview.length; i++) {
        console.log(i)
        application.planningReview[i].planning_start = dateChange(
          application.planningReview[i].planning_start,
        )
        application.planningReview[i].planning_end = dateChange(
          application.planningReview[i].planning_end,
        )
        application.planningReview[i].checked = false
        application.planningReview[i].rejectChecked = false
      }
      console.log('검토중: ', application.planningReview)

      // 승인완료 계획서들 날짜 형식 변경
      for (let i = 0; i < application.planningSuccess.length; i++) {
        console.log(i)

        application.planningSuccess[i].planning_start = dateChange(
          application.planningSuccess[i].planning_start,
        )
        application.planningSuccess[i].planning_end = dateChange(
          application.planningSuccess[i].planning_end,
        )
      }
      console.log('승인완료', application.planningSuccess)

      // 반려 계획서들 날짜 형식 변경
      for (let i = 0; i < application.planningRejected.length; i++) {
        console.log(i)

        application.planningRejected[i].planning_start = dateChange(
          application.planningRejected[i].planning_start,
        )
        application.planningRejected[i].planning_end = dateChange(
          application.planningRejected[i].planning_end,
        )
        application.planningRejected[i].planning_reject_date = dateChange(
          application.planningRejected[i].planning_reject_date,
        )
        application.planningRejected[i].checked = false
        application.planningRejected[i].rejectChecked = false
      }
      console.log('반려', application.planningRejected)
    })
  },
)

// 계획서들 날짜 형식 변경 함수
const dateChange = (day) => {
  let date = new Date(day)
  let realDate = `${date.getFullYear(day)}.${date.getMonth(day) + 1}.${date.getDay(day)}`
  return realDate
}
</script>
<style scoped>
.card_w-100 {
  border: 1px #000;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  background-color: beige;
  overflow: hidden;
}

.tabLeft {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  width: 50%;
  height: 100%;
}
header {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100px;
}

.tabLeft nav {
  width: 100%;
  height: 20px;
  background-color: #fff;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
header p {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
}
.tabRight {
  display: flex;
  flex-direction: column;
  width: 50%;
  min-height: 100%;
}
</style>
