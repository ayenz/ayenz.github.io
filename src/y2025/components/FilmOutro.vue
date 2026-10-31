<script setup>
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import { getLenis } from '../../composables/smooth.js'
import { film } from '../store.js'
import YearSwitch from '../../components/YearSwitch.vue'

const root = ref(null)

onMounted(() => {
  gsap.from(root.value.querySelectorAll('.wrap-line > span'), {
    yPercent: 110,
    duration: 1.3,
    stagger: 0.1,
    ease: 'expo.out',
    scrollTrigger: { trigger: root.value, start: 'top 70%' },
  })
})

function rewind() {
  film.flash++
  getLenis()?.scrollTo(0, { duration: 3.2 })
}
</script>

<template>
  <section id="outro" ref="root" class="outro" data-mood="outro">
    <h2 class="big">
      <span class="wrap-line"><span>That’s a wrap,</span></span>
      <span class="wrap-line"><span class="serif">2025.</span></span>
    </h2>
    <div class="row">
      <button class="pill" v-magnetic data-cursor="rewind" @click="rewind">⟲ rewind the roll</button>
      <div class="next mono">next roll <YearSwitch :current="2025" /></div>
    </div>
    <footer class="foot mono">
      <span>FILM//2025</span>
      <span>photos: mine · captions: lightly fictional</span>
      <span>vue · three · gsap · lenis</span>
    </footer>
  </section>
</template>

<style scoped>
.outro { min-height: 90svh; display: flex; flex-direction: column; justify-content: flex-end; padding: 120px var(--gutter) 24px; }
.big { font-size: clamp(60px, 11vw, 200px); line-height: 0.9; letter-spacing: -0.055em; font-weight: 800; }
.wrap-line { display: block; overflow: hidden; padding-bottom: 0.05em; }
.wrap-line > span { display: inline-block; }
.big .serif { font-weight: 400; color: var(--acid); }
.row { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; margin-top: 40px; }
.next { display: flex; align-items: center; gap: 12px; color: var(--muted); font-size: 12px; }
.foot { display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-top: 64px; padding-top: 18px; border-top: 1px dashed var(--line); color: var(--muted); font-size: 12px; }
</style>
