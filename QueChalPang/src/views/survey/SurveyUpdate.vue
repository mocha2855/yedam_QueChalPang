<template>
  <div class="container">
    <!-- 헤더 -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="mb-0">지원서 수정</h4>
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
import { useCounterStore } from '@/stores/member'
import axios from 'axios'
import { reactive, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const store = useSurveyStore()
const member = useCounterStore()

// 활성화된 탭 인덱스
const activeTab = ref(0)
// 원래 세부항목 개수 저장
const originalSubtitleCount = ref(0)

const surveyInfo = reactive({
  no: '',
  title_no: '',
  survey_version: '',
  title: '',
  subtitles: [], //여기 배열에 질문,세부항목,설명 다들어감
})

// 세부항목 추가 (화면에만 추가)
const addSubtitle = () => {
  const newSubtitleId = Date.now()

  surveyInfo.subtitles.push({
    survey_subtitle_no: newSubtitleId,
    survey_subtitle: '',
    survey_subtitle_detail: '',
    questionList: [
      {
        survey_qitem_no: Date.now(),
        survey_qitem_question: '',
        survey_qitem_type: '예/아니요',
        need_detail: false,
      },
    ],
  })

  activeTab.value = surveyInfo.subtitles.length - 1
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

    // 원래 세부항목 개수 저장
    originalSubtitleCount.value = surveyInfo.subtitles.length

    surveyInfo.qitemType = data.qitems || ''
  }
})

//수정(저장)버튼 누를 시 SweetAlert로 입력받기
const openModifyModal = async () => {
  const { value: reason } = await Swal.fire({
    title: '수정 사유를 입력해주세요',
    input: 'textarea',
    inputPlaceholder: '수정 사유를 입력하세요...',
    inputAttributes: {
      'aria-label': '수정 사유',
      style: 'min-height: 100px;',
    },
    showCancelButton: true,
    confirmButtonText: '저장',
    cancelButtonText: '취소',
    confirmButtonColor: '#2196f3',
    cancelButtonColor: '#f44336',
    inputValidator: (value) => {
      if (!value || value.trim() === '') {
        return '수정 사유를 입력해주세요!'
      }
    },
  })

  if (reason) {
    // 세부항목 개수 비교
    if (surveyInfo.subtitles.length > originalSubtitleCount.value) {
      // 세부항목이 추가됨 → 새 버전 생성
      await createNewVersion(reason)
    } else {
      // 글자만 수정됨 → 기존 버전 업데이트
      await updateSurvey(reason)
    }
  }
}

// 기존 버전 업데이트 (PUT)
const updateSurvey = async (reason) => {
  const personName = member.isLogIn.info.member_name

  try {
    const result = await axios.put(`/api/surveys/${surveyInfo.no}`, {
      survey_no: surveyInfo.no,
      survey_title: surveyInfo.title,
      survey_title_no: surveyInfo.title_no,
      subtitles: surveyInfo.subtitles,
      person: personName,
      reason: reason,
    })

    if (result.data) {
      await Swal.fire({
        icon: 'success',
        title: '수정되었습니다!',
        showConfirmButton: false,
        timer: 1500,
      })
      router.push({ name: 'surveyInfo', params: { no: surveyInfo.no } })
    }
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: '수정 실패',
      text: error.response?.data?.message || '다시 시도해주세요',
      confirmButtonText: '확인',
    })
  }
}

// 새 버전 생성 (POST)
const createNewVersion = async (reason) => {
  const personName = member.isLogIn.info.member_name

  try {
    const result = await axios.post('/api/surveys', {
      survey_title_no: surveyInfo.title_no,
      survey_title: surveyInfo.title,
      subtitles: surveyInfo.subtitles,
      person: personName,
      reason: reason,
    })

    if (result.data && result.data.survey_no) {
      await Swal.fire({
        icon: 'success',
        title: '새 버전이 생성되었습니다!',
        showConfirmButton: false,
        timer: 1500,
      })
      router.push({ name: 'surveyInfo', params: { no: result.data.survey_no } })
    }
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: '생성 실패',
      text: error.response?.data?.message || '다시 시도해주세요',
      confirmButtonText: '확인',
    })
  }
}

const goBack = () => {
  router.push({ name: 'SurveyList' })
}
</script>
<style scoped>
/* 컨테이너 상단 여백 축소 */
.container {
  padding-top: 8px;
}

/* 네비와 헤더 간격 축소 */
.d-flex.justify-content-between.align-items-center {
  margin-bottom: 12px !important;
}

/* 헤더 크기 */
h4 {
  font-size: 18px;
  margin-bottom: 0 !important;
}

h6 {
  font-size: 14px;
  margin-bottom: 0 !important;
}

/* 카드 여백 축소 */
.card {
  box-shadow: none;
  border: 1px solid #e9ecef;
  margin-bottom: 12px !important;
}

.card-header {
  padding: 8px 12px !important;
}

.card-body {
  padding: 12px !important;
}

/* 탭 스타일 */
.nav-tabs {
  margin-bottom: 0 !important;
}

.nav-tabs .nav-link {
  cursor: pointer;
  padding: 6px 13px;
  font-size: 14px;
}

.nav-tabs .nav-link.active {
  font-weight: 600;
}

/* 폼 레이블 */
.form-label {
  margin-bottom: 4px !important;
  font-size: 14px;
}

/* 폼 컨트롤 */
.form-control {
  padding: 6px 10px !important;
  font-size: 14px !important;
  height: calc(1.5em + 12px + 2px) !important;
}

/* textarea */
textarea.form-control {
  height: auto !important;
  min-height: 60px !important;
}

/* select */
select.form-control {
  height: calc(1.5em + 12px + 2px) !important;
}

/* 버튼 크기 */
.btn-sm {
  padding: 6px 10px;
  font-size: 13px;
}

.btn-outline-danger,
.btn-outline-primary {
  border-width: 1px;
  padding: 5px 10px;
  font-size: 12px;
}

/* 배지 */
.badge {
  font-size: 12px;
  padding: 4px 8px;
}

/* 질문 카드 */
.question-card {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 8px !important;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.question-body {
  padding: 12px;
}

/* 마진 축소 */
.mb-4 {
  margin-bottom: 12px !important;
}

.mb-3 {
  margin-bottom: 8px !important;
}

.mb-2 {
  margin-bottom: 6px !important;
}

.mb-0 {
  margin-bottom: 0 !important;
}

.mt-2 {
  margin-top: 6px !important;
}

.mt-4 {
  margin-top: 12px !important;
}

/* 패딩 축소 */
.py-4 {
  padding-top: 12px !important;
  padding-bottom: 12px !important;
}

.py-5 {
  padding-top: 16px !important;
  padding-bottom: 16px !important;
}

/* hr 여백 축소 */
hr {
  margin: 12px 0 !important;
}

/* alert 크기 */
.alert {
  padding: 8px 12px !important;
  font-size: 13px !important;
}

.alert small {
  font-size: 12px !important;
}

/* form-check */
.form-check {
  padding-left: 24px;
  margin-bottom: 8px;
}

.form-check-input {
  margin-top: 4px;
}

.form-check-label {
  font-size: 14px;
}

/* row 간격 */
.row {
  margin-left: -8px !important;
  margin-right: -8px !important;
}

.row > * {
  padding-left: 8px !important;
  padding-right: 8px !important;
}

/* 빈 상태 메시지 */
.text-center.text-muted {
  font-size: 14px;
}

/* gap 축소 */
.gap-2 {
  gap: 6px !important;
}

/* 하단 버튼 */
.btn-primary,
.btn-secondary {
  padding: 6px 13px !important;
  font-size: 14px !important;
}

.text-end {
  text-align: right !important;
}
</style>
