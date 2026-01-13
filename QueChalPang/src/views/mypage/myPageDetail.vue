<template>
  <div class="py-4 container-fluid dep-wrap" v-if="dependantDetail.value != ''">
    <div class="row">
      <div class="col-12">
        <!-- 헤더 섹션 -->
        <div class="mb-4">
          <h3 class="mb-2" style="color: #2d3748; font-weight: 600">지원자 상세정보</h3>
          <p style="color: #718096">지원자의 상세 정보를 확인하고 수정할 수 있습니다</p>
        </div>

        <!-- 메인 카드 -->
        <div class="card shadow-sm" style="border: none; border-radius: 16px">
          <div class="card-body p-5">
            <form role="form">
              <div class="mb-4">
                <label class="form-label" style="color: #4a5568; font-weight: 500; font-size: 14px"
                  >이름</label
                >
                <argon-input
                  id="name"
                  type="text"
                  aria-label="Name"
                  v-model="dependantDetail.dependant_name"
                  disabled
                  style="background-color: #f7fafc"
                />
              </div>

              <div class="mb-4">
                <label class="form-label" style="color: #4a5568; font-weight: 500; font-size: 14px"
                  >생년월일</label
                >
                <argon-input
                  v-model="dependantDetail.dependant_birth"
                  disabled
                  style="background-color: #f7fafc"
                />
              </div>

              <!-- 성별 -->
              <div class="mb-4">
                <label class="form-label" style="color: #4a5568; font-weight: 500; font-size: 14px"
                  >성별</label
                >
                <argon-input
                  id="tel"
                  v-if="changeMangerInfo"
                  v-model="dependantDetail.dependant_gender"
                  v-bind:disabled="changeMangerInfo"
                  style="background-color: #f7fafc"
                />
                <select
                  v-else
                  class="form-select"
                  v-model="selectGender"
                  style="
                    padding: 12px 16px;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    font-size: 14px;
                  "
                >
                  <option value="g1">남자</option>
                  <option value="g2">여자</option>
                </select>
              </div>

              <!-- 주소 -->
              <div class="mb-4">
                <label class="form-label" style="color: #4a5568; font-weight: 500; font-size: 14px"
                  >주소</label
                >
                <argon-input
                  v-if="changeMangerInfo"
                  id="email"
                  type="email"
                  aria-label="email"
                  disabled
                  v-model="dependantDetail.dependant_address"
                  style="background-color: #f7fafc"
                />
                <div v-else>
                  <div class="d-flex gap-2 mb-2">
                    <argon-input
                      v-model="detailAddress"
                      placeholder="주소"
                      disabled
                      style="flex: 1; background-color: #f7fafc"
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
                  <argon-input
                    id="detail_input"
                    placeholder="상세주소를 입력해주세요"
                    v-model="writingAddress"
                  />
                </div>
              </div>

              <!-- 장애유형 -->
              <div class="mb-4">
                <label class="form-label" style="color: #4a5568; font-weight: 500; font-size: 14px"
                  >장애유형</label
                >
                <argon-input
                  v-if="changeMangerInfo"
                  id="detail_input"
                  v-model="dependantDetail.disability_name"
                  disabled
                  style="background-color: #f7fafc"
                />
                <div v-else>
                  <select
                    class="form-select mb-2"
                    v-model="dependantDetail.disability_no"
                    style="
                      padding: 12px 16px;
                      border: 1px solid #e2e8f0;
                      border-radius: 8px;
                      font-size: 14px;
                    "
                    v-bind:disabled="changeMangerInfo"
                    @change="changeValue(dependantDetail.disability_no)"
                  >
                    <option
                      v-for="(disability, index) in disabilityName"
                      :value="index"
                      v-bind:key="index"
                    >
                      {{ disability.name }}
                    </option>
                  </select>
                  <argon-input
                    v-if="writingDisability"
                    id="disability_input"
                    placeholder="장애유형을 입력해주세요"
                    v-model="realDisability"
                  />
                </div>
              </div>

              <!-- 등록일 -->
              <div class="mb-4">
                <label class="form-label" style="color: #4a5568; font-weight: 500; font-size: 14px"
                  >등록일</label
                >
                <argon-input
                  id="email"
                  type="email"
                  aria-label="email"
                  v-model="dependantDetail.dependant_date"
                  disabled
                  style="background-color: #f7fafc"
                />
              </div>

              <!-- 버튼 그룹 -->
              <div class="d-flex justify-content-end gap-2 mt-5">
                <button
                  v-if="changeMangerInfo"
                  type="button"
                  class="btn"
                  @click="changeInfo"
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

                <template v-if="!changeMangerInfo">
                  <button
                    type="button"
                    class="btn"
                    @click="returnInfo"
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
                    @click="completeChangeInfo"
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
                    저장
                  </button>
                </template>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMyPageStore } from '@/stores/mypage'
import { useCounterStore } from '@/stores/member'
import ArgonInput from '@/components/ArgonInput.vue'
import axios from 'axios'
import Swal from 'sweetalert2'

const counter = useCounterStore()
const mypage = useMyPageStore()
const route = useRoute()
const router = useRouter()

let dependantDetail = ref({
  age: '',
  dependant_address: '',
  dependant_birth: '',
  dependant_date: '',
  dependant_gender: '',
  dependant_name: '',
  dependant_no: '',
  disability_name: '',
  disability_no: '',
  guardian_name: '',
  manager_main: '',
  manager_name: '',
  manager_sub: '',
  member_id: '',
}) // 해당 지원자

onBeforeMount(async () => {
  if (
    counter.isLogIn.info.member_authority == 'a3' ||
    counter.isLogIn.info.member_authority == 'a4'
  ) {
    await Swal.fire({
      icon: 'warning',
      title: '접근 권한 없음',
      text: '기관담당자, 보호자만 접근가능합니다.',
      confirmButtonText: '확인',
    })
    router.push({ name: 'Dashboard' })
    return
  }
  // 접속자가 담당자일때
  else if (counter.isLogIn.info.member_authority == 'a2') {
    await mypage.searchDependantInfo(counter.isLogIn.info.member_id)
    mypage.dependantInfo.forEach((member) => {
      if (member.dependant_no == route.params.id) {
        dependantDetail.value = member
        console.log('dependantDetail = member', dependantDetail.value)
        detailAddress.value = dependantDetail.value.dependant_address
        selectDisability.value = dependantDetail.value.disability_no

        return
      }
    })
  }

  // 접속자가 보호자일때
  else if (counter.isLogIn.info.member_authority == 'a1') {
    console.log('ture')
    await mypage.searchGuardianDependantInfo(counter.isLogIn.info.member_id)
    mypage.guardianDependantInfo.forEach((member) => {
      if (member.dependant_no == route.params.id) {
        dependantDetail.value = member
        console.log('dependantDetail = member', dependantDetail.value)
        detailAddress.value = dependantDetail.value.dependant_address
        selectDisability.value = dependantDetail.value.disability_no

        return
      }
    })
  }
})
// 드롭다운 성별
let selectGender = ref()

// 드롭다운 장애유형
let selectDisability = ref()

// 장애유형
let disabilityName = ref([
  { name: '선택', index: 0 },
  { name: '지체 장애', index: 1 },
  { name: '뇌병변 장애', index: 2 },
  { name: '시각 장애', index: 3 },
  { name: '청각 장애', index: 4 },
  { name: '언어 장애', index: 5 },
  { name: '안면 장애', index: 6 },
  { name: '신장 장애', index: 7 },
  { name: '심장 장애', index: 8 },
  { name: '간 장애', index: 9 },
  { name: '호흡기 장애', index: 10 },
  { name: '장루 요루 장애', index: 11 },
  { name: '뇌전증 장애', index: 12 },
  { name: '지적 장애', index: 13 },
  { name: '자폐성 장애', index: 14 },
  { name: '정신 장애', index: 15 },
  { name: '직접입력', index: 16 },
])

// 수정시 d}isabled 해제
let changeMangerInfo = ref(true)

const changeInfo = () => {
  changeMangerInfo.value = false
  detailAddress.value = dependantDetail.value.dependant_address
  selectGender.value = dependantDetail.value.dependant_gender
  if (selectGender.value == '남자') {
    selectGender.value = 'g1'
  } else {
    selectGender.value = 'g2'
  }

  disabilityName.value.forEach((data) => {
    console.log(data)
    if (data.index == dependantDetail.value.disability_no) {
      selectDisability.value = dependantDetail.value.disability_no
      if (selectDisability.value == 16) {
        writingDisability.value = true
      }
      return
    }
  })
}

// 취소버튼
const returnInfo = () => {
  changeMangerInfo.value = true
  postcode.value = ''
  extraAddress.value = ''
  detailAddress.value = dependantDetail.value.dependant_address
  selectGender.value = dependantDetail.value.dependant_gender
  selectDisability.value = dependantDetail.value.disability_name
  realDisability.value = ''
  writingDisability.value = false
  count.value = 0
}

// 주소 api에서 사용하는 함수들
let count = ref(0)
const postcode = ref('')
const extraAddress = ref('')
const detailAddress = ref('')
const writingAddress = ref('')

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

      postcode.value = data.zonecode // 우편번호
      detailAddress.value = addr // 기본 주소

      // 상세주소로 포커스 이동은 ref를 사용하거나 직접 접근
      count.value = 1
      document.getElementById('detail_input').focus()
    },
  }).open()
}

// 장애유형 선택 직접입력 선택시
let writingDisability = ref(false)
let realDisability = ref()
const changeValue = (data) => {
  console.log(data)
  if (data == 16) {
    writingDisability.value = true
  } else {
    writingDisability.value = false
  }
}

// 저장버튼
// 주소 합체

const completeChangeInfo = async () => {
  if (count.value == 1 && (writingAddress.value == '' || writingAddress.value == null)) {
    document.getElementById('detail_input').focus()
    await Swal.fire({
      icon: 'warning',
      title: '상세주소를 입력해주세요',
      confirmButtonText: '확인',
    })
    return
  }
  if (
    dependantDetail.value.disability_no == 16 &&
    (realDisability.value == '' || realDisability.value == null)
  ) {
    document.getElementById('disability_input').focus()
    await Swal.fire({
      icon: 'warning',
      title: '장애유형을 입력해주세요',
      confirmButtonText: '확인',
    })
    return
  }
  if (dependantDetail.value.disability_no == 0) {
    await Swal.fire({
      icon: 'warning',
      title: '장애유형을 선택해주세요',
      confirmButtonText: '확인',
    })
    return
  }

  await axios
    .put('/api/changeDependantInfo/' + dependantDetail.value.dependant_no, {
      dependant_gender: selectGender.value,
      dependant_address: `${detailAddress.value} ${writingAddress.value}`,
      disability_no: dependantDetail.value.disability_no,
    })
    .then(async (res) => {
      console.log(res)
      dependantDetail.value.dependant_address = `${detailAddress.value} ${writingAddress.value}`
      if (selectGender.value == 'g1') {
        dependantDetail.value.dependant_gender = '남자'
      } else {
        dependantDetail.value.dependant_gender = '여자'
      }
      disabilityName.value.forEach((data) => {
        if (data.index == dependantDetail.value.disability_no) {
          if (data.name == '직접입력') {
            dependantDetail.value.disability_name = '기타'
            return
          }
          dependantDetail.value.disability_name = data.name
          return
        }
      })

      realDisability.value = ''
      writingDisability.value = ''
      postcode.value = ''
      extraAddress.value = ''
      detailAddress.value = ''
      writingAddress.value = ''
      count.value = 0

      changeMangerInfo.value = true
      await Swal.fire({
        icon: 'success',
        title: '수정되었습니다!',
        showConfirmButton: false,
        timer: 1500,
      })
    })
}
</script>
<style scoped>
    .dep-wrapper {
  max-width: 1300px;
  margin: 0 auto;
}
</style>