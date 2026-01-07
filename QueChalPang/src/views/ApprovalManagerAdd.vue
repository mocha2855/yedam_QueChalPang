<template>
  <div class="fixed-top d-flex justify-content-end p-3 mt-6">
    <div class="col-4">
      <ArgonAlert
        v-show="argonAlert"
        color="warning"
        icon="ni ni-bell-55"
        dismissible
        @close="argonAlert = false"
      >
        {{ msg }}
      </ArgonAlert>
    </div>
  </div>

  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body px-0 pt-0 pb-2">
            <div class="container">
              <div class="card-body">
                <form role="form" v-on:submit.prevent="">
                  <!-- 아이디 -->
                  <div class="row">
                    <div class="col-3">
                      <h6>아이디</h6>
                    </div>
                    <div class="col-6">
                      <argon-input
                        id="member_id"
                        type="text"
                        placeholder="아이디"
                        v-model="managerInfo.member_id"
                        :disabled="idChecked"
                      />
                    </div>
                    <div class="col-3">
                      <button
                        type="button"
                        :class="{
                          'p-1': true,
                          'pb-2': true,
                          'pt-2': true,
                          btn: true,
                          'btn-primary': !idChecked,
                          'btn-secondary': idChecked,
                          disabled: idChecked,
                          'w-100': true,
                        }"
                        @click="checkMemberId()"
                      >
                        중복확인
                      </button>
                    </div>
                  </div>

                  <!-- 비밀번호 -->
                  <div class="row">
                    <div class="col-3">
                      <h6>비밀번호</h6>
                    </div>
                    <div class="col-8">
                      <argon-input
                        id="password"
                        type="password"
                        placeholder="비밀번호"
                        v-model="managerInfo.member_password"
                      />
                    </div>
                  </div>

                  <!-- 비밀번호 확인 -->
                  <div class="row">
                    <div class="col-3">
                      <h6>비밀번호 확인</h6>
                    </div>
                    <div class="col-8">
                      <argon-input
                        id="password_confirm"
                        type="password"
                        placeholder="비밀번호 확인"
                        v-model="passwordConfirm"
                      />
                    </div>
                  </div>

                  <!-- 이름 -->
                  <div class="row">
                    <div class="col-3">
                      <h6>이름</h6>
                    </div>
                    <div class="col-8">
                      <argon-input
                        id="name"
                        type="text"
                        placeholder="이름"
                        v-model="managerInfo.member_name"
                      />
                    </div>
                  </div>

                  <!-- 이메일 -->
                  <div class="row">
                    <div class="col-3">
                      <h6>이메일</h6>
                    </div>
                    <div class="col-8">
                      <argon-input
                        id="email"
                        type="email"
                        placeholder="example@example.com"
                        v-model="managerInfo.member_email"
                      />
                    </div>
                  </div>

                  <!-- 전화번호 -->
                  <div class="row">
                    <div class="col-3">
                      <h6>전화번호</h6>
                    </div>
                    <div class="col-3">
                      <argon-input id="tel" maxlength="3" placeholder="010" v-model="tel.tel1" />
                    </div>
                    <div class="col-3">
                      <argon-input id="tel" maxlength="4" placeholder="0000" v-model="tel.tel2" />
                    </div>
                    <div class="col-3">
                      <argon-input id="tel" maxlength="4" placeholder="0000" v-model="tel.tel3" />
                    </div>
                  </div>

                  <!-- 소속 기관 -->
                  <div class="row">
                    <div class="col-3">
                      <h6>소속 기관</h6>
                    </div>
                    <div class="col-6">
                      <argon-input v-model="selectedCenterName" placeholder="기관 선택" disabled />
                    </div>
                    <div class="col-3">
                      <button
                        type="button"
                        class="p-1 pb-2 pt-2 btn btn-primary w-100"
                        @click="openCenterPopup"
                      >
                        기관 찾기
                      </button>
                    </div>
                  </div>

                  <!-- 주소 -->
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

                  <!-- 등록 버튼 -->
                  <div class="row">
                    <div class="col-4"></div>
                    <div class="text-center col-5">
                      <argon-button
                        fullWidth
                        color="info"
                        variant="gradient"
                        class="my-4 mb-2"
                        @click="addManagerInfo()"
                      >
                        담당자 등록
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

  <!-- 기관 검색 모달  -->
  <CenterSearchModal
    v-if="showCenterPopup"
    @close="showCenterPopup = false"
    @select="handleCenterSelect"
  />
</template>

<script setup>
import { computed, ref, reactive } from 'vue'
import axios from 'axios'
import ArgonButton from '@/components/ArgonButton.vue'
import ArgonInput from '@/components/ArgonInput.vue'
import ArgonAlert from '@/components/ArgonAlert.vue'
import CenterSearchModal from './components/modals/CenterSearchModal.vue'

// 주소 관련
const address = ref('')
const detailAddress = ref('')
const extraAddress = ref('')

// 전화번호
const tel = reactive({
  tel1: '',
  tel2: '',
  tel3: '',
})

// 비밀번호 확인
const passwordConfirm = ref('')

// 아이디 중복 확인 여부
const idChecked = ref(false)

// 기관 선택 관련
const showCenterPopup = ref(false)
const selectedCenterName = ref('')

// 담당자 정보
const managerInfo = reactive({
  member_id: '',
  member_password: '',
  member_name: '',
  member_email: '',
  member_tel: computed(() => `${tel.tel1}-${tel.tel2}-${tel.tel3}`),
  member_address: '',
  center_no: '',
  member_authority: 'a2',
  member_confirm: 'l1',
})

// 알림
const msg = ref('')
const argonAlert = ref(false)

const showAlert = (message) => {
  msg.value = message
  argonAlert.value = true
  setTimeout(() => {
    argonAlert.value = false
  }, 1500)
}

// 기관 팝업 열기
const openCenterPopup = () => {
  showCenterPopup.value = true
}

// 기관 선택 처리
const handleCenterSelect = (center) => {
  managerInfo.center_no = center.center_no
  selectedCenterName.value = center.center_name
  showCenterPopup.value = false
}

// 주소 API
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
        extraAddress.value = extraAddr
      } else {
        extraAddress.value = ''
      }

      address.value = addr
      managerInfo.member_address = address.value
      document.getElementById('detail_input').focus()
    },
  }).open()
}

// 아이디 중복 확인
const checkMemberId = async () => {
  if (managerInfo.member_id === '') {
    showAlert('아이디를 입력해주세요.')
    return
  }

  try {
    let result = await axios.get(`/api/member/id/${managerInfo.member_id}`)
    if (result.data.result[0].count > 0) {
      showAlert('이미 존재하는 아이디입니다.')
    } else {
      showAlert('사용 가능한 아이디입니다.')
      idChecked.value = true
    }
  } catch (error) {
    console.error('아이디 중복 확인 실패:', error)
  }
}

// 담당자 등록
const addManagerInfo = async () => {
  if (!idChecked.value) {
    showAlert('아이디 중복확인을 하지 않으셨습니다.')
    return
  }
  if (managerInfo.member_password === '') {
    showAlert('비밀번호를 입력해주세요.')
    return
  }
  if (managerInfo.member_password !== passwordConfirm.value) {
    showAlert('비밀번호가 일치하지 않습니다.')
    return
  }
  if (managerInfo.member_name === '') {
    showAlert('이름을 입력해주세요.')
    return
  }
  if (managerInfo.member_email === '') {
    showAlert('이메일을 입력해주세요.')
    return
  }
  if (tel.tel1 === '' || tel.tel2 === '' || tel.tel3 === '') {
    showAlert('전화번호를 입력해주세요.')
    return
  }
  if (managerInfo.center_no === '') {
    showAlert('소속 기관을 선택해주세요.')
    return
  }
  if (address.value === '' || detailAddress.value === '') {
    showAlert('주소를 입력해주세요.')
    return
  }

  managerInfo.member_address = `${address.value}|${extraAddress.value}|${detailAddress.value}`

  try {
    let result = await axios.post('/api/member/manager', managerInfo)
    if (result.data.insertId) {
      showAlert('담당자가 등록되었습니다.')
      emit('success', result.data.insertId)
    }
  } catch (error) {
    showAlert('등록에 실패했습니다.')
    console.error(error)
  }
}

const emit = defineEmits(['success'])
</script>
