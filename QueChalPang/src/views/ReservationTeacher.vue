<script setup>
import { ref } from 'vue';
import { DatePicker } from 'v-calendar';
import 'v-calendar/style.css';

import ReservationTable from "./components/ReservationTable.vue";
const selectedDate = ref(new Date());
</script>

<template>
  <div class="py-4 container-fluid">
    <div class="row mb-4">
      <div class="col-12">
        <div class="card p-3">
          <h6 class="mb-3">날짜 선택</h6>
          <DatePicker 
            v-model="selectedDate" 
            expanded 
            locale="ko" 
          />
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <reservation-table />
      </div>
    </div>
  </div>
</template>