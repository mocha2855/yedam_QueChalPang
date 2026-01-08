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
  if (isLogIn.value.info.member_authority == 'a2')
    router.push({ name: 'myPage', params: { id: isLogIn.value.info.member_id } })
  if (isLogIn.value.info.member_authority == 'a1')
    router.push({ name: 'myPageGuardian', params: { id: isLogIn.value.info.member_id } })
}

const supportRoute = computed(() => {
  const auth = isLogIn.value?.info?.member_authority
  switch (auth) {
    case 'a1':
      return '/tables'
    case 'a2':
      return '/tablesManager'
    case 'a3':
      return '/tablesAdmin'
    case 'a4':
      return '/tablesAdmin'
    default:
      return '/'
  }
})

// 일반회원만 베이지, 나머지는 파랑
const navbarColor = computed(() => {
  const authority = counterStore.isLogIn?.info?.member_authority

  // 로그인 안 했거나 일반회원이면 베이지
  if (!authority || authority === 'a1') {
    return '#f6f2eb' // 베이지
  }
  return '#7a9fba' // 담당자/관리자/시스템는 파랑
})

// 버튼 색깔 동적 설정
const myPageBtnClass = computed(() => {
  const authority = counterStore.isLogIn?.info?.member_authority
  return authority === 'a1' ? 'btn-beige' : 'btn-blue-light'
})

const logoutBtnClass = computed(() => {
  const authority = counterStore.isLogIn?.info?.member_authority
  return authority === 'a1' ? 'btn-beige-logout' : 'btn-logout'
})

// 글자 색상 동적 설정
const textColor = computed(() => {
  const authority = counterStore.isLogIn?.info?.member_authority
  // 로그인 안 했거나 a1이면 검정
  if (!authority || authority === 'a1') {
    return '#000000'
  }
  return '#ffffff'
})
// navbar 타입 (a1인지 아닌지)
const navbarType = computed(() => {
  const authority = counterStore.isLogIn?.info?.member_authority
  // 로그인 안 했거나 a1이면 navbar-a1 (검정 글자)
  if (!authority || authority === 'a1') {
    return 'navbar-a1'
  }
  return 'navbar-staff'
})
</script>

<template>
  <nav
    class="navbar navbar-expand-lg sticky-top custom-navbar"
    :class="navbarType"
    v-bind="$attrs"
    :style="{ backgroundColor: navbarColor }"
  >
    <div class="container-fluid">
      <!-- 로고 (a1과 미로그인 상태에만 표시) -->
      <router-link
        v-if="!isLogIn.isLogIn || isLogIn.info.member_authority === 'a1'"
        to="/"
        class="navbar-brand"
      >
        <img src="/네비사진.jpg" alt="발달장애인 지원프로그램 로고" class="navbar-logo" />
      </router-link>

      <div class="mt-2 collapse navbar-collapse mt-sm-0 me-md-0 me-sm-4" id="navbar">
        <ul class="navbar-nav me-auto">
          <li v-if="['a1', 'a2', 'a3'].includes(isLogIn.info.member_authority)" class="nav-item">
            <router-link
              to="/dashboard-default"
              class="nav-link"
              :style="{ color: textColor }"
              :class="
                getRoute() === 'dashboard-default' ? 'font-weight-bold opacity-10' : 'opacity-6'
              "
            >
              <i class="ni ni-tv-2 me-2"></i>메인
            </router-link>
          </li>

          <li
            v-if="['a1', 'a2', 'a3', 'a4'].includes(isLogIn.info.member_authority)"
            class="nav-item"
          >
            <router-link
              :to="supportRoute"
              class="nav-link"
              :style="{ color: textColor }"
              :class="getRoute().includes('tables') ? 'font-weight-bold opacity-10' : 'opacity-9'"
            >
              <i class="ni ni-single-copy-04 me-2"></i>지원현황
            </router-link>
          </li>

          <li v-if="isLogIn.info.member_authority === 'a2'" class="nav-item">
            <router-link
              to="/resrvTeacher"
              class="nav-link"
              :style="{ color: textColor }"
              :class="getRoute() === 'reservTeacher' ? 'font-weight-bold opacity-10' : 'opacity-9'"
            >
              <i class="ni ni-calendar-grid-58 me-2"></i>상담예약관리
            </router-link>
          </li>

          <li v-if="isLogIn.info.member_authority === 'a1'" class="nav-item">
            <router-link
              to="/resrvGuardian"
              class="nav-link"
              :style="{ color: textColor }"
              :class="getRoute() === 'resrvGuardian' ? 'font-weight-bold opacity-10' : 'opacity-9'"
            >
              <i class="ni ni-ui-04 me-2"></i>상담예약신청
            </router-link>
          </li>

          <li v-if="isLogIn.info.member_authority === 'a1'" class="nav-item">
            <router-link
              to="/qnaGuardian"
              class="nav-link"
              :style="{ color: textColor }"
              :class="getRoute() === 'qnaGuardian' ? 'font-weight-bold opacity-10' : 'opacity-9'"
            >
              <i class="ni ni-support-16 me-2"></i>문의하기
            </router-link>
          </li>

          <li v-if="isLogIn.info.member_authority === 'a4'" class="nav-item">
            <router-link
              to="/surveys"
              class="nav-link"
              :style="{ color: textColor }"
              :class="getRoute() === 'surveys' ? 'font-weight-bold opacity-10' : 'opacity-9'"
            >
              <i class="ni ni-single-copy-04 me-2"></i>지원서관리
            </router-link>
          </li>

          <li v-if="isLogIn.info.member_authority == 'a4'" class="nav-item">
            <router-link
              to="/centerList"
              class="nav-link"
              :style="{ color: textColor }"
              :class="
                getRoute().indexOf('center') >= 0 ? 'font-weight-bold opacity-10' : 'opacity-9'
              "
            >
              <i class="ni ni-building me-2"></i>센터관리
            </router-link>
          </li>
          <li v-if="isLogIn.info.member_authority === 'a4'" class="nav-item">
            <router-link
              to="/ApprovalUserList"
              class="nav-link"
              :style="{ color: textColor }"
              :class="getRoute() === 'surveys' ? 'font-weight-bold opacity-10' : 'opacity-9'"
            >
              <i class="ni ni-circle-08 me-2"></i>회원관리
            </router-link>
          </li>
          <li v-if="isLogIn.info.member_authority === 'a3'" class="nav-item">
            <router-link
              to="/UserList"
              class="nav-link"
              :style="{ color: textColor }"
              :class="getRoute() === 'surveys' ? 'font-weight-bold opacity-10' : 'opacity-9'"
            >
              <i class="ni ni-circle-08 me-2"></i>회원관리
            </router-link>
          </li>
        </ul>

        <ul class="navbar-nav justify-content-end">
          <li class="nav-item d-flex align-items-center">
            <router-link
              v-if="!isLogIn.isLogIn"
              :to="{ name: 'Signin' }"
              class="px-0 nav-link font-weight-bold"
              :style="{ color: textColor }"
            >
              <i class="fa fa-user me-sm-2"></i>로그인
            </router-link>
            <span v-else class="d-flex align-items-center">
              <router-link
                :to="{ name: '/' }"
                class="px-0 nav-link font-weight-bold me-3"
                :style="{ color: textColor }"
              >
                <i class="fa fa-user me-sm-2"></i>
                <span class="d-sm-inline d-none">
                  {{ priority(isLogIn.info?.member_authority) }} {{ isLogIn.info?.member_name }}님
                </span>
              </router-link>

              <span class="d-flex align-items-center gap-2">
                <button
                  v-if="isLogIn?.info?.member_authority !== 'a4'"
                  type="button"
                  :class="['btn mb-0', myPageBtnClass]"
                  @click="goMyPage"
                >
                  마이페이지
                </button>
                <button
                  type="button"
                  :class="['btn mb-0', logoutBtnClass]"
                  @click.prevent="clearInfo()"
                  @click="logOut"
                >
                  로그아웃
                </button>
              </span>
            </span>
          </li>

          <li class="px-3 nav-item d-flex align-items-center">
            <a class="p-0 nav-link" :style="{ color: textColor }" @click="toggleConfigurator">
              <i class="cursor-pointer fa fa-cog"></i>
            </a>
          </li>
          <li class="nav-item dropdown d-flex align-items-center pe-2">
            <a
              href="#"
              class="p-0 nav-link"
              :style="{ color: textColor }"
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
/* 메인 메뉴 - 기본 스타일 */
.navbar-nav.me-auto .nav-link {
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  font-size: 16px !important;
  font-weight: 500 !important;
  padding: 8px 16px !important;
}

/* a1일 때: 검정 -> 화이트 호버 */
.navbar-a1 .navbar-nav.me-auto .nav-link:hover {
  color: #ffffff !important;
}

/* a2/a3/a4일 때: 화이트 -> 블랙 호버 */
.navbar-staff .navbar-nav.me-auto .nav-link:hover {
  color: #000000 !important;
}

/* 오른쪽 메뉴 - 호버 효과 없음 */
.navbar-nav.justify-content-end .nav-link {
  display: flex;
  align-items: center;
  font-size: 16px !important;
  font-weight: 500 !important;
  padding: 8px 16px !important;
}

.navbar-nav.justify-content-end .nav-link:hover {
  opacity: 1 !important;
}

/* a1용 베이지 버튼 */
.btn-beige {
  background-color: #293f30;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
}

.btn-beige:hover,
.btn-beige:active,
.btn-beige:focus {
  background-color: #293f30 !important;
  color: white !important;
  box-shadow: none !important;
  transform: none !important;
}

.btn-beige-logout {
  background-color: #3d5f48;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
}

.btn-beige-logout:hover,
.btn-beige-logout:active,
.btn-beige-logout:focus {
  background-color: #3d5f48 !important;
  color: white !important;
  box-shadow: none !important;
  transform: none !important;
}

.btn-blue-light {
  background-color: #5b9bcf;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
}

.btn-blue-light:hover,
.btn-blue-light:active,
.btn-blue-light:focus {
  background-color: #5b9bcf !important;
  color: white !important;
  box-shadow: none !important;
  transform: none !important;
}

/* 로그아웃 버튼 */
.btn-logout {
  background-color: #d77064;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
}

.btn-logout:hover,
.btn-logout:active,
.btn-logout:focus {
  background-color: #d77064 !important;
  color: white !important;
  box-shadow: none !important;
  transform: none !important;
}

.gap-2 {
  gap: 8px;
}

/* navbar 높이 고정 */
.custom-navbar {
  height: 70px; /* navbar 높이 고정 */
  min-height: 70px;
}

.navbar .container-fluid {
  height: 100%;
  align-items: center;
}

/* 로고 스타일 */
.navbar-brand {
  display: flex;
  align-items: center;
  padding: 0;
  margin-right: 10px;
  text-decoration: none;
  height: 100%;
  position: relative;
  z-index: 10;
}

.navbar-logo {
  height: 180px; /* navbar보다 크게! */
  width: auto;
  object-fit: contain;
  margin-top: -25px;
  margin-bottom: -10px;
}

.navbar-nav.me-auto {
  margin-left: -20px;
}
</style>
