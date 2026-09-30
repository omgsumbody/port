/*
 * WebGL transitions between style images of the same portrait, all lined up on the eyes:
 * - shatter: the image breaks into triangular shards whose content slides and turns, some
 *   flashing a third style mid-flight, before settling as the next style
 * - smear: a sweep runs from the bottom up; behind it pixel columns stretch upward in
 *   blocky, staircase streaks and reveal the next style
 */

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5); // y down, like the images
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;
uniform sampler2D uFrom;
uniform sampler2D uTo;
uniform sampler2D uOther; // a third style that flashes mid-transition
uniform float uProgress;
uniform float uMode; // 0 shatter, 1 smear
uniform float uSeed;
uniform vec2 uRes;
varying vec2 vUv;

float hash(vec2 p) { return fract(sin(dot(p + uSeed, vec2(127.1, 311.7))) * 43758.5453); }
vec2 rot(vec2 v, float a) { float c = cos(a), s = sin(a); return vec2(c * v.x - s * v.y, s * v.x + c * v.y); }
vec4 tex(sampler2D t, vec2 uv) {
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) return vec4(0.0);
  return texture2D(t, uv);
}

vec4 shatter(vec2 uv, float p) {
  // triangles: a grid of cells, each cut along a diagonal whose direction alternates
  float cells = 7.0;
  vec2 g = uv * cells;
  vec2 cell = floor(g);
  vec2 f = fract(g);
  float flip = step(0.5, hash(cell * 1.3));
  float upper = flip > 0.5 ? step(f.x, f.y) : step(1.0 - f.x, f.y);
  vec2 id = cell + vec2(upper * 0.5, 0.0);
  vec2 centre = (cell + (flip > 0.5 ? (upper > 0.5 ? vec2(0.33, 0.67) : vec2(0.67, 0.33))
                                    : (upper > 0.5 ? vec2(0.67, 0.67) : vec2(0.33, 0.33)))) / cells;

  float r = hash(id);
  float delay = r * 0.35;
  float lp = clamp((p - delay) / 0.65, 0.0, 1.0);
  float amt = sin(lp * 3.14159);
  // the shard's content slides and turns inside its window
  vec2 dir = normalize(vec2(hash(id + 3.1) - 0.5, hash(id + 7.7) - 0.5) + 1e-4);
  vec2 local = rot(uv - centre, amt * (hash(id + 1.9) - 0.5) * 0.9) * (1.0 + amt * 0.25);
  vec2 suv = centre + local - dir * amt * 0.09;

  vec4 c = lp < 0.5 ? tex(uFrom, suv) : tex(uTo, suv);
  // some shards flash a third style mid-flight, some drop out for a moment
  if (amt > 0.55 && hash(id + 5.3) > 0.72) c = tex(uOther, suv);
  if (amt > 0.75 && hash(id + 9.1) > 0.85) c *= 0.0;
  return c;
}

vec4 smear(vec2 uv, float p) {
  float block = 1.0 / 90.0;
  vec2 q = (floor(uv / block) + 0.5) * block; // chunky pixels
  float col = floor(uv.x / (block * 2.0));
  // sweep from the bottom (1) to above the top, every column slightly out of step
  float sweep = mix(1.15, -0.35, p) + (hash(vec2(col, 1.0)) - 0.5) * 0.12;
  sweep = floor(sweep / block) * block; // staircase edge
  float len = (0.08 + hash(vec2(col, 4.0)) * 0.32) * sin(p * 3.14159);
  if (uv.y > sweep) {
    // behind the sweep: the new style, blocky right after the sweep passes, clean further down
    float settle = smoothstep(0.0, 0.18, uv.y - sweep);
    vec4 c = mix(tex(uTo, q), tex(uTo, uv), settle);
    if (settle < 0.6 && hash(floor(uv / (block * 6.0)) + p) > 0.93) c = tex(uOther, q);
    return c;
  }
  if (uv.y > sweep - len) {
    // the streak: pixels at the sweep line stretched upward
    vec4 streak = tex(uTo, vec2(q.x, sweep + block * 0.5));
    float fade = (uv.y - (sweep - len)) / max(len, 1e-3);
    vec4 old = tex(uFrom, q);
    return mix(old, streak, smoothstep(0.0, 0.35, fade));
  }
  return tex(uFrom, uv);
}

void main() {
  vec4 c = uMode < 0.5 ? shatter(vUv, uProgress) : smear(vUv, uProgress);
  if (uProgress <= 0.0) c = texture2D(uFrom, vUv);
  if (uProgress >= 1.0) c = texture2D(uTo, vUv);
  gl_FragColor = c;
}
`;

export type PortraitGL = {
  draw: (from: number, to: number, other: number, progress: number, mode: 0 | 1, seed: number) => void;
  resize: () => void;
  dispose: () => void;
};

export function createPortraitGL(canvas: HTMLCanvasElement, images: HTMLImageElement[]): PortraitGL {
  // premultiplied alpha all the way through, so soft cut-out edges stay clean when mixed
  const gl = canvas.getContext("webgl", { alpha: true, antialias: false });
  if (!gl) throw new Error("WebGL unavailable");

  const shader = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
    return s;
  };
  const program = gl.createProgram()!;
  gl.attachShader(program, shader(gl.VERTEX_SHADER, VERT));
  gl.attachShader(program, shader(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? "link");
  gl.useProgram(program);

  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  const textures = images.map((img) => {
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    return t;
  });

  const u = (name: string) => gl.getUniformLocation(program, name);
  const uFrom = u("uFrom"), uTo = u("uTo"), uOther = u("uOther");
  const uProgress = u("uProgress"), uMode = u("uMode"), uSeed = u("uSeed"), uRes = u("uRes");
  gl.uniform1i(uFrom, 0);
  gl.uniform1i(uTo, 1);
  gl.uniform1i(uOther, 2);

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, w, h);
    gl.uniform2f(uRes, w, h);
  };
  resize();

  return {
    draw(from, to, other, progress, mode, seed) {
      [from, to, other].forEach((i, unit) => {
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, textures[i]);
      });
      gl.uniform1f(uProgress, progress);
      gl.uniform1f(uMode, mode);
      gl.uniform1f(uSeed, seed);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    resize,
    dispose() {
      textures.forEach((t) => gl.deleteTexture(t));
      gl.deleteBuffer(quad);
      gl.deleteProgram(program);
      gl.getExtension("WEBGL_lose_context")?.loseContext(); // give the context back
    },
  };
}
