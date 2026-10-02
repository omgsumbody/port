// Shared flags between the layout, the page loader and the home hero.

let booted = false;
/** True once the app has hydrated, i.e. any later page mount is an in-site navigation. */
export const isBooted = () => booted;
export const markBooted = () => {
  booted = true;
};

// ─── Intro hand-off ───
// While the page loader plays, the hero's scene boots underneath but holds its build
// animation. The loader reveals it as it leaves, so the world assembles into view
// instead of having already finished behind the overlay.

let introPlaying = false;
export const isIntroPlaying = () => introPlaying;
export const setIntroPlaying = (value: boolean) => {
  introPlaying = value;
};

let heroReady = false;
/** The hero's scene exists and has drawn its first frame (or has given up on WebGL). */
export const isHeroReady = () => heroReady;
export const setHeroReady = (value: boolean) => {
  heroReady = value;
};

const revealListeners = new Set<() => void>();
/** The hero subscribes; called once when the loader starts to clear. Returns an unsubscribe. */
export const onIntroReveal = (listener: () => void) => {
  revealListeners.add(listener);
  return () => {
    revealListeners.delete(listener);
  };
};
export const revealIntro = () => {
  introPlaying = false;
  revealListeners.forEach((listener) => listener());
  revealListeners.clear();
};
