<template>
  <div class="py-4 container-fluid" v-if="dependantDetail.value != ''">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header pb-0 px-5 mx-5">
            <h5>지원자 상세정보</h5>
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
                        disabled
                      />
                    </div>
                    <hr class="mb-4" style="height: 1px; background-color: black" />
                  </div>
                  <div class="row px-0">
                    <div class="col-1 px-0">
                      <h6 class="mt-2">생년월일</h6>
                    </div>
                    <div class="col-5 mb-2">
                      <argon-input v-model="dependantDetail.dependant_birth" disabled />
                    </div>
                    <hr class="mb-4" style="height: 1px; background-color: black" />
                  </div>

                  <div class="row px-0">
                    <div class="col-1 px-0">
                      <h6 class="mt-2">성별</h6>
                    </div>
                    <div class="col-5 mb-2">
                      <argon-input
                        id="tel"
                        v-if="changeMangerInfo"
                        v-model="dependantDetail.dependant_gender"
                      />
                      <select
                        class="btn btn px-0 col-6 mx-0"
                        v-model="selectGender"
                        style="text-align: left"
                        v-else
                      >
                        <option
                          class="dropdown-item"
                          value="남자"
                          v-bind:key="index"
                          style="color: #000; text-align: left"
                        >
                          남자
                        </option>
                        <option
                          class="dropdown-item"
                          value="여자"
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
                    <div class="col-5 mb-2" v-if="changeMangerInfo">
                      <argon-input
                        id="email"
                        type="email"
                        aria-label="email"
                        disabled
                        v-model="dependantDetail.dependant_address"
                      />
                    </div>

                    <div class="col-8 mb-2" v-else>
                      <div class="row gx-1">
                        <div class="col-7 px-0">
                          <argon-input v-model="postcode" placeholder="우편번호" disabled />
                        </div>
                        <div class="col-2">
                          <button
                            type="button"
                            class="p-2 btn btn-primary w-100"
                            @click="openPostcode"
                          >
                            주소 찾기
                          </button>
                        </div>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-1 px-0"><h6 class="mt-2"></h6></div>
                      <div class="col-5 mb-2" v-if="!changeMangerInfo">
                        <argon-input v-model="detailAddress" placeholder="주소" disabled />
                      </div>
                    </div>

                    <div class="row" v-if="!changeMangerInfo">
                      <div class="col-1 px-0"><h6 class="mt-2"></h6></div>
                      <div class="col-5 mb-2" v-if="!changeMangerInfo">
                        <argon-input id="detail_input" placeholder="상세주소" />
                      </div>
                    </div>
                    <hr class="mb-4" style="height: 1px; background-color: black" />
                  </div>
                  <div class="row px-0">
                    <div class="col-1 px-0">
                      <h6 class="mt-2">장애유형</h6>
                    </div>
                    <div class="col-5 mb-2" v-if="changeMangerInfo">
                      <argon-input
                        id="detail_input"
                        v-model="dependantDetail.disability_name"
                        disabled
                      />
                    </div>
                    <div class="col-5 mb-2" v-if="!changeMangerInfo">
                      <div class="row">
                        <select
                          class="btn btn px-0 col-6 mx-2"
                          v-model="selectDisability"
                          style="text-align: left"
                          v-bind:disabled="changeMangerInfo"
                          @change="changeValue(selectDisability)"
                        >
                          <option
                            class="dropdown-item"
                            v-for="(disability, index) in disabilityName"
                            :value="disability"
                            v-bind:key="index"
                            style="color: #000; text-align: left"
                          >
                            {{ disability }}
                          </option>
                        </select>
                        <div class="col-5 mb-2 px-0 ms-2" v-if="writingDisability">
                          <argon-input
                            id="detail_input"
                            placeholder="장애유형을 입력해주세요."
                            v-model="realDisability"
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
                        id="email"
                        type="email"
                        aria-label="email"
                        v-model="dependantDetail.dependant_date"
                        disabled
                      />
                    </div>
                    <hr class="mb-2" style="height: 1px; background-color: black" />
                  </div>

                  <div class="float-sm-end">
                    <button
                      type="button"
                      class="btn btn-primary"
                      @click="changeInfo"
                      v-if="changeMangerInfo"
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      class="btn btn-primary"
                      v-if="!changeMangerInfo"
                      @click="completeChangeInfo"
                    >
                      저장
                    </button>

                    <button
                      type="button"
                      class="btn btn-dark"
                      v-if="!changeMangerInfo"
                      @click="returnInfo"
                    >
                      취소
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
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useMyPageStore } from '@/stores/mypage'
import { useCounterStore } from '@/stores/member'
import ArgonInput from '@/components/ArgonInput.vue'

const counter = useCounterStore()
const mypage = useMyPageStore()
const route = useRoute()

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
  await mypage.searchDependantInfo(counter.isLogIn.info.member_id)
  mypage.dependantInfo.forEach((member) => {
    if (member.dependant_no == route.params.id) {
      dependantDetail.value = member
      console.log('dependantDetail = member', dependantDetail.value == '')
      detailAddress.value = dependantDetail.value.dependant_address
      selectGender.value = dependantDetail.value.dependant_gender
      selectDisability.value = dependantDetail.value.disability_name
      return
    }
  })
})
// 드롭다운 성별
let selectGender = ref()

// 드롭다운 장애유형
let selectDisability = ref()

// 장애유형
let disabilityName = ref([
  '지체 장애',
  '뇌병변 장애',
  '시각 장애',
  '청각 장애',
  '언어 장애',
  '안면 장애',
  '신장 장애',
  '심장 장애',
  '간 장애',
  '호흡기 장애',
  '장루·요루 장애',
  '뇌전증 장애',
  '지적 장애',
  '자폐성 장애',
  '정신 장애',
  '직접입력',
])

// 수정시 disabled 해제
let changeMangerInfo = ref(true)

const changeInfo = () => {
  changeMangerInfo.value = false
}

// 취소버튼
const returnInfo = () => {
  changeMangerInfo.value = true
  postcode.value = ''
  extraAddress.value = ''
  detailAddress.value = dependantDetail.value.dependant_address
  selectGender.value = dependantDetail.value.dependant_gender
  selectDisability.value = dependantDetail.value.disability_name
}

// 주소 api에서 사용하는 함수들
const postcode = ref('')
const extraAddress = ref('')
const detailAddress = ref('')

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

// 장애유형 선택 직접입력 선택시
let writingDisability = ref(false)
let realDisability = ref()
const changeValue = (data) => {
  if (data == '직접입력') {
    writingDisability.value = true
  }
}

// 저장버튼
const completeChangeInfo = () => {}
</script>
