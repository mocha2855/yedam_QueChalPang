<script setup>
import { onBeforeMount, ref, computed } from 'vue'
import { useCounterStore } from '@/stores/member'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const appNo = route.params.id
const dependantNo = ref(0)
const status = ref('')
const member = useCounterStore().isLogIn.info
const answers = ref({})
const getApplicationInfo = async () => {
  let result = await axios.get('/api/applicationInfo/' + appNo)
  console.log(result.data)
  dependantNo.value = result.data[0].dependant_no
  status.value = result.data[0].status
  applicationDetail.value = result.data
  result.data.forEach((row) => {
    if (row.app_reason) {
      answers.value[row.survey_qitem_no] = row.app_reason
    }

    if (row.app_date) {
      answers.value[row.survey_qitem_no + '_date'] = row.app_date
    }
  })
  console.log(answers.value)
  console.log(member)
}
const applicationDetail = ref([]) // 서버에서 받은 원본 데이터 저장

const structuredDetail = computed(() => {
  const surveyMap = {}

  applicationDetail.value.forEach((row) => {
    // 1. 설문지 수준
    if (!surveyMap[row.survey_no]) {
      surveyMap[row.survey_no] = {
        survey_title: row.survey_title,
        survey_version: row.survey_version,
        subtitles: {},
      }
    }

    const survey = surveyMap[row.survey_no]

    // 2. 소제목 수준
    if (!survey.subtitles[row.survey_subtitle_no]) {
      survey.subtitles[row.survey_subtitle_no] = {
        survey_subtitle: row.survey_subtitle,
        survey_subtitle_detail: row.survey_subtitle_detail,
        questions: [],
      }
    }

    // 3. 질문 및 답변 수준 (핵심 데이터 포함)
    survey.subtitles[row.survey_subtitle_no].questions.push({
      survey_qitem_no: row.survey_qitem_no,
      survey_qitem_question: row.survey_qitem_question,
      survey_qitem_type: row.survey_qitem_type,
      // DB에서 가져온 실제 답변들
      app_answer_type: row.app_answer_type,
      app_date: row.app_date,
      app_reason: row.app_reason,
    })
  })

  return Object.values(surveyMap).map((s) => ({
    ...s,
    subtitles: Object.values(s.subtitles),
  }))
})
const dependant = ref({})

const getDependantInfo = async () => {
  let result = await axios.get(`/api/dependantInfo/${dependantNo.value}`)
  console.log(result)
  dependant.value = result.data[0]
  dependant.value.status = status.value
}

onBeforeMount(async () => {
  await getApplicationInfo()
  await getDependantInfo()
})
// const returnStatus = (stat) => {
//   if (stat == 'e1') {
//     return '대기'
//   } else if (stat == 'e2') {
//     return '검토중'
//   } else if (stat == 'e3') {
//     return '계획'
//   } else if (stat == 'e4') {
//     return '중점'
//   } else if (stat == 'e5') {
//     return '긴급'
//   }
// }
// const changeDateFormat = (input) => {
//   let date = new Date(input)
//   let result = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
//   return result
// }
// const returnGender = (input) => {
//   console.log(input)
//   if (input == 'g1') {
//     return '남'
//   } else {
//     return '여'
//   }
// }
</script>

<template>
  <div class="card mb-3">
    <div class="card-header pb-0">
      <div class="d-flex justify-content-between align-items-center">
        <h6 class="mb-0">지원 신청서</h6>
        <button class="btn btn-primary p-1">상담신청</button>
      </div>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="row" v-for="(survey, surveyIdx) in structuredDetail" :key="survey.survey_no">
        <div class="col-12 px-4">
          <h6 class="mb-3">{{ survey.survey_title }} (v{{ survey.survey_version }})</h6>

          <!-- 탭 헤더 -->
          <ul class="nav nav-tabs nav-tabs-compact" :id="'surveyTab-' + surveyIdx" role="tablist">
            <li
              class="nav-item"
              v-for="(sub, subIdx) in survey.subtitles"
              :key="sub.survey_subtitle_no"
              role="presentation"
            >
              <button
                class="nav-link"
                :class="{ active: subIdx === 0 }"
                :id="'tab-' + surveyIdx + '-' + subIdx"
                data-bs-toggle="tab"
                :data-bs-target="'#content-' + surveyIdx + '-' + subIdx"
                type="button"
                role="tab"
              >
                {{ sub.survey_subtitle }}
              </button>
            </li>
          </ul>

          <!-- 탭 내용 -->
          <div class="tab-content" :id="'surveyTabContent-' + surveyIdx">
            <div
              class="tab-pane fade"
              :class="{ 'show active': subIdx === 0 }"
              :id="'content-' + surveyIdx + '-' + subIdx"
              v-for="(sub, subIdx) in survey.subtitles"
              :key="sub.survey_subtitle_no"
              role="tabpanel"
            >
              <div class="p-4">
                <!-- 소제목 설명 -->
                <p class="text-sm text-muted mb-4">{{ sub.survey_subtitle_detail }}</p>

                <!-- 질문 목록 -->
                <ul class="list-unstyled">
                  <li v-for="q in sub.questions" :key="q.survey_qitem_no" class="mb-4">
                    <p class="mb-2 fw-bold">Q. {{ q.survey_qitem_question }}</p>

                    <div v-if="q.survey_qitem_type === '예/아니요'">
                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="radio"
                          :name="'question_' + q.survey_qitem_no"
                          :id="'radio_yes_' + q.survey_qitem_no"
                          value="Y"
                          v-model="answers[q.survey_qitem_no]"
                          :disabled="true"
                        />
                        <label class="form-check-label" :for="'radio_yes_' + q.survey_qitem_no"
                          >예</label
                        >
                      </div>

                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="radio"
                          :name="'question_' + q.survey_qitem_no"
                          :id="'radio_no_' + q.survey_qitem_no"
                          value="N"
                          v-model="answers[q.survey_qitem_no]"
                          :disabled="true"
                        />
                        <label class="form-check-label" :for="'radio_no_' + q.survey_qitem_no"
                          >아니오</label
                        >
                      </div>
                    </div>

                    <div v-else>
                      <input
                        type="text"
                        class="form-control"
                        v-model="answers[q.survey_qitem_no]"
                        :disabled="true"
                      />
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav-tabs-compact {
  flex-wrap: nowrap;
}

.nav-tabs-compact .nav-link {
  padding: 6px 10px;
  font-size: 13px;
  white-space: nowrap;
}
</style>
