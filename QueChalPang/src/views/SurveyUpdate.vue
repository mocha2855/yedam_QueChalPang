<template>
  <!--조사지등록-->
  <div class="container">
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
            <div v-for="(subtitle, sIndex) in surveyInfo.subtitles" :key="subtitle.id">
              <!-- 세부항목 헤더 -->
              <div>
                <h4>세부항목 {{ sIndex + 1 }}</h4>
                <button
                  v-if="surveyInfo.subtitles.length > 1"
                  @click="deleteSubtitle(subtitle.id)"
                  class="btn btn-sm btn-danger"
                  type="button"
                >
                  세부항목 삭제
                </button>
              </div>

              <!-- 세부항목 입력 -->
              <label>세부항목</label>
              <textarea
                class="form-control"
                v-model="subtitle.subtitle"
                placeholder="세부항목 입력"
              ></textarea>

              <!-- 세부항목 설명 -->
              <label>세부항목 설명</label>
              <input
                class="form-control"
                v-model="subtitle.subtitleDetail"
                placeholder="세부항목 설명 입력"
              />

              <hr />

              <!-- 세부항목의 질문들 -->
              <h5>질문 목록</h5>
              <div v-for="(question, qIndex) in subtitle.questions" :key="question.id">
                <div>
                  <strong>질문 {{ qIndex + 1 }}</strong>
                  <button
                    v-if="subtitle.questions.length > 1"
                    @click="deleteQuestion(subtitle.id, question.id)"
                    class="btn btn-sm btn-warning"
                    type="button"
                  >
                    질문 삭제
                  </button>
                </div>

                <input
                  class="form-control"
                  v-model="question.text"
                  placeholder="질문 내용"
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

              <button @click="addQuestion(subtitle.id)" class="btn btn-secondary" type="button">
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
      <button class="btn btn-info" @click="updateSurvey">수정</button>
    </div>
  </div>
</template>
<script setup>
import axios from 'axios'
import { reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const surveyInfo = reactive({
  no: '',
  survey_version: '',
  title: '',
  subtitles: [], //여기 배열에 질문,세부항목,설명 다들어감
})

// 세부항목 추가
const addSubtitle = () => {
  const newSubtitleId = Date.now()

  surveyInfo.subtitles.push({
    id: newSubtitleId,
    subtitle: '',
    subtitleDetail: '',
    questions: [],
  })
  addQuestion(newSubtitleId)
}
// 세부항목 삭제
const deleteSubtitle = (subtitleId) => {
  surveyInfo.subtitles = surveyInfo.subtitles.filter((s) => s.id !== subtitleId)
}

// 질문 추가
const addQuestion = (subtitleId) => {
  const subtitle = surveyInfo.subtitles.find((s) => s.id === subtitleId)
  subtitle.questions.push({
    id: Date.now(),
    text: '',
    type: '예/아니오',
    needDetail: false,
  })
}

// 질문 삭제
const deleteQuestion = (subtitleId, questionId) => {
  //해당 세부항목 찾기
  const subtitle = surveyInfo.subtitles.find((s) => s.id === subtitleId)
  //세부항목에서 질문 삭제
  subtitle.questions = subtitle.questions.filter((q) => q.id !== questionId)
}

// DB에서 데이터 불러오기
const loadSurvey = async () => {
  const surveyNo = route.params.no
  console.log('불러올 번호:', surveyNo)

  const result = await axios.get(`/api/surveys/${surveyNo}`)
  console.log('불러온 데이터:', result.data)
}

//조사지 등록
const updateSurvey = async () => {
  const result = await axios.put('/api/surveys/${surveyNo}', surveyInfo)

  //등록
  if (result.data) {
    alert('등록되었습니다!')
    router.push({ name: 'SurveyList' })
  } else {
    alert('실패했습니다')
  }
}

onMounted(() => {
  loadSurvey()
})
</script>
