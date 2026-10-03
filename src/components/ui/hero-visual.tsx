'use client'

import * as React from 'react'

import { useReducedMotion } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'

/**
 * Hero 3D visual — a tilted orbital system rendered with true perspective.
 *
 * What makes this 3D rather than a flat gradient: every ring is a circle in 3D
 * object space, rotated by yaw/pitch into camera space and projected with a
 * perspective divide. Near-side arcs render brighter than far-side ones, and a
 * shell of particles orbits the same centre with depth-attenuated size and
 * alpha. The pointer drives the camera, so the whole system visibly turns in
 * depth rather than sliding in the plane.
 *
 * Performance budget: the canvas is backed at 60% of display resolution
 * (upscaled by CSS — glow hides the softness), rings are traced at 20 samples
 * each and the particle shell is 22 points. One rAF loop, paused off-screen,
 * static fallback for reduced motion.
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

mat3 rotX(float a) {
  float c = cos(a), s = sin(a);
  return mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c);
}

// Perspective projection: camera sits at +z looking at the origin.
vec2 proj(vec3 p, float camD, float viewH) {
  float denom = max(camD - p.z, 0.25);
  return p.xy * (camD / denom) / viewH;
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

// Trace one 3D ring: returns closest screen-space distance, plus the depth
// (frontness) of the closest sample for the near-side-brighter cue.
//
// The ring radius breathes with a low-amplitude travelling wave. This is a
// continuous function of the loop parameter, so the curve stays perfectly
// smooth — unlike dashes derived from the quantized closest-sample angle,
// which imprint sharp Voronoi seams fanning from the projected centre.
float traceRing(
  vec3 U, vec3 V, float R, float wobFreq, float wobSpeed, float wobAmp,
  vec2 uv, mat3 rot, float t, float camD, float viewH,
  out float front
) {
  float md = 1e9;
  front = 0.5;
  for (int i = 0; i < 20; i++) {
    float a = float(i) / 20.0 * 6.2831853;
    float Rw = R * (1.0 + wobAmp * sin(a * wobFreq - t * wobSpeed));
    vec3 p = rot * (Rw * (cos(a) * U + sin(a) * V));
    vec2 s = proj(p, camD, viewH);
    float d = length(uv - s);
    if (d < md) {
      md = d;
      front = clamp(p.z * 0.5 + 0.5, 0.0, 1.0);
    }
  }
  return md;
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = (frag * 2.0 - uRes) / min(uRes.x, uRes.y);
  float t = uTime;

  // Camera: slow auto-orbit plus pointer control.
  float yaw = t * 0.10 + uPointer.x * 0.7;
  float pitch = 0.42 + uPointer.y * 0.45;
  mat3 rot = rotY(yaw) * rotX(pitch);
  float camD = 3.4;
  float viewH = 1.35;

  // Domain-warped aurora backdrop.
  vec2 p = uv + uPointer * 0.10;
  float warp = fbm(p * 1.4 + vec2(t * 0.05, -t * 0.04));
  float bands = fbm(vec2(p.x * 1.2 + warp * 1.6, p.y * 1.6 - t * 0.06));
  bands = smoothstep(0.25, 0.85, bands);
  float r = length(p);

  // Three orbital rings in genuinely different planes. Each keeps its own
  // frontness so the depth cue follows its own nearest arc.
  float frontA;
  float dA = traceRing(
    vec3(1.0, 0.0, 0.0), vec3(0.0, 0.37, 0.93), 0.62, 6.0, 0.50, 0.045,
    uv, rot, t, camD, viewH, frontA);
  float ringA = exp(-dA * dA * 5200.0) * (0.55 + 0.85 * frontA);

  float frontB;
  // Tilted ~20° off the edge-on YZ plane: foreshortened enough to show depth,
  // open enough to read as an ellipse rather than a line.
  float dB = traceRing(
    normalize(vec3(0.35, 0.0, 0.94)), vec3(0.0, 1.0, 0.0), 0.95, 9.0, 0.70, 0.035,
    uv, rot, t, camD, viewH, frontB);
  float ringB = exp(-dB * dB * 7000.0) * (0.55 + 0.85 * frontB);

  float frontC;
  float dC = traceRing(
    normalize(vec3(0.86, 0.50, 0.0)), normalize(vec3(-0.19, 0.33, 0.92)), 1.25,
    12.0, 0.90, 0.030,
    uv, rot, t, camD, viewH, frontC);
  float ringC = exp(-dC * dC * 9000.0) * (0.55 + 0.85 * frontC);

  // Particle shell: points distributed through a spherical volume, rotated by
  // the same camera transform, with perspective size and depth fade.
  float dots = 0.0;
  for (int i = 0; i < 22; i++) {
    float fi = float(i);
    vec3 dir = normalize(vec3(
      hash1(fi * 1.37 + 0.5) - 0.5,
      hash1(fi * 2.11 + 3.7) - 0.5,
      hash1(fi * 3.73 + 9.1) - 0.5));
    float rad = 0.55 + 0.75 * hash1(fi * 7.3 + 1.3);
    vec3 wp = rot * (dir * rad);
    vec2 s = proj(wp, camD, viewH);
    float d = length(uv - s);
    float depth = clamp((wp.z + 1.4) / 2.8, 0.0, 1.0);
    float tw = 0.6 + 0.4 * sin(t * 2.2 + fi * 2.7);
    float k = 0.020 + 0.030 * depth;
    dots += exp(-d * d / (k * k)) * (0.20 + 0.80 * depth) * tw;
  }

  // Core glow.
  float core = exp(-r * r * 3.2) * (0.55 + 0.45 * warp);

  // Palette: violet -> mint in dark, warm paper-friendly in light.
  vec3 deepA = mix(vec3(0.30, 0.16, 0.75), vec3(0.95, 0.55, 0.30), uTheme);
  vec3 deepB = mix(vec3(0.05, 0.10, 0.28), vec3(0.98, 0.90, 0.78), uTheme);
  vec3 glowA = mix(vec3(0.55, 0.35, 1.00), vec3(0.85, 0.38, 0.20), uTheme);
  vec3 glowB = mix(vec3(0.20, 0.95, 0.70), vec3(0.30, 0.55, 1.00), uTheme);

  vec3 base = mix(deepB, deepA, clamp(bands + r * 0.25, 0.0, 1.0));
  vec3 col = base;
  col += glowA * (ringA * 0.9 + ringB * 0.7 + ringC * 0.5) * (uTheme > 0.5 ? 0.55 : 0.9);
  col += glowB * core * 0.55;
  col += vec3(1.0) * dots * 0.45 * (uTheme > 0.5 ? 0.5 : 1.0);

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
