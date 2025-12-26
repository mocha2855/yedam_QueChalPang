<template>
  <div class="container">
    <div class="card-header">
      <h5>지원계획 입력하기</h5>
      <button type="button">계획추가</button>
    </div>
    <div class="card-body">
      <div class="planningInfo">
        <div class="formTop">
          <p>지원계획 입력</p>
          <button>임시저장</button>
          <button>삭제</button>
        </div>
        <form action="#" name="planning">
          <label for="planningtime">지원기간</label>
          <input type="date" />
        </form>
      </div>
    </div>
  </div>
</template>
<script setup></script>
<style scoped>
.container {
  display: flex;
  padding: 0px;
  width: 100%;
  height: 448.5px;
  flex-direction: column;
  background-color: white;
}
.card-header {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
}
h5 {
  margin: 0px;
}
button {
  font-size: 10px;
  width: 40px;
  height: 20px;
  padding: 0px;
  border: 1px solid black;
}
.formTop {
  display: flex;
  flex-direction: row;
}
.formTop p {
  flex-grow: 15;
}
.formTop button {
  flex-grow: 1;
}
</style>
