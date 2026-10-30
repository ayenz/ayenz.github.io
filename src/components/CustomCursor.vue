<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import gsap from 'gsap'

const dot = ref(null)
const ring = ref(null)
const label = ref('')
const state = ref('')
const enabled = ref(false)
let cleanup = () => {}

onMounted(() => {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
  enabled.value = true

  const dx = gsap.quickTo(dot.value, 'x', { duration: 0.08 })
  const dy = gsap.quickTo(dot.value, 'y', { duration: 0.08 })
  const rx = gsap.quickTo(ring.value, 'x', { duration: 0.45, ease: 'power3.out' })
  const ry = gsap.quickTo(ring.value, 'y', { duration: 0.45, ease: 'power3.out' })

  let lastX = 0, lastY = 0
  const move = (e) => {
    dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY)
    // squash and stretch the ring along the direction of travel
    const vx = e.clientX - lastX, vy = e.clientY - lastY
    const speed = state.value === 'is-label' ? 0 : Math.min(Math.hypot(vx, vy) / 40, 0.6)
    gsap.to(ring.value, {
      rotate: speed ? Math.atan2(vy, vx) * (180 / Math.PI) : 0,
      scaleX: 1 + speed,
      scaleY: 1 - speed * 0.5,
      duration: 0.3,
      overwrite: 'auto',
    })
    lastX = e.clientX; lastY = e.clientY
  }

  const over = (e) => {
    const t = e.target.closest('[data-cursor], a, button')
    if (!t) { state.value = ''; label.value = ''; return }
    state.value = t.dataset.cursor ? 'is-label' : 'is-hover'
    label.value = t.dataset.cursor || ''
  }
  const down = () => gsap.to(dot.value, { scale: 3, duration: 0.2 })
  const up = () => gsap.to(dot.value, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
  const leave = () => gsap.to([dot.value, ring.value], { opacity: 0, duration: 0.3 })
  const enter = () => gsap.to([dot.value, ring.value], { opacity: 1, duration: 0.3 })

  window.addEventListener('pointermove', move)
  window.addEventListener('pointerover', over)
  window.addEventListener('pointerdown', down)
  window.addEventListener('pointerup', up)
  document.addEventListener('pointerleave', leave)
  document.addEventListener('pointerenter', enter)
  cleanup = () => {
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerover', over)
    window.removeEventListener('pointerdown', down)
    window.removeEventListener('pointerup', up)
    document.removeEventListener('pointerleave', leave)
    document.removeEventListener('pointerenter', enter)
  }
})

onBeforeUnmount(() => cleanup())
</script>

<template>
  <div v-show="enabled" class="cursor" :class="state">
    <div ref="ring" class="ring"><span class="label">{{ label }}</span></div>
    <div ref="dot" class="dot" />
  </div>
</template>

<style scoped>
.cursor { position: fixed; inset: 0; pointer-events: none; z-index: 1000; }
.dot, .ring {
  position: fixed;
  top: 0;
  left: 0;
  border-radius: 50%;
  pointer-events: none;
  will-change: transform;
}
.dot {
  width: 6px;
  height: 6px;
  margin: -3px 0 0 -3px;
  background: var(--acid);
  mix-blend-mode: difference;
}
.ring {
  width: 40px;
  height: 40px;
  margin: -20px 0 0 -20px;
  border: 1px solid rgba(236, 235, 228, 0.6);
  mix-blend-mode: difference;
  display: grid;
  place-items: center;
  transition: width 0.45s var(--ease), height 0.45s var(--ease), margin 0.45s var(--ease),
    background 0.45s var(--ease), border-color 0.45s var(--ease);
}
.is-hover .ring {
  width: 72px;
  height: 72px;
  margin: -36px 0 0 -36px;
  background: var(--fg);
  border-color: transparent;
}
.label {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--bg);
  opacity: 0;
  transition: opacity 0.3s;
  white-space: nowrap;
}
.is-label .ring {
  width: 104px;
  height: 104px;
  margin: -52px 0 0 -52px;
  background: var(--bg);
  border-color: var(--acid);
  mix-blend-mode: normal;
}
.is-label .label { opacity: 1; color: var(--acid); }
.is-label .dot { opacity: 0; }
</style>
