import type { Progress } from "@/game/engine/state";
import type { Ctx } from "../paint";

export type Backdrop = {
  /** Static layer, painted once per scene and cached. */
  paint: (ctx: Ctx) => void;
  /** Animated layer drawn every frame, under characters and props. */
  ambient?: (ctx: Ctx, time: number, progress: Progress) => void;
};
