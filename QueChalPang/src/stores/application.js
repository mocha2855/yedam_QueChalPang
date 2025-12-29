//survey.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
export const useApplicationStore = defineStore('applications', {
  //state
  state: () => {
    return {
      planned: ref([]), // 계획 추가 시 몇번째 파악
      allPlanned: ref(), // 계획서 불러오기
      planningReview: ref([]), // 검토중 계획서
      planningSuccess: ref([]), // 승인완료 계획서
      planningRejected: ref([]), // 반려된 계획서
    }
  },
  actions: {
    // 계획서 갯수 파악
    async countPlanning(no) {
      this.planned = await axios.get('/api/planning/' + no)
      return this.planned
    },

    async countRealReview(no) {
      this.allPlanned = (await axios.get('/api/planningReview/' + no)).data
      console.log(this.allPlanned.length)
      for (let i = 0; i < this.allPlanned.length; i++) {
        console.log(this.allPlanned[i].planning_status === 'i3')
        if (this.allPlanned[i].planning_status === 'i1') {
          this.planningReview.push(this.allPlanned[i])
          console.log(this.planningReview)
        } else if (this.allPlanned[i].planning_status === 'i2') {
          this.planningSuccess.push(this.allPlanned[i])
          console.log(this.planningSuccess)
        } else if (this.allPlanned[i].planning_status === 'i3') {
          this.planningRejected.push(this.allPlanned[i])
          console.log(this.planningRejected)
        }
      }
    },
  },
})
