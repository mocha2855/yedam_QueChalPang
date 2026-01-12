<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useApprovalStore } from '@/stores/approval'
import { ref, reactive, onBeforeMount, computed } from 'vue'
import ArgonInput from '@/components/ArgonInput.vue'
import ArgonAlert from '@/components/ArgonAlert.vue'
import axios from 'axios'
const router = useRouter()
const route = useRoute()
const store = useApprovalStore()

// 알림 관련
const msg = ref('')
const argonAlert = ref(false)

const showAlert = (message) => {
  msg.value = message
  argonAlert.value = true
  setTimeout(() => {
    argonAlert.value = false
  }, 1500)
}

// 회원 정보
const memberInfo = reactive({
  id: '',
  name: '',
  email: '',
  phone: '',
  address: '',
  center: '',
  centerName: '',
  authority: '',
})

// 비밀번호 관련
const password = reactive({
  new: '',
  confirm: '',
})

// 비밀번호 일치 여부
const isPasswordMatch = computed(() => {
  if (password.new === '' && password.confirm === '') return null
  return password.new === password.confirm
})

// ID 가져오기
const getMemberId = () => {
  return route.params.id
}

// 데이터 로드
onBeforeMount(async () => {
  const id = getMemberId()
  const memberData = await store.getMemberById(id)

  const member = memberData[0] // 배열에서 첫 번째 객체 꺼내기

  if (member) {
    memberInfo.id = member.member_id
    memberInfo.name = member.member_name
    memberInfo.email = member.member_email
    memberInfo.phone = member.member_phone
    memberInfo.address = member.member_address
    memberInfo.center = member.center_no
    memberInfo.centerName = member.center_name
    memberInfo.authority = member.member_authority
  }
})

// 수정 처리
const updateMemberInfo = async () => {
  // 비밀번호 입력했으면 일치 확인
  if (password.new !== '' || password.confirm !== '') {
    if (!isPasswordMatch.value) {
      showAlert('비밀번호가 일치하지 않습니다.')
      return
    }
  }

  if (memberInfo.name === '') {
    showAlert('이름을 입력해주세요.')
    return
  }
  if (memberInfo.center === '') {
    showAlert('기관명을 입력해주세요.')
    return
  }
  if (memberInfo.email === '') {
    showAlert('이메일을 입력해주세요.')
    return
  }
  if (memberInfo.phone === '') {
    showAlert('연락처를 입력해주세요.')
    return
  }

  try {
    const data = {
      name: memberInfo.name,
      email: memberInfo.email,
      phone: memberInfo.phone,
      address: memberInfo.address,
      center: memberInfo.center,
      authority: memberInfo.authority,
      password: password.new, // 빈 문자열이면 백엔드에서 제외됨
    }

    console.log(data.center)
    await axios.put(`/api/member/${memberInfo.id}`, data)
    showAlert('수정되었습니다.')

    setTimeout(() => {
      router.push({ name: 'ApprovalManagerList' })
    }, 1500)
  } catch (error) {
    console.error('수정 실패:', error)
    showAlert('수정에 실패했습니다.')
  }
}

// 목록으로
const goBack = () => {
  router.push({ name: 'ApprovalManagerList' })
}
</script>

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
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 class="mb-2" style="color: #2d3748; font-weight: 600">담당자 정보수정</h3>
            <p style="color: #718096; margin: 0; font-size: 14px">
              담당자의 정보를 수정할 수 있습니다
            </p>
          </div>
          <button
            class="btn"
            @click="goBack()"
            style="
              background-color: #5a67d8;
              color: white;
              border: none;
              padding: 10px 24px;
              border-radius: 8px;
              font-size: 14px;
              font-weight: 500;
            "
          >
            목록으로
          </button>
        </div>

        <!-- 메인 카드 -->
        <div class="card" style="border: none; border-radius: 16px">
          <div class="card-body p-5">
            <form @submit.prevent="updateMemberInfo">
              <!-- 아이디 (수정 불가) -->
              <div class="mb-4">
                <label class="form-label" style="color: #4a5568; font-weight: 500; font-size: 14px"
                  >아이디</label
                >
                <ArgonInput
                  type="text"
                  v-model="memberInfo.id"
                  disabled
                  placeholder="아이디"
                  style="background-color: #f7fafc"
                />
              </div>

              <!-- 담당자명 -->
              <div class="mb-4">
                <label class="form-label" style="color: #4a5568; font-weight: 500; font-size: 14px"
                  >담당자명</label
                >
                <ArgonInput type="text" v-model="memberInfo.name" placeholder="이름" />
              </div>

              <!-- 기관명 -->
              <div class="mb-4">
                <label class="form-label" style="color: #4a5568; font-weight: 500; font-size: 14px"
                  >기관명</label
                >
                <ArgonInput
                  type="text"
                  v-model="memberInfo.centerName"
                  disabled
                  placeholder="기관명"
                  style="background-color: #f7fafc"
                />
              </div>

              <!-- 연락처 -->
              <div class="mb-4">
                <label class="form-label" style="color: #4a5568; font-weight: 500; font-size: 14px"
                  >연락처</label
                >
                <ArgonInput type="text" v-model="memberInfo.phone" placeholder="010-1234-5678" />
              </div>

              <!-- 이메일 -->
              <div class="mb-4">
                <label class="form-label" style="color: #4a5568; font-weight: 500; font-size: 14px"
                  >이메일</label
                >
                <ArgonInput
                  type="email"
                  v-model="memberInfo.email"
                  placeholder="example@yedam.com"
                />
              </div>

              <!-- 비밀번호 변경 섹션 -->
              <div class="mb-4">
                <label class="form-label" style="color: #4a5568; font-weight: 500; font-size: 14px"
                  >비밀번호 변경</label
                >
                <ArgonInput
                  type="password"
                  v-model="password.new"
                  placeholder="새 비밀번호"
                  class="mb-2"
                />
                <ArgonInput
                  type="password"
                  v-model="password.confirm"
                  placeholder="비밀번호 확인"
                />
                <small
                  v-if="isPasswordMatch !== null"
                  :class="{
                    'text-success': isPasswordMatch,
                    'text-danger': !isPasswordMatch,
                  }"
                  style="font-size: 12px"
                >
                  {{ isPasswordMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.' }}
                </small>
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
                  type="submit"
                  class="btn"
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
                  수정
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
