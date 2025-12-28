<template>
  <div class="py-4 container-fluid"></div>
  <div class="card_w-100">
    <div class="tabLeft">
      <header>
        <p>지원자 정보</p>
      </header>
      <nav>
        <RouterLink v-bind:to="{ name: 'applicationWait', params: { id: 20 } }"
          >지원신청서</RouterLink
        >
        <RouterLink v-bind:to="{ name: 'applicationPlanning', params: { id: 20 } }"
          >지원계획서</RouterLink
        >
        <p>지원결과서</p>
        <p>상담내역</p>
      </nav>
    </div>
    <div class="tabRight">
      <router-view />
    </div>
  </div>
</template>
<script setup></script>
<style scoped>
.card_w-100 {
  border: 1px #000;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  background-color: beige;
  overflow: hidden;
}

.tabLeft {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  width: 50%;
  height: 100%;
}
header {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100px;
}

.tabLeft nav {
  width: 100%;
  height: 20px;
  background-color: #fff;
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
header p {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
}
.tabRight {
  display: flex;
  flex-direction: column;
  width: 50%;
  min-height: 100%;
}
</style>
