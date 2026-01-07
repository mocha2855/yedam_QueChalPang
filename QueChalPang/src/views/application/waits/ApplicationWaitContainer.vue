<script setup>
import { useCounterStore } from '@/stores/member'
import ApplicationWaitA2 from './ApplicationWaitA2.vue'
import ApplicationWaitA3 from './ApplicationWaitA3.vue'

import { computed, watchEffect } from 'vue'

const counter = useCounterStore()

//setup 실행 시점의 순간값으로 고정됨 undefiend였다가 a2가 되어도 업데이트가 안됨
//const memAuthority = counter.isLogIn.info.member_authority
const memAuthority = computed(() => counter.isLogIn?.info?.member_authority)

//멤버authority 콘솔에 찍기
watchEffect(() => {
  console.log('auth', memAuthority.value)
})
</script>

<template>
  <ApplicationWaitA2 v-if="memAuthority === 'a2'" />
  <ApplicationWaitA3 v-else-if="memAuthority === 'a3'" />
</template>
