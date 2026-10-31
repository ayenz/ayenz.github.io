<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { months, prints } from '../months.js'

const emit = defineEmits(['open'])
const root = ref(null)
const track = ref(null)
const active = ref(-1)
const aspect = ref({}) // natural width / height per print, so landscape shots stay landscape
let mm

// One card per photo (months with several get several cards); empty months keep a placeholder.
const cards = months.flatMap((mo, mi) => {
  const own = prints.map((p, idx) => ({ ...p, idx })).filter((p) => p.mi === mi)
  return own.length ? own : [{ ...mo, key: mo.n, idx: -1, of: 0 }]
})

onMounted(() => {
  Promise.all(prints.map((p, i) => new Promise((done) => {
    const img = new Image()
    img.onload = () => { aspect.value[i] = img.naturalWidth / img.naturalHeight; done() }
    img.onerror = done
    img.src = p.src
  }))).then(() => requestAnimationFrame(() => ScrollTrigger.refresh()))

  mm = gsap.matchMedia()
  const cardEls = gsap.utils.toArray('.month', root.value)

  mm.add('(min-width: 900px)', () => {
    const distance = () => track.value.scrollWidth - window.innerWidth
    const scroller = gsap.to(track.value, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: root.value,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    })
    cardEls.forEach((card, i) => {
      gsap.fromTo(card.querySelector('.art-num'), { xPercent: 60 }, {
        xPercent: -30,
        ease: 'none',
        scrollTrigger: { trigger: card, containerAnimation: scroller, start: 'left right', end: 'right left', scrub: true },
      })
      const img = card.querySelector('.art img')
      if (img) {
        gsap.fromTo(img, { xPercent: -8 }, {
          xPercent: 8,
          ease: 'none',
          scrollTrigger: { trigger: card, containerAnimation: scroller, start: 'left right', end: 'right left', scrub: true },
        })
      }
      gsap.from(card.querySelectorAll('.reveal'), {
        y: 60,
        opacity: 0,
        stagger: 0.08,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: { trigger: card, containerAnimation: scroller, start: 'left 80%' },
      })
      ScrollTrigger.create({
        trigger: card,
        containerAnimation: scroller,
        start: 'left 60%',
        end: 'right 40%',
        onToggle: (self) => self.isActive && (active.value = i),
      })
    })
  })

  mm.add('(max-width: 899px)', () => {
    cardEls.forEach((card, i) => {
      gsap.from(card, {
        y: 80,
        opacity: 0,
        rotate: 3,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: card, start: 'top 90%' },
      })
      ScrollTrigger.create({
        trigger: card,
        start: 'top 60%',
        end: 'bottom 40%',
        onToggle: (self) => self.isActive && (active.value = i),
      })
    })
  })
})

onBeforeUnmount(() => mm?.revert())
</script>

<template>
  <section id="timeline" ref="root" class="timeline" data-mood="timeline">
    <div ref="track" class="track">
      <div class="intro">
        <p class="eyebrow mono">the camera roll</p>
        <h2>Ten months.<br /><span class="serif">{{ prints.length }}</span> photos.</h2>
        <p class="lede">Snapshots from January to October. The photos are real. The captions are… mostly real. Click any card to see it big.</p>
        <span class="hint mono">scroll → → →</span>
      </div>

      <article
        v-for="(item, i) in cards"
        :key="item.key"
        class="month"
        :class="{ active: active === i, 'has-photo': item.idx >= 0, landscape: (aspect[item.idx] || 0.8) > 1.05 }"
        :style="{ '--h': item.hue, '--ar': aspect[item.idx] || 0.8 }"
        v-tilt="8"
        :data-cursor="item.idx >= 0 ? 'view' : 'soon'"
        @click="item.idx >= 0 && emit('open', item.idx)"
      >
        <div class="art">
          <img v-if="item.idx >= 0" :src="item.src" :alt="`${item.m} 2026 — ${item.caption}`" loading="lazy" decoding="async" />
          <template v-else>
            <div class="art-blob" />
            <span class="soon mono">photo loading…</span>
          </template>
          <div class="art-grid" />
          <span class="art-num">{{ item.n }}</span>
        </div>
        <div class="meta reveal mono">
          <span>{{ item.m }} 2026<template v-if="item.place"> · <span class="place">{{ item.place }}</span></template><template v-if="item.of > 1"> · {{ item.pi + 1 }}/{{ item.of }}</template></span>
          <span class="tag">#{{ item.tag }}</span>
        </div>
        <h3 class="reveal">{{ item.title }}</h3>
        <p v-if="item.of > 1 && item.caption !== item.title" class="reveal cap">“{{ item.caption }}”</p>
        <p class="reveal">{{ item.body }}</p>
        <div class="glare" />
      </article>

      <div class="outro-card">
        <span class="serif">to be</span>
        <strong>continued…</strong>
        <span class="mono small">nov &amp; dec still loading</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.timeline { position: relative; overflow: hidden; }
.track {
  display: flex;
  align-items: center;
  gap: clamp(20px, 3vw, 48px);
  height: 100vh;
  padding: 0 var(--gutter);
  width: max-content;
  will-change: transform;
}
.intro { width: min(520px, 80vw); flex-shrink: 0; }
.intro h2 { font-size: clamp(48px, 7vw, 108px); line-height: 0.9; letter-spacing: -0.05em; font-weight: 700; }
.intro .serif { color: var(--pink); }
.lede { margin-top: 28px; color: var(--muted); font-size: 18px; line-height: 1.5; max-width: 38ch; }
.hint { display: inline-block; margin-top: 40px; color: var(--acid); animation: nudge 1.4s var(--ease) infinite; }
@keyframes nudge { 50% { transform: translateX(12px); } }

.month {
  --c: hsl(var(--h) 95% 60%);
  position: relative;
  flex-shrink: 0;
  width: clamp(300px, 26vw, 400px);
  padding: 16px;
  border-radius: 28px;
  background: rgba(18, 18, 22, 0.6);
  backdrop-filter: blur(18px) saturate(1.4);
  -webkit-backdrop-filter: blur(18px) saturate(1.4);
  border: 1px solid var(--line);
  transform-style: preserve-3d;
  overflow: hidden;
  transition: border-color 0.5s var(--ease);
}
.month.active { border-color: var(--c); }
.month.landscape { width: clamp(380px, 34vw, 520px); }
.month:nth-of-type(even) { margin-top: 14vh; }
.month:nth-of-type(odd) { margin-bottom: 14vh; }
.art {
  position: relative;
  aspect-ratio: var(--ar, 0.8);
  max-height: 52vh;
  width: 100%;
  border-radius: 18px;
  overflow: hidden;
  background: hsl(var(--h) 40% 8%);
  margin-bottom: 18px;
}
.art img {
  position: absolute;
  inset: 0 -10%;
  width: 120%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(1) contrast(1.05) brightness(0.8);
  transform: scale(1.05);
  transition: filter 0.9s var(--ease), transform 1.2s var(--ease);
}
.month.active .art img, .month:hover .art img { filter: none; transform: scale(1); }
.art-blob {
  position: absolute;
  inset: -30%;
  background:
    radial-gradient(circle at 30% 30%, var(--c), transparent 45%),
    radial-gradient(circle at 70% 60%, hsl(calc(var(--h) + 120) 95% 60%), transparent 40%),
    conic-gradient(from 0deg, transparent, hsl(calc(var(--h) + 60) 90% 55% / 0.6), transparent 40%);
  filter: blur(18px);
  animation: swirl 9s linear infinite;
}
@keyframes swirl { to { transform: rotate(360deg); } }
.soon { position: absolute; left: 14px; top: 14px; color: rgba(255, 255, 255, 0.75); }
.art-grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
  background-size: 24px 24px;
  mix-blend-mode: overlay;
  pointer-events: none;
}
.art-num {
  position: absolute;
  right: 14px;
  bottom: -0.12em;
  font-size: 120px;
  font-weight: 700;
  letter-spacing: -0.06em;
  line-height: 1;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.8);
  pointer-events: none;
}
.meta { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 4px 12px; color: var(--muted); margin-bottom: 12px; }
.tag { color: var(--c); }
.place { color: var(--fg); }
.month h3 { font-size: 26px; letter-spacing: -0.03em; line-height: 1.05; margin-bottom: 10px; }
.month p { color: #b9b8b0; line-height: 1.5; font-size: 15px; }
.month .cap { font-family: var(--serif); font-style: italic; color: var(--c); font-size: 18px; margin-bottom: 6px; }
.glare {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(circle at var(--gx, 50%) var(--gy, 50%), rgba(255, 255, 255, 0.14), transparent 45%);
  opacity: 0;
  transition: opacity 0.4s;
}
.month:hover .glare { opacity: 1; }
.outro-card {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  padding-right: 10vw;
  font-size: clamp(56px, 8vw, 140px);
  line-height: 0.9;
  letter-spacing: -0.05em;
}
.outro-card strong { color: var(--acid); }
.outro-card .small { font-size: 12px; letter-spacing: 0.08em; color: var(--muted); margin-top: 24px; }

@media (max-width: 899px) {
  .track { flex-direction: column; height: auto; width: 100%; padding: 120px var(--gutter); align-items: stretch; }
  .intro, .month { width: 100%; }
  .month:nth-of-type(n) { margin: 0; }
  .art { max-height: none; }
  .outro-card { padding: 40px 0 0; }
  .hint { display: none; }
}
</style>
