import type { Frame } from "./sprite";

/** A tiny pixel canvas for geometric props: boxes, lines and single pixels. */
export class Grid {
  private cells: string[][];

  constructor(
    readonly w: number,
    readonly h: number,
  ) {
    this.cells = Array.from({ length: h }, () => Array(w).fill("."));
  }

  px(x: number, y: number, key: string): this {
    if (x >= 0 && y >= 0 && x < this.w && y < this.h) this.cells[y][x] = key;
    return this;
  }

  fill(x: number, y: number, w: number, h: number, key: string): this {
    for (let dy = 0; dy < h; dy++)
      for (let dx = 0; dx < w; dx++) this.px(x + dx, y + dy, key);
    return this;
  }

  /** Filled rectangle with a one-pixel outline. */
  box(
    x: number,
    y: number,
    w: number,
    h: number,
    key: string,
    outline = "k",
  ): this {
    this.fill(x, y, w, h, outline);
    return this.fill(x + 1, y + 1, w - 2, h - 2, key);
  }

  hline(x: number, y: number, w: number, key: string): this {
    return this.fill(x, y, w, 1, key);
  }

  vline(x: number, y: number, h: number, key: string): this {
    return this.fill(x, y, 1, h, key);
  }

  /** Filled circle (or ellipse) with an optional outline. */
  circle(
    cx: number,
    cy: number,
    rx: number,
    key: string,
    outline?: string,
    ry = rx,
  ): this {
    for (let y = -ry - 1; y <= ry + 1; y++) {
      for (let x = -rx - 1; x <= rx + 1; x++) {
        const d = (x / (rx + 0.5)) ** 2 + (y / (ry + 0.5)) ** 2;
        if (d <= 1) this.px(cx + x, cy + y, key);
        else if (
          outline &&
          (x / (rx + 1.5)) ** 2 + (y / (ry + 1.5)) ** 2 <= 1
        ) {
          this.px(cx + x, cy + y, outline);
        }
      }
    }
    return this;
  }

  /** Straight line between two points. */
  line(x0: number, y0: number, x1: number, y1: number, key: string): this {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
    for (let i = 0; i <= steps; i++) {
      const t = steps === 0 ? 0 : i / steps;
      this.px(
        Math.round(x0 + (x1 - x0) * t),
        Math.round(y0 + (y1 - y0) * t),
        key,
      );
    }
    return this;
  }

  /** Stamps a hand-drawn frame on top; transparent pixels are skipped. */
  stamp(frame: Frame, x: number, y: number): this {
    frame.forEach((row, dy) => {
      [...row].forEach((key, dx) => {
        if (key !== ".") this.px(x + dx, y + dy, key);
      });
    });
    return this;
  }

  /** Filled polygon (even-odd scanline). Points are pixel corners. */
  polygon(points: [number, number][], key: string): this {
    const ys = points.map(([, y]) => y);
    for (let y = Math.floor(Math.min(...ys)); y <= Math.max(...ys); y++) {
      const cy = y + 0.5;
      const xs: number[] = [];
      points.forEach(([x0, y0], i) => {
        const [x1, y1] = points[(i + 1) % points.length];
        if (y0 <= cy !== y1 <= cy)
          xs.push(x0 + ((cy - y0) / (y1 - y0)) * (x1 - x0));
      });
      xs.sort((a, b) => a - b);
      for (let i = 0; i + 1 < xs.length; i += 2) {
        for (let x = Math.round(xs[i]); x < Math.round(xs[i + 1]); x++)
          this.px(x, y, key);
      }
    }
    return this;
  }

  /** Thick line: a run of small discs, for limbs, ropes and cables. */
  stroke(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    width: number,
    key: string,
  ): this {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    const r = (width - 1) / 2;
    for (let i = 0; i <= steps; i++) {
      const cx = x0 + ((x1 - x0) * i) / steps;
      const cy = y0 + ((y1 - y0) * i) / steps;
      for (let dy = -Math.ceil(r); dy <= Math.ceil(r); dy++)
        for (let dx = -Math.ceil(r); dx <= Math.ceil(r); dx++)
          if (dx * dx + dy * dy <= r * r + 0.5)
            this.px(Math.round(cx + dx), Math.round(cy + dy), key);
    }
    return this;
  }

  /** Repaints only pixels already drawn in `from`, inside the box: cheap shading. */
  recolor(
    x: number,
    y: number,
    w: number,
    h: number,
    from: string,
    to: string,
  ): this {
    for (let dy = 0; dy < h; dy++)
      for (let dx = 0; dx < w; dx++)
        if (this.at(x + dx, y + dy) === from) this.px(x + dx, y + dy, to);
    return this;
  }

  /** Checkerboard dither of `key` over pixels already drawn, for texture. */
  dither(x: number, y: number, w: number, h: number, key: string): this {
    for (let dy = 0; dy < h; dy++)
      for (let dx = 0; dx < w; dx++) {
        const cell = this.at(x + dx, y + dy);
        if (cell && cell !== "." && (x + dx + y + dy) % 2 === 0)
          this.px(x + dx, y + dy, key);
      }
    return this;
  }

  at(x: number, y: number): string | undefined {
    return this.cells[y]?.[x];
  }

  /** Traces a one-pixel outline around everything drawn so far. */
  outline(key = "k"): this {
    const filled = this.cells.map((row) => row.map((c) => c !== "."));
    for (let y = 0; y < this.h; y++)
      for (let x = 0; x < this.w; x++) {
        if (filled[y][x]) continue;
        const near =
          filled[y - 1]?.[x] ||
          filled[y + 1]?.[x] ||
          filled[y][x - 1] ||
          filled[y][x + 1];
        if (near) this.cells[y][x] = key;
      }
    return this;
  }

  frame(): Frame {
    return this.cells.map((row) => row.join(""));
  }
}

export const grid = (w: number, h: number) => new Grid(w, h);
