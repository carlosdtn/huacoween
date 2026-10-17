import { dither, fill } from "../paint";
import { flyingBats, fog, grit, H, nightSky, sign, W } from "./common";
import type { Backdrop } from "./types";

const WALL = 96;
const GROUND = 216;

export const cemeteryGate: Backdrop = {
  paint: (ctx) => {
    nightSky(ctx, 150, 33);
    // cypresses and crosses peeking over the wall
    for (const x of [40, 120, 200, 400, 452]) {
      for (let y = 30; y < WALL; y++) {
        const half = Math.min(9, (y - 30) / 4);
        fill(ctx, x - half, y, half * 2, 1, "E");
      }
    }
    for (const x of [80, 160, 430]) {
      fill(ctx, x, 70, 3, 26, "G");
      fill(ctx, x - 5, 76, 13, 3, "G");
    }
    // the long cemetery wall
    fill(ctx, 0, WALL, W, GROUND - WALL, "J");
    dither(ctx, 0, WALL, W, GROUND - WALL, "X", 0.25);
    grit(ctx, 0, WALL, W, GROUND - WALL, "G", 200, 6);
    fill(ctx, 0, WALL - 4, W, 5, "w");
    fill(ctx, 0, WALL + 1, W, 1, "X");
    // arch over the gate with its name
    fill(ctx, 256, 36, 128, 42, "k");
    fill(ctx, 258, 38, 124, 38, "J");
    dither(ctx, 258, 38, 124, 38, "X", 0.2);
    fill(ctx, 262, 76, 116, 140, "Z");
    sign(ctx, "JARDINES", 320, 42, "D", 2, null);
    sign(ctx, "DEL MAS ACA", 320, 58, "D", 2, null);
    // dirt road
    fill(ctx, 0, GROUND, W, H - GROUND, "j");
    dither(ctx, 0, GROUND, W, H - GROUND, "u", 0.2);
    grit(ctx, 0, GROUND, W, H - GROUND, "D", 200, 2);
    fill(ctx, 0, GROUND, W, 1, "D");
  },
  ambient: (ctx, time) => {
    flyingBats(ctx, time, 80);
    fog(ctx, time, 196);
  },
};
