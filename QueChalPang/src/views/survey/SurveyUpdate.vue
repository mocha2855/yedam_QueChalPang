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
              {{ subtitle.survey_subtitle || `세부항목 ${sIndex + 1}` }}
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
                class="btn btn-sm btn-danger"
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
                class="btn btn-sm btn-info"
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
                  class="btn btn-sm btn-danger"
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
                      체크박스 선택 시 구체적 사유와 날짜 입력 받기
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
    // 세부항목 개수 변경 확인 (추가 또는 삭제)
    if (surveyInfo.subtitles.length !== originalSubtitleCount.value) {
      // 세부항목이 추가되거나 삭제됨 → 새 버전 생성
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
/* 라운드 제거 - 모든 요소 각지게 */
* {
  border-radius: 0 !important;
}

/* 컨테이너 상단 여백 */
.container {
  padding: 0.3rem 1rem !important;
}

/* 네비와 헤더 간격 축소 */
.d-flex.justify-content-between.align-items-center {
  margin-bottom: 0.5rem !important;
}

/* 헤더 크기 */
h4 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0 !important;
}

h6 {
  font-size: 0.8rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0 !important;
}

/* 카드 여백 축소 */
.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  border: 1px solid #dee2e6;
  margin-bottom: 0.5rem !important;
}

.card-header {
  padding: 0.4rem 0.6rem !important;
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.card-body {
  padding: 0.5rem !important;
}

/* 탭 스타일 */
.nav-tabs {
  margin-bottom: 0 !important;
  border-bottom: 1px solid #dee2e6;
}

.nav-tabs .nav-link {
  cursor: pointer;
  padding: 0.3rem 0.6rem;
  font-size: 0.75rem;
  border: 1px solid transparent;
  color: #555;
}

.nav-tabs .nav-link.active {
  font-weight: 600;
  background-color: white;
  border-color: #dee2e6 #dee2e6 white;
  color: #333;
}

.nav-tabs .nav-link:hover {
  border-color: transparent !important;
  background-color: transparent !important;
}

/* 폼 레이블 */
.form-label {
  margin-bottom: 0.2rem !important;
  font-size: 0.75rem;
  font-weight: 600;
  color: #555;
}

/* 폼 컨트롤 */
.form-control {
  padding: 0.3rem 0.5rem !important;
  font-size: 0.75rem !important;
  height: calc(1.5em + 0.6rem + 2px) !important;
  border: 1px solid #dee2e6;
}

.form-control:read-only {
  background-color: #f8f9fa;
}

.form-control:focus {
  box-shadow: none !important;
  border-color: #dee2e6 !important;
}

/* textarea */
textarea.form-control {
  height: auto !important;
  min-height: 50px !important;
}

/* select */
select.form-control {
  height: calc(1.5em + 0.6rem + 2px) !important;
}

/* 버튼 크기 및 색상 */
.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.7rem;
  font-weight: 500;
}

.btn-primary {
  background-color: #5b9bd5 !important;
  border-color: #5b9bd5 !important;
  color: white !important;
}

.btn-primary:hover,
.btn-primary:focus,
.btn-primary:active {
  background-color: #5b9bd5 !important;
  border-color: #5b9bd5 !important;
  color: white !important;
  box-shadow: none !important;
  outline: none !important;
}

.btn-secondary {
  background-color: #e0e0e0 !important;
  border-color: #d0d0d0 !important;
  color: #333 !important;
}

.btn-secondary:hover,
.btn-secondary:focus,
.btn-secondary:active {
  background-color: #e0e0e0 !important;
  border-color: #d0d0d0 !important;
  color: #333 !important;
  box-shadow: none !important;
  outline: none !important;
}

.btn-info {
  background-color: #5b9bd5 !important;
  border-color: #5b9bd5 !important;
  color: white !important;
}

.btn-info:hover,
.btn-info:focus,
.btn-info:active {
  background-color: #5b9bd5 !important;
  border-color: #5b9bd5 !important;
  color: white !important;
  box-shadow: none !important;
  outline: none !important;
}

.btn-danger {
  background-color: #dc3545 !important;
  border-color: #dc3545 !important;
  color: white !important;
}

.btn-danger:hover,
.btn-danger:focus,
.btn-danger:active {
  background-color: #dc3545 !important;
  border-color: #dc3545 !important;
  color: white !important;
  box-shadow: none !important;
  outline: none !important;
}

/* 배지 */
.badge {
  font-size: 0.7rem;
  padding: 0.2rem 0.4rem;
}

.bg-primary {
  background-color: #5b9bd5 !important;
}

/* 질문 카드 */
.question-card {
  border: 1px solid #dee2e6;
  overflow: hidden;
  margin-bottom: 0.4rem !important;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 0.5rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.question-body {
  padding: 0.6rem;
  overflow: visible;
}

/* 마진 축소 */
.mb-4 {
  margin-bottom: 0.5rem !important;
}

.mb-3 {
  margin-bottom: 0.4rem !important;
}

.mb-2 {
  margin-bottom: 0.3rem !important;
}

.mb-0 {
  margin-bottom: 0 !important;
}

.mt-2 {
  margin-top: 0.3rem !important;
}

.mt-4 {
  margin-top: 0.5rem !important;
}

/* 패딩 축소 */
.py-4 {
  padding-top: 0.5rem !important;
  padding-bottom: 0.5rem !important;
}

.py-5 {
  padding-top: 0.75rem !important;
  padding-bottom: 0.75rem !important;
}

/* hr 여백 축소 */
hr {
  margin: 0.5rem 0 !important;
  border-color: #dee2e6;
}

/* alert 크기 */
.alert {
  padding: 0.4rem 0.6rem !important;
  font-size: 0.75rem !important;
  border: 1px solid #bee5eb;
  width: 100%;
  box-sizing: border-box;
}

.alert-info {
  background-color: #d1ecf1;
  color: #0c5460;
}

.alert small {
  font-size: 0.7rem !important;
  display: block;
  word-break: keep-all;
}

/* form-check */
.form-check {
  padding-left: 0;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  line-height: 1;
}

.form-check-input {
  margin: 0 !important;
  cursor: pointer;
  width: 1rem !important;
  height: 1rem !important;
  accent-color: #5b9bd5;
  flex-shrink: 0;
  display: inline-block !important;
  opacity: 1 !important;
  visibility: visible !important;
  vertical-align: baseline;
}

.form-check-label {
  font-size: 0.75rem;
  cursor: pointer;
  margin-left: 0.4rem;
  display: inline-block;
  line-height: 1rem;
}

/* row 간격 */
.row {
  margin-left: -0.4rem !important;
  margin-right: -0.4rem !important;
}

.row > * {
  padding-left: 0.4rem !important;
  padding-right: 0.4rem !important;
}

/* 빈 상태 메시지 */
.text-center.text-muted {
  font-size: 0.75rem;
  padding: 0.5rem 0 !important;
  color: #999;
}

/* gap 축소 */
.gap-2 {
  gap: 0.3rem !important;
}

/* 하단 버튼 */
.btn-primary,
.btn-secondary {
  padding: 0.25rem 0.5rem !important;
  font-size: 0.75rem !important;
}

.text-end {
  text-align: right !important;
}

/* 탭 콘텐츠 */
.tab-content {
  padding-top: 0.5rem;
}

.tab-pane {
  display: none;
}

.tab-pane.active.show {
  display: block;
}
</style>
