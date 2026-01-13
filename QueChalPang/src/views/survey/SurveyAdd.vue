<template>
  <div class="container">
    <!-- 헤더 -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="mb-0">지원서 등록</h4>
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
            :key="subtitle.id"
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
            :key="subtitle.id"
            class="tab-pane"
            :class="{ active: activeTab === sIndex, show: activeTab === sIndex }"
          >
            <!-- 세부항목 삭제 버튼 -->
            <div class="text-end mb-4" v-if="surveyInfo.subtitles.length > 1">
              <button
                @click="deleteSubtitle(subtitle.id)"
                class="btn btn-sm btn-outline-danger"
                type="button"
              >
                <i class="fas fa-trash"></i> 세부항목 삭제
              </button>
            </div>

            <!-- 세부항목 내용 -->
            <div class="mb-4">
              <label class="form-label fw-bold">세부항목 내용</label>
              <textarea
                class="form-control"
                v-model="subtitle.subtitle"
                rows="3"
                placeholder="세부항목 입력"
              ></textarea>
            </div>

            <!-- 세부항목 설명 -->
            <div class="mb-4">
              <label class="form-label fw-bold">세부항목 설명</label>
              <input
                class="form-control"
                v-model="subtitle.subtitleDetail"
                placeholder="세부항목 설명 입력"
              />
            </div>

            <hr />

            <!-- 질문 목록 헤더 -->
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h6 class="mb-0">질문 목록</h6>
              <button
                @click="addQuestion(subtitle.id)"
                class="btn btn-sm btn-outline-primary"
                type="button"
              >
                <i class="fas fa-plus"></i> 질문 추가
              </button>
            </div>

            <!-- 질문 카드 -->
            <div
              v-for="(question, qIndex) in subtitle.questions"
              :key="question.id"
              class="question-card mb-3"
            >
              <div class="question-header">
                <span class="badge bg-primary">질문 {{ qIndex + 1 }}</span>
                <button
                  v-if="subtitle.questions.length > 1"
                  @click="deleteQuestion(subtitle.id, question.id)"
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
                  <input class="form-control" v-model="question.text" placeholder="질문 내용" />
                </div>

                <!-- 질문 타입 -->
                <div class="mb-3">
                  <label class="form-label">질문 타입</label>
                  <select class="form-control" v-model="question.type">
                    <option>예/아니오</option>
                    <option>객관식</option>
                    <option>주관식</option>
                  </select>
                </div>

                <!-- 예/아니오일 때만 보임 -->
                <div v-if="question.type === '예/아니오'">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="question.needDetail"
                      :id="'detail-' + question.id"
                    />
                    <label class="form-check-label" :for="'detail-' + question.id">
                      "예" 선택 시 추가 입력 받기
                    </label>
                  </div>
                  <!-- 체크박스 선택하면 안내 메시지 -->
                  <div v-if="question.needDetail" class="alert alert-info mt-2 mb-0">
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
              v-if="!subtitle.questions || subtitle.questions.length === 0"
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
      <button class="btn btn-primary" @click="addSurvey"><i class="fas fa-save"></i> 저장</button>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { reactive, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()

// 활성화된 탭 인덱스
const activeTab = ref(0)

const surveyInfo = reactive({
  no: '',
  survey_version: '',
  title: '',
  subtitles: [], //여기 배열에 질문,세부항목,설명 다들어감
})

// 세부항목 추가
const addSubtitle = () => {
  const newSubtitleId = Date.now() //새 항목id

  surveyInfo.subtitles.push({
    id: newSubtitleId,
    subtitle: '',
    subtitleDetail: '',
    questions: [],
  })

  // 새로 추가된 탭으로 이동
  activeTab.value = surveyInfo.subtitles.length - 1

  addQuestion(newSubtitleId)
}

// 세부항목 삭제
const deleteSubtitle = (subtitleId) => {
  surveyInfo.subtitles = surveyInfo.subtitles.filter((s) => s.id !== subtitleId)

  // 삭제 후 첫 번째 탭으로 이동
  if (activeTab.value >= surveyInfo.subtitles.length) {
    activeTab.value = Math.max(0, surveyInfo.subtitles.length - 1)
  }
}

// 질문 추가
const addQuestion = (subtitleId) => {
  const subtitle = surveyInfo.subtitles.find((s) => s.id === subtitleId)
  subtitle.questions.push({
    id: Date.now(),
    text: '',
    type: '예/아니오',
    needDetail: false,
  })
}

// 질문 삭제
const deleteQuestion = (subtitleId, questionId) => {
  //해당 세부항목 찾기
  const subtitle = surveyInfo.subtitles.find((s) => s.id === subtitleId)
  //세부항목에서 질문 삭제
  subtitle.questions = subtitle.questions.filter((q) => q.id !== questionId)
}

//조사지 등록
const addSurvey = async () => {
  // 저장 확인 창
  const confirmResult = await Swal.fire({
    icon: 'question',
    title: '저장하시겠습니까?',
    showCancelButton: true,
    confirmButtonText: '저장',
    cancelButtonText: '취소',
  })

  if (!confirmResult.isConfirmed) return

  try {
    const result = await axios.post('/api/surveys', surveyInfo)

    //등록 성공
    if (result.data) {
      await Swal.fire({
        icon: 'success',
        title: '등록되었습니다!',
        showConfirmButton: false,
        timer: 1500,
      })
      router.push({ name: 'SurveyList' })
    }
  } catch (error) {
    await Swal.fire({
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

onMounted(() => {
  addSubtitle() // 세부항목 1개 추가
})
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
