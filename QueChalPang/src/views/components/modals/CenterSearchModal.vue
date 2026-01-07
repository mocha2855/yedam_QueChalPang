<!-- CenterSearchModal.vue  -->
<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5>기관 검색</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <!-- 팀원의 페이지 코드 그대로 복사 -->
          <div class="container">
            <div class="row justify-content-center">
              <div class="col-lg-12">
                <div class="row">
                  <div class="col-4">
                    <select class="form-select" name="key" id="key" v-model="key">
                      <option value="center_name" selected="true">센터명</option>
                      <option value="center_address">주소</option>
                      <option value="center_tel">연락처</option>
                    </select>
                  </div>
                  <div class="col-6">
                    <argon-input id="value" v-model="value" placeholder="검색" />
                  </div>
                  <div class="col-2">
                    <argon-button
                      type="button"
                      class="p-2 btn btn-primary w-100"
                      @click="getCenterList"
                    >
                      찾기
                    </argon-button>
                  </div>
                </div>
                <div class="row mt-3">
                  <div class="col-12">
                    <!-- CenterTable 컴포넌트에 select 이벤트 추가 -->
                    <center-table-for-admin :list="centerList" @select="handleSelect" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ArgonInput from '@/components/ArgonInput.vue'
import ArgonButton from '@/components/ArgonButton.vue'
import CenterTableForAdmin from '../CenterTableForAdmin.vue'
import axios from 'axios'

const value = ref('')
const key = ref('center_name')
const centerList = ref([])

const emit = defineEmits(['close', 'select'])

const getCenterList = async () => {
  let result = await axios.get(`/api/centers?key=${key.value}&value=${value.value}`)
  centerList.value = result.data
}

const handleSelect = (center) => {
  emit('select', center)
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-content {
  background: white;
  border-radius: 8px;
  max-height: 80vh;
  overflow-y: auto;
}
</style>
