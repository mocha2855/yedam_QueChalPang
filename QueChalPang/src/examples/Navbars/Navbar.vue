<!-- Navbar.vue -->
<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useCounterStore } from '@/stores/member'
import { storeToRefs } from 'pinia'

const counterStore = useCounterStore()
const { isLogIn } = storeToRefs(counterStore)
const router = useRouter()
const showMenu = ref(false)
const store = useStore()

// 현재 활성화된 메뉴를 표시하기 위한 로직
const getRoute = () => {
  const route = useRoute()
  const routeArr = route.path.split('/')
  return routeArr[1]
}

const toggleConfigurator = () => store.commit('toggleConfigurator')

const priority = (auth) => {
  if (isLogIn.value.isLogIn) {
    const roles = {
      a1: '일반사용자',
      a2: '담당자',
      a3: '관리자',
      a4: '시스템 관리자',
    }
    return roles[auth] || ''
  }
  return ''
}
const isConfirm = () => {
  if (isLogIn.value.isLogIn) {
    if (isLogIn.value.info.member_confirm == 'l2') {
      router.push({ name: 'notConfirmed' })
    }
  }
}

const clearInfo = () => {
  isLogIn.value.isLogIn = false
  isLogIn.value.info = { member_authority: '', member_name: '' }
  router.push({ name: '/' })
}
isConfirm()

// 마이페이지 이동
const goMyPage = () => {
  router.push({ name: 'myPage', params: { id: isLogIn.value.info.member_id } })
}
console.log(isLogIn.value.info.member_id)

const supportRoute = computed(() => {
  const auth = isLogIn.value?.info?.member_authority

  if (auth === 'a1' ) return '/tables'
  return '/tablesManager'
})

</script>

<template>
  <nav
    class="navbar navbar-expand-lg sticky-top bg-dark navbar-dark"
    v-bind="$attrs"
    id="navbarBlur"
    data-scroll="true"
  >
    <div class="container-fluid">
      <div class="mt-2 collapse navbar-collapse mt-sm-0 me-md-0 me-sm-4" id="navbar">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link
              to="/dashboard-default"
              class="nav-link text-black"
              :class="
                getRoute() === 'dashboard-default' ? 'font-weight-bold opacity-10' : 'opacity-6'
              "
            >
              <i class="ni ni-tv-2 me-2"></i>메인
            </router-link>
          </li>

          <li class="nav-item">
            <router-link
              :to="supportRoute"
              class="nav-link text-black"
              :class="getRoute().includes('tables') ? 'font-weight-bold opacity-10' : 'opacity-6'"
            >
              <i class="ni ni-calendar-grid-58 me-2"></i>지원현황
            </router-link>
          </li>

          <li v-if="isLogIn.info.member_authority === 'a2'" class="nav-item">
            <router-link
              to="/resrvTeacher"
              class="nav-link text-black"
              :class="getRoute() === 'reservTeacher' ? 'font-weight-bold opacity-10' : 'opacity-6'"
            >
              <i class="ni ni-world-2 me-2"></i>예약관리
            </router-link>
          </li>

          <li v-if="isLogIn.info.member_authority === 'a1'" class="nav-item">
            <router-link
              to="/resrvGuardian"
              class="nav-link text-black"
              :class="getRoute() === 'reservGuardian' ? 'font-weight-bold opacity-10' : 'opacity-6'"
            >
              <i class="ni ni-world-2 me-2"></i>상담예약신청
            </router-link>
          </li>

          <li v-if="isLogIn.info.member_authority === 'a1'" class="nav-item">
            <router-link
              to="/qnaGuardian"
              class="nav-link text-black"
              :class="getRoute() === 'qnaGuardian' ? 'font-weight-bold opacity-10' : 'opacity-6'"
            >
              <i class="ni ni-world-2 me-2"></i>문의하기
            </router-link>
          </li>

          <li v-if="isLogIn.info.member_authority === 'a4'" class="nav-item">
            <router-link
              to="/surveys"
              class="nav-link text-black"
              :class="getRoute() === 'surveys' ? 'font-weight-bold opacity-10' : 'opacity-6'"
            >
              <i class="ni ni-world-2 me-2"></i>지원서관리
            </router-link>
          </li>
          <li v-if="isLogIn.info.member_authority == ('a4' || 'a3')" class="nav-item">
            <router-link
              to="/centerList"
              class="nav-link text-black"
              :class="
                getRoute().indexOf('center') >= 0 ? 'font-weight-bold opacity-10' : 'opacity-6'
              "
            >
              <i class="ni ni-world-2 me-2"></i>센터관리
            </router-link>
          </li>
          <li v-if="isLogIn.info.member_authority === ('a4' || 'a2')" class="nav-item">
            <router-link
              to="/ApprovalUserList"
              class="nav-link text-black"
              :class="getRoute() === 'surveys' ? 'font-weight-bold opacity-10' : 'opacity-6'"
            >
              <i class="ni ni-world-2 me-2"></i>회원관리
            </router-link>
          </li>
        </ul>

        <ul class="navbar-nav justify-content-end">
          <li class="nav-item d-flex align-items-center">
            <router-link
              v-if="!isLogIn.isLogIn"
              :to="{ name: 'Signin' }"
              class="px-0 nav-link font-weight-bold text-black"
            >
              <i class="fa fa-user me-sm-2"></i>로그인
            </router-link>
            <span v-else class="d-flex align-items-center">
              <router-link
                :to="{ name: '/' }"
                class="px-0 nav-link font-weight-bold text-black me-3"
              >
                <i class="fa fa-user me-sm-2"></i>
                <span class="d-sm-inline d-none">
                  {{ priority(isLogIn.info?.member_authority) }} {{ isLogIn.info?.member_name }}님
                </span>
              </router-link>

              <div class="btn-group" role="group" aria-label="Basic example">
                <button type="button" class="btn btn-primary mb-0" @click="goMyPage">
                  마이페이지
                </button>
                <button
                  type="button"
                  class="btn btn-primary mb-0"
                  @click.prevent="clearInfo()"
                  @click="logOut"
                >
                  로그아웃
                </button>
              </div>
            </span>
          </li>

          <li class="px-3 nav-item d-flex align-items-center">
            <a class="p-0 nav-link text-black" @click="toggleConfigurator">
              <i class="cursor-pointer fa fa-cog"></i>
            </a>
          </li>
          <li class="nav-item dropdown d-flex align-items-center pe-2">
            <a
              href="#"
              class="p-0 nav-link text-black"
              :class="[showMenu ? 'show' : '']"
              @click="showMenu = !showMenu"
            >
              <i class="cursor-pointer fa fa-bell"></i>
            </a>
            <ul class="px-2 py-3 dropdown-menu dropdown-menu-end" :class="showMenu ? 'show' : ''">
              <li class="mb-2">
                <a class="dropdown-item border-radius-md" href="javascript:;">
                  <div class="py-1 d-flex">
                    <div class="my-auto">
                      <img src="../../assets/img/team-2.jpg" class="avatar avatar-sm me-3" />
                    </div>
                    <div class="d-flex flex-column justify-content-center">
                      <h6 class="mb-1 text-sm font-weight-normal">새로운 메시지가 도착했습니다.</h6>
                    </div>
                  </div>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.nav-link {
  transition: opacity 0.2s ease;
  display: flex;
  align-items: center;
  font-size: 1rem !important;
  font-weight: 500 !important;
  padding: 0.5rem 1rem !important;
}
.nav-link:hover {
  opacity: 1 !important;
}
</style>
