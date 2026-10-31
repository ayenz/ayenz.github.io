<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import * as THREE from 'three'
import gsap from 'gsap'
import { scrollState } from '../../composables/smooth.js'
import { LEAKS, film } from '../store.js'

const canvas = ref(null)
let renderer, raf, onResize, onMove

const frag = /* glsl */ `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uScroll;
uniform float uVel;
uniform vec2 uLeakPos;
uniform float uLeakHue;
uniform float uLeakPower;
uniform float uBurn;
uniform float uFlash;
varying vec2 vUv;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 6; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; } return v; }
vec3 hue2rgb(float h){ return clamp(abs(mod(h * 6.0 + vec3(0, 4, 2), 6.0) - 3.0) - 1.0, 0.0, 1.0); }

void main(){
  vec2 uv = vUv;
  float aspect = uRes.x / uRes.y;
  // gate weave: the whole frame jitters a hair, like a projector
  float t = floor(uTime * 18.0);
  uv += (vec2(hash(vec2(t, 1.0)), hash(vec2(t, 2.0))) - 0.5) * 0.0015 * (1.0 + uVel * 4.0);
  vec2 p = vec2(uv.x * aspect, uv.y);

  // paper: warm base + fibres + blotches
  vec3 paper = vec3(0.937, 0.902, 0.839);
  float fibres = fbm(p * vec2(60.0, 6.0)) * 0.05 + fbm(p * 8.0 + uScroll) * 0.06;
  vec3 col = paper - fibres;

  // light leaks: two warm flares that drift and follow the mouse a bit
  vec2 lp = vec2(uLeakPos.x * aspect, uLeakPos.y) + uMouse * 0.12;
  float n = fbm(p * 1.6 + uTime * 0.05);
  float d1 = length(p - lp + vec2(sin(uTime * 0.3), cos(uTime * 0.21)) * 0.08);
  float d2 = length(p - vec2(aspect - lp.x, 1.0 - lp.y) * 0.9 - vec2(cos(uTime * 0.17), sin(uTime * 0.27)) * 0.1);
  float leak = smoothstep(0.95, 0.0, d1 + n * 0.35) * uLeakPower + smoothstep(0.7, 0.0, d2 + n * 0.3) * uLeakPower * 0.45;
  vec3 leakCol = mix(hue2rgb(uLeakHue), hue2rgb(uLeakHue + 0.06), n);
  col = mix(col, col * 0.55 + leakCol * 0.75, clamp(leak, 0.0, 1.0) * 0.75);
  col += leakCol * pow(clamp(leak, 0.0, 1.0), 3.0) * 0.25;

  // edge burn + vignette
  float edge = min(min(uv.x, 1.0 - uv.x) * aspect, min(uv.y, 1.0 - uv.y));
  float burn = smoothstep(0.0, 0.35 + fbm(p * 3.0) * 0.2, edge);
  col *= mix(vec3(0.55, 0.32, 0.2), vec3(1.0), mix(1.0, burn, uBurn));

  // dust & hairs, re-rolled every few frames
  float tt = floor(uTime * 8.0);
  float dust = step(0.9985, hash(floor(uv * uRes / 3.0) + tt));
  float hair = smoothstep(0.004, 0.0, abs(uv.x - hash(vec2(tt, 9.0)) - sin(uv.y * 9.0 + tt) * 0.02)) * step(0.82, hash(vec2(tt, 3.0)));
  float scratch = smoothstep(0.0015, 0.0, abs(uv.x - fract(hash(vec2(floor(uTime * 2.0), 5.0)) + uTime * 0.01))) * 0.5;
  col = mix(col, vec3(0.12, 0.1, 0.08), clamp(dust * 0.7 + hair * 0.35 + scratch * 0.3, 0.0, 1.0));

  // flicker + shutter flash
  col *= 0.985 + hash(vec2(tt, 7.0)) * 0.03;
  col = mix(col, vec3(1.0, 0.98, 0.94), uFlash);

  gl_FragColor = vec4(col, 1.0);
}`

onMounted(() => {
  const mobile = window.innerWidth < 768
  const dpr = Math.min(window.devicePixelRatio, mobile ? 1.5 : 2)
  renderer = new THREE.WebGLRenderer({ canvas: canvas.value, antialias: false, powerPreference: 'high-performance' })
  renderer.setPixelRatio(dpr)
  renderer.setSize(window.innerWidth, window.innerHeight)

  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  const leak0 = LEAKS.hero
  const uniforms = {
    uRes: { value: new THREE.Vector2(window.innerWidth * dpr, window.innerHeight * dpr) },
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2() },
    uScroll: { value: 0 },
    uVel: { value: 0 },
    uLeakPos: { value: new THREE.Vector2(leak0.x, leak0.y) },
    uLeakHue: { value: leak0.hue },
    uLeakPower: { value: leak0.power },
    uBurn: { value: leak0.burn },
    uFlash: { value: 0 },
  }
  scene.add(new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.ShaderMaterial({
      uniforms,
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position, 1.0); }',
      fragmentShader: frag,
    }),
  ))

  watch(() => film.mood, (m) => {
    const l = LEAKS[m] || LEAKS.hero
    gsap.to(uniforms.uLeakPos.value, { x: l.x, y: l.y, duration: 2.4, ease: 'power3.inOut' })
    gsap.to(uniforms.uLeakHue, { value: l.hue, duration: 2.4 })
    gsap.to(uniforms.uLeakPower, { value: l.power, duration: 2.4 })
    gsap.to(uniforms.uBurn, { value: l.burn, duration: 2.4 })
  })
  watch(() => film.flash, () => {
    gsap.fromTo(uniforms.uFlash, { value: 0.9 }, { value: 0, duration: 0.9, ease: 'expo.out' })
  })

  const mouse = new THREE.Vector2()
  onMove = (e) => mouse.set(e.clientX / window.innerWidth - 0.5, 0.5 - e.clientY / window.innerHeight)
  window.addEventListener('pointermove', onMove)
  onResize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    uniforms.uRes.value.set(window.innerWidth * dpr, window.innerHeight * dpr)
  }
  window.addEventListener('resize', onResize)

  const timer = new THREE.Timer()
  const tick = () => {
    timer.update()
    uniforms.uTime.value = timer.getElapsed()
    uniforms.uMouse.value.lerp(mouse, 0.04)
    uniforms.uScroll.value = scrollState.progress
    uniforms.uVel.value += (Math.min(Math.abs(scrollState.velocity) / 40, 1) - uniforms.uVel.value) * 0.1
    renderer.render(scene, camera)
    raf = requestAnimationFrame(tick)
  }
  tick()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('pointermove', onMove)
  renderer?.dispose()
})
</script>

<template>
  <canvas ref="canvas" class="film-bg" aria-hidden="true" />
</template>

<style scoped>
.film-bg {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
}
</style>
