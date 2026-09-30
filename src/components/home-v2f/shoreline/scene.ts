import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import {
  CLOUD,
  PARTICLE,
  REFLECTION,
  SAND,
  SKY_DAWN,
  SKY_MORNING,
  SKY_STOPS_DEG,
  SUN,
  WATER,
} from "./palette";

/*
 * Voxel shoreline at sunrise.
 *
 * World layout: the camera stands on the beach looking toward -z. The shoreline is a
 * coastline (COAST): a beach from the near left toward the centre, then a headland that
 * turns back out to sea on the right, so the sea still runs along the whole horizon.
 * `s` is the signed distance from the coast: negative in the sea, positive on the sand.
 * Waves travel along the shore normal, break at s = SB, then wash up the sand.
 * The wave maths lives in GLSL (WAVES) and is mirrored in JS only to time the spray.
 */

// Coastline as (x, z) points, left to right. Sand lies on the +z side.
const COAST: [number, number][] = [
  [-70, 36],
  [4, -1],
  [12, -25],
  [70, -27],
];

const coastZ = (x: number) => {
  for (let i = 1; i < COAST.length; i++) {
    const [x0, z0] = COAST[i - 1];
    const [x1, z1] = COAST[i];
    if (x <= x1 || i === COAST.length - 1) return z0 + ((x - x0) / (x1 - x0)) * (z1 - z0);
  }
  return 0;
};

const shoreDist = (x: number, z: number) => {
  let best = Infinity;
  for (let i = 1; i < COAST.length; i++) {
    const [x0, z0] = COAST[i - 1];
    const [x1, z1] = COAST[i];
    const dx = x1 - x0;
    const dz = z1 - z0;
    const t = Math.min(Math.max(((x - x0) * dx + (z - z0) * dz) / (dx * dx + dz * dz), 0), 1);
    best = Math.min(best, Math.hypot(x - (x0 + t * dx), z - (z0 + t * dz)));
  }
  return z > coastZ(x) ? best : -best;
};

const PERIOD = 7.0; // seconds per wave
const BREAK_T = 3.2; // seconds from swell to crash
const BREAK_S = -2.5; // where waves crash
const PEEL = 0.045; // crash sweeps along the shore, right to left

// Points along the break line, each with its direction toward the sand.
const breakLine = () => {
  const out: { x: number; z: number; nx: number; nz: number; k: number }[] = [];
  for (let i = 1; i < COAST.length; i++) {
    const [x0, z0] = COAST[i - 1];
    const [x1, z1] = COAST[i];
    const len = Math.hypot(x1 - x0, z1 - z0);
    const nx = -(z1 - z0) / len;
    const nz = (x1 - x0) / len;
    for (let d = 0; d < len; d += 1.3) {
      const x = x0 + ((x1 - x0) * d) / len + nx * BREAK_S;
      const z = z0 + ((z1 - z0) * d) / len + nz * BREAK_S;
      if (x > -48 && x < 44 && z > -48) out.push({ x, z, nx, nz, k: Number.NaN });
    }
  }
  return out;
};

const CAMERA_BASE = new THREE.Vector3(0, 2.6, 20);
const SUN_AZIMUTH = THREE.MathUtils.degToRad(21); // left of centre
const SUN_EL_START = THREE.MathUtils.degToRad(0); // half risen at page load
const SUN_EL_END = THREE.MathUtils.degToRad(6); // upper half tucked behind the sun cloud
const SUN_RADIUS = THREE.MathUtils.degToRad(2.5);

const hash1 = (n: number) => {
  const v = Math.sin(n * 127.1) * 43758.5453;
  return v - Math.floor(v);
};
const col = (hex: string) => new THREE.Color(hex);

// ─── GLSL ──────────────────────────────────────────────────────────────────

const COMMON = /* glsl */ `
uniform float uTime;
uniform float uProgress;
uniform vec3 uSunDir;
uniform vec3 uFogColor;
uniform float uFogDensity;
uniform vec3 uGrade;
uniform float uReflStrength;
uniform vec3 uReflFar;
uniform vec3 uReflMid;
uniform vec3 uReflNear;

vec3 applyFog(vec3 c, vec3 world) {
  float d = length(world - cameraPosition);
  float f = 1.0 - exp(-d * uFogDensity);
  return mix(c, uFogColor, f * 0.6);
}

// Glitter path: how closely the mirror direction from a tile lines up with the sun.
// Evaluated at the tile centre, so the path breaks into blocky, zig-zag pixels.
float glint(vec3 center, float hash) {
  vec3 V = normalize(cameraPosition - center);
  vec3 R = vec3(-V.x, V.y, -V.z);
  float da = atan(R.x, -R.z) - atan(uSunDir.x, -uSunDir.z) + (hash - 0.5) * 0.028;
  float de = asin(clamp(R.y, -1.0, 1.0)) - asin(clamp(uSunDir.y, -1.0, 1.0));
  return exp(-da * da / 0.0011) * exp(-de * de / 0.2);
}

vec3 reflColor(vec3 world) {
  float d = length(world - cameraPosition);
  vec3 c = mix(uReflNear, uReflMid, smoothstep(8.0, 22.0, d));
  return mix(c, uReflFar, smoothstep(22.0, 60.0, d));
}
`;

const WAVES = /* glsl */ `
const float P = ${PERIOD.toFixed(2)};
const float TB = ${BREAK_T.toFixed(2)};
const float SB = ${BREAK_S.toFixed(2)};
const float L0 = 20.0;

float hash1(float n) { return fract(sin(n * 127.1) * 43758.5453); }

// Height of the water column at signed shore distance s. foam: 0..1
float waterHeight(float s, float x, float t, float h, out float foam, out float rowShade) {
  float tt = t + x * ${PEEL.toFixed(3)};
  float k = floor(tt / P);
  float tau = tt - k * P;
  float amp = 0.9 + 0.6 * hash1(k);
  float v = (L0 + SB) / TB;
  float sc = -L0 + v * tau;
  float grow = clamp(tau / TB, 0.0, 1.0);
  float A = amp * (0.3 + 0.7 * grow * grow);
  float after = max(tau - TB, 0.0);
  A *= exp(-after * 5.0);
  float d = s - sc;
  float wF = mix(2.8, 0.9, grow);   // steep shoreward face as it nears the break
  float wB = mix(3.6, 2.2, grow);
  float g = d > 0.0 ? exp(-d * d / (wF * wF)) : exp(-d * d / (wB * wB));
  float hh = A * g;
  foam = smoothstep(0.86, 0.98, g) * smoothstep(0.8, 1.0, grow) * step(tau, TB + 0.2);

  // whitewater surge between the break line and the shore after the crash
  float surge = smoothstep(0.0, 0.25, after) * (1.0 - smoothstep(0.8, 2.6, after));
  float zone = smoothstep(SB - 3.5, SB, s);
  hh += surge * zone * (0.25 + 0.35 * h);
  foam = max(foam, surge * smoothstep(-2.4, -1.2, s) * step(0.5, h + 0.25 * sin(t * 3.0 + x)));

  // terraces: broad flat steps that climb away from the shore, each front edge a foam lip.
  // The edges wander slowly along the shore so the steps feel alive.
  float wob = sin(x * 0.11 + t * 0.25) * 0.9 + sin(x * 0.37 - t * 0.4) * 0.35;
  float band = (-s + wob) / 6.5;
  float lvl = clamp(floor(band), 0.0, 4.0);
  float fr = fract(band);
  rowShade = hash1(lvl * 7.0 + 3.0);
  hh += lvl * 0.2 + 0.03 * sin(t * 0.8 + x * 0.2);
  foam = max(foam, step(fr, 0.1) * step(1.0, band) * step(band, 4.0));

  // the water's edge sits on top of the sand with a foam rim
  float rim = smoothstep(-1.6, -1.0, s);
  hh += rim * 0.08;
  foam = max(foam, rim);
  return hh;
}

// How far up the sand the current wave has washed. a = seconds since its crash.
float runup(float x, float t, out float a, out float R, out float Rprev) {
  float tt = t + x * ${PEEL.toFixed(3)};
  float k = floor(tt / P);
  float tau = tt - k * P;
  R = 4.0 + 3.0 * hash1(k + 17.0);
  Rprev = 4.0 + 3.0 * hash1(k + 16.0);
  a = tau - TB;
  if (a <= 0.0) return 0.0;
  if (a < 1.1) return R * sin(a / 1.1 * 1.5708);
  return R * (1.0 - smoothstep(0.0, 2.6, a - 1.1));
}

float wetness(float s, float a, float R, float Rprev) {
  float base = 0.3 * exp(-s / 10.0);
  float w = 0.0;
  if (s < R && a > 0.0) {
    float uncovered = 1.1 + 2.6 * (1.0 - s / R);
    w = a < uncovered ? 1.0 : exp(-(a - uncovered) / 3.5);
  }
  if (s < Rprev) {
    float uncovered = 1.1 + 2.6 * (1.0 - s / Rprev);
    float ap = a + P;
    w = max(w, ap < uncovered ? 1.0 : exp(-(ap - uncovered) / 3.5));
  }
  return max(w, base);
}
`;

// Vertices in the upper half of the unit cube follow the top, the lower half the
// bottom, so columns stretch without stretching their rounded corners.
const COLUMN = /* glsl */ `
float columnY(float py, float top, float bottom) {
  return py > 0.0 ? top - (0.5 - py) : bottom + (py + 0.5);
}
`;

const waterVert = /* glsl */ `
${COMMON}
${WAVES}
${COLUMN}
attribute vec4 aCell; // x, z, s, hash
varying vec3 vN;
varying vec3 vWorld;
varying vec3 vCenter;
varying float vFoam;
varying float vH;
varying float vHash;
void main() {
  float foam, rowShade;
  float h = waterHeight(aCell.z, aCell.x, uTime, aCell.w, foam, rowShade);
  h = floor(h * 5.0 + 0.5) / 5.0;
  float top = h + 0.04;
  float bottom = min(top - 1.0, -1.6);
  vec3 p = position;
  vec3 world = vec3(aCell.x + p.x, columnY(p.y, top, bottom), aCell.y + p.z);
  vN = normal;
  vWorld = world;
  vCenter = vec3(aCell.x, top, aCell.y);
  vFoam = foam;
  vH = h;
  vHash = rowShade * 0.7 + aCell.w * 0.3;
  gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
}
`;

const waterFrag = /* glsl */ `
${COMMON}
uniform vec3 uDeep;
uniform vec3 uMid;
uniform vec3 uHigh;
uniform vec3 uCrest;
uniform vec3 uFoam;
uniform vec3 uFarC;
varying vec3 vN;
varying vec3 vWorld;
varying vec3 vCenter;
varying float vFoam;
varying float vH;
varying float vHash;
void main() {
  vec3 n = normalize(vN);
  float up = smoothstep(0.35, 0.9, n.y);
  float t = clamp((vH + 0.3) / 2.2, 0.0, 1.0);
  vec3 top = mix(uDeep, uMid, smoothstep(0.0, 0.3, t) * 0.8 + vHash * 0.2);
  top = mix(top, uHigh, smoothstep(0.3, 0.7, t));
  top = mix(top, uCrest, smoothstep(0.7, 1.0, t));
  top = mix(top, uFarC, smoothstep(18.0, 60.0, length(vCenter - cameraPosition)) * 0.7);
  vec2 sunXZ = normalize(uSunDir.xz + 1e-4);
  float lit = max(dot(normalize(n.xz + 1e-4), sunXZ), 0.0) * (1.0 - up);
  vec3 side = uDeep * (0.8 + 0.3 * lit);
  vec3 c = mix(side, top, up);
  c = mix(c, uFoam, vFoam * (0.65 + 0.35 * up));
  float g = glint(vCenter, vHash) * uReflStrength;
  c = mix(c, reflColor(vCenter) * 1.15, g * up * (1.0 - vFoam));
  c = applyFog(c, vWorld) * uGrade;
  gl_FragColor = vec4(c, 1.0);
}
`;

const sandVert = /* glsl */ `
${COMMON}
${WAVES}
${COLUMN}
attribute vec4 aCell; // x, z, s, hash
attribute float aTerrace;
uniform float uTile;
varying vec3 vN;
varying vec3 vWorld;
varying vec3 vCenter;
varying float vFoam;
varying float vWet;
varying float vHash;
varying float vTerrace;
varying float vPuddle;
void main() {
  float a, R, Rprev;
  float r = runup(aCell.x, uTime, a, R, Rprev);
  float s = aCell.z;
  float flatBeach = 1.0 - step(0.01, aTerrace);
  float retreat = smoothstep(0.0, 2.6, a - 1.1);
  float edge = r - aCell.w * 0.9;
  float foam = flatBeach * step(0.0, a) * step(s, edge) * step(edge - 1.8 - aCell.w * 1.4, s)
    * step(aCell.w, 1.0 - retreat * 0.6);
  float wet = flatBeach * wetness(s, a, R, Rprev);
  float puddle = flatBeach * step(aCell.w, 0.05) * step(3.0, s);
  float top = aTerrace + aCell.w * 0.03 + foam * 0.14 - puddle * 0.12;
  vec3 p = position;
  vec3 world = vec3(aCell.x + p.x * uTile, columnY(p.y, top, top - 1.0), aCell.y + p.z * uTile);
  vPuddle = puddle;
  vN = normal;
  vWorld = world;
  vCenter = vec3(aCell.x, top, aCell.y);
  vFoam = foam;
  vWet = wet;
  vHash = aCell.w;
  vTerrace = aTerrace;
  gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
}
`;

const sandFrag = /* glsl */ `
${COMMON}
uniform vec3 uWet;
uniform vec3 uWetDark;
uniform vec3 uDry;
uniform vec3 uSide;
uniform vec3 uFar;
uniform vec3 uFoam;
uniform vec3 uPuddle;
uniform vec3 uSkyTint;
varying vec3 vN;
varying vec3 vWorld;
varying vec3 vCenter;
varying float vFoam;
varying float vWet;
varying float vHash;
varying float vTerrace;
varying float vPuddle;
void main() {
  vec3 n = normalize(vN);
  float up = smoothstep(0.35, 0.9, n.y);
  float fresh = smoothstep(0.6, 1.0, vWet);
  vec3 top = mix(uDry, uWet, clamp(vWet + 0.35, 0.0, 1.0));
  top = mix(top, uWetDark, fresh * 0.7);
  top *= 0.96 + vHash * 0.08;
  top = mix(top, uPuddle, vPuddle * 0.85);
  float dist = length(vWorld - cameraPosition);
  top = mix(top, uFar, smoothstep(25.0, 70.0, dist) * 0.55 + smoothstep(0.0, 2.0, vTerrace) * 0.2);
  vec3 V = normalize(cameraPosition - vWorld);
  float fres = pow(1.0 - clamp(V.y, 0.0, 1.0), 4.0);
  top = mix(top, uSkyTint, (0.08 + 0.28 * fres) * (1.0 - vFoam));
  vec2 sunXZ = normalize(uSunDir.xz + 1e-4);
  float lit = max(dot(normalize(n.xz + 1e-4), sunXZ), 0.0) * (1.0 - up);
  vec3 side = uSide * (0.85 + 0.35 * lit);
  vec3 c = mix(side, top, up);
  c = mix(c, uFoam, vFoam);
  float g = glint(vCenter, vHash) * uReflStrength * (0.75 + 0.25 * max(vWet, vPuddle));
  c = mix(c, reflColor(vCenter), g * up * (1.0 - vFoam) * 0.9);
  c = applyFog(c, vWorld) * uGrade;
  gl_FragColor = vec4(c, 1.0);
}
`;

// Clouds and spray: plain instanced voxels shaded by which way each face points.
const voxelVert = /* glsl */ `
attribute float aShade; // 0 at the bottom layer of a cloud, 1 at the top; 0 for everything else
varying vec3 vN;
varying vec3 vWorld;
varying float vShade;
void main() {
  vShade = aShade;
  mat4 m = modelMatrix * instanceMatrix;
  vec4 w = m * vec4(position, 1.0);
  vN = normalize(mat3(m) * normal);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;

const voxelFrag = /* glsl */ `
${COMMON}
uniform vec3 uTop;
uniform vec3 uSideC;
uniform vec3 uUnder;
uniform vec3 uWarm;
uniform vec3 uLit;
uniform vec3 uHaze;
uniform float uHazeAmt;
uniform float uWarmth;
varying vec3 vN;
varying vec3 vWorld;
varying float vShade;
void main() {
  vec3 n = normalize(vN);
  float up = smoothstep(0.2, 0.9, n.y);
  float down = smoothstep(0.2, 0.9, -n.y);
  vec2 sunXZ = normalize(uSunDir.xz + 1e-4);
  float facing = max(dot(normalize(n.xz + 1e-4), sunXZ), 0.0) * (1.0 - up - down);
  vec3 c = mix(uSideC, uTop, up);
  c = mix(c, mix(uUnder, uWarm, 0.45 * uWarmth), down);
  c = mix(c, uLit, facing * 0.5 * uWarmth);
  c *= 0.93 + vShade * 0.14;
  c = mix(c, uHaze, uHazeAmt);
  gl_FragColor = vec4(c * uGrade, 1.0);
}
`;

const farSeaVert = /* glsl */ `
varying vec3 vWorld;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;

const farSeaFrag = /* glsl */ `
${COMMON}
uniform vec3 uNear;
uniform vec3 uFar;
uniform vec3 uDeep;
varying vec3 vWorld;
float h2(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
void main() {
  float d = length(vWorld.xz - cameraPosition.xz);
  vec2 cell = floor(vWorld.xz / 2.0);
  float hsh = h2(cell);
  vec3 c = mix(uDeep, uNear, smoothstep(10.0, 90.0, d));
  c = mix(c, uFar, smoothstep(90.0, 600.0, d));
  float band = step(0.55, fract(vWorld.z * 0.12 + sin(vWorld.x * 0.04) * 0.4));
  c *= 1.0 + band * 0.06 * (1.0 - smoothstep(60.0, 400.0, d));
  vec3 center = vec3((cell.x + 0.5) * 2.0, vWorld.y, (cell.y + 0.5) * 2.0);
  float g = glint(center, hsh) * uReflStrength;
  c = mix(c, reflColor(center) * 1.2, g);
  gl_FragColor = vec4(c * uGrade, 1.0);
}
`;

const skyVert = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = position;
  vec4 w = modelMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;

const skyFrag = /* glsl */ `
uniform vec3 uStops[10];
uniform float uStopPos[10];
uniform vec3 uSunDir;
uniform float uSunRadius;
uniform vec3 uSunCore;
uniform vec3 uSunEdge;
uniform vec3 uSunRim;
uniform vec3 uGlow;
uniform float uGlowAmt;
varying vec3 vDir;
void main() {
  vec3 d = normalize(vDir);
  float el = asin(clamp(d.y, -1.0, 1.0));
  vec3 c = uStops[0];
  for (int i = 1; i < 10; i++) {
    float t = smoothstep(uStopPos[i - 1], uStopPos[i], el);
    c = mix(c, uStops[i], t);
  }
  float ang = acos(clamp(dot(d, uSunDir), -1.0, 1.0));
  c += uGlow * (0.45 * exp(-ang * ang / 0.01) + 0.18 * exp(-ang / 0.4)) * uGlowAmt;

  // Sun disk, snapped to a pixel grid so its edge steps like the voxel world.
  float sunEl = asin(clamp(uSunDir.y, -1.0, 1.0));
  vec2 q = vec2((atan(d.x, -d.z) - atan(uSunDir.x, -uSunDir.z)) * cos(sunEl), el - sunEl);
  float px = uSunRadius / 5.5;
  vec2 qq = (floor(q / px) + 0.5) * px;
  float r = length(qq) / uSunRadius;
  if (r < 1.0) {
    vec3 sc = mix(uSunCore, uSunEdge, smoothstep(0.15, 0.75, r));
    sc = mix(sc, uSunRim, smoothstep(0.75, 1.0, r));
    c = sc * 1.35;
  }
  gl_FragColor = vec4(c, 1.0);
}
`;

const particleVert = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
attribute float aSeed;
varying float vAlpha;
void main() {
  vec3 p = position;
  p.y += sin(uTime * 0.35 + aSeed * 6.28) * 0.35;
  p.x += sin(uTime * 0.2 + aSeed * 12.0) * 0.6;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = (0.18 + aSeed * 0.12) * uPixelRatio * 520.0 / -mv.z;
  vAlpha = 0.45 + 0.55 * (0.5 + 0.5 * sin(uTime * (0.8 + aSeed) + aSeed * 40.0));
  gl_Position = projectionMatrix * mv;
}
`;

const particleFrag = /* glsl */ `
uniform vec3 uColor;
uniform float uOpacity;
varying float vAlpha;
void main() {
  vec2 c = abs(gl_PointCoord - 0.5);
  float a = 1.0 - smoothstep(0.3, 0.5, max(c.x, c.y));
  gl_FragColor = vec4(uColor * 1.6, a * vAlpha * uOpacity);
}
`;

// Light rays: smear the bright sky around the sun outward, so it streams through cloud gaps.
const RaysShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    uSun: { value: new THREE.Vector2(0.2, 0.5) },
    uStrength: { value: 0 },
    uTint: { value: new THREE.Color(SUN.glow) },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform vec2 uSun;
    uniform float uStrength;
    uniform vec3 uTint;
    varying vec2 vUv;
    void main() {
      vec3 c = texture2D(tDiffuse, vUv).rgb;
      if (uStrength > 0.001) {
        vec2 delta = (vUv - uSun) / 32.0;
        vec2 uv = vUv;
        float decay = 1.0;
        float acc = 0.0;
        for (int i = 0; i < 32; i++) {
          uv -= delta;
          vec3 s = texture2D(tDiffuse, uv).rgb;
          acc += max(dot(s, vec3(0.2126, 0.7152, 0.0722)) - 0.72, 0.0) * decay;
          decay *= 0.955;
        }
        float fall = 1.0 - smoothstep(0.0, 0.85, length((vUv - uSun) * vec2(1.7, 1.0)));
        c += uTint * acc * uStrength * fall / 32.0;
      }
      gl_FragColor = vec4(c, 1.0);
    }
  `,
};

// Soft focus on the foreground and top edge, film grain and a light vignette.
const FinishShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    uRes: { value: new THREE.Vector2(1, 1) },
    uTime: { value: 0 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform vec2 uRes;
    uniform float uTime;
    varying vec2 vUv;
    void main() {
      vec3 c = texture2D(tDiffuse, vUv).rgb;
      float b = smoothstep(0.26, 0.0, vUv.y) + smoothstep(0.82, 1.0, vUv.y) * 0.35;
      if (b > 0.01) {
        vec3 acc = c;
        float w = 1.0;
        float rad = b * 5.0;
        for (int i = 0; i < 12; i++) {
          float a = float(i) * 0.5236;
          vec2 o = vec2(cos(a), sin(a)) * rad / uRes;
          acc += texture2D(tDiffuse, vUv + o).rgb;
          acc += texture2D(tDiffuse, vUv + o * 0.5).rgb;
          w += 2.0;
        }
        c = acc / w;
      }
      float g = fract(sin(dot(floor(vUv * uRes) + fract(uTime) * 91.0, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
      c += g * 0.03;
      vec2 v = vUv - 0.5;
      c *= 1.0 - dot(v, v) * 0.3;
      gl_FragColor = vec4(c, 1.0);
    }
  `,
};

// ─── Scene ─────────────────────────────────────────────────────────────────

export type ShorelineHandle = {
  setProgress: (p: number) => void;
  setPointer: (x: number, y: number) => void;
  setActive: (active: boolean) => void;
  resize: () => void;
  dispose: () => void;
};

type Spray = {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  axis: THREE.Vector3;
  spin: number;
  age: number;
  life: number;
  size: number;
};

export function createShoreline(
  canvas: HTMLCanvasElement,
  opts: { reducedMotion: boolean },
): ShorelineHandle {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 16 / 9, 0.5, 2500);
  camera.rotation.order = "YXZ";
  camera.position.copy(CAMERA_BASE);

  const shared = {
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uSunDir: { value: new THREE.Vector3() },
    uFogColor: { value: new THREE.Color() },
    uFogDensity: { value: 0.006 },
    uGrade: { value: new THREE.Vector3(1, 1, 1) },
    uReflStrength: { value: 0 },
    uReflFar: { value: col(REFLECTION.far) },
    uReflMid: { value: col(REFLECTION.mid) },
    uReflNear: { value: col(REFLECTION.near) },
  };

  const disposables: { dispose: () => void }[] = [];
  const track = <T extends { dispose: () => void }>(o: T) => {
    disposables.push(o);
    return o;
  };

  // Sky dome, follows the camera.
  const skyStopsMorning = SKY_MORNING.map(col);
  const skyStopsDawn = SKY_DAWN.map(col);
  const skyUniforms = {
    uStops: { value: SKY_MORNING.map(col) },
    uStopPos: { value: SKY_STOPS_DEG.map((d) => THREE.MathUtils.degToRad(d)) },
    uSunDir: shared.uSunDir,
    uSunRadius: { value: SUN_RADIUS },
    uSunCore: { value: col(SUN.core) },
    uSunEdge: { value: col(SUN.edge) },
    uSunRim: { value: col(SUN.rim) },
    uGlow: { value: col(SUN.glow) },
    uGlowAmt: { value: 1 },
  };
  const sky = new THREE.Mesh(
    track(new THREE.SphereGeometry(1000, 48, 24)),
    track(
      new THREE.ShaderMaterial({
        uniforms: skyUniforms,
        vertexShader: skyVert,
        fragmentShader: skyFrag,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    ),
  );
  sky.renderOrder = -1;
  scene.add(sky);

  // Far sea plane beyond the voxel water.
  const farSea = new THREE.Mesh(
    track(new THREE.PlaneGeometry(3200, 1560)),
    track(
      new THREE.ShaderMaterial({
        uniforms: {
          ...shared,
          uNear: { value: col(WATER.farNear) },
          uFar: { value: col(WATER.far) },
          uDeep: { value: col(WATER.mid) },
        },
        vertexShader: farSeaVert,
        fragmentShader: farSeaFrag,
      }),
    ),
  );
  farSea.rotation.x = -Math.PI / 2;
  farSea.position.set(0, 0.8, -46 - 780);
  scene.add(farSea);

  // Voxel water and sand. Cells outside the view are skipped; distant cells use a plain
  // box because their rounded edges are too small to see.
  const NEAR = 24;
  const MAX_YAW = THREE.MathUtils.degToRad(38);
  const rounded = track(new RoundedBoxGeometry(1, 1, 1, 1, 0.14));
  const tile = track(new RoundedBoxGeometry(1, 1, 1, 1, 0.05));
  const plain = track(new THREE.BoxGeometry(1, 1, 1));
  const SAND_TILE = 2;
  const terraceLevel = (x: number, z: number, s: number) => {
    const rise = Math.floor((s - 2.5) * 0.25 + (x - 8) * 0.15);
    const nearCut = Math.max(0, Math.floor((z + 6) * 0.25));
    return THREE.MathUtils.clamp(rise - nearCut, 0, 5) * 0.5;
  };
  const inView = (x: number, z: number) => {
    const dz = CAMERA_BASE.z - z;
    return dz >= 1 && Math.abs(Math.atan2(x - CAMERA_BASE.x, dz)) <= MAX_YAW;
  };

  type Bucket = { cells: number[]; terraces: number[] };
  const bucket = (): Bucket => ({ cells: [], terraces: [] });
  const water = { near: bucket(), far: bucket() };
  const sand = { near: bucket(), far: bucket() };
  for (let x = -56; x <= 56; x++) {
    for (let z = -64; z <= 17; z++) {
      if (!inView(x, z)) continue;
      const dist = Math.hypot(x - CAMERA_BASE.x, CAMERA_BASE.z - z);
      const s = shoreDist(x, z);
      if (s >= 0 || s < -44 || dist > 70) continue;
      (dist < NEAR ? water.near : water.far).cells.push(x, z, s, hash1(x * 31.7 + z * 7.3));
    }
  }
  for (let x = -56; x <= 56; x += SAND_TILE) {
    for (let z = -52; z <= 18; z += SAND_TILE) {
      if (!inView(x, z)) continue;
      const s = shoreDist(x, z);
      if (s < 0) continue;
      const dist = Math.hypot(x - CAMERA_BASE.x, CAMERA_BASE.z - z);
      const b = dist < NEAR ? sand.near : sand.far;
      b.cells.push(x, z, s, hash1(x * 17.1 + z * 3.9));
      b.terraces.push(terraceLevel(x, z, s));
    }
  }

  const makeCells = (
    base: THREE.BufferGeometry,
    b: Bucket,
    material: THREE.ShaderMaterial,
    withTerrace: boolean,
  ) => {
    const geo = track(base.clone());
    geo.setAttribute("aCell", new THREE.InstancedBufferAttribute(new Float32Array(b.cells), 4));
    if (withTerrace) {
      geo.setAttribute("aTerrace", new THREE.InstancedBufferAttribute(new Float32Array(b.terraces), 1));
    }
    const mesh = new THREE.InstancedMesh(geo, material, b.cells.length / 4);
    mesh.frustumCulled = false; // positions come from the shader
    scene.add(mesh);
    return mesh;
  };

  const waterMaterial = track(
      new THREE.ShaderMaterial({
        uniforms: {
          ...shared,
          uDeep: { value: col(WATER.deep) },
          uMid: { value: col(WATER.mid) },
          uHigh: { value: col(WATER.high) },
          uCrest: { value: col(WATER.crest) },
          uFoam: { value: col(WATER.foam) },
          uFarC: { value: col(WATER.far) },
        },
        vertexShader: waterVert,
        fragmentShader: waterFrag,
      }),
  );
  makeCells(rounded, water.near, waterMaterial, false);
  makeCells(plain, water.far, waterMaterial, false);

  const sandMaterial = track(
      new THREE.ShaderMaterial({
        uniforms: {
          ...shared,
          uWet: { value: col(SAND.wet) },
          uWetDark: { value: col(SAND.wetDark) },
          uDry: { value: col(SAND.dry) },
          uSide: { value: col(SAND.side) },
          uFar: { value: col(SAND.far) },
          uFoam: { value: col(WATER.foam) },
          uPuddle: { value: col(SAND.puddle) },
          uSkyTint: { value: new THREE.Color() },
          uTile: { value: SAND_TILE - 0.06 },
        },
        vertexShader: sandVert,
        fragmentShader: sandFrag,
      }),
  );
  makeCells(tile, sand.near, sandMaterial, true);
  makeCells(plain, sand.far, sandMaterial, true);

  // Chips: small stones and shell bits lying half-sunk in the sand.
  let chipSeed = 11;
  const crnd = () => {
    chipSeed = (chipSeed * 16807) % 2147483647;
    return (chipSeed % 10000) / 10000;
  };
  const chipMatrices: THREE.Matrix4[] = [];
  for (let i = 0; i < 900 && chipMatrices.length < 230; i++) {
    const x = -30 + crnd() * 64;
    const z = -40 + crnd() * 57;
    const s = shoreDist(x, z);
    if (s < 1.5 || !inView(x, z) || Math.hypot(x, CAMERA_BASE.z - z) > 46) continue;
    const gx = Math.round(x / SAND_TILE) * SAND_TILE;
    const gz = Math.round(z / SAND_TILE) * SAND_TILE;
    const top = terraceLevel(gx, gz, shoreDist(gx, gz));
    const len = 0.28 + crnd() * 0.6;
    const wide = 0.1 + crnd() * 0.18;
    const tall = 0.05 + crnd() * 0.07;
    chipMatrices.push(
      new THREE.Matrix4().compose(
        new THREE.Vector3(x, top + 0.03 + tall * 0.35, z),
        new THREE.Quaternion().setFromEuler(new THREE.Euler((crnd() - 0.5) * 0.12, crnd() * Math.PI, (crnd() - 0.5) * 0.12)),
        new THREE.Vector3(len, tall, wide),
      ),
    );
  }
  const chips = new THREE.InstancedMesh(
    track(new RoundedBoxGeometry(1, 1, 1, 1, 0.04)),
    track(
      new THREE.ShaderMaterial({
        uniforms: {
          ...shared,
          uTop: { value: col(SAND.chipTop) },
          uSideC: { value: col(SAND.chipSide) },
          uUnder: { value: col(SAND.chipSide) },
          uWarm: { value: col(SAND.chipSide) },
          uLit: { value: col(REFLECTION.mid) },
          uHaze: { value: col(SAND.far) },
          uHazeAmt: { value: 0 },
          uWarmth: { value: 0.5 },
        },
        vertexShader: voxelVert,
        fragmentShader: voxelFrag,
      }),
    ),
    chipMatrices.length,
  );
  chipMatrices.forEach((m, i) => chips.setMatrixAt(i, m));
  chips.instanceMatrix.needsUpdate = true;
  scene.add(chips);

  // Clouds: flat, layered voxel slabs at the edges of the frame.
  const cloudMaterial = track(
    new THREE.ShaderMaterial({
      uniforms: {
        ...shared,
        uTop: { value: col(CLOUD.top) },
        uSideC: { value: col(CLOUD.side) },
        uUnder: { value: col(CLOUD.under) },
        uWarm: { value: col(CLOUD.warm) },
        uLit: { value: col(CLOUD.lit) },
        uHaze: { value: col(SKY_MORNING[6]) },
        uHazeAmt: { value: 0.18 },
        uWarmth: { value: 1 },
      },
      vertexShader: voxelVert,
      fragmentShader: voxelFrag,
    }),
  );
  const cloudVoxels: THREE.Matrix4[] = [];
  const VOX = 4.2;
  const atAngles = (azDeg: number, elDeg: number, dist: number) => {
    const az = THREE.MathUtils.degToRad(azDeg);
    const el = THREE.MathUtils.degToRad(elDeg);
    return new THREE.Vector3(
      CAMERA_BASE.x + Math.sin(az) * Math.cos(el) * dist,
      CAMERA_BASE.y + Math.sin(el) * dist,
      CAMERA_BASE.z - Math.cos(az) * Math.cos(el) * dist,
    );
  };
  let seed = 3;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed % 10000) / 10000;
  };
  const cloudShades: number[] = [];
  const LAYER = VOX * 0.42; // thin layers stacked up give the clouds their density
  const slab = (base: THREE.Vector3, widthVox: number, layers: number, depthVox: number) => {
    for (let j = 0; j < layers; j++) {
      const bulge = Math.sin(((j + 0.5) / layers) * Math.PI); // widest in the middle layers
      const half = (widthVox / 2) * (0.55 + 0.45 * bulge) * (0.88 + rnd() * 0.24);
      const shift = (rnd() - 0.5) * widthVox * 0.22;
      const depth = Math.max(2, Math.round(depthVox * (0.5 + 0.5 * bulge)));
      for (let i = -Math.ceil(half); i <= Math.ceil(half); i++) {
        const edge = Math.abs(i) > half - 1 - rnd() * 2.5;
        for (let k = 0; k < depth; k++) {
          if (edge && rnd() < 0.5) continue;
          cloudVoxels.push(
            new THREE.Matrix4().compose(
              new THREE.Vector3(
                base.x + (i + shift) * VOX,
                base.y + (j + 0.5) * LAYER,
                base.z + (k - depth / 2) * VOX,
              ),
              new THREE.Quaternion(),
              new THREE.Vector3(VOX, LAYER, VOX),
            ),
          );
          cloudShades.push(layers > 1 ? j / (layers - 1) : 0.5);
        }
      }
    }
  };
  slab(atAngles(-31, 14.5, 270), 34, 7, 8); // top-left, running off the frame
  // Sun cloud: its bottom sits exactly at the sun's final height, hiding the upper half.
  slab(atAngles(-28, THREE.MathUtils.radToDeg(SUN_EL_END), 250), 17, 6, 7);
  slab(atAngles(33, 8.8, 280), 26, 5, 6); // right edge
  const cloudGeo = track(new THREE.BoxGeometry(1, 1, 1));
  cloudGeo.setAttribute("aShade", new THREE.InstancedBufferAttribute(new Float32Array(cloudShades), 1));
  const clouds = new THREE.InstancedMesh(cloudGeo, cloudMaterial, cloudVoxels.length);
  cloudVoxels.forEach((m, i) => clouds.setMatrixAt(i, m));
  clouds.instanceMatrix.needsUpdate = true;
  scene.add(clouds);

  // Spray cubes thrown up when a wave crashes.
  const SPRAY_MAX = 420;
  const sprayMesh = new THREE.InstancedMesh(
    track(new RoundedBoxGeometry(1, 1, 1, 1, 0.18)),
    track(
      new THREE.ShaderMaterial({
        uniforms: {
          ...shared,
          uTop: { value: col(WATER.foam) },
          uSideC: { value: col("#cfdbe5") },
          uUnder: { value: col(WATER.crest) },
          uWarm: { value: col(REFLECTION.mid) },
          uLit: { value: col("#fff4e6") },
          uHaze: { value: col(WATER.foam) },
          uHazeAmt: { value: 0 },
          uWarmth: { value: 0.35 },
        },
        vertexShader: voxelVert,
        fragmentShader: voxelFrag,
      }),
    ),
    SPRAY_MAX,
  );
  sprayMesh.frustumCulled = false;
  sprayMesh.count = 0;
  scene.add(sprayMesh);
  const sprays: Spray[] = [];
  const sprayPool: Spray[] = [];
  const slots = breakLine();

  const spawnSpray = (slot: (typeof slots)[number], k: number) => {
    const { x, z, nx, nz } = slot;
    const amp = 0.9 + 0.6 * hash1(k);
    const count = 2 + Math.floor(rnd() * 3);
    for (let n = 0; n < count && sprays.length < SPRAY_MAX; n++) {
      const sp = sprayPool.pop() ?? {
        pos: new THREE.Vector3(),
        vel: new THREE.Vector3(),
        axis: new THREE.Vector3(),
        spin: 0,
        age: 0,
        life: 1,
        size: 0.3,
      };
      sp.pos.set(x + (rnd() - 0.5) * 1.2, amp * 0.9 + 0.1 + rnd() * 0.5, z + (rnd() - 0.5) * 0.8);
      sp.vel.set(
        nx * 2.2 + (rnd() - 0.5) * 1.4,
        2.2 + rnd() * 2.6,
        nz * 2.2 + (rnd() - 0.5) * 1.4,
      );
      sp.axis.set(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize();
      sp.spin = (rnd() - 0.5) * 9;
      sp.age = 0;
      sp.life = 1.0 + rnd() * 0.7;
      sp.size = 0.2 + rnd() * 0.3;
      sprays.push(sp);
    }
  };

  const tmpM = new THREE.Matrix4();
  const tmpQ = new THREE.Quaternion();
  const tmpS = new THREE.Vector3();
  const updateSpray = (t: number, dt: number) => {
    for (const slot of slots) {
      const k = Math.floor((t + slot.x * PEEL - BREAK_T) / PERIOD);
      if (Number.isNaN(slot.k)) slot.k = k;
      else if (k > slot.k) {
        slot.k = k;
        spawnSpray(slot, k);
      }
    }
    let n = 0;
    for (let i = sprays.length - 1; i >= 0; i--) {
      const sp = sprays[i];
      sp.age += dt;
      sp.vel.y -= 7.5 * dt;
      sp.pos.addScaledVector(sp.vel, dt);
      if (sp.age > sp.life || sp.pos.y < -0.6) {
        sprays.splice(i, 1);
        sprayPool.push(sp);
        continue;
      }
      const f = sp.age / sp.life;
      tmpQ.setFromAxisAngle(sp.axis, sp.spin * sp.age);
      tmpS.setScalar(sp.size * (1 - f * f));
      tmpM.compose(sp.pos, tmpQ, tmpS);
      sprayMesh.setMatrixAt(n++, tmpM);
    }
    sprayMesh.count = n;
    sprayMesh.instanceMatrix.needsUpdate = true;
  };

  // Floating motes of light near the horizon.
  const MOTES = 56;
  const motePos = new Float32Array(MOTES * 3);
  const moteSeed = new Float32Array(MOTES);
  for (let i = 0; i < MOTES; i++) {
    motePos[i * 3] = -42 + rnd() * 72;
    motePos[i * 3 + 1] = 0.4 + rnd() * 3.4;
    motePos[i * 3 + 2] = -48 + rnd() * 40;
    moteSeed[i] = rnd();
  }
  const moteGeo = track(new THREE.BufferGeometry());
  moteGeo.setAttribute("position", new THREE.BufferAttribute(motePos, 3));
  moteGeo.setAttribute("aSeed", new THREE.BufferAttribute(moteSeed, 1));
  const moteUniforms = {
    uTime: shared.uTime,
    uPixelRatio: { value: renderer.getPixelRatio() },
    uColor: { value: col(PARTICLE) },
    uOpacity: { value: 1 },
  };
  const motes = new THREE.Points(
    moteGeo,
    track(
      new THREE.ShaderMaterial({
        uniforms: moteUniforms,
        vertexShader: particleVert,
        fragmentShader: particleFrag,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    ),
  );
  motes.frustumCulled = false;
  scene.add(motes);

  // Post-processing.
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const rays = new ShaderPass(RaysShader);
  composer.addPass(rays);
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.42, 0.7, 0.9);
  composer.addPass(bloom);
  const finish = new ShaderPass(FinishShader);
  composer.addPass(finish);
  composer.addPass(new OutputPass());

  // ─── State ───
  let progressTarget = opts.reducedMotion ? 1 : 0;
  let progress = progressTarget;
  const pointer = new THREE.Vector2();
  const pointerSmooth = new THREE.Vector2();
  let pitch = 0;
  let active = true;
  let raf = 0;
  let last = performance.now();
  let time = opts.reducedMotion ? 2.4 : 0;
  let hold = false; // dev: keeps time still while frames keep rendering

  const tmpColor = new THREE.Color();
  const sunWorld = new THREE.Vector3();
  const applyProgress = (p: number) => {
    const eased = 1 - (1 - p) * (1 - p);
    const el = THREE.MathUtils.lerp(SUN_EL_START, SUN_EL_END, eased);
    const e = 0.4 + 0.6 * eased; // light and colour: early sunrise at the top of the page
    shared.uSunDir.value
      .set(-Math.sin(SUN_AZIMUTH) * Math.cos(el), Math.sin(el), -Math.cos(SUN_AZIMUTH) * Math.cos(el))
      .normalize();
    shared.uProgress.value = p;
    for (let i = 0; i < 10; i++) {
      skyUniforms.uStops.value[i].copy(skyStopsDawn[i]).lerp(skyStopsMorning[i], e);
    }
    skyUniforms.uGlowAmt.value = THREE.MathUtils.lerp(0.35, 1, e);
    shared.uFogColor.value.copy(skyStopsDawn[4]).lerp(skyStopsMorning[4], e);
    shared.uGrade.value.set(
      THREE.MathUtils.lerp(0.74, 1, e),
      THREE.MathUtils.lerp(0.78, 1, e),
      THREE.MathUtils.lerp(0.88, 1, e),
    );
    shared.uReflStrength.value = THREE.MathUtils.lerp(0.35, 1, eased);
    tmpColor.copy(skyStopsDawn[3]).lerp(skyStopsMorning[3], e);
    sandMaterial.uniforms.uSkyTint.value.copy(tmpColor);
    rays.uniforms.uStrength.value = THREE.MathUtils.lerp(0.35, 1.1, eased);
    cloudMaterial.uniforms.uWarmth.value = e;
    tmpColor.copy(skyStopsDawn[6]).lerp(skyStopsMorning[6], e);
    cloudMaterial.uniforms.uHaze.value.copy(tmpColor);
    moteUniforms.uOpacity.value = THREE.MathUtils.lerp(0.35, 1, e);
  };

  const layout = () => {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    bloom.resolution.set(w / 2, h / 2);
    const pr = renderer.getPixelRatio();
    finish.uniforms.uRes.value.set(w * pr, h * pr);
    moteUniforms.uPixelRatio.value = pr;
    const aspect = w / h;
    const halfH = THREE.MathUtils.degToRad(29); // keep roughly 58° across
    const vfov = THREE.MathUtils.clamp(
      THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(halfH) / aspect)),
      30,
      48,
    );
    camera.fov = vfov;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    // tilt up so the horizon sits about 65% of the way down the screen
    pitch = Math.atan(0.3 * Math.tan(THREE.MathUtils.degToRad(vfov / 2)));
  };

  const renderFrame = (dt: number) => {
    if (!hold) time += dt;
    shared.uTime.value = time;
    finish.uniforms.uTime.value = time;
    progress += (progressTarget - progress) * (1 - Math.exp(-dt * 6));
    applyProgress(progress);
    pointerSmooth.lerp(pointer, 1 - Math.exp(-dt * 3));
    camera.rotation.y = -pointerSmooth.x * THREE.MathUtils.degToRad(1.4);
    camera.rotation.x = pitch + pointerSmooth.y * THREE.MathUtils.degToRad(0.7);
    camera.position.set(CAMERA_BASE.x + pointerSmooth.x * 0.4, CAMERA_BASE.y, CAMERA_BASE.z);
    sky.position.copy(camera.position);
    clouds.position.x = Math.sin(time * 0.045) * 3.5; // slow drift
    camera.updateMatrixWorld();
    sunWorld.copy(shared.uSunDir.value).multiplyScalar(900).add(camera.position).project(camera);
    rays.uniforms.uSun.value.set(sunWorld.x * 0.5 + 0.5, sunWorld.y * 0.5 + 0.5);
    if (dt > 0 && !hold) updateSpray(time, dt);
    composer.render(dt);
  };

  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    const dt = Math.min((now - last) / 1000, 1 / 20);
    last = now;
    renderFrame(dt);
  };

  const start = () => {
    if (opts.reducedMotion || raf) return;
    last = performance.now();
    raf = requestAnimationFrame(loop);
  };
  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };

  layout();
  applyProgress(progress);
  renderFrame(0);
  start();

  const onVisibility = () => {
    if (document.hidden) stop();
    else if (active) start();
  };
  document.addEventListener("visibilitychange", onVisibility);

  // Dev-only hook for inspecting exact moments of the loop from the console.
  if (process.env.NODE_ENV !== "production") {
    (window as unknown as Record<string, unknown>).__shoreline = {
      freeze(t: number, p = 1) {
        hold = true;
        time = t;
        progress = progressTarget = p;
        renderFrame(0);
      },
      resume() {
        hold = false;
      },
      scene,
      composer,
      sample(points: [number, number][]) {
        renderFrame(0);
        const gl = renderer.getContext();
        const pr = renderer.getPixelRatio();
        const px = new Uint8Array(4);
        return points.map(([fx, fy]) => {
          gl.readPixels(
            Math.round(fx * canvas.clientWidth * pr),
            Math.round((1 - fy) * canvas.clientHeight * pr),
            1,
            1,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            px,
          );
          return "#" + [px[0], px[1], px[2]].map((v) => v.toString(16).padStart(2, "0")).join("");
        });
      },
    };
  }

  return {
    setProgress(p) {
      if (opts.reducedMotion) return;
      progressTarget = THREE.MathUtils.clamp(p, 0, 1);
    },
    setPointer(x, y) {
      if (opts.reducedMotion) return;
      pointer.set(x, y);
    },
    setActive(on) {
      active = on;
      if (on && !document.hidden) start();
      else stop();
    },
    resize() {
      layout();
      if (opts.reducedMotion || !raf) renderFrame(0);
    },
    dispose() {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
      disposables.forEach((d) => d.dispose());
      composer.dispose();
      renderer.dispose();
    },
  };
}
