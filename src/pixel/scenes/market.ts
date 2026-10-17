import { dither, fill } from "../paint";
import { bunting, glow, grit, H, sign, W } from "./common";
import type { Backdrop } from "./types";

const FLOOR = 216;
const BULBS = [110, 222, 318, 430];

export const market: Backdrop = {
  paint: (ctx) => {
    // corrugated roof and beams
    fill(ctx, 0, 0, W, 40, "G");
    for (let x = 0; x < W; x += 6) fill(ctx, x, 0, 2, 40, "m");
    fill(ctx, 0, 38, W, 4, "N");
    for (let x = 0; x < W; x += 80) {
      for (let i = 0; i < 30; i++) fill(ctx, x + i, 40 - i, 3, 2, "N");
    }
    // back wall with the silhouettes of more stalls
    fill(ctx, 0, 42, W, FLOOR - 42, "K");
    dither(ctx, 0, 42, W, FLOOR - 42, "V", 0.15);
    for (let x = 0; x < W; x += 60) {
      fill(ctx, x + 6, 120, 48, FLOOR - 120, "V");
      fill(ctx, x + 2, 112, 56, 8, "v");
      for (let i = 0; i < 5; i++)
        fill(ctx, x + 10 + i * 9, 124, 4, 8 + (i % 3) * 4, "K");
    }
    // the banner
    fill(ctx, 120, 50, 240, 22, "k");
    fill(ctx, 122, 52, 236, 18, "R");
    dither(ctx, 122, 52, 236, 18, "Q", 0.3);
    sign(ctx, "MERCADO DE LAS BRUJAS", 240, 56, "q", 2);
    bunting(ctx, 0, W, 80, 14);
    // bulbs on long cords
    for (const x of BULBS) {
      fill(ctx, x, 42, 1, 52, "k");
      fill(ctx, x - 2, 94, 5, 6, "q");
    }
    // concrete floor
    fill(ctx, 0, FLOOR, W, H - FLOOR, "G");
    dither(ctx, 0, FLOOR, W, H - FLOOR, "g", 0.25);
    grit(ctx, 0, FLOOR, W, H - FLOOR, "M", 220, 9);
    fill(ctx, 0, FLOOR, W, 1, "k");
  },
  ambient: (ctx, time) => {
    BULBS.forEach((x, i) => {
      const flicker = Math.sin(time * (9 + i) + i * 2) > -0.9;
      if (flicker) glow(ctx, x, 98, 34, "q", 0.35);
      fill(ctx, x - 2, 94, 5, 6, flicker ? "q" : "T");
    });
    // incense smoke curling up from Lucha's stall
    ctx.globalAlpha = 0.35;
    for (let i = 0; i < 8; i++) {
      const t = (time * 0.6 + i / 8) % 1;
      const y = 110 - t * 70;
      const x = 152 + Math.sin(t * 9 + i) * 6;
      fill(ctx, x, y, 3 + t * 4, 2, "I");
    }
    ctx.globalAlpha = 1;
  },
};
