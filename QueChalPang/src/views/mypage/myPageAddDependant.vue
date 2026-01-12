<template>
  <div
    class="py-4 container-fluid"
    v-if="
      counter.isLogIn.info.member_authority == 'a1' || counter.isLogIn.info.member_authority == 'a2'
    "
  >
    <div class="row">
      <div class="col-12">
        <!-- 헤더 섹션 -->
        <div class="mb-4">
          <h3 class="mb-2" style="color: #2d3748; font-weight: 600">지원자 등록</h3>
          <p style="color: #718096">새로운 지원자 정보를 등록합니다</p>
        </div>

        <!-- 메인 카드 -->
        <div class="card shadow-sm" style="border: none; border-radius: 16px">
          <div class="card-body p-5">
            <form role="form">
              <!-- 이름 -->
              <div class="mb-4">
                <label class="form-label" style="color: #4a5568; font-weight: 500; font-size: 14px"
                  >이름</label
                >
                <argon-input
                  id="name"
                  type="text"
                  aria-label="Name"
                  v-model="dependantDetail.dependant_name"
                  v-bind:disabled="changeMangerInfo"
                />
              </div>

              <!-- 생년월일 -->
              <div class="mb-4">
                <label class="form-label" style="color: #4a5568; font-weight: 500; font-size: 14px"
                  >생년월일</label
                >
                <argon-input
                  type="date"
                  v-model="dependantDetail.dependant_birth"
                  v-bind:disabled="changeMangerInfo"
                />
              </div>

              <!-- 성별 -->
              <div class="mb-4">
                <label class="form-label" style="color: #4a5568; font-weight: 500; font-size: 14px"
                  >성별</label
                >
                <select
                  class="form-select"
                  v-model="dependantDetail.dependant_gender"
                  v-bind:disabled="changeMangerInfo"
                  style="
                    padding: 12px 16px;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    font-size: 14px;
                  "
                >
                  <option value="g0">선택</option>
                  <option value="g1">남자</option>
                  <option value="g2">여자</option>
                </select>
              </div>

              <!-- 주소 -->
              <div class="mb-4">
                <label class="form-label" style="color: #4a5568; font-weight: 500; font-size: 14px"
                  >주소</label
                >
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
                    v-bind:disabled="changeMangerInfo"
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
                  v-bind:disabled="changeMangerInfo"
                />
              </div>

              <!-- 장애유형 -->
              <div class="mb-4">
                <label class="form-label" style="color: #4a5568; font-weight: 500; font-size: 14px"
                  >장애유형</label
                >
                <select
                  class="form-select mb-2"
                  v-model="dependantDetail.disability_no"
                  @change="changeValue(dependantDetail.disability_no)"
                  v-bind:disabled="changeMangerInfo"
                  style="
                    padding: 12px 16px;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    font-size: 14px;
                  "
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
                  v-bind:disabled="changeMangerInfo"
                />
              </div>

              <!-- 등록일 -->
              <div class="mb-4">
                <label class="form-label" style="color: #4a5568; font-weight: 500; font-size: 14px"
                  >등록일</label
                >
                <argon-input
                  id="day"
                  type="text"
                  aria-label="text"
                  v-model="today"
                  disabled
                  style="background-color: #f7fafc"
                />
              </div>

              <!-- 버튼 -->
              <div class="d-flex justify-content-end mt-5">
                <button
                  type="button"
                  class="btn"
                  @click="completeChangeInfo"
                  v-if="!changeMangerInfo"
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
                  등록
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import ArgonInput from '@/components/ArgonInput.vue'
import { useCounterStore } from '@/stores/member'
import axios from 'axios'
import Swal from 'sweetalert2'

const counter = useCounterStore()

const router = useRouter()

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
  }
})

// 등록날짜 출력
let date = new Date()
console.log(date)
let today = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
console.log(today)

// 주소 api에서 사용하는 함수들
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
      document.getElementById('detail_input').focus()
    },
  }).open()
}

// 입력정보
let dependantDetail = ref({
  dependant_birth: '',
  dependant_date: today,
  dependant_gender: 'g0',
  dependant_name: '',
  disability_no: 0,
  manager_main: '',
}) // 해당 지원자

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
let changeMangerInfo = ref(false)
const completeChangeInfo = async () => {
  if (dependantDetail.value.dependant_name == '' || dependantDetail.value.dependant_name == null) {
    await Swal.fire({
      icon: 'warning',
      title: '이름을 입력해주세요',
      confirmButtonText: '확인',
    })
    return
  } else if (
    dependantDetail.value.dependant_birth == '' ||
    dependantDetail.value.dependant_birth == null
  ) {
    await Swal.fire({
      icon: 'warning',
      title: '생일을 입력해주세요',
      confirmButtonText: '확인',
    })
    return
  } else if (dependantDetail.value.dependant_gender == 'g0') {
    await Swal.fire({
      icon: 'warning',
      title: '성별을 선택해주세요',
      confirmButtonText: '확인',
    })
    return
  } else if (detailAddress.value == '' || detailAddress.value == null) {
    await Swal.fire({
      icon: 'warning',
      title: '주소를 입력해주세요',
      confirmButtonText: '확인',
    })
    return
  } else if (writingAddress.value == '' || writingAddress.value == null) {
    document.getElementById('detail_input').focus()
    await Swal.fire({
      icon: 'warning',
      title: '상세주소를 입력해주세요',
      confirmButtonText: '확인',
    })
    return
  } else if (dependantDetail.value.disability_no == 0) {
    await Swal.fire({
      icon: 'warning',
      title: '장애유형을 선택해주세요',
      confirmButtonText: '확인',
    })
    return
  } else if (
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
  } else if (
    dependantDetail.value.disability_no == 16 &&
    (realDisability.value != '' || realDisability.value != null)
  ) {
    dependantDetail.value.disability_no = 16
  }

  if (counter.isLogIn.info.member_authority == 'a2') {
    await axios
      .post('/api/addDependantInfo', {
        dependant_name: dependantDetail.value.dependant_name,
        dependant_birth: dependantDetail.value.dependant_birth,
        dependant_gender: dependantDetail.value.dependant_gender,
        dependant_address: `${detailAddress.value} ${writingAddress.value}`,
        disability_no: dependantDetail.value.disability_no,
        dependant_date: dependantDetail.value.dependant_date,
        manager_main: counter.isLogIn.info.member_id,
      })
      .then(async (res) => {
        console.log(res)
        await Swal.fire({
          icon: 'success',
          title: '등록되었습니다!',
          showConfirmButton: false,
          timer: 1500,
        })
        changeMangerInfo.value = true
        router.push({ path: `/myPageList/${counter.isLogIn.info.member_id}` })
        return
      })
  } else if (counter.isLogIn.info.member_authority == 'a1') {
    await axios
      .post('/api/addDependantInfo', {
        dependant_name: dependantDetail.value.dependant_name,
        dependant_birth: dependantDetail.value.dependant_birth,
        dependant_gender: dependantDetail.value.dependant_gender,
        dependant_address: `${detailAddress.value} ${writingAddress.value}`,
        disability_no: dependantDetail.value.disability_no,
        dependant_date: today,
        member_id: counter.isLogIn.info.member_id,
      })
      .then(async (res) => {
        console.log(res)
        await Swal.fire({
          icon: 'success',
          title: '등록되었습니다!',
          showConfirmButton: false,
          timer: 1500,
        })
        changeMangerInfo.value = true
        router.push({ path: `/myPageGuardianList` })
        return
      })
  }
}
</script>
