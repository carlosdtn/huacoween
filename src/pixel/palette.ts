/**
 * One palette for the whole game keeps every sprite and backdrop coherent.
 * Sprites are written as text grids where each character is one of these keys.
 */
export const PALETTE = {
  k: "#140c1c", // outline
  K: "#2b1d36", // deep shadow
  w: "#f4f0e8", // white
  g: "#9a95a8", // gray
  G: "#5c5670", // dark gray
  s: "#f2c29a", // skin
  S: "#cf9772", // skin shadow
  h: "#2a2433", // hair
  H: "#4a4258", // hair highlight
  r: "#c81d25", // red
  R: "#7a1018", // dark red
  o: "#ff7a1a", // pumpkin orange
  O: "#b84a0e", // dark orange
  y: "#ffc107", // signal yellow
  Y: "#f8e9a4", // soft yellow
  n: "#8a5229", // wood
  N: "#5a3418", // dark wood
  u: "#c08a54", // tan
  b: "#3a5a9a", // blue
  B: "#24365e", // dark blue
  c: "#6ac4e0", // screen cyan
  C: "#2f7d9a", // dark cyan
  e: "#3fae5a", // green
  E: "#1f6b34", // dark green
  p: "#e88aa8", // pink
  P: "#a8506e", // dark pink
  v: "#6a4a9a", // violet
  V: "#3e2a66", // dark violet
  f: "#efe2c4", // cream fur
  F: "#b8a080", // fur shade
  m: "#33384a", // charcoal
  M: "#1d2029", // charcoal shadow
  // Added for the finer 480×270 stage: more steps for shading.
  a: "#e0a46c", // clay
  A: "#a8603a", // clay shadow
  d: "#6e3420", // deep clay
  i: "#fff4dc", // warm highlight
  j: "#3d2616", // dark brown
  D: "#24160c", // deepest brown
  l: "#a6d86e", // leaf
  L: "#5a8a3a", // leaf shadow
  x: "#3a5a2a", // moss
  t: "#e8b04a", // golden crisp
  T: "#c07a2a", // roast
  q: "#ffe28a", // glow
  Q: "#8f2f1f", // brick
  J: "#d8c8a0", // bone
  X: "#8e7a5a", // bone shadow
  I: "#d8e8ff", // ghost light
  z: "#9ab0d8", // ghost shade
  Z: "#0a0d18", // night black
} as const;

export type ColorKey = keyof typeof PALETTE;

/** `.` is always transparent. */
export const TRANSPARENT = ".";
