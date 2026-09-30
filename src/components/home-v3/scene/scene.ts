import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { CHIP, CLOUD, PILLAR, SAND, SKY_STOPS, SPECK, STREAK, SUN, WATER } from "./palette";

/*
 * v3: a voxel shoreline at sunrise, built to match the Gemini reference (image 1).
 *
 * Everything that has a place in the reference is authored in its pixel coordinates
 * (2000 × 1116) and projected into the world through the same camera, so the clouds,
 * shoreline, terraces, pits and specks land where they sit in the image.
 */

const deg = THREE.MathUtils.degToRad;

// ─── Reference framing ─────────────────────────────────────────────────────

const REF_W = 2000;
const REF_H = 1116;
const HORIZON_Y = 462; // horizon row in the reference
const HFOV_HALF = deg(31);
const CAM = new THREE.Vector3(0, 4, 0);
const REF_TAN_H = Math.tan(HFOV_HALF);
const REF_TAN_V = REF_TAN_H / (REF_W / REF_H);
const HORIZON_NDC = 1 - (2 * HORIZON_Y) / REF_H;
const REF_PITCH = -Math.atan(HORIZON_NDC * REF_TAN_V);
const X_AXIS = new THREE.Vector3(1, 0, 0);

const refDir = (px: number, py: number) =>
  new THREE.Vector3(((2 * px) / REF_W - 1) * REF_TAN_H, (1 - (2 * py) / REF_H) * REF_TAN_V, -1)
    .applyAxisAngle(X_AXIS, REF_PITCH)
    .normalize();
const refGround = (px: number, py: number, y = 0) => {
  const d = refDir(px, py);
  return CAM.clone().addScaledVector(d, (y - CAM.y) / d.y);
};
const refPlane = (px: number, py: number, z: number) => {
  const d = refDir(px, py);
  return CAM.clone().addScaledVector(d, (z - CAM.z) / d.z);
};
const refAt = (px: number, py: number, dist: number) => CAM.clone().addScaledVector(refDir(px, py), dist);

// ─── Sun ───────────────────────────────────────────────────────────────────

// In the reference the disk is centred at (1016, 437), 183 px wide, dipping below the horizon,
// with its top tucked under the clouds. The page starts with it lower, a little under half risen.
const SUN_REF = refDir(1016, 437);
const SUN_AZ = Math.atan2(SUN_REF.x, -SUN_REF.z);
const SUN_EL_END = Math.asin(SUN_REF.y);
const SUN_EL_START = Math.asin(refDir(1016, 492).y);
const SUN_RADIUS = refDir(1016, 437).angleTo(refDir(1108, 437));

// ─── Shoreline ─────────────────────────────────────────────────────────────

// The white foam edge in the reference, from the near left to the far right.
const SHORE_PX: [number, number][] = [
  [0, 790],
  [180, 745],
  [500, 684],
  [620, 666],
  [830, 628],
  [905, 603],
  [1050, 565],
  [1200, 540],
  [1400, 514],
  [1550, 498],
  [1700, 480],
  [1790, 470],
];
const SHORE: THREE.Vector2[] = (() => {
  const pts = SHORE_PX.map(([x, y]) => {
    const g = refGround(x, y);
    return new THREE.Vector2(g.x, g.z);
  });
  const lead = pts[0].clone().sub(pts[1]).normalize().multiplyScalar(60).add(pts[0]);
  const out = [lead, ...pts];
  while (out.length < 16) out.push(out[out.length - 1].clone());
  return out.slice(0, 16);
})();

// Signed distance to the shoreline: positive on the sand, negative in the sea.
const shoreSd = (x: number, z: number) => {
  let best = Infinity;
  let sign = 1;
  for (let i = 0; i < SHORE.length - 1; i++) {
    const a = SHORE[i];
    const b = SHORE[i + 1];
    const abx = b.x - a.x;
    const abz = b.y - a.y;
    const len = abx * abx + abz * abz;
    if (len < 1e-6) continue;
    const t = Math.min(Math.max(((x - a.x) * abx + (z - a.y) * abz) / len, 0), 1);
    const d = Math.hypot(x - (a.x + t * abx), z - (a.y + t * abz));
    if (d < best) {
      best = d;
      sign = abx * (z - a.y) - abz * (x - a.x) >= 0 ? 1 : -1;
    }
  }
  return best * sign;
};

// Beach tiles run along the shore.
const TILE = 4.5;
const TILE_U = SHORE[SHORE.length - 1].clone().sub(SHORE[1]).normalize();
const TILE_V = new THREE.Vector2(-TILE_U.y, TILE_U.x);

// ─── Sea terraces ──────────────────────────────────────────────────────────

// Each row of the sea steps up by STEP; the front edges sit on these reference rows.
const STEP = 0.25;
const FRONT_PY = [700, 648, 604, 565, 533, 508, 492];
const FRONTS = FRONT_PY.map((py, r) => -refGround(300, py, STEP * (r + 1)).z);
const CELL_LIMIT = 72; // voxel water up to here; the far sea plane paints the rest

// The flat shallows between the terraces and the shore widen quickly with distance,
// as they do in the reference.
const lagoonWidth = (f: number) => Math.max(2, 0.34 * f - 6);

const hash1 = (n: number) => {
  const v = Math.sin(n * 127.1) * 43758.5453;
  return v - Math.floor(v);
};

const terraceRow = (x: number, f: number) => {
  let r = 0;
  let front = 0;
  for (let i = 0; i < FRONTS.length; i++) {
    const jog = (hash1(i * 13.1 + Math.floor(x / 5)) - 0.5) * 0.08 * FRONTS[i];
    if (f >= FRONTS[i] + jog) {
      r = i + 1;
      front = FRONTS[i] + jog;
    }
  }
  return { r, front };
};

// ─── Sea surge ─────────────────────────────────────────────────────────────

const SURGE_PERIOD = 8;

// ─── Shaders ───────────────────────────────────────────────────────────────

const COMMON = /* glsl */ `
uniform float uTime;
uniform vec3 uSunDir;
uniform vec3 uGrade;
uniform float uGlowAmt;
uniform float uStreakAmt;
uniform float uFogDensity;
uniform vec3 uStops[${SKY_STOPS.length}];
uniform float uStopPos[${SKY_STOPS.length}];
uniform vec3 uGlow;
uniform vec3 uStreakFar;
uniform vec3 uStreakMid;
uniform vec3 uStreakNear;
uniform vec3 uHazeColor; // sky just above the horizon
uniform vec3 uSkyRefl;   // sky a few degrees up, for faint reflections

vec3 skyGradient(float el) {
  vec3 c = uStops[0];
  for (int i = 1; i < ${SKY_STOPS.length}; i++) {
    c = mix(c, uStops[i], smoothstep(uStopPos[i - 1], uStopPos[i], el));
  }
  return c;
}

vec3 skyAt(vec3 d) {
  float el = asin(clamp(d.y, -1.0, 1.0));
  vec3 c = skyGradient(max(el, 0.0));
  float ang = acos(clamp(dot(d, uSunDir), -1.0, 1.0));
  c += uGlow * (0.4 * exp(-ang * ang / 0.005) + 0.1 * exp(-ang / 0.25)) * uGlowAmt;
  return c;
}

vec3 applyFog(vec3 c, vec3 world) {
  float f = 1.0 - exp(-length(world - cameraPosition) * uFogDensity);
  return mix(c, uHazeColor, f);
}

float hash12(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float hash11(float n) { return fract(sin(n * 127.1) * 43758.5453); }

// A few lighter or darker texels on every face, like a block texture.
float texel(vec3 w, vec3 n, float seed) {
  vec2 uv = abs(n.y) > 0.5 ? w.xz : (abs(n.x) > abs(n.z) ? w.zy : w.xy);
  float h = hash12(floor(uv * 8.0) + seed * 17.0);
  return h > 0.975 ? 1.09 : (h < 0.02 ? 0.91 : 1.0);
}

// Glitter path of the sun on a flat surface, sampled at a point that is already snapped
// to a small block so the edges of the path step like pixels.
float sunStreak(vec3 p) {
  vec3 V = normalize(cameraPosition - p);
  vec3 R = vec3(-V.x, V.y, -V.z);
  float da = abs(atan(R.x, -R.z) - atan(uSunDir.x, -uSunDir.z));
  float d = length(p - cameraPosition);
  float tol = mix(0.075, 0.016, smoothstep(8.0, 60.0, d));
  float lift = smoothstep(-0.05, 0.02, uSunDir.y);
  return (1.0 - smoothstep(tol * 0.55, tol, da)) * lift;
}

vec3 streakColor(float d) {
  vec3 c = mix(uStreakNear, uStreakMid, smoothstep(8.0, 22.0, d));
  return mix(c, uStreakFar * 1.25, smoothstep(22.0, 90.0, d));
}

// Wash of the sea up the sand: how far past the shoreline it reaches right now.
float surgeReach(float along, float t, out float age, out float peak) {
  float ph = t / ${SURGE_PERIOD.toFixed(1)} - along * 0.012;
  float k = floor(ph);
  age = (ph - k) * ${SURGE_PERIOD.toFixed(1)};
  peak = 1.0 + 0.8 * hash11(k);
  if (age < 1.2) return peak * sin(age / 1.2 * 1.5708);
  return peak * (1.0 - smoothstep(1.2, 4.6, age));
}
`;

const SHORE_GLSL = /* glsl */ `
uniform vec2 uShore[16];
float coastZ(float x) {
  float z = uShore[0].y;
  for (int i = 0; i < 15; i++) {
    vec2 a = uShore[i];
    vec2 b = uShore[i + 1];
    if (b.x > a.x && x >= a.x && x <= b.x) z = mix(a.y, b.y, (x - a.x) / (b.x - a.x));
  }
  return x > uShore[15].x ? uShore[15].y : z;
}
float shoreSd(vec2 p) {
  float best = 1e9;
  float sgn = 1.0;
  for (int i = 0; i < 15; i++) {
    vec2 a = uShore[i];
    vec2 ab = uShore[i + 1] - a;
    float len = dot(ab, ab);
    if (len < 1e-6) continue;
    float t = clamp(dot(p - a, ab) / len, 0.0, 1.0);
    float d = length(p - (a + t * ab));
    if (d < best) {
      best = d;
      sgn = ab.x * (p.y - a.y) - ab.y * (p.x - a.x) >= 0.0 ? 1.0 : -1.0;
    }
  }
  return best * sgn;
}
`;

const skyVert = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = position;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
`;

const skyFrag = /* glsl */ `
${COMMON}
uniform float uSunRadius;
uniform vec3 uSunCore;
uniform vec3 uSunEdge;
uniform vec3 uSunRim;
varying vec3 vDir;
void main() {
  vec3 d = normalize(vDir);
  vec3 c = skyAt(d);
  // Sun disk, snapped to a pixel grid so its edge steps like the voxel world.
  float el = asin(clamp(d.y, -1.0, 1.0));
  float sunEl = asin(clamp(uSunDir.y, -1.0, 1.0));
  vec2 q = vec2((atan(d.x, -d.z) - atan(uSunDir.x, -uSunDir.z)) * cos(sunEl), el - sunEl);
  float px = uSunRadius / 12.0;
  vec2 qq = (floor(q / px) + 0.5) * px;
  float r = length(qq) / uSunRadius;
  if (r < 1.0) {
    vec3 sc = mix(uSunCore, uSunEdge, smoothstep(0.25, 0.85, r));
    sc = mix(sc, uSunRim, smoothstep(0.6, 1.0, r) * clamp(0.55 - qq.y / uSunRadius * 0.45, 0.0, 1.0));
    c = sc * 1.1;
  }
  gl_FragColor = vec4(c * uGrade, 1.0);
}
`;

// Vertices in the upper half of the unit cube follow the top, the lower half the bottom,
// so columns stretch without stretching their rounded corners.
const COLUMN = /* glsl */ `
float columnY(float py, float top, float bottom) {
  return py > 0.0 ? top - (0.5 - py) : bottom + (py + 0.5);
}
`;

const waterVert = /* glsl */ `
${COMMON}
${COLUMN}
attribute vec4 aCell; // x, z, shore distance, hash
attribute vec4 aInfo; // level, kind (0 water, 1 lip, 2 shore rim, 3 wash on the sand), along
varying vec3 vN;
varying vec3 vWorld;
varying vec3 vTop;
varying float vFoam;
varying float vHash;
varying float vFlat;
varying float vRow;
void main() {
  float kind = aInfo.y;
  vFlat = (1.0 - step(0.01, aInfo.x)) * (1.0 - step(0.5, kind));
  vRow = hash11(aInfo.x * 11.0 + floor(aCell.x / 9.0) * 0.37);
  float bob = 0.035 * sin(uTime * 0.8 + aCell.x * 0.35 + aCell.y * 0.25);
  float age, peak;
  float reach = surgeReach(aInfo.z, uTime, age, peak);
  float top = aInfo.x + bob;
  float foam = 0.0;
  if (kind > 2.5) {
    float on = step(aCell.z, reach - aCell.w * 0.7);
    top = mix(-0.6, 0.2 + bob * 0.5, on);
    foam = on;
  } else if (kind > 1.5) {
    top = 0.3 + bob * 0.6 + 0.07 * smoothstep(0.0, 0.6, reach);
    foam = 1.0;
  } else if (kind > 0.5) {
    foam = 1.0;
  }
  float bottom = top - 0.8;
  vec3 p = position;
  vec3 w = vec3(aCell.x + p.x, columnY(p.y, top, bottom), aCell.y + p.z);
  vN = normal;
  vWorld = w;
  vTop = vec3(aCell.x, top, aCell.y);
  vFoam = foam;
  vHash = aCell.w;
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
}
`;

const waterFrag = /* glsl */ `
${COMMON}
uniform vec3 uTop;
uniform vec3 uTopFar;
uniform vec3 uTopLight;
uniform vec3 uFlat;
uniform vec3 uRiser;
uniform vec3 uFoam;
uniform vec3 uFoamSide;
uniform vec3 uLip;
varying vec3 vN;
varying vec3 vWorld;
varying vec3 vTop;
varying float vFoam;
varying float vHash;
varying float vFlat;
varying float vRow;
void main() {
  vec3 n = normalize(vN);
  float up = smoothstep(0.4, 0.9, n.y);
  vec3 V = normalize(cameraPosition - vWorld);
  vec3 R = vec3(-V.x, abs(V.y), -V.z);
  float dist = length(vTop - cameraPosition);
  vec3 top = mix(uTop, uTopFar, smoothstep(12.0, 70.0, dist)) * (0.94 + vHash * 0.12);
  top = mix(top, uTopLight, vRow * 0.55);
  top = mix(top, uFlat, vFlat * 0.85);
  top = mix(top, uSkyRefl, mix(0.04, 0.14, vFlat));
  top = mix(top, streakColor(dist), sunStreak(vTop) * uStreakAmt);
  vec3 side = uRiser * (0.86 + 0.22 * max(n.z, 0.0) + 0.08 * vHash);
  vec3 c = mix(side, top, up);
  vec3 foamTop = mix(uFoam, uLip, smoothstep(18.0, 45.0, dist));
  c = mix(c, mix(uFoamSide, foamTop, up), vFoam);
  c *= texel(vWorld, n, vHash);
  c = mix(c, applyFog(c, vWorld), 0.2) * uGrade;
  gl_FragColor = vec4(c, 1.0);
}
`;

const planeVert = /* glsl */ `
varying vec3 vWorld;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;

const sandFrag = /* glsl */ `
${COMMON}
${SHORE_GLSL}
uniform vec2 uTileU;
uniform vec2 uTileV;
uniform vec3 uBase;
uniform vec3 uSeam;
uniform vec3 uPit;
uniform vec4 uPits[3]; // centre x, z, half size along the tiles, across the tiles
varying vec3 vWorld;
void main() {
  vec2 xz = vWorld.xz;
  vec2 cellC = floor(xz + 0.5);
  if (cellC.y < coastZ(cellC.x)) discard; // water cells take over here
  // exact distance to the shore only matters close to it
  float sd = xz.y - coastZ(xz.x) < 10.0 ? max(shoreSd(xz), 0.0) : 10.0;
  vec3 V = normalize(cameraPosition - vWorld);
  float dist = length(cameraPosition - vWorld);

  // Large tiles, glossy with a thin film of water: they mirror the sky.
  vec2 q = vec2(dot(xz, uTileU), dot(xz, uTileV)) / ${TILE.toFixed(1)};
  vec2 id = floor(q);
  vec2 f = fract(q);
  vec2 e = min(f, 1.0 - f) * ${TILE.toFixed(1)};
  float edge = min(e.x, e.y);
  float aa = fwidth(edge) * 1.5 + 0.004;
  float seam = 1.0 - smoothstep(0.025, 0.025 + aa, edge);
  float th = hash12(id);
  vec3 base = uBase * (0.97 + th * 0.06);
  vec3 R = vec3(-V.x, V.y, -V.z);
  float fres = mix(0.12, 0.42, pow(1.0 - clamp(V.y, 0.0, 1.0), 4.0));
  vec3 sk = skyAt(R);
  sk = mix(vec3(dot(sk, vec3(0.3, 0.59, 0.11))), sk, 0.45) * 0.8;
  vec3 c = mix(base, sk, fres);

  // Wet sheen left behind by each wash.
  float age, peak;
  float reach = surgeReach(xz.x, uTime, age, peak);
  float wet = (1.0 - smoothstep(peak - 0.4, peak + 0.6, sd)) * (1.0 - smoothstep(1.2, 8.0, age));
  c = mix(c, c * vec3(0.9, 0.93, 1.0), wet * 0.5);

  c = mix(c, uSeam, seam * (0.5 - 0.3 * smoothstep(10.0, 80.0, dist)));

  // Small pits in the tiles holding a little water.
  for (int i = 0; i < 3; i++) {
    vec2 rel = xz - uPits[i].xy;
    vec2 l = vec2(dot(rel, uTileU), dot(rel, uTileV));
    vec2 hs = uPits[i].zw;
    vec2 ls = floor(l / 0.18);
    vec2 jag = (vec2(hash12(ls.yy + float(i)), hash12(ls.xx + float(i) * 3.0)) - 0.5) * 0.35;
    vec2 inner = hs + jag - abs(l);
    if (inner.x > 0.0 && inner.y > 0.0) {
      float rim = smoothstep(0.0, 0.16, min(inner.x, inner.y));
      vec3 water = mix(uPit * 0.8, skyAt(R) * 0.8, 0.3);
      c = mix(uSeam * 0.6, water, rim * 0.85);
    }
  }

  // The sun's reflection: blocky, zig-zag, widening toward you.
  vec2 cell = floor(vec2(xz.x / 0.5, xz.y / 0.8));
  vec3 sp = vec3((cell.x + 0.5) * 0.5 + (hash12(cell) - 0.5) * 0.6, 0.0, (cell.y + 0.5) * 0.8);
  c = mix(c, streakColor(dist), sunStreak(sp) * uStreakAmt * 0.95);

  // The white foam edge mirrored in the wet sand.
  c = mix(c, vec3(0.92, 0.94, 0.97), (1.0 - smoothstep(0.0, 1.3, sd)) * 0.2);

  c = applyFog(c, vWorld) * uGrade;
  gl_FragColor = vec4(c, 1.0);
}
`;

const farSeaFrag = /* glsl */ `
${COMMON}
${SHORE_GLSL}
uniform vec3 uFar;
uniform vec3 uHorizonC;
uniform vec3 uFlatC;
uniform vec3 uRiser;
uniform vec3 uFoamC;
uniform float uFronts[4];
varying vec3 vWorld;
void main() {
  vec2 xz = vWorld.xz;
  vec2 cellC = floor(xz + 0.5);
  if (cellC.y >= coastZ(cellC.x)) discard;
  float f = -xz.y;
  float lwFar = max(2.0, 0.34 * f - 6.0);
  float sd = coastZ(xz.x) - xz.y < lwFar + 6.0 ? min(shoreSd(xz), 0.0) : -(lwFar + 6.0);
  vec3 V = normalize(cameraPosition - vWorld);
  vec3 R = vec3(-V.x, V.y, -V.z);
  vec3 c = mix(uFar, uHorizonC, smoothstep(80.0, 900.0, f));
  // shallows near the shore mirror the sky, like the voxel lagoon in front
  float lw = max(2.0, 0.34 * f - 6.0);
  float lagoon = smoothstep(-lw - 2.0, -lw, sd);
  c = mix(c, uFlatC, lagoon * 0.8);
  c = mix(c, uSkyRefl, 0.08);
  // Distant rows of the terraces: a dark riser under a pale lip.
  for (int i = 0; i < 4; i++) {
    float F = uFronts[i] + (hash12(vec2(floor(xz.x / 5.0), float(i))) - 0.5) * 0.08 * uFronts[i];
    float w = 0.012 * F;
    c = mix(c, uRiser, step(F - w, f) * step(f, F) * 0.7);
    c = mix(c, uFoamC, step(F, f) * step(f, F + w * 1.2) * 0.65);
  }
  vec2 cell = floor(vec2(xz.x / 1.2, xz.y / 2.0));
  vec3 sp = vec3((cell.x + 0.5) * 1.2 + (hash12(cell) - 0.5) * 1.2, vWorld.y, (cell.y + 0.5) * 2.0);
  c = mix(c, streakColor(length(sp - cameraPosition)), sunStreak(sp) * uStreakAmt);
  // the white foam edge, continuing into the distance
  c = mix(c, uFoamC * 1.15, step(-1.0 - 0.01 * f, sd) * 0.9);
  gl_FragColor = vec4(c * uGrade, 1.0);
}
`;

// Clouds, chips and pillars: instanced voxels shaded by which way each face points.
const voxelVert = /* glsl */ `
attribute float aLayer; // 0 at the bottom of a cloud, 1 at the top; 0 for everything else
varying vec3 vN;
varying vec3 vWorld;
varying float vLayer;
varying float vLocalY;
void main() {
  mat4 m = modelMatrix * instanceMatrix;
  vec4 w = m * vec4(position, 1.0);
  vN = normalize(mat3(m) * normal);
  vWorld = w.xyz;
  vLayer = aLayer;
  vLocalY = position.y + 0.5;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;

const voxelFrag = /* glsl */ `
${COMMON}
uniform vec3 uTopC;
uniform vec3 uSideC;
uniform vec3 uSideHigh;
uniform vec3 uUnder;
uniform vec3 uWarm;
uniform vec3 uSilver;
uniform float uHaze;
uniform float uStrata;
uniform float uSunLit;
varying vec3 vN;
varying vec3 vWorld;
varying float vLayer;
varying float vLocalY;
void main() {
  vec3 n = normalize(vN);
  float up = smoothstep(0.3, 0.9, n.y);
  float down = smoothstep(0.3, 0.9, -n.y);
  vec3 dir = normalize(vWorld - cameraPosition);
  float ang = acos(clamp(dot(dir, uSunDir), -1.0, 1.0));
  float close = exp(-ang * ang / 0.0035);
  float glow = exp(-ang / 0.12);
  // Horizontal strata: each layer darkens toward its bottom edge.
  vec3 side = mix(uSideC, uSideHigh, smoothstep(0.25, 0.9, vLayer));
  side *= 1.0 - uStrata * (1.0 - smoothstep(0.0, 0.45, vLocalY)) + uStrata * 0.5 * smoothstep(0.75, 1.0, vLocalY);
  vec3 c = mix(side, uTopC, up);
  c = mix(c, mix(uUnder, uWarm, glow * 0.85), down);
  c = mix(c, uWarm, glow * 0.35 * (1.0 - up) * uSunLit);
  c = mix(c, uSilver, close * 0.45 * uSunLit);
  c = mix(c, skyAt(dir), uHaze);
  gl_FragColor = vec4(c * uGrade, 1.0);
}
`;

const speckVert = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
attribute float aSeed;
varying float vAlpha;
void main() {
  vec3 p = position;
  p.y += sin(uTime * 0.4 + aSeed * 6.28) * 0.25;
  p.x += sin(uTime * 0.25 + aSeed * 12.0) * 0.4;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = (0.3 + aSeed * 0.3) * uPixelRatio * 520.0 / -mv.z;
  vAlpha = 0.6 + 0.4 * (0.5 + 0.5 * sin(uTime * (0.9 + aSeed) + aSeed * 40.0));
  gl_Position = projectionMatrix * mv;
}
`;

const speckFrag = /* glsl */ `
uniform vec3 uColor;
uniform float uOpacity;
varying float vAlpha;
void main() {
  vec2 c = abs(gl_PointCoord - 0.5);
  float a = 1.0 - smoothstep(0.22, 0.5, max(c.x, c.y));
  gl_FragColor = vec4(uColor * 2.4, a * vAlpha * uOpacity);
}
`;

// Light rays: smear the bright sky around the sun outward, so it streams through cloud gaps.
const RaysShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    uSun: { value: new THREE.Vector2(0.5, 0.6) },
    uStrength: { value: 0 },
    uShafts: { value: 0 },
    uAspect: { value: REF_W / REF_H },
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
    uniform float uShafts;
    uniform float uAspect;
    uniform vec3 uTint;
    varying vec2 vUv;
    float shaft(float th, float at, float w) { float d = (th - at) / w; return exp(-d * d); }
    void main() {
      vec3 c = texture2D(tDiffuse, vUv).rgb;

      // Distinct shafts, measured from the reference: they fan between about 50° and 83°.
      vec2 dv = (vUv - uSun) * vec2(uAspect, 1.0);
      float r = length(dv);
      float th = atan(dv.y, dv.x);
      float s = shaft(th, 0.88, 0.07) * 0.5 + shaft(th, 1.0, 0.05) * 0.7 + shaft(th, 1.12, 0.08) * 0.55
              + shaft(th, 1.24, 0.06) * 0.9 + shaft(th, 1.36, 0.07) * 0.6 + shaft(th, 1.46, 0.05) * 0.45;
      float reach = smoothstep(0.03, 0.12, r) * (1.0 - smoothstep(0.25, 0.75, r));
      c += uTint * s * reach * uShafts;

      vec2 delta = (vUv - uSun) / 24.0;
      vec2 uv = vUv;
      float decay = 1.0;
      float acc = 0.0;
      for (int i = 0; i < 24; i++) {
        uv -= delta;
        acc += max(dot(texture2D(tDiffuse, uv).rgb, vec3(0.2126, 0.7152, 0.0722)) - 0.78, 0.0) * decay;
        decay *= 0.945;
      }
      float fall = 1.0 - smoothstep(0.0, 0.9, length((vUv - uSun) * vec2(1.6, 1.0)));
      // Stronger above the horizon, where the rays fan up through the clouds.
      float above = smoothstep(uSun.y + 0.02, uSun.y + 0.12, vUv.y) * 0.85 + 0.15;
      c += uTint * acc * uStrength * fall * above / 24.0;
      gl_FragColor = vec4(c, 1.0);
    }
  `,
};

// Soft focus on the foreground and the top of the frame, film grain, light vignette.
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
      float b = smoothstep(0.34, 0.0, vUv.y) + smoothstep(0.62, 0.72, vUv.y) * 0.32 + smoothstep(0.85, 1.0, vUv.y) * 0.2;
      if (b > 0.01) {
        vec3 acc = c;
        float w = 1.0;
        float rad = b * 7.0;
        for (int i = 0; i < 12; i++) {
          float a = float(i) * 0.5236;
          vec2 o = vec2(cos(a), sin(a)) * rad / uRes;
          acc += texture2D(tDiffuse, vUv + o * (0.5 + 0.5 * mod(float(i), 2.0))).rgb;
          w += 1.0;
        }
        c = acc / w;
      }
      float g = fract(sin(dot(floor(vUv * uRes) + fract(uTime) * 91.0, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
      c += g * 0.025;
      vec2 v = vUv - 0.5;
      c *= 1.0 - dot(v, v) * 0.25;
      gl_FragColor = vec4(c, 1.0);
    }
  `,
};

// ─── Authored layout from the reference ────────────────────────────────────

// Cloud layers in reference pixels: [top, bottom, left, right]. Each row is one stratum.
type Rows = [number, number, number, number][];
const CLOUD_A: Rows = [
  [172, 186, 470, 1085],
  [186, 200, 360, 1100],
  [186, 200, 1240, 1420],
  [200, 214, 280, 1180],
  [200, 214, 1200, 1540],
  [214, 228, 215, 1580],
  [228, 242, 190, 1600],
  [242, 256, 205, 1590],
  [256, 270, 245, 1560],
  [270, 284, 300, 1520],
  [284, 298, 560, 1070],
  [284, 298, 1120, 1470],
  [298, 312, 600, 1060],
  [298, 312, 1150, 1380],
  [312, 326, 640, 1050],
  [326, 340, 690, 1030],
  [340, 350, 760, 990],
];
const CLOUD_STRIP: Rows = [
  [288, 300, 270, 560],
  [300, 310, 300, 520],
];
const CLOUD_B: Rows = [
  [315, 330, 1230, 1880],
  [330, 345, 1120, 1890],
  [345, 360, 1075, 1880],
  [360, 375, 1030, 1860],
  [375, 390, 1000, 1780],
  [390, 402, 1015, 1560],
];
const CLOUD_FAR: Rows = [
  [85, 110, 1300, 1500],
  [110, 135, 1270, 1560],
  [135, 160, 1180, 1850],
  [160, 185, 1220, 1900],
  [185, 215, 1590, 2000],
  [215, 245, 1650, 2000],
  [255, 285, 1700, 2000],
  [285, 305, 1760, 2000],
];

// Glowing specks hovering over the water near the horizon.
const SPECKS_PX: [number, number][] = [
  [290, 441], [398, 446], [462, 423], [512, 437], [591, 447], [697, 414], [741, 441], [836, 441],
  [1122, 440], [1176, 430], [1210, 434], [1257, 441], [1303, 434], [1370, 446], [1431, 438],
  [1484, 447], [250, 471], [368, 470], [518, 490], [663, 462], [797, 497], [760, 480], [1340, 470],
  [560, 455], [430, 480],
];

// Pits in the beach tiles: [left, top, right, bottom] in reference pixels.
const PITS_PX: [number, number, number, number][] = [
  [1335, 768, 1505, 845],
  [1135, 612, 1220, 630],
  [1270, 618, 1410, 640],
];

// Distant blocks at the far right of the beach: [left, right, top, base].
const PILLARS_PX: [number, number, number, number][] = [
  [1755, 1800, 455, 478],
  [1800, 1846, 440, 481],
  [1860, 1905, 430, 483],
  [1925, 1990, 446, 490],
  [1990, 2000, 420, 500],
];

// ─── Scene ─────────────────────────────────────────────────────────────────

export type ShorelineHandle = {
  setProgress: (p: number) => void;
  setPointer: (x: number, y: number) => void;
  setActive: (active: boolean) => void;
  resize: () => void;
  dispose: () => void;
};

type Spray = { pos: THREE.Vector3; vel: THREE.Vector3; axis: THREE.Vector3; spin: number; age: number; life: number; size: number };

const col = (hex: string) => new THREE.Color(hex);

export function createShoreline(canvas: HTMLCanvasElement, opts: { reducedMotion: boolean }): ShorelineHandle {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, REF_W / REF_H, 0.5, 4000);
  camera.rotation.order = "YXZ";
  camera.position.copy(CAM);

  const stops = SKY_STOPS.map(([, hex]) => col(hex));
  const shared = {
    uTime: { value: 0 },
    uSunDir: { value: new THREE.Vector3(0, 0, -1) },
    uGrade: { value: new THREE.Vector3(1, 1, 1) },
    uGlowAmt: { value: 1 },
    uStreakAmt: { value: 1 },
    uFogDensity: { value: 0.0022 },
    uStops: { value: stops },
    uStopPos: { value: SKY_STOPS.map(([d]) => deg(d)) },
    uGlow: { value: col(SUN.glow) },
    uStreakFar: { value: col(STREAK.far) },
    uStreakMid: { value: col(STREAK.mid) },
    uStreakNear: { value: col(STREAK.near) },
    uHazeColor: { value: new THREE.Color() },
    uSkyRefl: { value: new THREE.Color() },
  };
  const shoreUniform = { value: SHORE.map((p) => p.clone()) };
  const skyColorAt = (elDeg: number, out: THREE.Color) => {
    out.copy(stops[0]);
    for (let i = 1; i < SKY_STOPS.length; i++) {
      const t = THREE.MathUtils.smoothstep(elDeg, SKY_STOPS[i - 1][0], SKY_STOPS[i][0]);
      out.lerp(stops[i], t);
    }
    return out;
  };
  skyColorAt(0.8, shared.uHazeColor.value);
  skyColorAt(6, shared.uSkyRefl.value);

  const disposables: { dispose: () => void }[] = [];
  const track = <T extends { dispose: () => void }>(o: T) => {
    disposables.push(o);
    return o;
  };

  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed % 10000) / 10000;
  };

  // ── Sky ──
  const sky = new THREE.Mesh(
    track(new THREE.SphereGeometry(2000, 48, 24)),
    track(
      new THREE.ShaderMaterial({
        uniforms: {
          ...shared,
          uSunRadius: { value: SUN_RADIUS },
          uSunCore: { value: col(SUN.core) },
          uSunEdge: { value: col(SUN.edge) },
          uSunRim: { value: col(SUN.rim) },
        },
        vertexShader: skyVert,
        fragmentShader: skyFrag,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    ),
  );
  sky.renderOrder = -1;
  scene.add(sky);

  // ── Beach ──
  const pits = PITS_PX.map(([l, t, r, b]) => {
    const corners = [refGround(l, t), refGround(r, t), refGround(l, b), refGround(r, b)];
    const c = corners.reduce((a, p) => a.add(p), new THREE.Vector3()).multiplyScalar(0.25);
    let hu = 0;
    let hv = 0;
    for (const p of corners) {
      const rx = p.x - c.x;
      const rz = p.z - c.z;
      hu = Math.max(hu, Math.abs(rx * TILE_U.x + rz * TILE_U.y));
      hv = Math.max(hv, Math.abs(rx * TILE_V.x + rz * TILE_V.y));
    }
    return new THREE.Vector4(c.x, c.z, hu * 0.6, hv * 0.55);
  });
  const sand = new THREE.Mesh(
    track(new THREE.PlaneGeometry(700, 1000)),
    track(
      new THREE.ShaderMaterial({
        uniforms: {
          ...shared,
          uShore: shoreUniform,
          uTileU: { value: TILE_U },
          uTileV: { value: TILE_V },
          uBase: { value: col(SAND.base) },
          uSeam: { value: col(SAND.seam) },
          uPit: { value: col(SAND.pit) },
          uPits: { value: pits },
        },
        vertexShader: planeVert,
        fragmentShader: sandFrag,
      }),
    ),
  );
  sand.rotation.x = -Math.PI / 2;
  sand.position.set(80, 0, -490);
  scene.add(sand);

  // ── Far sea: everything past the voxel water ──
  const farFronts = [...FRONTS.filter((f) => f > CELL_LIMIT), 190, 300, 460].slice(0, 4);
  const farSea = new THREE.Mesh(
    track(new THREE.PlaneGeometry(5000, 2400)),
    track(
      new THREE.ShaderMaterial({
        uniforms: {
          ...shared,
          uShore: shoreUniform,
          uFar: { value: col(WATER.far) },
          uHorizonC: { value: col(WATER.horizon) },
          uFlatC: { value: col(WATER.flat) },
          uRiser: { value: col(WATER.riser) },
          uFoamC: { value: col(WATER.foamSide) },
          uFronts: { value: farFronts },
        },
        vertexShader: planeVert,
        fragmentShader: farSeaFrag,
      }),
    ),
  );
  farSea.rotation.x = -Math.PI / 2;
  farSea.position.set(0, 0.02, -(CELL_LIMIT - 4) - 1200);
  scene.add(farSea);

  // ── Voxel water ──
  const cells: number[] = [];
  const infos: number[] = [];
  const maxYaw = deg(37);
  for (let x = -70; x <= 50; x++) {
    for (let z = -CELL_LIMIT; z <= -6; z++) {
      const f = -z;
      if (Math.abs(Math.atan2(x, f)) > maxYaw) continue;
      const sd = shoreSd(x, z);
      if (sd >= 3.2) continue;
      const h = hash1(x * 31.7 + z * 7.3);
      let level = 0;
      let kind = 0;
      if (sd >= 0) kind = 3;
      else if (sd >= -1) kind = 2;
      else if (sd < -lagoonWidth(f)) {
        const { r, front } = terraceRow(x, f);
        level = STEP * r;
        if (r > 0 && f - front < 1) kind = 1;
      }
      cells.push(x, z, sd, h);
      infos.push(level, kind, x, 0);
    }
  }
  const waterGeo = track(new RoundedBoxGeometry(1, 1, 1, 1, 0.05));
  waterGeo.setAttribute("aCell", new THREE.InstancedBufferAttribute(new Float32Array(cells), 4));
  waterGeo.setAttribute("aInfo", new THREE.InstancedBufferAttribute(new Float32Array(infos), 4));
  const water = new THREE.InstancedMesh(
    waterGeo,
    track(
      new THREE.ShaderMaterial({
        uniforms: {
          ...shared,
          uTop: { value: col(WATER.top) },
          uTopFar: { value: col(WATER.topFar) },
          uTopLight: { value: col(WATER.topLight) },
          uFlat: { value: col(WATER.flat) },
          uRiser: { value: col(WATER.riser) },
          uFoam: { value: col(WATER.foam) },
          uFoamSide: { value: col(WATER.foamSide) },
          uLip: { value: col(WATER.lip) },
        },
        vertexShader: waterVert,
        fragmentShader: waterFrag,
      }),
    ),
    cells.length / 4,
  );
  water.frustumCulled = false;
  scene.add(water);

  // ── Voxel helper for clouds, chips and pillars ──
  const voxelMaterial = (o: {
    top: string;
    side: string;
    sideHigh?: string;
    under: string;
    warm?: string;
    silver?: string;
    haze?: number;
    strata?: number;
    sunLit?: number;
  }) =>
    track(
      new THREE.ShaderMaterial({
        uniforms: {
          ...shared,
          uTopC: { value: col(o.top) },
          uSideC: { value: col(o.side) },
          uSideHigh: { value: col(o.sideHigh ?? o.side) },
          uUnder: { value: col(o.under) },
          uWarm: { value: col(o.warm ?? o.under) },
          uSilver: { value: col(o.silver ?? o.top) },
          uHaze: { value: o.haze ?? 0 },
          uStrata: { value: o.strata ?? 0 },
          uSunLit: { value: o.sunLit ?? 0 },
        },
        vertexShader: voxelVert,
        fragmentShader: voxelFrag,
      }),
    );
  const voxels = (geo: THREE.BufferGeometry, material: THREE.ShaderMaterial, mats: THREE.Matrix4[], layers?: number[]) => {
    const g = track(geo.clone());
    g.setAttribute("aLayer", new THREE.InstancedBufferAttribute(new Float32Array(layers ?? mats.map(() => 0)), 1));
    const mesh = new THREE.InstancedMesh(g, material, Math.max(1, mats.length));
    mats.forEach((m, i) => mesh.setMatrixAt(i, m));
    mesh.count = mats.length;
    mesh.instanceMatrix.needsUpdate = true;
    mesh.frustumCulled = false;
    scene.add(mesh);
    return mesh;
  };
  const box = track(new THREE.BoxGeometry(1, 1, 1));

  // ── Clouds ──
  const buildCloud = (rows: Rows, z: number, depthVox: number) => {
    const W = Math.abs(z) * 0.0095;
    const mats: THREE.Matrix4[] = [];
    const layers: number[] = [];
    const tops = rows.map((r) => r[0]);
    const minTop = Math.min(...tops);
    const maxBot = Math.max(...rows.map((r) => r[1]));
    for (const [top, bot, x0, x1] of rows) {
      const mid = (x0 + x1) / 2;
      const yTop = refPlane(mid, top, z).y;
      const yBot = refPlane(mid, bot, z).y;
      const ym = (top + bot) / 2;
      const layer = 1 - (ym - minTop) / Math.max(1, maxBot - minTop);
      // ragged ends (lumpier toward the top), except where an edge sits over the sun
      const nearSun = x0 > 850 && x0 < 1150 && bot > 300;
      const ragged = layer > 0.75 ? 4 : 2;
      const i0 = Math.round(refPlane(x0, ym, z).x / W) - (nearSun ? 0 : Math.floor(rnd() * ragged));
      const i1 = Math.round(refPlane(x1, ym, z).x / W) + Math.floor(rnd() * ragged);
      const depth = Math.max(2, Math.round(depthVox * (0.55 + 0.45 * Math.sin(layer * Math.PI))));
      for (let i = i0; i <= i1; i++) {
        const edge = i - i0 < 2 || i1 - i < 2;
        const bump = Math.floor(hash1(i * 7.3 + top * 0.11) * 3) - 1;
        const d = Math.max(1, (edge ? depth - 2 : depth) + bump);
        for (let k = 0; k < d; k++) {
          mats.push(
            new THREE.Matrix4().compose(
              // depth grows toward the camera, so the authored outline stays the cloud's underside
              new THREE.Vector3(i * W, (yTop + yBot) / 2, z + k * W),
              new THREE.Quaternion(),
              new THREE.Vector3(W, yTop - yBot, W),
            ),
          );
          layers.push(layer);
        }
      }
    }
    return { mats, layers };
  };
  const cloudMeshes: THREE.InstancedMesh[] = [];
  const cloudSets: [Rows, number, number, { haze: number; sunLit: number }][] = [
    [CLOUD_FAR, -800, 3, { haze: 0.7, sunLit: 0.5 }],
    [CLOUD_A, -330, 6, { haze: 0.06, sunLit: 1 }],
    [CLOUD_STRIP, -310, 3, { haze: 0.08, sunLit: 1 }],
    [CLOUD_B, -280, 5, { haze: 0.04, sunLit: 1 }],
  ];
  for (const [rows, z, depth, look] of cloudSets) {
    const { mats, layers } = buildCloud(rows, z, depth);
    cloudMeshes.push(
      voxels(
        box,
        voxelMaterial({
          top: CLOUD.top,
          side: CLOUD.side,
          sideHigh: CLOUD.sideHigh,
          under: CLOUD.under,
          warm: CLOUD.warm,
          silver: CLOUD.silver,
          haze: look.haze,
          strata: 0.07,
          sunLit: look.sunLit,
        }),
        mats,
        layers,
      ),
    );
  }

  // ── Chips on the beach ──
  const chipMats: THREE.Matrix4[] = [];
  const addChip = (p: THREE.Vector3, y: number) => {
    const len = 0.35 + rnd() * 0.55;
    const wide = 0.1 + rnd() * 0.12;
    const tall = 0.05 + rnd() * 0.04;
    chipMats.push(
      new THREE.Matrix4().compose(
        new THREE.Vector3(p.x, y + tall * 0.4, p.z),
        new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.atan2(TILE_U.y, TILE_U.x) + (rnd() - 0.5) * 0.5, 0)),
        new THREE.Vector3(len, tall, wide),
      ),
    );
  };
  const zones: [number, number, number, number, number][] = [
    // x0, x1, y0, y1, count (reference pixels)
    [1100, 2000, 515, 720, 55],
    [600, 2000, 720, 900, 12],
    [400, 2000, 900, 1100, 4],
  ];
  for (const [x0, x1, y0, y1, count] of zones) {
    let placed = 0;
    for (let tries = 0; tries < count * 20 && placed < count; tries++) {
      const px = x0 + rnd() * (x1 - x0);
      const py = y0 + rnd() * (y1 - y0);
      const g = refGround(px, py);
      if (shoreSd(g.x, g.z) < 0.8) continue;
      addChip(g, 0);
      if (rnd() < 0.2) addChip(g.clone().add(new THREE.Vector3(TILE_U.x * 0.7, 0, TILE_U.y * 0.7)), 0);
      placed++;
    }
  }
  for (const pit of pits) {
    for (let i = 0; i < 3; i++) {
      addChip(
        new THREE.Vector3(
          pit.x + TILE_U.x * (rnd() - 0.5) * pit.z * 1.4 + TILE_V.x * (rnd() - 0.5) * pit.w * 1.2,
          0,
          pit.y + TILE_U.y * (rnd() - 0.5) * pit.z * 1.4 + TILE_V.y * (rnd() - 0.5) * pit.w * 1.2,
        ),
        -0.06,
      );
    }
  }
  voxels(track(new RoundedBoxGeometry(1, 1, 1, 1, 0.04)), voxelMaterial({ top: CHIP.top, side: CHIP.side, under: CHIP.side }), chipMats);

  // ── Distant blocks at the far right ──
  const pillarMats = PILLARS_PX.map(([l, r, top, base]) => {
    const b = refGround((l + r) / 2, base);
    const left = refPlane(l, base, b.z);
    const right = refPlane(r, base, b.z);
    const t = refPlane((l + r) / 2, top, b.z);
    const w = Math.abs(right.x - left.x);
    return new THREE.Matrix4().compose(
      new THREE.Vector3(b.x, t.y / 2, b.z),
      new THREE.Quaternion(),
      new THREE.Vector3(w, Math.max(0.5, t.y), w),
    );
  });
  voxels(box, voxelMaterial({ top: PILLAR.top, side: PILLAR.side, under: PILLAR.side, haze: 0.35 }), pillarMats);

  // ── Spray from the wash ──
  const SPRAY_MAX = 160;
  const sprayMesh = new THREE.InstancedMesh(
    track(new RoundedBoxGeometry(1, 1, 1, 1, 0.18)),
    voxelMaterial({ top: WATER.foam, side: WATER.foamSide, under: WATER.foamSide }),
    SPRAY_MAX,
  );
  sprayMesh.geometry.setAttribute("aLayer", new THREE.InstancedBufferAttribute(new Float32Array(SPRAY_MAX), 1));
  sprayMesh.frustumCulled = false;
  sprayMesh.count = 0;
  scene.add(sprayMesh);
  const sprays: Spray[] = [];
  const slots: { x: number; z: number; nx: number; nz: number; k: number }[] = [];
  for (let i = 1; i < SHORE.length - 1; i++) {
    const a = SHORE[i];
    const b = SHORE[i + 1];
    const len = a.distanceTo(b);
    if (len < 1e-3) continue;
    const nx = -(b.y - a.y) / len;
    const nz = (b.x - a.x) / len;
    for (let d = 0; d < len; d += 1.4) {
      const x = a.x + ((b.x - a.x) * d) / len;
      const z = a.y + ((b.y - a.y) * d) / len;
      if (-z > 60 || Math.abs(Math.atan2(x, -z)) > maxYaw) continue;
      // spray starts just on the sea side of the foam edge and is thrown toward the sand
      slots.push({ x: x - nx * 0.5, z: z - nz * 0.5, nx, nz, k: Number.NaN });
    }
  }
  const tmpM = new THREE.Matrix4();
  const tmpQ = new THREE.Quaternion();
  const tmpS = new THREE.Vector3();
  const updateSpray = (t: number, dt: number) => {
    for (const s of slots) {
      const k = Math.floor(t / SURGE_PERIOD - s.x * 0.012);
      if (Number.isNaN(s.k)) s.k = k;
      else if (k > s.k) {
        s.k = k;
        const n = rnd() < 0.5 ? 1 : 2;
        for (let i = 0; i < n && sprays.length < SPRAY_MAX; i++) {
          sprays.push({
            pos: new THREE.Vector3(s.x + (rnd() - 0.5), 0.45, s.z + (rnd() - 0.5)),
            vel: new THREE.Vector3(s.nx * 1.2 + (rnd() - 0.5), 1.6 + rnd() * 1.4, s.nz * 1.2 + (rnd() - 0.5)),
            axis: new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize(),
            spin: (rnd() - 0.5) * 8,
            age: 0,
            life: 0.8 + rnd() * 0.5,
            size: 0.12 + rnd() * 0.12,
          });
        }
      }
    }
    let n = 0;
    for (let i = sprays.length - 1; i >= 0; i--) {
      const sp = sprays[i];
      sp.age += dt;
      sp.vel.y -= 7 * dt;
      sp.pos.addScaledVector(sp.vel, dt);
      if (sp.age > sp.life || sp.pos.y < -0.2) {
        sprays.splice(i, 1);
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

  // ── Specks ──
  const speckPos = new Float32Array(SPECKS_PX.length * 3);
  const speckSeed = new Float32Array(SPECKS_PX.length);
  SPECKS_PX.forEach(([px, py], i) => {
    const p = refAt(px, py, 55 + rnd() * 55);
    speckPos.set([p.x, Math.max(p.y, STEP * 5 + 0.6), p.z], i * 3);
    speckSeed[i] = rnd();
  });
  const speckGeo = track(new THREE.BufferGeometry());
  speckGeo.setAttribute("position", new THREE.BufferAttribute(speckPos, 3));
  speckGeo.setAttribute("aSeed", new THREE.BufferAttribute(speckSeed, 1));
  const speckUniforms = {
    uTime: shared.uTime,
    uPixelRatio: { value: renderer.getPixelRatio() },
    uColor: { value: col(SPECK) },
    uOpacity: { value: 1 },
  };
  const specks = new THREE.Points(
    speckGeo,
    track(
      new THREE.ShaderMaterial({
        uniforms: speckUniforms,
        vertexShader: speckVert,
        fragmentShader: speckFrag,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    ),
  );
  specks.frustumCulled = false;
  scene.add(specks);

  // ── Post ──
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const rays = new ShaderPass(RaysShader);
  composer.addPass(rays);
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.3, 0.6, 0.92);
  composer.addPass(bloom);
  const finish = new ShaderPass(FinishShader);
  composer.addPass(finish);
  composer.addPass(new OutputPass());

  // ── State ──
  let progressTarget = opts.reducedMotion ? 1 : 0;
  let progress = progressTarget;
  const pointer = new THREE.Vector2();
  const pointerSmooth = new THREE.Vector2();
  let pitch = REF_PITCH;
  let active = true;
  let raf = 0;
  let last = performance.now();
  let time = opts.reducedMotion ? 3 : 0;
  let hold = false;
  const sunScreen = new THREE.Vector3();

  const applyProgress = (p: number) => {
    const e = 1 - (1 - p) * (1 - p);
    const el = THREE.MathUtils.lerp(SUN_EL_START, SUN_EL_END, e);
    shared.uSunDir.value.set(Math.sin(SUN_AZ) * Math.cos(el), Math.sin(el), -Math.cos(SUN_AZ) * Math.cos(el));
    shared.uGrade.value.set(
      THREE.MathUtils.lerp(0.9, 1, e),
      THREE.MathUtils.lerp(0.86, 1, e),
      THREE.MathUtils.lerp(0.9, 1, e),
    );
    shared.uGlowAmt.value = THREE.MathUtils.lerp(0.65, 1, e);
    shared.uStreakAmt.value = THREE.MathUtils.lerp(0.5, 1, e);
    rays.uniforms.uStrength.value = THREE.MathUtils.lerp(0.3, 0.8, e);
    rays.uniforms.uShafts.value = THREE.MathUtils.lerp(0.02, 0.1, e);
  };

  const layout = () => {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    bloom.resolution.set(w / 2, h / 2);
    const pr = renderer.getPixelRatio();
    finish.uniforms.uRes.value.set(w * pr, h * pr);
    rays.uniforms.uAspect.value = w / h;
    speckUniforms.uPixelRatio.value = pr;
    const aspect = w / h;
    const vfov = THREE.MathUtils.clamp(THREE.MathUtils.radToDeg(2 * Math.atan(REF_TAN_H / aspect)), 28, 50);
    camera.fov = vfov;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    // keep the horizon where the reference has it
    pitch = -Math.atan(HORIZON_NDC * Math.tan(deg(vfov / 2)));
  };

  const renderFrame = (dt: number) => {
    if (!hold) time += dt;
    shared.uTime.value = time;
    finish.uniforms.uTime.value = time;
    progress += (progressTarget - progress) * (1 - Math.exp(-dt * 6));
    applyProgress(progress);
    pointerSmooth.lerp(pointer, 1 - Math.exp(-dt * 3));
    camera.rotation.y = -pointerSmooth.x * deg(1.2);
    camera.rotation.x = pitch - pointerSmooth.y * deg(0.6);
    sky.position.copy(camera.position);
    for (const m of cloudMeshes) m.position.x = Math.sin(time * 0.04) * 3;
    camera.updateMatrixWorld();
    sunScreen.copy(shared.uSunDir.value).multiplyScalar(1500).add(camera.position).project(camera);
    rays.uniforms.uSun.value.set(sunScreen.x * 0.5 + 0.5, sunScreen.y * 0.5 + 0.5);
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
