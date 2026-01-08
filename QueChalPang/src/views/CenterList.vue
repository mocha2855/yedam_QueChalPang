<script setup>
import { useRouter } from 'vue-router'
import { onBeforeMount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import ArgonButton from '@/components/ArgonButton.vue'
import { Modal } from 'bootstrap'
import CenterAdd from './CenterAdd.vue'
import { useSearchStore } from '@/stores/search'

const search = useSearchStore()
const { centerSearchList } = storeToRefs(search)
const router = useRouter()
const centerInfo = (no) => {
  router.push({ path: `/center/${no}` })
}

const modalRef = ref(false)
let modalControl = null
onBeforeMount(async () => {
  setTimeout(() => {
    search.getCenterList()
  }, 10)
})
onMounted(() => {
  modalControl = new Modal(modalRef.value)
})
// 모달 열기 함수
const openModal = () => {
  modalControl.show()
}
// 모달 닫기 함수
const closeModal = () => {
  modalControl.hide()
}
// const checked = ref(false)
const getStatus = (status) => {
  return status == 'b1' ? '운영중' : '운영종료'
}
// const checkAll = () => {
//   if (checked.value == false) {
//     checked.value = true
//   } else {
//     checked.value = false
//   }
// }
const handleSuccess = (no) => {
  closeModal() // 1. 모달을 먼저 닫는다 (배경 제거됨)

  // 2. 모달이 닫히는 애니메이션 시간을 고려해 아주 잠깐 뒤에 이동하는 것이 가장 깔끔합니다.
  setTimeout(() => {
    router.push({ path: `/center/${no}` })
  }, 300)
}
</script>

<template>
  <div class="py-4 container-fluid">
    <!-- Modal -->
    <Teleport to="body">
      <div class="modal fade" id="exampleModal" ref="modalRef" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">센터등록</h5>

              <span
                @click="closeModal"
                style="cursor: pointer; font-size: 1.5rem; font-weight: bold; line-height: 1"
              >
                &times;
              </span>
            </div>
            <div class="modal-body"><CenterAdd @success="handleSuccess" /></div>
            <!-- <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">취소</button>
              <button type="button" class="btn btn-primary" @click="closeModal">확인</button>
            </div> -->
          </div>
        </div>
      </div>
    </Teleport>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header pb-0">
            <h6>센터목록</h6>
          </div>

          <div class="card-body px-0 pt-0 pb-2">
            <div class="position-relative">
              <!-- <div class="position-absolute bottom-0 end-8">
                <ArgonButton color="danger" class="p-1 mr-1">선택 삭제</ArgonButton>
              </div> -->
              <div class="position-absolute bottom-0 end-2">
                <ArgonButton color="info" variant="gradient" class="p-2" @click="openModal"
                  >센터 등록</ArgonButton
                >
              </div>
            </div>
            <div class="table-responsive p-0">
              <table class="table align-items-center">
                <thead>
                  <tr>
                    <!-- <th><ArgonCheckbox @click="checkAll()" /></th> -->
                    <th
                      class="text-center text-uppercase text-secondary text-xxs font-weight-bolder"
                    >
                      번호
                    </th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder">
                      센터명
                    </th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder">주소</th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder">
                      연락처
                    </th>
                    <th
                      class="text-center text-uppercase text-secondary text-xxs font-weight-bolder"
                    >
                      상태
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="center in centerSearchList" :key="center.center_no">
                    <!-- <td><ArgonCheckbox :id="center.center_no" :checked="checked" /></td> -->
                    <td class="align-middle text-center">
                      <p class="text-sm font-weight-bold mb-0">
                        {{ center.center_no }}
                      </p>
                    </td>
                    <td class="text-sm" @click="centerInfo(center.center_no)">
                      {{ center.center_name }}
                    </td>
                    <td class="text-sm" @click="centerInfo(center.center_no)">
                      {{ center.center_address }}
                    </td>
                    <td class="text-sm" @click="centerInfo(center.center_no)">
                      {{ center.center_tel }}
                    </td>
                    <td class="align-middle text-center">
                      <span
                        :class="{
                          badge: true,
                          'badge-sm': true,
                          'bg-gradient-success': center.center_status == 'b1' ? true : false,
                          'bg-gradient-danger': center.center_status == 'b2' ? true : false,
                        }"
                        >{{ getStatus(center.center_status) }}</span
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
