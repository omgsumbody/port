import { SUN } from "./shoreline/palette";

/*
 * One sun for the whole page. The hero's sun climbs to RISE while the hero is pinned; from
 * there the morning carries on with the scroll and reaches NOON at the foot of the page.
 * Anything lying on the page takes its shadow and the colour of its light from here, through
 * custom properties set on `lit`:
 *   --sun-x, --sun-y   the shadow thrown per px of height, along the page and down it
 *   --sun-reach        the length of that shadow per px of height
 *   --sun-o            how dark the shadow is
 *   --sun-shade        its colour
 *   --sun-warm         how much sunrise is left in the light, 1 down to 0
 * Without them (no script, reduced motion) the page rests at noon: nothing thrown, plain paper.
 */

const RISE = 6; // degrees above the horizon when the hero lets go: SUN_EL_END in shoreline/scene.ts
const NOON = 55;
// The sun stands to the left, as in the hero, so shadows lean right of straight down the
// page: this many degrees at sunrise, swinging in as the sun climbs.
const LEAN = [55, 30];
const SHADE_DAWN = [59, 55, 82]; // cool against the warm light, like the undersides of the hero's clouds
const SHADE_NOON = [27, 35, 48]; // the page's ink
const FOLLOW = 6; // how quickly the light catches up with the scroll, as the hero's sun does

const rad = (deg: number) => (deg * Math.PI) / 180;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const channels = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

/** Early sunlight as "r, g, b": halfway between the edge and the rim of the hero's sun. */
export const SUNLIGHT = channels(SUN.edge)
  .map((c, i) => Math.round(mix(c, channels(SUN.rim)[i], 0.5)))
  .join(", ");

const PROPS = ["--sun-x", "--sun-y", "--sun-reach", "--sun-o", "--sun-shade", "--sun-warm"];

/** Keeps the sun's custom properties on `lit` in step with the scroll. Returns a stop function. */
export function watchDaylight(lit: HTMLElement) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};

  // m: the morning, 0 as `lit` first comes into view under the hero, 1 at the foot of the page
  const paint = (m: number) => {
    const el = rad(mix(RISE, NOON, m ** 1.6)); // slow off the horizon, so the long shadows last
    const lean = rad(mix(LEAN[0], LEAN[1], m));
    const reach = 1 / Math.tan(el);
    const s = lit.style;
    s.setProperty("--sun-x", (reach * Math.sin(lean)).toFixed(3));
    s.setProperty("--sun-y", (reach * Math.cos(lean)).toFixed(3));
    s.setProperty("--sun-reach", reach.toFixed(3));
    s.setProperty("--sun-o", mix(0.2, 0.12, m).toFixed(3));
    s.setProperty("--sun-shade", `rgb(${SHADE_DAWN.map((c, i) => Math.round(mix(c, SHADE_NOON[i], m))).join(", ")})`);
    s.setProperty("--sun-warm", ((1 - m) ** 2.2).toFixed(3)); // mostly gone by the first card
  };

  let target = 0;
  let morning = -1; // not read yet: the first reading is shown as it is, later ones are eased into
  let raf = 0;
  let last = 0;

  const tick = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    morning += (target - morning) * (1 - Math.exp(-dt * FOLLOW));
    if (Math.abs(target - morning) < 0.0005) morning = target;
    paint(morning);
    raf = morning === target ? 0 : requestAnimationFrame(tick);
  };
  const read = () => {
    const top = lit.getBoundingClientRect().top;
    const span = document.documentElement.scrollHeight - (top + window.scrollY);
    target = Math.min(Math.max((window.innerHeight - top) / span, 0), 1);
    if (morning < 0) {
      morning = target;
      paint(morning);
    } else if (!raf && morning !== target) {
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }
  };

  // Dev-only: hold the light at a moment of the morning, whatever the scroll says.
  if (process.env.NODE_ENV !== "production") {
    (window as unknown as Record<string, unknown>).__daylight = {
      at(m: number) {
        cancelAnimationFrame(raf);
        raf = 0;
        morning = target = m;
        paint(m);
      },
    };
  }

  window.addEventListener("scroll", read, { passive: true });
  window.addEventListener("resize", read);
  read();

  return () => {
    window.removeEventListener("scroll", read);
    window.removeEventListener("resize", read);
    cancelAnimationFrame(raf);
    PROPS.forEach((p) => lit.style.removeProperty(p));
  };
}
