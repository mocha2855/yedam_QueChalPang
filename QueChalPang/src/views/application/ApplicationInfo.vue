<script setup>
import { onBeforeMount, ref, computed, watch } from 'vue'
import { useCounterStore } from '@/stores/member'
import { useRoute } from 'vue-router'
import axios from 'axios'
import ApplicationModal from './modals/ApplicationModal.vue'

import { useApplicationStore } from '@/stores/application'
const application = useApplicationStore()
const currentStatus = computed(() => application.dependantInfo?.status ?? null)
const route = useRoute()
const appNo = route.params.id
const dependantNo = ref(0)
const status = ref('')
const member = useCounterStore().isLogIn.info
const answers = ref({})
const modifiable = ref(true)
const activeSubtitleNo = ref(null)
const originalAnswers = ref({})
const getApplicationInfo = async () => {
  let result = await axios.get('/api/applicationInfo/' + appNo)
  console.log(result)
  if (result.data.length == 0) {
    return ''
  }
  dependantNo.value = result.data[0].dependant_no
  status.value = result.data[0].status
  applicationDetail.value = result.data

  //이전 데이터 안남기 위한 초기화
  answers.value = {}
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
  // 원본 데이터 백업
  originalAnswers.value = JSON.parse(JSON.stringify(answers.value))

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
        survey_subtitle_no: row.survey_subtitle_no,
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
//structuredDetail이 변경되면 첫 번째 탭 활성화
watch(
  structuredDetail,
  (newVal) => {
    if (newVal && newVal[0]?.subtitles?.[0]) {
      activeSubtitleNo.value = newVal[0].subtitles[0].survey_subtitle_no
    }
  },
  { immediate: true },
)
const dependant = ref({})

const getDependantInfo = async () => {
  let result = await axios.get(`/api/dependantInfo/${application.dependantInfo.dependant_no}`)
  console.log(result)
  dependant.value = result.data[0]
  //dependant.value.status = status.value
}
const isNull = ref(false)
onBeforeMount(async () => {
  let result = await getApplicationInfo()
  if (result == null) {
    isNull.value = true
  }
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
        const currentAnswer = answers.value[q.survey_qitem_no] // Y/N 또는 일반 답변
        const currentReason = answers.value[q.survey_qitem_no + '_reason'] // 구체적 사유
        const currentDate = answers.value[q.survey_qitem_no + '_date'] // 날짜

        let reasonVal = null
        let dateVal = null
        let answerTypeVal = null

        const qType = q.survey_qitem_type ? q.survey_qitem_type.trim() : ''

        if (qType === '예/아니요') {
          answerTypeVal = currentAnswer // 'Y' 또는 'N'

          // need_detail이 true이고 'Y'를 선택한 경우
          if (q.need_detail && currentAnswer === 'Y') {
            reasonVal = currentReason || null
            dateVal = currentDate || null
          } else {
            // need_detail이 false거나 'N'을 선택한 경우
            reasonVal = currentAnswer === 'Y' ? 'Y' : null
            dateVal = null
          }
        } else {
          // 일반 텍스트 타입
          answerTypeVal = null
          reasonVal = currentAnswer || null
          dateVal = null
        }

        updateList.push({
          app_answer_no: q.app_answer_no, // PK
          app_reason: reasonVal,
          app_date: dateVal,
          app_answer_type: answerTypeVal,
          // [추가] INSERT 구문 오류 방지를 위한 필수 데이터 포함
          survey_qitem_no: q.survey_qitem_no,
          application_no: appNo, // 현재 페이지의 신청서 번호
        })
      })
    })
  })

  // 2. 서버 전송

  const result = await axios.put('/api/application/update', {
    updateList: updateList,
    application_no: appNo, // 현재 신청서 번호
  })
  if (result.status === 200) {
    alert('수정이 완료되었습니다.')
    // 3. 수정 모드 종료 (다시 읽기 전용으로 변경)
    modifiable.value = true
    modal.value = false
    await axios.post(`/api/applicationHistory`, {
      appNo: appNo, // 현재 신청서 번호
      id: member.member_id,
      reason: reason.value,
    })
    // 최신 데이터로 다시 새로고침 (선택사항)
    await getApplicationInfo()
  }
}
const modal = ref(false)
const reason = ref('')
const modCancel = () => {
  answers.value = JSON.parse(JSON.stringify(originalAnswers.value))
  modifiable.value = true
}
</script>

<template>
  <ApplicationModal v-if="modal">
    <template v-slot:header>
      <h4 class="modal-title">지원신청서를 수정하시겠습니까?</h4>
    </template>
    <template v-slot:body>
      <label for="reason">수정사유</label>
      <textarea
        class="form-control h-25"
        rows="5"
        placeholder="수정사유를 입력해주세요."
        id="reason"
        v-model="reason"
      ></textarea>
    </template>
    <template v-slot:footer>
      <button class="btn btn-success" @click="modifyApp">확인</button>
      <button class="btn btn-light" @click="modal == false ? (modal = true) : (modal = false)">
        취소
      </button>
    </template>
  </ApplicationModal>
  <div class="tab-content">
    <div v-if="isNull" class="card mb-3 no-shadow">
      <div class="card-header pb-0">
        <div class="d-flex justify-content-between align-items-center">
          <h5 class="mb-0">지원 신청서</h5>
          <div v-if="!['e3', 'e4', 'e5'].includes(currentStatus)">
            <button v-if="modifiable" class="btn btn-primary p-1" @click="changeModifiable">
              수정하기
            </button>
            <button
              v-if="!modifiable"
              class="btn btn-success p-1"
              @click="modal == false ? (modal = true) : (modal = false)"
            >
              수정완료
            </button>
            <button v-if="!modifiable" class="btn btn-secondary p-1 ms-1" @click="modCancel">
              수정취소
            </button>
          </div>
        </div>
      </div>

      <div class="card-body px-0 pt-0 pb-2 no-shadow">
        <div v-for="survey in structuredDetail" :key="survey.survey_no">
          <!-- 탭 네비게이션 -->
          <ul class="nav nav-tabs px-3 custom-tabs" role="tablist">
            <li
              v-for="sub in survey.subtitles"
              :key="sub.survey_subtitle_no"
              class="nav-item"
              role="presentation"
            >
              <button
                class="nav-link tab-button"
                :class="{ active: activeSubtitleNo === sub.survey_subtitle_no }"
                type="button"
                role="tab"
                @click="activeSubtitleNo = sub.survey_subtitle_no"
              >
                {{ sub.survey_subtitle }}
              </button>
            </li>
          </ul>

          <!-- 탭 컨텐츠 -->
          <div class="tab-content mt-3 no-shadow">
            <div
              v-for="sub in survey.subtitles"
              :key="sub.survey_subtitle_no"
              class="tab-pane fade no-shadow"
              :class="{
                show: activeSubtitleNo === sub.survey_subtitle_no,
                active: activeSubtitleNo === sub.survey_subtitle_no,
              }"
              role="tabpanel"
            >
              <!-- 소제목 헤더 -->
              <div class="subtitle-header">
                <h6 class="subtitle-title">{{ sub.survey_subtitle }}</h6>
                <small class="text-muted">{{ sub.survey_subtitle_detail }}</small>
              </div>

              <!-- 질문 목록 -->
              <div class="questions-wrapper">
                <div v-for="q in sub.questions" :key="q.survey_qitem_no" class="question-item">
                  <p class="question-text">Q. {{ q.survey_qitem_question }}</p>

                  <div v-if="q.survey_qitem_type === '예/아니요'">
                    <div class="radio-wrapper">
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="radio"
                          :name="'question_' + q.survey_qitem_no"
                          :id="'radio_yes_' + q.survey_qitem_no"
                          value="Y"
                          v-model="answers[q.survey_qitem_no]"
                          :disabled="modifiable"
                        />
                        <label class="form-check-label" :for="'radio_yes_' + q.survey_qitem_no">
                          예
                        </label>
                      </div>

                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="radio"
                          :name="'question_' + q.survey_qitem_no"
                          :id="'radio_no_' + q.survey_qitem_no"
                          value="N"
                          v-model="answers[q.survey_qitem_no]"
                          :disabled="modifiable"
                        />
                        <label class="form-check-label" :for="'radio_no_' + q.survey_qitem_no">
                          아니오
                        </label>
                      </div>
                    </div>

                    <div
                      v-if="q.need_detail && answers[q.survey_qitem_no] === 'Y'"
                      class="detail-inputs"
                    >
                      <div class="mb-3">
                        <label class="detail-label">구체적 사유</label>
                        <input
                          type="text"
                          class="form-control no-shadow"
                          v-model="answers[q.survey_qitem_no + '_reason']"
                          :disabled="modifiable"
                          placeholder="구체적인 사유를 입력해주세요"
                        />
                      </div>
                      <div class="mb-3">
                        <label class="detail-label">날짜</label>
                        <input
                          type="date"
                          class="form-control no-shadow"
                          v-model="answers[q.survey_qitem_no + '_date']"
                          :disabled="modifiable"
                        />
                      </div>
                    </div>
                  </div>

                  <div v-else>
                    <input
                      type="text"
                      class="form-control no-shadow"
                      v-model="answers[q.survey_qitem_no]"
                      :disabled="true"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="!isNull" class="card mb-3 no-shadow">
      <h5 class="mb-0">지원 신청서</h5>
      <div class="text-center">
        <h5 class="p-5 mt-5 mb-5">지원신청서의 답변이 <br />작성되지 않았습니다.</h5>
      </div>
    </div>
  </div>
</template>

<style scoped>
.no-shadow {
  box-shadow: none !important;
}

.modal-title {
  text-align: center;
}

.custom-tabs {
  border-bottom: 1px solid #dee2e6;
  box-shadow: none !important;
}

.tab-button {
  padding: 6px 12px;
  font-size: 13px;
  box-shadow: none !important;
  border: 1px solid #dee2e6;
  border-bottom: none;
}

.subtitle-header {
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 20px;
  padding: 12px 16px;
}

.subtitle-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.questions-wrapper {
  padding: 0 16px;
}

.question-item {
  padding: 20px 0;
  border-bottom: 1px solid #e9ecef;
}

.question-text {
  margin-bottom: 12px;
  font-weight: 600;
  font-size: 15px;
}

.radio-wrapper {
  display: flex;
  gap: 30px;
  margin-bottom: 15px;
}

.detail-inputs {
  margin-top: 15px;
}

.detail-label {
  font-size: 13px;
  font-weight: 600;
  display: block;
  margin-bottom: 8px;
}
</style>
