<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import gsap from 'gsap'
import { blobVertex, blobFragment, particlesVertex, particlesFragment } from '../composables/shaders.js'
import { scrollState } from '../composables/smooth.js'
import { MOODS, scene as sceneState } from '../composables/mood.js'

const canvas = ref(null)
let renderer, composer, raf, onResize, onMove

const RGBShift = {
  uniforms: { tDiffuse: { value: null }, uAmount: { value: 0 }, uTime: { value: 0 } },
  vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
  fragmentShader: `
    uniform sampler2D tDiffuse;uniform float uAmount;uniform float uTime;varying vec2 vUv;
    void main(){
      vec2 dir=vUv-.5;float d=length(dir);
      vec2 off=dir*uAmount*d;
      float wobble=sin(vUv.y*40.+uTime*10.)*uAmount*.02;
      vec4 c=texture2D(tDiffuse,vUv+vec2(wobble,0.));
      c.r=texture2D(tDiffuse,vUv+off+vec2(wobble,0.)).r;
      c.b=texture2D(tDiffuse,vUv-off+vec2(wobble,0.)).b;
      float vig=smoothstep(.9,.3,d);
      gl_FragColor=vec4(c.rgb*mix(.55,1.,vig),1.);
    }`,
}

onMounted(() => {
  const mobile = window.innerWidth < 768
  const dpr = Math.min(window.devicePixelRatio, 2)

  renderer = new THREE.WebGLRenderer({ canvas: canvas.value, antialias: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(dpr)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(0x000000)

  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x0a0a0c, 0.045)
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
  camera.position.set(0, 0, mobile ? 9 : 7)

  // The blob
  const blobUniforms = {
    uTime: { value: 0 },
    uIntensity: { value: 0.6 },
    uMouse: { value: new THREE.Vector2() },
    uColorA: { value: new THREE.Color(MOODS.hero.a) },
    uColorB: { value: new THREE.Color(MOODS.hero.b) },
    uColorC: { value: new THREE.Color(MOODS.hero.c) },
  }
  const blob = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.5, mobile ? 64 : 160),
    new THREE.ShaderMaterial({ vertexShader: blobVertex, fragmentShader: blobFragment, uniforms: blobUniforms }),
  )
  scene.add(blob)

  // Orbiting wire rings
  const rings = new THREE.Group()
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.4 + i * 0.45, 0.004, 8, 256),
      new THREE.MeshBasicMaterial({ color: i === 1 ? 0xc6ff3d : 0xecebe4, transparent: true, opacity: 0.35 }),
    )
    ring.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0)
    rings.add(ring)
  }
  blob.add(rings)

  // Particle galaxy
  const count = mobile ? 10000 : 50000
  const pos = new Float32Array(count * 3)
  const seeds = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    const r = 3 + Math.pow(Math.random(), 1.6) * 18
    const theta = Math.random() * Math.PI * 2
    const arm = (i % 4) * (Math.PI / 2)
    pos[i * 3] = Math.cos(theta + arm + r * 0.25) * r
    pos[i * 3 + 1] = (Math.random() - 0.5) * (6 - r * 0.15)
    pos[i * 3 + 2] = Math.sin(theta + arm + r * 0.25) * r - 4
    seeds[i] = Math.random()
  }
  const pGeo = new THREE.BufferGeometry()
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  pGeo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
  const pUniforms = {
    uTime: { value: 0 },
    uPixelRatio: { value: dpr },
    uScroll: { value: 0 },
    uMouse: { value: new THREE.Vector2() },
    uColorA: { value: new THREE.Color('#ecebe4') },
    uColorB: { value: new THREE.Color(MOODS.hero.c) },
  }
  const particles = new THREE.Points(
    pGeo,
    new THREE.ShaderMaterial({
      vertexShader: particlesVertex,
      fragmentShader: particlesFragment,
      uniforms: pUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  )
  scene.add(particles)

  // Post-processing stack
  composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  const bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.55, 0.5, 0.3)
  composer.addPass(bloom)
  const afterimage = new AfterimagePass(0.82)
  composer.addPass(afterimage)
  const rgb = new ShaderPass(RGBShift)
  composer.addPass(rgb)
  composer.addPass(new OutputPass())

  // Mood transitions
  const target = { x: 0, y: 0, scale: 1 }
  watch(
    () => sceneState.mood,
    (m) => {
      const mood = MOODS[m]
      const dur = 1.6
      const ease = 'power3.inOut'
      gsap.to(blobUniforms.uColorA.value, { ...hex(mood.a), duration: dur, ease })
      gsap.to(blobUniforms.uColorB.value, { ...hex(mood.b), duration: dur, ease })
      gsap.to(blobUniforms.uColorC.value, { ...hex(mood.c), duration: dur, ease })
      gsap.to(pUniforms.uColorB.value, { ...hex(mood.c), duration: dur, ease })
      gsap.to(blobUniforms.uIntensity, { value: mood.intensity, duration: dur, ease })
      gsap.to(target, { x: mobile ? mood.x * 0.35 : mood.x, y: mood.y, scale: mobile ? mood.scale * 0.65 : mood.scale, duration: 2, ease })
    },
  )
  watch(
    () => sceneState.pulse,
    () => {
      gsap.fromTo(bloom, { strength: 2 }, { strength: 0.55, duration: 1.4, ease: 'expo.out' })
      gsap.fromTo(blobUniforms.uIntensity, { value: 4 }, { value: MOODS[sceneState.mood].intensity, duration: 1.6, ease: 'expo.out' })
    },
  )

  const mouse = new THREE.Vector2()
  const smoothMouse = new THREE.Vector2()
  onMove = (e) => {
    mouse.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1)
  }
  window.addEventListener('pointermove', onMove)

  onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    composer.setSize(window.innerWidth, window.innerHeight)
  }
  window.addEventListener('resize', onResize)

  const timer = new THREE.Timer()
  const tick = () => {
    timer.update()
    const t = timer.getElapsed()
    smoothMouse.lerp(mouse, 0.05)
    const vel = Math.min(Math.abs(scrollState.velocity) / 60, 1)

    blobUniforms.uTime.value = t
    blobUniforms.uMouse.value.copy(smoothMouse)
    pUniforms.uTime.value = t
    pUniforms.uMouse.value.copy(smoothMouse)
    pUniforms.uScroll.value = scrollState.progress

    blob.position.x += (target.x - blob.position.x) * 0.06
    blob.position.y += (target.y - blob.position.y) * 0.06
    const s = target.scale * (1 + vel * 0.15)
    blob.scale.setScalar(blob.scale.x + (s - blob.scale.x) * 0.08)
    blob.rotation.y = t * 0.12 + smoothMouse.x * 0.6
    blob.rotation.x = smoothMouse.y * 0.4 + scrollState.progress * Math.PI
    rings.rotation.z = t * 0.2
    rings.rotation.x = t * 0.13

    camera.position.x += (smoothMouse.x * 0.6 - camera.position.x) * 0.04
    camera.position.y += (smoothMouse.y * 0.4 - camera.position.y) * 0.04
    camera.lookAt(0, 0, 0)

    rgb.uniforms.uAmount.value += (0.012 + vel * 0.12 - rgb.uniforms.uAmount.value) * 0.1
    rgb.uniforms.uTime.value = t
    afterimage.uniforms.damp.value = 0.7 + vel * 0.2

    composer.render()
    raf = requestAnimationFrame(tick)
  }
  tick()
})

function hex(str) {
  const c = new THREE.Color(str)
  return { r: c.r, g: c.g, b: c.b }
}

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('pointermove', onMove)
  composer?.dispose()
  renderer?.dispose()
})
</script>

<template>
  <canvas ref="canvas" class="webgl" aria-hidden="true" />
</template>

<style scoped>
.webgl {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
}
</style>
