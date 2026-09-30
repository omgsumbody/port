// Colours sampled from the approved Gemini reference (image 1, "golden shoreline").
// `morning` is the reference itself; `dawn` is the same scene before sunrise,
// used at scroll progress 0. Everything in between is interpolated.

export const SKY_STOPS_DEG = [0, 1.5, 3.7, 5.3, 7, 8.6, 10.1, 11.9, 13.4, 22];

export const SKY_MORNING = [
  "#a84f25", // horizon band, deep burnt orange
  "#b96734",
  "#c78451",
  "#c99978",
  "#c7aa98",
  "#c5b2af",
  "#b7b7be",
  "#b1c0c9",
  "#adc3d0",
  "#a5c5d3", // zenith, pale teal
];

export const SKY_DAWN = [
  "#8a5a4a",
  "#8f6558",
  "#917068",
  "#8f7a78",
  "#8b8488",
  "#878b95",
  "#81909f",
  "#7e95a6",
  "#7c98aa",
  "#7a9aad",
];

export const SUN = {
  core: "#feec3c",
  edge: "#fec55b",
  rim: "#fc9c68",
  glow: "#f2e296",
};

export const CLOUD = {
  top: "#b5c3cf",
  side: "#8e96a8",
  under: "#74748a",
  warm: "#a98087",
  lit: "#dba7ad",
};

export const WATER = {
  deep: "#244f86",
  mid: "#3470b4",
  high: "#4f86c8",
  crest: "#8eb2d8",
  foam: "#e9eef2",
  far: "#596287",
  farNear: "#406794",
};

export const SAND = {
  wet: "#818a98",
  wetDark: "#768090",
  dry: "#8f95a0",
  side: "#737a88",
  far: "#90787a",
  puddle: "#a8b8c6",
  chipTop: "#5d4a3f",
  chipSide: "#3f322c",
};

export const REFLECTION = {
  far: "#fed16b",
  mid: "#f9a362",
  near: "#c57868",
};

export const PARTICLE = "#e8f6ff";
