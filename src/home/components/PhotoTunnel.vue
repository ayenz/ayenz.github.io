<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { months } from '../months.js'

const emit = defineEmits(['open'])
const root = ref(null)
const canvas = ref(null)
const current = ref(0)
const hovering = ref(false)
let renderer, composer, raf, io, st, cleanup = () => {}

const SPACING = 7
const shots = months.map((m, i) => ({ ...m, i })).filter((m) => m.photo)

const photoVert = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`
const photoFrag = /* glsl */ `
uniform sampler2D uMap;
uniform float uNear;
uniform float uTime;
uniform float uHover;
uniform vec3 uGlow;
varying vec2 vUv;
void main(){
  float shift = (1.0 - uNear) * 0.012 + uHover * 0.004;
  vec3 c = vec3(
    texture2D(uMap, vUv + vec2(shift, 0.0)).r,
    texture2D(uMap, vUv).g,
    texture2D(uMap, vUv - vec2(shift, 0.0)).b
  );
  float scan = 0.94 + 0.06 * sin(vUv.y * 600.0 + uTime * 8.0);
  float grey = dot(c, vec3(0.299, 0.587, 0.114));
  c = mix(vec3(grey) * vec3(0.7, 0.8, 1.0), c, uNear) * scan;
  // neon border
  vec2 e = min(vUv, 1.0 - vUv);
  float edge = smoothstep(0.018, 0.0, min(e.x, e.y));
  c = mix(c, uGlow * 1.6, edge * (0.6 + 0.4 * uNear + uHover));
  gl_FragColor = vec4(c, smoothstep(0.0, 0.25, uNear + 0.05));
}`

onMounted(() => {
  const mobile = window.innerWidth < 768
  const el = root.value
  const dpr = Math.min(window.devicePixelRatio, mobile ? 1.5 : 2)
  const W = () => el.clientWidth, H = () => el.clientHeight

  renderer = new THREE.WebGLRenderer({ canvas: canvas.value, antialias: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(dpr)
  renderer.setSize(W(), H())
  renderer.setClearColor(0x000000)

  const scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0x000000, 6, 34)
  const camera = new THREE.PerspectiveCamera(mobile ? 72 : 60, W() / H(), 0.1, 120)
  camera.position.set(0, 0, 6)

  // Photos spiral down the tunnel
  const loader = new THREE.TextureLoader()
  const glows = [0xc6ff3d, 0xff4fd8, 0x4f7bff, 0xff7a2f]
  const planes = shots.map((m, k) => {
    const uniforms = {
      uMap: { value: null },
      uNear: { value: 0 },
      uTime: { value: 0 },
      uHover: { value: 0 },
      uGlow: { value: new THREE.Color(glows[k % glows.length]) },
    }
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.ShaderMaterial({ vertexShader: photoVert, fragmentShader: photoFrag, uniforms, transparent: true }),
    )
    const h = mobile ? 2.2 : 2.6
    mesh.scale.set(h * 0.8, h, 1)
    loader.load(m.photo, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
      tex.anisotropy = 8
      uniforms.uMap.value = tex
      mesh.scale.x = h * (tex.image.width / tex.image.height)
    })
    const a = k * 2.3
    const r = mobile ? 1.0 : 2.1
    mesh.position.set(Math.cos(a) * r, Math.sin(a) * r * 0.55, -k * SPACING)
    mesh.rotation.y = -Math.cos(a) * 0.35
    mesh.rotation.z = Math.sin(a) * 0.06
    mesh.userData = { index: m.i, k }
    scene.add(mesh)
    return { mesh, uniforms }
  })
  const length = Math.max(1, shots.length - 1) * SPACING

  // Neon rings
  const rings = new THREE.Group()
  for (let z = 2; z > -length - 12; z -= 3.5) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(4.2, 0.012, 8, 160),
      new THREE.MeshBasicMaterial({ color: glows[Math.abs(Math.round(z / 3.5)) % glows.length], transparent: true, opacity: 0.8 }),
    )
    ring.position.z = z
    ring.scale.y = 0.62
    rings.add(ring)
  }
  scene.add(rings)

  // Speed streaks
  const N = mobile ? 900 : 3000
  const seg = new Float32Array(N * 6)
  for (let i = 0; i < N; i++) {
    const a = Math.random() * Math.PI * 2, r = 3 + Math.random() * 6
    const x = Math.cos(a) * r, y = Math.sin(a) * r * 0.62, z = 6 - Math.random() * (length + 30), l = 0.4 + Math.random() * 1.6
    seg.set([x, y, z, x, y, z - l], i * 6)
  }
  const streaks = new THREE.LineSegments(
    new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(seg, 3)),
    new THREE.LineBasicMaterial({ color: 0xecebe4, transparent: true, opacity: 0.35 }),
  )
  scene.add(streaks)

  composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(W(), H()), 0.55, 0.4, 0.82))
  composer.addPass(new OutputPass())

  // Scroll flies the camera down the tunnel
  const flight = { z: 6 }
  st = ScrollTrigger.create({
    trigger: el,
    start: 'top top',
    end: () => `+=${window.innerHeight * (shots.length * 0.6 + 1)}`,
    pin: true,
    scrub: 1.2,
    animation: gsap.to(flight, { z: -length + 3.2, ease: 'none' }),
  })

  // Hover / click a photo
  const ray = new THREE.Raycaster()
  const ptr = new THREE.Vector2(9, 9)
  const mouse = new THREE.Vector2()
  const onMove = (e) => {
    const r = canvas.value.getBoundingClientRect()
    ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    mouse.copy(ptr)
  }
  let downAt = null
  const onDown = (e) => (downAt = { x: e.clientX, y: e.clientY })
  const onUp = (e) => {
    if (!downAt || Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 8) return
    onMove(e)
    ray.setFromCamera(ptr, camera)
    const hit = ray.intersectObjects(planes.map((p) => p.mesh))[0]
    if (hit && hit.object.userData && planes[hit.object.userData.k].uniforms.uNear.value > 0.3) emit('open', hit.object.userData.index)
  }
  canvas.value.addEventListener('pointermove', onMove)
  canvas.value.addEventListener('pointerdown', onDown)
  canvas.value.addEventListener('pointerup', onUp)

  const onResize = () => {
    camera.aspect = W() / H()
    camera.updateProjectionMatrix()
    renderer.setSize(W(), H())
    composer.setSize(W(), H())
  }
  window.addEventListener('resize', onResize)

  // Only render while the section is on screen
  let visible = false
  io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
  io.observe(el)

  const timer = new THREE.Timer()
  const look = new THREE.Vector3()
  const tick = () => {
    raf = requestAnimationFrame(tick)
    if (!visible) return
    timer.update()
    const t = timer.getElapsed()
    camera.position.z = flight.z
    camera.position.x += (mouse.x * 0.8 - camera.position.x) * 0.05
    camera.position.y += (mouse.y * 0.5 - camera.position.y) * 0.05
    look.set(camera.position.x * 0.3, camera.position.y * 0.3, camera.position.z - 10)
    camera.lookAt(look)
    camera.rotation.z = Math.sin(t * 0.3) * 0.04 + mouse.x * -0.05

    rings.children.forEach((r, i) => (r.rotation.z = t * (i % 2 ? 0.15 : -0.1)))
    streaks.position.z = (t * 2) % 6

    ray.setFromCamera(ptr, camera)
    const hit = ray.intersectObjects(planes.map((p) => p.mesh))[0]
    let nearest = 0, best = Infinity
    planes.forEach((p, k) => {
      const d = p.mesh.position.z - camera.position.z
      const near = d < 0 ? THREE.MathUtils.clamp(1 - (-d - 2.5) / 12, 0, 1) : THREE.MathUtils.clamp(1 - d / 1.2, 0, 1)
      p.uniforms.uNear.value += (near - p.uniforms.uNear.value) * 0.15
      p.uniforms.uTime.value = t
      const hov = hit?.object === p.mesh ? 1 : 0
      p.uniforms.uHover.value += (hov - p.uniforms.uHover.value) * 0.15
      p.mesh.position.y += Math.sin(t * 0.8 + k) * 0.0015
      if (d < -1.5 && -d < best) { best = -d; nearest = k }
    })
    hovering.value = !!hit
    current.value = nearest
    composer.render()
  }
  tick()

  cleanup = () => {
    window.removeEventListener('resize', onResize)
    canvas.value?.removeEventListener('pointermove', onMove)
    canvas.value?.removeEventListener('pointerdown', onDown)
    canvas.value?.removeEventListener('pointerup', onUp)
  }
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  io?.disconnect()
  st?.kill()
  cleanup()
  composer?.dispose()
  renderer?.dispose()
})
</script>

<template>
  <section id="tunnel" ref="root" class="tunnel" data-mood="stats">
    <canvas ref="canvas" class="gl" :class="{ hot: hovering }" :data-cursor="hovering ? 'view' : null" />
    <div class="hud">
      <p class="eyebrow mono">the tunnel</p>
      <h2>Fly through<br /><span class="serif">the year.</span></h2>
    </div>
    <div v-if="shots[current]" class="now mono">
      <span class="n">{{ shots[current].n }}</span>
      <span>{{ shots[current].m }} 2026 · {{ shots[current].title }}</span>
    </div>
    <div class="bar"><span :style="{ transform: `scaleX(${(current + 1) / shots.length})` }" /></div>
  </section>
</template>

<style scoped>
.tunnel { position: relative; height: 100vh; overflow: hidden; background: #000; }
.gl { position: absolute; inset: 0; width: 100%; height: 100%; }
.hud { position: absolute; left: var(--gutter); top: 96px; pointer-events: none; mix-blend-mode: difference; }
.hud h2 { font-size: clamp(40px, 5.5vw, 88px); line-height: 0.92; letter-spacing: -0.05em; }
.hud .serif { color: var(--acid); }
.now {
  position: absolute;
  left: var(--gutter);
  bottom: 40px;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 16px 10px 10px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: rgba(5, 5, 7, 0.6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  pointer-events: none;
}
.now .n { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 50%; background: var(--acid); color: var(--bg); }
.bar { position: absolute; right: var(--gutter); bottom: 56px; width: min(220px, 30vw); height: 2px; background: var(--line); }
.bar span { display: block; height: 100%; background: var(--acid); transform-origin: left; transition: transform 0.6s var(--ease); }

@media (max-width: 640px) {
  .now { right: var(--gutter); bottom: 72px; font-size: 11px; }
  .bar { left: var(--gutter); right: var(--gutter); width: auto; bottom: 48px; }
}
</style>
