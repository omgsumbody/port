// Colours for the v3 shoreline, taken from the Gemini reference (image 1) and tuned by
// sampling the render against it.

// Sky, by elevation above the horizon in degrees.
export const SKY_STOPS: [number, string][] = [
  [0, "#a84f25"],
  [0.4, "#ad5629"],
  [1.5, "#b96734"],
  [2.6, "#c78451"],
  [3.7, "#c99978"],
  [4.8, "#c7aa98"],
  [5.9, "#c5b2af"],
  [6.9, "#b7b7be"],
  [7.9, "#b1c0c9"],
  [9.0, "#adc3d0"],
  [11.2, "#a8c7d3"],
  [14.2, "#a5c5d3"],
  [30, "#a2c3d2"],
];

export const SUN = {
  core: "#fde330",
  edge: "#fdb44a",
  rim: "#f98a4e",
  glow: "#f6d98c",
};

export const CLOUD = {
  top: "#a9bccb",
  side: "#9a8591",
  sideHigh: "#8ba6b8",
  under: "#aa7e7f",
  warm: "#c47b74",
  silver: "#f0b08e",
};

export const WATER = {
  top: "#1d4981",
  topFar: "#2a5c96",
  topLight: "#4f84b6",
  flat: "#5a78aa",
  riser: "#173d70",
  foam: "#edf1f5",
  foamSide: "#b7c9dc",
  lip: "#7d9cc0",
  far: "#2f5a92",
  horizon: "#4b6a9c",
};

export const SAND = {
  base: "#6f7e8c",
  seam: "#5f6a78",
  pit: "#8fa3bd",
};

export const STREAK = {
  far: "#fed16b",
  mid: "#f7a655",
  near: "#c47a6a",
};

export const CHIP = {
  top: "#5b4a40",
  side: "#35291f",
};

export const SPECK = "#eafcff";

export const PILLAR = {
  top: "#dcc6bf",
  side: "#c3a69e",
};
