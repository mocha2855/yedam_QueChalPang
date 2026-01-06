<script setup>
defineProps({
  btnBackground: {
    type: String,
    default: '',
  },
  isBlur: {
    type: String,
    default: '',
  },
  darkMode: {
    type: Boolean,
    default: false,
  },
  isBtn: { type: String, default: 'bg-gradient-light' },
})
</script>
<template>
  <!-- Navbar -->
  <nav
    class="navbar navbar-expand-lg position-absolute"
    style="
      background: transparent;
      box-shadow: none !important;
      top: 24px;
      left: 32px;
      z-index: 1000;
      padding: 0;
    "
  >
    <router-link
      class="nav-link"
      to="/dashboard-default"
      style="font-size: 24px; color: #344767; padding: 0"
    >
      <i class="fas fa-arrow-left"></i>
    </router-link>
  </nav>
  <!-- End Navbar -->
</template>
