<script setup>
import { onBeforeMount, ref, computed, watch } from 'vue'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'
import { useCounterStore } from '@/stores/member'
import axios from 'axios'
const router = useRouter()
const member = useCounterStore().isLogIn.info
const surveyList = ref([])
const activeSubtitleNo = ref(null)
const getApplicationList = async () => {
  let result = await axios.get(`/api/allsurveys`)
  surveyList.value = result.data
}

const qitemNo = ref([])
const collectQitemNo = (no) => {
  qitemNo.value.push(no)
}
const structuredSurvey = computed(() => {
  const surveyMap = {}

  surveyList.value.forEach((row) => {
    if (!surveyMap[row.survey_no]) {
      surveyMap[row.survey_no] = {
        survey_no: row.survey_no,
        survey_version: row.survey_version,
        survey_title: row.survey_title,
        survey_start: row.survey_start,
        survey_end: row.survey_end,
        _subtitlesMap: {},
      }
    }

    const survey = surveyMap[row.survey_no]

    if (!survey._subtitlesMap[row.survey_subtitle_no]) {
      survey._subtitlesMap[row.survey_subtitle_no] = {
        survey_subtitle_no: row.survey_subtitle_no,
        survey_subtitle: row.survey_subtitle,
        survey_subtitle_detail: row.survey_subtitle_detail,
        questions: [],
      }
    }
    collectQitemNo(row.survey_qitem_no)
    survey._subtitlesMap[row.survey_subtitle_no].questions.push({
      survey_qitem_no: row.survey_qitem_no,
      survey_qitem_question: row.survey_qitem_question,
      survey_qitem_type: row.survey_qitem_type,
      needDetail: row.need_detail || false,
    })
  })

  return Object.values(surveyMap).map((survey) => {
    const subtitles = Object.values(survey._subtitlesMap)
    delete survey._subtitlesMap

    return {
      ...survey,
      subtitles: subtitles,
    }
  })
})
// 첫 번째 탭 자동 활성화
watch(
  structuredSurvey,
  (newVal) => {
    if (newVal && newVal[0]?.subtitles?.[0]) {
      activeSubtitleNo.value = newVal[0].subtitles[0].survey_subtitle_no
    }
  },
  { immediate: true },
)

const dependants = ref([])
const selectedDependant = ref({})
const selectedOption = ref(0)
const getDependants = async () => {
  let result = await axios.get(`/api/dependant/${member.member_id}/${member.member_authority}`)
  dependants.value = result.data
  selectedOption.value = dependants.value[0].dependant_no
  selectOption()
}
const selectOption = () => {
  selectedOption.value
  console.log(selectedOption.value)
  dependants.value.forEach((val) => {
    if (val.dependant_no == selectedOption.value) {
      selectedDependant.value = val
    }
  })
  console.log(selectedDependant.value)
}
onBeforeMount(() => {
  getApplicationList()
  getDependants()
})
const returnStatus = (stat) => {
  if (stat == 'e1') {
    return '대기'
  } else if (stat == 'e2') {
    return '검토중'
  } else if (stat == 'e3') {
    return '계획'
  } else if (stat == 'e4') {
    return '중점'
  } else if (stat == 'e5') {
    return '긴급'
  }
}
const changeDateFormat = (input) => {
  let date = new Date(input)
  let result = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
  return result
}
const returnGender = (input) => {
  console.log(input)
  if (input == 'g1') {
    return '남'
  } else {
    return '여'
  }
}
const checkAllYes = () => {
  // structuredSurvey는 computed 속성이므로 .value로 접근
  if (!structuredSurvey.value) return

  structuredSurvey.value.forEach((survey) => {
    survey.subtitles.forEach((sub) => {
      sub.questions.forEach((q) => {
        // [수정 핵심] 템플릿의 v-if 조건과 동일한 문자열('예/아니요')로 비교해야 합니다.
        // 혹시 모를 공백 제거를 위해 trim()을 사용합니다.
        if (q.survey_qitem_type && q.survey_qitem_type.trim() === '예/아니요') {
          answers.value[q.survey_qitem_no] = {
            type: 'Y',
            reason: q.needDetail ? '' : 'Y',
            date: '',
          }
        }
      })
    })
  })
}
const answers = ref({})
const getAnswer = (qitemNo, qType) => {
  if (!answers.value[qitemNo]) {
    // 예/아니요 타입만 객체로 초기화
    if (qType === '예/아니요') {
      answers.value[qitemNo] = { type: '', reason: '', date: '' }
    } else {
      answers.value[qitemNo] = ''
    }
  }
  return answers.value[qitemNo]
}
const addApplication = async () => {
  // 답변 체크
  let hasEmpty = false

  structuredSurvey.value.forEach((survey) => {
    survey.subtitles.forEach((sub) => {
      sub.questions.forEach((q) => {
        const answer = answers.value[q.survey_qitem_no]
        const qType = q.survey_qitem_type?.trim()

        // 답변 없음
        if (!answer) {
          hasEmpty = true
          return
        }

        // 예/아니요 타입 체크
        if (qType === '예/아니요') {
          if (!answer.type) {
            hasEmpty = true
            return
          }
          // 구체적 사유 필요한 경우
          if (q.needDetail && answer.type === 'Y') {
            if (!answer.reason?.trim() || !answer.date?.trim()) {
              hasEmpty = true
              return
            }
          }
        } else {
          // 일반 텍스트
          if (!answer.trim?.() && !answer) {
            hasEmpty = true
            return
          }
        }
      })
    })
  })

  if (hasEmpty) {
    await Swal.fire({
      icon: 'warning',
      title: '모든 질문에 답변해주세요',
      confirmButtonText: '확인',
    })
    return
  }
  let answerList = []

  if (structuredSurvey.value) {
    structuredSurvey.value.forEach((survey) => {
      survey.subtitles.forEach((sub) => {
        sub.questions.forEach((q) => {
          const mainVal = answers.value[q.survey_qitem_no]

          const dateVal = answers.value[q.survey_qitem_no + '_date']

          if (mainVal || dateVal) {
            let finalAppDate = null
            let finalAppReason = null
            let finalAppAnswerType = null
            const qType = q.survey_qitem_type ? q.survey_qitem_type.trim() : ''

            if (qType === '예/아니요') {
              // mainVal이 객체인지 확인
              if (typeof mainVal === 'object') {
                // 객체 구조
                finalAppAnswerType = mainVal.type // 'Y' 또는 'N' 추출
                // reason이 있으면 그대로, 없으면 'Y'선택 시 'Y', 'N'선택 시 null
                finalAppReason = mainVal.reason || (mainVal.type === 'Y' ? 'Y' : null)
                finalAppDate = mainVal.date || null
              } else {
                finalAppAnswerType = mainVal // 'Y' 또는 'N' 그대로
                // 'Y'면 'Y' 저장, 'N'이면 null
                finalAppReason = mainVal === 'Y' ? 'Y' : null
              }
            } else if (qType === 'input_date') {
              // 실제 DB 타입명으로 수정!
              finalAppDate = dateVal || null // '_date' 키에서 가져온 값
              finalAppReason = mainVal || null // 그냥 키에서 가져온 값
            } else if (qType === 'date') {
              finalAppDate = mainVal // 날짜 input이 mainVal에 바인딩됨
              finalAppReason = null
            } else {
              finalAppDate = null
              finalAppReason = mainVal
            }

            answerList.push({
              survey_qitem_no: q.survey_qitem_no,
              question_type: qType,
              app_answer_type: finalAppAnswerType,
              app_date: finalAppDate,
              app_reason: finalAppReason,
            })
          }
        })
      })
    })
  }

  let input = {
    answerList: answerList,
    dependant_no: selectedOption.value,
    survey_no: structuredSurvey.value[0].survey_no,
  }

  try {
    let result = await axios.post(
      `/api/addApplicationById/${member.member_id}/${member.member_authority}`,
      input,
    )
    console.log(result)
    await Swal.fire({
      icon: 'success',
      title: '신청서가 등록되었습니다!',
      showConfirmButton: false,
      timer: 1500,
    })
    router.push({ path: supportRoute.value })
  } catch (error) {
    console.error(error)
    await Swal.fire({
      icon: 'error',
      title: '등록 중 오류가 발생했습니다',
      confirmButtonText: '확인',
    })
  }
}
const supportRoute = computed(() => {
  const auth = member.member_authority
  switch (auth) {
    case 'a1':
      return '/tables'
    case 'a2':
      return '/tablesManager'
    case 'a3':
      return '/tablesAdmin'
    case 'a4':
      return '/tablesAdmin'
    default:
      return '/'
  }
})
</script>

<template>
  <div class="card mb-1 no-shadow">
    <div class="card-header pb-0">
      <div class="d-flex justify-content-between align-items-center">
        <h6 class="mb-0">지원자 정보</h6>
      </div>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <tr>
            <th class="text-uppercase text-primary text-sm font-weight-bolder opacity-7 ps-2">
              지원자
            </th>
            <td class="align-middle text-center text-sm">
              <select
                class="form-select"
                name="dependant"
                id="dependant"
                @change="selectOption()"
                v-model="selectedOption"
              >
                <option
                  v-for="dependant of dependants"
                  :key="dependant.dependant_no"
                  :value="dependant.dependant_no"
                >
                  {{ dependant.dependant_name }}
                </option>
              </select>
            </td>
            <th class="text-uppercase text-primary text-sm font-weight-bolder opacity-7 ps-2">
              보호자
            </th>
            <td class="align-middle text-center text-sm">{{ selectedDependant.member_name }}</td>
            <th class="text-uppercase text-primary text-sm font-weight-bolder opacity-7 ps-2">
              대기단계
            </th>
            <td class="align-middle text-center text-sm">
              {{ returnStatus(selectedDependant.status) }}
            </td>
          </tr>
          <tr>
            <th class="text-uppercase text-primary text-sm font-weight-bolder opacity-7 ps-2">
              성별
            </th>
            <td class="align-middle text-center text-sm">
              {{ returnGender(selectedDependant.dependant_gender) }}
            </td>
            <th class="text-uppercase text-primary text-sm font-weight-bolder opacity-7 ps-2">
              생일
            </th>
            <td class="align-middle text-center text-sm">
              {{ changeDateFormat(selectedDependant.dependant_birth) }}
            </td>
            <th class="text-uppercase text-primary text-sm font-weight-bolder opacity-7 ps-2">
              장애유형
            </th>
            <td class="align-middle text-center text-sm">
              {{ selectedDependant.disability_name }}
            </td>
          </tr>
        </table>
      </div>
    </div>

    <!-- 지원 신청서를 같은 카드 안에 포함 -->
    <div class="card-header pb-0 pt-3" style="border-top: 2px solid #e9ecef">
      <div class="d-flex justify-content-between align-items-center">
        <h6 class="mb-0">지원 신청서</h6>
        <button class="btn btn-primary p-1" style="display: none" @click="checkAllYes()">
          전체 예 체크
        </button>
      </div>
    </div>

    <div class="card-body px-0 pt-0 pb-2 no-shadow">
      <div v-for="survey in structuredSurvey" :key="survey.survey_no">
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
                        v-model="getAnswer(q.survey_qitem_no, q.survey_qitem_type).type"
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
                        v-model="getAnswer(q.survey_qitem_no, q.survey_qitem_type).type"
                      />
                      <label class="form-check-label" :for="'radio_no_' + q.survey_qitem_no">
                        아니오
                      </label>
                    </div>
                  </div>

                  <div
                    v-if="
                      q.needDetail &&
                      getAnswer(q.survey_qitem_no, q.survey_qitem_type)?.type === 'Y'
                    "
                    class="detail-inputs"
                  >
                    <div class="detail-input-group">
                      <label class="detail-label">구체적 사유</label>
                      <input
                        type="text"
                        class="form-control no-shadow"
                        v-model="getAnswer(q.survey_qitem_no, q.survey_qitem_type).reason"
                        placeholder="구체적인 사유를 입력해주세요"
                      />
                    </div>
                    <div class="detail-input-group">
                      <label class="detail-label">날짜</label>
                      <input
                        type="date"
                        class="form-control no-shadow"
                        v-model="getAnswer(q.survey_qitem_no, q.survey_qitem_type).date"
                      />
                    </div>
                  </div>
                </div>

                <div v-else>
                  <input
                    type="text"
                    class="form-control no-shadow"
                    v-model="getAnswer[(q.survey_qitem_no, q.survey_qitem_type)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 등록 버튼 -->
        <div class="d-flex justify-content-center mt-4 mb-3">
          <button class="btn bg-gradient-primary px-5" @click="addApplication()">등록</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.no-shadow {
  box-shadow: none !important;
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
  margin: 10px;
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
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-label {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 0;
}
</style>
