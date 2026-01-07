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
  <div class="card ms-3 pe-4">
    <div class="card-header pb-0">
      <h6>검색</h6>
    </div>

    <div class="card-bodyp-2">
      <div class="position-relative">
        <!-- <div class="position-absolute bottom-0 end-8">
                  <ArgonButton color="danger" class="p-1 mr-1">선택 삭제</ArgonButton>
                </div> -->
        <div class="position-absolute bottom-0 end-2"></div>
      </div>
      <div class="p-2">
        <ul style="list-style: none; margin-bottom: 0">
          <div @click="checkControll()">
            <li class="d-flex justify-content-around">
              <span
                :style="{ cursor: 'pointer', width: '30%' }"
                class="badge badge-sm"
                :class="{ 'bg-success': badges.all, 'bg-light': !badges.all }"
                @click="checkAll()"
              >
                전체
              </span>
              <span
                :style="{ cursor: 'pointer', width: '30%' }"
                class="badge badge-sm"
                :class="{ 'bg-success': badges.e1, 'bg-light': !badges.e1 }"
                @click="badges.e1 ? (badges.e1 = false) : (badges.e1 = true)"
              >
                대기
              </span>
              <span
                :style="{ cursor: 'pointer', width: '30%' }"
                class="badge badge-sm"
                :class="{ 'bg-success': badges.e2, 'bg-light': !badges.e2 }"
                @click="badges.e2 ? (badges.e2 = false) : (badges.e2 = true)"
              >
                검토중
              </span>
            </li>
            <li class="d-flex justify-content-around mt-1">
              <span
                :style="{ cursor: 'pointer', width: '30%' }"
                class="badge badge-sm"
                :class="{ 'bg-success': badges.e3, 'bg-light': !badges.e3 }"
                @click="badges.e3 ? (badges.e3 = false) : (badges.e3 = true)"
              >
                계획
              </span>
              <span
                :style="{ cursor: 'pointer', width: '30%' }"
                class="badge badge-sm"
                :class="{ 'bg-success': badges.e4, 'bg-light': !badges.e4 }"
                @click="badges.e4 ? (badges.e4 = false) : (badges.e4 = true)"
              >
                중점
              </span>
              <span
                :style="{ cursor: 'pointer', width: '30%' }"
                class="badge badge-sm"
                :class="{ 'bg-success': badges.e5, 'bg-light': !badges.e5 }"
                @click="badges.e5 ? (badges.e5 = false) : (badges.e5 = true)"
              >
                긴급
              </span>
            </li>
          </div>
          <li>
            <span>
              <label for="option">검색조건</label>
              <select
                class="text-center input-group mb-3"
                style="font-size: small"
                name="option"
                id="option"
                v-model="selectedOption"
              >
                <option value="dependant_name">지원자명</option>
                <option value="a.application_no">신청서 번호</option>
                <option value="t.member_name">담당자</option>
              </select>
            </span>
          </li>
          <li>
            <span>
              <input
                class="form-control"
                style="display: flex"
                type="text"
                name="value"
                id="value"
                maxlength="30"
                placeholder="검색"
                v-model="searchText"
                @keypress.enter="store.getApplicationList(store.member)"
              />
            </span>
          </li>
          <li class="d-flex justify-content-end mt-2">
            <button
              type="button"
              class="btn btn-primary pb-1 pt-1 ps-2 pe-2"
              @click="store.getApplicationList(store.member)"
            >
              검색
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
