<!-- components/modals/AssignManagerModal.vue -->
<script setup>
import { ref, computed, watch } from 'vue'
import axios from 'axios'
import { useModalStore } from '@/stores/modal'
import { useApplicationStore } from '@/stores/application'

const modal = useModalStore()
const applicationStore = useApplicationStore()

console.log('[AssignManagerModal] component created')

// modal.open('assignManager', { ... }) 로 넘어온 데이터
const payload = computed(() => modal.payload || {})

// 드롭다운용 담당자 목록
const managerList = ref([])

// 선택된 담당자 ID
const managerId = ref('')

// 로딩 / 에러 상태
const loading = ref(false)
const errorMsg = ref('')

const closeModal = () => {
  managerId.value = ''
  managerList.value = []
  errorMsg.value = ''
  modal.close()
}

// 담당자 목록 불러오기
const fetchManagers = async () => {
  const dependantNo = payload.value.dependantNo
  console.log('[AssignManagerModal] dependantNo:', dependantNo)

  if (!dependantNo) {
    errorMsg.value = '지원자 번호가 없습니다.'
    managerList.value = []
    return
  }

  loading.value = true
  errorMsg.value = ''
  managerList.value = []

  try {
    const url = `/api/dependants/${dependantNo}/managers`
    console.log('[AssignManagerModal] GET', url)

    const res = await axios.get(url)
    console.log('[AssignManagerModal] response data:', res.data)

    if (Array.isArray(res.data)) {
      managerList.value = res.data
    } else if (Array.isArray(res.data.rows)) {
      managerList.value = res.data.rows
    } else {
      managerList.value = []
    }

    console.log('[AssignManagerModal] managerList:', managerList.value)
  } catch (e) {
    console.error('[AssignManagerModal] fetchManagers error:', e)
    errorMsg.value = '담당자 목록을 불러오는 중 오류가 발생했습니다.'
    managerList.value = []
  } finally {
    loading.value = false
  }
}

const confirmAssign = async () => {
  if (!managerId.value) {
    alert('배정할 담당자를 선택해주세요.')
    return
  }

  try {
    await applicationStore.assignManager(payload.value.applicationNo, managerId.value)
    alert('담당자가 배정되었습니다.')
    payload.value.onComplete?.()
    closeModal()
  } catch (e) {
    console.error('[AssignManagerModal] confirmAssign error:', e)
    alert('담당자 배정 중 오류가 발생했습니다.')
  }
}

// 모달이 열릴 때마다 담당자 목록 새로 로딩
watch(
  () => modal.visible && modal.type === 'assignManager',
  (isOpen) => {
    console.log('[AssignManagerModal] watch isOpen:', isOpen)
    if (isOpen) {
      managerId.value = ''
      fetchManagers()
    }
  },
  { immediate: true }, // 이미 열린 상태로 마운트될 수도 있으니
)
</script>

<template>
  <div
    class="modal-card"
    style="
      background: #fff;
      border-radius: 8px;
      padding: 16px 20px;
      min-width: 360px;
      max-width: 480px;
    "
  >
    <!-- header -->
    <div
      class="modal-header mb-3"
      style="display: flex; justify-content: space-between; align-items: center"
    >
      <h6 class="mb-0">담당자 배정</h6>
      <button type="button" class="btn btn-sm btn-outline-secondary" @click="closeModal">✕</button>
    </div>

    <!-- body -->
    <div class="modal-body">
      <p class="mb-1">
        <strong>{{ payload.guardianName }}</strong> 보호자의
        <strong>{{ payload.dependantName }}</strong> 님 신청서
      </p>
      <p class="text-xs text-secondary mb-3">(신청서 번호: {{ payload.applicationNo }})</p>

      <div class="mb-3">
        <label class="form-label text-sm mb-1">배정할 담당자</label>

        <select
          v-model="managerId"
          class="form-select form-select-sm"
          :disabled="loading || managerList.length === 0"
        >
          <option value="">담당자 선택</option>
          <option v-for="m in managerList" :key="m.member_id" :value="m.member_id">
            {{ m.member_name }} ({{ m.member_id }})
          </option>
        </select>

        <div v-if="loading" class="text-xs text-secondary mt-1">
          담당자 목록을 불러오는 중입니다...
        </div>
        <div v-if="errorMsg" class="text-xs text-danger mt-1">
          {{ errorMsg }}
        </div>
        <div
          v-if="!loading && !errorMsg && managerList.length === 0"
          class="text-xs text-secondary mt-1"
        >
          배정 가능한 담당자가 없습니다.
        </div>
      </div>
    </div>

    <!-- footer -->
    <div class="modal-footer mt-3" style="display: flex; justify-content: flex-end; gap: 8px">
      <button type="button" class="btn btn-secondary btn-sm mb-0" @click="closeModal">취소</button>
      <button type="button" class="btn btn-primary btn-sm mb-0" @click="confirmAssign">
        배정하기
      </button>
    </div>
  </div>
</template>
