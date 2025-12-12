<script setup>
import { RouterView } from "vue-router";
import HeaderComponent from "./layouts/HeaderComponent.vue";
import FooterComponent from "./layouts/FooterComponent.vue";
</script>

<template>
  <div>
    <HeaderComponent />
    <RouterView />
    <FooterComponent />
  </div>
</template>
