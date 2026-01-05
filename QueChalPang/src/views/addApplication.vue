<script setup>
import { onBeforeMount, ref, computed } from 'vue'
import { useCounterStore } from '@/stores/member'
import axios from 'axios'

const member = useCounterStore().isLogIn.info
const surveyList = ref([])
const getApplicationList = async () => {
  console.log(member)
  let result = await axios.get(`/api/allsurveys`)
  console.log(result)
  surveyList.value = result.data
}
const structuredSurvey = computed(() => {
  const surveyMap = {}

  surveyList.value.forEach((row) => {
    // 1. Survey 레벨 (설문지) 초기화
    // surveyMap에 해당 survey_no가 없으면 새로 만듭니다.
    if (!surveyMap[row.survey_no]) {
      surveyMap[row.survey_no] = {
        survey_no: row.survey_no,
        survey_version: row.survey_version,
        survey_title: row.survey_title,
        survey_start: row.survey_start,
        survey_end: row.survey_end,
        // 하위 항목인 subtitle을 담을 임시 객체 (중복 제거용)
        _subtitlesMap: {},
      }
    }

    const survey = surveyMap[row.survey_no]

    // 2. Subtitle 레벨 (소주제) 초기화
    // 해당 설문지 안에 이 subtitle_no가 없으면 새로 만듭니다.
    if (!survey._subtitlesMap[row.survey_subtitle_no]) {
      survey._subtitlesMap[row.survey_subtitle_no] = {
        survey_subtitle_no: row.survey_subtitle_no,
        survey_subtitle: row.survey_subtitle,
        survey_subtitle_detail: row.survey_subtitle_detail,
        // 하위 항목인 질문들을 담을 배열
        questions: [],
      }
    }

    // 3. Question 레벨 (문항) 추가
    // 소주제 안에 질문을 밀어 넣습니다.
    survey._subtitlesMap[row.survey_subtitle_no].questions.push({
      survey_qitem_no: row.survey_qitem_no,
      survey_qitem_question: row.survey_qitem_question,
      survey_qitem_type: row.survey_qitem_type,
    })
  })

  // 4. Map 형태를 최종 배열 형태로 변환
  return Object.values(surveyMap).map((survey) => {
    // _subtitlesMap 객체를 subtitles 배열로 변환하고, 임시 맵(_subtitlesMap)은 제거
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
      console.log(val)
      console.log(selectedDependant.value)
    }
  })
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
  if (input == 'g1') {
    return '남'
  } else {
    return '여'
  }
}
</script>

<template>
  <div class="card mb-1">
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
            <td class="align-middle text-center text-sm">{{ member.member_name }}</td>
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
          <div class="col-2"></div>
          <div class="col-10">
            <label class="text-lg">{{ sub.survey_subtitle }}</label>
            <span class="text-xs text-gray">{{ sub.survey_subtitle_detail }}</span>
          </div>

          <ul>
            <li v-for="q in sub.questions" :key="q.survey_qitem_no">
              Q. {{ q.survey_qitem_question }} [{{ q.survey_qitem_type }}]
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
