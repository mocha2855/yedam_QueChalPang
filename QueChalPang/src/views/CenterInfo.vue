<script setup>
import { useCenterStore } from '@/stores/center'
import { useRouter, useRoute } from 'vue-router'
import { onBeforeMount, reactive } from 'vue'
import ArgonButton from '@/components/ArgonButton.vue'
import ArgonInput from '@/components/ArgonInput.vue'
import Swal from 'sweetalert2'
import axios from 'axios'
const store = useCenterStore()
const route = useRoute()
const router = useRouter()
const centerList = () => {
  router.push({ name: `centerList` })
}
const center = reactive({
  name: '',
  address: '',
  tel: '',
  start: '',
  end: '',
  status: '',
  email: '',
  lunch: '',
})

onBeforeMount(async () => {
  await store.getInfo(getNo())
  center.name = store.centerInfo.center_name
  center.address = store.centerInfo.center_address.replaceAll('|', ' ')
  center.tel = store.centerInfo.center_tel
  center.email = store.centerInfo.center_email
  center.lunch = store.centerInfo.center_lunch.split(':')[0]
  center.start = chageDate(store.centerInfo.center_start)
  center.end =
    store.centerInfo.center_end == null
      ? '운영이 종료되지 않았습니다.'
      : chageDate(store.centerInfo.center_end)
  center.status = getStatus(store.centerInfo.center_status)
})
const getNo = () => {
  const routeArr = route.path.split('/')
  return routeArr[2]
}
const getStatus = (status) => {
  return status == 'b1' ? '운영중' : '운영종료'
}
const chageDate = (input) => {
  let date = new Date(input)
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 `
}
const toUpdate = () => {
  router.push({ name: 'centerUpdate', params: { no: getNo() } })
}
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  },
})
const endCenter = () => {
  Swal.fire({
    title: '정말로 종료 하시겠습니까?',
    text: '다시 되돌릴 수 없습니다. 신중하세요.',
    icon: 'warning',
    buttonsStyling: false,
    showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
    confirmButtonText: '종료', // confirm 버튼 텍스트 지정
    cancelButtonText: '취소', // cancel 버튼 텍스트 지정
    customClass: {
      confirmButton: 'my-swal-confirm',
      cancelButton: 'my-swal-cancel',
    },
  }).then(async (result) => {
    // 만약 Promise리턴을 받으면,
    if (result.isConfirmed) {
      // 만약 모달창에서 confirm 버튼을 눌렀다면

      let result = await axios.put(`/api/centerEnd/${getNo()}`)
      if (result.affectedRows == 0) {
        Toast.fire({
          icon: 'error',
          title: '처리가 되지않았습니다.',
        })
        return
      } else {
        Swal.fire('센터 운영이 종료되었습니다.').then((result) => {
          if (result.isConfirmed) {
            window.location.reload()
          }
        })
      }
    }
  })
}
</script>

<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header pb-0">
            <h6>센터 정보</h6>
          </div>
          <div class="card-body px-0 pt-0 pb-2">
            <div class="position-relative">
              <!-- <div class="position-absolute bottom-0 end-8">
                <ArgonButton color="danger" class="p-1 mr-1">선택 삭제</ArgonButton>
              </div> -->
              <div class="position-absolute bottom-0 end-2">
                <ArgonButton color="success" class="p-2" variant="gradient" @click="centerList()"
                  >목록으로</ArgonButton
                >
              </div>
            </div>
            <div class="container">
              <div class="card-body">
                <form role="form" v-on:submit.prevent="">
                  <div class="row">
                    <div class="col-2"></div>
                    <div class="col-2">
                      <h6>센터명</h6>
                    </div>
                    <div class="col-5">
                      <argon-input
                        id="name"
                        type="text"
                        placeholder="센터명"
                        v-model="center.name"
                        aria-label="Name"
                        disabled
                      />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-2"></div>
                    <div class="col-2">
                      <h6>주소</h6>
                    </div>
                    <div class="col-5">
                      <argon-input v-model="center.address" disabled />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-2"></div>
                    <div class="col-2">
                      <h6>전화번호</h6>
                    </div>
                    <div class="col-5">
                      <argon-input id="tel" v-model="center.tel" disabled />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-2"></div>
                    <div class="col-2">
                      <h6>이메일</h6>
                    </div>
                    <div class="col-5">
                      <argon-input
                        id="email"
                        type="email"
                        v-model="center.email"
                        aria-label="email"
                        disabled
                      />
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-2"></div>
                    <div class="col-2"><h6>상태</h6></div>
                    <div class="col-5">
                      <argon-input v-model="center.status" disabled />
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-2"></div>
                    <div class="col-2"><h6>등록일</h6></div>
                    <div class="col-5">
                      <argon-input
                        id="detail_input"
                        v-model="center.start"
                        disabled
                        placeholder="상세주소"
                      />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-2"></div>
                    <div class="col-2"><h6>종료일</h6></div>
                    <div class="col-5">
                      <argon-input v-model="center.end" disabled />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-2"></div>
                    <div class="col-2"><h6>점심시간</h6></div>
                    <div class="col-5">
                      <select
                        name="lunch"
                        id="lunch"
                        class="form-select"
                        v-model="center.lunch"
                        disabled
                      >
                        <option value="10">오전10시</option>
                        <option value="11">오전11시</option>
                        <option value="12">오후12시</option>
                        <option value="13">오후1시</option>
                        <option value="14">오후2시</option>
                        <option value="15">오후3시</option>
                      </select>
                    </div>
                  </div>
                  <div class="row">
                    <div
                      :class="{
                        'col-4': store.centerInfo.center_status == 'b1',
                        'col-5': store.centerInfo.center_status == 'b2',
                      }"
                    ></div>
                    <div class="text-center col-2">
                      <argon-button
                        fullWidth
                        color="info"
                        variant="gradient"
                        class="my-4 mb-2 p-2"
                        @click="toUpdate()"
                      >
                        정보수정
                      </argon-button>
                    </div>
                    <div class="text-center col-2">
                      <argon-button
                        fullWidth
                        color="danger"
                        variant="gradient"
                        class="my-4 mb-2 p-2"
                        @click="endCenter()"
                        v-if="store.centerInfo.center_status == 'b1'"
                      >
                        운영종료
                      </argon-button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
/* 확인(종료) 버튼 - 빨간색 */
.my-swal-confirm {
  background-color: #e74c3c !important; /* 빨간색 */
  color: white;
  border: none;
  border-radius: 5px; /* 모서리 곡률 */
  padding: 10px 30px; /* 상하 좌우 여백 (크기 조절) */
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-right: 10px; /* 두 버튼 사이 간격 */
  min-width: 100px; /* 최소 가로 길이 고정 */
}

/* 취소 버튼 - 회색 */
.my-swal-cancel {
  background-color: #6c757d !important; /* 회색 */
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 30px; /* 확인 버튼과 동일하게 설정 */
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  min-width: 100px; /* 최소 가로 길이 고정 */
}

/* 마우스 올렸을 때 효과 (선택사항) */
.my-swal-confirm:hover {
  background-color: #c0392b !important;
}
.my-swal-cancel:hover {
  background-color: #5a6268 !important;
}
</style>
