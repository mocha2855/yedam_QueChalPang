import axios from 'axios'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useSearchStore = defineStore('search', () => {
  const selectedOption = ref('')
  const searchText = ref('')
  const member = ref({})
  const selectedCenterBtn = ref({})
  const centerSearchList = ref([])
  //지원신청 현황 목록용
  const selectedAppBtn = ref({})
  const applicationList = ref([])
  watch(
    selectedAppBtn,
    (newVal) => {
      console.log('버튼 상태 변경 감지:', newVal)
      // 여기서 다른 함수를 실행하거나 API를 호출할 수 있음
      getApplicationList(member.value)
    },
    { deep: true },
  )
  const getApplicationList = async (member) => {
    let activeKey = Object.keys(selectedAppBtn.value).filter(
      (key) => selectedAppBtn.value[key] === true && key !== 'all',
    )
    let stringifiedKey = activeKey.map((key) => `'${key}'`).join(',')
    console.log(stringifiedKey)
    const result = await axios.get(
      `/api/searchApplicationById/${member.member_id}/${member.member_authority}`,
      { params: { search: selectedOption.value, value: searchText.value, badge: stringifiedKey } },
    )

    const rows = Array.isArray(result.data) ? result.data : []

    applicationList.value = rows.map((row) => {
      //계획서 개수
      const p1 = Number(row.p_i1 ?? 0)
      const p2 = Number(row.p_i2 ?? 0)
      const p3 = Number(row.p_i3 ?? 0)

      //결과서 개수
      const r1 = Number(row.r_i1 ?? 0)
      const r2 = Number(row.r_i2 ?? 0)
      const r3 = Number(row.r_i3 ?? 0)
      console.log('ROW CHECK', row.dependant_no, row.dependant_name, row.application_no)

      return {
        ...row,
        planningCount: p1 + p2 + p3, //계획서 총개수
        resultCount: r1 + r2 + r3, //결과서 총개수
        counts: {
          i1: p1 + r1,
          i2: p2 + r2,
          i3: p3 + r3,
        },
      }
    })
  }
  watch(
    selectedCenterBtn,
    (newVal) => {
      console.log('버튼 상태 변경 감지:', newVal)
      // 여기서 다른 함수를 실행하거나 API를 호출할 수 있음
      getCenterList()
    },
    { deep: true },
  )
  const getCenterList = async () => {
    let activeKey = Object.keys(selectedCenterBtn.value).filter(
      (key) => selectedCenterBtn.value[key] === true,
    )
    let stringifiedKey = activeKey.map((key) => `'${key}'`).join(',')
    console.log(stringifiedKey)
    let result = await axios.get('/api/centers', {
      params: { key: selectedOption.value, value: searchText.value, badge: stringifiedKey },
    })
    centerSearchList.value = result.data
  }
  return {
    selectedAppBtn,
    selectedOption,
    searchText,
    applicationList,
    member,
    selectedCenterBtn,
    centerSearchList,
    getApplicationList,
    getCenterList,
  }
})
