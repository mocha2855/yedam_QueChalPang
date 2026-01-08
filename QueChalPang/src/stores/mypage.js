//survey.js
import { defineStore } from 'pinia'
import axios from 'axios'
export const useMyPageStore = defineStore('myPage', {
  //state
  state: () => {
    return {
      managerInfo: [], // 담당자 정보
      dependantInfo: [], // 지원자 정보
      guardianInfo: [], // 보호자 정보
      guardianDependantInfo: [], // 보호자 지원자 정보
      centerInfo: [], // 센터정보(관리자)
    }
  },
  _actions: {
    // 담당자 정보
    async searchManagerInfo(id) {
      this.managerInfo = (await axios.get('/api/managerInfo/' + id)).data[0]
      const changeDateType = (day) => {
        let date = new Date(day)
        day = `${date.getFullYear(day)}-${date.getMonth(day) + 1}-${date.getDate(day)}`
        return day
      }
      this.managerInfo.center_start = changeDateType(this.managerInfo.center_start)
      this.managerInfo.member_date = changeDateType(this.managerInfo.member_date)
      console.log('담당자: ', this.managerInfo)
      return this.managerInfo
    },

    // 지원자 정보
    async searchDependantInfo(id) {
      console.log('id:', id)
      this.dependantInfo = (await axios.get('/api/dependantInfoList/' + id)).data

      // 날짜 형식 변경 함수
      const changeDateType = (day) => {
        let date = new Date(day)
        let realDay = `${date.getFullYear(day)}-${date.getMonth(day) + 1}-${date.getDate(day)}`
        return realDay
      }

      // 나이 함수
      const getAge = (birthday) => {
        let today = new Date()
        let birthDay = new Date(birthday)
        let age = today.getFullYear() - birthDay.getFullYear()

        let todayMonth = today.getMonth() + 1
        let birthMonth = birthDay.getMonth() + 1

        if (
          birthMonth > todayMonth ||
          (birthMonth === todayMonth && birthDay.getDate() >= today.getDate())
        ) {
          age--
        }
        return age
      }

      // 날짜 형식 변경 및 나이계산, 성별 변경
      this.dependantInfo.forEach((member) => {
        member.age = getAge(member.dependant_birth)
        member.dependant_birth = changeDateType(member.dependant_birth)
        member.dependant_date = changeDateType(member.dependant_date)
        if (member.dependant_gender == 'g1') {
          member.dependant_gender = '남자'
        } else {
          member.dependant_gender = '여자'
        }
      })

      console.log('지원자: ', this.dependantInfo)
      return this.dependantInfo
    },

    // 보호자
    // 보호자 정보
    async searchGuardianInfo(id) {
      this.guardianInfo = (await axios.get('/api/guardianInfo/' + id)).data

      // 날짜 형식 변경 함수
      const changeDateType = (day) => {
        let date = new Date(day)
        let realDay = `${date.getFullYear(day)}-${date.getMonth(day) + 1}-${date.getDate(day)}`
        return realDay
      }

      // 나이 함수
      const getAge = (birthday) => {
        let today = new Date()
        let birthDay = new Date(birthday)
        let age = today.getFullYear() - birthDay.getFullYear()

        let todayMonth = today.getMonth() + 1
        let birthMonth = birthDay.getMonth() + 1

        if (
          birthMonth > todayMonth ||
          (birthMonth === todayMonth && birthDay.getDate() >= today.getDate())
        ) {
          age--
        }
        return age
      }
      this.guardianInfo.forEach((member) => {
        member.member_date = changeDateType(member.member_date)
        member.dependant_date = changeDateType(member.dependant_date)
        member.dependant_birth = changeDateType(member.dependant_birth)
        member.dependant_age = getAge(member.dependant_birth)
        if (member.dependant_gender == 'g1') {
          member.dependant_gender = '남자'
        } else {
          member.dependant_gender = '여자'
        }
      })
    },

    // 보호자 지원자 목록
    async searchGuardianDependantInfo(id) {
      this.guardianDependantInfo = (await axios.get('/api/selectGuardianDependantById/' + id)).data

      // 날짜 형식 변경 함수
      const changeDateType = (day) => {
        let date = new Date(day)
        let realDay = `${date.getFullYear(day)}-${date.getMonth(day) + 1}-${date.getDate(day)}`
        return realDay
      }

      // 나이 함수
      const getAge = (birthday) => {
        let today = new Date()
        let birthDay = new Date(birthday)
        let age = today.getFullYear() - birthDay.getFullYear()

        let todayMonth = today.getMonth() + 1
        let birthMonth = birthDay.getMonth() + 1

        if (
          birthMonth > todayMonth ||
          (birthMonth === todayMonth && birthDay.getDate() >= today.getDate())
        ) {
          age--
        }
        return age
      }

      this.guardianDependantInfo.forEach((member) => {
        member.dependant_date = changeDateType(member.dependant_date)
        member.dependant_birth = changeDateType(member.dependant_birth)
        member.dependant_age = getAge(member.dependant_birth)
        if (member.dependant_gender == 'g1') {
          member.dependant_gender = '남자'
        } else {
          member.dependant_gender = '여자'
        }
      })
    },

    // 관리자
    // 기관 정보
    async searchAdminCenterInfo() {
      this.centerInfo = (await axios.get('/api/findCenterInfoById')).data
    },
  },
  get actions() {
    return this._actions
  },
  set actions(value) {
    this._actions = value
  },
})
