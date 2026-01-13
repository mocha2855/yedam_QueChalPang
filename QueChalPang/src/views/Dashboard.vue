<script setup></script>

<template>
  <div class="dashboard">
    <!-- 히어로 섹션 -->
    <div class="hero-section">
      <div class="hero-content">
        <!-- 상단 영역 -->
        <div class="top-section">
          <h1 class="massive-title top-title">FOR MY FAMILY</h1>
          <div class="image-card-top">
            <div class="image-placeholder">
              <span>함께 준비하는 시간</span>
            </div>
          </div>
        </div>

        <!-- 중간 영역 -->
        <div class="middle-section">
          <div class="subtitle-card">
            <h2>대기자 가족,<br />지금 시작하세요</h2>
            <p>서비스 대기 가족을 위한<br />실질적 지원</p>
          </div>
        </div>

        <!-- 하단 영역 -->
        <div class="bottom-section">
          <h1 class="massive-title bottom-title">FOR OUR LIFE</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.dashboard {
  font-family:
    'Pretendard',
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
  background: #faf8f5;
  min-height: 100vh;
  width: 100%;
}

.hero-section {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5efe7 0%, #e8dfd4 100%);
  padding: 80px 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-content {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* 상단 섹션 */
.top-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  position: relative;
}

.top-title {
  flex: 1;
}

.image-card-top {
  width: 380px;
  height: 280px;
  background: linear-gradient(135deg, #d4c4b0 0%, #c5aa8e 100%);
  border-radius: 40px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-placeholder span {
  font-size: 24px;
  color: white;
  font-weight: 700;
}

/* 중간 섹션 */
.middle-section {
  display: flex;
  justify-content: flex-start;
  padding-left: 60px;
}

.subtitle-card {
  background: white;
  border-radius: 40px;
  padding: 50px 60px;
  max-width: 550px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.subtitle-card h2 {
  font-size: 44px;
  font-weight: 700;
  color: #4a3829;
  margin: 0 0 24px 0;
  line-height: 1.2;
}

.subtitle-card p {
  font-size: 18px;
  color: #7a6856;
  line-height: 1.7;
  margin: 0;
}

/* 하단 섹션 */
.bottom-section {
  display: flex;
  justify-content: flex-end;
}

.bottom-title {
  text-align: right;
}

/* 거대한 타이틀 */
.massive-title {
  font-size: 160px;
  font-weight: 900;
  line-height: 0.9;
  margin: 0;
  letter-spacing: -6px;
  text-transform: uppercase;
  white-space: nowrap;
}

.top-title {
  color: #4a3829;
}

.bottom-title {
  color: #c5aa8e;
}

/* 반응형 */
@media (max-width: 1400px) {
  .massive-title {
    font-size: 130px;
  }

  .image-card-top {
    width: 320px;
    height: 240px;
  }

  .subtitle-card h2 {
    font-size: 38px;
  }
}

@media (max-width: 1024px) {
  .hero-section {
    padding: 60px 40px;
  }

  .massive-title {
    font-size: 100px;
    letter-spacing: -4px;
  }

  .top-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .image-card-top {
    width: 100%;
    max-width: 500px;
  }

  .middle-section {
    padding-left: 0;
  }

  .subtitle-card {
    max-width: 100%;
  }

  .bottom-section {
    justify-content: flex-start;
  }

  .bottom-title {
    text-align: left;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 40px 20px;
  }

  .massive-title {
    font-size: 70px;
    letter-spacing: -3px;
  }

  .hero-content {
    gap: 30px;
  }

  .subtitle-card {
    padding: 40px;
  }

  .subtitle-card h2 {
    font-size: 32px;
  }

  .subtitle-card p {
    font-size: 16px;
  }

  .image-card-top {
    height: 220px;
  }
}

@media (max-width: 480px) {
  .massive-title {
    font-size: 48px;
    letter-spacing: -2px;
  }

  .subtitle-card {
    padding: 30px;
  }

  .subtitle-card h2 {
    font-size: 26px;
  }

  .subtitle-card p {
    font-size: 14px;
  }

  .image-placeholder span {
    font-size: 18px;
  }
}
</style>
