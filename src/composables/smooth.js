import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const scrollState = { progress: 0, velocity: 0 }
let lenis

export function initSmoothScroll() {
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
  lenis.on('scroll', (l) => {
    scrollState.progress = l.progress
    scrollState.velocity = l.velocity
    ScrollTrigger.update()
  })
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
  lenis.stop()
  return lenis
}

export const getLenis = () => lenis
export { gsap, ScrollTrigger }
