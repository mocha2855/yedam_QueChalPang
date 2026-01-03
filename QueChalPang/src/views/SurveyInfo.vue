<template>
  <div class="container">
    <!-- 헤더 -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="mb-0">조사지 상세</h4>
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
        <h6 class="mb-3">세부항목</h6>
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
                <div class="d-flex align-items-center mb-2">
                  <span class="badge bg-primary me-2">질문 {{ qIndex + 1 }}</span>
                  <span class="badge bg-secondary">{{ question.survey_qitem_type }}</span>
                </div>
                <p class="mb-0">{{ question.survey_qitem_question }}</p>
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

    <!-- 하단 버튼 -->
    <div class="mt-4 text-end">
      <button class="btn btn-primary" @click="goTosurveyUpdate(surveyInfo.no)">
        <i class="fas fa-edit"></i> 수정
      </button>
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
.nav-tabs .nav-link {
  cursor: pointer;
}

.nav-tabs .nav-link.active {
  font-weight: 600;
}

.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.form-control:read-only {
  background-color: #f8f9fa;
}
</style>
