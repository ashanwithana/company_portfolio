(()=>{"use strict";(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,87652,e=>{var t=e.i(86427),r=e.i(71645),n=e.i(37806),o=e.i(47414);e.s(["f",0,function(e){let i=(0,o.f)(()=>(0,t.o)(e)),{isStatic:l}=(0,r.useContext)(n.f);if(l){let[,t]=(0,r.useState)(e);(0,r.useEffect)(()=>i.on("change",t),[])}return i}])},10542,58866,e=>{var t=e.i(60140),r=e.i(30551),n=e.i(86427);e.i(65566);var o=e.i(71645),i=e.i(87046),l=e.i(60830),a=e.i(61327),s=e.i(87022),c=e.i(48940),f=e.i(76959),u=e.i(83920),d=e.i(25791);let m=()=>({current:0,offset:[],progress:0,scrollLength:0,targetOffset:0,targetLength:0,containerLength:0,velocity:0}),h=()=>({time:0,x:m(),y:m()}),g={x:{length:"Width",position:"Left"},y:{length:"Height",position:"Top"}},p=new WeakMap,x={start:0,center:.5,end:1};function v(e,t,r=0){let n=0;if(e in x&&(e=x[e]),"string"==typeof e){let t=parseFloat(e);e.endsWith("px")?n=t:e.endsWith("%")?e=t/100:e.endsWith("vw")?n=t/100*document.documentElement.clientWidth:e.endsWith("vh")?n=t/100*document.documentElement.clientHeight:e=t}return"number"==typeof e&&(n=t*e),r+n}let y=[0,0];function w(e,t,r,n){let o=Array.isArray(e)?e:y,i=0;return"number"==typeof e?o=[e,e]:"string"==typeof e&&(o=(e=e.trim()).includes(" ")?e.split(" "):[e,x[e]?e:"0"]),(i=v(o[0],r,n))-v(o[1],t)}let b=[[0,0],[1,1]];var k=e.i(72846);let L=new WeakMap,M=new WeakMap,A=new WeakMap,S=new WeakMap,T=e=>e===document.scrollingElement?window:e;function E(e,{container:t=document.scrollingElement,trackContentSize:r=!1,...n}={}){if(!t)return l.f;let o=A.get(t);o||(o=new Set,A.set(t,o));let i=function(e,t,r,n={}){let{target:o}=n,i=o||n.offset;return{measure:t=>{if(i){for(let e in r.time=t.time,g){let{offset:n}=r[e];Object.assign(r[e],t[e]),r[e].offset=n}if(o&&o!==e){let t=function(e,t){let r={x:0,y:0},n=e;for(;n&&n!==t;)if((0,k.f)(n))r.x+=n.offsetLeft,r.y+=n.offsetTop,n=n.offsetParent;else if("svg"===n.tagName){let e=n.getBoundingClientRect(),t=(n=n.parentElement).getBoundingClientRect();r.x+=e.left-t.left,r.y+=e.top-t.top}else if(n instanceof SVGGraphicsElement){let{x:e,y:t}=n.getBBox();r.x+=e,r.y+=t;let o=null,i=n.parentNode;for(;!o;)"svg"===i.tagName&&(o=i),i=n.parentNode;n=o}else break;return r}(o,e),n="getBBox"in o&&"svg"!==o.tagName?o.getBBox():{width:o.clientWidth,height:o.clientHeight};r.x.targetOffset=t.x,r.y.targetOffset=t.y,r.x.targetLength=n.width,r.y.targetLength=n.height}!function(e,{offset:t=b}){for(let r in g){let n=e[r];n.offset.length=0;for(let e=0;e<t.length;e++)n.offset[e]=w(t[e],n.containerLength,n.targetLength,n.targetOffset);n.progress=(0,f.f)(0,1,function(e,t){let r=e.length-1;if(r<1)return 0;let n=e[0]>e[r],o=t=>e[n?r-t:t];if(e[0]===e[1]&&t<o(0))return+!!n;let i=0;for(;i<r-1&&t>=o(i+1);)i++;let l=(i+(0,u.f)(o(i),o(i+1),t))/r;return n?1-l:l}(n.offset,n.current))}}(r,n)}},notify:e=>t(i?r:e)}}(t,e,h(),n);if(o.add(i),!L.has(t)){let e=h(),r=()=>{var r=c.f.timestamp;for(let n in g)!function(e,t,r,n){let o=r[t],{length:i,position:l}=g[t],a=o.current,s=r.time,c=e[`scroll${l}`];o.current=!function(e,t){let r=e===document.scrollingElement,n=r&&document.body||e,o=p.get(n);o||p.set(n,o=getComputedStyle(n));let{writingMode:i,flexDirection:l}=o,a="x"===t!==/^[vs]/.test(i);return(a?"rtl"===o.direction!=("sideways-lr"===i):i.endsWith("rl"))!==(!r&&o.display.includes("flex")&&(a!==("c"===l[0])?l:o.flexWrap).endsWith("reverse"))}(e,t)?c:-c||0,o.containerLength=e[`client${i}`],o.targetLength=e[`scroll${i}`],o.scrollLength=o.targetLength-o.containerLength,o.offset.length=0,o.offset[0]=0,o.offset[1]=o.scrollLength,o.progress=(0,f.f)(0,1,(0,u.f)(0,o.scrollLength,o.current));let m=n-s;o.velocity=m>50?0:(0,d.f)(o.current-a,m)}(t,n,e,r);for(let t of(e.time=r,o))t.measure(e);s.y.preUpdate(n)},n=()=>{for(let t of o)t.notify(e)},i=()=>s.y.read(r);L.set(t,i);let l=T(t);window.addEventListener("resize",i),t!==document.documentElement&&M.set(t,(0,a.f)(t,i)),l.addEventListener("scroll",i),i()}if(r&&!S.has(t)){let e=L.get(t),r={width:t.scrollWidth,height:t.scrollHeight},n=s.y.read(()=>{let n=t.scrollWidth,o=t.scrollHeight;(r.width!==n||r.height!==o)&&(e(),r.width=n,r.height=o)},!0);S.set(t,n)}let m=L.get(t);return s.y.read(m,!1,!0),()=>{(0,s.Y)(m);let e=A.get(t);if(!e||(e.delete(i),e.size))return;A.delete(t);let r=L.get(t);L.delete(t),r&&(T(t).removeEventListener("scroll",r),M.get(t)?.(),window.removeEventListener("resize",r));let n=S.get(t);n&&((0,s.Y)(n),S.delete(t))}}let j=new Map,N=e=>{if(/v/u.test(e))return[];let t=w(e,0,0,0);return[w(e,0,1,0)-t,t-w(e,1,0,0),t]},R=([e,t,r])=>!r&&(0===t||1===t)&&`${t?"entry":"exit"}-crossing ${100*e}%`;function C(e=b){if(2!==e.length)return;let[t,r]=e.map(N),n=[R(t),R(r)],o=r[0]-t[0],i=t[1]-r[1];if(n[0]&&n[1]&&(o||i))return{points:n,a:o,b:i,cover:!t[0]&&1===o&&1===i}}function P(e,{axis:t="y",source:n,container:o=document.scrollingElement,...s}={}){if(!o)return l.f;let c={axis:t,container:n||o,...s};if("function"==typeof e){let r=(0,i.h)(e);return(0,i.q)(E(e=>r(e[t].progress,e),c))}return(0,i.q)(function(e,t){let n,{target:o,container:i,axis:l}=t,s=o&&C(t.offset),c=!("u"<typeof window)&&(o?(0,r.G)():(0,r.a)())&&(o?!!s:!t.offset),f=new Map,u=new Set,d=!1,m=(e,t)=>{let[r,n]=s.points;t.effect.updateTiming({direction:d?"normal"===e?"reverse":"alternate-reverse":e}),Object.assign(t,{rangeStart:d?n:r,rangeEnd:d?r:n}),t.play()},h=[e.attachTimeline({get timeline(){return c?function({container:e,target:t,axis:r}){let n=j.get(e);n||(n=new Map,j.set(e,n));let o=t??"self",i=n.get(o);return i||(i={},n.set(o,i)),i[r]||(i[r]=t?new ViewTimeline({subject:t,axis:r}):new ScrollTimeline({source:e,axis:r}))}(t):void 0},onAttach:s&&(e=>{let t=e.effect.getTiming().direction;f.set(e,t),m(t,e)}),observe:e=>(e.pause(),u.add(e),n||(n=E(e=>{u.forEach(t=>{t.time=t.iterationDuration*e[l].progress})},t)),()=>u.delete(e))})];if(c&&s){let{a:e,b:t}=s,r="y"===l?"clientHeight":"clientWidth",n=()=>{d!==(d=e*o[r]+t*i[r]<0)&&f.forEach(m)};n(),e*t<0&&h.push((0,a.f)(n),(0,a.f)([o,i],n))}return()=>{h.forEach(e=>e()),n?.()}}(e,c))}var W=e.i(47414),B=e.i(74008);let F=()=>({scrollX:(0,n.o)(0),scrollY:(0,n.o)(0),scrollXProgress:(0,n.o)(0),scrollYProgress:(0,n.o)(0),scrollXLength:(0,n.o)(0),scrollYLength:(0,n.o)(0)}),z=e=>!!e&&!e.current;function Y(e,r,n,o){return{factory:i=>{let l,a=()=>{z(n)||z(o)?t.t.read(a):l=P(i,{...r,axis:e,container:n?.current||void 0,target:o?.current||void 0})};return t.t.read(a),()=>{(0,t.w)(a),l?.()}},times:[0,1],keyframes:[0,1],ease:e=>e,duration:1}}e.s(["f",0,function({container:e,target:n,...i}={}){var l;let a=(0,W.f)(F);l=i.offset,!("u"<typeof window)&&(n?(0,r.G)()&&!!C(l):(0,r.a)()&&!l)&&(a.scrollXProgress.accelerate=Y("x",i,e,n),a.scrollYProgress.accelerate=Y("y",i,e,n));let s=(0,o.useRef)(null),c=(0,o.useRef)(!1),f=(0,o.useCallback)(()=>(s.current=P((e,{x:t,y:r})=>{a.scrollX.set(t.current),a.scrollXProgress.set(t.progress),a.scrollXLength.set(t.scrollLength),a.scrollY.set(r.current),a.scrollYProgress.set(r.progress),a.scrollYLength.set(r.scrollLength)},{...i,container:e?.current||void 0,target:n?.current||void 0}),()=>{s.current?.()}),[e,n,JSON.stringify(i.offset)]);return(0,B.f)(()=>{if(c.current=!1,!(z(e)||z(n)))return f();c.current=!0},[f]),(0,o.useEffect)(()=>{let r;if(!c.current)return;let o=()=>{let t=z(e),o=z(n);t||o||(r=f())};return t.t.read(o),()=>{(0,t.w)(o),r?.()}},[f]),a}],10542);var _=e.i(44230);e.s(["f",0,function(...e){let t=!Array.isArray(e[0]),r=t?0:-1,n=e[0+r],o=e[1+r],i=e[2+r],l=e[3+r],a=(0,_.f)(o,i,l);return t?a(n):a}],58866)},95420,e=>{var t=e.i(58866),r=e.i(47414),n=e.i(87022),o=e.i(74008),i=e.i(87652);function l(e,t){let r=(0,i.f)(t()),l=()=>r.set(t());return l(),(0,o.f)(()=>{let t=()=>n.y.preRender(l,!1,!0),r=e.map(e=>e.on("change",t));return l(),()=>{r.forEach(e=>e()),(0,n.Y)(l)}}),r}var a=e.i(86427);function s(e,t){let n=(0,r.f)(()=>[]);return l(e,()=>{n.length=0;let r=e.length;for(let t=0;t<r;t++)n[t]=e[t].get();return t(n)})}e.s(["f",0,function e(n,o,i,c){if("function"==typeof n){let e;return a.I.current=[],n(),e=l(a.I.current,n),a.I.current=void 0,e}if(void 0!==i&&!Array.isArray(i)&&"function"!=typeof o){var f=n,u=o,d=i,m=c;let t=(0,r.f)(()=>Object.keys(d)),l=(0,r.f)(()=>({}));for(let r of t)l[r]=e(f,u,d[r],m);return l}let h="function"==typeof o?o:(0,t.f)(o,i,c),g=Array.isArray(n)?s(n,h):s([n],([e])=>h(e)),p=Array.isArray(n)?void 0:n.accelerate;if(p&&!p.isTransformed&&"function"!=typeof o&&Array.isArray(i)&&c?.clamp!==!1){let e=c?.ease;g.accelerate={...p,times:[0,...o,1],keyframes:[i[0],...i,i[i.length-1]],isTransformed:!0,...e?{ease:Array.isArray(e)?[e[0],...e]:e}:{}}}return g}],95420)},73822,e=>{var t=e.i(43476),r=e.i(32181),n=e.i(72328),o=e.i(10542),i=e.i(95420),l=e.i(71645),a=e.i(75157);function s({children:e,progress:n,index:o,total:l,settled:a}){let c=(0,i.f)(n,[o/l*.85,(o+1)/l*.85],[.25,1]);return(0,t.jsxs)(r.f.li,{style:a?void 0:{opacity:c},className:"flex items-center gap-3 font-mono text-[10px] tracking-[0.22em] uppercase",children:[(0,t.jsx)("span",{"aria-hidden":"true",className:"h-px w-5 bg-foreground"}),e]})}function c({line:e,progress:n,index:o,total:l,settled:a}){let s=e.text.split(/\s+/).filter(Boolean),f=s.length-(e.strongWords??1),u=(0,i.f)(n,[o/l*.85,(o+1)/l*.85],[-12,112],{clamp:!0}),d=(0,i.f)(u,e=>`linear-gradient(100deg, #000 ${e}%, transparent ${e+9}%)`),m=e=>s.map((r,n)=>{let o=n>=f;return(0,t.jsx)("span",{className:"outline"===e?`mr-[0.26em] inline-block text-background ${o?"font-bold":"font-thin"}`:`mr-[0.26em] inline-block ${o?"font-bold text-foreground":"font-thin text-foreground/50"}`,children:r},`${r}-${n}`)});return a?(0,t.jsx)("span",{className:"block",children:m("solid")}):(0,t.jsxs)("span",{className:"relative block",children:[(0,t.jsx)("span",{"aria-hidden":"true",className:"block [-webkit-text-stroke:2px_color-mix(in_oklab,var(--foreground)_34%,transparent)] [paint-order:stroke_fill]",children:m("outline")}),(0,t.jsx)(r.f.span,{style:{maskImage:d,WebkitMaskImage:d},className:"absolute inset-0 block",children:m("solid")})]})}e.s(["Manifesto",0,function({lines:e,label:f="02 / Manifesto",keywords:u=[],id:d="manifesto",ariaLabel:m="Manifesto",trackClassName:h="h-[250vh]",children:g}){let p=l.useRef(null),x=(0,n.f)(),{scrollYProgress:v}=(0,o.f)({target:p,offset:["start start","end end"]}),y=(0,i.f)(v,[0,.85],[0,1],{clamp:!0});return(0,t.jsxs)("section",{id:d,ref:p,"aria-label":m,className:x?"relative border-t border-border py-24":(0,a.f)("relative",h),children:[(0,t.jsx)("div",{"aria-hidden":"true",className:"pointer-events-none absolute inset-0 z-0 mx-auto flex w-full max-w-[1600px] justify-center px-4 md:px-8",children:(0,t.jsx)("div",{className:"h-full w-full border-x border-foreground/5"})}),(0,t.jsx)("div",{className:x?"relative z-10 mx-auto w-full max-w-[1600px] px-4 md:px-8":"sticky top-0 h-[100svh] w-full overflow-hidden border-t border-border",children:(0,t.jsxs)("div",{className:x?"":"relative z-10 mx-auto flex h-full w-full max-w-[1600px] flex-col justify-center px-4 md:px-8",children:[(0,t.jsxs)("div",{className:"mb-6 flex items-center justify-between gap-6 md:mb-10",children:[(0,t.jsxs)("div",{className:"flex flex-1 items-center gap-4",children:[(0,t.jsx)("span",{className:"font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase",children:f}),(0,t.jsx)("span",{"aria-hidden":"true",className:"relative h-px max-w-[280px] flex-1 bg-border",children:x?null:(0,t.jsx)(r.f.span,{style:{scaleX:y},className:"absolute inset-0 origin-left bg-foreground/40"})})]}),u.length>0?(0,t.jsx)("ol",{"aria-hidden":"true",className:"hidden items-center gap-7 xl:flex",children:u.map((e,r)=>(0,t.jsx)(s,{progress:v,index:r,total:u.length,settled:!!x,children:e},e))}):null]}),(0,t.jsx)("p",{className:"max-w-[1400px] text-[clamp(1.7rem,4.8vw,4.8rem)] leading-[1.04] tracking-tight text-balance uppercase",children:e.map((r,n)=>(0,t.jsx)(c,{line:r,progress:v,index:n,total:e.length,settled:!!x},r.text))}),g]})})]})}])},15166,e=>{var t=e.i(43476),r=e.i(71645);function n(e){let t=new Date,r=6e4-(1e3*t.getSeconds()+t.getMilliseconds()),n=0,o=setTimeout(()=>{e(),n=window.setInterval(e,6e4)},r);return()=>{clearTimeout(o),n&&clearInterval(n)}}function o(){return Math.floor(Date.now()/6e4)}function i(){return null}e.s(["OfficeTime",0,function({timeZone:e}){let l=r.useSyncExternalStore(n,o,i);return(0,t.jsx)("span",{className:"tabular-nums",children:function(e,t){if(null===e)return"--:--";try{return new Intl.DateTimeFormat("en-GB",{hour:"2-digit",minute:"2-digit",hour12:!1,timeZone:t}).format(new Date(6e4*e))}catch{return"--:--"}}(l,e)})}])},20735,e=>{var t=e.i(43476),r=e.i(71645),n=e.i(42405),o=e.i(75157);let i=`
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,l=`
precision highp float;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uPointerVel;
uniform float uScroll;
uniform float uTheme; // 0 = dark, 1 = light
uniform float uSeed; // shifts the pattern so neighbouring instances differ
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

  float t = uTime * 0.12 + uSeed * 7.0;

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
`;function a(e,t,r){let n=e.createShader(t);return n?(e.shaderSource(n,r),e.compileShader(n),e.getShaderParameter(n,e.COMPILE_STATUS))?n:(e.deleteShader(n),null):null}e.s(["SilkBackground",0,function({className:e,fadeEdge:s="bottom",seed:c=0}){let f=(0,n.N)(),u=(0,n.p)(),d=r.useRef(null),[m,h]=r.useState(!1),[g,p]=r.useState(!1);r.useEffect(()=>{let e=d.current;if(!f||u||!e)return;let t=e.getContext("webgl",{antialias:!1,alpha:!1,powerPreference:"low-power"});if(!t)return void queueMicrotask(()=>p(!0));let r=a(t,t.VERTEX_SHADER,i),n=a(t,t.FRAGMENT_SHADER,l),o=t.createProgram();if(!r||!n||!o||(t.attachShader(o,r),t.attachShader(o,n),t.linkProgram(o),!t.getProgramParameter(o,t.LINK_STATUS)))return void queueMicrotask(()=>p(!0));t.useProgram(o);let m=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,m),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),t.STATIC_DRAW);let g=t.getAttribLocation(o,"position");t.enableVertexAttribArray(g),t.vertexAttribPointer(g,2,t.FLOAT,!1,0,0);let x=t.getUniformLocation(o,"uTime"),v=t.getUniformLocation(o,"uResolution"),y=t.getUniformLocation(o,"uMouse"),w=t.getUniformLocation(o,"uPointerVel"),b=t.getUniformLocation(o,"uScroll"),k=t.getUniformLocation(o,"uTheme"),L=t.getUniformLocation(o,"uFlip"),M=t.getUniformLocation(o,"uSeed");t.uniform1f(M,c),t.uniform1f(L,+("top"===s));let A=()=>{let r=Math.min(window.devicePixelRatio||1,2),n=Math.max(1,Math.round(.5*e.clientWidth*Math.min(r,1.5))),o=Math.max(1,Math.round(.5*e.clientHeight*Math.min(r,1.5)));(e.width!==n||e.height!==o)&&(e.width=n,e.height=o),t.viewport(0,0,e.width,e.height)};A();let S=new ResizeObserver(A);S.observe(e);let T={x:.35,y:.1},E={x:.35,y:.1},j=0,N=t=>{let r=e.getBoundingClientRect();if(0===r.width||0===r.height)return;let n=(t.clientX-r.left)/r.width*2-1,o=1-(t.clientY-r.top)/r.height*2;T.x=n*(r.width/r.height),T.y=o};window.addEventListener("pointermove",N,{passive:!0});let R=!0,C=new IntersectionObserver(([e])=>{R=e?.isIntersecting??!0});C.observe(e);let P=0,W=performance.now(),B=0,F=!0,z=r=>{P=requestAnimationFrame(z);let n=Math.min((r-W)/1e3,.1);if(W=r,!R||document.hidden)return;B+=n;let o=E.x,i=E.y,l=1-Math.exp(-(3.2*n));E.x+=(T.x-E.x)*l,E.y+=(T.y-E.y)*l;let a=Math.hypot(E.x-o,E.y-i)/Math.max(n,.001);j+=(Math.min(a,3)-j)*(1-Math.exp(-(4*n))),t.uniform1f(x,B),t.uniform2f(v,e.width,e.height),t.uniform2f(y,E.x,E.y),t.uniform1f(w,j),t.uniform1f(b,Math.min(window.scrollY/Math.max(window.innerHeight,1),2)),t.uniform1f(k,+!!document.documentElement.classList.contains("light")),t.drawArrays(t.TRIANGLES,0,3),F&&(F=!1,h(!0))};return P=requestAnimationFrame(z),()=>{cancelAnimationFrame(P),S.disconnect(),C.disconnect(),window.removeEventListener("pointermove",N),t.deleteBuffer(m),t.deleteProgram(o),t.deleteShader(r),t.deleteShader(n)}},[f,u,s,c]);let x=f&&!u&&!g;return(0,t.jsxs)("div",{"aria-hidden":"true",className:(0,o.f)("pointer-events-none absolute inset-0 overflow-hidden",e),"data-silk-background":!0,children:[(0,t.jsx)("div",{className:(0,o.f)("absolute inset-0 transition-opacity duration-1000",m&&x?"opacity-0":"opacity-100"),style:{background:"radial-gradient(ellipse 70% 60% at 62% 38%, color-mix(in oklab, var(--foreground) 14%, transparent) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 30% 55%, color-mix(in oklab, var(--foreground) 7%, transparent) 0%, transparent 70%)"}}),x?(0,t.jsx)("canvas",{ref:d,className:(0,o.f)("absolute inset-0 h-full w-full transition-opacity duration-[1400ms] ease-out",m?"opacity-100":"opacity-0")}):null]})}])}])})();