import { drawText, textWidth } from "../font";
import {
  bands,
  type Ctx,
  dither,
  fill,
  moon,
  px,
  seeded,
  stars,
} from "../paint";
import { type ColorKey, PALETTE } from "../palette";

/** Shared painting for the night outdoors, fog, bats and glowing lights. */

export const W = 480;
export const H = 270;

export const nightSky = (ctx: Ctx, horizon: number, seed: number) => {
  bands(ctx, 0, 0, W, horizon, ["Z", "Z", "V", "V", "v"]);
  stars(ctx, 90, horizon - 30, seed);
  moon(ctx, 400, 40, 14);
};

/** A soft round glow: stacked translucent discs, brightest in the middle. */
export const glow = (
  ctx: Ctx,
  cx: number,
  cy: number,
  r: number,
  key: ColorKey,
  strength = 0.35,
) => {
  const steps = 6;
  const previous = ctx.globalAlpha;
  ctx.globalAlpha = (strength / steps) * 0.9;
  for (let i = 0; i < steps; i++) {
    const ring = Math.round(r * (1 - i / steps));
    for (let dy = -ring; dy <= ring; dy++) {
      const half = Math.round(Math.sqrt(ring * ring - dy * dy));
      fill(ctx, cx - half, cy + dy, half * 2, 1, key);
    }
  }
  ctx.globalAlpha = previous;
};

/** Centred sign text, optionally with a drop shadow. */
export const sign = (
  ctx: Ctx,
  text: string,
  cx: number,
  y: number,
  key: ColorKey,
  scale = 1,
  shadow: ColorKey | null = "k",
) => {
  const x = Math.round(cx - textWidth(text, scale) / 2);
  if (shadow) drawText(ctx, text, x + scale, y + scale, PALETTE[shadow], scale);
  drawText(ctx, text, x, y, PALETTE[key], scale);
};

/** Drifting fog bands, drawn translucent over the lower half. */
export const fog = (
  ctx: Ctx,
  time: number,
  top: number,
  key: ColorKey = "I",
) => {
  ctx.globalAlpha = 0.12;
  for (let i = 0; i < 4; i++) {
    const y = top + i * 14;
    const x = ((time * (8 + i * 3) + i * 120) % (W + 200)) - 200;
    fill(ctx, x, y, 200, 6, key);
    fill(ctx, x + 30, y - 3, 120, 3, key);
  }
  ctx.globalAlpha = 1;
};

/** A few bats flapping across the sky. */
export const flyingBats = (ctx: Ctx, time: number, maxY: number) => {
  for (let i = 0; i < 3; i++) {
    const x = ((time * (24 + i * 9) + i * 170) % (W + 40)) - 20;
    const y = 20 + i * 18 + Math.sin(time * 2 + i) * 6;
    if (y > maxY) continue;
    const up = Math.floor(time * 8 + i) % 2 === 0;
    fill(ctx, x - 1, y, 3, 2, "k");
    fill(ctx, x - 5, y + (up ? -2 : 1), 4, 1, "k");
    fill(ctx, x + 2, y + (up ? -2 : 1), 4, 1, "k");
  }
};

/** Brick or adobe courses across an area. */
export const bricks = (
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  base: ColorKey,
  mortar: ColorKey,
) => {
  fill(ctx, x, y, w, h, base);
  for (let row = 0; row * 6 < h; row++) {
    const ry = y + row * 6;
    fill(ctx, x, ry, w, 1, mortar);
    for (let bx = x + (row % 2) * 7; bx < x + w; bx += 14)
      fill(ctx, bx, ry, 1, 6, mortar);
  }
};

/** Speckles of grit, deterministic so the backdrop never shimmers. */
export const grit = (
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  key: ColorKey,
  count: number,
  seed: number,
) => {
  const rand = seeded(seed);
  for (let i = 0; i < count; i++)
    px(ctx, x + Math.floor(rand() * w), y + Math.floor(rand() * h), key);
};

/** Halloween bunting: little alternating pennants on a string. */
export const bunting = (
  ctx: Ctx,
  x0: number,
  x1: number,
  y: number,
  sag = 8,
) => {
  const keys: ColorKey[] = ["o", "v", "k", "y"];
  let i = 0;
  for (let x = x0; x < x1; x += 10) {
    const t = (x - x0) / (x1 - x0);
    const yy = Math.round(y + Math.sin(t * Math.PI) * sag);
    fill(ctx, x, yy, 10, 1, "J");
    const key = keys[i++ % keys.length];
    for (let r = 0; r < 6; r++)
      fill(ctx, x + 2 + r / 2, yy + 1 + r, 6 - r, 1, key);
  }
};

/** Window with warm light and a cross frame. */
export const litWindow = (
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  lit: boolean,
) => {
  fill(ctx, x - 1, y - 1, w + 2, h + 2, "k");
  fill(ctx, x, y, w, h, lit ? "q" : "B");
  if (lit) dither(ctx, x, y + h / 2, w, h / 2, "y", 0.5);
  fill(ctx, x + w / 2, y, 1, h, "k");
  fill(ctx, x, y + h / 2, w, 1, "k");
};
