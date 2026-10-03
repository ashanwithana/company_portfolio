'use client'

import * as React from 'react'

import { useReducedMotion } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'

/**
 * Hero 3D visual — a liquid-chrome orb in a studio environment.
 *
 * A ray-sphere intersection (analytic, no marching) shaded as polished metal:
 * the surface reflects a procedural studio (key softbox, mint strip, floor
 * bounce) while a slowly rotating normal perturbation makes highlights crawl
 * like mercury. One sharp sun glint plus a fresnel rim sell the material.
 * The pointer drifts the camera; the lights stay fixed like a real studio.
 *
 * Performance budget: one analytic intersection per pixel, six 3-octave noise
 * calls only on the surface, backdrop at reduced rate. Canvas is backed at 60%
 * of display resolution (upscaled by CSS — chrome hides the softness). One rAF
 * loop, paused off-screen, static CSS fallback for reduced motion.
 */

const FRAG = /* glsl */ `
precision mediump float;

uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;   // -1..1, eased
uniform float uTheme;    // 0 = dark, 1 = light

mat3 rotY(float a) {
  float c = cos(a), s = sin(a);
  return mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c);
}

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float hash1(float n) {
  return fract(sin(n * 127.1) * 43758.5453);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 3; i++) {
    v += a * vnoise(p);
    p = p * 2.03 + vec2(17.3, 9.1);
    a *= 0.5;
  }
  return v;
}

// Procedural studio environment: dark room, one big soft key, one mint strip,
// faint floor bounce. What the chrome reflects.
vec3 studioEnv(vec3 d, float theme) {
  vec3 room = mix(
    mix(vec3(0.030, 0.035, 0.090), vec3(0.090, 0.050, 0.190), d.y * 0.5 + 0.5),
    mix(vec3(0.930, 0.910, 0.870), vec3(0.780, 0.760, 0.830), d.y * 0.5 + 0.5),
    theme);
  vec3 col = room;
  vec3 key = normalize(vec3(-0.5, 0.7, 0.4));
  vec3 keyCol = mix(vec3(0.90, 0.80, 1.00), vec3(1.00, 0.98, 0.95), theme);
  col += keyCol * pow(max(dot(d, key), 0.0), 18.0) * 1.4;
  vec3 strip = normalize(vec3(0.9, 0.1, 0.2));
  vec3 stripCol = mix(vec3(0.20, 0.90, 0.65), vec3(0.35, 0.55, 1.00), theme);
  col += stripCol * pow(max(dot(d, strip), 0.0), 36.0) * 1.0;
  col += mix(vec3(0.150, 0.100, 0.250), vec3(0.550, 0.520, 0.580), theme)
    * pow(max(dot(d, vec3(0.0, -1.0, 0.2)), 0.0), 3.0);
  return col;
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = (frag * 2.0 - uRes) / min(uRes.x, uRes.y);
  float t = uTime;

  // Camera follows the pointer; the lights stay fixed like a real studio.
  vec3 ro = vec3(uv.x * 0.25 + uPointer.x * 0.28, uv.y * 0.25 + uPointer.y * 0.22, 2.9);
  vec3 rd = normalize(vec3(uv.x * 0.55, uv.y * 0.55, -1.0));

  // Backdrop: dim aurora wash plus a few faint dust motes for depth.
  vec2 bp = uv + uPointer * 0.06;
  float warp = fbm(bp * 1.3 + vec2(t * 0.04, -t * 0.03));
  float bands = fbm(vec2(bp.x * 1.1 + warp * 1.5, bp.y * 1.5 - t * 0.05));
  bands = smoothstep(0.30, 0.85, bands);
  float br = length(bp);
  vec3 bgDeep = mix(vec3(0.030, 0.045, 0.110), vec3(0.960, 0.940, 0.900), uTheme);
  vec3 bgGlow = mix(vec3(0.200, 0.140, 0.520), vec3(0.940, 0.620, 0.420), uTheme);
  vec3 bg = mix(bgDeep, bgGlow, clamp(bands * 0.55 + br * 0.12, 0.0, 1.0) * 0.55);

  float dust = 0.0;
  for (int i = 0; i < 10; i++) {
    float fi = float(i);
    vec2 sp = vec2(hash1(fi * 3.7 + 1.0) - 0.5, hash1(fi * 7.9 + 4.0) - 0.5) * 2.4;
    sp.x += sin(t * 0.10 + fi * 2.0) * 0.08;
    sp.y += cos(t * 0.08 + fi * 1.3) * 0.08;
    float d = length(uv - sp);
    dust += exp(-d * d * 2600.0) * (0.35 + 0.30 * sin(t * 1.4 + fi * 3.1));
  }
  bg += vec3(0.75, 0.80, 1.00) * dust * 0.10;

  // Chrome orb: analytic ray-sphere intersection, gently bobbing.
  vec3 centre = vec3(0.0, 0.045 * sin(t * 0.5), 0.0);
  float radius = 1.0;
  vec3 oc = ro - centre;
  float b = dot(oc, rd);
  float c = dot(oc, oc) - radius * radius;
  float h = b * b - c;

  vec3 col = bg;
  if (h > 0.0) {
    float dist = -b - sqrt(h);
    vec3 p = ro + rd * dist;
    vec3 n0 = (p - centre) / radius;

    // Liquid-metal surface: object-space pattern rotates slowly while the
    // studio lights stay fixed, so highlights crawl like mercury.
    vec3 pw = rotY(t * 0.12) * p;
    vec3 wob = vec3(
      sin(pw.y * 3.1 + t * 0.9) + 0.5 * sin(pw.z * 5.3 - t * 0.7),
      sin(pw.z * 3.7 + t * 1.1) + 0.5 * sin(pw.x * 4.7 + t * 0.8),
      sin(pw.x * 4.3 - t * 1.0) + 0.5 * sin(pw.y * 5.9 + t * 0.6));
    vec3 large = vec3(
      fbm(pw.xy * 1.4 + t * 0.06) - 0.5,
      fbm(pw.yz * 1.4 - t * 0.05) - 0.5,
      fbm(pw.zx * 1.4 + t * 0.04) - 0.5);
    vec3 n = normalize(n0 + wob * 0.085 + large * 0.10);

    vec3 view = -rd;
    vec3 refl = reflect(-view, n);
    float fres = pow(1.0 - max(dot(n, view), 0.0), 3.0);

    vec3 keyDir = normalize(vec3(-0.6, 0.9, 0.6));
    float key = max(dot(n, keyDir), 0.0);
    vec3 baseTint = mix(vec3(0.30, 0.20, 0.62), vec3(0.62, 0.60, 0.66), uTheme);

    vec3 chrome = studioEnv(refl, uTheme) * 0.90;
    chrome += baseTint * key * 0.18;
    // Dim violet fill so the shadow side holds shape instead of going black.
    vec3 fillDir = normalize(vec3(0.7, -0.3, 0.6));
    chrome += baseTint * max(dot(n, fillDir), 0.0) * 0.22;
    chrome += baseTint * 0.045;
    // Sharp sun glint.
    vec3 sunDir = normalize(vec3(-0.5, 0.75, 0.55));
    chrome += vec3(1.0) * pow(max(dot(refl, sunDir), 0.0), 600.0) * 2.2;
    // Mint rim light.
    vec3 rimCol = mix(vec3(0.20, 0.90, 0.62), vec3(0.30, 0.55, 1.00), uTheme);
    chrome += rimCol * fres * 0.85;

    // Soft contact darkening where the orb meets the backdrop glow.
    float edge = smoothstep(0.0, 0.12, dot(n, view));
    chrome *= mix(0.55, 1.0, edge);

    col = mix(bg, chrome, 0.985);
  }

  // Vignette + dither to kill banding.
  col *= 1.0 - 0.30 * dot(uv * 0.62, uv * 0.62);
  float g = fract(sin(dot(frag, vec2(12.9898, 78.233))) * 43758.5453);
  col += (g - 0.5) * 0.014;

  gl_FragColor = vec4(col, 1.0);
}
`

const VERT = /* glsl */ `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`

/**
 * Backing-store resolution as a fraction of display size. The visual is all
 * soft glow, so 60% resolves identically once upscaled — and it keeps the
 * per-pixel loop affordable on integrated GPUs.
 */
const RENDER_SCALE = 0.6

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)
  if (!s) return null
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    gl.deleteShader(s)
    return null
  }
  return s
}

export function HeroVisual({ className }: { className?: string }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const wrapRef = React.useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  // Hydration-safe mounted flag: false on the server and during hydration,
  // true afterwards — so the canvas appears without a markup mismatch.
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
        alpha: false,
        powerPreference: 'low-power',
      }) as WebGLRenderingContext | null) ?? null
    if (!gl) {
      setGlFailed(true)
      return
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) {
      setGlFailed(true)
      return
    }
    const prog = gl.createProgram()
    if (!prog) {
      setGlFailed(true)
      return
    }
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setGlFailed(true)
      return
    }
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'aPos')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, 'uRes')
    const uTime = gl.getUniformLocation(prog, 'uTime')
    const uPointer = gl.getUniformLocation(prog, 'uPointer')
    const uTheme = gl.getUniformLocation(prog, 'uTheme')

    let raf = 0
    let running = true
    let px = 0
    let py = 0
    let tpx = 0
    let tpy = 0
    let theme = document.documentElement.classList.contains('light') ? 1 : 0
    const t0 = performance.now()

    const applySize = () => {
      const rect = wrap.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
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

    const mo = new MutationObserver(() => {
      theme = document.documentElement.classList.contains('light') ? 1 : 0
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) return
      tpx = ((e.clientX - r.left) / r.width - 0.5) * 2
      tpy = -((e.clientY - r.top) / r.height - 0.5) * 2
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    const draw = () => {
      if (!running) return
      raf = requestAnimationFrame(draw)
      px += (tpx - px) * 0.06
      py += (tpy - py) * 0.06
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, (performance.now() - t0) / 1000)
      gl.uniform2f(uPointer, px, py)
      gl.uniform1f(uTheme, theme)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      mo.disconnect()
      window.removeEventListener('pointermove', onMove)
      gl.deleteProgram(prog)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      if (buf) gl.deleteBuffer(buf)
    }
  }, [mounted, reducedMotion])

  return (
    <div
      ref={wrapRef}
      // Rounded + radially masked so the opaque WebGL canvas reads as an orb
      // rather than a rectangle sitting over the grid backdrop.
      className={cn(
        'overflow-hidden rounded-full [mask-image:radial-gradient(circle,black_58%,transparent_71%)]',
        className,
      )}
      aria-hidden="true"
      data-hero-visual
    >
      {/* CSS aurora fallback: visible during SSR, before WebGL boots,
          permanently when WebGL is unavailable or motion is reduced. */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,var(--primary)_0%,transparent_55%),radial-gradient(circle_at_70%_65%,var(--mint)_0%,transparent_50%),radial-gradient(circle_at_55%_45%,var(--coral)_0%,transparent_45%)] opacity-40 blur-2xl" />
      <div className="absolute inset-[12%] rounded-full border border-foreground/15" />
      <div className="absolute inset-[24%] rounded-full border border-foreground/10" />
      <div className="absolute inset-[36%] rounded-full bg-foreground/[0.04] blur-sm" />

      {mounted && !reducedMotion && !glFailed ? (
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      ) : null}
    </div>
  )
}
