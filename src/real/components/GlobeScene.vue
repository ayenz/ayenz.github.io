<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import gsap from 'gsap'
import land from '../land.json'
import { EVENTS, CATEGORIES } from '../events.js'
import { globe } from '../store.js'
import { scrollState } from '../../composables/smooth.js'

const canvas = ref(null)
const label = ref(null)
const labelText = ref('')
let renderer, composer, raf, onResize, onMove

const R = 1.8
const toVec = (lat, lng, r = R) => {
  const phi = THREE.MathUtils.degToRad(90 - lat)
  const theta = THREE.MathUtils.degToRad(lng + 180)
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta))
}

const LAYOUT = {
  desktop: {
    hero: { x: 1.9, y: -0.1, s: 1.15 },
    feed: { x: -2.35, y: 0, s: 0.95 },
    numbers: { x: 0, y: -3.6, s: 1.9 },
    feature: { x: 0, y: 0.2, s: 0.28 },
    outro: { x: 0, y: -3.3, s: 1.8 },
  },
  mobile: {
    hero: { x: 0, y: 1.0, s: 0.72 },
    feed: { x: 0, y: 2.3, s: 0.62 },
    numbers: { x: 0, y: -3.4, s: 1.3 },
    feature: { x: 0, y: 0.6, s: 0.2 },
    outro: { x: 0, y: -3.2, s: 1.3 },
  },
}

const landVert = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
uniform vec3 uFocus;
uniform float uWave;
varying float vFacing;
varying float vWave;
varying float vNear;
void main(){
  vec3 n = normalize(position);
  vFacing = (normalMatrix * n).z;
  float d = distance(n, normalize(uFocus));
  vWave = exp(-pow((d - uWave) * 9.0, 2.0)) * (1.0 - smoothstep(0.0, 1.6, uWave));
  vNear = 1.0 - smoothstep(0.0, 0.35, d);
  vec3 p = position * (1.0 + vWave * 0.04);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = (2.2 + vWave * 4.0) * uPixelRatio * (8.0 / -mv.z);
}`
const landFrag = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uAccent;
uniform float uFocusOn;
varying float vFacing;
varying float vWave;
varying float vNear;
void main(){
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float a = smoothstep(-0.15, 0.5, vFacing);
  vec3 col = mix(uColor, uAccent, clamp(vWave * 2.0 + vNear * 0.6 * uFocusOn, 0.0, 1.0));
  gl_FragColor = vec4(col * (1.0 + vWave * 3.0), a * (0.55 + vWave + vNear * 0.3 * uFocusOn));
}`

const markerVert = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
uniform float uActive;
attribute vec3 aColor;
attribute float aIndex;
varying vec3 vColor;
varying float vActive;
varying float vFacing;
void main(){
  vColor = aColor;
  vActive = 1.0 - step(0.5, abs(aIndex - uActive));
  vFacing = (normalMatrix * normalize(position)).z;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = (10.0 + vActive * 46.0) * uPixelRatio * (8.0 / -mv.z);
}`
const markerFrag = /* glsl */ `
uniform float uTime;
uniform float uDim;
varying vec3 vColor;
varying float vActive;
varying float vFacing;
void main(){
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float core = smoothstep(0.35, 0.0, d);
  float ring = 0.0;
  if (vActive > 0.5) {
    float t = fract(uTime * 0.8);
    ring = smoothstep(0.06, 0.0, abs(d - t)) * (1.0 - t);
    core = smoothstep(0.16, 0.0, d) * 1.5;
  }
  float a = (core + ring) * smoothstep(0.0, 0.3, vFacing);
  a *= mix(uDim, 1.0, vActive);
  if (a < 0.01) discard;
  gl_FragColor = vec4(vColor * (1.4 + vActive * 1.5), a);
}`

const atmoVert = /* glsl */ `
varying vec3 vN;
varying vec3 vV;
void main(){
  vN = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vV = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`
const atmoFrag = /* glsl */ `
uniform vec3 uColor;
varying vec3 vN;
varying vec3 vV;
void main(){
  float f = pow(1.0 - abs(dot(vN, vV)), 6.0);
  gl_FragColor = vec4(uColor, f * 0.55);
}`

onMounted(() => {
  const mobile = window.innerWidth < 900
  const dpr = Math.min(window.devicePixelRatio, 2)

  renderer = new THREE.WebGLRenderer({ canvas: canvas.value, antialias: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(dpr)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(0x000000)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 200)
  camera.position.set(0, 0, 9)

  const root = new THREE.Group() // position/scale per section
  const spin = new THREE.Group() // rotation toward the focused event
  root.add(spin)
  scene.add(root)

  // Land dots
  const pos = new Float32Array(land.length * 3)
  land.forEach(([lat, lng], i) => toVec(lat, lng).toArray(pos, i * 3))
  const landGeo = new THREE.BufferGeometry()
  landGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  const landUniforms = {
    uTime: { value: 0 },
    uPixelRatio: { value: dpr },
    uFocus: { value: new THREE.Vector3(0, 0, 1) },
    uWave: { value: 2 },
    uFocusOn: { value: 0 },
    uColor: { value: new THREE.Color('#f2ede4') },
    uAccent: { value: new THREE.Color('#ff3b1f') },
  }
  spin.add(new THREE.Points(landGeo, new THREE.ShaderMaterial({
    vertexShader: landVert, fragmentShader: landFrag, uniforms: landUniforms, transparent: true, depthWrite: false,
  })))

  // Dark core so the far side of the globe is hidden
  spin.add(new THREE.Mesh(new THREE.SphereGeometry(R * 0.985, 96, 96), new THREE.MeshBasicMaterial({ color: 0x0b0b0e })))

  // Lat/long graticule
  const grat = new THREE.Group()
  const gratMat = new THREE.LineBasicMaterial({ color: 0xf2ede4, transparent: true, opacity: 0.06 })
  for (let lat = -60; lat <= 60; lat += 30) {
    const pts = []
    for (let lng = -180; lng <= 180; lng += 4) pts.push(toVec(lat, lng, R * 1.002))
    grat.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gratMat))
  }
  for (let lng = -180; lng < 180; lng += 30) {
    const pts = []
    for (let lat = -90; lat <= 90; lat += 4) pts.push(toVec(lat, lng, R * 1.002))
    grat.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gratMat))
  }
  spin.add(grat)

  // Event markers
  const located = EVENTS.filter((e) => e.loc)
  const mPos = new Float32Array(located.length * 3)
  const mCol = new Float32Array(located.length * 3)
  const mIdx = new Float32Array(located.length)
  located.forEach((e, i) => {
    toVec(e.loc[0], e.loc[1], R * 1.01).toArray(mPos, i * 3)
    new THREE.Color(CATEGORIES.find((c) => c.id === e.cat).color).toArray(mCol, i * 3)
    mIdx[i] = i
  })
  const mGeo = new THREE.BufferGeometry()
  mGeo.setAttribute('position', new THREE.BufferAttribute(mPos, 3))
  mGeo.setAttribute('aColor', new THREE.BufferAttribute(mCol, 3))
  mGeo.setAttribute('aIndex', new THREE.BufferAttribute(mIdx, 1))
  const markerUniforms = { uTime: { value: 0 }, uPixelRatio: { value: dpr }, uActive: { value: -1 }, uDim: { value: 1 } }
  spin.add(new THREE.Points(mGeo, new THREE.ShaderMaterial({
    vertexShader: markerVert, fragmentShader: markerFrag, uniforms: markerUniforms,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  })))

  // Atmosphere
  const atmo = new THREE.Mesh(
    new THREE.SphereGeometry(R * 1.05, 96, 96),
    new THREE.ShaderMaterial({
      vertexShader: atmoVert, fragmentShader: atmoFrag, uniforms: { uColor: { value: new THREE.Color('#ff3b1f') } },
      transparent: true, side: THREE.BackSide, depthWrite: false, blending: THREE.AdditiveBlending,
    }),
  )
  root.add(atmo)

  // Flight arc between consecutive focused events
  const ARC_SEG = 96
  const arcGeo = new THREE.BufferGeometry()
  arcGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(ARC_SEG * 3), 3))
  arcGeo.setDrawRange(0, 0)
  const arcMat = new THREE.LineBasicMaterial({ color: 0xff3b1f, transparent: true, opacity: 1 })
  spin.add(new THREE.Line(arcGeo, arcMat))
  const arcState = { p: 0 }
  function buildArc(a, b) {
    const va = toVec(a[0], a[1]).normalize()
    const vb = toVec(b[0], b[1]).normalize()
    const angle = va.angleTo(vb)
    const arr = arcGeo.attributes.position.array
    const q = new THREE.Quaternion()
    const axis = new THREE.Vector3().crossVectors(va, vb).normalize()
    for (let i = 0; i < ARC_SEG; i++) {
      const t = i / (ARC_SEG - 1)
      q.setFromAxisAngle(axis, angle * t)
      const v = va.clone().applyQuaternion(q).multiplyScalar(R * (1.01 + Math.sin(Math.PI * t) * angle * 0.22))
      v.toArray(arr, i * 3)
    }
    arcGeo.attributes.position.needsUpdate = true
    gsap.fromTo(arcState, { p: 0 }, { p: 1, duration: 1.4, ease: 'power3.inOut' })
    gsap.fromTo(arcMat, { opacity: 1 }, { opacity: 0, duration: 1.2, delay: 1.8 })
  }

  // Starfield
  const starCount = mobile ? 2500 : 9000
  const sPos = new Float32Array(starCount * 3)
  for (let i = 0; i < starCount; i++) {
    const v = new THREE.Vector3().randomDirection().multiplyScalar(30 + Math.random() * 60)
    v.toArray(sPos, i * 3)
  }
  const stars = new THREE.Points(
    new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(sPos, 3)),
    new THREE.PointsMaterial({ color: 0xf2ede4, size: 0.12, transparent: true, opacity: 0.5, depthWrite: false }),
  )
  scene.add(stars)

  composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  const bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.7, 0.5, 0.55)
  composer.addPass(bloom)
  composer.addPass(new OutputPass())

  // Section layout
  const target = { x: 0, y: 0, s: 1 }
  const applyMode = (m) => {
    const l = LAYOUT[mobile ? 'mobile' : 'desktop'][m] || LAYOUT.desktop.hero
    gsap.to(target, { x: l.x, y: l.y, s: l.s, duration: 2.2, ease: 'power3.inOut', overwrite: true })
    gsap.to(markerUniforms.uDim, { value: m === 'feed' ? 0.35 : 1, duration: 1 })
  }
  applyMode(globe.mode)
  watch(() => globe.mode, applyMode)

  // Focus: rotate the globe so the event faces the camera
  const rot = { a: 0, b: 0.35 }
  const rotTarget = { a: 0, b: 0.35 }
  let idle = true
  let prevLoc = null
  watch(
    () => globe.focus,
    (f) => {
      if (!f || !f.loc) {
        idle = true
        markerUniforms.uActive.value = -1
        gsap.to(landUniforms.uFocusOn, { value: 0, duration: 0.8 })
        labelText.value = ''
        return
      }
      idle = false
      const v = toVec(f.loc[0], f.loc[1])
      let a = Math.atan2(-v.x, v.z)
      const b = Math.atan2(v.y, Math.hypot(v.x, v.z))
      // take the short way around
      while (a - rot.a > Math.PI) a -= Math.PI * 2
      while (a - rot.a < -Math.PI) a += Math.PI * 2
      rotTarget.a = a
      rotTarget.b = b
      markerUniforms.uActive.value = located.findIndex((e) => e.id === f.id)
      landUniforms.uFocus.value.copy(v)
      gsap.to(landUniforms.uFocusOn, { value: 1, duration: 0.8 })
      gsap.fromTo(landUniforms.uWave, { value: 0 }, { value: 1.6, duration: 2.4, ease: 'power2.out', delay: 0.5 })
      if (prevLoc) buildArc(prevLoc, f.loc)
      prevLoc = f.loc
      labelText.value = f.place
    },
  )

  const mouse = new THREE.Vector2()
  const smooth = new THREE.Vector2()
  onMove = (e) => mouse.set(e.clientX / window.innerWidth - 0.5, e.clientY / window.innerHeight - 0.5)
  window.addEventListener('pointermove', onMove)

  onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    composer.setSize(window.innerWidth, window.innerHeight)
  }
  window.addEventListener('resize', onResize)

  const timer = new THREE.Timer()
  const tmp = new THREE.Vector3()
  const tick = () => {
    timer.update()
    const t = timer.getElapsed()
    smooth.lerp(mouse, 0.05)

    if (idle) rotTarget.a += 0.0025
    rot.a += (rotTarget.a - rot.a) * 0.045
    rot.b += (rotTarget.b - rot.b) * 0.045
    spin.rotation.set(rot.b + smooth.y * 0.25, rot.a + smooth.x * 0.4, 0)

    root.position.x += (target.x - root.position.x) * 0.08
    root.position.y += (target.y - root.position.y) * 0.08
    root.scale.setScalar(root.scale.x + (target.s - root.scale.x) * 0.08)

    stars.rotation.y = t * 0.005 + scrollState.progress * 0.8
    stars.rotation.x = smooth.y * 0.1

    landUniforms.uTime.value = t
    markerUniforms.uTime.value = t
    arcGeo.setDrawRange(0, Math.floor(arcState.p * ARC_SEG))

    // Pin the HTML label to the active marker
    if (label.value) {
      const idx = markerUniforms.uActive.value
      if (idx >= 0 && labelText.value) {
        tmp.fromArray(mPos, idx * 3).applyMatrix4(spin.matrixWorld)
        const facing = tmp.clone().sub(root.position).normalize().z
        tmp.project(camera)
        const x = (tmp.x * 0.5 + 0.5) * window.innerWidth
        const y = (-tmp.y * 0.5 + 0.5) * window.innerHeight
        label.value.style.transform = `translate(${x}px, ${y}px)`
        label.value.style.opacity = facing > 0.2 ? 1 : 0
      } else {
        label.value.style.opacity = 0
      }
    }

    composer.render()
    raf = requestAnimationFrame(tick)
  }
  tick()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('pointermove', onMove)
  composer?.dispose()
  renderer?.dispose()
})
</script>

<template>
  <canvas ref="canvas" class="globe" aria-hidden="true" />
  <div ref="label" class="globe-label mono" aria-hidden="true">
    <span class="tick" />
    <span class="txt">{{ labelText }}</span>
  </div>
</template>

<style scoped>
.globe {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
}
.globe-label {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  pointer-events: none;
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.4s;
  will-change: transform;
}
.tick { width: 28px; height: 1px; background: var(--red); margin-left: 14px; }
.txt {
  background: var(--red);
  color: var(--fg);
  padding: 4px 8px;
  border-radius: 4px;
  white-space: nowrap;
  font-size: 11px;
}
</style>
