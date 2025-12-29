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
            <input class="form-control" type="text" v-model="surveyInfo.title" />
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
              <button
                @click="deleteSubtitle(subtitle.survey_subtitle_no)"
                class="btn btn-sm btn-danger"
                type="button"
              >
                세부항목 삭제
              </button>

              <!-- 세부항목 -->
              <label>세부항목</label>
              <textarea class="form-control" v-model="subtitle.survey_subtitle"></textarea>

              <!-- 세부항목 설명 -->
              <label>세부항목 설명</label>
              <input class="form-control" v-model="subtitle.survey_subtitle_detail" />

              <hr />

              <!-- 질문들 -->
              <h5>질문 목록</h5>
              <div
                v-for="(question, qIndex) in subtitle.questionList"
                :key="question.survey_qitem_no"
              >
                <strong>질문 {{ qIndex + 1 }}</strong>
                <button
                  @click="deleteQuestion(subtitle.survey_subtitle_no, question.survey_qitem_no)"
                  class="btn btn-sm btn-warning"
                  type="button"
                >
                  질문 삭제
                </button>
                <input
                  class="form-control"
                  v-model="question.survey_qitem_question"
                  style="margin-top: 5px"
                />

                <select class="form-control" v-model="question.type" style="margin-top: 5px">
                  <option>예/아니오</option>
                  <option>객관식</option>
                  <option>주관식</option>
                </select>

                <!-- 예/아니오일 때만 보임 -->
                <div v-if="question.type === '예/아니오'" class="detail-option">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="question.needDetail" />
                    "예" 선택 시 추가 입력 받기
                  </label>

                  <!-- 체크박스 선택하면 안내 메시지 -->
                  <div v-if="question.needDetail" class="detail-info">
                    <p style="margin: 10px 0; color: #666; font-size: 14px">
                      사용자가 "예"를 선택하면 사유와 날짜를 모두 입력받습니다.
                    </p>
                  </div>
                </div>
              </div>
              <button
                @click="addQuestion(subtitle.survey_subtitle_no)"
                class="btn btn-secondary"
                type="button"
              >
                + 질문 추가
              </button>
            </div>
            <!-- 세부항목 추가 버튼 -->
            <button @click="addSubtitle" class="btn btn-primary" type="button">
              + 세부항목 추가
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div>
      <button class="btn btn-primary" @click="updateSurvey(surveyInfo.no)">저장</button>
    </div>
    <div>
      <button class="btn btn-primary" @click="updateSurvey(surveyInfo.no)">취소</button>
    </div>
  </div>
</template>
<script setup>
import { useSurveyStore } from '@/stores/survey'
import axios from 'axios'
import { reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const store = useSurveyStore()

const surveyInfo = reactive({
  no: '',
  survey_version: '',
  title: '',
  subtitles: [], //여기 배열에 질문,세부항목,설명 다들어감
})

// 세부항목 추가
const addSubtitle = () => {
  const newSubtitleId = Date.now()

  //세부항목에 질문추가
  surveyInfo.subtitles.push({
    survey_subtitle_no: newSubtitleId,
    survey_subtitle: '',
    survey_subtitle_detail: '',
    questionList: [],
  })
  addQuestion(newSubtitleId)
}
// 세부항목 삭제
const deleteSubtitle = (subtitleNo) => {
  surveyInfo.subtitles = surveyInfo.subtitles.filter((s) => s.survey_subtitle_no !== subtitleNo)
}

// 질문 추가
const addQuestion = (subtitleNo) => {
  const subtitle = surveyInfo.subtitles.find((s) => s.survey_subtitle_no === subtitleNo)
  subtitle.questionList.push({
    survey_qitem_no: Date.now(), //임시 id만들기(없으면 err발생)
    survey_qitem_question: '',
    survey_qitem_type: '예/아니오',
    needDetail: false,
  })
}

// 질문 삭제
const deleteQuestion = (subtitleNo, questionNo) => {
  //해당 세부항목 찾기
  const subtitle = surveyInfo.subtitles.find((s) => s.survey_subtitle_no === subtitleNo)
  //세부항목에서 질문 삭제
  subtitle.questionList = subtitle.questionList.filter((q) => q.survey_qitem_no !== questionNo)
}

// DB에서 데이터 불러오기
const loadSurvey = async () => {
  const surveyNo = route.params.no
  // console.log('불러올 번호:', surveyNo)

  await axios.get(`/api/surveys/${surveyNo}`)
}

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

//조사지 수정 저장
const updateSurvey = async () => {
  const result = await axios.put('/api/surveys/${surveyNo}', surveyInfo)

  //등록
  if (result.data) {
    alert('수정되었습니다!')
    router.push({ name: 'SurveyInfo:{no}' })
  } else {
    alert('실패했습니다')
  }
}

const goBack = () => {
  router.push({ name: 'SurveyList' })
}
onMounted(() => {
  loadSurvey()
})
</script>
