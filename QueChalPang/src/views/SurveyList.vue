<script setup>
//survey이 active 한 건만 목록조회
import { useSurveyStore } from '@/stores/survey'
import { useRouter } from 'vue-router'
import { computed, onMounted } from 'vue'

const store = useSurveyStore()
const router = useRouter()

const surveyList = computed(() => store.survey)

onMounted(async () => {
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
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header pb-0">
            <h6>설문지 목록</h6>
            <button class="btn btn-primary" @click="goTosurveyAdd">항목추가</button>
          </div>
          <div class="card-body px-0 pt-0 pb-2">
            <div class="table-responsive p-0">
              <table class="table align-items-center mb-0">
                <thead>
                  <tr>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder">번호</th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder">제목</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="survey in surveyList" :key="survey.survey_no">
                    <td class="text-sm">{{ survey.survey_no }}</td>
                    <td class="text-sm">{{ survey.survey_title }}</td>
                    <td class="text-sm">{{ survey.survey_subtitle }}</td>
                    <td class="text-sm">{{ survey.survey_qitem }}</td>

                    <td>
                      <button class="btn btn-sm btn-info" @click="surveyInfo(survey.survey_no)">
                        상세보기
                      </button>
                      <button class="btn btn-sm btn-info" @click="surveyUpdate(survey.survey_no)">
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
