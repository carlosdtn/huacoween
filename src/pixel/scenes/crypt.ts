import { dither, fill, px } from "../paint";
import { glow, grit, H, W } from "./common";
import type { Backdrop } from "./types";

const FLOOR = 216;

export const crypt: Backdrop = {
  paint: (ctx) => {
    // stone blocks
    fill(ctx, 0, 0, W, FLOOR, "M");
    for (let y = 0; y < FLOOR; y += 16)
      for (let x = (y / 16) % 2 ? -16 : 0; x < W; x += 32) {
        fill(ctx, x + 1, y + 1, 30, 14, "G");
        dither(ctx, x + 1, y + 1, 30, 14, "m", 0.3);
      }
    // a round window with violet moonlight
    for (let r = 14; r >= 0; r--) {
      const key = r > 12 ? "k" : "V";
      for (let dy = -r; dy <= r; dy++) {
        const half = Math.sqrt(r * r - dy * dy);
        fill(ctx, 150 - half, 50 + dy, half * 2, 1, key);
      }
    }
    fill(ctx, 149, 37, 2, 27, "k");
    fill(ctx, 137, 49, 27, 2, "k");
    for (let y = 64; y < FLOOR; y++)
      dither(ctx, 138 + (y - 64) * 0.5, y, 30, 1, "v", 0.12);
    // the family niches, all but Don Eusebio's (drawn as a prop)
    for (let row = 0; row < 3; row++)
      for (let col = 0; col < 3; col++) {
        const x = 292 + col * 60;
        const y = 52 + row * 48;
        if (row === 1 && col === 1) continue;
        fill(ctx, x, y, 58, 44, "g");
        fill(ctx, x + 3, y + 3, 52, 38, "J");
        dither(ctx, x + 3, y + 3, 52, 38, "X", 0.3);
        fill(ctx, x + 14, y + 10, 30, 6, "X");
      }
    // cobwebs in the corners
    for (let i = 0; i < 24; i++) {
      px(ctx, i, i, "g");
      px(ctx, i, 0, "g");
      px(ctx, 0, i, "g");
      if (i % 6 === 0) for (let j = 0; j < i; j++) px(ctx, j, i - j, "G");
    }
    // stone floor
    fill(ctx, 0, FLOOR, W, H - FLOOR, "G");
    for (let y = FLOOR; y < H; y += 12)
      for (let x = (y / 12) % 2 ? 0 : 20; x < W; x += 40)
        fill(ctx, x, y, 1, 12, "M");
    for (let y = FLOOR; y < H; y += 12) fill(ctx, 0, y, W, 1, "M");
    grit(ctx, 0, FLOOR, W, H - FLOOR, "g", 160, 3);
    fill(ctx, 0, FLOOR, W, 1, "k");
  },
  ambient: (ctx, time) => {
    glow(ctx, 124, 196, 70, "o", 0.28 + Math.sin(time * 7) * 0.05);
    glow(ctx, 150, 50, 30, "v", 0.25);
  },
};
