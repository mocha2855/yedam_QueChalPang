<!-- application/modals/ApplicationModal.vue -->
<template>
  <div class="modal-backdrop">
    <div class="modal-card">
      <header class="modal-header">
        <slot name="header" />
      </header>

      <section class="modal-body">
        <slot name="body" />
      </section>

      <footer class="modal-footer">
        <slot name="footer" />
      </footer>
    </div>
  </div>
</template>

<script setup>
// 필요하면 여기서 defineEmits(['close']) 해서
// X 버튼 같은 것도 각자 slot에 만들어 쓰면 됨
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

/* 헤더/바디/푸터 기본 여백만 줌 */
.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-body {
  padding: 24px 20px;
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 12px;
  justify-content: center;
}
</style>
