<script setup>
import { nextTick, onMounted, onBeforeUnmount, ref } from 'vue'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getLenis } from '../../composables/smooth.js'
import { scene } from '../../composables/mood.js'
import { YEARS, goToYear } from '../../composables/yearNav.js'
import { total, places } from '../wrapped.js'

// Edit these freely — they're the "installed" resolutions.
const RESOLUTIONS = [
  [true, 'call home more'],
  [true, 'say yes to the trip'],
  [true, 'take one photo every month'],
  [false, 'finally learn to cook the May noodles'],
  [false, 'sleep before 1am (lol)'],
]

const lines = ref([])
const input = ref('')
const typing = ref(true)
const screen = ref(null)
const field = ref(null)
const left = ref('')
let started = false, timer, alive = true

const pad = (n) => String(Math.floor(n)).padStart(2, '0')
function countdown() {
  const d = Math.max(0, new Date('2027-01-01T00:00:00') - new Date())
  left.value = `${pad(d / 864e5)}d ${pad((d / 36e5) % 24)}h ${pad((d / 6e4) % 60)}m ${pad((d / 1e3) % 60)}s`
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
async function type(text, cls = '', speed = 18) {
  const line = { text: '', cls }
  lines.value.push(line)
  for (const ch of text) {
    if (!alive) return
    line.text += ch
    await sleep(speed)
  }
  scrollDown()
}
const print = (text, cls = '') => { lines.value.push({ text, cls }); scrollDown() }
const scrollDown = () => nextTick(() => screen.value && (screen.value.scrollTop = screen.value.scrollHeight))

async function boot() {
  await type('$ ./2027.exe --init', 'cmd', 40)
  await sleep(300)
  await type(`> loading memories from 2026 ........ done (${total} photos, ${places.length} places)`)
  await type('> compiling lessons .................. done')
  await type('> scanning for regrets ............... 0 found', 'ok')
  await type('> installing resolutions:')
  for (const [done, r] of RESOLUTIONS) await type(`   [${done ? '✓' : ' '}] ${r}`, done ? 'ok' : 'warn', 12)
  await type('> 2027 will be available in:')
  print('', 'countdown')
  await sleep(200)
  await type('> type “help” to poke around', 'dim')
  typing.value = false
  // don't pop the on-screen keyboard on phones
  if (window.matchMedia('(hover: hover)').matches) nextTick(() => field.value?.focus({ preventScroll: true }))
}

const has2025 = YEARS.some((y) => y.y === 2025)
const COMMANDS = {
  help: () => [`commands: help · ls · whoami · date · replay · ${has2025 ? '2025 · ' : ''}world · clear · sudo make-2027-great`],
  ls: () => ['photos/  manifesto.txt  resolutions.md  regrets/ (empty)'],
  whoami: () => ['me — a slightly better version'],
  date: () => [new Date().toString()],
  replay: () => { scene.pulse++; getLenis()?.scrollTo(0, { duration: 3 }); return ['rewinding 2026…'] },
  ...(has2025 && { 2025: () => { setTimeout(() => goToYear(2025), 400); return ['opening the 2025 roll…'] } }),
  world: () => { setTimeout(() => (window.location.href = '/world/'), 400); return ['meanwhile, in the world…'] },
  clear: () => { lines.value = []; return [] },
  'sudo make-2027-great': () => { scene.pulse++; return ['[sudo] password for me: ********', 'permission granted. it’s up to you though.'] },
  sudo: () => ['nice try.'],
}

function run() {
  const cmd = input.value.trim()
  input.value = ''
  if (!cmd) return
  print(`$ ${cmd}`, 'cmd')
  const fn = COMMANDS[cmd.toLowerCase()] || (cmd.startsWith('sudo') ? COMMANDS.sudo : null)
  const out = fn ? fn() : [`command not found: ${cmd} — try “help”`]
  out.forEach((t) => print(t, fn ? '' : 'warn'))
}

onMounted(() => {
  countdown()
  timer = setInterval(countdown, 1000)
  ScrollTrigger.create({
    trigger: screen.value,
    start: 'top 75%',
    once: true,
    onEnter: () => { if (!started) { started = true; boot() } },
  })
})
onBeforeUnmount(() => { alive = false; clearInterval(timer) })
</script>

<template>
  <section id="outro" class="term-sec" data-mood="outro">
    <p class="eyebrow mono">what’s next</p>
    <div class="win" @click="field?.focus({ preventScroll: true })">
      <div class="title mono"><i /><i /><i /><span>2027.exe — zsh — 80×24</span></div>
      <div ref="screen" class="screen mono">
        <p v-for="(l, i) in lines" :key="i" :class="l.cls">
          <template v-if="l.cls === 'countdown'">   <b>{{ left }}</b></template>
          <template v-else>{{ l.text }}</template>
        </p>
        <form v-show="!typing" class="prompt" @submit.prevent="run">
          <span>$</span>
          <input ref="field" v-model="input" aria-label="Terminal command" autocomplete="off" autocapitalize="off" spellcheck="false" />
        </form>
        <span v-if="typing" class="caret" />
      </div>
    </div>

    <footer class="foot mono">
      <span>© 2026 MY//2026</span>
      <span>photos: mine · captions: lightly fictional</span>
      <a href="/world/" v-scramble>meanwhile, in the world ↗</a>
    </footer>
  </section>
</template>

<style scoped>
.term-sec { min-height: 100svh; display: flex; flex-direction: column; justify-content: center; gap: 24px; padding: 120px var(--gutter) 24px; }
.win {
  width: min(900px, 100%);
  margin: 0 auto;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(198, 255, 61, 0.25);
  background: rgba(5, 8, 5, 0.86);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.6), 0 40px 120px -30px rgba(198, 255, 61, 0.35);
}
.title { display: flex; align-items: center; gap: 8px; padding: 12px 14px; background: rgba(255, 255, 255, 0.04); border-bottom: 1px solid rgba(255, 255, 255, 0.06); color: var(--muted); font-size: 12px; }
.title i { width: 11px; height: 11px; border-radius: 50%; background: #ff5f57; }
.title i:nth-child(2) { background: #febc2e; }
.title i:nth-child(3) { background: #28c840; }
.title span { margin-left: 10px; }
.screen {
  height: min(460px, 56vh);
  overflow-y: auto;
  padding: 20px 22px;
  color: #b8ffa0;
  font-size: 14px;
  line-height: 1.7;
  text-transform: none;
  letter-spacing: 0;
  text-shadow: 0 0 8px rgba(184, 255, 160, 0.45);
  background-image: repeating-linear-gradient(transparent 0 2px, rgba(0, 0, 0, 0.18) 2px 3px);
}
.screen p { white-space: pre-wrap; }
.cmd { color: #fff; }
.ok { color: var(--acid); }
.warn { color: #ffb36b; }
.dim { color: #6f8f68; }
.countdown b { color: var(--pink); font-size: 22px; text-shadow: 0 0 12px rgba(255, 79, 216, 0.7); }
.prompt { display: flex; gap: 10px; }
.prompt input { flex: 1; background: none; border: 0; outline: none; color: #fff; font: inherit; caret-color: var(--acid); }
.caret { display: inline-block; width: 9px; height: 17px; background: #b8ffa0; vertical-align: middle; animation: blink 1s steps(1) infinite; }
@keyframes blink { 50% { opacity: 0; } }
.foot { display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-top: 40px; padding-top: 18px; border-top: 1px solid var(--line); color: var(--muted); font-size: 11px; }
.foot a:hover { color: var(--acid); }

@media (max-width: 640px) {
  .screen { font-size: 12px; padding: 14px; }
}
</style>
