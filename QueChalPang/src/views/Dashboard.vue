<script setup>
import MiniStatisticsCard from '@/examples/Cards/MiniStatisticsCard.vue'

// 통계 데이터 (발달장애인 지원 현황 예시)
const stats = {
  totalService: {
    title: '누적 서비스 지원',
    value: '12,840건',
    description: "<span class='text-sm font-weight-bolder text-success'>+12%</span> 저번 달 대비",
    icon: {
      component: 'ni ni-favourite-28',
      background: 'bg-gradient-primary',
      shape: 'rounded-circle',
    },
  },
  activeUser: {
    title: '현재 이용자 수',
    value: '1,200명',
    description: "<span class='text-sm font-weight-bolder text-success'>+3%</span> 신규 등록",
    icon: {
      component: 'ni ni-user-run',
      background: 'bg-gradient-danger',
      shape: 'rounded-circle',
    },
  },
  centerCount: {
    title: '협력 복지 센터',
    value: '45개소',
    description: '전국 네트워크 구축',
    icon: {
      component: 'ni ni-building',
      background: 'bg-gradient-success',
      shape: 'rounded-circle',
    },
  },
}
</script>

<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div v-for="(item, index) in stats" :key="index" class="col-lg-4 col-md-6 col-12 mb-4">
        <mini-statistics-card
          :title="item.title"
          :value="item.value"
          :description="item.description"
          :icon="item.icon"
        />
      </div>
    </div>

    <div class="row mt-4">
      <div class="col-lg-8 mb-4">
        <div class="card shadow-sm border-0">
          <div class="card-body p-4">
            <h3 class="font-weight-bolder mb-3 text-primary">발달장애인 지원프로그램이란?</h3>
            <p class="lead">
              본 프로그램은 발달장애인의 자립과 사회 참여를 돕기 위해 맞춤형 교육, 상담, 그리고 돌봄
              서비스를 통합적으로 제공합니다.
            </p>
            <hr class="horizontal dark my-4" />
            <h5 class="font-weight-bold">주요 지원 내용</h5>
            <ul class="list-unstyled mt-3">
              <li class="mb-2">
                <i class="ni ni-check-bold text-success me-2"></i>
                <strong>개별화 교육 계획(IEP):</strong> 개개인의 특성과 요구에 맞춘 전문 교육
                프로그램을 설계합니다.
              </li>
              <li class="mb-2">
                <i class="ni ni-check-bold text-success me-2"></i>
                <strong>가족 지원 시스템:</strong> 보호자의 양육 부담을 덜어드리기 위한 심리 상담 및
                휴식 지원 서비스를 제공합니다.
              </li>
              <li class="mb-2">
                <i class="ni ni-check-bold text-success me-2"></i>
                <strong>직업 훈련 및 연계:</strong> 사회 구성원으로서 당당히 자립할 수 있도록 직업
                역량 강화와 취업을 돕습니다.
              </li>
            </ul>
            <div class="mt-4">
              <button class="btn btn-primary btn-sm mb-0">상세 안내 보기</button>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card bg-gradient-dark shadow-sm h-100">
          <div class="card-body p-4 d-flex flex-column justify-content-center">
            <h4 class="text-white font-weight-bolder mb-3">함께 만드는 변화</h4>
            <p class="text-white opacity-8">
              "장애가 벽이 되지 않는 세상, <br />모든 아이들이 자신의 속도대로 <br />성장할 수 있는
              환경을 만듭니다."
            </p>
            <div class="mt-4">
              <div class="d-flex align-items-center mb-3">
                <i class="ni ni-chat-round text-white me-3"></i>
                <span class="text-white text-sm">전문가 상담 문의: 1588-0000</span>
              </div>
              <div class="d-flex align-items-center">
                <i class="ni ni-calendar-grid-58 text-white me-3"></i>
                <span class="text-white text-sm">운영시간: 평일 09:00 - 18:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-4">
      <div class="col-12">
        <div class="card">
          <div class="card-header pb-0 p-3">
            <h6 class="mb-0">발달장애인이란?</h6>
          </div>
          <div class="card-body p-3">
            <p class="text-sm">
              발달장애는 지적장애와 자폐성장애를 포함하며, 사회적 상호작용 및 의사소통 등에 어려움을
              겪는 상태를 의미합니다. 우리는 이들이 사회의 일원으로 존중받으며 살아갈 수 있도록
              <strong>조기 발견, 생애주기별 맞춤 서비스, 권리 보호</strong>에 앞장서고 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  transition: transform 0.2s ease;
}
.card:hover {
  transform: translateY(-5px);
}
</style>
