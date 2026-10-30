<script setup>
import images from '../images.json'
import { SOURCE } from '../events.js'
import { getLenis } from '../../composables/smooth.js'

const credits = Object.values(images)
</script>

<template>
  <footer class="foot" data-globe="outro">
    <div class="big">
      <span>See you in</span>
      <span class="serif">2027.</span>
    </div>

    <div class="cols">
      <div>
        <h4 class="mono">source</h4>
        <p>
          All events and figures come from
          <a :href="SOURCE.url" target="_blank" rel="noopener">“{{ SOURCE.title }}”</a>
          by {{ SOURCE.authors }}, {{ SOURCE.publisher }} (updated {{ SOURCE.updated }}). Wording here is ours —
          go read theirs for the full story.
        </p>
        <div class="actions">
          <button class="pill" v-magnetic @click="getLenis()?.scrollTo(0, { duration: 3 })">↑ back to top</button>
          <a class="pill" href="/" v-magnetic>see my 2026</a>
        </div>
      </div>
      <div>
        <h4 class="mono">photo credits · wikimedia commons</h4>
        <ul class="credits">
          <li v-for="c in credits" :key="c.page">
            <a :href="c.page" target="_blank" rel="noopener">{{ decodeURIComponent(c.page.split('File:')[1]).replace(/_/g, ' ') }}</a>
            <span>— {{ c.author }}, {{ c.license }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="bar mono">
      <span>REAL//2026</span>
      <span>vue · three.js · gsap · lenis</span>
    </div>
  </footer>
</template>

<style scoped>
.foot { position: relative; z-index: 2; padding: 120px var(--gutter) 24px; background: linear-gradient(to bottom, transparent, rgba(8, 8, 10, 0.95) 30%); }
.big { display: flex; flex-direction: column; font-size: clamp(64px, 13vw, 240px); line-height: 0.85; letter-spacing: -0.06em; font-weight: 700; margin-bottom: 80px; }
.big .serif { color: var(--red); font-weight: 300; }
.cols { display: grid; grid-template-columns: 1fr 1.3fr; gap: 56px; border-top: 1px solid var(--line); padding-top: 32px; }
h4 { color: var(--muted); font-weight: 400; margin-bottom: 16px; }
.cols p { color: #cfc9bd; line-height: 1.6; max-width: 46ch; }
.cols a { color: var(--fg); text-decoration: underline; text-underline-offset: 3px; text-decoration-color: rgba(242, 237, 228, 0.3); }
.cols a:hover { text-decoration-color: var(--red); }
.actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 28px; }
.actions .pill { text-decoration: none; }
.credits { list-style: none; columns: 2; column-gap: 28px; font-size: 12px; line-height: 1.5; }
.credits li { break-inside: avoid; margin-bottom: 8px; color: var(--muted); }
.bar { display: flex; justify-content: space-between; gap: 12px; margin-top: 56px; padding-top: 16px; border-top: 1px solid var(--line); color: var(--muted); font-size: 11px; }

@media (max-width: 860px) {
  .cols { grid-template-columns: 1fr; }
  .credits { columns: 1; }
}
</style>
