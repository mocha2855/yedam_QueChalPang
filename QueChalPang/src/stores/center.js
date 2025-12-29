import { defineStore } from 'pinia'
import axios from 'axios'

export const useCenterStore = defineStore('center', {
  state: () => {
    return {
      centerList: [],
      centerInfo: {
        center_no: 0,
        center_name: '',
        center_address: '',
        center_tel: '',
        center_email: '',
        center_status: '',
        center_start: '',
        center_end: '',
        center_lunch: '',
      },
    }
  },
  actions: {
    async getCenterList() {
      let result = await axios.get('/api/centers')
      this.centerList = result.data
    },
    async getInfo(no) {
      let result = await axios.get(`/api/center/${no}`)
      const {
        center_name,
        center_address,
        center_tel,
        center_email,
        center_status,
        center_start,
        center_end,
        center_lunch,
      } = result.data
      this.centerInfo.center_no = no
      this.centerInfo.center_name = center_name
      this.centerInfo.center_address = center_address
      this.centerInfo.center_tel = center_tel
      this.centerInfo.center_email = center_email
      this.centerInfo.center_status = center_status
      this.centerInfo.center_start = center_start
      this.centerInfo.center_end = center_end
      this.centerInfo.center_lunch = center_lunch
    },
  },
  getters: {},

  persist: true,
})
