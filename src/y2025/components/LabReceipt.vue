<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import gsap from 'gsap'
import { months, prints } from '../months.js'
import { totalKm, cities, isDemo } from '../route.js'
import { film } from '../store.js'

// Extra lines that can't be read off the photos — edit freely.
const EXTRAS = [
  ['Times I said “next year for sure”', '12'],
  ['Photos deleted for being blurry', '300+'],
  ['Regrets', '0'],
]

const monthsShot = months.filter((m) => m.photos.length).length
const tags = months.filter((m) => m.photo && m.tag).reduce((acc, m) => ((acc[m.tag] = (acc[m.tag] || 0) + 1), acc), {})
const topTag = Object.entries(tags).sort((a, b) => b[1] - a[1])[0]

const lines = [
  ['Rolls developed', '1'],
  ['Frames printed', String(prints.length)],
  ['Months on the roll', `${monthsShot}/12`],
  ['Cities visited', `${cities.length}${isDemo ? '*' : ''}`],
  ['Red yarn used', `${Math.round(totalKm).toLocaleString('en-US')} km${isDemo ? '*' : ''}`],
  ...(topTag ? [['Most shot', `#${topTag[0]}`]] : []),
  ...EXTRAS,
]
const bars = Array.from({ length: 46 }, (_, i) => ({ x: i * 6 + (i % 3), w: 1 + ((i * 7) % 4) }))

const root = ref(null)
const stub = ref(null)
const torn = ref(false)
let mm

onMounted(() => {
  mm = gsap.matchMedia()
  mm.add({ desktop: '(min-width: 900px)', mobile: '(max-width: 899px)' }, (ctx) => {
    const el = root.value
    const tl = gsap.timeline({
      scrollTrigger: ctx.conditions.desktop
        ? { trigger: el, start: 'top top', end: '+=130%', pin: true, scrub: 1 }
        : { trigger: el.querySelector('.paper-wrap'), start: 'top 75%' }, // phones: print once, in real time
    })
    tl.fromTo(el.querySelector('.paper'), { yPercent: -100 }, { yPercent: 0, ease: 'none', duration: 1 })
      .from(el.querySelectorAll('.row'), { opacity: 0, x: -10, stagger: 0.06, duration: 0.1 }, 0.2)
      .from(el.querySelector('.total'), { scale: 1.6, opacity: 0, duration: 0.15, ease: 'back.out(2)' }, '>')
      .from(el.querySelector('.stamp'), { scale: 2.4, opacity: 0, rotate: 25, duration: 0.12, ease: 'back.out(2)' }, '>')
  })
})
onBeforeUnmount(() => mm?.revert())

function tear() {
  if (torn.value) return
  torn.value = true
  film.flash++
  gsap.timeline()
    .to(stub.value, { rotate: -4, x: -4, duration: 0.12, ease: 'power2.out' })
    .to(stub.value, { y: '70vh', x: gsap.utils.random(-120, 120), rotate: gsap.utils.random(-70, 70), duration: 1.4, ease: 'power2.in' })
    .to(stub.value, { opacity: 0, duration: 0.5 }, '-=0.5')
}
</script>

<template>
  <section id="receipt" ref="root" class="receipt" data-mood="receipt">
    <div class="copy">
      <p class="eyebrow mono">the bill for 2025</p>
      <h2>Your year has been <span class="serif">developed.</span></h2>
      <p class="lede">Every roll comes with a receipt. This one itemises the whole year. <span v-if="isDemo" class="mono demo">* demo numbers until the photos are in</span></p>
    </div>

    <div class="paper-wrap">
      <div class="printer" aria-hidden="true"><span class="mono">FILM LAB ▸ PRINTING</span></div>
      <div class="clip">
        <div class="paper">
          <div class="main">
            <p class="center mono"><b>FILM//2025 PHOTO LAB</b><br />order no. 2025-12 · counter 03<br />31 DEC 2025 · 23:59</p>
            <hr />
            <div v-for="[k, v] in lines" :key="k" class="row mono">
              <span>{{ k }}</span><i /><span>{{ v }}</span>
            </div>
            <hr />
            <div class="total mono"><span>TOTAL</span><span>1 YEAR</span></div>
            <p class="center mono small">paid in full · no refunds · no retakes</p>
            <p class="center"><span class="stamp mono">DEVELOPED</span></p>
          </div>
          <button class="tear mono" :class="{ torn }" data-cursor="tear" @click="tear">✂ - - - tear here - - - ✂</button>
          <div ref="stub" class="stub">
            <svg class="barcode" viewBox="0 0 280 50" preserveAspectRatio="none" aria-hidden="true">
              <rect v-for="(b, i) in bars" :key="i" :x="b.x" y="0" :width="b.w" height="50" />
            </svg>
            <p class="center mono small">THANK YOU FOR SHOOTING FILM<br />keep this stub for your memories</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.receipt { min-height: 100vh; display: grid; grid-template-columns: 1fr minmax(320px, 400px); align-items: center; gap: 48px; padding: 96px var(--gutter) 40px; }
.copy h2 { font-weight: 800; font-size: clamp(44px, 6vw, 96px); line-height: 0.92; letter-spacing: -0.055em; }
.copy .serif { color: var(--acid); font-weight: 400; }
.lede { margin-top: 22px; color: var(--muted); font-size: 18px; line-height: 1.5; max-width: 36ch; }
.demo { display: block; margin-top: 10px; font-size: 12px; color: var(--pink); }
.paper-wrap { position: relative; padding-top: 4px; }
.printer {
  position: relative;
  z-index: 2;
  height: 34px;
  margin: 0 -18px;
  border-radius: 10px 10px 4px 4px;
  background: linear-gradient(#3a332c, #1d1915);
  display: flex;
  align-items: center;
  padding: 0 14px;
  color: #ffb36b;
  font-size: 11px;
  box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.5);
}
.printer::after { content: ''; position: absolute; left: 18px; right: 18px; bottom: 4px; height: 3px; background: #0d0b09; border-radius: 3px; }
.clip { clip-path: inset(0 -100vw -300vh -100vw); margin-top: -4px; padding: 0 6px 60px; }
.paper {
  position: relative;
  background: #fbfaf4;
  color: #2a2522;
  filter: drop-shadow(0 18px 24px rgba(60, 40, 20, 0.25));
}
.main { position: relative; padding: 22px 22px 10px; }
.center { text-align: center; }
.mono { font-size: 13px; }
.small { font-size: 11px; color: #7a6f60; }
hr { border: 0; border-top: 1.5px dashed rgba(42, 37, 34, 0.4); margin: 14px 0; }
.row { display: flex; align-items: baseline; gap: 6px; margin: 7px 0; }
.row i { flex: 1; border-bottom: 1.5px dotted rgba(42, 37, 34, 0.35); translate: 0 -4px; }
.total { display: flex; justify-content: space-between; font-size: 22px; font-weight: 700; margin: 6px 0 10px; }
.stamp {
  display: inline-block;
  margin: 12px 0 4px;
  padding: 6px 10px;
  border: 2.5px solid var(--pink);
  color: var(--pink);
  border-radius: 6px;
  font-weight: 700;
  font-size: 16px;
  rotate: -12deg;
  mix-blend-mode: multiply;
  opacity: 0.85;
}
.tear { display: block; width: 100%; padding: 8px 0; text-align: center; font-size: 11px; color: #7a6f60; letter-spacing: 0.1em; transition: color 0.3s; }
.tear:hover { color: var(--pink); }
.tear.torn { visibility: hidden; }
.stub {
  padding: 8px 22px 26px;
  background: #fbfaf4;
  -webkit-mask: linear-gradient(#000 0 0) top / 100% calc(100% - 10px) no-repeat, conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) bottom / 14px 10px repeat-x;
  mask: linear-gradient(#000 0 0) top / 100% calc(100% - 10px) no-repeat, conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) bottom / 14px 10px repeat-x;
  transform-origin: 20% 0;
}
.barcode { display: block; width: 100%; height: 50px; margin-bottom: 8px; fill: #2a2522; }

@media (max-width: 899px) {
  .receipt { grid-template-columns: 1fr; gap: 32px; }
  .paper-wrap { width: min(100%, 380px); justify-self: center; }
}
</style>
