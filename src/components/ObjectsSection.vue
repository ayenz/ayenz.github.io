<script setup>
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import { toast } from '../composables/toast.js'

const objects = [
  { name: 'The Unbothered Lamp', desc: 'Glows softly. Ignores your notifications on purpose. A role model.', price: '42 vibes', shape: 'lamp', color: '#c6ff3d' },
  { name: 'Pocket Cloud', desc: 'A tiny rain cloud for your desk plants. Occasionally sulks.', price: '9 sighs', shape: 'cloud', color: '#4f7bff' },
  { name: 'Mood Ring 2.0', desc: 'Now with Bluetooth. Tells your group chat you’re “fine” for you.', price: '3 hugs', shape: 'ring', color: '#ff4fd8' },
  { name: 'The Undo Button', desc: 'Works on emails, haircuts and one (1) bad decision per week.', price: 'sold out', shape: 'button', color: '#ff7a2f' },
  { name: 'Emotional Support Router', desc: 'Full bars, full heart. Whispers “you got this” every reboot.', price: '5G of love', shape: 'router', color: '#c6ff3d' },
  { name: 'Grass, To Go', desc: 'A portable patch of grass. Touch it on your commute. Science-ish approved.', price: 'free-ish', shape: 'grass', color: '#7dff9a' },
]

const root = ref(null)

onMounted(() => {
  gsap.from(root.value.querySelectorAll('.obj'), {
    y: 120,
    opacity: 0,
    rotateX: -30,
    duration: 1.4,
    stagger: { each: 0.1, from: 'start' },
    ease: 'expo.out',
    scrollTrigger: { trigger: root.value.querySelector('.grid'), start: 'top 80%' },
  })
  gsap.from(root.value.querySelectorAll('.head .mask > *'), {
    yPercent: 110,
    duration: 1.2,
    stagger: 0.1,
    ease: 'expo.out',
    scrollTrigger: { trigger: root.value, start: 'top 70%' },
  })
})

function buy(o, e) {
  gsap.fromTo(e.currentTarget, { scale: 0.9 }, { scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.3)' })
  toast(o.price === 'sold out' ? `${o.name} is sold out. Forever. Sorry.` : `Added “${o.name}” to cart. Just kidding, it’s not real ✦`)
}
</script>

<template>
  <section id="objects" ref="root" class="section objects" data-mood="objects">
    <div class="head">
      <p class="eyebrow mono">chapter 03 — objects of the year</p>
      <div class="mask"><h2>Stuff we <span class="serif">definitely</span></h2></div>
      <div class="mask"><h2>didn’t need.</h2></div>
    </div>

    <div class="grid">
      <article
        v-for="(o, i) in objects"
        :key="o.name"
        class="obj"
        :style="{ '--c': o.color }"
        v-tilt="16"
        data-cursor="want"
      >
        <div class="stage">
          <div class="shape" :class="o.shape"><i /><i /><i /></div>
          <span class="idx mono">N°{{ String(i + 1).padStart(3, '0') }}</span>
        </div>
        <div class="info">
          <h3>{{ o.name }}</h3>
          <p>{{ o.desc }}</p>
          <div class="row">
            <span class="price mono">{{ o.price }}</span>
            <button class="pill" v-magnetic @click="buy(o, $event)">add to cart</button>
          </div>
        </div>
        <div class="glare" />
      </article>
    </div>
  </section>
</template>

<style scoped>
.head { margin-bottom: 64px; }
.mask { overflow: hidden; }
.head h2 { font-size: clamp(44px, 8vw, 128px); line-height: 0.95; letter-spacing: -0.05em; font-weight: 700; }
.head .serif { color: var(--orange); }
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr));
  gap: 20px;
  perspective: 1200px;
}
.obj {
  position: relative;
  border-radius: 28px;
  background: rgba(18, 18, 22, 0.55);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--line);
  overflow: hidden;
  transform-style: preserve-3d;
  transition: border-color 0.4s;
}
.obj:hover { border-color: var(--c); }
.stage {
  position: relative;
  height: 260px;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at 50% 60%, color-mix(in srgb, var(--c) 25%, transparent), transparent 65%);
  transform: translateZ(40px);
}
.idx { position: absolute; top: 18px; left: 18px; color: var(--muted); }
.info { padding: 0 24px 24px; transform: translateZ(20px); }
.info h3 { font-size: 26px; letter-spacing: -0.03em; margin-bottom: 8px; }
.info p { color: #b9b8b0; line-height: 1.5; font-size: 15px; min-height: 3em; }
.row { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; gap: 12px; }
.price { color: var(--c); }
.glare {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(circle at var(--gx, 50%) var(--gy, 50%), rgba(255, 255, 255, 0.12), transparent 40%);
  opacity: 0;
  transition: opacity 0.4s;
}
.obj:hover .glare { opacity: 1; }

/* ---- CSS-only "product shots" ---- */
.shape { position: relative; width: 140px; height: 140px; transition: transform 0.8s var(--ease); }
.obj:hover .shape { transform: scale(1.12) rotate(-6deg); }
.shape i { position: absolute; display: block; }

.lamp i:nth-child(1) { left: 30px; top: 10px; width: 80px; height: 60px; background: var(--c); border-radius: 40px 40px 8px 8px; box-shadow: 0 30px 60px var(--c); animation: glow 2.4s ease-in-out infinite; }
.lamp i:nth-child(2) { left: 66px; top: 70px; width: 8px; height: 50px; background: var(--fg); }
.lamp i:nth-child(3) { left: 40px; top: 118px; width: 60px; height: 10px; border-radius: 6px; background: var(--fg); }
@keyframes glow { 50% { box-shadow: 0 30px 100px var(--c); filter: brightness(1.2); } }

.cloud i:nth-child(1) { left: 10px; top: 40px; width: 120px; height: 50px; border-radius: 30px; background: var(--fg); }
.cloud i:nth-child(2) { left: 30px; top: 15px; width: 60px; height: 60px; border-radius: 50%; background: var(--fg); }
.cloud i:nth-child(3) { left: 30px; top: 96px; width: 80px; height: 40px; background: repeating-linear-gradient(100deg, var(--c) 0 3px, transparent 3px 14px); animation: rain 0.6s linear infinite; }
@keyframes rain { to { background-position: 14px 20px; } }
.cloud { animation: float 3s ease-in-out infinite; }
@keyframes float { 50% { translate: 0 -10px; } }

.ring i:nth-child(1) { inset: 20px; border-radius: 50%; border: 14px solid transparent; background: conic-gradient(from 0deg, var(--c), #4f7bff, #c6ff3d, var(--c)) border-box; -webkit-mask: linear-gradient(#000 0 0) padding-box exclude, linear-gradient(#000 0 0); mask: linear-gradient(#000 0 0) padding-box exclude, linear-gradient(#000 0 0); animation: spin 3s linear infinite; }
.ring i:nth-child(2) { left: 56px; top: 8px; width: 28px; height: 28px; background: var(--fg); rotate: 45deg; border-radius: 4px; box-shadow: 0 0 30px var(--c); }
@keyframes spin { to { transform: rotate(360deg); } }

.button i:nth-child(1) { left: 10px; top: 60px; width: 120px; height: 50px; border-radius: 50%; background: #3a1a08; }
.button i:nth-child(2) { left: 20px; top: 30px; width: 100px; height: 60px; border-radius: 50%; background: var(--c); box-shadow: inset 0 -12px 0 rgba(0,0,0,0.25); animation: press 1.8s var(--ease) infinite; }
.button i:nth-child(3) { left: 46px; top: 46px; width: 48px; height: 20px; border-radius: 4px; border: 3px solid var(--bg); border-left-color: transparent; animation: press 1.8s var(--ease) infinite; }
@keyframes press { 0%, 60%, 100% { translate: 0 0; } 70% { translate: 0 14px; } }

.router i:nth-child(1) { left: 10px; top: 80px; width: 120px; height: 36px; border-radius: 10px; background: var(--fg); }
.router i:nth-child(2) { left: 30px; top: 20px; width: 6px; height: 64px; background: var(--fg); rotate: -12deg; }
.router i:nth-child(3) { left: 104px; top: 20px; width: 6px; height: 64px; background: var(--fg); rotate: 12deg; box-shadow: -60px 76px 0 -1px var(--c), -40px 76px 0 -1px var(--c), -20px 76px 0 -1px var(--pink); }
.router::after { content: '♥'; position: absolute; left: 55px; top: 0; color: var(--pink); font-size: 28px; animation: float 1.4s ease-in-out infinite; }

.grass i:nth-child(1) { left: 0; top: 90px; width: 140px; height: 36px; border-radius: 50%; background: #2a1a10; }
.grass i:nth-child(2), .grass i:nth-child(3) {
  left: 10px; top: 30px; width: 120px; height: 70px;
  background: repeating-linear-gradient(90deg, var(--c) 0 4px, transparent 4px 9px);
  -webkit-mask: linear-gradient(to top, #000 40%, transparent);
  mask: linear-gradient(to top, #000 40%, transparent);
  transform-origin: bottom;
  animation: sway 2.2s ease-in-out infinite;
}
.grass i:nth-child(3) { left: 14px; top: 40px; filter: brightness(0.7); animation-delay: -1s; }
@keyframes sway { 50% { transform: skewX(12deg); } }
</style>
