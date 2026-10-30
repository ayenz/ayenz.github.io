<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import gsap from 'gsap'
import { scrollState } from '../../composables/smooth.js'
import { EVENTS, fmtDate } from '../events.js'

const items = EVENTS.filter((e) => !e.serious)
const track = ref(null)
let tick

onMounted(() => {
  const wrap = gsap.utils.wrap(-50, 0)
  const set = gsap.quickSetter(track.value, 'xPercent')
  let x = 0
  let dir = 1
  tick = (_, dt) => {
    const v = scrollState.velocity
    if (Math.abs(v) > 0.5) dir = Math.sign(v)
    x = wrap(x - dir * dt * 0.0011 * (1 + Math.min(Math.abs(v) / 3, 10)))
    set(x)
  }
  gsap.ticker.add(tick)
})
onBeforeUnmount(() => gsap.ticker.remove(tick))
</script>

<template>
  <div class="ticker">
    <span class="tag mono">2026 wire</span>
    <div class="viewport">
      <div ref="track" class="track">
        <template v-for="n in 2" :key="n">
          <span v-for="e in items" :key="e.id + n" class="item">
            <b class="mono">{{ fmtDate(e) }}</b>{{ e.title }}<i>●</i>
          </span>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ticker {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: stretch;
  border-block: 1px solid var(--line);
  background: rgba(8, 8, 10, 0.75);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.tag {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  padding: 0 18px;
  background: var(--red);
  color: var(--fg);
}
.viewport { overflow: hidden; flex: 1; }
.track { display: inline-flex; white-space: nowrap; will-change: transform; }
.item { display: inline-flex; align-items: center; gap: 14px; padding: 16px 0 16px 28px; font-size: 18px; letter-spacing: -0.01em; }
.item b { color: var(--muted); font-weight: 400; }
.item i { font-style: normal; color: var(--red); font-size: 8px; }
</style>
