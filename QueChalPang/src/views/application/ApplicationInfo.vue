<script setup>
import { onBeforeMount, ref, computed } from 'vue'
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
const getApplicationInfo = async () => {
  let result = await axios.get('/api/applicationInfo/' + appNo)
  console.log(result)
  if (result.data.length == 0) {
    return ''
  }
  dependantNo.value = result.data[0].dependant_no
  status.value = result.data[0].status
  applicationDetail.value = result.data
  result.data.forEach((row) => {
    if (row.app_reason) {
      answers.value[row.survey_qitem_no] = row.app_reason
    }

    if (row.app_date) {
      answers.value[row.survey_qitem_no + '_date'] = row.app_date
    }
  })
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
const dependant = ref({})

const getDependantInfo = async () => {
  let result = await axios.get(`/api/dependantInfo/${application.dependantInfo.dependant_no}`)
  console.log(result)
  dependant.value = result.data[0]
  dependant.value.status = status.value
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
        const currentReason = answers.value[q.survey_qitem_no]
        const currentDate = answers.value[q.survey_qitem_no + '_date']

        let reasonVal = currentReason // (간소화)
        let dateVal = null

        // 날짜/복합 타입 처리 로직 (이전과 동일하게 유지하거나 아래처럼 간소화 가능)
        if (q.survey_qitem_type && q.survey_qitem_type.includes('date')) {
          dateVal = currentDate || null
          reasonVal = currentReason || null
        } else {
          dateVal = null
          reasonVal = currentReason
        }

        updateList.push({
          app_answer_no: q.app_answer_no, // PK
          app_reason: reasonVal,
          app_date: dateVal,

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
  modifiable.value = true
  getApplicationInfo()
}
</script>

<template>
  <ApplicationModal v-if="modal">
    <template v-slot:header>
      <h4 style="text-align: center">지원신청서를 수정하시겠습니까?</h4>
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
  <div v-if="isNull" class="card mb-3">
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
    <div class="card-body px-0 pt-0 pb-2">
      <div class="row" v-for="survey in structuredDetail" :key="survey.survey_no">
        <div v-for="sub in survey.subtitles" :key="sub.survey_subtitle_no" class="row mb-4">
          <div class="col-1"></div>
          <div class="col-11">
            <hr class="m-0" />
            <label style="padding-left: 1%" class="text-lg">{{ sub.survey_subtitle }}</label>
            <span style="padding-left: 2%" class="text-xs text-gray">
              {{ sub.survey_subtitle_detail }}
            </span>
            <hr class="m-0" />
          </div>
          <div class="col-12">
            <ul>
              <li
                v-for="q in sub.questions"
                :key="q.survey_qitem_no"
                class="mb-3 list-unstyled"
                style="padding-left: 1%"
              >
                <p class="mb-1 fw-bold">Q. {{ q.survey_qitem_question }}</p>
                <hr class="m-0" />

                <div v-if="q.survey_qitem_type === '예/아니요'">
                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="radio"
                      :name="'question_' + q.survey_qitem_no"
                      :id="'radio_yes_' + q.survey_qitem_no"
                      value="Y"
                      v-model="answers[q.survey_qitem_no]"
                      :disabled="modifiable"
                    />
                    <label class="form-check-label" :for="'radio_yes_' + q.survey_qitem_no"
                      >예</label
                    >
                  </div>

                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="radio"
                      :name="'question_' + q.survey_qitem_no"
                      :id="'radio_no_' + q.survey_qitem_no"
                      value="N"
                      v-model="answers[q.survey_qitem_no]"
                      :disabled="modifiable"
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
                    :disabled="modifiable"
                  />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="!isNull" class="card mb-3">
    <h5 class="mb-0">지원 신청서</h5>
    <div class="text-center">
      <h5 class="p-5 mt-5 mb-5">지원신청서의 답변이 <br />작성되지 않았습니다.</h5>
    </div>
  </div>
</template>
