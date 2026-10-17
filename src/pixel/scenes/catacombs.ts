import { dither, fill, px } from "../paint";
import { glow, grit, H, W } from "./common";
import type { Backdrop } from "./types";

const FLOOR = 216;
const TORCHES = [92, 372];

const skull = (ctx: Parameters<typeof fill>[0], x: number, y: number) => {
  fill(ctx, x - 3, y - 3, 7, 6, "J");
  fill(ctx, x - 2, y + 3, 5, 2, "X");
  px(ctx, x - 2, y - 1, "k");
  px(ctx, x + 2, y - 1, "k");
  px(ctx, x, y + 1, "k");
};

export const catacombs: Backdrop = {
  paint: (ctx) => {
    // stone walls under a low vault
    fill(ctx, 0, 0, W, FLOOR, "M");
    for (let y = 0; y < FLOOR; y += 12)
      for (let x = (y / 12) % 2 ? 0 : 14; x < W; x += 28) {
        fill(ctx, x, y, 27, 11, "m");
        dither(ctx, x, y, 27, 11, "G", 0.12);
      }
    for (let x = 0; x < W; x += 120) {
      for (let a = 0; a <= 60; a++) {
        const y = 40 - Math.sin((a / 60) * Math.PI) * 34;
        fill(ctx, x + a * 2, y, 3, 4, "G");
      }
    }
    // a whole wall of bones behind the Muqui
    for (let y = 104; y < FLOOR - 4; y += 10) {
      for (let x = 224; x < 388; x += 10) skull(ctx, x + ((y / 10) % 2) * 5, y);
      fill(ctx, 220, y + 5, 170, 2, "X");
    }
    // the famous bone circles
    for (let ring = 0; ring < 3; ring++) {
      const r = 44 - ring * 14;
      const count = 18 - ring * 5;
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2;
        const x = 155 + Math.cos(a) * r;
        const y = 108 + Math.sin(a) * r * 0.9;
        if (ring === 1) fill(ctx, x - 4, y - 1, 9, 3, "J");
        else skull(ctx, Math.round(x), Math.round(y));
      }
    }
    skull(ctx, 155, 108);
    // dirt floor
    fill(ctx, 0, FLOOR, W, H - FLOOR, "j");
    dither(ctx, 0, FLOOR, W, H - FLOOR, "D", 0.3);
    grit(ctx, 0, FLOOR, W, H - FLOOR, "X", 160, 4);
    fill(ctx, 0, FLOOR, W, 1, "k");
    for (const x of TORCHES) {
      fill(ctx, x - 1, 70, 3, 16, "n");
      fill(ctx, x - 3, 84, 7, 3, "G");
    }
    // darkness creeping in from the edges
    for (let i = 0; i < 6; i++) {
      dither(ctx, 0, 0, W, 8 - i, "Z", 0.15);
      dither(ctx, 0, 0, 30 - i * 4, H, "Z", 0.12);
      dither(ctx, W - 30 + i * 4, 0, 30, H, "Z", 0.12);
    }
  },
  ambient: (ctx, time) => {
    for (const [i, x] of TORCHES.entries()) {
      const f = Math.floor(time * 10 + i * 3) % 3;
      glow(ctx, x, 64, 56, "o", 0.3 + f * 0.03);
      fill(ctx, x - 2, 62 - f, 5, 8 + f, "o");
      fill(ctx, x - 1, 64 - f, 3, 5, "q");
    }
  },
};
