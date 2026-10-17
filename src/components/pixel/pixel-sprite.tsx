"use client";

import { useEffect, useRef } from "react";
import { type Anim, bake, type Frame, frameAt, size } from "@/pixel/sprite";

type Props = {
  /** A single frame, or an animation that loops. */
  art: Frame | Anim;
  /** CSS pixels per sprite pixel. */
  scale?: number;
  /** CSS length of one sprite pixel (e.g. "0.3cqw"); keeps a cast at one shared scale. */
  unit?: string;
  className?: string;
  label?: string;
};

const isAnim = (art: Frame | Anim): art is Anim => "frames" in art;

/** Draws pixel art crisply at any scale. */
export function PixelSprite({
  art,
  scale = 4,
  unit,
  className = "",
  label,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const first = isAnim(art) ? art.frames[0] : art;
  const { w, h } = Object.values(isAnim(art) ? art.frames : [art]).reduce(
    (max, frame) => ({
      w: Math.max(max.w, size(frame).w),
      h: Math.max(max.h, size(frame).h),
    }),
    size(first),
  );

  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const start = performance.now();
    const draw = (now: number) => {
      const frame = isAnim(art) ? frameAt(art, (now - start) / 1000) : art;
      const f = size(frame);
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(bake(frame), Math.floor((w - f.w) / 2), h - f.h);
      if (isAnim(art) && art.frames.length > 1)
        raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [art, w, h]);

  return (
    <canvas
      ref={ref}
      width={w}
      height={h}
      role="img"
      aria-label={label}
      className={`[image-rendering:pixelated] ${className}`}
      style={
        unit
          ? { width: `calc(${w} * ${unit})`, height: `calc(${h} * ${unit})` }
          : scale
            ? { width: w * scale, height: h * scale }
            : undefined
      }
    />
  );
}
