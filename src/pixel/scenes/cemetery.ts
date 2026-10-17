import { dither, fill } from "../paint";
import { fog, glow, grit, H, nightSky, W } from "./common";
import type { Backdrop } from "./types";

const GROUND = 216;
const CANDLES: [number, number][] = [
  [30, 92],
  [94, 120],
  [158, 148],
  [222, 92],
  [62, 176],
  [254, 148],
];

export const cemetery: Backdrop = {
  paint: (ctx) => {
    nightSky(ctx, 150, 45);
    // the pabellón: a wall of niches, four rows high
    fill(ctx, 0, 70, 300, GROUND - 70, "X");
    fill(ctx, 0, 64, 300, 7, "w");
    for (let row = 0; row < 4; row++)
      for (let col = 0; col < 9; col++) {
        const x = 4 + col * 32;
        const y = 76 + row * 28;
        fill(ctx, x, y, 28, 24, "J");
        dither(ctx, x, y, 28, 24, "w", 0.25);
        fill(ctx, x + 6, y + 6, 16, 3, "X");
        if ((row + col) % 3 === 0) {
          fill(ctx, x + 10, y + 16, 6, 6, "G");
          fill(ctx, x + 9, y + 13, 3, 3, (row + col) % 2 ? "r" : "p");
          fill(ctx, x + 14, y + 12, 3, 3, "y");
        }
      }
    // cypresses
    for (const x of [458, 300]) {
      for (let y = 40; y < GROUND; y++) {
        const half = Math.min(12, (y - 40) / 5);
        fill(ctx, x - half, y, half * 2, 1, "E");
      }
      dither(ctx, x - 12, 60, 24, GROUND - 60, "x", 0.3);
    }
    // grass and a gravel path
    fill(ctx, 0, GROUND, W, H - GROUND, "x");
    dither(ctx, 0, GROUND, W, H - GROUND, "E", 0.3);
    fill(ctx, 0, 226, W, 34, "g");
    dither(ctx, 0, 226, W, 34, "G", 0.35);
    grit(ctx, 0, 226, W, 34, "J", 200, 12);
    fill(ctx, 0, GROUND, W, 1, "k");
  },
  ambient: (ctx, time) => {
    CANDLES.forEach(([x, y], i) => {
      const on = Math.sin(time * 5 + i * 1.7) > -0.6;
      fill(ctx, x, y + 2, 2, 5, "w");
      if (on) {
        fill(ctx, x, y - 1, 2, 3, "o");
        glow(ctx, x + 1, y + 1, 10, "q", 0.4);
      }
    });
    fog(ctx, time, 200);
  },
};
