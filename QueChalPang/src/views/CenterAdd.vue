<script setup>
//survey이 active 한 건만 목록조회
import { computed, ref } from 'vue'
import ArgonButton from '@/components/ArgonButton.vue'
import ArgonInput from '@/components/ArgonInput.vue'
import { reactive } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
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
//주소api에서 쓰는 refs
const address = ref('')
const detailAddress = ref('')
const extraAddress = ref('')

// 주소 api에서 사용하는 함수들
const openPostcode = () => {
  new window.daum.Postcode({
    oncomplete: (data) => {
      let addr = ''
      let extraAddr = ''

      if (data.userSelectedType === 'R') {
        addr = data.roadAddress
      } else {
        addr = data.jibunAddress
      }

      if (data.userSelectedType === 'R') {
        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
          extraAddr += data.bname
        }
        if (data.buildingName !== '' && data.apartment === 'Y') {
          extraAddr += extraAddr !== '' ? ', ' + data.buildingName : data.buildingName
        }
        if (extraAddr !== '') {
          extraAddr = ' (' + extraAddr + ')'
        }
        extraAddress.value = extraAddr // Vue 변수에 할당
      } else {
        extraAddress.value = ''
      }

      address.value = addr // 기본 주소
      centerInfo.address = address.value
      console.log(centerInfo)
      // 상세주소로 포커스 이동은 ref를 사용하거나 직접 접근
      document.getElementById('detail_input').focus()
    },
  }).open()
}
const tel = reactive({
  tel1: '',
  tel2: '',
  tel3: '',
})
const centerInfo = reactive({
  name: '',
  address: '',
  tel: computed(() => `${tel.tel1}-${tel.tel2}-${tel.tel3}`),
  email: '',
  lunch: '12',
})
const checked = ref(false)
const checkCenterName = async () => {
  let result = await axios.get(`api/center/name/${centerInfo.name}`)
  if (result.data.count > 0) {
    Toast.fire({
      icon: 'error',
      title: '이미 존재하는 센터명입니다.',
    })
  } else {
    checked.value = true
  }
}
const addCenterInfo = async () => {
  if (!checked.value) {
    Toast.fire({
      icon: 'error',
      title: '센터명 중복확인을 하지 않으셨습니다.',
    })
    return
  } else if (centerInfo.email == '') {
    Toast.fire({
      icon: 'error',
      title: '이메일이 입력되지 않았습니다.',
    })
    return
  } else if (address.value == '' || detailAddress.value == '') {
    Toast.fire({
      icon: 'error',
      title: '주소가 입력되지 않았습니다.',
    })
    return
  }
  centerInfo.address = `${address.value}|${extraAddress.value}|${detailAddress.value}`
  let result = await axios.post('/api/center', centerInfo)
  let no = result.data.insertId
  if (no) {
    emit('success', no)
  }
}
const emit = defineEmits(['success'])
</script>

<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body px-0 pt-0 pb-2">
            <div class="position-relative">
              <!-- <div class="position-absolute bottom-0 end-8">
                <ArgonButton color="danger" class="p-1 mr-1">선택 삭제</ArgonButton>
              </div> -->
            </div>
            <div class="container">
              <div class="card-body">
                <form role="form" v-on:submit.prevent="">
                  <div class="row">
                    <div class="col-3">
                      <h6>센터명</h6>
                    </div>
                    <div class="col-6">
                      <argon-input
                        id="name"
                        type="text"
                        placeholder="센터명"
                        aria-label="Name"
                        v-model="centerInfo.name"
                        :disabled="checked"
                        class="mb-0"
                      />
                      <label class="m-0 z-index" v-if="checked" for="email"
                        >센터명 중복확인 완료</label
                      >
                    </div>
                    <div class="col-3">
                      <button
                        type="button"
                        :class="{
                          'p-1': true,
                          'pb-2': true,
                          'pt-2': true,
                          btn: true,
                          'btn-primary': !checked,
                          'btn-secondary': checked,
                          disabled: checked,

                          'w-100': true,
                        }"
                        @click="checkCenterName()"
                      >
                        중복확인
                      </button>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-3">
                      <h6>이메일</h6>
                    </div>
                    <div class="col-8">
                      <argon-input
                        id="email"
                        type="email"
                        placeholder="example@example.com"
                        aria-label="email"
                        v-model="centerInfo.email"
                      />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-3">
                      <h6>전화번호</h6>
                    </div>
                    <div class="col-3">
                      <argon-input id="tel" maxlength="3" placeholder="02" v-model="tel.tel1" />
                    </div>

                    <div class="col-3">
                      <argon-input
                        id="tel"
                        maxlength="4"
                        :disabled="false"
                        placeholder="0000"
                        v-model="tel.tel2"
                      />
                    </div>
                    <div class="col-3">
                      <argon-input
                        id="tel"
                        maxlength="4"
                        :disabled="false"
                        placeholder="0000"
                        v-model="tel.tel3"
                      />
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-3">
                      <h6>주소</h6>
                    </div>
                    <div class="col-6">
                      <argon-input v-model="address" placeholder="주소" disabled />
                    </div>
                    <div class="col-3">
                      <button
                        type="button"
                        class="p-1 pb-2 pt-2 btn btn-primary w-100"
                        @click="openPostcode"
                      >
                        주소 찾기
                      </button>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-3"></div>
                    <div class="col-6">
                      <argon-input
                        id="detail_input"
                        v-model="detailAddress"
                        placeholder="상세주소"
                      />
                    </div>
                    <div class="col-3">
                      <argon-input v-model="extraAddress" placeholder="참고" disabled />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-3"><h6>점심시간</h6></div>
                    <div class="col-8">
                      <select
                        name="lunch"
                        id="lunch"
                        class="form-select"
                        v-model="centerInfo.lunch"
                      >
                        <option value="10:00">오전10시</option>
                        <option value="11:00">오전11시</option>
                        <option value="12:00">오후12시</option>
                        <option value="13:00">오후1시</option>
                        <option value="14:00">오후2시</option>
                        <option value="15:00">오후3시</option>
                      </select>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-4"></div>
                    <div class="text-center col-5">
                      <argon-button
                        fullWidth
                        color="info"
                        variant="gradient"
                        class="my-4 mb-2"
                        @click="addCenterInfo()"
                      >
                        센터등록
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
