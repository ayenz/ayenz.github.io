import gsap from 'gsap'

export const YEARS = [
  { y: 2026, href: '/', color: '#0a0a0c', ink: '#ecebe4' },
]

// Wipe the screen in the destination year's colour, then navigate.
export function goToYear(y) {
  const year = YEARS.find((x) => x.y === y)
  const veil = document.createElement('div')
  Object.assign(veil.style, { position: 'fixed', inset: '0', zIndex: '2000', background: year.color, clipPath: 'circle(0% at 50% 50%)' })
  const tag = document.createElement('span')
  tag.textContent = year.y
  Object.assign(tag.style, {
    position: 'absolute', inset: '0', display: 'grid', placeItems: 'center',
    font: '700 22vw/1 system-ui, sans-serif', letterSpacing: '-0.06em', color: year.ink,
  })
  veil.appendChild(tag)
  document.body.appendChild(veil)
  gsap.timeline({ onComplete: () => (window.location.href = year.href) })
    .to(veil, { clipPath: 'circle(150% at 50% 50%)', duration: 0.9, ease: 'expo.inOut' })
    .from(tag, { yPercent: 30, opacity: 0, duration: 0.5, ease: 'expo.out' }, 0.4)
}
