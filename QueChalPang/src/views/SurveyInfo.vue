<template>
  <!--조사지등록-->
  <div class="container">
    <div class="d-flex justify-content-between">
      <h6>조사지 상세</h6>
      <button class="btn btn-sm btn-secondary" @click="goBack">목록으로</button>
    </div>
    <table class="table">
      <tbody>
        <tr>
          <th class="text-right">No</th>
          <td class="text-center">
            <input class="form-control" type="text" v-model="surveyInfo.no" readonly="" />
          </td>
        </tr>
        <tr>
          <th class="text-right">항목</th>
          <td class="text-center">
            <input class="form-control" type="text" v-model="surveyInfo.title" readonly="" />
          </td>
        </tr>

        <tr>
          <th class="text-right">세부항목</th>
          <td class="text-center">
            <!-- 세부항목들 반복 -->
            <div
              v-for="(subtitle, sIndex) in surveyInfo.subtitles"
              :key="subtitle.survey_subtitle_no"
            >
              <h4>세부항목 {{ sIndex + 1 }}</h4>

              <!-- 세부항목 -->
              <label>세부항목</label>
              <textarea class="form-control" v-model="subtitle.survey_subtitle" readonly></textarea>

              <!-- 세부항목 설명 -->
              <label>세부항목 설명</label>
              <input class="form-control" v-model="subtitle.survey_subtitle_detail" readonly />

              <hr />

              <!-- 질문들 -->
              <h5>질문 목록</h5>
              <div
                v-for="(question, qIndex) in subtitle.questionList"
                :key="question.survey_qitem_no"
              >
                <strong>질문 {{ qIndex + 1 }}</strong>

                <input
                  class="form-control"
                  v-model="question.survey_qitem_question"
                  readonly
                  style="margin-top: 5px"
                />

                <input
                  class="form-control"
                  v-model="question.survey_qitem_type"
                  readonly
                  style="margin-top: 5px"
                />
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div>
      <button class="btn btn-primary" @click="goTosurveyUpdate(surveyInfo.no)">수정</button>
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
  subtitles: [],
})

onMounted(async () => {
  await store.fetchSurveyDetail(route.params.no)
  const data = store.surveyDetail
  if (data) {
    surveyInfo.no = data.survey_no || ''
    surveyInfo.title = data.survey_title || ''
    surveyInfo.subtitles = data.subtitles || []
  }
  console.log(surveyInfo)
})

const goBack = () => {
  router.push({ name: 'SurveyList' })
}

const goTosurveyUpdate = () => {
  router.push({
    name: 'surveyUpdate',
    params: { no: surveyInfo.no },
  })
}
</script>
