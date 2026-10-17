import type { SceneId } from "../content/scenes";
import { scenes } from "../content/scenes";
import type { Effect, Hotspot, Point, Rect } from "../types";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const clampToFloor = ({ x, y }: Point, floor: Rect): Point => ({
  x: clamp(x, floor.x, floor.x + floor.w),
  y: clamp(y, floor.y, floor.y + floor.h),
});

/** The spot in front of a hotspot where the player stops to use it. */
export const standPoint = (hotspot: Hotspot, floor: Rect): Point =>
  hotspot.stand ??
  clampToFloor(
    {
      x: hotspot.rect.x + hotspot.rect.w / 2,
      // Stand in the front half of the floor so furniture never hides the player.
      y: Math.max(hotspot.rect.y + hotspot.rect.h + 3, floor.y + floor.h / 2),
    },
    floor,
  );

const leadsTo = (effects: Effect[], scene: SceneId): boolean =>
  effects.some((e) => e.type === "goto" && e.scene === scene);

/** Players enter through the exit that leads back where they came from. */
export const spawnPoint = (scene: SceneId, from: SceneId | null): Point => {
  const def = scenes[scene];
  const exit = from
    ? def.hotspots.find((h) =>
        h.interactions.some((i) => leadsTo(i.effects, from)),
      )
    : undefined;
  return exit ? standPoint(exit, def.floor) : def.spawn;
};

/** Moves toward the target at `speed` pixels per second. */
export const step = (
  from: Point,
  to: Point,
  seconds: number,
  speed: number,
): { at: Point; arrived: boolean } => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.hypot(dx, dy);
  const reach = speed * seconds;
  if (distance <= reach) return { at: to, arrived: true };
  return {
    at: {
      x: from.x + (dx / distance) * reach,
      y: from.y + (dy / distance) * reach,
    },
    arrived: false,
  };
};
