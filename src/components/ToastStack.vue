<script setup>
import { toasts } from '../composables/toast.js'
</script>

<template>
  <TransitionGroup tag="div" name="toast" class="toasts" aria-live="polite">
    <div v-for="t in toasts" :key="t.id" class="toast mono">
      <i />{{ t.text }}
    </div>
  </TransitionGroup>
</template>

<style scoped>
.toasts {
  position: fixed;
  left: 50%;
  bottom: 24px;
  translate: -50% 0;
  z-index: 400;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  pointer-events: none;
  width: calc(100% - 32px);
}
.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  border-radius: 999px;
  background: var(--fg);
  color: var(--bg);
  text-transform: none;
  max-width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}
.toast i { width: 8px; height: 8px; border-radius: 50%; background: var(--pink); flex-shrink: 0; }
.toast-enter-active, .toast-leave-active { transition: all 0.6s var(--ease); }
.toast-enter-from { opacity: 0; transform: translateY(30px) scale(0.9); }
.toast-leave-to { opacity: 0; transform: translateY(-10px) scale(0.95); }
.toast-leave-active { position: absolute; }
</style>
