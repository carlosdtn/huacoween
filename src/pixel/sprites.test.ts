import { describe, expect, test } from "bun:test";
import { PALETTE, TRANSPARENT } from "./palette";
import type { Frame } from "./sprite";
import * as characters from "./sprites/characters";
import * as icons from "./sprites/icons";
import * as items from "./sprites/items";
import * as props from "./sprites/props";

/** Collects every frame exported by a sprite module, however it is nested. */
const framesOf = (value: unknown, path: string): [string, Frame][] => {
  if (Array.isArray(value) && value.every((row) => typeof row === "string")) {
    return [[path, value as Frame]];
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) =>
      framesOf(child, `${path}.${key}`),
    );
  }
  return [];
};

export const allFrames = (modules: Record<string, unknown>) =>
  Object.entries(modules).flatMap(([name, mod]) => framesOf(mod, name));

describe("sprites", () => {
  const frames = allFrames({ characters, icons, items, props });

  test("there is art to check", () => {
    expect(frames.length).toBeGreaterThan(10);
  });

  test.each(frames)("%s has rows of equal width", (_, frame) => {
    const widths = new Set(frame.map((row) => row.length));
    expect([...widths]).toHaveLength(1);
  });

  test.each(frames)("%s only uses palette colours", (_, frame) => {
    const keys = new Set(frame.join(""));
    keys.delete(TRANSPARENT);
    for (const key of keys) expect(Object.keys(PALETTE)).toContain(key);
  });
});

describe("animation", () => {
  test("frameAt wraps negative times", async () => {
    const { frameAt } = await import("./sprite");
    const anim = { frames: [["a"], ["b"]], fps: 2 };
    expect(frameAt(anim, -0.1)).toEqual(["b"]);
    expect(frameAt(anim, 0.6)).toEqual(["b"]);
  });
});
