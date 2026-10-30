<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import gsap from 'gsap'
import images from '../images.json'

const root = ref(null)
const miles = ref(null)
const km = ref(null)
const path = ref(null)
const earth = images.earth
const launch = images.artemis
let mm

onMounted(() => {
  const len = path.value.getTotalLength()
  gsap.set(path.value, { strokeDasharray: len, strokeDashoffset: len })
  const o = { v: 0 }
  const write = () => {
    miles.value.textContent = Math.round(o.v).toLocaleString('en-US')
    // scale to the published km figure so both counters land exactly on it
    km.value.textContent = Math.round((o.v / 252756) * 406771).toLocaleString('en-US')
  }

  mm = gsap.matchMedia()
  mm.add({ desktop: '(min-width: 900px)', mobile: '(max-width: 899px)' }, (ctx) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root.value,
        start: 'top top',
        end: ctx.conditions.desktop ? '+=220%' : '+=160%',
        pin: true,
        scrub: 1,
      },
    })
    tl.fromTo('.ar-bg img', { scale: 1.35 }, { scale: 1, ease: 'none', duration: 1 }, 0)
      .to(path.value, { strokeDashoffset: 0, ease: 'none', duration: 0.8 }, 0)
      .to(o, { v: 252756, ease: 'power1.in', duration: 0.8, onUpdate: write }, 0)
      .from('.ar-launch', { yPercent: 40, opacity: 0, rotate: 6, duration: 0.3 }, 0.15)
      .from('.ar-copy > *', { y: 40, opacity: 0, stagger: 0.05, duration: 0.25 }, 0.05)
      .to('.ar-record', { opacity: 1, scale: 1, duration: 0.15 }, 0.8)
  })
})
onBeforeUnmount(() => mm?.revert())
</script>

<template>
  <section id="artemis" ref="root" class="artemis" data-globe="feature">
    <div class="ar-bg">
      <img :src="earth.src" alt="Earth seen from the Orion spacecraft during Artemis II" decoding="async" />
      <div class="ar-shade" />
    </div>

    <svg class="ar-path" viewBox="0 0 1000 400" preserveAspectRatio="none" aria-hidden="true">
      <path ref="path" d="M60 300 C 180 300, 220 120, 380 140 S 640 330, 820 220 C 930 150, 960 60, 880 50 C 800 40, 760 140, 840 180" />
    </svg>

    <div class="ar-inner">
      <div class="ar-copy">
        <p class="eyebrow mono">feature · april 1–10</p>
        <h2>Artemis II went <span class="serif">farther</span> than anyone, ever.</h2>
        <p class="ar-text">
          The first crewed flight to the Moon since 1972 launched on April 1. Its crew set a new record for the
          farthest humans have traveled from Earth, then splashed back home on April 10.
        </p>
      </div>

      <div class="ar-counter">
        <span class="mono">distance from earth</span>
        <div class="big"><span ref="miles">0</span><small>mi</small></div>
        <div class="mono km"><span ref="km">0</span> km</div>
        <div class="ar-record mono">◆ new human record</div>
      </div>

      <figure class="ar-launch" v-tilt="10" data-cursor="liftoff">
        <img :src="launch.src" alt="Artemis II launch" loading="lazy" />
        <figcaption class="mono">
          <a :href="launch.page" target="_blank" rel="noopener">{{ launch.author }} · {{ launch.license }}</a>
        </figcaption>
      </figure>
    </div>

    <a class="ar-credit mono" :href="earth.page" target="_blank" rel="noopener">photo: {{ earth.author }} · {{ earth.license }}</a>
  </section>
</template>

<style scoped>
.artemis { position: relative; height: 100vh; overflow: hidden; z-index: 2; }
.ar-bg { position: absolute; inset: 0; }
.ar-bg img { width: 100%; height: 100%; object-fit: cover; }
.ar-shade { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(8, 8, 10, 0.92) 10%, rgba(8, 8, 10, 0.4) 60%, rgba(8, 8, 10, 0.75)); }
.ar-path { position: absolute; inset: 15% 0 auto; width: 100%; height: 55%; }
.ar-path path { fill: none; stroke: var(--red); stroke-width: 2; vector-effect: non-scaling-stroke; filter: drop-shadow(0 0 6px var(--red)); }
.ar-inner {
  position: relative;
  height: 100%;
  display: grid;
  grid-template-columns: 1.1fr 1fr 0.8fr;
  align-items: end;
  gap: 40px;
  padding: 120px var(--gutter) 72px;
}
.ar-copy h2 { font-size: clamp(40px, 4.8vw, 80px); line-height: 0.95; letter-spacing: -0.045em; }
.ar-copy .serif { color: var(--red); }
.ar-text { margin-top: 20px; color: #cfc9bd; line-height: 1.5; max-width: 40ch; }
.ar-counter .mono { color: var(--muted); }
.big {
  font-size: clamp(56px, 7.5vw, 128px);
  font-weight: 700;
  letter-spacing: -0.06em;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  margin: 8px 0;
  white-space: nowrap;
}
.big small { font-size: 0.3em; color: var(--red); margin-left: 8px; letter-spacing: 0; }
.ar-record {
  display: inline-block;
  margin-top: 16px;
  padding: 6px 10px;
  background: var(--red);
  color: var(--fg) !important;
  border-radius: 4px;
  opacity: 0;
  transform: scale(0.8);
}
.ar-launch { border-radius: 18px; overflow: hidden; border: 1px solid var(--line); position: relative; align-self: center; }
.ar-launch img { display: block; width: 100%; aspect-ratio: 3 / 4; object-fit: cover; }
.ar-launch figcaption { position: absolute; left: 8px; bottom: 8px; font-size: 10px; text-transform: none; background: rgba(8, 8, 10, 0.7); padding: 4px 8px; border-radius: 4px; }
.ar-credit { position: absolute; right: var(--gutter); bottom: 20px; font-size: 10px; text-transform: none; color: var(--muted); }

@media (max-width: 899px) {
  .ar-inner { grid-template-columns: 1fr; align-content: end; gap: 24px; padding-bottom: 56px; }
  .ar-launch { display: none; }
  .ar-shade { background: linear-gradient(0deg, rgba(8, 8, 10, 0.95) 35%, rgba(8, 8, 10, 0.3)); }
  .ar-path { inset: 10% 0 auto; height: 35%; }
}
</style>
