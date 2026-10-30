<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import gsap from 'gsap'
import images from '../images.json'
import { UPCOMING } from '../events.js'

const root = ref(null)
const now = ref(Date.now())
let timer

const parts = (iso) => {
  const diff = Math.max(0, new Date(iso) - now.value)
  const pad = (n) => String(Math.floor(n)).padStart(2, '0')
  return [
    [pad(diff / 864e5), 'days'],
    [pad((diff / 36e5) % 24), 'hrs'],
    [pad((diff / 6e4) % 60), 'min'],
    [pad((diff / 1e3) % 60), 'sec'],
  ]
}

onMounted(() => {
  timer = setInterval(() => (now.value = Date.now()), 1000)
  gsap.from(root.value.querySelectorAll('.up'), {
    y: 100,
    opacity: 0,
    duration: 1.4,
    stagger: 0.15,
    ease: 'expo.out',
    scrollTrigger: { trigger: root.value, start: 'top 70%' },
  })
})
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <section id="next" ref="root" class="section next" data-globe="outro">
    <p class="eyebrow mono">still to come</p>
    <h2 class="h2">The year isn’t <span class="serif">done</span> yet.</h2>
    <div class="ups">
      <article v-for="u in UPCOMING" :key="u.id" class="up" v-tilt="8">
        <img v-if="u.img" class="up-bg" :src="images[u.img].src" alt="" loading="lazy" />
        <div class="up-inner">
          <span class="mono date">{{ new Date(u.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) }}</span>
          <h3>{{ u.title }}</h3>
          <p>{{ u.body }}</p>
          <div class="clock">
            <div v-for="[v, l] in parts(u.date)" :key="l"><b>{{ v }}</b><i class="mono">{{ l }}</i></div>
          </div>
        </div>
        <a v-if="u.img" class="credit mono" :href="images[u.img].page" target="_blank" rel="noopener">
          {{ images[u.img].author }} · {{ images[u.img].license }}
        </a>
      </article>
    </div>
  </section>
</template>

<style scoped>
.h2 { font-size: clamp(44px, 7vw, 112px); letter-spacing: -0.05em; line-height: 0.95; margin-bottom: 48px; }
.h2 .serif { color: var(--red); }
.ups { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.up {
  position: relative;
  border-radius: 24px;
  border: 1px solid var(--line);
  background: rgba(14, 14, 17, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  overflow: hidden;
  min-height: 380px;
  display: flex;
}
.up-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.35; filter: grayscale(1); transition: opacity 0.6s, filter 0.6s; }
.up:hover .up-bg { opacity: 0.55; filter: none; }
.up-inner { position: relative; padding: 32px; display: flex; flex-direction: column; width: 100%; }
.date { color: var(--red); }
h3 { font-size: clamp(36px, 4vw, 64px); letter-spacing: -0.04em; line-height: 1; margin: 12px 0; }
p { color: #cfc9bd; max-width: 34ch; line-height: 1.5; }
.clock { display: flex; gap: 22px; margin-top: auto; padding-top: 32px; }
.clock div { display: flex; flex-direction: column; }
.clock b { font-size: clamp(32px, 3.6vw, 56px); font-weight: 600; letter-spacing: -0.04em; font-variant-numeric: tabular-nums; }
.clock i { font-style: normal; color: var(--muted); }
.credit { position: absolute; right: 12px; top: 12px; font-size: 10px; text-transform: none; color: #bdb7ab; background: rgba(8, 8, 10, 0.6); padding: 4px 8px; border-radius: 4px; }

@media (max-width: 760px) {
  .ups { grid-template-columns: 1fr; }
  .clock { gap: 14px; }
}
</style>
