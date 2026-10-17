"use client";

import { useEffect, useRef } from "react";
import type { SceneId } from "@/game/content/scenes";
import { initialProgress } from "@/game/engine/state";
import { STAGE } from "@/game/types";
import { backdrops } from "@/pixel/scenes";

/** A scene backdrop with its ambient animation, for menus. */
export function PixelBackdrop({ scene }: { scene: SceneId }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    const still = document.createElement("canvas");
    still.width = STAGE.w;
    still.height = STAGE.h;
    const stillCtx = still.getContext("2d");
    if (stillCtx) backdrops[scene].paint(stillCtx);
    const progress = initialProgress();
    let raf = 0;
    const start = performance.now();
    const frame = (now: number) => {
      ctx.drawImage(still, 0, 0);
      backdrops[scene].ambient?.(ctx, (now - start) / 1000, progress);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [scene]);

  return (
    <canvas
      ref={ref}
      width={STAGE.w}
      height={STAGE.h}
      className="absolute inset-0 h-full w-full [image-rendering:pixelated]"
    />
  );
}
