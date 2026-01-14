//survey.js
import { defineStore } from 'pinia'
import axios from 'axios'
export const useSurveyStore = defineStore('surveys', {
  //state
  state: () => {
    //피니아에서는 ref([]) 권장x
    return {
      survey: [], //조사지 목록
      surveyDetail: [], //조사지 상세
      questionList: [], //질문 여러개 담을 것
      err: '',
    }
  },
  actions: {
    //조사지 상세 목록
    async fetchSurvey() {
      try {
        const response = await axios.get('/api/surveys')
        this.survey = response.data
        //active 한 것만 가져오기
        const activeOnly = response.data.filter((s) => s.survey_version_status === 'active')
        //전체 조회 시 중복 제거해서 가져오기
        this.survey = activeOnly.filter(
          (survey, index, self) =>
            index === self.findIndex((s) => s.survey_no === survey.survey_no),
        )
        this.err = ''
      } catch (err) {
        this.err = '조사지 목록을 가져오는데 실패 했습니다.'
      }
    },
    //조사지 상세조회
    async fetchSurveyDetail(no) {
      try {
        const response = await axios.get(`/api/surveys/${no}`)
        this.no = response.data
        this.title = response.data
        this.surveySubtitle = response.data.subtitles
        this.surveyDetail = response.data
        this.err = ''
      } catch (err) {
        this.err = '조사지 상세를 가져오는데 실패 했습니다.'
      }
    },
  },
})
