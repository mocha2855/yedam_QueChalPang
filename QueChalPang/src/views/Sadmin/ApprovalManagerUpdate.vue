<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useApprovalStore } from '@/stores/approval'
import { ref, reactive, onBeforeMount, computed } from 'vue'
import ArgonInput from '@/components/ArgonInput.vue'
import axios from 'axios'
import Swal from 'sweetalert2'

const router = useRouter()
const route = useRoute()
const store = useApprovalStore()

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

// 원본 데이터 저장 (변경 감지용)
const originalData = ref(null)

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

// 변경사항 감지 함수
const hasChanges = () => {
  if (!originalData.value) return false

  // 비밀번호가 입력되었으면 변경사항으로 간주
  if (password.new !== '' || password.confirm !== '') return true

  // 기본 정보 비교
  return (
    memberInfo.name !== originalData.value.name ||
    memberInfo.email !== originalData.value.email ||
    memberInfo.phone !== originalData.value.phone ||
    memberInfo.address !== originalData.value.address
  )
}

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

    // 원본 데이터 저장
    originalData.value = {
      name: member.member_name,
      email: member.member_email,
      phone: member.member_phone,
      address: member.member_address,
    }
  }
})

// 수정 처리
const updateMemberInfo = async () => {
  // 변경사항 확인
  if (!hasChanges()) {
    await Swal.fire({
      icon: 'info',
      title: '수정할 내용이 없습니다',
      text: '변경된 내용이 없습니다.',
      confirmButtonText: '확인',
      confirmButtonColor: '#5a67d8',
    })
    return
  }

  // 비밀번호 입력했으면 일치 확인
  if (password.new !== '' || password.confirm !== '') {
    if (!isPasswordMatch.value) {
      await Swal.fire({
        icon: 'warning',
        title: '비밀번호 불일치',
        text: '비밀번호가 일치하지 않습니다.',
        confirmButtonText: '확인',
        confirmButtonColor: '#5a67d8',
      })
      return
    }
  }

  // 필수 필드 검증
  if (memberInfo.name === '') {
    await Swal.fire({
      icon: 'warning',
      title: '이름 입력 필요',
      text: '이름을 입력해주세요.',
      confirmButtonText: '확인',
      confirmButtonColor: '#5a67d8',
    })
    return
  }
  if (memberInfo.center === '') {
    await Swal.fire({
      icon: 'warning',
      title: '기관명 입력 필요',
      text: '기관명을 입력해주세요.',
      confirmButtonText: '확인',
      confirmButtonColor: '#5a67d8',
    })
    return
  }
  if (memberInfo.email === '') {
    await Swal.fire({
      icon: 'warning',
      title: '이메일 입력 필요',
      text: '이메일을 입력해주세요.',
      confirmButtonText: '확인',
      confirmButtonColor: '#5a67d8',
    })
    return
  }
  if (memberInfo.phone === '') {
    await Swal.fire({
      icon: 'warning',
      title: '연락처 입력 필요',
      text: '연락처를 입력해주세요.',
      confirmButtonText: '확인',
      confirmButtonColor: '#5a67d8',
    })
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

    await Swal.fire({
      icon: 'success',
      title: '수정 완료!',
      text: '담당자 정보가 성공적으로 수정되었습니다.',
      showConfirmButton: false,
      timer: 1500,
    })

    setTimeout(() => {
      router.push({ name: 'ApprovalManagerList' })
    }, 1500)
  } catch (error) {
    console.error('수정 실패:', error)
    await Swal.fire({
      icon: 'error',
      title: '수정 실패',
      text: error.response?.data?.message || '수정에 실패했습니다. 다시 시도해주세요.',
      confirmButtonText: '확인',
      confirmButtonColor: '#5a67d8',
    })
  }
}

// 목록으로
const goBack = () => {
  router.push({ name: 'ApprovalManagerList' })
}
</script>

<template>
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
