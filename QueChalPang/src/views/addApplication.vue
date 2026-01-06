<script setup>
import { onBeforeMount, ref, computed } from 'vue'
import { useCounterStore } from '@/stores/member'
import axios from 'axios'

const member = useCounterStore().isLogIn.info
const surveyList = ref([])
const getApplicationList = async () => {
  let result = await axios.get(`/api/allsurveys`)
  surveyList.value = result.data
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

    survey._subtitlesMap[row.survey_subtitle_no].questions.push({
      survey_qitem_no: row.survey_qitem_no,
      survey_qitem_question: row.survey_qitem_question,
      survey_qitem_type: row.survey_qitem_type,
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
const answers = ref({})
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
                    v-model="answers[q.survey_qitem_no]"
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
                    v-model="answers[q.survey_qitem_no]"
                  />
                  <label class="form-check-label" :for="'radio_no_' + q.survey_qitem_no"
                    >아니오</label
                  >
                </div>
              </div>

              <div v-else>
                <input
                  style="display: flex"
                  type="text"
                  class="form-control"
                  v-model="answers[q.survey_qitem_no]"
                />
              </div>
            </li>
          </ul>
        </div>
        <div class="col-5"></div>
        <div class="col-2">
          <button class="btn bg-gradient-primary">등록</button>
        </div>
      </div>
    </div>
  </div>
</template>
