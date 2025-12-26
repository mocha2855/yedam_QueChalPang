<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header pb-0">
            <div class="d-flex justify-content-between">
              <h6>설문지 상세</h6>
              <button class="btn btn-sm btn-secondary" @click="goBack">목록으로</button>
            </div>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table align-items-center mb-0">
                <thead>
                  <tr>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder">항목</th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder">
                      세부항목
                    </th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder">
                      세부항목 설명
                    </th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder">질문</th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder">유형</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in surveyDetail" :key="item.survey_qitem_no">
                    <td class="text-sm">{{ item.survey_title }}</td>
                    <td class="text-sm">{{ item.survey_subtitle }}</td>
                    <td class="text-sm">{{ item.survey_subtitle_detail }}</td>
                    <td class="text-sm">{{ item.survey_qitem_question }}</td>
                    <td class="text-sm">
                      <span class="badge badge-sm bg-gradient-info">{{
                        item.survey_qitem_type
                      }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSurveyStore } from '@/stores/survey'

const route = useRoute()
const router = useRouter()
const store = useSurveyStore()

const surveyDetail = computed(() => store.surveyDetail)

onMounted(() => {
  const no = route.params.no
  store.fetchSurveyDetail(no)
})

const goBack = () => {
  router.push({ name: 'SurveyList' })
}
</script>
