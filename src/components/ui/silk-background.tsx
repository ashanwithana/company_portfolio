'use client'

import * as React from 'react'

import { useIsMounted, useReducedMotion } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'

/*
 * Silk field: a full-bleed, slow-moving surface of folded light, drawn in one
 * fragment shader.
 *
 * The surface is domain-warped fractal noise (noise fed through noise twice),
 * which gives long, soft folds rather than the cloudy blobs plain fbm makes.
 * A height-field normal is taken from the folds and lit by a light that orbits
 * slowly and leans toward the cursor, so crests catch a sheen and a sharp
 * glint. The cursor also pulls the warp, so the surface bends toward it with
 * a little weight (a smoothed "bead" follows the pointer, and fast moves pull
 * harder).
 *
 * Palette is monochrome to match the site. In the dark theme it is silver on
 * black; in the light theme the same relief is rendered as graphite on paper.
 *
 * Cost control: the canvas renders at reduced resolution (the field is
 * smooth, so it upsamples cleanly), the device pixel ratio is capped, and the
 * loop stops while the hero is off-screen or the tab is hidden. When motion is
 * reduced or WebGL is unavailable, a static CSS gradient is shown instead.
 *
 * The 2D simplex noise below is the Ashima/Gustavson implementation (MIT).
 */

const VERTEX = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const FRAGMENT = `
precision highp float;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uPointerVel;
uniform float uScroll;
uniform float uTheme; // 0 = dark, 1 = light
uniform float uFlip; // 0 = fade into the ground at the bottom, 1 = at the top

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                      -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 x) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.8776, 0.4794, -0.4794, 0.8776);
  for (int i = 0; i < 3; i++) {
    v += a * snoise(x);
    x = rot * x * 2.0 + vec2(100.0);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= uResolution.x / uResolution.y;

  // Distance from the edge that dissolves into the page ground.
  float edgeY = mix(uv.y, 1.0 - uv.y, uFlip);

  float t = uTime * 0.12;

  // Cursor pull: a soft, wide falloff that deepens when the pointer moves fast.
  float dist = length(p - uMouse);
  float pull = exp(-dist * 1.5) * (0.45 + uPointerVel * 0.6);

  // Two-stage domain warp.
  vec2 q = vec2(fbm(p), fbm(p + vec2(1.0)));
  vec2 r = vec2(
    fbm(p + q + vec2(1.7, 9.2) + 0.15 * t + uMouse.x * pull),
    fbm(p + q + vec2(8.3, 2.8) + 0.126 * t + uMouse.y * pull)
  );

  vec2 w = p + r + uScroll * 0.2;
  float f = fbm(w);

  // Relief from finite differences of the same surface.
  float e = 0.07;
  float fx = fbm(w + vec2(e, 0.0));
  float fy = fbm(w + vec2(0.0, e));
  vec3 n = normalize(vec3(-(fx - f) / e * 0.16, -(fy - f) / e * 0.16, 1.0));

  vec3 L = normalize(vec3(
    0.55 * cos(uTime * 0.11) + uMouse.x * 0.25,
    0.45 * sin(uTime * 0.09) + uMouse.y * 0.25 + 0.35,
    0.85
  ));
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 H = normalize(L + V);
  float ndl = max(dot(n, L), 0.0);
  float ndh = max(dot(n, H), 0.0);
  float ndv = max(dot(n, V), 0.0);

  float sheen = pow(ndh, 12.0) * 0.14;
  float glint = pow(ndh, 72.0) * 0.4;
  float fresnel = pow(1.0 - ndv, 3.2);
  float crest = clamp(length(q) * length(r) * f * 1.6, 0.0, 1.0);

  // Monochrome ramps. Dark: black to silver. Light: paper to graphite.
  vec3 darkBase = vec3(0.012);
  vec3 darkMid = vec3(0.075, 0.078, 0.085);
  vec3 darkHigh = vec3(0.50, 0.51, 0.53);

  vec3 base = darkBase;
  vec3 mid = darkMid;
  vec3 high = darkHigh;

  vec3 albedo = mix(base, mid, clamp(f * f * 4.0, 0.0, 1.0));
  albedo = mix(albedo, high, clamp(length(q) * length(r) * f, 0.0, 1.0) * (0.55 + pull * 0.45));

  vec3 color = albedo * (0.78 + 0.22 * ndl);
  color += high * (fresnel * 0.14 + sheen + glint * 0.8) * (0.4 + 0.6 * crest);

  // Fold lines, thin bands where the height crosses a level.
  float edge = smoothstep(0.4, 0.5, f) - smoothstep(0.5, 0.6, f);
  color += vec3(0.2) * edge * 0.4;

  // Soft vignette, then fade to the ground at the bottom for the scroll handoff.
  float v = smoothstep(2.5, 0.1, length(p));
  color *= 0.4 + 0.6 * v;
  color *= smoothstep(0.0, 0.25, edgeY);

  // Light theme: invert the luminance onto warm paper (#f4f3ee) so the same
  // folds read as graphite creases rather than glowing silk.
  vec3 paper = vec3(0.957, 0.953, 0.933);
  float lum = clamp(dot(color, vec3(0.3333)) * 1.6, 0.0, 1.0);
  vec3 lightColor = mix(paper, vec3(0.08), lum * 0.55);
  lightColor = mix(paper, lightColor, smoothstep(0.0, 0.25, edgeY));
  color = mix(color, lightColor, uTheme);

  // Dither so the dark gradients never band.
  float ign = fract(52.9829189 * fract(0.06711056 * gl_FragCoord.x + 0.00583715 * gl_FragCoord.y));
  color += (ign - 0.5) / 255.0;

  gl_FragColor = vec4(color, 1.0);
}
`

/** Render scale relative to CSS pixels. The surface is smooth, so half is plenty. */
const RENDER_SCALE = 0.5
const MAX_DPR = 2

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export function SilkBackground({
  className,
  fadeEdge = 'bottom',
}: {
  className?: string
  /** Which edge dissolves into the page ground: bottom for a hero, top for a footer. */
  fadeEdge?: 'top' | 'bottom'
}) {
  const mounted = useIsMounted()
  const reducedMotion = useReducedMotion()
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = React.useState(false)
  const [failed, setFailed] = React.useState(false)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!mounted || reducedMotion || !canvas) return

    const gl = canvas.getContext('webgl', {
      antialias: false,
      alpha: false,
      powerPreference: 'low-power',
    })
    if (!gl) {
      // Deferred so the state write is not synchronous in the effect body.
      queueMicrotask(() => setFailed(true))
      return
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT)
    const program = gl.createProgram()
    if (!vs || !fs || !program) {
      queueMicrotask(() => setFailed(true))
      return
    }
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      queueMicrotask(() => setFailed(true))
      return
    }
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const uTime = gl.getUniformLocation(program, 'uTime')
    const uResolution = gl.getUniformLocation(program, 'uResolution')
    const uMouse = gl.getUniformLocation(program, 'uMouse')
    const uPointerVel = gl.getUniformLocation(program, 'uPointerVel')
    const uScroll = gl.getUniformLocation(program, 'uScroll')
    const uTheme = gl.getUniformLocation(program, 'uTheme')
    const uFlip = gl.getUniformLocation(program, 'uFlip')
    gl.uniform1f(uFlip, fadeEdge === 'top' ? 1 : 0)

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      const w = Math.max(1, Math.round(canvas.clientWidth * RENDER_SCALE * Math.min(dpr, 1.5)))
      const h = Math.max(1, Math.round(canvas.clientHeight * RENDER_SCALE * Math.min(dpr, 1.5)))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)

    // Pointer state. `target` is where the cursor is, in the shader's p-space;
    // `bead` chases it, so a fast move stretches the surface.
    const target = { x: 0.35, y: 0.1 }
    const bead = { x: 0.35, y: 0.1 }
    let velocity = 0
    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1
      const ny = 1 - ((event.clientY - rect.top) / rect.height) * 2
      target.x = nx * (rect.width / rect.height)
      target.y = ny
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })

    let visible = true
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true
    })
    intersection.observe(canvas)

    let raf = 0
    let last = performance.now()
    let elapsed = 0
    let firstFrame = true

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now
      if (!visible || document.hidden) return

      elapsed += dt

      const px = bead.x
      const py = bead.y
      const follow = 1 - Math.exp(-dt * 3.2)
      bead.x += (target.x - bead.x) * follow
      bead.y += (target.y - bead.y) * follow
      const speed = Math.hypot(bead.x - px, bead.y - py) / Math.max(dt, 1e-3)
      velocity += (Math.min(speed, 3) - velocity) * (1 - Math.exp(-dt * 4))

      gl.uniform1f(uTime, elapsed)
      gl.uniform2f(uResolution, canvas.width, canvas.height)
      gl.uniform2f(uMouse, bead.x, bead.y)
      gl.uniform1f(uPointerVel, velocity)
      gl.uniform1f(uScroll, Math.min(window.scrollY / Math.max(window.innerHeight, 1), 2))
      gl.uniform1f(uTheme, document.documentElement.classList.contains('light') ? 1 : 0)
      gl.drawArrays(gl.TRIANGLES, 0, 3)

      if (firstFrame) {
        firstFrame = false
        setReady(true)
      }
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      resizeObserver.disconnect()
      intersection.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
    }
  }, [mounted, reducedMotion, fadeEdge])

  const showCanvas = mounted && !reducedMotion && !failed

  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      data-silk-background
    >
      {/* Static fallback, also the first paint before the shader boots. */}
      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-1000',
          ready && showCanvas ? 'opacity-0' : 'opacity-100',
        )}
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 62% 38%, color-mix(in oklab, var(--foreground) 14%, transparent) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 30% 55%, color-mix(in oklab, var(--foreground) 7%, transparent) 0%, transparent 70%)',
        }}
      />
      {showCanvas ? (
        <canvas
          ref={canvasRef}
          className={cn(
            'absolute inset-0 h-full w-full transition-opacity duration-[1400ms] ease-out',
            ready ? 'opacity-100' : 'opacity-0',
          )}
        />
      ) : null}
    </div>
  )
}
