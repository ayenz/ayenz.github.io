<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import gsap from 'gsap'
import { film } from '../store.js'

const box = ref(null)
const label = ref('')
const state = ref('')
const enabled = ref(false)
let cleanup = () => {}

onMounted(() => {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
  enabled.value = true
  const x = gsap.quickTo(box.value, 'x', { duration: 0.35, ease: 'power3.out' })
  const y = gsap.quickTo(box.value, 'y', { duration: 0.35, ease: 'power3.out' })
  const move = (e) => { x(e.clientX); y(e.clientY) }
  const over = (e) => {
    const t = e.target.closest('[data-cursor], a, button')
    state.value = t ? (t.dataset.cursor ? 'is-label' : 'is-hover') : ''
    label.value = t?.dataset.cursor || ''
  }
  // "take a photo" on click: brackets snap shut, the film background flashes
  const down = () => {
    gsap.fromTo(box.value, { '--gap': '0px' }, { '--gap': '10px', duration: 0.5, ease: 'expo.out' })
    film.flash++
  }
  window.addEventListener('pointermove', move)
  window.addEventListener('pointerover', over)
  window.addEventListener('pointerdown', down)
  cleanup = () => {
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerover', over)
    window.removeEventListener('pointerdown', down)
  }
})
onBeforeUnmount(() => cleanup())
</script>

<template>
  <div v-show="enabled" ref="box" class="vf" :class="state" aria-hidden="true">
    <i class="c tl" /><i class="c tr" /><i class="c bl" /><i class="c br" />
    <i class="cross" />
    <span class="lbl">{{ label }}</span>
  </div>
</template>

<style scoped>
.vf {
  --s: 34px;
  --gap: 10px;
  position: fixed;
  top: 0;
  left: 0;
  width: var(--s);
  height: var(--s);
  margin: calc(var(--s) / -2) 0 0 calc(var(--s) / -2);
  z-index: 1000;
  pointer-events: none;
  transition: width 0.4s var(--ease), height 0.4s var(--ease), margin 0.4s var(--ease);
}
.c { position: absolute; width: var(--gap); height: var(--gap); border: 1.5px solid var(--fg); }
.tl { top: 0; left: 0; border-right: 0; border-bottom: 0; }
.tr { top: 0; right: 0; border-left: 0; border-bottom: 0; }
.bl { bottom: 0; left: 0; border-right: 0; border-top: 0; }
.br { bottom: 0; right: 0; border-left: 0; border-top: 0; }
.cross { position: absolute; left: 50%; top: 50%; width: 6px; height: 6px; margin: -3px; border-radius: 50%; background: var(--acid); }
.is-hover { --s: 56px; }
.is-label { --s: 96px; }
.is-label .cross { opacity: 0; }
.lbl {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-family: var(--mono);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--acid);
  opacity: 0;
  transition: opacity 0.3s;
}
.is-label .lbl { opacity: 1; }
</style>
