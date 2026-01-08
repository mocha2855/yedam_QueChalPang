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
    // 1. 방어 코드
    if (!member || !member.member_id) return

    // 2. 활성화된 버튼 키 추출 ('all' 제외)
    // 예: 사용자가 '대기' 버튼을 누르면 ['e1'], '계획'을 누르면 ['e3']
    let activeKey = Object.keys(selectedAppBtn.value).filter(
      (key) => selectedAppBtn.value[key] === true && key !== 'all',
    )

    // 3. API 호출
    const result = await axios.get(
      `/api/searchApplicationById/${member.member_id}/${member.member_authority}`,
      {
        params: { search: selectedOption.value, value: searchText.value, badge: 'e1,e2,e3,e4,e5' },
      },
    )

    const rows = Array.isArray(result.data) ? result.data : []

    // 4. Reduce로 필터링 + 가공 동시 수행
    applicationList.value = rows.reduce((acc, row) => {
      // [핵심 로직] 유효 상태 결정
      // 기본값은 DB의 status를 따라감
      let effectiveStatus = row.status

      // "완료(i2)가 아니면 무조건 대기(e1)로 취급한다"
      if (row.status_status !== 'i2') {
        effectiveStatus = 'e1'
      }

      // [필터링]
      // 현재 눌린 버튼(activeKey)에 이 데이터의 상태(effectiveStatus)가 포함되는가?
      // 예: 데이터가 'e1'이 되었는데, 사용자가 'e3' 버튼만 눌렀다면 -> 포함 안 됨 -> 버림(return acc)
      if (!activeKey.includes(effectiveStatus)) {
        return acc
      }

      // 5. 데이터 가공 (통과된 데이터만)
      const p1 = Number(row.p_i1 ?? 0)
      const p2 = Number(row.p_i2 ?? 0)
      const p3 = Number(row.p_i3 ?? 0)

      const r1 = Number(row.r_i1 ?? 0)
      const r2 = Number(row.r_i2 ?? 0)
      const r3 = Number(row.r_i3 ?? 0)

      acc.push({
        ...row,
        // [중요] 화면에 표시할 때도 '대기'로 보여주고 싶다면 아래 주석을 해제하세요.
        // status: effectiveStatus,

        planningCount: p1 + p2 + p3,
        resultCount: r1 + r2 + r3,
        counts: {
          i1: p1 + r1,
          i2: p2 + r2,
          i3: p3 + r3,
        },
      })

      return acc
    }, [])
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
