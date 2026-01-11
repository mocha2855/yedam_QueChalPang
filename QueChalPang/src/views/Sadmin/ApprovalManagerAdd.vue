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

  <div class="py-4 container" style="max-width: 900px">
    <div class="row">
      <div class="col-12">
        <!-- 헤더 섹션 -->
        <div class="mb-4">
          <h3 class="mb-2" style="color: #2d3748; font-weight: 600">담당자 등록</h3>
          <p style="color: #718096; font-size: 14px">새로운 담당자 정보를 등록합니다</p>
        </div>

        <!-- 메인 카드 -->
        <div class="card" style="border: none; border-radius: 16px">
          <div class="card-body p-5">
            <form role="form" v-on:submit.prevent="">
              <!-- 아이디 -->
              <div class="mb-4">
                <label class="form-label" style="color: #4a5568; font-weight: 500; font-size: 14px"
                  >아이디</label
                >
                <div class="d-flex gap-2">
                  <argon-input
                    style="flex: 1"
                    type="text"
                    placeholder="아이디"
                    v-model="managerInfo.member_id"
                    :disabled="idChecked"
                  />
                  <button
                    type="button"
                    class="btn"
                    :disabled="idChecked"
                    @click="checkMemberId()"
                    :style="
                      idChecked
                        ? 'background-color: #cbd5e0; color: #4a5568; border: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 500; white-space: nowrap; cursor: not-allowed;'
                        : 'background-color: #5a67d8; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 500; white-space: nowrap;'
                    "
                  >
                    중복확인
                  </button>
                </div>
              </div>

              <!-- 비밀번호 -->
              <div class="mb-4">
                <label class="form-label" style="color: #4a5568; font-weight: 500; font-size: 14px"
                  >비밀번호</label
                >
                <argon-input
                  type="password"
                  placeholder="비밀번호"
                  v-model="managerInfo.member_password"
                />
              </div>

              <!-- 비밀번호 확인 -->
              <div class="mb-4">
                <label class="form-label" style="color: #4a5568; font-weight: 500; font-size: 14px"
                  >비밀번호 확인</label
                >
                <argon-input
                  type="password"
                  placeholder="비밀번호 확인"
                  v-model="passwordConfirm"
                />
              </div>

              <!-- 이름 -->
              <div class="mb-4">
                <label class="form-label" style="color: #4a5568; font-weight: 500; font-size: 14px"
                  >이름</label
                >
                <argon-input type="text" placeholder="이름" v-model="managerInfo.member_name" />
              </div>

              <!-- 이메일 -->
              <div class="mb-4">
                <label class="form-label" style="color: #4a5568; font-weight: 500; font-size: 14px"
                  >이메일</label
                >
                <argon-input
                  type="email"
                  placeholder="example@example.com"
                  v-model="managerInfo.member_email"
                />
              </div>

              <!-- 전화번호 -->
              <div class="mb-4">
                <label class="form-label" style="color: #4a5568; font-weight: 500; font-size: 14px"
                  >전화번호</label
                >
                <div class="d-flex gap-2">
                  <argon-input style="flex: 1" maxlength="3" placeholder="010" v-model="tel.tel1" />
                  <argon-input
                    style="flex: 1"
                    maxlength="4"
                    placeholder="0000"
                    v-model="tel.tel2"
                  />
                  <argon-input
                    style="flex: 1"
                    maxlength="4"
                    placeholder="0000"
                    v-model="tel.tel3"
                  />
                </div>
              </div>

              <!-- 소속 기관 -->
              <div class="mb-4">
                <label class="form-label" style="color: #4a5568; font-weight: 500; font-size: 14px"
                  >소속 기관</label
                >
                <div class="d-flex gap-2">
                  <argon-input
                    style="flex: 1; background-color: #f7fafc"
                    v-model="selectedCenterName"
                    placeholder="기관 선택"
                    disabled
                  />
                  <button
                    type="button"
                    class="btn"
                    @click="openCenterPopup"
                    style="
                      background-color: #5a67d8;
                      color: white;
                      border: none;
                      padding: 12px 24px;
                      border-radius: 8px;
                      font-size: 14px;
                      font-weight: 500;
                      white-space: nowrap;
                    "
                  >
                    기관 찾기
                  </button>
                </div>
              </div>

              <!-- 주소 -->
              <div class="mb-4">
                <label class="form-label" style="color: #4a5568; font-weight: 500; font-size: 14px"
                  >주소</label
                >
                <div class="d-flex gap-2 mb-2">
                  <argon-input
                    style="flex: 1; background-color: #f7fafc"
                    v-model="address"
                    placeholder="주소"
                    disabled
                  />
                  <button
                    type="button"
                    class="btn"
                    @click="openPostcode"
                    style="
                      background-color: #5a67d8;
                      color: white;
                      border: none;
                      padding: 12px 24px;
                      border-radius: 8px;
                      font-size: 14px;
                      font-weight: 500;
                      white-space: nowrap;
                    "
                  >
                    주소 찾기
                  </button>
                </div>
                <div class="d-flex gap-2">
                  <argon-input
                    style="flex: 2"
                    id="detail_input"
                    v-model="detailAddress"
                    placeholder="상세주소"
                  />
                  <argon-input
                    style="flex: 1; background-color: #f7fafc"
                    v-model="extraAddress"
                    placeholder="참고"
                    disabled
                  />
                </div>
              </div>

              <!-- 버튼 -->
              <div class="d-flex justify-content-center gap-2 mt-5">
                <button
                  type="button"
                  class="btn"
                  @click="goBack"
                  style="
                    background-color: #f7fafc;
                    color: #4a5568;
                    border: 1px solid #e2e8f0;
                    padding: 12px 32px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                  "
                >
                  취소
                </button>
                <button
                  type="button"
                  class="btn"
                  @click="addManagerInfo()"
                  style="
                    background-color: #5a67d8;
                    color: white;
                    border: none;
                    padding: 12px 32px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                  "
                >
                  담당자 등록
                </button>
              </div>
            </form>
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
import { useRouter } from 'vue-router'
import axios from 'axios'
import ArgonInput from '@/components/ArgonInput.vue'
import ArgonAlert from '@/components/ArgonAlert.vue'
import CenterSearchModal from '../components/modals/CenterSearchModal.vue'

const router = useRouter()

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

// 기관 팝업 열기(modal)
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
  console.log('managerInfo:', managerInfo)

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

  //주소 조합 시키기
  managerInfo.member_address = `${address.value}|${extraAddress.value}|${detailAddress.value}`

  try {
    let result = await axios.post('/api/member/manager', managerInfo)

    if (result.data.affectedRows > 0) {
      showAlert('담당자가 등록되었습니다.')
      emit('success', result.data.insertId)
      router.push({ name: 'ApprovalManagerList' })
    }
  } catch (error) {
    showAlert('등록에 실패했습니다.')
    console.error(error)
  }
}

const emit = defineEmits(['success'])

// 취소 누를시 목록으로
const goBack = () => {
  router.push({ name: 'ApprovalManagerList' })
}
</script>
