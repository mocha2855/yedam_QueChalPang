<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useApprovalStore } from '@/stores/approval'

import { ref, reactive, onBeforeMount, computed } from 'vue'
import ArgonButton from '@/components/ArgonButton.vue'
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

  // console.log('memberData:', memberData)

  const member = memberData[0] // 배열에서 첫 번째 객체 꺼내기

  if (member) {
    memberInfo.id = member.member_id
    memberInfo.name = member.member_name
    memberInfo.email = member.member_email
    memberInfo.phone = member.member_phone
    memberInfo.address = member.member_address
    memberInfo.center = member.center_no
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

    await axios.put(`/api/member/${memberInfo.id}`, data)
    showAlert('수정되었습니다.')

    setTimeout(() => {
      router.push({ name: 'UserList' })
    }, 1500)
  } catch (error) {
    console.error('수정 실패:', error)
    showAlert('수정에 실패했습니다.')
  }
}

// 목록으로
const goBack = () => {
  console.log('이동할 라우트:', 'UserList')

  router.push({ name: 'UserList' })
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

  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header pb-0">
            <h6>일반회원 정보수정</h6>
          </div>

          <div class="card-body px-0 pt-0 pb-2">
            <div class="position-relative">
              <div class="position-absolute bottom-0 end-2">
                <ArgonButton color="success" class="p-2" variant="gradient" @click="goBack()">
                  목록으로
                </ArgonButton>
              </div>
            </div>

            <div class="container">
              <div class="card-body">
                <form @submit.prevent="updateMemberInfo">
                  <!-- 아이디 (수정 불가) -->
                  <div class="row mb-3">
                    <div class="col-2"></div>
                    <div class="col-2">
                      <h6>아이디</h6>
                    </div>
                    <div class="col-6">
                      <ArgonInput
                        type="text"
                        v-model="memberInfo.id"
                        disabled
                        placeholder="아이디"
                      />
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-2"></div>
                    <div class="col-2">
                      <h6>회원 이름</h6>
                    </div>
                    <div class="col-6">
                      <ArgonInput type="text" v-model="memberInfo.name" placeholder="이름" />
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-2"></div>
                    <div class="col-2">
                      <h6>연락처</h6>
                    </div>
                    <div class="col-6">
                      <ArgonInput
                        type="text"
                        v-model="memberInfo.phone"
                        placeholder="010-1234-5678"
                      />
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-2"></div>
                    <div class="col-2">
                      <h6>이메일</h6>
                    </div>
                    <div class="col-6">
                      <ArgonInput
                        type="email"
                        v-model="memberInfo.email"
                        placeholder="example@yedam.com"
                      />
                    </div>
                  </div>

                  <!-- 비밀번호 변경 섹션 -->
                  <div class="row mb-3">
                    <div class="col-2"></div>
                    <div class="col-2">
                      <h6>비밀번호 변경</h6>
                    </div>
                    <div class="col-6">
                      <ArgonInput
                        type="password"
                        v-model="password.new"
                        placeholder="새 비밀번호"
                      />
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-2"></div>
                    <div class="col-2"></div>
                    <div class="col-6">
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
                      >
                        {{
                          isPasswordMatch
                            ? '비밀번호가 일치합니다.'
                            : '비밀번호가 일치하지 않습니다.'
                        }}
                      </small>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-4"></div>
                    <div class="text-center col-2">
                      <ArgonButton
                        fullWidth
                        color="warning"
                        variant="gradient"
                        class="my-4 mb-2"
                        type="submit"
                      >
                        수정
                      </ArgonButton>
                    </div>
                    <div class="text-center col-2">
                      <ArgonButton
                        fullWidth
                        color="dark"
                        variant="gradient"
                        class="my-4 mb-2"
                        @click="goBack"
                      >
                        취소
                      </ArgonButton>
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
