import type {
  ArrowDirection,
  Condition,
  Effect,
  Hotspot,
  Interaction,
  Rect,
} from "../types";
import type { CharacterId } from "./characters";
import type { FlagId } from "./flags";
import type { ItemId } from "./items";
import { META } from "./meta";
import type { SceneId } from "./scenes";

/** Small builders so scenes read like a script instead of JSON. */

export const say = (speaker: CharacterId, ...texts: string[]): Effect => ({
  type: "say",
  lines: texts.map((text) => ({ speaker, text })),
});

export const think = (...texts: string[]): Effect => say(META.player, ...texts);

export const rect = (x: number, y: number, w: number, h: number): Rect => ({
  x,
  y,
  w,
  h,
});

export const not = (condition: Condition): Condition => ({ not: condition });

/** Interaction that only says something. */
export const remark = (...texts: string[]): Interaction => ({
  effects: [think(...texts)],
});

export const pickup = (item: ItemId, ...texts: string[]): Interaction => ({
  effects: [
    { type: "give", item },
    { type: "sfx", sound: "pickup" },
    think(...texts),
  ],
});

export const travel = (scene: SceneId): Effect[] => [
  { type: "sfx", sound: "door" },
  { type: "goto", scene },
];

export const arrow = (
  id: string,
  label: string,
  direction: ArrowDirection,
  area: Rect,
  interactions: Interaction[],
): Hotspot => ({ id, label, rect: area, arrow: direction, interactions });

/** Decorative hotspot with a single line of flavour text. */
export const decor = (
  id: string,
  label: string,
  area: Rect,
  art: Hotspot["art"],
  ...texts: string[]
): Hotspot => ({
  id,
  label,
  rect: area,
  art,
  interactions: [remark(...texts)],
});

/** An unmarked place where an item can be left: no cursor, no label. */
export const spot = (
  id: string,
  area: Rect,
  interactions: Interaction[],
  visibleWhen?: Condition,
): Hotspot => ({
  id,
  label: "",
  rect: area,
  hidden: true,
  visibleWhen,
  interactions,
});

/** A hidden Easter egg: a tiny pickup that only leaves a joke behind. */
export const egg = (flag: FlagId, area: Rect, joke: string): Hotspot => ({
  id: flag,
  label: "¿Un caramelo?",
  rect: area,
  art: "candy",
  visibleWhen: { not: { flag } },
  interactions: [
    {
      effects: [
        { type: "set", flag },
        { type: "sfx", sound: "coin" },
        think(joke),
      ],
    },
  ],
});
