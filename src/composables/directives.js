import gsap from 'gsap'

const isTouch = () => window.matchMedia('(hover: none)').matches

// Pulls the element toward the cursor while hovered.
export const magnetic = {
  mounted(el, { value = 0.35 }) {
    if (isTouch()) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })
    el._move = (e) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - r.left - r.width / 2) * value)
      yTo((e.clientY - r.top - r.height / 2) * value)
    }
    el._leave = () => { xTo(0); yTo(0) }
    el.addEventListener('pointermove', el._move)
    el.addEventListener('pointerleave', el._leave)
  },
  unmounted(el) {
    el.removeEventListener('pointermove', el._move)
    el.removeEventListener('pointerleave', el._leave)
  },
}

// 3D tilt with a moving glare, driven by CSS variables.
export const tilt = {
  mounted(el, { value = 14 }) {
    if (isTouch()) return
    gsap.set(el, { transformPerspective: 900 })
    el._move = (e) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      gsap.to(el, { rotateY: (px - 0.5) * value, rotateX: (0.5 - py) * value, duration: 0.5, ease: 'power3.out' })
      el.style.setProperty('--gx', `${px * 100}%`)
      el.style.setProperty('--gy', `${py * 100}%`)
    }
    el._leave = () => gsap.to(el, { rotateX: 0, rotateY: 0, duration: 1.2, ease: 'elastic.out(1, 0.35)' })
    el.addEventListener('pointermove', el._move)
    el.addEventListener('pointerleave', el._leave)
  },
  unmounted(el) {
    el.removeEventListener('pointermove', el._move)
    el.removeEventListener('pointerleave', el._leave)
  },
}

const GLYPHS = '!<>-_\\/[]{}—=+*^?#01ABCDEFX'

export function scrambleText(el, finalText, duration = 0.8) {
  const len = finalText.length
  const obj = { p: 0 }
  gsap.killTweensOf(el._scr || {})
  el._scr = obj
  return gsap.to(obj, {
    p: 1,
    duration,
    ease: 'none',
    onUpdate() {
      const done = Math.floor(obj.p * len)
      let out = finalText.slice(0, done)
      for (let i = done; i < len; i++) {
        out += finalText[i] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0]
      }
      el.textContent = out
    },
    onComplete() { el.textContent = finalText },
  })
}

// Scrambles the text on hover.
export const scramble = {
  mounted(el) {
    el._text = el.textContent
    el._enter = () => scrambleText(el, el._text, 0.5)
    el.addEventListener('pointerenter', el._enter)
  },
  unmounted(el) {
    el.removeEventListener('pointerenter', el._enter)
  },
}
