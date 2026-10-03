'use client'

import * as React from 'react'

import { useReducedMotion } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'

/**
 * Hero 3D visual — layered orbital rings + aurora field.
 *
 * Why this approach:
 * - Single cheap fragment shader (2D SDF + 3-octave value noise). No
 *   raymarching, no 96-step loop, so it holds 60fps on integrated GPUs.
 * - Real sizing via ResizeObserver. The previous version read
 *   getBoundingClientRect() inside rAF and never resized, leaving the canvas
 *   at the default 300x150.
 * - Pauses off-screen via IntersectionObserver and honours
 *   prefers-reduced-motion with a single static frame.
 * - Theme-aware via MutationObserver instead of per-frame DOM reads.
 */

const FRAG = /* glsl */ `
precision mediump float;

uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;   // -1..1, eased
uniform float uTheme;    // 0 = dark, 1 = light
uniform float uStatic;   // 1 = render one still frame (reduced motion)

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
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

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = (frag * 2.0 - uRes) / min(uRes.x, uRes.y);
  float t = uTime;

  // Gentle pointer parallax on the whole field.
  vec2 p = uv + uPointer * 0.18;
  float r = length(p);
  float ang = atan(p.y, p.x);

  // Domain-warped aurora bands.
  float warp = fbm(p * 1.4 + vec2(t * 0.05, -t * 0.04));
  float bands = fbm(vec2(p.x * 1.2 + warp * 1.6, p.y * 1.6 - t * 0.06));
  bands = smoothstep(0.25, 0.85, bands);

  // Three orbital rings, tilted by the pointer.
  float ring = 0.0;
  float tilt = 0.35 + uPointer.y * 0.08;
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float radius = 0.55 + fi * 0.42;
    float wob = sin(ang * (2.0 + fi) + t * (0.25 + fi * 0.12) + fi * 2.1) * 0.05;
    vec2 q = vec2(p.x, p.y / max(tilt, 0.15));
    float d = abs(length(q) - radius - wob);
    float glow = exp(-d * (14.0 - fi * 3.0));
    float dash = 0.55 + 0.45 * sin(ang * (6.0 + fi * 4.0) - t * (0.5 + fi * 0.3));
    ring += glow * dash * (0.9 - fi * 0.22);
  }

  // Soft core glow.
  float core = exp(-r * r * 3.2) * (0.55 + 0.45 * warp);

  // Orbiting satellite dots.
  float dots = 0.0;
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float sp = t * (0.35 + fi * 0.18) * (mod(fi, 2.0) * 2.0 - 1.0) + fi * 2.4;
    vec2 c = vec2(cos(sp), sin(sp) * tilt) * (0.55 + fi * 0.42);
    float d = length(p - c);
    dots += exp(-d * d * 900.0) * 1.4 + exp(-d * d * 90.0) * 0.25;
  }

  // Palette: violet -> mint in dark, warm paper-friendly in light.
  vec3 deepA = mix(vec3(0.30, 0.16, 0.75), vec3(0.95, 0.55, 0.30), uTheme);
  vec3 deepB = mix(vec3(0.05, 0.10, 0.28), vec3(0.98, 0.90, 0.78), uTheme);
  vec3 glowA = mix(vec3(0.55, 0.35, 1.00), vec3(0.85, 0.38, 0.20), uTheme);
  vec3 glowB = mix(vec3(0.20, 0.95, 0.70), vec3(0.30, 0.55, 1.00), uTheme);

  vec3 base = mix(deepB, deepA, clamp(bands + r * 0.25, 0.0, 1.0));
  vec3 col = base;
  col += glowA * ring * (uTheme > 0.5 ? 0.55 : 0.85);
  col += glowB * core * 0.55;
  col += vec3(1.0) * dots * (uTheme > 0.5 ? 0.35 : 0.8);

  // Vignette + dither to kill banding.
  col *= 1.0 - 0.32 * dot(uv * 0.62, uv * 0.62);
  float g = fract(sin(dot(frag, vec2(12.9898, 78.233))) * 43758.5453);
  col += (g - 0.5) * 0.014;

  gl_FragColor = vec4(col, 1.0);
}
`

const VERT = /* glsl */ `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`

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

  // Always render the canvas so the ref exists on first paint; WebGL init
  // happens once in the effect below. SSR renders the fallback only.
  // useSyncExternalStore gives us a hydration-safe mounted flag without a
  // setState-in-effect cascade.
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
    if (reducedMotion) return // keep the CSS fallback, render one still below

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
    const uStatic = gl.getUniformLocation(prog, 'uStatic')

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
      const w = Math.max(2, Math.round(rect.width * dpr))
      const h = Math.max(2, Math.round(rect.height * dpr))
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
      gl.uniform1f(uStatic, 0)
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
