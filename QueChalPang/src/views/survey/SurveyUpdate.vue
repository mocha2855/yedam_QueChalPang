<template>
  <div class="container">
    <!-- 헤더 -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="mb-0">조사지 수정</h4>
      <button class="btn btn-sm btn-secondary" @click="goBack">
        <i class="fas fa-list"></i> 목록으로
      </button>
    </div>

    <!-- 기본 정보 카드 -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row">
          <div class="col-md-2">
            <label class="form-label fw-bold">No</label>
            <input class="form-control" type="text" v-model="surveyInfo.no" readonly />
          </div>
          <div class="col-md-10">
            <label class="form-label fw-bold">항목</label>
            <input class="form-control" type="text" v-model="surveyInfo.title" />
          </div>
        </div>
      </div>
    </div>

    <!-- 세부항목 탭 -->
    <div class="card">
      <div class="card-header pb-0">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h6 class="mb-0">세부항목</h6>
          <button @click="addSubtitle" class="btn btn-sm btn-primary" type="button">
            <i class="fas fa-plus"></i> 세부항목 추가
          </button>
        </div>
        <!-- Nav Tabs -->
        <ul class="nav nav-tabs" role="tablist">
          <li
            class="nav-item"
            v-for="(subtitle, sIndex) in surveyInfo.subtitles"
            :key="subtitle.survey_subtitle_no"
          >
            <a
              class="nav-link"
              :class="{ active: activeTab === sIndex }"
              @click="activeTab = sIndex"
              href="javascript:void(0)"
              role="tab"
            >
              세부항목 {{ sIndex + 1 }}
            </a>
          </li>
        </ul>
      </div>

      <div class="card-body">
        <!-- Tab Content -->
        <div class="tab-content">
          <div
            v-for="(subtitle, sIndex) in surveyInfo.subtitles"
            :key="subtitle.survey_subtitle_no"
            class="tab-pane"
            :class="{ active: activeTab === sIndex, show: activeTab === sIndex }"
          >
            <!-- 세부항목 삭제 버튼 -->
            <div class="text-end mb-4">
              <button
                @click="deleteSubtitle(subtitle.survey_subtitle_no)"
                class="btn btn-sm btn-outline-danger"
                type="button"
              >
                <i class="fas fa-trash"></i> 세부항목 삭제
              </button>
            </div>

            <!-- 세부항목 내용 -->
            <div class="mb-4">
              <label class="form-label fw-bold">세부항목 내용</label>
              <textarea class="form-control" v-model="subtitle.survey_subtitle" rows="3"></textarea>
            </div>

            <!-- 세부항목 설명 -->
            <div class="mb-4">
              <label class="form-label fw-bold">세부항목 설명</label>
              <input class="form-control" v-model="subtitle.survey_subtitle_detail" />
            </div>

            <hr />

            <!-- 질문 목록 헤더 -->
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h6 class="mb-0">질문 목록</h6>
              <button
                @click="addQuestion(subtitle.survey_subtitle_no)"
                class="btn btn-sm btn-outline-primary"
                type="button"
              >
                <i class="fas fa-plus"></i> 질문 추가
              </button>
            </div>

            <!-- 질문 카드 -->
            <div
              v-for="(question, qIndex) in subtitle.questionList"
              :key="question.survey_qitem_no"
              class="question-card mb-3"
            >
              <div class="question-header">
                <span class="badge bg-primary">질문 {{ qIndex + 1 }}</span>
                <button
                  @click="deleteQuestion(subtitle.survey_subtitle_no, question.survey_qitem_no)"
                  class="btn btn-sm btn-outline-danger"
                  type="button"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>

              <div class="question-body">
                <!-- 질문 내용 -->
                <div class="mb-3">
                  <label class="form-label">질문 내용</label>
                  <input class="form-control" v-model="question.survey_qitem_question" />
                </div>

                <!-- 질문 타입 -->
                <div class="mb-3">
                  <label class="form-label">질문 타입</label>
                  <select class="form-control" v-model="question.survey_qitem_type">
                    <option>예/아니요</option>
                    <option>객관식</option>
                    <option>주관식</option>
                  </select>
                </div>

                <!-- 예/아니오일 때만 보임 -->
                <div v-if="question.survey_qitem_type === '예/아니요'">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="question.need_detail"
                      :id="'detail-' + question.survey_qitem_no"
                    />
                    <label class="form-check-label" :for="'detail-' + question.survey_qitem_no">
                      "예" 선택 시 추가 입력 받기
                    </label>
                  </div>
                  <!-- 체크박스 선택하면 안내 메시지 -->
                  <div v-if="question.need_detail" class="alert alert-info mt-2 mb-0">
                    <small
                      ><i class="fas fa-info-circle"></i> 사용자가 "예"를 선택하면 구체적 사유와
                      날짜를 입력받습니다.</small
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- 질문이 없을 때 -->
            <div
              v-if="!subtitle.questionList || subtitle.questionList.length === 0"
              class="text-center text-muted py-4"
            >
              등록된 질문이 없습니다. "질문 추가" 버튼을 눌러 질문을 추가하세요.
            </div>
          </div>
        </div>

        <!-- 세부항목이 없을 때 -->
        <div
          v-if="!surveyInfo.subtitles || surveyInfo.subtitles.length === 0"
          class="text-center text-muted py-5"
        >
          등록된 세부항목이 없습니다. "세부항목 추가" 버튼을 눌러 세부항목을 추가하세요.
        </div>
      </div>
    </div>

    <!-- 하단 버튼 -->
    <div class="mt-4 d-flex justify-content-end gap-2">
      <button class="btn btn-secondary" @click="goBack">취소</button>
      <button class="btn btn-primary" @click="openModifyModal">
        <i class="fas fa-save"></i> 저장
      </button>
    </div>
  </div>
</template>

<script setup>
import Swal from 'sweetalert2'
import { useSurveyStore } from '@/stores/survey'
import { useModalStore } from '@/stores/modal'
import { useCounterStore } from '@/stores/member'
import axios from 'axios'
import { reactive, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const store = useSurveyStore()
const modal = useModalStore()
const member = useCounterStore()

// 활성화된 탭 인덱스
const activeTab = ref(0)

const surveyInfo = reactive({
  no: '',
  title_no: '',
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

  // 새로 추가된 탭으로 이동
  activeTab.value = surveyInfo.subtitles.length - 1

  addQuestion(newSubtitleId)
}

// 세부항목 삭제
const deleteSubtitle = (subtitleNo) => {
  surveyInfo.subtitles = surveyInfo.subtitles.filter((s) => s.survey_subtitle_no !== subtitleNo)

  // 삭제 후 첫 번째 탭으로 이동
  if (activeTab.value >= surveyInfo.subtitles.length) {
    activeTab.value = Math.max(0, surveyInfo.subtitles.length - 1)
  }
}

// 질문 추가
const addQuestion = (subtitleNo) => {
  const subtitle = surveyInfo.subtitles.find((s) => s.survey_subtitle_no === subtitleNo)
  subtitle.questionList.push({
    survey_qitem_no: Date.now(), //임시 id만들기(없으면 err발생)
    survey_qitem_question: '',
    survey_qitem_type: '예/아니요',
    need_detail: false,
  })
}

// 질문 삭제
const deleteQuestion = (subtitleNo, questionNo) => {
  //해당 세부항목 찾기
  const subtitle = surveyInfo.subtitles.find((s) => s.survey_subtitle_no === subtitleNo)
  //세부항목에서 질문 삭제
  subtitle.questionList = subtitle.questionList.filter((q) => q.survey_qitem_no !== questionNo)
}

onMounted(async () => {
  //시스템관리자 아니면 메인으로 백
  if (member.isLogIn.info.member_authority != 'a4') {
    alert('시스템 관리자만 접근할 수 있습니다.')
    router.push({ name: 'Dashboard' })
    return
  }
  await store.fetchSurveyDetail(route.params.no)
  const data = store.surveyDetail
  if (data) {
    surveyInfo.no = data.survey_no || ''
    surveyInfo.title = data.survey_title || ''
    surveyInfo.title_no = data.survey_title_no || ''

    // need_detail을 boolean으로 변환
    surveyInfo.subtitles = (data.subtitles || []).map((subtitle) => ({
      ...subtitle,
      questionList: (subtitle.questionList || []).map((question) => ({
        ...question,
        need_detail: Boolean(question.need_detail), // 0→false, 1→true 변환
      })),
    }))
    surveyInfo.qitemType = data.qitems || ''
  }
  console.log(data.survey_no)
  console.log(data.qitems)
})

//수정(저장)버튼 누를 시 모달 창 열기
const openModifyModal = () => {
  modal.open('reason', {
    onSubmit: async (reason) => {
      await updateSurvey(reason)
    },
  })
  console.log(modal.type)
}

//조사지 수정 저장
const updateSurvey = async (reason) => {
  const personName = member.isLogIn.info.member_name // 시스템관지라 권한부여

  const result = await axios.put(`/api/surveys/${surveyInfo.no}`, {
    survey_no: surveyInfo.no,
    survey_title: surveyInfo.title,
    survey_title_no: surveyInfo.title_no,
    subtitles: surveyInfo.subtitles,
    person: personName,
    reason: reason,
  })

  //등록
  if (result.data) {
    await Swal.fire({
      icon: 'success',
      title: '수정되었습니다!',
      showConfirmButton: false,
      timer: 1500,
    })
    router.push({ name: 'surveyInfo', params: { no: surveyInfo.no } })
  } else {
    Swal.fire({
      icon: 'error',
      title: '실패했습니다',
      text: '다시 시도해주세요',
      confirmButtonText: '확인',
    })
  }
}

const goBack = () => {
  router.push({ name: 'SurveyList' })
}
</script>

<style scoped>
.nav-tabs .nav-link {
  cursor: pointer;
}

.nav-tabs .nav-link.active {
  font-weight: 600;
}

.card {
  box-shadow: none;
  border: 1px solid #e9ecef;
}

.gap-2 {
  gap: 8px;
}

.question-card {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.question-body {
  padding: 16px;
}

.btn-outline-danger,
.btn-outline-primary {
  border-width: 1px;
}
</style>
