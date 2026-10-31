<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import gsap from 'gsap'
import { scrollState } from '../../composables/smooth.js'

const words = ['twelve frames', 'one roll', 'no retakes', 'slightly overexposed', 'warm tones only', 'blurry but honest', 'shot on vibes']
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
    x = wrap(x - dir * dt * 0.0012 * (1 + Math.min(Math.abs(v) / 3, 10)))
    set(x)
  }
  gsap.ticker.add(tick)
})
onBeforeUnmount(() => gsap.ticker.remove(tick))
</script>

<template>
  <section class="strip" data-mood="strip">
    <div class="film">
      <div ref="track" class="track">
        <template v-for="n in 2" :key="n">
          <span v-for="(w, i) in words" :key="w + n" class="cell">
            <b class="mono">{{ String(i + 1).padStart(2, '0') }}A ▸</b>{{ w }}
          </span>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
.strip { position: relative; padding: 60px 0; overflow: hidden; }
.film {
  position: relative;
  background: #1d1915;
  color: #f3c79a;
  padding: 26px 0;
  rotate: -2deg;
  width: 110%;
  margin-left: -5%;
  box-shadow: 0 20px 60px rgba(29, 25, 21, 0.25);
}
.film::before, .film::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 10px;
  background: repeating-linear-gradient(90deg, #efe6d6 0 12px, transparent 12px 26px);
  opacity: 0.85;
}
.film::before { top: 7px; }
.film::after { bottom: 7px; }
.track { display: inline-flex; white-space: nowrap; will-change: transform; }
.cell {
  display: inline-flex;
  align-items: baseline;
  gap: 14px;
  padding: 0 34px;
  border-right: 1px dashed rgba(243, 199, 154, 0.25);
  font-family: var(--serif);
  font-style: italic;
  font-size: clamp(30px, 4.6vw, 64px);
}
.cell b { font-style: normal; font-size: 12px; color: var(--acid); }
</style>
