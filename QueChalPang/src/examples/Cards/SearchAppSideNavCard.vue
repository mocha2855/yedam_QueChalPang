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
        <span class="chip" :class="{ 'is-active': badges.e1 }" @click="badges.e1 = !badges.e1"
          >대기</span
        >
        <span class="chip" :class="{ 'is-active': badges.e2 }" @click="badges.e2 = !badges.e2"
          >검토중</span
        >
        <span class="chip" :class="{ 'is-active': badges.e3 }" @click="badges.e3 = !badges.e3"
          >계획</span
        >
        <span class="chip" :class="{ 'is-active': badges.e4 }" @click="badges.e4 = !badges.e4"
          >중점</span
        >
        <span class="chip" :class="{ 'is-active': badges.e5 }" @click="badges.e5 = !badges.e5"
          >긴급</span
        >
      </div>

      <div class="field">
        <label class="field__label" for="option">검색조건</label>
        <div class="select-wrap">
          <select class="select" name="option" id="option" v-model="selectedOption">
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
          placeholder="검색"
          v-model="searchText"
          @keypress.enter="store.getApplicationList(store.member)"
        />
      </div>

      <button type="button" class="btn-search" @click="store.getApplicationList(store.member)">
        검색
      </button>
    </div>
  </div>
</template>

<style scoped>
.search-card {
  border: 1px solid #e6edf5;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(78, 147, 203, 0.12);
  background: #fff;
}

.search-card__header {
  background: linear-gradient(180deg, #ffffff 0%, #f7fbff 100%);
  border-bottom: 1px solid #e6edf5;
  padding: 14px 16px;
}

.search-card__title {
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.2px;
  margin: 0;
  color: #0f172a;
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

/* ====== Chip(뱃지) ====== */
.chip {
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  cursor: pointer;
  user-select: none;

  font-size: 14px;
  font-weight: 800;
  letter-spacing: -0.1px;

  color: #334155;
  background: #f8fafc;
  border: 1px solid #e5e7eb;

  transition:
    transform 0.08s ease,
    box-shadow 0.15s ease,
    background 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;
}

.chip:hover {
  background: #f1f7fd;
  border-color: #cfe1f0;
  box-shadow: 0 8px 18px rgba(78, 147, 203, 0.14);
}

.chip:active {
  transform: translateY(1px);
}

.chip.is-active {
  color: #0b2a3d; /* 진한 네이비 톤 */
  background: rgba(78, 147, 203, 0.14);
  border-color: rgba(78, 147, 203, 0.55);
  box-shadow: 0 10px 18px rgba(78, 147, 203, 0.18);
}

/* ====== 폼 필드 ====== */
.field {
  display: grid;
  gap: 6px;
}

.field__label {
  font-size: 12px;
  font-weight: 800;
  color: #64748b;
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
  font-weight: 700;
  color: #0f172a;

  outline: none;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.input::placeholder {
  color: #94a3b8;
  font-weight: 700;
}

.input:focus {
  border-color: rgba(78, 147, 203, 0.75);
  box-shadow: 0 0 0 4px rgba(78, 147, 203, 0.18);
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
  font-weight: 800;
  color: #0f172a;

  outline: none;
  appearance: none;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.select:focus {
  border-color: rgba(78, 147, 203, 0.75);
  box-shadow: 0 0 0 4px rgba(78, 147, 203, 0.18);
}

/* select 화살표 */
.select-wrap::after {
  content: '';
  position: absolute;
  right: 12px;
  top: 50%;
  width: 10px;
  height: 10px;
  transform: translateY(-55%) rotate(45deg);
  border-right: 2px solid rgba(78, 147, 203, 0.9);
  border-bottom: 2px solid rgba(78, 147, 203, 0.9);
  pointer-events: none;
}

/* ====== 검색 버튼 ====== */
.btn-search {
  height: 46px;
  width: 100%;
  border: 0;
  border-radius: 14px;
  cursor: pointer;

  font-size: 14px;
  font-weight: 900;
  letter-spacing: -0.1px;

  color: #ffffff;
  background: linear-gradient(135deg, #4e93cb 0%, #3f86c2 100%);
  box-shadow: 0 14px 28px rgba(78, 147, 203, 0.28);

  transition:
    transform 0.08s ease,
    box-shadow 0.15s ease,
    filter 0.15s ease;
}

.btn-search:hover {
  filter: brightness(1.03);
  box-shadow: 0 16px 32px rgba(78, 147, 203, 0.32);
}

.btn-search:active {
  transform: translateY(1px);
  box-shadow: 0 12px 24px rgba(78, 147, 203, 0.24);
}
</style>
