import { dither, fill, px } from "../paint";
import { glow, grit, H, sign, W } from "./common";
import type { Backdrop } from "./types";

const FLOOR = 216;

export const kitchen: Backdrop = {
  paint: (ctx) => {
    // greasy yellow wall over white tiles
    fill(ctx, 0, 0, W, 130, "Y");
    dither(ctx, 0, 0, W, 40, "t", 0.18);
    dither(ctx, 0, 90, W, 40, "t", 0.1);
    grit(ctx, 0, 0, W, 130, "t", 260, 7);
    fill(ctx, 0, 127, W, 4, "r");
    fill(ctx, 0, 131, W, 1, "R");
    fill(ctx, 0, 132, W, FLOOR - 132, "w");
    for (let y = 132; y < FLOOR; y += 10) fill(ctx, 0, y, W, 1, "J");
    for (let x = 0; x < W; x += 10) fill(ctx, x, 132, 1, FLOOR - 132, "J");
    dither(ctx, 0, 190, W, 26, "J", 0.25);
    // red and black floor tiles
    fill(ctx, 0, FLOOR, W, H - FLOOR, "D");
    for (let row = 0; row * 9 + FLOOR < H; row++)
      for (let col = 0; col * 12 < W; col++)
        if ((row + col) % 2 === 0)
          fill(ctx, col * 12, FLOOR + row * 9, 12, 9, "Q");
    fill(ctx, 0, FLOOR, W, 1, "k");
    dither(ctx, 0, FLOOR + 1, W, 6, "k", 0.4);
    // clock frozen at 23:57
    for (let a = 0; a < Math.PI * 2; a += 0.05)
      px(
        ctx,
        140 + Math.round(Math.cos(a) * 11),
        40 + Math.round(Math.sin(a) * 11),
        "k",
      );
    for (let r = 0; r < 10; r++)
      fill(
        ctx,
        140 - Math.sqrt(100 - r * r),
        40 - r,
        Math.sqrt(100 - r * r) * 2,
        r * 2 + 1,
        "w",
      );
    fill(ctx, 140, 32, 1, 9, "k");
    fill(ctx, 133, 39, 8, 1, "k");
    px(ctx, 140, 40, "r");
    // a rack of hanging ladles over the fryer
    fill(ctx, 112, 92, 50, 3, "G");
    for (const x of [118, 130, 142, 154]) {
      fill(ctx, x, 95, 1, 14, "g");
      fill(ctx, x - 2, 108, 5, 4, "g");
    }
    // the comanda rail
    fill(ctx, 236, 80, 38, 3, "g");
    fill(ctx, 236, 80, 38, 1, "w");
    // hanging lamp
    fill(ctx, 160, 0, 1, 14, "k");
    fill(ctx, 150, 14, 21, 6, "G");
    fill(ctx, 154, 20, 13, 2, "q");
    glow(ctx, 160, 24, 46, "q", 0.4);
    sign(ctx, "POLLO A LA BRASA", 76, 8, "R", 1, null);
  },
  ambient: (ctx, time) => {
    // the brasa breathes orange onto the wall
    const pulse = 0.3 + Math.sin(time * 6) * 0.08 + Math.sin(time * 17) * 0.04;
    glow(ctx, 62, 170, 64, "o", pulse);
  },
};
