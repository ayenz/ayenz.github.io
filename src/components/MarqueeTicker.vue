<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import gsap from 'gsap'
import { scrollState } from '../composables/smooth.js'

const rows = [
  [
    'BREAKING: cat elected mayor of the group chat',
    'scientists confirm vibes are, in fact, real',
    'local man finally closes 400 browser tabs',
    'wifi password changed, nation in shock',
  ],
  [
    'it’s giving 2026',
    'touch grass speedrun any%',
    'reply-all incident #4,812',
    'the algorithm said hi',
    'low battery, high spirits',
  ],
]

const root = ref(null)
const tracks = ref([])
let tick

onMounted(() => {
  const wrap = gsap.utils.wrap(-50, 0)
  const pos = tracks.value.map((_, i) => (i % 2 ? -25 : 0))
  const setters = tracks.value.map((el) => gsap.quickSetter(el, 'xPercent'))
  let dir = 1
  let skew = 0
  // scroll velocity speeds up / reverses the marquee and skews it
  tick = (_, dt) => {
    const v = scrollState.velocity
    if (Math.abs(v) > 0.5) dir = Math.sign(v)
    const boost = 1 + Math.min(Math.abs(v) / 3, 12)
    skew += (-v * 0.3 - skew) * 0.1
    tracks.value.forEach((el, i) => {
      const d = i % 2 ? -dir : dir
      pos[i] = wrap(pos[i] - d * boost * dt * (0.0012 - i * 0.0002))
      setters[i](pos[i])
      el.style.setProperty('--skew', `${skew}deg`)
    })
  }
  gsap.ticker.add(tick)

  gsap.from(root.value.querySelectorAll('.row'), {
    rotate: (i) => (i ? 4 : -4),
    scrollTrigger: { trigger: root.value, start: 'top bottom', end: 'bottom top', scrub: true },
  })
})

onBeforeUnmount(() => gsap.ticker.remove(tick))
</script>

<template>
  <section ref="root" class="marquee" data-mood="ticker">
    <div v-for="(row, r) in rows" :key="r" class="row" :class="`row-${r}`">
      <div :ref="(el) => (tracks[r] = el)" class="track">
        <template v-for="n in 2" :key="n">
          <span v-for="item in row" :key="item + n" class="item">
            {{ item }} <i class="star">✦</i>
          </span>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
.marquee { position: relative; padding: 80px 0; overflow: hidden; }
.row { white-space: nowrap; overflow: hidden; padding: 18px 0; }
.row-0 { background: var(--acid); color: var(--bg); rotate: -3deg; width: 110%; margin-left: -5%; }
.row-1 {
  background: var(--bg);
  color: var(--fg);
  border-block: 1px solid var(--line);
  rotate: 2deg;
  width: 110%;
  margin-left: -5%;
  margin-top: -10px;
}
.track { display: inline-flex; will-change: transform; }
.item { transform: skewX(var(--skew, 0deg)); }
.item {
  font-size: clamp(28px, 5vw, 72px);
  font-weight: 700;
  letter-spacing: -0.04em;
  text-transform: uppercase;
  padding-right: 0.5em;
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
}
.row-1 .item { font-family: var(--serif); font-style: italic; font-weight: 400; text-transform: none; letter-spacing: -0.01em; }
.star { font-style: normal; color: var(--pink); font-size: 0.6em; display: inline-block; animation: spin 3s linear infinite; }
.row-1 .star { color: var(--acid); }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
