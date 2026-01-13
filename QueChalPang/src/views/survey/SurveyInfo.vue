<template>
  <div class="container">
    <!-- 헤더 -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="mb-0">지원서 상세</h4>
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
            <input class="form-control" type="text" v-model="surveyInfo.title" readonly />
          </div>
        </div>
      </div>
    </div>

    <!-- 세부항목 탭 -->
    <div class="card">
      <div class="card-header pb-0">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h6 class="mb-0">세부항목</h6>
          <button class="btn btn-sm btn-primary" @click="goTosurveyUpdate(surveyInfo.no)">
            <i class="fas fa-edit"></i> 수정
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
            <!-- 세부항목 내용 -->
            <div class="mb-4">
              <label class="form-label fw-bold">세부항목 내용</label>
              <textarea
                class="form-control"
                v-model="subtitle.survey_subtitle"
                readonly
                rows="3"
              ></textarea>
            </div>

            <!-- 세부항목 설명 -->
            <div class="mb-4">
              <label class="form-label fw-bold">세부항목 설명</label>
              <input class="form-control" v-model="subtitle.survey_subtitle_detail" readonly />
            </div>

            <hr />

            <!-- 질문 목록 -->
            <h6 class="mb-3">질문 목록</h6>
            <div
              v-for="(question, qIndex) in subtitle.questionList"
              :key="question.survey_qitem_no"
              class="card mb-3"
            >
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <span class="badge bg-primary">질문 {{ qIndex + 1 }}</span>
                </div>

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
              등록된 질문이 없습니다.
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
/* 컨테이너 상단 여백 - margin-top 제거 */
.container {
  padding-top: 0.5rem;
}

/* 네비와 헤더 간격 축소 */
.d-flex.justify-content-between.align-items-center {
  margin-bottom: 0.75rem !important;
}

/* 헤더 크기 */
h4 {
  font-size: 1.1rem;
  margin-bottom: 0 !important;
}

h6 {
  font-size: 0.9rem;
  margin-bottom: 0 !important;
}

/* 카드 여백 축소 */
.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  margin-bottom: 0.75rem !important;
}

.card-header {
  padding: 0.5rem 0.75rem !important;
}

.card-body {
  padding: 0.75rem !important;
}

/* 탭 스타일 */
.nav-tabs {
  margin-bottom: 0 !important;
}

.nav-tabs .nav-link {
  cursor: pointer;
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
}

.nav-tabs .nav-link.active {
  font-weight: 600;
}

/* 폼 레이블 */
.form-label {
  margin-bottom: 0.25rem !important;
  font-size: 0.85rem;
}

/* 폼 컨트롤 */
.form-control {
  padding: 0.4rem 0.6rem !important;
  font-size: 0.85rem !important;
  height: calc(1.5em + 0.8rem + 2px) !important;
}

.form-control:read-only {
  background-color: #f8f9fa;
}

/* textarea */
textarea.form-control {
  height: auto !important;
  min-height: 60px !important;
}

/* 버튼 크기 */
.btn-sm {
  padding: 0.35rem 0.65rem;
  font-size: 0.8rem;
}

/* 배지 */
.badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
}

/* 마진 축소 */
.mb-4 {
  margin-bottom: 0.75rem !important;
}

.mb-3 {
  margin-bottom: 0.5rem !important;
}

.mb-2 {
  margin-bottom: 0.35rem !important;
}

.mb-1 {
  margin-bottom: 0.2rem !important;
}

/* 패딩 축소 */
.py-4 {
  padding-top: 0.75rem !important;
  padding-bottom: 0.75rem !important;
}

.py-3 {
  padding-top: 0.5rem !important;
  padding-bottom: 0.5rem !important;
}

.py-2 {
  padding-top: 0.35rem !important;
  padding-bottom: 0.35rem !important;
}

/* hr 여백 축소 */
hr {
  margin: 0.75rem 0 !important;
}

/* alert 크기 */
.alert {
  padding: 0.5rem 0.75rem !important;
  font-size: 0.8rem !important;
}

.alert small {
  font-size: 0.75rem !important;
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

/* 빈 상태 메시지 */
.text-center.text-muted {
  font-size: 0.85rem;
  padding: 0.75rem 0 !important;
}
</style>
