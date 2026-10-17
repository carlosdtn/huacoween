import { drawText } from "../font";
import { dither, fill, skyline } from "../paint";
import { PALETTE } from "../palette";
import {
  bricks,
  bunting,
  flyingBats,
  fog,
  glow,
  grit,
  H,
  litWindow,
  nightSky,
  W,
} from "./common";
import type { Backdrop } from "./types";

const WALK = 196;

export const street: Backdrop = {
  paint: (ctx) => {
    nightSky(ctx, 140, 3);
    skyline(ctx, 70, 130, "V", 11);
    // the pollería: red brick with its sign
    bricks(ctx, 0, 60, 118, WALK - 60, "Q", "R");
    fill(ctx, 6, 64, 106, 34, "k");
    fill(ctx, 8, 66, 102, 30, "D");
    for (let x = 0; x < 118; x += 12) {
      fill(ctx, x, 100, 6, 10, "r");
      fill(ctx, x + 6, 100, 6, 10, "w");
    }
    fill(ctx, 0, 110, 118, 1, "k");
    // colonial house with a carved wooden balcony
    fill(ctx, 118, 70, 224, WALK - 70, "u");
    dither(ctx, 118, 70, 224, WALK - 70, "X", 0.2);
    grit(ctx, 118, 70, 224, 126, "T", 160, 5);
    fill(ctx, 118, 66, 224, 5, "J");
    fill(ctx, 138, 78, 184, 46, "N");
    fill(ctx, 138, 78, 184, 3, "n");
    for (let x = 142; x < 318; x += 8) {
      fill(ctx, x, 84, 5, 34, "n");
      dither(ctx, x, 84, 5, 34, "N", 0.5);
    }
    fill(ctx, 136, 122, 188, 4, "n");
    fill(ctx, 136, 126, 188, 1, "k");
    for (const x of [150, 200, 250, 300])
      litWindow(ctx, x, 140, 14, 24, x !== 200);
    bunting(ctx, 118, 342, 58, 10);
    // the alley gap
    fill(ctx, 342, 90, 54, WALK - 90, "Z");
    fill(ctx, 342, 90, 3, WALK - 90, "M");
    fill(ctx, 393, 90, 3, WALK - 90, "M");
    // blue house on the right, ready for Halloween
    fill(ctx, 396, 82, 84, WALK - 82, "B");
    dither(ctx, 396, 82, 84, WALK - 82, "b", 0.3);
    fill(ctx, 396, 78, 84, 5, "J");
    litWindow(ctx, 420, 110, 30, 26, true);
    // sidewalk, curb and street
    fill(ctx, 0, WALK, W, 18, "g");
    for (let x = 0; x < W; x += 24) fill(ctx, x, WALK, 1, 18, "G");
    fill(ctx, 0, WALK + 18, W, 3, "J");
    fill(ctx, 0, WALK + 21, W, H - WALK - 21, "M");
    dither(ctx, 0, WALK + 21, W, H - WALK - 21, "m", 0.3);
    for (let x = 10; x < W; x += 48) fill(ctx, x, 248, 24, 2, "Y");
  },
  ambient: (ctx, time) => {
    flyingBats(ctx, time, 70);
    // the neon sign hums and flickers
    const on = Math.sin(time * 13) + Math.sin(time * 4.7) > -1.4;
    const key = on ? "q" : "O";
    drawText(ctx, "LA BRASA", 28, 70, PALETTE[on ? "o" : "D"], 2);
    drawText(ctx, "LA BRASA", 27, 69, PALETTE[key], 2);
    drawText(ctx, "ETERNA", 36, 83, PALETTE[on ? "o" : "D"], 2);
    drawText(ctx, "ETERNA", 35, 82, PALETTE[key], 2);
    if (on) glow(ctx, 59, 82, 50, "o", 0.18);
    // the street lamp's pool of light
    glow(ctx, 326, 190, 40, "q", 0.25 + Math.sin(time * 3) * 0.03);
    fog(ctx, time, 200);
  },
};
