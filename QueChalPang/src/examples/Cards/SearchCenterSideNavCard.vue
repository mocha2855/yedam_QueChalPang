<script setup>
import { onBeforeMount, watch } from 'vue'
import { reactive } from 'vue'

import { useSearchStore } from '@/stores/search'
import { storeToRefs } from 'pinia'
const store = useSearchStore()
const { selectedCenterBtn, selectedOption, searchText } = storeToRefs(store)
selectedOption.value = 'dependant_name'
const badges = reactive({
  b1: true,
  b2: true,
})

watch(
  badges,
  (newBadges) => {
    selectedCenterBtn.value = { ...newBadges }
  },
  { deep: true, immediate: true },
)
onBeforeMount(() => {
  searchText.value = ''
  store.selectedOption = 'center_name'
})
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
          <div>
            <li class="d-flex justify-content-around">
              <span
                :style="{ cursor: 'pointer', width: '40%' }"
                class="badge badge-sm"
                :class="{ 'bg-success': badges.b1, 'bg-light': !badges.b1 }"
                @click="badges.b1 ? (badges.b1 = false) : (badges.b1 = true)"
              >
                운영중
              </span>
              <span
                :style="{ cursor: 'pointer', width: '40%' }"
                class="badge badge-sm"
                :class="{ 'bg-danger': badges.b2, 'bg-light': !badges.b2 }"
                @click="badges.b2 ? (badges.b2 = false) : (badges.b2 = true)"
              >
                운영종료
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
                <option value="center_name">센터명</option>
                <option value="center_tel">연락처</option>
                <option value="center_address">주소</option>
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
                @keypress.enter="store.getCenterList()"
              />
            </span>
          </li>
          <li class="d-flex justify-content-end mt-2">
            <button
              type="button"
              class="btn btn-primary pb-1 pt-1 ps-2 pe-2"
              @click="store.getCenterList()"
            >
              검색
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
