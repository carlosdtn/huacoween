import { PALETTE, TRANSPARENT } from "./palette";

/** Rows of palette keys; every row has the same length. */
export type Frame = readonly string[];

export type Anim = { frames: readonly Frame[]; fps: number };

export const size = (frame: Frame) => ({
  w: frame[0]?.length ?? 0,
  h: frame.length,
});

/** Builds a frame from parts stacked top to bottom (head, torso, legs…). */
export const stack = (...parts: Frame[]): Frame => parts.flat();

/** Pads every row to the same width, centred, so parts of different widths stack. */
export const centre = (frame: Frame, width: number): Frame =>
  frame.map((row) => {
    const left = Math.floor((width - row.length) / 2);
    return row
      .padStart(row.length + left, TRANSPARENT)
      .padEnd(width, TRANSPARENT);
  });

export const still = (frame: Frame): Anim => ({ frames: [frame], fps: 1 });

export const frameAt = (anim: Anim, time: number): Frame => {
  const count = anim.frames.length;
  // rAF timestamps can be slightly older than the start time, so wrap negatives too.
  return anim.frames[((Math.floor(time * anim.fps) % count) + count) % count];
};

const cache = new WeakMap<Frame, HTMLCanvasElement>();

/** Rasterizes a frame once; later draws reuse the cached canvas. */
export const bake = (frame: Frame): HTMLCanvasElement => {
  const hit = cache.get(frame);
  if (hit) return hit;
  const { w, h } = size(frame);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    frame.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        const key = row[x];
        if (key === TRANSPARENT) continue;
        ctx.fillStyle = PALETTE[key as keyof typeof PALETTE];
        ctx.fillRect(x, y, 1, 1);
      }
    });
  }
  cache.set(frame, canvas);
  return canvas;
};

/** Draws with the frame's bottom-centre at (x, y), the natural foot point. */
export const drawAt = (
  ctx: CanvasRenderingContext2D,
  frame: Frame,
  x: number,
  y: number,
  flip = false,
): void => {
  const { w, h } = size(frame);
  const left = Math.round(x - w / 2);
  const top = Math.round(y - h);
  if (!flip) {
    ctx.drawImage(bake(frame), left, top);
    return;
  }
  ctx.save();
  ctx.translate(left + w, top);
  ctx.scale(-1, 1);
  ctx.drawImage(bake(frame), 0, 0);
  ctx.restore();
};

/** Returns a copy of the frame with some pixels repainted, for blinks and other variants. */
export const paint = (
  frame: Frame,
  edits: [x: number, y: number, key: string][],
): Frame => {
  const rows = frame.map((row) => [...row]);
  for (const [x, y, key] of edits) rows[y][x] = key;
  return rows.map((row) => row.join(""));
};

/** Adds transparent rows at the bottom, lifting the drawn sprite (used for walk bobbing). */
export const lift = (frame: Frame, rows = 1): Frame => [
  ...frame,
  ...Array.from({ length: rows }, () => ".".repeat(size(frame).w)),
];

/** Swaps palette keys, e.g. to turn the black cat into an orange one. */
export const recolor = (frame: Frame, swaps: Record<string, string>): Frame =>
  frame.map((row) => [...row].map((key) => swaps[key] ?? key).join(""));

/** Rotates a frame a quarter turn clockwise. */
export const rotate = (frame: Frame): Frame => {
  const { w, h } = size(frame);
  return Array.from({ length: w }, (_, x) =>
    Array.from({ length: h }, (_, y) => frame[h - 1 - y][x]).join(""),
  );
};
