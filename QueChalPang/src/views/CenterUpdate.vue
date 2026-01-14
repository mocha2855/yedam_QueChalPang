<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useCenterStore } from '@/stores/center'
import { computed, ref } from 'vue'
import ArgonButton from '@/components/ArgonButton.vue'
import ArgonInput from '@/components/ArgonInput.vue'
import { onBeforeMount, reactive } from 'vue'
import axios from 'axios'
const router = useRouter()
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
//주소api에서 쓰는 ref
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
const store = useCenterStore()
const route = useRoute()
const centerInfo = reactive({
  name: '',
  email: '',
  tel: computed(() => `${tel.tel1}-${tel.tel2}-${tel.tel3}`),
  address: '',
  lunch: '',
})
const tel = reactive({
  tel1: '',
  tel2: '',
  tel3: '',
})

onBeforeMount(async () => {
  await store.getInfo(getNo())
  centerInfo.name = store.centerInfo.center_name
  centerInfo.email = store.centerInfo.center_email
  tel.tel1 = store.centerInfo.center_tel.split('-')[0]
  tel.tel2 = store.centerInfo.center_tel.split('-')[1]
  tel.tel3 = store.centerInfo.center_tel.split('-')[2]
  address.value = store.centerInfo.center_address.split('|')[0]
  extraAddress.value = store.centerInfo.center_address.split('|')[1]
  detailAddress.value = store.centerInfo.center_address.split('|')[2]
  centerInfo.lunch = `${store.centerInfo.center_lunch.split(':')[0]}:00`
})
const getNo = () => {
  const routeArr = route.path.split('/')
  return routeArr[2]
}
console.log(getNo())
// 알림전용변수
const checked = ref(false)
// 알림작동 시키는 함수
const checkCenterName = async () => {
  console.log(detailAddress.value)
  if (centerInfo.name == store.centerInfo.center_name) {
    checked.value = true
    return
  }
  let result = await axios.get(`/api/center/name/${centerInfo.name}`)

  if (result.data.count > 0) {
    Toast.fire({
      icon: 'error',
      title: '이미 존재하는 센터명입니다.',
    })
  } else {
    checked.value = true
  }
}
const centerList = () => {
  router.push({ name: 'centerList' })
}
const updateCenterInfo = async () => {
  centerInfo.address = `${address.value}|${extraAddress.value}|${detailAddress.value}`
  console.log(centerInfo)
  console.log(store.centerInfo)
  if (
    centerInfo.name == store.centerInfo.center_name &&
    centerInfo.tel.valueOf() == store.centerInfo.center_tel &&
    centerInfo.email == store.centerInfo.center_email &&
    centerInfo.address == store.centerInfo.center_address &&
    `${centerInfo.lunch}:00` == store.centerInfo.center_lunch
  ) {
    Toast.fire({
      icon: 'error',
      title: '아무것도 변경하지 않으셨습니다.',
    })
    return
  }
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
  } else if (address.value == '') {
    Toast.fire({
      icon: 'error',
      title: '주소가 입력되지 않았습니다.',
    })
    return
  }
  if (detailAddress.value == undefined) {
    detailAddress.value = ''
  }

  let result = await axios.put(`/api/center/${getNo()}`, centerInfo)
  console.log(result)
  router.push({ path: `/center/${getNo()}` })
}
</script>

<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header pb-0">
            <h6>센터 수정</h6>
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
                    <div class="col-4">
                      <argon-input
                        id="name"
                        type="text"
                        placeholder="센터명"
                        aria-label="Name"
                        v-model="centerInfo.name"
                        :disabled="checked"
                      />
                    </div>
                    <div class="col-2">
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
                    <div class="col-2"></div>
                    <div class="col-2">
                      <h6>이메일</h6>
                    </div>
                    <div class="col-6">
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
                    <div class="col-2"></div>
                    <div class="col-2">
                      <h6>전화번호</h6>
                    </div>
                    <div class="col-2">
                      <argon-input id="tel" maxlength="3" placeholder="02" v-model="tel.tel1" />
                    </div>

                    <div class="col-2">
                      <argon-input
                        id="tel"
                        maxlength="4"
                        :disabled="false"
                        placeholder="0000"
                        v-model="tel.tel2"
                      />
                    </div>
                    <div class="col-2">
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
                    <div class="col-2"></div>
                    <div class="col-2">
                      <h6>주소</h6>
                    </div>
                    <div class="col-4">
                      <argon-input v-model="address" placeholder="주소" disabled />
                    </div>
                    <div class="col-2">
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
                    <div class="col-2"></div>
                    <div class="col-2"></div>
                    <div class="col-4">
                      <argon-input
                        id="detail_input"
                        v-model="detailAddress"
                        placeholder="상세주소"
                      />
                    </div>
                    <div class="col-2">
                      <argon-input v-model="extraAddress" placeholder="참고항목" disabled />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-2"></div>
                    <div class="col-2"><h6>점심시간</h6></div>
                    <div class="col-6">
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
                    <div class="col-5"></div>
                    <div class="text-center col-2">
                      <argon-button
                        fullWidth
                        color="info"
                        variant="gradient"
                        class="my-4 mb-2"
                        @click="updateCenterInfo()"
                      >
                        수정완료
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
