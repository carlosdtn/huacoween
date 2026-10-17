import { FLAGS } from "../content/flags";
import { items } from "../content/items";
import { META } from "../content/meta";
import { scenes } from "../content/scenes";
import type { Progress } from "./state";

const KEY = `${META.storageKey}:save:v1`;

const isProgress = (value: unknown): value is Progress => {
  if (!value || typeof value !== "object") return false;
  const p = value as Progress;
  const knownItems = (list: unknown) =>
    Array.isArray(list) &&
    list.every((i) => typeof i === "string" && i in items);
  return (
    typeof p.scene === "string" &&
    p.scene in scenes &&
    knownItems(p.inventory) &&
    knownItems(p.collected) &&
    Array.isArray(p.flags) &&
    p.flags.every((f) => (FLAGS as readonly string[]).includes(f)) &&
    Array.isArray(p.visited) &&
    p.visited.every((s) => s in scenes)
  );
};

/** Storage can throw in private windows; saving is a convenience, never fatal. */
export const saveProgress = (progress: Progress): void => {
  try {
    localStorage.setItem(KEY, JSON.stringify(progress));
  } catch {}
};

export const loadProgress = (): Progress | null => {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(KEY) ?? "null");
    return isProgress(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export const clearProgress = (): void => {
  try {
    localStorage.removeItem(KEY);
  } catch {}
};
