import { describe, expect, test } from "bun:test";
import { scenes } from "../content/scenes";
import { spawnPoint, standPoint, step } from "./walk";

describe("walking", () => {
  test("stand points are always on the floor", () => {
    for (const scene of Object.values(scenes)) {
      const { floor } = scene;
      for (const hotspot of scene.hotspots) {
        const { x, y } = standPoint(hotspot, floor);
        expect(x).toBeGreaterThanOrEqual(floor.x);
        expect(x).toBeLessThanOrEqual(floor.x + floor.w);
        expect(y).toBeGreaterThanOrEqual(floor.y);
        expect(y).toBeLessThanOrEqual(floor.y + floor.h);
      }
    }
  });

  test("entering from a scene spawns at the exit back to it", () => {
    const back = scenes.market.hotspots.find((h) => h.id === "back");
    if (!back) throw new Error("the market has no way back");
    expect(spawnPoint("market", "street")).toEqual(
      standPoint(back, scenes.market.floor),
    );
  });

  test("a new game uses the scene spawn", () => {
    expect(spawnPoint("kitchen", null)).toEqual(scenes.kitchen.spawn);
  });

  test("steps toward the target and stops on arrival", () => {
    const half = step({ x: 0, y: 0 }, { x: 10, y: 0 }, 0.1, 50);
    expect(half).toEqual({ at: { x: 5, y: 0 }, arrived: false });
    expect(step(half.at, { x: 10, y: 0 }, 1, 50).arrived).toBe(true);
  });
});
