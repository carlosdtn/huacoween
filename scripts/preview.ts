/**
 * Renders scenes and sprites to PNG without a browser, for quick art reviews:
 *   bun scripts/preview.ts scene kitchen out.png
 *   bun scripts/preview.ts sprites out.png
 * A tiny fake canvas implements just what the pixel code uses.
 */
import { writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";

type RGBA = [number, number, number, number];

class FakeCtx {
  fillStyle = "#000000";
  globalAlpha = 1;
  imageSmoothingEnabled = false;
  private stack: { tx: number; ty: number; sx: number }[] = [];
  private tx = 0;
  private ty = 0;
  private sx = 1;
  constructor(readonly canvas: FakeCanvas) {}
  private parse(): RGBA {
    const hex = this.fillStyle.replace("#", "");
    return [
      Number.parseInt(hex.slice(0, 2), 16),
      Number.parseInt(hex.slice(2, 4), 16),
      Number.parseInt(hex.slice(4, 6), 16),
      255,
    ];
  }
  blend(x: number, y: number, c: RGBA, alpha: number) {
    const { width, height, data } = this.canvas;
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const i = (y * width + x) * 4;
    const a = (c[3] / 255) * alpha;
    for (let k = 0; k < 3; k++) data[i + k] = data[i + k] * (1 - a) + c[k] * a;
    data[i + 3] = Math.min(255, data[i + 3] + a * 255);
  }
  fillRect(x: number, y: number, w: number, h: number) {
    const c = this.parse();
    for (let dy = 0; dy < h; dy++)
      for (let dx = 0; dx < w; dx++) {
        const px = this.sx < 0 ? this.tx - (x + dx) - 1 : this.tx + x + dx;
        this.blend(
          Math.floor(px),
          Math.floor(this.ty + y + dy),
          c,
          this.globalAlpha,
        );
      }
  }
  clearRect() {}
  save() {
    this.stack.push({ tx: this.tx, ty: this.ty, sx: this.sx });
  }
  restore() {
    Object.assign(this, this.stack.pop());
  }
  translate(x: number, y: number) {
    this.tx += x;
    this.ty += y;
  }
  scale(x: number) {
    this.sx *= x;
  }
  drawImage(
    img: FakeCanvas,
    x: number,
    y: number,
    w = img.width,
    h = img.height,
  ) {
    for (let dy = 0; dy < h; dy++)
      for (let dx = 0; dx < w; dx++) {
        const sx = Math.floor((dx * img.width) / w);
        const sy = Math.floor((dy * img.height) / h);
        const i = (sy * img.width + sx) * 4;
        const c: RGBA = [
          img.data[i],
          img.data[i + 1],
          img.data[i + 2],
          img.data[i + 3],
        ];
        if (!c[3]) continue;
        const px = this.sx < 0 ? this.tx - (x + dx) - 1 : this.tx + x + dx;
        this.blend(
          Math.floor(px),
          Math.floor(this.ty + y + dy),
          c,
          this.globalAlpha,
        );
      }
  }
}

class FakeCanvas {
  width = 1;
  height = 1;
  private buffer: Uint8ClampedArray | null = null;
  get data() {
    if (!this.buffer || this.buffer.length !== this.width * this.height * 4)
      this.buffer = new Uint8ClampedArray(this.width * this.height * 4);
    return this.buffer;
  }
  getContext() {
    return new FakeCtx(this);
  }
}

(globalThis as unknown as { document: unknown }).document = {
  createElement: () => new FakeCanvas(),
};

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc = (buf: Buffer) => {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type: string, data: Buffer) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const c = Buffer.alloc(4);
  c.writeUInt32BE(crc(td));
  return Buffer.concat([len, td, c]);
};
const png = (canvas: FakeCanvas, zoom: number) => {
  const w = canvas.width * zoom;
  const h = canvas.height * zoom;
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0;
    for (let x = 0; x < w; x++) {
      const i =
        (Math.floor(y / zoom) * canvas.width + Math.floor(x / zoom)) * 4;
      const o = y * (w * 4 + 1) + 1 + x * 4;
      raw[o] = canvas.data[i];
      raw[o + 1] = canvas.data[i + 1];
      raw[o + 2] = canvas.data[i + 2];
      raw[o + 3] = canvas.data[i + 3] || 255;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr.writeUInt8(8, 8);
  ihdr.writeUInt8(6, 9);
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
};

const [mode, ...args] = process.argv.slice(2);
const { STAGE } = await import("@/game/types");
const { drawAt, frameAt, size } = await import("@/pixel/sprite");

if (mode === "scene") {
  const [scene, out, flags = ""] = args;
  const { backdrops } = await import("@/pixel/scenes");
  const { scenes } = await import("@/game/content/scenes");
  const { artRenderers, player, follower, arrows } = await import(
    "@/pixel/art"
  );
  const { items } = await import("@/pixel/sprites/items");
  const { visibleHotspots } = await import("@/game/engine/reducer");
  const canvas = new FakeCanvas();
  canvas.width = STAGE.w;
  canvas.height = STAGE.h;
  const ctx = canvas.getContext() as unknown as CanvasRenderingContext2D;
  const id = scene as keyof typeof scenes;
  const progress = {
    scene: id,
    inventory: [],
    collected: [],
    flags: flags.split(",").filter(Boolean),
    visited: [],
  } as never;
  backdrops[id].paint(ctx);
  backdrops[id].ambient?.(ctx, 0.3, progress);
  const spawn = scenes[id].spawn;
  const drawables = visibleHotspots(progress)
    .filter((h) => h.art || h.item)
    .map((h) => ({
      y: h.rect.y + h.rect.h,
      draw: () => {
        if (h.art) artRenderers[h.art](ctx, h.rect, 0.3);
        if (h.item)
          drawAt(
            ctx,
            items[h.item],
            h.rect.x + h.rect.w / 2,
            h.rect.y + h.rect.h,
          );
      },
    }));
  drawables.push({
    y: spawn.y,
    draw: () => drawAt(ctx, frameAt(player.idle, 0), spawn.x, spawn.y),
  });
  drawables.push({
    y: spawn.y + 1,
    draw: () =>
      drawAt(ctx, frameAt(follower.idle, 0), spawn.x - 30, spawn.y + 1),
  });
  for (const d of drawables.sort((a, b) => a.y - b.y)) d.draw();
  for (const h of visibleHotspots(progress))
    if (h.arrow)
      drawAt(
        ctx,
        arrows[h.arrow],
        h.rect.x + h.rect.w / 2,
        h.rect.y + h.rect.h / 2 + 10,
        h.arrow === "left",
      );
  writeFileSync(out, png(canvas, 2));
} else if (mode === "sprites") {
  const [out, filter = ""] = args;
  const mods = {
    characters: await import("@/pixel/sprites/characters"),
    props: await import("@/pixel/sprites/props"),
    items: (await import("@/pixel/sprites/items")).items,
  };
  type Art = readonly string[] | { frames: readonly (readonly string[])[] };
  const list: Art[] = [];
  const walk = (v: unknown, path: string) => {
    if (Array.isArray(v) && v.every((r) => typeof r === "string")) {
      if (path.includes(filter)) list.push(v);
    } else if (v && typeof v === "object" && "frames" in v) {
      if (path.includes(filter))
        for (const f of (v as { frames: Art[] }).frames) list.push(f);
    } else if (v && typeof v === "object")
      for (const [k, c] of Object.entries(v)) walk(c, `${path}.${k}`);
  };
  walk(mods, "");
  const frames = list as (readonly string[])[];
  const W = 640;
  let x = 4;
  let y = 4;
  let rowH = 0;
  const spots: [number, number][] = [];
  for (const f of frames) {
    const s = size(f);
    if (x + s.w + 4 > W) {
      x = 4;
      y += rowH + 6;
      rowH = 0;
    }
    spots.push([x, y]);
    x += s.w + 6;
    rowH = Math.max(rowH, s.h);
  }
  const canvas = new FakeCanvas();
  canvas.width = W;
  canvas.height = y + rowH + 4;
  const ctx = canvas.getContext() as unknown as CanvasRenderingContext2D;
  ctx.fillStyle = "#3a3048";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  frames.forEach((f, i) => {
    const s = size(f);
    drawAt(ctx, f, spots[i][0] + s.w / 2, spots[i][1] + s.h);
  });
  writeFileSync(out, png(canvas, 2));
}
