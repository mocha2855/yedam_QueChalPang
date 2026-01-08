<script setup>
import { onBeforeMount, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCounterStore } from '@/stores/member'
import axios from 'axios'
const router = useRouter()
const member = useCounterStore().isLogIn.info
const surveyList = ref([])
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
  if (Object.keys(answers.value).length != qitemNo.value.length) {
    alert('신청서 작성이 완료되지 않았습니다. 모든 질문지에 대해 답변을 모두 입력해주세요.')
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
    alert('신청서가 등록되었습니다.')
    router.push({ path: supportRoute.value })
  } catch (error) {
    console.error(error)
    alert('등록 중 오류가 발생했습니다.')
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
  <div class="card mb-1">
    <div class="card-header pb-0">
      <div class="d-flex justify-content-between align-items-center">
        <h6 class="mb-0">지원자 정보</h6>
      </div>
    </div>
    <!-- <div class="card mb-3">
      <div class="card-body row row-cols-3">
        <div class="fs-5 col" :value="selectedDependant.dependant_no">
          <span class="fs-5">지원자: </span>
          <span class="fw-bold fs-5">{{ selectedDependant.dependant_name }}</span>
        </div>
        <div class="fs-5 col" :value="selectedDependant.dependant_name">
          <span class="fs-5">보호자: </span>
          <span class="fw-bold fs-5">{{ selectedDependant.member_name }}</span>
        </div>
        <div class="fs-5 col" :value="returnStatus(selectedDependant.status)">
          <span class="fs-5">대기단계: </span>
          <span class="fw-bold fs-5">{{ returnStatus(selectedDependant.status) }}</span>
        </div>
        <div class="fs-5 col" :value="selectedDependant.despendant_gender">
          <span class="fs-5">성별: </span>
          <span class="fw-bold fs-5">{{ selectedDependant.despendant_gender }}</span>
        </div>
        <div class="fs-5 col" :value="selectedDependant.dependant_birth">
          <span class="fs-5">생일: </span>
          <span class="fw-bold fs-5">{{ selectedDependant.dependant_birth }}</span>
        </div>
        <div class="fs-5 col" :value="selectedDependant.disability_name">
          <span class="fs-5">장애유형: </span>
          <span class="fw-bold fs-5">{{ selectedDependant.disability_name }}</span>
        </div>
      </div>
    </div> -->
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
  </div>
  <div class="card">
    <div class="card-header pb-0">
      <div class="d-flex justify-content-between align-items-center">
        <h6 class="mb-0">지원 신청서</h6>
        <button class="btn btn-primary p-1" @click="checkAllYes()">전체 예 체크</button>
      </div>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="row" v-for="survey in structuredSurvey" :key="survey.survey_no">
        <div class="col-1"></div>
        <div class="col-11">
          <h6>{{ survey.survey_title }} (v{{ survey.survey_version }})</h6>
        </div>

        <div v-for="sub in survey.subtitles" :key="sub.survey_subtitle_no" class="row mb-4">
          <div class="col-12">
            <label style="padding-left: 1%" class="text-lg">{{ sub.survey_subtitle }}</label>
            <p style="padding-left: 2%" class="text-xs text-gray">
              {{ sub.survey_subtitle_detail }}
            </p>
          </div>

          <ul>
            <li
              v-for="q in sub.questions"
              :key="q.survey_qitem_no"
              class="mb-3 list-unstyled"
              style="padding-left: 1%"
            >
              <p class="mb-1 fw-bold">Q. {{ q.survey_qitem_question }}</p>

              <div v-if="q.survey_qitem_type === '예/아니요'">
                <div class="form-check form-check-inline">
                  <input
                    class="form-check-input"
                    type="radio"
                    :name="'question_' + q.survey_qitem_no"
                    :id="'radio_yes_' + q.survey_qitem_no"
                    value="Y"
                    v-model="getAnswer(q.survey_qitem_no, q.survey_qitem_type).type"
                  />
                  <label class="form-check-label" :for="'radio_yes_' + q.survey_qitem_no">예</label>
                </div>

                <div class="form-check form-check-inline">
                  <input
                    class="form-check-input"
                    type="radio"
                    :name="'question_' + q.survey_qitem_no"
                    :id="'radio_no_' + q.survey_qitem_no"
                    value="N"
                    v-model="getAnswer(q.survey_qitem_no, q.survey_qitem_type).type"
                  />
                  <label class="form-check-label" :for="'radio_no_' + q.survey_qitem_no"
                    >아니오</label
                  >
                </div>

                <div
                  v-if="
                    q.needDetail && getAnswer(q.survey_qitem_no, q.survey_qitem_type)?.type === 'Y'
                  "
                  class="mt-3"
                >
                  <div class="mb-3">
                    <small class="text-muted d-block mt-1">구체적 사유</small>

                    <input
                      type="text"
                      class="form-control"
                      v-model="getAnswer(q.survey_qitem_no, q.survey_qitem_type).reason"
                      placeholder="구체적인 사유를 입력해주세요"
                      style="display: block !important; height: 40px !important"
                    />
                  </div>
                  <div class="mb-3">
                    <input
                      type="date"
                      class="form-control"
                      v-model="getAnswer(q.survey_qitem_no, q.survey_qitem_type).date"
                      style="display: block !important; height: 40px !important"
                    />
                  </div>
                </div>
              </div>

              <div v-else>
                <input
                  style="display: flex"
                  type="text"
                  class="form-control"
                  v-model="getAnswer[(q.survey_qitem_no, q.survey_qitem_type)]"
                />
              </div>
            </li>
          </ul>
        </div>
        <div class="col-5"></div>
        <div class="col-2">
          <button class="btn bg-gradient-primary" @click="addApplication()">등록</button>
        </div>
      </div>
    </div>
  </div>
</template>
