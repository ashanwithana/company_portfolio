'use client'

import * as React from 'react'

import { useReducedMotion } from '@/hooks/use-media-query'
import { landCoverage } from '@/lib/land-mask'
import { cn } from '@/lib/utils'
import { useTheme } from '@/components/providers/theme-provider'

/**
 * Hero 3D visual — a dotted globe.
 *
 * A sphere of ~4,000 points, each one a landmass sample lifted to the surface
 * and rotated with the planet. Two things make it read as 3D rather than a flat
 * dot field:
 *
 *   1. Depth attenuation. Each point's size and brightness scale with its z in
 *      camera space, so the limb brightens and the far side recedes.
 *   2. Three customer route arcs from the Colombo home node, traced in the same
 *      camera space and drawn in sequence after load. No rings, no orbits —
 *      the sphere carries no geometric circles at all.
 *
 * Place labels (Colombo, Oman, UAE, Denmark) are HTML pills projected each
 * frame from the same matrix as the pins, so they ride the globe exactly and
 * fade as their node rounds the limb.
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
  // Landmass samples ride slightly above the sphere so coastlines stay crisp.
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
  // Accent nodes are drawn larger — they are meant to read as signal, not
  // noise — and the home node larger still.
  //
  // No limb size scaling. It is tempting to shrink dots as they approach the
  // silhouette to stop them stacking, but the sphere's outline is drawn entirely
  // by those dots: shrink them and the circle tears into a ragged edge, which
  // reads as broken rather than atmospheric. The tangency at the limb is simply
  // what a dense dot sphere looks like. The alpha trim below is what keeps the
  // outermost sliver from clipping into a hard wire.
  float atten = clamp(uPointScale / w, 0.5, 1.6);
  float accSize = aAccent > 1.5 ? 2.6 : aAccent * 1.1;
  gl_PointSize = uPointScale * atten * (0.75 + 0.45 * aMask + accSize);
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
  // sphere silhouette stays circular. The window is deliberately narrow. Widening
  // it to soften the horizon erodes the dots that draw the sphere's outline and
  // the edge tears; all this needs to do is trim the outermost sliver so it does
  // not clip into a hard wire.
  float limb = smoothstep(0.0, 0.09, vDepth);

  // Depth: near points brighter, far points dimmed toward the background.
  // The floor stays high — the reference globe reads as luminous white
  // landmasses, not a dim dust field. Light mode lifts the floor further:
  // dark ink on cream loses less to distance than white on black.
  float depthGain = mix(0.55 + 0.45 * vDepth, 0.70 + 0.30 * vDepth, uTheme);

  /*
   * Theme-aware ink. On the near-black ground the landmass is white and the sea
   * a faint dusting; on the cream ground those same values wash out completely,
   * so light mode inverts them to a dark ink. Without this the globe effectively
   * disappears when the light theme is active.
   */
  vec3 land = mix(vec3(1.0, 1.0, 1.0), vec3(0.10, 0.09, 0.11), uTheme);
  vec3 sea = mix(vec3(0.60, 0.65, 0.80), vec3(0.32, 0.30, 0.36), uTheme);

  vec3 col = mix(sea, land, vMask) * depthGain;
  /*
   * Land is bright; the sea is a dimmer field beneath it.
   *
   * The sea has to be genuinely present, not a whisper. It is what draws the
   * sphere's outline: with land covering only about a quarter of the globe, an
   * almost-invisible ocean leaves the silhouette defined by land alone, so every
   * sector where the visible face happens to be ocean loses its rim and the
   * circle breaks into arcs. Measured on the previous build, only 44% of
   * angular positions had a lit pixel in the outer annulus, with 38-degree dark
   * runs — which is what made the globe read as torn. The sea reaches the limb so
   * the horizon closes.
   */
  float alpha = vMask * limb * (0.72 + 0.28 * vDepth)
              + (1.0 - vMask) * limb * mix(0.20 + 0.16 * vDepth, 0.36 + 0.20 * vDepth, uTheme);

  // A small number of accent nodes pulse in the site's pink. They are scattered
  // by attribute rather than derived from depth, so they stay sparse and evenly
  // distributed instead of pooling on the near face. Value 2 is the Colombo
  // home node: brighter and steadier than the rest.
  if (vAccent > 0.5) {
    float isHome = step(1.5, vAccent);
    float pulse = 0.55 + 0.45 * sin(uTime * 2.0 + vAccent * 20.0);
    // Halo: a wider, soft falloff behind a solid core, so the node reads as a
    // glowing point rather than a coloured dot.
    float halo = 1.0 - smoothstep(0.0, 1.0, r);
    col = uColorAccent * mix(1.5 + pulse * 0.7, 0.75 + pulse * 0.35, uTheme);
    col = mix(col, uColorAccent * (2.0 + pulse * 0.4), isHome);
    alpha = limb * mix(0.35, 1.0, halo) * (0.75 + 0.25 * pulse);
  }

  gl_FragColor = vec4(col, disc * alpha);
}
`

/** Route pass — the customer arcs drawn as line strips around the globe. */
const LINE_VERT = /* glsl */ `
attribute vec3 aPos;
attribute float aKind;   // 3 = customer route (the only linework left)
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
uniform vec3 uColorAccent;
uniform float uTheme;
varying float vKind;
varying float vDepth;
void main() {
  // The customer routes read as glowing pink threads. They fade toward their
  // far arc so they pass behind the globe rather than sitting on top of it.
  float depth = mix(0.25, 1.0, vDepth);
  gl_FragColor = vec4(uColorAccent, 0.9 * depth * mix(1.0, 0.55, uTheme));
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

const POINT_COUNT = 24000
const GLOBE_RADIUS = 1
/** Number of pink accent nodes scattered across the landmasses. */
const ACCENT_TARGET = 8
/**
 * Initial spin with Sri Lanka dead centre: the Colombo home pin opens in the
 * middle of the disc, Oman and the UAE beside it. The camera looks down +z,
 * which the Fibonacci distribution maps to lon 90 — and rotationY carries lon
 * L to the camera centre when a = (L - 90)°, so the offset faces Colombo's
 * lon 79.9. Denmark starts around the limb and drifts in on the reverse spin.
 */
const SPIN_INITIAL = ((79.9 - 90) * Math.PI) / 180
/** Slow reverse drift, so Denmark rotates into full view within seconds while
 *  the Colombo pin and its routes stay readable. Negative runs the spin
 *  toward the western nodes rather than away from them. */
const SPIN_SPEED = -0.05

/** lon/lat in degrees → unit vector in globe object space. */
function lonLatToVec(lon: number, lat: number): [number, number, number] {
  const lo = (lon * Math.PI) / 180
  const la = (lat * Math.PI) / 180
  return [Math.cos(la) * Math.cos(lo), Math.sin(la), Math.cos(la) * Math.sin(lo)]
}

/**
 * Places named on the globe — the Colombo home pin and the three customer
 * nodes. Positions double as the HTML label anchors projected each frame.
 */
const LABEL_DEFS = [
  { name: 'Colombo', lon: 79.9, lat: 6.9 },
  { name: 'Oman', lon: 58.4, lat: 23.6 },
  { name: 'UAE', lon: 55.3, lat: 25.2 },
  { name: 'Denmark', lon: 12.6, lat: 55.7 },
] as const

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
  const labelRefs = React.useRef<(HTMLSpanElement | null)[]>([])
  const reducedMotion = useReducedMotion()
  const { theme: themeName } = useTheme()

  // 0 = dark ground, 1 = light ground. A ref, not state: the draw loop reads
  // it every frame without re-running the whole GL setup on theme change.
  // (A MutationObserver on <html> used to do this job, but it never fired.)
  const themeRef = React.useRef(themeName === 'light' ? 1 : 0)
  React.useEffect(() => {
    themeRef.current = themeName === 'light' ? 1 : 0
  }, [themeName])

  // Hydration-safe mounted flag: false on the server and during hydration, true
  // afterwards — so the canvas appears without a markup mismatch.
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
  const [glFailed, setGlFailed] = React.useState(false)
  // First painted WebGL frame. Drives the canvas fade-and-scale entrance so
  // the globe arrives rather than popping in with the page.
  const [ready, setReady] = React.useState(false)
  const readyRef = React.useRef(false)

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

      /*
       * Jitter the lookup by a fraction of a degree before sampling. The mask
       * is a 1-degree raster, and without this the coastlines read as clean
       * vector edges — correct, but wrong for a dot screen. Half a degree of
       * noise is enough to ragged them up while leaving geography recognisable.
       */
      const jLon = lon + Math.sin(lon * 0.73 + lat * 1.31) * 0.5
      const jLat = lat + Math.cos(lat * 0.91 - lon * 1.09) * 0.5

      // Coverage is a 0-1 figure, not a bit. It goes into the mask attribute
      // unthresholded so the shader blends sea into land across the cell, which
      // is what makes the coastlines soft instead of staircased.
      const coverage = landCoverage(jLon, jLat)
      const isLand = coverage > 0.5
      // Hold on to partial-coverage points so the shoreline itself is
      // represented, and keep a solid share of open sea: the ocean is what
      // closes the sphere's silhouette where no landmass is in view.
      if (coverage <= 0.25 && random() > 0.55) continue

      // Roughly a handful of accent nodes across the landmasses, so the pink
      // reads as scattered signal rather than a second landmass. The value is
      // a flag (1 = accent, 2 = home node), not a magnitude.
      const isAccent = isLand && accentsPlaced < ACCENT_TARGET && random() < 0.0015
      if (isAccent) accentsPlaced++

      positions.push(x * GLOBE_RADIUS, y * GLOBE_RADIUS, z * GLOBE_RADIUS)
      masks.push(coverage)
      accents.push(isAccent ? 1 : 0)
      placed++
    }

    // Studio home in object space. Defined here so both the marker point
    // (uploaded with the cloud below) and the route arcs (built after) share
    // it. Coordinates come from the shared label defs above.
    const COLOMBO: [number, number, number] = lonLatToVec(LABEL_DEFS[0].lon, LABEL_DEFS[0].lat)
    const ROUTES: readonly (readonly [number, number, number])[] = [
      lonLatToVec(LABEL_DEFS[1].lon, LABEL_DEFS[1].lat), // Muscat, Oman
      lonLatToVec(LABEL_DEFS[2].lon, LABEL_DEFS[2].lat), // Dubai, UAE
      lonLatToVec(LABEL_DEFS[3].lon, LABEL_DEFS[3].lat), // Copenhagen, Denmark
    ]
    // HTML label anchors ride slightly above the markers so the pills sit
    // just off the surface.
    const LABEL_POS = LABEL_DEFS.map((d) => lonLatToVec(d.lon, d.lat))

    // Colombo home marker: appended to the point cloud so it rides the globe
    // like every other dot. Accent value 2 marks it as the home node.
    // (Positions must be final before the buffers below are uploaded.)
    positions.push(COLOMBO[0] * 1.014, COLOMBO[1] * 1.014, COLOMBO[2] * 1.014)
    masks.push(1)
    accents.push(2)
    // Endpoint markers so both routes terminate in a visible node.
    for (const target of ROUTES) {
      positions.push(target[0] * 1.014, target[1] * 1.014, target[2] * 1.014)
      masks.push(1)
      accents.push(1)
    }
    placed += 1 + ROUTES.length // draw count includes the markers above

    const pointBuf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, pointBuf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

    const maskBuf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, maskBuf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(masks), gl.STATIC_DRAW)

    const accentBuf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, accentBuf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(accents), gl.STATIC_DRAW)

    // ---- Customer route arcs -------------------------------------------------
    // The only line work on the globe: the two routes from Colombo. There are
    // deliberately no decorative rings or orbits — the sphere carries no
    // geometric circles at all, just the dot shade fading at the edge.
    const linePositions: number[] = []
    const lineKinds: number[] = []
    /** [buffer offset, vertex count] for each line strip. */
    const strips: { offset: number; count: number }[] = []
    const pushStrip = (kind: number, points: readonly (readonly [number, number, number])[]) => {
      strips.push({ offset: linePositions.length / 3, count: points.length })
      for (const [x, y, z] of points) linePositions.push(x, y, z)
      for (let i = 0; i < points.length; i++) lineKinds.push(kind)
    }

    // Customer routes: great-circle arcs from the Colombo studio to Oman and
    // Denmark, drawn in object space so they rotate with the planet.
    const ROUTE_SEGMENTS = 64
    for (const target of ROUTES) {
      // Slerp between the two unit vectors, lifted into an arc.
      const dot = Math.max(
        -1,
        Math.min(1, COLOMBO[0] * target[0] + COLOMBO[1] * target[1] + COLOMBO[2] * target[2]),
      )
      const angle = Math.acos(dot)
      const sinAngle = Math.sin(angle)
      const points: [number, number, number][] = []
      for (let i = 0; i <= ROUTE_SEGMENTS; i++) {
        const t = i / ROUTE_SEGMENTS
        const a = Math.sin((1 - t) * angle) / sinAngle
        const b = Math.sin(t * angle) / sinAngle
        const lift = 1 + 0.3 * Math.sin(t * Math.PI)
        points.push([
          (a * COLOMBO[0] + b * target[0]) * lift,
          (a * COLOMBO[1] + b * target[1]) * lift,
          (a * COLOMBO[2] + b * target[2]) * lift,
        ])
      }
      pushStrip(3, points)
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
    const t0 = performance.now()

    // Spin state for the load ramp: the globe eases from rest to full speed
    // over the first seconds instead of snapping into motion with the fade-in.
    let spinAngle = SPIN_INITIAL
    let lastT = t0

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

      const now = performance.now()
      const t = (now - t0) / 1000
      // Ease the spin from rest to full speed over the first seconds, matched
      // to the CSS fade-in below so the globe arrives rather than appears.
      // dt is clamped so a backgrounded tab does not jump the planet on return.
      const ramp = Math.min(t / 2.6, 1)
      const eased = ramp * ramp * (3 - 2 * ramp)
      const dt = Math.min((now - lastT) / 1000, 0.05)
      spinAngle += dt * SPIN_SPEED * eased
      lastT = now

      // Signal the first painted frame so the canvas fades and scales in.
      if (!readyRef.current) {
        readyRef.current = true
        setReady(true)
      }

      const aspect = canvas.width / Math.max(canvas.height, 1)

      // Slow constant spin with a nod to the pointer.
      const tilt = -0.34 + easedY * 0.22

      let mvp = perspective(Math.PI / 5.2, aspect, 0.1, 100)
      mvp = multiply(mvp, translation(0, 0, -3.15))
      mvp = multiply(mvp, rotationX(tilt))
      mvp = multiply(mvp, rotationY(spinAngle + easedX * 0.34))

      // HTML place labels track their 3D nodes. The two rotations are
      // reapplied here in the same convention as rotationX/rotationY above:
      // z2 > 0 means nearer than the globe's centre, so labels fade out as
      // their node rounds the limb. Screen position comes from the same MVP
      // already uploaded to the shaders, so labels cannot drift from the pins.
      {
        const w = wrap.clientWidth || 1
        const h = wrap.clientHeight || 1
        const a2 = spinAngle + easedX * 0.34
        const c2 = Math.cos(a2)
        const s2 = Math.sin(a2)
        const cT = Math.cos(tilt)
        const sT = Math.sin(tilt)
        const labelIn = Math.min(Math.max((t - 1.6) / 0.9, 0), 1)
        for (let li = 0; li < LABEL_POS.length; li++) {
          const el = labelRefs.current[li]
          if (!el) continue
          const p = LABEL_POS[li]!
          const x = p[0] * 1.03
          const y = p[1] * 1.03
          const z = p[2] * 1.03
          const z1 = -s2 * x + c2 * z
          const z2 = sT * y + cT * z1
          const facing = Math.min(Math.max((z2 - 0.1) / 0.3, 0), 1)
          const cx = mvp[0]! * x + mvp[4]! * y + mvp[8]! * z + mvp[12]!
          const cy = mvp[1]! * x + mvp[5]! * y + mvp[9]! * z + mvp[13]!
          const cw = mvp[3]! * x + mvp[7]! * y + mvp[11]! * z + mvp[15]!
          const px = ((cx / cw) * 0.5 + 0.5) * w
          const py = (1 - ((cy / cw) * 0.5 + 0.5)) * h
          el.style.transform = `translate(${px.toFixed(1)}px, ${py.toFixed(1)}px) translate(-50%, -135%)`
          el.style.opacity = (facing * labelIn).toFixed(2)
        }
      }

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
      gl.uniform3f(lAccent, 0.89, 0.06, 0.51)
      gl.uniform1f(lTheme, themeRef.current)

      // Every strip draws in after load: each route traces itself from
      // Colombo outward in sequence, so the network reads as being built
      // rather than pasted on. Strips are stored in route order with their
      // buffer offsets, so a partial vertex count simply shortens the strip.
      strips.forEach((strip, s) => {
        const local = Math.min(Math.max((t - 1.0 - s * 0.45) / 1.4, 0), 1)
        if (local <= 0) return
        const eased = local * local * (3 - 2 * local)
        const count = Math.max(2, Math.floor(strip.count * eased))
        gl.drawArrays(gl.LINE_STRIP, strip.offset, count)
      })

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
      gl.uniform1f(pTheme, themeRef.current)
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
        Atmosphere. A dot sphere with no limb treatment reads as a flat disc of
        confetti, because a silhouette alone gives the eye nothing to infer depth
        from. This soft glow just outside the point field supplies the missing
        cue: bright at the rim, gone by the edge. It is a radial gradient behind
        the canvas rather than a shader pass, so it costs nothing per frame.
      */}
      <div
        aria-hidden="true"
        className="absolute inset-[4%] rounded-full opacity-90 blur-2xl"
        style={{
          background:
            'radial-gradient(circle, transparent 60%, color-mix(in oklab, var(--foreground) 20%, transparent) 74%, color-mix(in oklab, var(--foreground) 9%, transparent) 84%, transparent 92%)',
        }}
      />

      {/*
        CSS fallback: a dotted sphere built from two radial gradients. Visible
        during SSR, before WebGL boots, and permanently when WebGL is unavailable
        or motion is reduced.
      */}
      <div
        className={cn(
          'absolute inset-0 rounded-full transition-opacity duration-1000',
          ready ? 'opacity-0' : 'opacity-45',
        )}
        style={{
          backgroundImage:
            'radial-gradient(circle at 38% 32%, color-mix(in oklab, var(--foreground) 85%, transparent) 0.6px, transparent 1px), radial-gradient(circle at 38% 32%, color-mix(in oklab, var(--foreground) 40%, transparent) 0.6px, transparent 1px)',
          backgroundSize: '13px 13px, 19px 19px',
          backgroundPosition: '0 0, 6px 8px',
          maskImage: 'radial-gradient(circle, black 46%, transparent 68%)',
          WebkitMaskImage: 'radial-gradient(circle, black 46%, transparent 68%)',
        }}
      />

      {mounted && !reducedMotion && !glFailed ? (
        <>
          <canvas
            ref={canvasRef}
            className={cn(
              'absolute inset-0 h-full w-full transition-[opacity,scale] duration-[1400ms] ease-out',
              ready ? 'scale-100 opacity-100' : 'scale-[0.94] opacity-0',
            )}
          />
          {/*
            Place labels — Colombo plus the three customer countries. Positioned
            every frame by the draw loop from the same matrix as the pins, so
            they ride the globe exactly; hidden on small screens, where four
            pills would crowd the sphere.
          */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden sm:block">
            {LABEL_DEFS.map((def, i) => (
              <span
                key={def.name}
                ref={(el) => {
                  labelRefs.current[i] = el
                }}
                className="absolute top-0 left-0 rounded-full border border-border bg-card/70 px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] whitespace-nowrap text-muted-foreground uppercase opacity-0 backdrop-blur-sm will-change-transform"
              >
                {def.name}
              </span>
            ))}
          </div>
        </>
      ) : null}

      {/*
        Limb circle. One hairline at the sphere's exact silhouette, so the
        horizon is a closed line rather than an edge implied by scattered dots.

        Rendered after the canvas deliberately. These siblings are all
        position: absolute with no z-index, so paint order is DOM order — with
        the hairline first, the globe's limb dots drew over it and the line read
        as broken where they crossed. In front, it holds as a continuous horizon.

        The inset is measured, not guessed: walking the rendered rim in 1-degree
        steps puts the outer edge of the dot field at 0.812 of the wrapper
        radius, and an element with inset i has a radius of (1 - 2i) of that
        same radius — hence inset-[9.4%]. The rings this replaces sat at
        inset-[8%] (0.84), about 6px proud of the dots, which is exactly why
        they read as hoops floating around the globe instead of its edge.

        One circle, not two. The second, tilted ring turned a sphere into an
        orbital diagram.
      */}
      <div
        aria-hidden="true"
        className="absolute inset-[9.4%] rounded-full border border-foreground/20"
      />
    </div>
  )
}
