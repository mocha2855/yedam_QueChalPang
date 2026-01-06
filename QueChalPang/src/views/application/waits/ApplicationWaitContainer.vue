<script setup>
import { useCounterStore } from '@/stores/member'
import ApplicationWaitA2 from './ApplicationWaitA2.vue'
import ApplicationWaitA3 from './ApplicationWaitA3.vue'

const counter = useCounterStore()
const memAuthority = counter.isLogIn.info.member_authority
</script>

<template>
  <ApplicationWaitA2 v-if="memAuthority === 'a2'" />
  <ApplicationWaitA3 v-else-if="memAuthority === 'a3'" />
</template>
