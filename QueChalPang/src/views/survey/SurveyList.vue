<script setup>
//survey이 active 한 건만 목록조회
import { useSurveyStore } from '@/stores/survey'
import { useCounterStore } from '@/stores/member'
import { useRouter } from 'vue-router'
import { computed, onMounted } from 'vue'

const store = useSurveyStore()
const member = useCounterStore()
const router = useRouter()

const surveyList = computed(() => store.survey)

onMounted(async () => {
  if (member.isLogIn.info.member_authority != 'a4') {
    alert('시스템 관리자만 접근할 수 있습니다.')
    router.push({ name: 'Dashboard' })
    return
  }
  store.fetchSurvey()
})

function surveyInfo(no) {
  router.push({ name: 'surveyInfo', params: { no: no } })
}

const surveyUpdate = (no) => {
  router.push({ name: 'surveyUpdate', params: { no: no } })
}

const goTosurveyAdd = () => {
  router.push({ name: 'surveyAdd' })
}
</script>

<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <!-- 헤더 -->
          <div class="card-header d-flex justify-content-between align-items-center pb-0">
            <h6 class="mb-0">지원서 목록</h6>
            <button class="btn btn-primary btn-sm" @click="goTosurveyAdd">
              <i class="fas fa-plus"></i> 항목추가
            </button>
          </div>

          <!-- 테이블 -->
          <div class="card-body px-0 pt-0 pb-2">
            <div class="table-responsive p-0">
              <table class="table align-items-center mb-0">
                <thead>
                  <tr>
                    <th
                      class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-3"
                    >
                      번호
                    </th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                      제목
                    </th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                      버전
                    </th>
                    <th
                      class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                    >
                      관리
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="survey in surveyList" :key="survey.survey_no">
                    <td class="ps-3">
                      <p class="text-sm font-weight-bold mb-0">{{ survey.survey_no }}</p>
                    </td>
                    <td>
                      <p class="text-sm mb-0">{{ survey.survey_title }}</p>
                    </td>
                    <td>
                      <p class="text-sm mb-0">{{ survey.survey_version }}</p>
                    </td>
                    <td class="text-center">
                      <button
                        class="btn btn-sm btn-outline-info me-2"
                        @click="surveyInfo(survey.survey_no)"
                      >
                        상세보기
                      </button>
                      <button
                        class="btn btn-sm btn-outline-secondary"
                        @click="surveyUpdate(survey.survey_no)"
                      >
                        수정하기
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- 데이터 없을 때 -->
              <div v-if="!surveyList || surveyList.length === 0" class="text-center py-5">
                <p class="text-muted mb-3">등록된 조사지가 없습니다.</p>
                <button class="btn btn-sm btn-primary" @click="goTosurveyAdd">
                  <i class="fas fa-plus"></i> 항목추가
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}
</style>
