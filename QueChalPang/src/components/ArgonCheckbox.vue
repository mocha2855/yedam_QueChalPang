<script setup>
defineProps({
  name: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    default: '',
  },
  checked: {
    type: Boolean,
    default: false,
  },
})
</script>
<template>
  <div class="form-check">
    <input :id="id" class="form-check-input" type="checkbox" :name="name" :checked="checked" />
    <label :for="id" class="custom-control-label" :class="$attrs.class">
      <slot />
    </label>
  </div>
</template>
<style scoped>
.form-check-input:checked::after {
  content: '✓' !important; /* 깨지는 박스 대신 텍스트 체크 표시 사용 */
  font-family: inherit; /* 아이콘 폰트 영향 제거 */
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
}
</style>
