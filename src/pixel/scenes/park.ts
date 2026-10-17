import { dither, fill, px, seeded } from "../paint";
import { fog, glow, grit, H, nightSky, W } from "./common";
import type { Backdrop } from "./types";

const GROUND = 196;

const tree = (
  ctx: Parameters<typeof fill>[0],
  x: number,
  h: number,
  seed: number,
) => {
  const rand = seeded(seed);
  fill(ctx, x - 4, GROUND - h, 8, h, "j");
  for (let i = 0; i < 9; i++) {
    const cx = x + (rand() - 0.5) * 50;
    const cy = GROUND - h - 10 + (rand() - 0.5) * 30;
    const r = 12 + rand() * 12;
    for (let dy = -r; dy <= r; dy++) {
      const half = Math.sqrt(r * r - dy * dy);
      fill(ctx, cx - half, cy + dy, half * 2, 1, i % 3 ? "x" : "E");
    }
  }
};

export const park: Backdrop = {
  paint: (ctx) => {
    nightSky(ctx, 150, 21);
    // a far row of dark trees
    for (let x = -20; x < W + 20; x += 34)
      tree(ctx, x, 40 + ((x * 7) % 30), x + 99);
    dither(ctx, 0, 60, W, 140, "Z", 0.25);
    for (const [x, h] of [
      [210, 90],
      [470, 110],
    ])
      tree(ctx, x, h, x);
    // grass and a dirt path
    fill(ctx, 0, GROUND, W, H - GROUND, "x");
    dither(ctx, 0, GROUND, W, H - GROUND, "L", 0.25);
    grit(ctx, 0, GROUND, W, H - GROUND, "l", 140, 8);
    fill(ctx, 0, 222, W, 40, "X");
    dither(ctx, 0, 222, W, 40, "u", 0.25);
    fill(ctx, 0, 222, W, 1, "j");
    fill(ctx, 0, 261, W, 1, "j");
    // a lamp with a sad yellow halo
    fill(ctx, 226, 110, 3, 86, "M");
    fill(ctx, 221, 104, 13, 6, "M");
    fill(ctx, 223, 110, 9, 3, "q");
  },
  ambient: (ctx, time) => {
    glow(ctx, 227, 120, 44, "q", 0.3);
    // eyes blinking in the trees
    const eyes: [number, number][] = [
      [60, 120],
      [180, 104],
      [420, 128],
    ];
    eyes.forEach(([x, y], i) => {
      if (Math.floor(time * 0.7 + i * 1.3) % 3 === 0) return;
      px(ctx, x, y, "y");
      px(ctx, x + 4, y, "y");
    });
    fog(ctx, time, 186);
  },
};
