<template>
  <div class="container">
    <!-- 헤더 -->
    <div class="header-section">
      <h4 class="mb-0">지원서 수정</h4>
      <div class="header-actions">
        <button class="btn btn-sm btn-secondary" @click="goBack">
          <i class="fas fa-times"></i> 취소
        </button>
        <button class="btn btn-sm btn-primary" @click="openModifyModal">
          <i class="fas fa-save"></i> 저장
        </button>
        <button class="btn btn-sm btn-outline-secondary" @click="goBack">
          <i class="fas fa-list"></i> 목록
        </button>
      </div>
    </div>

    <!-- 사용 안내 -->
    <div class="usage-guide">
      <i class="fas fa-info-circle"></i>
      <span
        >세부항목과 질문을 추가하여 지원서를 구성하세요. 세부항목 개수가 변경되면 새 버전이
        생성됩니다.</span
      >
    </div>

    <!-- 기본 정보 카드 -->
    <div class="card mb-4">
      <div class="card-header">
        <h6 class="mb-0"><i class="fas fa-file-alt"></i> 기본 정보</h6>
      </div>
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
          <h6 class="mb-0"><i class="fas fa-folder-open"></i> 세부항목</h6>
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
              <i class="fas fa-folder"></i>
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
            <!-- 세부항목 편집 섹션 -->
            <div class="subtitle-section">
              <div class="section-header">
                <h6><i class="fas fa-edit"></i> 세부항목 편집</h6>
                <button
                  @click="deleteSubtitle(subtitle.survey_subtitle_no)"
                  class="btn btn-sm btn-danger"
                  type="button"
                >
                  <i class="fas fa-trash"></i> 세부항목 삭제
                </button>
              </div>

              <!-- 세부항목 내용 -->
              <div class="mb-3">
                <label class="form-label fw-bold">
                  <i class="fas fa-heading"></i> 세부항목 제목
                </label>
                <input
                  class="form-control"
                  v-model="subtitle.survey_subtitle"
                  placeholder="예: 건강 지원 필요"
                />
              </div>

              <!-- 세부항목 설명 -->
              <div class="mb-4">
                <label class="form-label fw-bold">
                  <i class="fas fa-align-left"></i> 세부항목 설명
                </label>
                <textarea
                  class="form-control"
                  v-model="subtitle.survey_subtitle_detail"
                  rows="2"
                  placeholder="예: 건강 관련 지원이 필요한 항목을 체크해주세요"
                ></textarea>
              </div>
            </div>

            <!-- 구분선 -->
            <div class="divider"></div>

            <!-- 질문 목록 섹션 -->
            <div class="questions-section">
              <div class="section-header">
                <h6><i class="fas fa-question-circle"></i> 질문 목록</h6>
                <button
                  @click="addQuestion(subtitle.survey_subtitle_no)"
                  class="btn btn-sm btn-success"
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
                  <span class="badge bg-primary"> <i></i> 질문 {{ qIndex + 1 }} </span>
                  <button
                    @click="deleteQuestion(subtitle.survey_subtitle_no, question.survey_qitem_no)"
                    class="btn btn-sm btn-danger"
                    type="button"
                  >
                    <i class="fas fa-trash"></i> 삭제
                  </button>
                </div>

                <div class="question-body">
                  <!-- 질문 내용 -->
                  <div class="mb-3">
                    <label class="form-label">질문 내용</label>
                    <input
                      class="form-control"
                      v-model="question.survey_qitem_question"
                      placeholder="예: 정기적인 병원 치료가 필요하신가요?"
                    />
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
                        <i class="fas fa-pencil-alt"></i>
                        "예" 선택 시 상세 정보 입력받기 (구체적 사유 및 날짜)
                      </label>
                    </div>
                    <!-- 체크박스 선택하면 안내 메시지 -->
                    <div v-if="question.need_detail" class="alert alert-info mt-2 mb-0">
                      <i class="fas fa-info-circle"></i>
                      사용자가 "예"를 선택하면 구체적 사유와 날짜를 입력받습니다.
                    </div>
                  </div>
                </div>
              </div>

              <!-- 질문이 없을 때 -->
              <div
                v-if="!subtitle.questionList || subtitle.questionList.length === 0"
                class="empty-state"
              >
                <i class="fas fa-inbox"></i>
                <p>등록된 질문이 없습니다.</p>
                <small>"질문 추가" 버튼을 눌러 질문을 추가하세요.</small>
              </div>
            </div>
          </div>
        </div>

        <!-- 세부항목이 없을 때 -->
        <div
          v-if="!surveyInfo.subtitles || surveyInfo.subtitles.length === 0"
          class="empty-state large"
        >
          <i class="fas fa-folder-plus"></i>
          <p>등록된 세부항목이 없습니다.</p>
          <small>"세부항목 추가" 버튼을 눌러 세부항목을 추가하세요.</small>
        </div>
      </div>
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
  subtitles: [],
})

// 세부항목 추가
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
  Swal.fire({
    title: '세부항목을 삭제하시겠습니까?',
    text: '이 작업은 되돌릴 수 없습니다.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d',
    confirmButtonText: '삭제',
    cancelButtonText: '취소',
  }).then((result) => {
    if (result.isConfirmed) {
      surveyInfo.subtitles = surveyInfo.subtitles.filter((s) => s.survey_subtitle_no !== subtitleNo)

      // 삭제 후 첫 번째 탭으로 이동
      if (activeTab.value >= surveyInfo.subtitles.length) {
        activeTab.value = Math.max(0, surveyInfo.subtitles.length - 1)
      }
    }
  })
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
  Swal.fire({
    title: '질문을 삭제하시겠습니까?',
    text: '이 작업은 되돌릴 수 없습니다.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d',
    confirmButtonText: '삭제',
    cancelButtonText: '취소',
  }).then((result) => {
    if (result.isConfirmed) {
      //해당 세부항목 찾기
      const subtitle = surveyInfo.subtitles.find((s) => s.survey_subtitle_no === subtitleNo)
      //세부항목에서 질문 삭제
      subtitle.questionList = subtitle.questionList.filter((q) => q.survey_qitem_no !== questionNo)
    }
  })
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
    confirmButtonColor: '#5b9bd5',
    cancelButtonColor: '#6c757d',
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
/* 컨테이너 */
.container {
  padding: 1rem !important;
  max-width: 1200px;
}

/* 헤더 섹션 */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e0e0e0;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

/* 사용 안내 */
.usage-guide {
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  border-left: 3px solid #5b9bd5;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border-radius: 2px;
  font-size: 0.8rem;
  color: #444;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.usage-guide i {
  color: #5b9bd5;
  font-size: 1rem;
}

/* 헤더 크기 */
h4 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0 !important;
}

h6 {
  font-size: 0.85rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0 !important;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

h6 i {
  font-size: 0.9rem;
  color: #5b9bd5;
}

/* 카드 */
.card {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #dee2e6;
  margin-bottom: 1rem !important;
  border-radius: 2px;
}

.card-header {
  padding: 0.75rem 1rem !important;
  background: linear-gradient(to right, #f8f9fa 0%, #ffffff 100%);
  border-bottom: 1px solid #dee2e6;
  border-radius: 2px 2px 0 0 !important;
}

.card-body {
  padding: 1rem !important;
}

/* 섹션 구분 */
.subtitle-section,
.questions-section {
  margin-bottom: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e9ecef;
}

.divider {
  height: 1px;
  background: linear-gradient(to right, transparent, #dee2e6, transparent);
  margin: 1.5rem 0;
}

/* 탭 스타일 */
.nav-tabs {
  margin-bottom: 0 !important;
  border-bottom: 2px solid #dee2e6;
}

.nav-tabs .nav-link {
  cursor: pointer;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  border: none;
  color: #666;
  border-radius: 2px 2px 0 0 !important;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.nav-tabs .nav-link i {
  font-size: 0.75rem;
}

.nav-tabs .nav-link.active {
  font-weight: 600;
  background-color: white;
  border-bottom: 2px solid #5b9bd5;
  color: #5b9bd5;
}

.nav-tabs .nav-link:hover:not(.active) {
  background-color: #f8f9fa;
}

/* 폼 레이블 */
.form-label {
  margin-bottom: 0.4rem !important;
  font-size: 0.8rem;
  font-weight: 600;
  color: #555;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.form-label i {
  font-size: 0.75rem;
  color: #5b9bd5;
}

/* 폼 컨트롤 */
.form-control {
  padding: 0.5rem 0.75rem !important;
  font-size: 0.85rem !important;
  border: 1px solid #ced4da;
  border-radius: 2px !important;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.form-control::placeholder {
  color: #adb5bd;
  font-size: 0.8rem;
}

.form-control:read-only {
  background-color: #f8f9fa;
}

.form-control:focus {
  box-shadow: 0 0 0 0.2rem rgba(91, 155, 213, 0.15) !important;
  border-color: #5b9bd5 !important;
}

textarea.form-control {
  min-height: 60px !important;
  resize: vertical;
}

select.form-control {
  height: auto !important;
}

/* 버튼 - 라운드 2px 적용 */
.btn {
  border-radius: 2px !important;
  transition: all 0.2s;
  font-weight: 500;
}

.btn-sm {
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
}

.btn-primary {
  background-color: #5b9bd5 !important;
  border-color: #5b9bd5 !important;
  color: white !important;
}

.btn-primary:hover {
  background-color: #4a8bc2 !important;
  border-color: #4a8bc2 !important;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(91, 155, 213, 0.3);
}

.btn-secondary {
  background-color: #6c757d !important;
  border-color: #6c757d !important;
  color: white !important;
}

.btn-secondary:hover {
  background-color: #5a6268 !important;
  border-color: #545b62 !important;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(108, 117, 125, 0.3);
}

.btn-outline-secondary {
  background-color: white !important;
  border-color: #ced4da !important;
  color: #6c757d !important;
}

.btn-outline-secondary:hover {
  background-color: #f8f9fa !important;
  border-color: #adb5bd !important;
  color: #495057 !important;
}

.btn-success {
  background-color: #28a745 !important;
  border-color: #28a745 !important;
  color: white !important;
}

.btn-success:hover {
  background-color: #218838 !important;
  border-color: #1e7e34 !important;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(40, 167, 69, 0.3);
}

.btn-danger {
  background-color: #dc3545 !important;
  border-color: #dc3545 !important;
  color: white !important;
}

.btn-danger:hover {
  background-color: #c82333 !important;
  border-color: #bd2130 !important;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(220, 53, 69, 0.3);
}

/* 배지 */
.badge {
  font-size: 0.75rem;
  padding: 0.35rem 0.6rem;
  font-weight: 600;
  border-radius: 2px !important;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.bg-primary {
  background-color: #5b9bd5 !important;
}

/* 질문 카드 */
.question-card {
  border: 1px solid #dee2e6;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.75rem !important;
  transition: box-shadow 0.2s;
}

.question-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 0.75rem;
  background: linear-gradient(to right, #f8f9fa 0%, #ffffff 100%);
  border-bottom: 1px solid #dee2e6;
}

.question-body {
  padding: 1rem;
}

/* form-check */
.form-check {
  padding: 0.6rem 0.75rem;
  margin-bottom: 0.5rem;
  background-color: #f8f9fa;
  border-radius: 2px;
  border: 1px solid #e9ecef;
  display: flex;
  align-items: center;
}

.form-check-input {
  margin: 0 !important;
  cursor: pointer;
  width: 1.1rem !important;
  height: 1.1rem !important;
  accent-color: #5b9bd5;
  flex-shrink: 0;
  border-radius: 2px !important;
}

.form-check-label {
  font-size: 0.8rem;
  cursor: pointer;
  margin-left: 0.6rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  line-height: 1.4;
}

.form-check-label i {
  font-size: 0.75rem;
  color: #5b9bd5;
}

/* alert */
.alert {
  padding: 0.6rem 0.75rem !important;
  font-size: 0.8rem !important;
  border: 1px solid #b8daff;
  border-radius: 2px !important;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.alert-info {
  background-color: #d1ecf1;
  color: #0c5460;
}

.alert i {
  font-size: 0.9rem;
}

/* 빈 상태 메시지 */
.empty-state {
  text-align: center;
  padding: 2rem 1rem;
  color: #6c757d;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 2px;
  border: 2px dashed #dee2e6;
}

.empty-state.large {
  padding: 3rem 1rem;
}

.empty-state i {
  font-size: 2.5rem;
  color: #adb5bd;
  margin-bottom: 1rem;
  display: block;
}

.empty-state p {
  margin: 0.5rem 0 0.25rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #495057;
}

.empty-state small {
  font-size: 0.8rem;
  color: #6c757d;
}

/* 간격 조정 */
.mb-3 {
  margin-bottom: 0.75rem !important;
}

.mb-4 {
  margin-bottom: 1rem !important;
}

.gap-2 {
  gap: 0.5rem !important;
}

/* 탭 콘텐츠 */
.tab-content {
  padding-top: 1rem;
}

.tab-pane {
  display: none;
}

.tab-pane.active.show {
  display: block;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* row 간격 */
.row {
  margin-left: -0.5rem !important;
  margin-right: -0.5rem !important;
}

.row > * {
  padding-left: 0.5rem !important;
  padding-right: 0.5rem !important;
}
</style>
