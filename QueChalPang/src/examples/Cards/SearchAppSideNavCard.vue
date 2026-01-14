<script setup>
import { watch } from 'vue'
import { reactive } from 'vue'

import { useSearchStore } from '@/stores/search'
import { storeToRefs } from 'pinia'
const store = useSearchStore()
const { selectedAppBtn, selectedOption, searchText } = storeToRefs(store)
selectedOption.value = 'dependant_name'
const badges = reactive({
  all: true,
  e1: true,
  e2: true,
  e3: true,
  e4: true,
  e5: true,
})
const checkControll = () => {
  if (badges.e1 && badges.e2 && badges.e3 && badges.e4 && badges.e5) {
    badges.all = true
  } else {
    badges.all = false
  }
  let activeKey = Object.keys(badges).filter((key) => badges[key] === true && key !== 'all')
  let stringifiedKey = activeKey.join(',')
  console.log(stringifiedKey)
}
const checkAll = () => {
  if (badges.all) {
    badges.e1 = false
    badges.e2 = false
    badges.e3 = false
    badges.e4 = false
    badges.e5 = false
  } else {
    badges.e1 = true
    badges.e2 = true
    badges.e3 = true
    badges.e4 = true
    badges.e5 = true
  }
}
watch(
  badges,
  (newBadges) => {
    if (selectedAppBtn && selectedAppBtn.value) {
      selectedAppBtn.value = { ...newBadges }
    }
  },
  { deep: true, immediate: true },
)
// 사이드바를 숨길 경로 목록
</script>

<template>
  <div class="search-card card ms-3 pe-4">
    <div class="card-header pb-0 search-card__header">
      <h6 class="search-card__title">검색</h6>
    </div>

    <div class="card-body p-3 search-card__body">
      <div class="badge-grid" @click="checkControll()">
        <span class="chip" :class="{ 'is-active': badges.all }" @click="checkAll()">전체</span>
        <span class="chip" :class="{ 'is-active': badges.e1 }" @click="badges.e1 = !badges.e1">대기</span>
        <span class="chip" :class="{ 'is-active': badges.e2 }" @click="badges.e2 = !badges.e2">검토중</span>
        <span class="chip" :class="{ 'is-active': badges.e3 }" @click="badges.e3 = !badges.e3">계획</span>
        <span class="chip" :class="{ 'is-active': badges.e4 }" @click="badges.e4 = !badges.e4">중점</span>
        <span class="chip" :class="{ 'is-active': badges.e5 }" @click="badges.e5 = !badges.e5">긴급</span>
      </div>

      <div class="field">
        <label class="field__label" for="option">검색조건</label>
        <div class="select-wrap">
          <select
            class="select"
            name="option"
            id="option"
            v-model="selectedOption"
          >
            <option value="dependant_name">지원자명</option>
            <option value="a.application_no">신청서 번호</option>
            <option value="t.member_name">담당자</option>
          </select>
        </div>
      </div>

      <div class="field">
        <label class="field__label" for="value">검색어</label>
        <input
          class="input"
          type="text"
          name="value"
          id="value"
          maxlength="30"
          placeholder="예) 홍길동"
          v-model="searchText"
          @keypress.enter="store.getApplicationList(store.member)"
        />
      </div>

      <button
        type="button"
        class="btn-search"
        @click="store.getApplicationList(store.member)"
      >
        검색
      </button>
    </div>
  </div>
</template>

<style scoped>
  /* ====== 전체 톤 ====== */
.search-card {
  border: 1px solid #eef2f7;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
  background: #fff;
}

.search-card__header {
  background: linear-gradient(180deg, #ffffff 0%, #fbfcfe 100%);
  border-bottom: 1px solid #eef2f7;
  padding: 14px 16px;
}

.search-card__title {
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.2px;
  margin: 0;
  color: #0f172a; /* slate-900 */
}

.search-card__body {
  display: grid;
  gap: 12px;
}

/* ====== 뱃지 그리드 (2개 x 3줄) ====== */
.badge-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 2px;
}

/* ====== Chip(뱃지) 스타일 ====== */
.chip {
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  cursor: pointer;
  user-select: none;

  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.1px;

  color: #334155;                 /* slate-700 */
  background: #f8fafc;            /* slate-50 */
  border: 1px solid #e5e7eb;      /* gray-200 */
  transition: transform 0.08s ease, box-shadow 0.15s ease, background 0.15s ease, border-color 0.15s ease;
}

.chip:hover {
  background: #f1f5f9;
  border-color: #dbe2ea;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
}

.chip:active {
  transform: translateY(1px);
}

/* ✅ 선택된 상태 (초록 대신 "인디고/블루" 계열) */
.chip.is-active {
  color: #1e293b;                 /* slate-800 */
  border-color: rgba(99, 102, 241, 0.45);  /* indigo-500 */
  background: rgba(99, 102, 241, 0.12);
  box-shadow: 0 10px 18px rgba(99, 102, 241, 0.12);
}

/* ====== 폼 필드 ====== */
.field {
  display: grid;
  gap: 6px;
}

.field__label {
  font-size: 12px;
  font-weight: 700;
  color: #64748b; /* slate-500 */
  margin: 0;
}

/* ====== input ====== */
.input {
  height: 42px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  padding: 0 12px;

  font-size: 14px;
  font-weight: 600;
  color: #0f172a;

  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.input::placeholder {
  color: #94a3b8; /* slate-400 */
  font-weight: 600;
}

.input:focus {
  border-color: rgba(99, 102, 241, 0.6);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.16);
}

/* ====== select 커스텀 ====== */
.select-wrap {
  position: relative;
}

.select {
  width: 100%;
  height: 42px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  padding: 0 36px 0 12px;

  font-size: 14px;
  font-weight: 700;
  color: #0f172a;

  outline: none;
  appearance: none; /* 기본 화살표 제거 */
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.select:focus {
  border-color: rgba(99, 102, 241, 0.6);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.16);
}

/* select 화살표 */
.select-wrap::after {
  content: "";
  position: absolute;
  right: 12px;
  top: 50%;
  width: 10px;
  height: 10px;
  transform: translateY(-55%) rotate(45deg);
  border-right: 2px solid #94a3b8;
  border-bottom: 2px solid #94a3b8;
  pointer-events: none;
}

/* ====== 검색 버튼 ====== */
.btn-search {
  height: 44px;
  width: 100%;
  border: 0;
  border-radius: 14px;
  cursor: pointer;

  font-size: 14px;
  font-weight: 800;
  letter-spacing: -0.1px;

  color: #ffffff;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  box-shadow: 0 12px 24px rgba(79, 70, 229, 0.22);
  transition: transform 0.08s ease, box-shadow 0.15s ease, filter 0.15s ease;
}

.btn-search:hover {
  filter: brightness(1.03);
  box-shadow: 0 14px 28px rgba(79, 70, 229, 0.26);
}

.btn-search:active {
  transform: translateY(1px);
  box-shadow: 0 10px 20px rgba(79, 70, 229, 0.18);
}

</style>