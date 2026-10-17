import { STAGE } from "@/game/types";
import { type ColorKey, PALETTE } from "./palette";

/** Drawing helpers for backdrops. Everything snaps to whole pixels in palette colours. */

export type Ctx = CanvasRenderingContext2D;

export const fill = (
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  key: ColorKey,
) => {
  ctx.fillStyle = PALETTE[key];
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
};

export const px = (ctx: Ctx, x: number, y: number, key: ColorKey) =>
  fill(ctx, x, y, 1, 1, key);

const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

/** Ordered dithering: paints `key` over roughly `density` (0–1) of the area. */
export const dither = (
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  key: ColorKey,
  density: number,
) => {
  ctx.fillStyle = PALETTE[key];
  for (let dy = 0; dy < h; dy++) {
    for (let dx = 0; dx < w; dx++) {
      const gx = Math.round(x) + dx;
      const gy = Math.round(y) + dy;
      if (BAYER[gy & 3][gx & 3] / 16 < density) ctx.fillRect(gx, gy, 1, 1);
    }
  }
};

/** Vertical gradient through the given colours, dithered between steps. */
export const bands = (
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  keys: ColorKey[],
) => {
  const step = h / (keys.length - 1);
  keys.slice(0, -1).forEach((key, i) => {
    const top = y + i * step;
    fill(ctx, x, top, w, step + 1, key);
    for (let dy = 0; dy < step; dy++) {
      dither(ctx, x, top + dy, w, 1, keys[i + 1], dy / step);
    }
  });
};

/** Deterministic randomness, so backdrops look the same every time. */
export const seeded = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export const stars = (ctx: Ctx, count: number, maxY: number, seed: number) => {
  const rand = seeded(seed);
  for (let i = 0; i < count; i++) {
    px(
      ctx,
      Math.floor(rand() * STAGE.w),
      Math.floor(rand() * maxY),
      rand() > 0.7 ? "w" : "g",
    );
  }
};

export const moon = (ctx: Ctx, cx: number, cy: number, r: number) => {
  dither(ctx, cx - r - 4, cy - r - 4, r * 2 + 9, r * 2 + 9, "v", 0.12);
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      const d = Math.hypot(dx, dy);
      if (d <= r) px(ctx, cx + dx, cy + dy, d > r - 1.5 ? "Y" : "w");
    }
  }
  px(ctx, cx - 2, cy + 1, "Y");
  px(ctx, cx + 2, cy - 3, "Y");
};

/** Skyline of building silhouettes with a few lit windows. */
export const skyline = (
  ctx: Ctx,
  top: number,
  bottom: number,
  key: ColorKey,
  seed: number,
) => {
  const rand = seeded(seed);
  for (let x = 0; x < STAGE.w; ) {
    const w = 14 + Math.floor(rand() * 20);
    const h = Math.floor(rand() * (bottom - top));
    fill(ctx, x, bottom - h, w - 1, h, key);
    for (let wy = bottom - h + 3; wy < bottom - 3; wy += 5) {
      for (let wx = x + 2; wx < x + w - 3; wx += 4) {
        if (rand() > 0.82) fill(ctx, wx, wy, 2, 2, rand() > 0.5 ? "y" : "O");
      }
    }
    x += w;
  }
};
