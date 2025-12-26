//survey.js
import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
export const useSurveyStore = defineStore('survey', {
  //state
  state: () => {
    return {
      survey: ref([]), //조사지 목록
      surveyDetail: ref([]), //조사지 상세
      err: ref(''),
    }
  },
  actions: {
    //조사지 목록
    async fetchSurvey() {
      try {
        const response = await axios.get('/api/surveys')
        this.survey = response.data
        //active 한 것만 가져오기
        const activeOnly = response.data.filter((s) => s.survey_version_status === 'active')
        //전체 조회 시 중복 제거해서 가져오기
        this.survey = activeOnly.filter(
          (survey, index, self) =>
            index === self.findIndex((s) => s.survey_no === survey.survey.survey_no),
        )
        this.err = ''
      } catch (err) {
        console.log(err)
        this.err = '조사지 목록을 가져오는데 실패 했습니다.'
      }
    },
    //조사지 상세조회
    async fetchSurveyDetail(no) {
      try {
        const response = await axios.get(`/api/survey/${no}`)
        this.surveyDetail = response.data
        this.err = ''
      } catch (err) {
        console.log(err)
        this.err = '조사지 상세를 가져오는데 실패 했습니다.'
      }
    },
  },
})
