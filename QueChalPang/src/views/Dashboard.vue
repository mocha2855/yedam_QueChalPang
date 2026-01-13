<template>
  <div class="dashboard">
    <!-- 히어로 섹션 -->
    <div class="hero-section">
      <div class="hero-content">
        <!-- 상단 영역 - FOR MY FAMILY + 온라인 통합 신청 -->
        <div class="top-section">
          <h1 class="massive-title top-title">FOR MY FAMILY</h1>
          <div class="image-card-top">
            <span>쉽고 빠른 온라인 신청</span>
          </div>
        </div>

        <!-- 하단 영역 - 통합 지원 플랫폼 + FOR OUR LIFE -->
        <div class="bottom-section">
          <div class="subtitle-card">
            <h2>발달장애 지원,<br />이제 온라인으로</h2>
            <p>등록부터 승인까지<br />한 곳에서 간편하게</p>
          </div>
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
  background: linear-gradient(to bottom, #f5efe7 0%, #f5efe7 80%, #fcf9f4 80%, #fcf9f4 100%);
  padding: 80px 40px 50px 40px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  overflow: hidden;
  position: relative;
}

.hero-content {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 50px;
}

/* 상단 섹션 */
.top-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  position: relative;
}

.top-title {
  flex: 1;
}

.image-card-top {
  width: 520px;
  height: 200px;
  background: white;
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-card-top span {
  font-size: 26px;
  color: #4a3829;
  font-weight: 700;
}

/* 하단 섹션 */
.bottom-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  position: relative;
}

.subtitle-card {
  background: white;
  border-radius: 30px;
  padding: 45px 55px;
  width: 520px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
}

.subtitle-card h2 {
  font-size: 40px;
  font-weight: 700;
  color: #4a3829;
  margin: 0 0 20px 0;
  line-height: 1.3;
}

.subtitle-card p {
  font-size: 18px;
  color: #7a6856;
  line-height: 1.6;
  margin: 0;
}

.bottom-title {
  flex: 1;
  text-align: right;
}

/* 거대한 타이틀 */
.massive-title {
  font-size: 130px;
  font-weight: 900;
  line-height: 0.9;
  margin: 0;
  letter-spacing: -5px;
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
    font-size: 110px;
    letter-spacing: -4px;
  }

  .image-card-top {
    width: 460px;
    height: 180px;
  }

  .subtitle-card {
    width: 460px;
    padding: 40px 50px;
  }

  .subtitle-card h2 {
    font-size: 36px;
  }

  .subtitle-card p {
    font-size: 17px;
  }
}

@media (max-width: 1024px) {
  .hero-section {
    padding: 60px 30px 40px 30px;
  }

  .massive-title {
    font-size: 90px;
    letter-spacing: -3px;
  }

  .top-section,
  .bottom-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .image-card-top {
    width: 100%;
    max-width: 600px;
    height: 160px;
  }

  .subtitle-card {
    width: 100%;
    max-width: 600px;
  }

  .bottom-title {
    text-align: left;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 40px 20px 30px 20px;
  }

  .massive-title {
    font-size: 70px;
    letter-spacing: -2px;
  }

  .hero-content {
    gap: 35px;
  }

  .subtitle-card {
    padding: 35px 40px;
  }

  .subtitle-card h2 {
    font-size: 32px;
  }

  .subtitle-card p {
    font-size: 16px;
  }

  .image-card-top {
    height: 140px;
  }

  .image-card-top span {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .massive-title {
    font-size: 48px;
    letter-spacing: -1.5px;
  }

  .subtitle-card {
    padding: 28px 32px;
  }

  .subtitle-card h2 {
    font-size: 26px;
  }

  .subtitle-card p {
    font-size: 15px;
  }

  .image-card-top span {
    font-size: 18px;
  }
}
</style>
