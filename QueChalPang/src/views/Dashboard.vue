<script setup>
const stats = [
  { title: '누적 서비스 지원', value: '12,840건', change: '+12%' },
  { title: '현재 이용자 수', value: '1,200명', change: '+3%' },
  { title: '협력 복지 센터', value: '45개소', change: '전국' },
]
</script>

<template>
  <div class="dashboard">
    <!-- 히어로 배너
    <div class="hero-banner">
      <img src="/로그인찐막.jpg" alt="with us" class="banner-image" />
    </div> -->

    <!-- 컨텐츠 영역 -->
    <div class="content-area">
      <!-- 통계 카드 -->
      <div class="stats-grid">
        <div v-for="stat in stats" :key="stat.title" class="stat-card">
          <div class="stat-title">{{ stat.title }}</div>
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-change">{{ stat.change }}</div>
        </div>
      </div>

      <!-- 2단 레이아웃 -->
      <div class="two-column">
        <!-- 왼쪽: 프로그램 안내 -->
        <div class="left-column">
          <h2>지원프로그램 안내</h2>
          <p class="intro">
            발달장애인의 자립과 사회 참여를 돕기 위해 맞춤형 교육, 상담, 돌봄 서비스를 통합적으로
            제공합니다.
          </p>

          <div class="feature-list">
            <div class="feature">
              <h3>개별화 교육 계획</h3>
              <p>개개인의 특성과 요구에 맞춘 전문 교육 프로그램</p>
            </div>
            <div class="feature">
              <h3>가족 지원 시스템</h3>
              <p>보호자의 양육 부담을 덜어드리기 위한 심리 상담 및 휴식 지원</p>
            </div>
            <div class="feature">
              <h3>직업 훈련 및 연계</h3>
              <p>당당히 자립할 수 있도록 직업 역량 강화와 취업 지원</p>
            </div>
          </div>

          <button class="detail-btn">상세 안내 보기</button>
        </div>

        <!-- 오른쪽: 인용구 & 연락처 -->
        <div class="right-column">
          <div class="quote-box">
            <p class="quote">
              "장애가 벽이 되지 않는 세상,<br />
              모든 아이들이 자신의 속도대로<br />
              성장할 수 있는 환경을 만듭니다."
            </p>
          </div>

          <div class="contact-box">
            <div class="contact-item">
              <span>전문가 상담 문의</span>
              <strong>1588-0000</strong>
            </div>
            <div class="contact-item">
              <span>운영시간</span>
              <strong>평일 09:00 - 18:00</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- 발달장애 설명 -->
      <div class="description">
        <h3>발달장애인이란?</h3>
        <p>
          발달장애는 지적장애와 자폐성장애를 포함하며, 사회적 상호작용 및 의사소통 등에 어려움을
          겪는 상태를 의미합니다. 우리는 이들이 사회의 일원으로 존중받으며 살아갈 수 있도록
          <strong>조기 발견, 생애주기별 맞춤 서비스, 권리 보호</strong>에 앞장서고 있습니다.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  background: #faf8f5;
  min-height: 100vh;
}

/* 히어로 배너 - 전체 너비 */
.hero-banner {
  width: 100%;
  height: 300px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to bottom, #e8f4f8, #f5f9fa);
}

.banner-image {
  width: 80%;
  height: auto;
  max-height: 100%;
  object-fit: contain;
}

/* 컨텐츠 영역 */
.content-area {
  max-width: 1400px;
  margin: 0 auto;
  padding: 80px 60px;
}

/* 통계 그리드 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-bottom: 80px;
}

.stat-card {
  background: white;
  padding: 40px 36px;
  border-radius: 16px;
  border: 1px solid #ede7df;
}

.stat-title {
  font-size: 14px;
  color: #a18f7e;
  margin-bottom: 12px;
  font-weight: 500;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #4a3829;
  margin-bottom: 8px;
}

.stat-change {
  font-size: 13px;
  color: #917b6a;
}

/* 2단 레이아웃 */
.two-column {
  display: grid;
  grid-template-columns: 1.8fr 1fr;
  gap: 30px;
  margin-bottom: 50px;
}

.left-column,
.right-column {
  background: white;
  padding: 50px;
  border-radius: 16px;
  border: 1px solid #ede7df;
}

.left-column h2 {
  font-size: 24px;
  font-weight: 700;
  color: #4a3829;
  margin: 0 0 20px 0;
}

.intro {
  font-size: 15px;
  color: #7a6856;
  line-height: 1.7;
  margin: 0 0 50px 0;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 36px;
  margin-bottom: 50px;
}

.feature h3 {
  font-size: 17px;
  font-weight: 600;
  color: #4a3829;
  margin: 0 0 10px 0;
}

.feature p {
  font-size: 14px;
  color: #917b6a;
  line-height: 1.6;
  margin: 0;
}

.detail-btn {
  background: #c5aa8e;
  color: white;
  border: none;
  padding: 16px 36px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.detail-btn:hover {
  background: #b39676;
}

/* 오른쪽 컬럼 */
.right-column {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.quote-box {
  flex: 1;
  background: #f5efe7;
  padding: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
}

.quote {
  font-size: 16px;
  line-height: 1.8;
  color: #5c4a3a;
  margin: 0;
  font-weight: 500;
}

.contact-box {
  background: #4a3829;
  padding: 36px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.contact-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.contact-item span {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
}

.contact-item strong {
  font-size: 16px;
  color: white;
  font-weight: 600;
}

/* 설명 */
.description {
  background: white;
  padding: 50px;
  border-radius: 16px;
  border: 1px solid #ede7df;
}

.description h3 {
  font-size: 20px;
  font-weight: 700;
  color: #4a3829;
  margin: 0 0 20px 0;
}

.description p {
  font-size: 15px;
  color: #7a6856;
  line-height: 1.8;
  margin: 0;
}

.description strong {
  color: #4a3829;
  font-weight: 600;
}

@media (max-width: 1024px) {
  .stats-grid,
  .two-column {
    grid-template-columns: 1fr;
  }
}
</style>
