<script setup>
import { onBeforeMount, ref, computed } from 'vue'
import { useCounterStore } from '@/stores/member'
import { useRoute } from 'vue-router'
import axios from 'axios'
// import ApplicationModal from './modals/ApplicationModal.vue'

const route = useRoute()
const appNo = route.params.id
const dependantNo = ref(0)
const status = ref('')
const member = useCounterStore().isLogIn.info
const answers = ref({})
const modifiable = ref(true)
const getApplicationInfo = async () => {
  let result = await axios.get('/api/applicationInfo/' + appNo)
  // console.log(result.data)
  dependantNo.value = result.data[0].dependant_no
  status.value = result.data[0].status
  applicationDetail.value = result.data

  result.data.forEach((row) => {
    // 예/아니요는 app_answer_type 사용
    if (row.app_answer_type) {
      answers.value[row.survey_qitem_no] = row.app_answer_type // 'Y' 또는 'N'

      // 구체적 사유가 있으면 별도 저장
      if (row.app_reason && row.app_reason !== 'Y') {
        answers.value[row.survey_qitem_no + '_reason'] = row.app_reason
      }
    } else if (row.app_reason) {
      answers.value[row.survey_qitem_no] = row.app_reason
    }

    if (row.app_date) {
      const dateStr = row.app_date.split('T')[0]
      answers.value[row.survey_qitem_no + '_date'] = dateStr
    }
  })

  console.log(answers.value)
  console.log(member)
  console.log(JSON.stringify(answers.value, null, 2))
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
      need_detail: row.need_detail,
      // DB에서 가져온 실제 답변들
      app_answer_no: row.app_answer_no,
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

const changeModifiable = () => {
  modifiable.value = false
}
const modifyApp = async () => {
  // 1. 서버로 보낼 수정 데이터 리스트 생성
  const updateList = []

  // 구조화된 데이터를 순회하며 현재 입력된 값(answers)을 수집
  structuredDetail.value.forEach((survey) => {
    survey.subtitles.forEach((sub) => {
      sub.questions.forEach((q) => {
        const currentReason = answers.value[q.survey_qitem_no]
        const currentDate = answers.value[q.survey_qitem_no + '_date']

        let reasonVal = currentReason // (간소화)
        let dateVal = null

        // 날짜/복합 타입 처리 로직 (이전과 동일하게 유지하거나 아래처럼 간소화 가능)
        if (q.survey_qitem_type && q.survey_qitem_type.includes('date')) {
          dateVal = currentDate || null
          reasonVal = currentReason || null
        } else {
          dateVal = null
          reasonVal = currentReason
        }

        updateList.push({
          app_answer_no: q.app_answer_no, // PK
          app_reason: reasonVal,
          app_date: dateVal,

          // [추가] INSERT 구문 오류 방지를 위한 필수 데이터 포함
          survey_qitem_no: q.survey_qitem_no,
          application_no: appNo, // 현재 페이지의 신청서 번호
        })
      })
    })
  })

  // 2. 서버 전송
  try {
    const result = await axios.put('/api/application/update', {
      updateList: updateList,
      application_no: appNo, // 현재 신청서 번호
    })

    if (result.status === 200) {
      alert('수정이 완료되었습니다.')
      // 3. 수정 모드 종료 (다시 읽기 전용으로 변경)
      modifiable.value = true

      // 최신 데이터로 다시 새로고침 (선택사항)
      await getApplicationInfo()
    }
  } catch (error) {
    console.error(error)
    alert('수정 중 오류가 발생했습니다.')
  }
}
const modal = ref(false)
</script>

<template>
  <div class="card mb-3">
    <div class="card-header pb-0">
      <div class="d-flex justify-content-between align-items-center">
        <h6 class="mb-0">지원 신청서</h6>
        <button @click="modal == false ? (modal = true) : (modal = false)">모달</button>
        <button v-if="modifiable" class="btn btn-primary p-1" @click="changeModifiable">
          수정하기
        </button>
        <button v-if="!modifiable" class="btn btn-primary p-1" @click="modifyApp">수정완료</button>
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
                          :disabled="modifiable"
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
                          :disabled="modifiable"
                        />
                        <label class="form-check-label" :for="'radio_no_' + q.survey_qitem_no"
                          >아니오</label
                        >
                      </div>

                      <div v-if="q.need_detail && answers[q.survey_qitem_no] === 'Y'" class="mt-3">
                        <div class="mb-3">
                          <small class="text-muted fw-bold">구체적 사유</small>
                          <input
                            type="text"
                            class="form-control"
                            v-model="answers[q.survey_qitem_no + '_reason']"
                            :disabled="modifiable"
                            placeholder="구체적인 사유를 입력해주세요"
                            style="display: block !important; height: 40px !important"
                          />
                        </div>
                        <div class="mb-3">
                          <small class="text-muted fw-bold">날짜</small>
                          <input
                            type="date"
                            class="form-control"
                            v-model="answers[q.survey_qitem_no + '_date']"
                            :disabled="modifiable"
                            style="display: block !important; height: 40px !important"
                          />
                        </div>
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
