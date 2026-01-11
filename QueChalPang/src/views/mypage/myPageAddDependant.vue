<template>
  <div
    class="py-4 container-fluid"
    v-if="
      counter.isLogIn.info.member_authority == 'a1' || counter.isLogIn.info.member_authority == 'a2'
    "
  >
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header pb-0 px-5 mx-5">
            <h5>지원자 등록</h5>
            <hr class="mb-4" style="height: 5px; background-color: black" />
          </div>
          <div class="card-body px-0 pt-0 pb-2">
            <div class="container px-0">
              <div class="card-body px-0 py-0">
                <form role="form">
                  <div class="row px-0">
                    <div class="col-1 px-0">
                      <h6 class="mt-2">이름</h6>
                    </div>
                    <div class="col-5 mb-2">
                      <argon-input
                        id="name"
                        type="text"
                        aria-label="Name"
                        v-model="dependantDetail.dependant_name"
                        v-bind:disabled="changeMangerInfo"
                      />
                    </div>
                    <hr class="mb-4" style="height: 1px; background-color: black" />
                  </div>
                  <div class="row px-0">
                    <div class="col-1 px-0">
                      <h6 class="mt-2">생년월일</h6>
                    </div>
                    <div class="col-5 mb-2">
                      <argon-input
                        type="date"
                        v-model="dependantDetail.dependant_birth"
                        v-bind:disabled="changeMangerInfo"
                      />
                    </div>
                    <hr class="mb-4" style="height: 1px; background-color: black" />
                  </div>

                  <div class="row px-0">
                    <div class="col-1 px-0">
                      <h6 class="mt-2">성별</h6>
                    </div>
                    <div class="col-5 mb-2">
                      <select
                        class="btn btn px-0 col-12 mx-0"
                        v-model="dependantDetail.dependant_gender"
                        v-bind:disabled="changeMangerInfo"
                        style="text-align: left"
                      >
                        <option
                          class="dropdown-item"
                          value="g0"
                          v-bind:key="index"
                          style="color: #000; text-align: left"
                        >
                          선택
                        </option>
                        <option
                          class="dropdown-item"
                          value="g1"
                          v-bind:key="index"
                          style="color: #000; text-align: left"
                        >
                          남자
                        </option>
                        <option
                          class="dropdown-item"
                          value="g2"
                          v-bind:key="index"
                          style="color: #000; text-align: left"
                        >
                          여자
                        </option>
                      </select>
                    </div>
                    <hr class="mb-4" style="height: 1px; background-color: black" />
                  </div>

                  <div class="row px-0">
                    <div class="col-1 px-0">
                      <h6 class="mt-2">주소</h6>
                    </div>

                    <div class="col-5 mb-2">
                      <argon-input v-model="detailAddress" placeholder="주소" disabled />
                    </div>
                    <div class="col-1">
                      <button
                        type="button"
                        class="p-2 btn btn-primary w-100"
                        @click="openPostcode"
                        v-bind:disabled="changeMangerInfo"
                      >
                        주소 찾기
                      </button>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-1 px-0"><h6 class="mt-2"></h6></div>
                    <div class="col-5 mb-2">
                      <argon-input
                        id="detail_input"
                        placeholder="상세주소"
                        v-model="writingAddress"
                        v-bind:disabled="changeMangerInfo"
                      />
                    </div>
                  </div>
                  <hr class="mb-4" style="height: 1px; background-color: black" />

                  <div class="row px-0">
                    <div class="col-1 px-0">
                      <h6 class="mt-2">장애유형</h6>
                    </div>

                    <div class="col-5 mb-2">
                      <div class="row">
                        <select
                          class="btn btn px-0 col-6 mx-2"
                          v-model="dependantDetail.disability_no"
                          @change="changeValue(dependantDetail.disability_no)"
                          v-bind:disabled="changeMangerInfo"
                        >
                          <option
                            class="dropdown-item"
                            v-for="(disability, index) in disabilityName"
                            :value="index"
                            v-bind:key="index"
                            style="color: #000; text-align: left"
                          >
                            {{ disability.name }}
                          </option>
                        </select>
                        <div class="col-5 mb-2 px-0 ms-2" v-if="writingDisability">
                          <argon-input
                            id="disability_input"
                            placeholder="장애유형을 입력해주세요."
                            v-model="realDisability"
                            v-bind:disabled="changeMangerInfo"
                          />
                        </div>
                      </div>
                    </div>

                    <hr class="mb-4" style="height: 1px; background-color: black" />
                  </div>

                  <div class="row px-0">
                    <div class="col-1 px-0">
                      <h6 class="mt-2">등록일</h6>
                    </div>
                    <div class="col-5 mb-2">
                      <argon-input
                        id="day"
                        type="text"
                        aria-label="text"
                        v-model="today"
                        disabled
                      />
                    </div>
                    <hr class="mb-2" style="height: 1px; background-color: black" />
                  </div>

                  <div class="float-sm-end">
                    <button
                      type="button"
                      class="btn btn-primary"
                      @click="completeChangeInfo"
                      v-if="!changeMangerInfo"
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
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import ArgonInput from '@/components/ArgonInput.vue'
import { useCounterStore } from '@/stores/member'
import axios from 'axios'

const counter = useCounterStore()

const router = useRouter()

onBeforeMount(() => {
  if (
    counter.isLogIn.info.member_authority == 'a3' ||
    counter.isLogIn.info.member_authority == 'a4'
  ) {
    alert('기관담당자, 보호자만 접근가능합니다.')
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
    alert('이름을 입력해주세요')
    return
  } else if (
    dependantDetail.value.dependant_birth == '' ||
    dependantDetail.value.dependant_birth == null
  ) {
    alert('생일을 입력해주세요')
    return
  } else if (dependantDetail.value.dependant_gender == 'g0') {
    alert('성별을 선택해주세요')
    return
  } else if (detailAddress.value == '' || detailAddress.value == null) {
    alert('주소를 입력해주세요')
    return
  } else if (writingAddress.value == '' || writingAddress.value == null) {
    document.getElementById('detail_input').focus()
    alert('주소를 입력해주세요')
    return
  } else if (dependantDetail.value.disability_no == 0) {
    alert('장애유형을 선택해주세요.')
    return
  } else if (
    dependantDetail.value.disability_no == 16 &&
    (realDisability.value == '' || realDisability.value == null)
  ) {
    document.getElementById('disability_input').focus()
    alert('장애유형을 입력해주세요')
    return
  } else if (
    dependantDetail.value.disability_no == 16 &&
    (realDisability.value != '' || realDisability.value != null)
  ) {
    dependantDetail.value.disability_no = 16
  }

  if (counter.isLogIn.info.member_authority == 'a2') {
    await axios //
      .post('/api/addDependantInfo', {
        dependant_name: dependantDetail.value.dependant_name,
        dependant_birth: dependantDetail.value.dependant_birth,
        dependant_gender: dependantDetail.value.dependant_gender,
        dependant_address: `${detailAddress.value} ${writingAddress.value}`,
        disability_no: dependantDetail.value.disability_no,
        dependant_date: dependantDetail.value.dependant_date,
        manager_main: counter.isLogIn.info.member_id,
      })
      .then((res) => {
        console.log(res)
        alert('등록완료')
        changeMangerInfo.value = true
        router.push({ path: `/myPageList/${counter.isLogIn.info.member_id}` })
        return
      })
  } else if (counter.isLogIn.info.member_authority == 'a1') {
    await axios //
      .post('/api/addDependantInfo', {
        dependant_name: dependantDetail.value.dependant_name,
        dependant_birth: dependantDetail.value.dependant_birth,
        dependant_gender: dependantDetail.value.dependant_gender,
        dependant_address: `${detailAddress.value} ${writingAddress.value}`,
        disability_no: dependantDetail.value.disability_no,
        dependant_date: today,
        member_id: counter.isLogIn.info.member_id,
      })
      .then((res) => {
        console.log(res)
        alert('등록완료')
        changeMangerInfo.value = true
        router.push({ path: `/myPageGuardianList` })
        return
      })
  }
}
</script>
