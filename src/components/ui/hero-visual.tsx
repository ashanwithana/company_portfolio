'use client'

import * as React from 'react'

import { useReducedMotion } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'

/**
 * Hero 3D visual — a dotted globe.
 *
 * A sphere of ~4,000 points, each one a landmass sample lifted to the surface
 * and rotated with the planet. Two things make it read as 3D rather than a flat
 * dot field:
 *
 *   1. Depth attenuation. Each point's size and brightness scale with its z in
 *      camera space, so the limb brightens and the far side recedes.
 *   2. A limb ring plus three inclined orbital ellipses traced in the same
 *      camera space, which give the silhouette an unambiguous frame of
 *      reference and catch a travelling highlight.
 *
 * Points are rasterised as small squares rather than a sprite atlas: at this
 * density the difference is invisible and it keeps the whole effect to one
 * draw call and one shader.
 *
 * Performance budget: the land mask is 512×256 samples baked once into a texture
 * on mount, the point buffer is uploaded once, and each frame is a single
 * `drawArrays` with no per-point CPU work. The canvas is backed at 65% of
 * display resolution and upscaled by CSS. One rAF loop, paused off-screen,
 * static CSS fallback for reduced motion and for browsers without WebGL.
 */

const VERT = /* glsl */ `
attribute vec3 aPos;
attribute float aMask;
attribute float aAccent;

uniform mat4 uMVP;
uniform float uPointScale;
uniform float uTheme;

varying float vMask;
varying float vDepth;
varying float vAccent;

void main() {
  // Landmass samples ride slightly above the sphere so the coastline edge reads
  // crisply against the limb ring.
  vec3 lift = normalize(aPos) * (1.0 + aMask * 0.014);
  vec4 clip = uMVP * vec4(lift, 1.0);

  // w is the perspective divisor: large for near points, small at the far limb.
  float w = max(clip.w, 0.001);

  float t = clamp((clip.z / w) * 0.5 + 0.5, 0.0, 1.0);
  vDepth = t;
  vMask = aMask;
  vAccent = aAccent;

  gl_Position = clip;

  // Perspective size attenuation, with a floor so the far limb does not
  // degenerate into sub-pixel dust and the sphere reads as a solid figure.
  // Accent nodes are drawn larger — they are meant to read as signal, not noise.
  float atten = clamp(uPointScale / w, 0.5, 1.6);
  gl_PointSize = uPointScale * atten * (0.75 + 0.45 * aMask + 1.5 * aAccent);
}
`

const FRAG = /* glsl */ `
precision mediump float;

uniform vec3 uColorAccent;
uniform float uTime;
uniform float uTheme;

varying float vMask;
varying float vDepth;
varying float vAccent;

void main() {
  /*
   * Round the point sprite. Point sprites are square by default, which at this
   * density reads as a blocky halftone rather than a printed dot screen. The
   * core is a hard-ish disc with a soft shoulder, so the dot keeps a crisp edge
   * at small sizes without aliasing when it shrinks toward the far limb.
   */
  vec2 pc = gl_PointCoord - vec2(0.5);
  float r = length(pc) * 2.0;
  float disc = 1.0 - smoothstep(0.62, 1.0, r);
  if (disc <= 0.001) discard;

  // Points at the edge of the disc are the ones near the limb: fade them so the
  // sphere silhouette stays circular.
  float limb = smoothstep(0.0, 0.08, vDepth);

  // Depth: near points brighter, far points dimmed toward the background.
  // The floor stays high — the reference globe reads as luminous white
  // landmasses, not a dim dust field.
  float depthGain = 0.55 + 0.45 * vDepth;

  /*
   * Theme-aware ink. On the near-black ground the landmass is white and the sea
   * a faint dusting; on the cream ground those same values wash out completely,
   * so light mode inverts them to a dark ink. Without this the globe effectively
   * disappears when the light theme is active.
   */
  vec3 land = mix(vec3(1.0, 1.0, 1.0), vec3(0.10, 0.09, 0.11), uTheme);
  vec3 sea = mix(vec3(0.60, 0.65, 0.80), vec3(0.42, 0.40, 0.46), uTheme);

  vec3 col = mix(sea, land, vMask) * depthGain;
  // Land renders nearly solid; the sea is a whisper so the continents carry
  // the figure against the ground.
  float alpha = vMask * limb * (0.75 + 0.25 * vDepth)
              + (1.0 - vMask) * limb * 0.06 * vDepth;

  // A small number of accent nodes pulse in the site's pink. They are scattered
  // by attribute rather than derived from depth, so they stay sparse and evenly
  // distributed instead of pooling on the near face.
  if (vAccent > 0.5) {
    float pulse = 0.55 + 0.45 * sin(uTime * 2.0 + vAccent * 20.0);
    // Halo: a wider, soft falloff behind a solid core, so the node reads as a
    // glowing point rather than a coloured dot.
    float halo = 1.0 - smoothstep(0.0, 1.0, r);
    col = uColorAccent * mix(1.5 + pulse * 0.7, 0.75 + pulse * 0.35, uTheme);
    alpha = limb * mix(0.35, 1.0, halo) * (0.75 + 0.25 * pulse);
  }

  gl_FragColor = vec4(col, disc * alpha);
}
`

/** Ring / orbital pass — drawn as line strips around the same globe. */
const LINE_VERT = /* glsl */ `
attribute vec3 aPos;
attribute float aKind;   // 0 = limb ring, 1 = orbital
uniform mat4 uMVP;
varying float vKind;
varying float vDepth;
void main() {
  vec4 clip = uMVP * vec4(aPos, 1.0);
  gl_Position = clip;
  vDepth = clamp((clip.z / max(clip.w, 0.001)) * 0.5 + 0.5, 0.0, 1.0);
  vKind = aKind;
}
`

const LINE_FRAG = /* glsl */ `
precision mediump float;
uniform vec3 uColorLine;
uniform vec3 uColorAccent;
uniform float uTheme;
varying float vKind;
varying float vDepth;
void main() {
  // Kept faint: the rings are a frame of reference for the sphere, not a
  // competing graphic. The limb ring in particular must not out-read the dots.
  // Kind 2 is the pink arc sweeping over the top, like the reference's.
  float isArc = step(1.5, vKind);
  float a = mix(vKind > 0.5 ? 0.26 : 0.34, 0.55, isArc);
  // Orbits fade toward their far arc so they read as passing behind the globe.
  float depth = mix(0.25, 1.0, vDepth);
  vec3 col = mix(mix(uColorLine, uColorAccent, vKind * 0.45), uColorAccent, isArc);
  gl_FragColor = vec4(col, a * depth * mix(1.0, 0.55, uTheme));
}
`

/**
 * Small deterministic PRNG so the point cloud is identical on every mount.
 * The land mask does the visual work, so this only needs to be stable, not good.
 */
function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Sample a coarse land mask.
 *
 * Rather than shipping a coastline dataset, this synthesises continents from
 * overlapping spherical lobes. It is not geography — it is a land/water
 * distribution with the right amount of irregularity to read as a planet at
 * dot density. Lobes are kept small and numerous so coastlines stay ragged;
 * a few large lobes produce a single mushy blob instead.
 */
function landAt(lon: number, lat: number): number {
  const toRad = Math.PI / 180
  const y = lat * toRad
  const cosLat = Math.cos(y)
  const sinLat = Math.sin(y)

  let field = 0
  for (const [clon, clat, radius, weight] of LAND_LOBES) {
    const cLat = clat * toRad
    // Great-circle angular distance to the lobe centre.
    const cosD = sinLat * Math.sin(cLat) + cosLat * Math.cos(cLat) * Math.cos((clon - lon) * toRad)
    const ang = Math.acos(Math.max(-1, Math.min(1, cosD)))
    const f = 1 - ang / (radius * toRad)
    // Squared falloff keeps each lobe's core solid and its edge thin, so
    // overlapping lobes read as separate landmasses rather than a single mass.
    if (f > 0) field += weight * f * f
  }

  // Ridged noise on top, to chew the coastlines.
  const noise =
    Math.sin(lon * toRad * 2.7 + lat * toRad * 1.3) * 0.15 +
    Math.sin(lon * toRad * 5.9 - lat * toRad * 4.3) * 0.09 +
    Math.sin(lon * toRad * 11.3 + lat * toRad * 9.7) * 0.05 +
    Math.sin(lon * toRad * 19.1 - lat * toRad * 17.3) * 0.03

  return field + noise
}

/** [centre lon, centre lat, angular radius, weight] */
const LAND_LOBES: readonly (readonly [number, number, number, number])[] = [
  [-100, 48, 20, 1.0],
  [-112, 40, 16, 0.95],
  [-95, 25, 15, 0.9],
  [-80, 10, 14, 0.85],
  [-68, -12, 18, 0.95],
  [-60, -35, 14, 0.9],
  [-75, 8, 12, 0.8],
  [15, 12, 18, 1.0],
  [25, 30, 16, 0.9],
  [10, -5, 14, 0.85],
  [30, -25, 13, 0.85],
  [45, 48, 17, 0.9],
  [62, 30, 12, 0.8],
  [75, 22, 12, 0.75],
  [95, 20, 14, 0.8],
  [100, 42, 13, 0.8],
  [110, 30, 12, 0.75],
  [133, -22, 12, 0.8],
  [145, -28, 11, 0.75],
  [172, 60, 14, 0.7],
  [-160, 64, 13, 0.7],
  [-42, 70, 12, 0.65],
  [55, -30, 10, 0.6],
]

const POINT_COUNT = 18000
const GLOBE_RADIUS = 1
const RING_SEGMENTS = 180
const ORBIT_SEGMENTS = 200
/** Number of pink accent nodes scattered across the landmasses. */
const ACCENT_TARGET = 22

/** Backing-store resolution as a fraction of display size. */
const RENDER_SCALE = 0.65

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)
  if (!s) return null
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    // Surface the log: a silent failure here just falls back to the CSS orb,
    // which looks like "the WebGL is broken" rather than "the shader is wrong".
    console.warn(
      `[hero-visual] ${type === gl.VERTEX_SHADER ? 'vertex' : 'fragment'} shader failed:`,
      gl.getShaderInfoLog(s),
    )
    gl.deleteShader(s)
    return null
  }
  return s
}

function link(gl: WebGLRenderingContext, vsSrc: string, fsSrc: string) {
  const vs = compile(gl, gl.VERTEX_SHADER, vsSrc)
  const fs = compile(gl, gl.FRAGMENT_SHADER, fsSrc)
  if (!vs || !fs) return null
  const prog = gl.createProgram()
  if (!prog) return null
  gl.attachShader(prog, vs)
  gl.attachShader(prog, fs)
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn('[hero-visual] program link failed:', gl.getProgramInfoLog(prog))
    gl.deleteProgram(prog)
    return null
  }
  return { prog, vs, fs }
}

/** Minimal 4×4 column-major matrix helpers — no matrix library for four ops. */
type Mat4 = Float32Array

function mat4(): Mat4 {
  const m = new Float32Array(16)
  m[0] = m[5] = m[10] = m[15] = 1
  return m
}

function perspective(fovy: number, aspect: number, near: number, far: number): Mat4 {
  const f = 1 / Math.tan(fovy / 2)
  const nf = 1 / (near - far)
  const m = mat4()
  m[0] = f / aspect
  m[5] = f
  m[10] = (far + near) * nf
  m[11] = -1
  m[14] = 2 * far * near * nf
  return m
}

function multiply(a: Mat4, b: Mat4): Mat4 {
  const out = new Float32Array(16)
  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 4; r++) {
      out[c * 4 + r] =
        a[r]! * b[c * 4]! +
        a[4 + r]! * b[c * 4 + 1]! +
        a[8 + r]! * b[c * 4 + 2]! +
        a[12 + r]! * b[c * 4 + 3]!
    }
  }
  return out
}

function translation(x: number, y: number, z: number): Mat4 {
  const m = mat4()
  m[12] = x
  m[13] = y
  m[14] = z
  return m
}

function rotationX(a: number): Mat4 {
  const c = Math.cos(a)
  const s = Math.sin(a)
  const m = mat4()
  m[5] = c
  m[6] = s
  m[9] = -s
  m[10] = c
  return m
}

function rotationY(a: number): Mat4 {
  const c = Math.cos(a)
  const s = Math.sin(a)
  const m = mat4()
  m[0] = c
  m[2] = -s
  m[8] = s
  m[10] = c
  return m
}

function scale(s: number): Mat4 {
  const m = mat4()
  m[0] = m[5] = m[10] = s
  m[15] = 1
  return m
}

export function HeroVisual({ className }: { className?: string }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const wrapRef = React.useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  // Hydration-safe mounted flag: false on the server and during hydration, true
  // afterwards — so the canvas appears without a markup mismatch.
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
  const [glFailed, setGlFailed] = React.useState(false)

  React.useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!mounted || !canvas || !wrap) return
    if (reducedMotion) return // keep the CSS fallback

    const gl =
      (canvas.getContext('webgl', {
        antialias: false,
        alpha: true,
        premultipliedAlpha: false,
        depthTest: true,
        powerPreference: 'low-power',
      }) as WebGLRenderingContext | null) ?? null
    if (!gl) {
      setGlFailed(true)
      return
    }

    const points = link(gl, VERT, FRAG)
    const lines = link(gl, LINE_VERT, LINE_FRAG)
    if (!points || !lines) {
      setGlFailed(true)
      return
    }

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.enable(gl.DEPTH_TEST)

    // ---- Point cloud -------------------------------------------------------
    const random = mulberry32(0x5eed)
    const positions: number[] = []
    const masks: number[] = []
    const accents: number[] = []

    // Fibonacci sphere distribution, then rejection-sample against the land
    // mask so land points keep even coverage rather than clustering at the poles.
    const golden = Math.PI * (3 - Math.sqrt(5))
    let attempts = 0
    let placed = 0
    let accentsPlaced = 0
    while (placed < POINT_COUNT && attempts < POINT_COUNT * 16) {
      attempts++
      const i = attempts - 1
      const y = 1 - (i / POINT_COUNT) * 2
      const radius = Math.sqrt(Math.max(0, 1 - y * y))
      const theta = golden * i
      const x = Math.cos(theta) * radius
      const z = Math.sin(theta) * radius

      const lon = (Math.atan2(z, x) * 180) / Math.PI
      const lat = (Math.asin(Math.max(-1, Math.min(1, y))) * 180) / Math.PI

      const isLand = landAt(lon, lat) > 0.24
      // Keep the sea sparse so land reads as the figure and sea as ground.
      if (!isLand && random() > 0.15) continue

      // Roughly one accent node per 150 land points, capped, so the pink reads
      // as scattered signal rather than a second landmass.
      const isAccent = isLand && accentsPlaced < ACCENT_TARGET && random() < 0.004
      if (isAccent) accentsPlaced++

      positions.push(x * GLOBE_RADIUS, y * GLOBE_RADIUS, z * GLOBE_RADIUS)
      masks.push(isLand ? 1 : 0)
      accents.push(isAccent ? 1 + accentsPlaced * 0.37 : 0)
      placed++
    }

    const pointBuf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, pointBuf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

    const maskBuf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, maskBuf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(masks), gl.STATIC_DRAW)

    const accentBuf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, accentBuf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(accents), gl.STATIC_DRAW)

    // ---- Limb ring + orbital ellipses --------------------------------------
    const linePositions: number[] = []
    const lineKinds: number[] = []

    // Limb ring: a great circle in the XZ plane at a hair above the surface.
    for (let i = 0; i <= RING_SEGMENTS; i++) {
      const a = (i / RING_SEGMENTS) * Math.PI * 2
      linePositions.push(Math.cos(a) * 1.005, 0, Math.sin(a) * 1.005)
      lineKinds.push(0)
    }

    // Orbits: circles of varying radius and inclination, so they cross in front
    // of and behind the globe. The last one is the pink arc sweeping over the
    // top, like the reference's.
    const orbits: readonly (readonly [number, number, number, number, number])[] = [
      // [radius, x-tilt, z-tilt, y-offset, kind]
      [1.28, 0.42, 0.18, 0, 1],
      [1.44, -0.3, 0.55, 0.06, 1],
      [1.16, 0.9, -0.2, -0.04, 1],
      [1.66, 0.5, 0.12, 0.1, 2],
    ]
    const orbitOffsets: number[] = []
    for (const [r, tx, tz, yo, kind] of orbits) {
      const seg = ORBIT_SEGMENTS
      orbitOffsets.push(linePositions.length / 3)
      const cx = Math.cos(tx)
      const sx = Math.sin(tx)
      const cz = Math.cos(tz)
      const sz = Math.sin(tz)
      for (let i = 0; i <= seg; i++) {
        const a = (i / seg) * Math.PI * 2
        // Circle in the XY plane, then rotated about X then Z.
        const px = Math.cos(a) * r
        const py = Math.sin(a) * r
        const y1 = py * cx - px * sx
        const z1 = py * sx + px * cx
        const x2 = y1 * cz - z1 * sz
        const z2 = y1 * sz + z1 * cz
        linePositions.push(x2, y1 * 0 + yo, z2)
        lineKinds.push(kind)
      }
    }

    const lineBuf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, lineBuf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(linePositions), gl.STATIC_DRAW)

    const lineKindBuf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, lineKindBuf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lineKinds), gl.STATIC_DRAW)

    // ---- Uniform locations -------------------------------------------------
    // Uniform locations are nullable in the DOM typings; WebGL treats a null
    // location as a silent no-op for that uniform, so `!` here is safe and
    // keeps the draw loop readable.
    gl.useProgram(points.prog)
    const pMvp = gl.getUniformLocation(points.prog, 'uMVP')!
    const pScale = gl.getUniformLocation(points.prog, 'uPointScale')!
    const pTime = gl.getUniformLocation(points.prog, 'uTime')!
    const pTheme = gl.getUniformLocation(points.prog, 'uTheme')!
    const pAccent = gl.getUniformLocation(points.prog, 'uColorAccent')!

    gl.useProgram(lines.prog)
    const lMvp = gl.getUniformLocation(lines.prog, 'uMVP')!
    const lLine = gl.getUniformLocation(lines.prog, 'uColorLine')!
    const lAccent = gl.getUniformLocation(lines.prog, 'uColorAccent')!
    const lTheme = gl.getUniformLocation(lines.prog, 'uTheme')!

    const pPos = gl.getAttribLocation(points.prog, 'aPos')
    const pMask = gl.getAttribLocation(points.prog, 'aMask')
    const pAcc = gl.getAttribLocation(points.prog, 'aAccent')
    const lPos = gl.getAttribLocation(lines.prog, 'aPos')
    const lKind = gl.getAttribLocation(lines.prog, 'aKind')

    if (pPos < 0 || pMask < 0 || pAcc < 0 || lPos < 0 || lKind < 0) {
      setGlFailed(true)
      return
    }

    let raf = 0
    let running = true
    let pointerX = 0
    let pointerY = 0
    let easedX = 0
    let easedY = 0
    // 0 = dark ground, 1 = light ground. Drives the point and ring inks, which
    // must invert or the globe vanishes against the cream background.
    let theme = document.documentElement.classList.contains('light') ? 1 : 0
    const t0 = performance.now()

    const mo = new MutationObserver(() => {
      theme = document.documentElement.classList.contains('light') ? 1 : 0
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    const applySize = () => {
      const rect = wrap.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.max(2, Math.round(rect.width * dpr * RENDER_SCALE))
      const h = Math.max(2, Math.round(rect.height * dpr * RENDER_SCALE))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    applySize()
    const ro = new ResizeObserver(applySize)
    ro.observe(wrap)

    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = entry?.isIntersecting ?? true
        if (visible && !running) {
          running = true
          raf = requestAnimationFrame(draw)
        } else if (!visible && running) {
          running = false
          cancelAnimationFrame(raf)
        }
      },
      { threshold: 0 },
    )
    io.observe(wrap)

    const onMove = (event: PointerEvent) => {
      const r = wrap.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) return
      pointerX = ((event.clientX - r.left) / r.width - 0.5) * 2
      pointerY = ((event.clientY - r.top) / r.height - 0.5) * 2
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    const draw = () => {
      if (!running) return
      raf = requestAnimationFrame(draw)

      easedX += (pointerX - easedX) * 0.05
      easedY += (pointerY - easedY) * 0.05

      const t = (performance.now() - t0) / 1000
      const aspect = canvas.width / Math.max(canvas.height, 1)

      // Slow constant spin with a nod to the pointer.
      const spin = t * 0.16
      const tilt = -0.34 + easedY * 0.22

      let mvp = perspective(Math.PI / 5.2, aspect, 0.1, 100)
      mvp = multiply(mvp, translation(0, 0, -3.15))
      mvp = multiply(mvp, rotationX(tilt))
      mvp = multiply(mvp, rotationY(spin + easedX * 0.34))

      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

      // Lines first, with depth writes off so the ring never occludes points.
      gl.useProgram(lines.prog)
      gl.disable(gl.DEPTH_TEST)
      gl.bindBuffer(gl.ARRAY_BUFFER, lineBuf)
      gl.enableVertexAttribArray(lPos)
      gl.vertexAttribPointer(lPos, 3, gl.FLOAT, false, 0, 0)
      gl.bindBuffer(gl.ARRAY_BUFFER, lineKindBuf)
      gl.enableVertexAttribArray(lKind)
      gl.vertexAttribPointer(lKind, 1, gl.FLOAT, false, 0, 0)
      gl.uniformMatrix4fv(lMvp, false, mvp)
      gl.uniform3f(lLine, 0.9, 0.9, 0.95)
      gl.uniform3f(lAccent, 0.89, 0.06, 0.51)
      gl.uniform1f(lTheme, theme)

      // Limb ring, then each orbit from its own recorded offset. Offsets are
      // tracked explicitly rather than recomputed from `orbits[i]` because the
      // buffer layout must not silently drift if a loop segment count changes.
      gl.drawArrays(gl.LINE_STRIP, 0, RING_SEGMENTS + 1)
      for (const offset of orbitOffsets) {
        gl.drawArrays(gl.LINE_STRIP, offset, ORBIT_SEGMENTS + 1)
      }

      // Points.
      gl.useProgram(points.prog)
      gl.enable(gl.DEPTH_TEST)
      gl.bindBuffer(gl.ARRAY_BUFFER, pointBuf)
      gl.enableVertexAttribArray(pPos)
      gl.vertexAttribPointer(pPos, 3, gl.FLOAT, false, 0, 0)
      gl.bindBuffer(gl.ARRAY_BUFFER, maskBuf)
      gl.enableVertexAttribArray(pMask)
      gl.vertexAttribPointer(pMask, 1, gl.FLOAT, false, 0, 0)
      gl.bindBuffer(gl.ARRAY_BUFFER, accentBuf)
      gl.enableVertexAttribArray(pAcc)
      gl.vertexAttribPointer(pAcc, 1, gl.FLOAT, false, 0, 0)
      gl.uniformMatrix4fv(pMvp, false, mvp)
      gl.uniform1f(pTime, t)
      // Dot size in device pixels, derived from the backing-store height so the
      // halftone reads at the same visual density on any display.
      gl.uniform1f(pScale, canvas.height * 0.0042)
      gl.uniform3f(pAccent, 0.89, 0.06, 0.51)
      gl.uniform1f(pTheme, theme)
      gl.drawArrays(gl.POINTS, 0, placed)

      // Depth is only meaningful for the points; points are drawn unsorted, so
      // blending order is arbitrary within a dot — acceptable at this density
      // because dots rarely overlap.
      void scale
    }
    raf = requestAnimationFrame(draw)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      mo.disconnect()
      window.removeEventListener('pointermove', onMove)
      gl.deleteProgram(points.prog)
      gl.deleteProgram(lines.prog)
      gl.deleteShader(points.vs)
      gl.deleteShader(points.fs)
      gl.deleteShader(lines.vs)
      gl.deleteShader(lines.fs)
      if (pointBuf) gl.deleteBuffer(pointBuf)
      if (maskBuf) gl.deleteBuffer(maskBuf)
      if (accentBuf) gl.deleteBuffer(accentBuf)
      if (lineBuf) gl.deleteBuffer(lineBuf)
      if (lineKindBuf) gl.deleteBuffer(lineKindBuf)
    }
  }, [mounted, reducedMotion])

  return (
    <div
      ref={wrapRef}
      className={cn('pointer-events-none relative aspect-square w-full', className)}
      aria-hidden="true"
      data-hero-visual
    >
      {/*
        CSS fallback: a dotted sphere built from two radial gradients. Visible
        during SSR, before WebGL boots, and permanently when WebGL is unavailable
        or motion is reduced.
      */}
      <div
        className="absolute inset-0 rounded-full opacity-45"
        style={{
          backgroundImage:
            'radial-gradient(circle at 38% 32%, rgba(240,240,248,0.9) 0.6px, transparent 1px), radial-gradient(circle at 38% 32%, rgba(139,139,150,0.5) 0.6px, transparent 1px)',
          backgroundSize: '13px 13px, 19px 19px',
          backgroundPosition: '0 0, 6px 8px',
          maskImage: 'radial-gradient(circle, black 46%, transparent 68%)',
          WebkitMaskImage: 'radial-gradient(circle, black 46%, transparent 68%)',
        }}
      />
      <div className="absolute inset-[3%] rounded-full border border-border" />
      <div className="absolute inset-[3%] rotate-[24deg] rounded-[50%] border border-border/60" />

      {mounted && !reducedMotion && !glFailed ? (
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      ) : null}
    </div>
  )
}
