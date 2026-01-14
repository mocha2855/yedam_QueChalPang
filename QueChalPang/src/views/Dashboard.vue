<template>
  <div class="dashboard">
    <!-- 히어로 섹션 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="title-section">
          <h1 class="massive-title top-title">FOR MY FAMILY</h1>
          <div class="underline underline-dark"></div>
        </div>

        <div class="title-section">
          <h1 class="massive-title bottom-title">FOR OUR LIFE</h1>
          <div class="underline underline-light"></div>
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
  padding: 120px 40px 80px 40px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
}

.hero-content {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 80px;
}

.title-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 밑줄 */
.underline {
  height: 3px;
  width: 100%;
  max-width: 500px;
}

.underline-dark {
  background-color: #4a3829;
}

.underline-light {
  background-color: #c5aa8e;
  margin-left: auto;
}

/* 거대한 타이틀 */
.massive-title {
  font-size: 130px;
  font-weight: 900;
  line-height: 0.9;
  margin: 0;
  letter-spacing: -5px;
  text-transform: uppercase;
}

.top-title {
  color: #4a3829;
  text-align: left;
}

.bottom-title {
  color: #c5aa8e;
  text-align: right;
}

/* 반응형 */
@media (max-width: 1400px) {
  .massive-title {
    font-size: 110px;
    letter-spacing: -4px;
  }

  .hero-content {
    gap: 70px;
  }

  .underline {
    max-width: 450px;
  }
}

@media (max-width: 1024px) {
  .hero-section {
    padding: 100px 30px 60px 30px;
  }

  .massive-title {
    font-size: 90px;
    letter-spacing: -3px;
  }

  .hero-content {
    gap: 60px;
  }

  .underline {
    max-width: 400px;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 80px 20px 40px 20px;
  }

  .massive-title {
    font-size: 70px;
    letter-spacing: -2px;
  }

  .hero-content {
    gap: 50px;
  }

  .top-title,
  .bottom-title {
    text-align: left;
  }

  .title-section {
    gap: 15px;
  }

  .underline {
    max-width: 300px;
  }

  .underline-light {
    margin-left: 0;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 60px 20px 30px 20px;
  }

  .massive-title {
    font-size: 48px;
    letter-spacing: -1.5px;
  }

  .hero-content {
    gap: 40px;
  }

  .underline {
    max-width: 200px;
    height: 2px;
  }
}
</style>
