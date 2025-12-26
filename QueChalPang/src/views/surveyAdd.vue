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
            <textarea class="form-control" v-model="surveyInfo.subtitle"></textarea>
          </td>
        </tr>
        <tr>
          <th class="text-right">세부항목설명</th>
          <td class="text-center">
            <input class="form-control" type="text" v-model="surveyInfo.subtitleDetail" />
          </td>
        </tr>
        <tr>
          <th class="text-right">질문</th>
          <td class="text-center">
            <input class="form-control" type="text" v-model="surveyInfo.qitem" />
          </td>
        </tr>
        <tr>
          <th class="text-right">질문유형</th>
          <td class="text-center">
            <input class="form-control" type="text" v-model="surveyInfo.qitemType" />
          </td>
        </tr>
      </tbody>
    </table>
    <div>
      <button class="btn btn-info" @click="addSurvey">저장</button>
    </div>
  </div>
</template>
<script setup>
import axios from 'axios'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const surveyInfo = reactive({
  no: '',
  survey_version: '',
  title: '',
  subtitle: '',
  subtitleDetail: '',
  qitem: '',
  qitemType: '',
})
//조사지 등록
const addSurvey = async () => {
  console.log('전송할 데이터:', surveyInfo)
  const result = await axios.post('/api/surveys', surveyInfo)

  //등록
  if (result.data.status == 'success') {
    alert('등록되었습니다!')
    router.push({ name: 'surveyList' })
  } else {
    alert('실패했습니다')
  }
}
</script>
