"use client";

import { useEffect, useRef } from "react";
import type { VillainId } from "@/game/content/deaths";
import { knockedOut, villains } from "@/pixel/art";
import { drawText } from "@/pixel/font";
import { dither, fill } from "@/pixel/paint";
import { PALETTE } from "@/pixel/palette";
import { type Anim, bake, type Frame, frameAt, size } from "@/pixel/sprite";

const W = 300;
const H = 126;
const FLOOR = 112;

const animOf = (art: Frame | Anim): Anim =>
  "frames" in art ? art : { frames: [art], fps: 1 };

/** The player flat on the floor while the villain who got them laughs. */
export function DeathScene({ villain }: { villain: VillainId }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    const anim = animOf(villains[villain]);
    let raf = 0;
    const start = performance.now();
    const draw = (now: number) => {
      const time = Math.max(0, now - start) / 1000;
      fill(ctx, 0, 0, W, H, "k");
      dither(ctx, 0, 0, W, H, "R", 0.25);
      fill(ctx, 0, FLOOR, W, H - FLOOR, "K");
      fill(ctx, 0, FLOOR, W, 1, "R");
      // the player, flat out
      const ko = size(knockedOut);
      ctx.drawImage(bake(knockedOut), 30, FLOOR - ko.h + 2, ko.w, ko.h);
      // a spotlight so even black hats and capes read against the dark
      for (let y = 4; y < FLOOR; y++) {
        const half = Math.sqrt(Math.max(0, 1 - ((y - 60) / 56) ** 2)) * 46;
        dither(ctx, 220 - half, y, half * 2, 1, "P", 0.35);
      }
      // the villain, bouncing with laughter; small ones are doubled
      const frame = frameAt(anim, time);
      const { w, h } = size(frame);
      const zoom = h <= 56 ? 2 : 1;
      const bounce = Math.abs(Math.sin(time * 6)) * 4;
      ctx.drawImage(
        bake(frame),
        Math.round(220 - (w * zoom) / 2),
        Math.round(FLOOR - h * zoom - bounce),
        w * zoom,
        h * zoom,
      );
      if (Math.floor(time * 3) % 2 === 0)
        drawText(ctx, "JA JA", 236, 6, PALETTE.y, 2);
      else drawText(ctx, "JA JA JA", 214, 14, PALETTE.o, 2);
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [villain]);

  return (
    <canvas
      ref={ref}
      width={W}
      height={H}
      className="w-[40cqw] rounded-lg border-4 border-outline [image-rendering:pixelated]"
    />
  );
}
