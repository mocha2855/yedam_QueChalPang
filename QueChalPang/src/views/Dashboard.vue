<script setup></script>

<template>
  <div class="dashboard">
    <!-- 히어로 섹션 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-grid">
          <!-- 왼쪽 위: FOR MY FAMILY -->
          <div class="hero-text">
            <h1 class="main-title">FOR MY FAMILY</h1>
          </div>

          <!-- 오른쪽 위: 이미지 영역 -->
          <div class="hero-image image-1">
            <div class="image-placeholder">
              <span>함께하는 순간</span>
            </div>
          </div>

          <!-- 왼쪽 아래: 서브 타이틀 (대각선) -->
          <div class="hero-subtitle">
            <h2>
              가족과 함께<br />
              성장하는 내일
            </h2>
            <p>발달장애인과 가족을 위한<br />맞춤형 지원 프로그램</p>
          </div>

          <!-- 오른쪽 아래: FOR OUR LIFE -->
          <div class="hero-text-right">
            <h1 class="main-title-right">FOR OUR LIFE</h1>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

body {
  overflow-x: hidden;
  margin: 0;
  padding: 0;
}

.dashboard {
  font-family: 'Cubano', sans-serif;
  background: #faf8f5;
  min-height: 100vh;
  overflow-x: hidden;
  width: 100%;
}

/* 히어로 섹션 */
.hero-section {
  width: 100%;
  min-height: 600px;
  background: linear-gradient(135deg, #f5efe7 0%, #e8dfd4 100%);
  padding: 60px 20px;
  overflow-x: hidden;
}

.hero-content {
  max-width: 1100px;
  margin: 0 auto;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 30px;
  min-height: 500px;
}

/* 왼쪽 위 타이포그래피 - FOR MY FAMILY */
.hero-text {
  grid-column: 1;
  grid-row: 1;
  display: flex;
  align-items: center;
  padding: 20px 0;
}

.main-title {
  font-size: 100px;
  font-weight: 900;
  line-height: 1.1;
  color: #4a3829;
  margin: 0;
  letter-spacing: 1px;
}

/* 오른쪽 아래 타이포그래피 - FOR OUR LIFE */
.hero-text-right {
  grid-column: 2;
  grid-row: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.main-title-right {
  font-size: 100px;
  font-weight: 900;
  line-height: 1.1;
  color: #c5aa8e;
  margin: 0;
  letter-spacing: 1px;
  text-align: center;
}

/* 이미지 영역 */
.hero-image {
  border-radius: 20px;
  overflow: hidden;
}

.image-1 {
  grid-column: 2;
  grid-row: 1;
  background: linear-gradient(135deg, #d4c4b0 0%, #c5aa8e 100%);
  max-width: 350px;
  width: 100%;
  justify-self: center;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 150px;
}

.image-placeholder span {
  font-size: 18px;
  color: white;
  font-weight: 600;
}

/* 서브 타이틀 (왼쪽 아래 대각선) */
.hero-subtitle {
  grid-column: 1;
  grid-row: 2;
  background: white;
  border-radius: 20px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hero-subtitle h2 {
  font-size: 32px;
  font-weight: 700;
  color: #4a3829;
  margin: 0 0 16px 0;
  line-height: 1.3;
}

.hero-subtitle p {
  font-size: 15px;
  color: #7a6856;
  line-height: 1.6;
  margin: 0;
}

/* 반응형 */
@media (max-width: 1200px) {
  .main-title {
    font-size: 90px;
  }

  .main-title-right {
    font-size: 90px;
  }

  .hero-subtitle h2 {
    font-size: 26px;
  }
}

@media (max-width: 1024px) {
  .hero-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    gap: 20px;
  }

  .hero-text,
  .image-1,
  .hero-subtitle,
  .hero-text-right {
    grid-column: 1;
    grid-row: auto;
  }

  .main-title {
    font-size: 70px;
  }

  .main-title-right {
    font-size: 70px;
  }
}

@media (max-width: 768px) {
  .main-title {
    font-size: 56px;
  }

  .main-title-right {
    font-size: 56px;
  }

  .hero-section {
    padding: 40px 20px;
  }
}
</style>
