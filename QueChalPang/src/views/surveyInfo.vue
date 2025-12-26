<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header pb-0">
            <div class="d-flex justify-content-between">
              <h6>설문지 상세</h6>
              <button class="btn btn-sm btn-secondary" @click="goBack">목록으로</button>
            </div>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table">
                <tbody>
                  <tr>
                    <th class="text-right">번호</th>
                    <td class="text-center">{{ surveyInfo.no }}</td>
                  </tr>
                  <tr>
                    <th class="text-right">항목</th>
                    <td class="text-center">{{ surveyInfo.title }}</td>
                  </tr>
                  <tr>
                    <th class="text-right">세부항목</th>
                    <td class="text-center">{{ surveyInfo.subtitle }}</td>
                  </tr>
                  <tr>
                    <th class="text-right">세부항목설명</th>
                    <td class="text-center">{{ surveyInfo.subtitleDetail }}</td>
                  </tr>
                  <tr>
                    <th class="text-right">질문</th>
                    <td class="text-center">
                      <div v-for="q in store.questionList" :key="q.survey_qitem_no">
                        {{ q.survey_qitem_question }}({{ q.survey_qitem_type }})
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div>
                <button class="btn btn-primary" @click="goTosurveyUpdate">수정</button>
              </div>
              <hr />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSurveyStore } from '@/stores/survey'

const route = useRoute()
const router = useRouter()
const store = useSurveyStore()

defineProps({
  no: [Number, String],
})

const surveyInfo = reactive({
  no: '',
  title: '',
  subtitle: '',
  subtitleDetail: '',
})

onMounted(async () => {
  await store.fetchSurveyDetail(route.params.no)
  const data = store.surveyDetail
  if (data) {
    console.log(data)
    surveyInfo.no = data[0].survey_no || ''
    surveyInfo.title = data[0].survey_title || ''
    surveyInfo.subtitle = data[0].survey_subtitle || ''
    surveyInfo.subtitleDetail = data[0].survey_subtitle_detail || ''
  }
})

const goBack = () => {
  router.push({ name: 'SurveyList' })
}
</script>
