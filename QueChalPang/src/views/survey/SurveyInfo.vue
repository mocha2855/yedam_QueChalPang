<template>
  <div class="container">
    <!-- 헤더 -->
    <div class="header-section">
      <h4 class="mb-0">지원서 상세</h4>
      <div class="header-actions">
        <button class="btn btn-sm btn-primary" @click="goTosurveyUpdate(surveyInfo.no)">
          <i class="fas fa-edit"></i> 수정
        </button>
        <button class="btn btn-sm btn-outline-secondary" @click="goBack">
          <i class="fas fa-list"></i> 목록
        </button>
      </div>
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
            <input class="form-control" type="text" v-model="surveyInfo.title" readonly />
          </div>
        </div>
      </div>
    </div>

    <!-- 세부항목 탭 -->
    <div class="card">
      <div class="card-header pb-0">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h6 class="mb-0"><i class="fas fa-folder-open"></i> 세부항목</h6>
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
              {{ subtitle.survey_subtitle }}
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
            <!-- 세부항목 정보 섹션 -->
            <div class="subtitle-section">
              <div class="section-header">
                <h6><i class="fas fa-info-circle"></i> 세부항목 정보</h6>
              </div>

              <!-- 세부항목 내용 -->
              <div class="mb-3">
                <label class="form-label fw-bold">
                  <i class="fas fa-heading"></i> 세부항목 제목
                </label>
                <textarea
                  class="form-control"
                  v-model="subtitle.survey_subtitle"
                  readonly
                  rows="2"
                ></textarea>
              </div>

              <!-- 세부항목 설명 -->
              <div class="mb-4">
                <label class="form-label fw-bold">
                  <i class="fas fa-align-left"></i> 세부항목 설명
                </label>
                <input class="form-control" v-model="subtitle.survey_subtitle_detail" readonly />
              </div>
            </div>

            <!-- 구분선 -->
            <div class="divider"></div>

            <!-- 질문 목록 섹션 -->
            <div class="questions-section">
              <div class="section-header">
                <h6><i class="fas fa-question-circle"></i> 질문 목록</h6>
              </div>

              <!-- 질문 카드 -->
              <div
                v-for="(question, qIndex) in subtitle.questionList"
                :key="question.survey_qitem_no"
                class="question-card mb-3"
              >
                <div class="question-header">
                  <span class="badge bg-primary"> <i></i> 질문 {{ qIndex + 1 }} </span>
                </div>

                <div class="question-body">
                  <!-- 질문 내용 -->
                  <div class="mb-3">
                    <label class="form-label fw-bold">질문 내용</label>
                    <input class="form-control" v-model="question.survey_qitem_question" readonly />
                  </div>

                  <!-- 질문 타입 -->
                  <div class="mb-3">
                    <label class="form-label fw-bold">질문 타입</label>
                    <input class="form-control" v-model="question.survey_qitem_type" readonly />
                  </div>

                  <!-- 예/아니요일 때 추가 입력 정보 표시 -->
                  <div v-if="question.survey_qitem_type === '예/아니요' && question.need_detail">
                    <div class="alert alert-info mb-0">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSurveyStore } from '@/stores/survey'

const route = useRoute()
const router = useRouter()
const store = useSurveyStore()

defineProps({
  no: [Number, String],
})

const surveyInfo = reactive({
  no: '',
  title_no: '',
  title: '',
  subtitles: [],
})

// 활성화된 탭 인덱스
const activeTab = ref(0)

onMounted(async () => {
  await store.fetchSurveyDetail(route.params.no)
  const data = store.surveyDetail
  if (data) {
    surveyInfo.no = data.survey_no || ''
    surveyInfo.title_no = data.survey_title_no || ''
    surveyInfo.title = data.survey_title || ''
    surveyInfo.subtitles = data.subtitles || []
  }
  console.log(surveyInfo)
})

const goBack = () => {
  router.push({ name: 'SurveyList' })
}

const goTosurveyUpdate = () => {
  router.push({
    name: 'surveyUpdate',
    params: { no: surveyInfo.no },
  })
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
}

.form-control:read-only {
  background-color: #f8f9fa;
  cursor: default;
}

textarea.form-control {
  min-height: 60px !important;
  resize: vertical;
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

.empty-state i {
  font-size: 2.5rem;
  color: #adb5bd;
  margin-bottom: 1rem;
  display: block;
}

.empty-state p {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #495057;
}

/* 간격 조정 */
.mb-3 {
  margin-bottom: 0.75rem !important;
}

.mb-4 {
  margin-bottom: 1rem !important;
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
