import type { ArtId } from "./content/art";
import type { CharacterId } from "./content/characters";
import type { DeathId, VillainId } from "./content/deaths";
import type { EndingId } from "./content/endings";
import type { FlagId } from "./content/flags";
import type { ItemId } from "./content/items";
import type { PuzzleId } from "./content/puzzles";
import type { SceneId } from "./content/scenes";
import type { SoundId } from "./content/sounds";

export type Condition =
  | { flag: FlagId }
  | { has: ItemId }
  /** The item was ever picked up, even if already used. */
  | { collected: ItemId }
  | { visited: SceneId }
  | { not: Condition }
  | { all: Condition[] }
  | { any: Condition[] };

export type DialogLine = { speaker: CharacterId; text: string };

export type ChoiceOption = { label: string; effects: Effect[] };

export type Effect =
  | { type: "say"; lines: DialogLine[] }
  | { type: "give"; item: ItemId }
  | { type: "take"; item: ItemId }
  | { type: "set"; flag: FlagId }
  | { type: "goto"; scene: SceneId }
  | { type: "sfx"; sound: SoundId }
  | { type: "puzzle"; puzzle: PuzzleId }
  | { type: "choice"; prompt: string; options: ChoiceOption[] }
  | { type: "die"; death: DeathId }
  | { type: "end"; ending: EndingId }
  | { type: "branch"; when: Condition; ifTrue: Effect[]; ifFalse?: Effect[] };

/** First interaction whose `with`/`when` match wins. */
export type Interaction = {
  with?: ItemId;
  when?: Condition;
  effects: Effect[];
};

/** Native pixel resolution of the stage; everything scales up from here. */
export const STAGE = { w: 480, h: 270 } as const;

/** Stage pixels, from the top-left corner. */
export type Rect = { x: number; y: number; w: number; h: number };

export type Point = { x: number; y: number };

export type ArrowDirection = "left" | "right" | "up" | "down";

export type Hotspot = {
  id: string;
  label: string;
  rect: Rect;
  visibleWhen?: Condition;
  /** Draws an item lying in the scene; hidden once collected. */
  item?: ItemId;
  art?: ArtId;
  /** Renders the hotspot as a navigation arrow. */
  arrow?: ArrowDirection;
  /** Where the player walks before interacting; defaults to the floor below the hotspot. */
  stand?: Point;
  /**
   * A spot with no cursor or label that only reacts when an item is used on it,
   * like a bare patch of floor where something can be placed.
   */
  hidden?: boolean;
  interactions: Interaction[];
};

export type SceneDef = {
  title: string;
  /** The area the player can walk on. */
  floor: Rect;
  /** Where the player appears when no exit leads back to the previous scene. */
  spawn: Point;
  hotspots: Hotspot[];
  /** Runs once, the first time the player enters. */
  onEnter?: Effect[];
};

export type ItemDef = { name: string; description: string };

export type CharacterDef = { name: string };

export type DeathDef = {
  title: string;
  text: string;
  /** Who did it; drawn laughing next to the knocked-out player. */
  villain: VillainId;
  /** A nudge in the right direction that never spells out the answer. */
  tip: string;
};

export type EndingDef = {
  title: string;
  text: string;
  rank: "good" | "meh";
  /** Who takes a bow on the ending screen. */
  cast: CharacterId[];
};

export type PuzzleDef = {
  /** `code` is a keypad; `rhythm` is a row of pads whose answer is pad indices. */
  kind: "code" | "rhythm";
  prompt: string;
  answer: string;
  onSolve: Effect[];
};

/** Two items, in any order, become one new item. */
export type RecipeDef = {
  inputs: [ItemId, ItemId];
  output: ItemId;
  lines: DialogLine[];
};

/** The first hint whose condition holds is the one shown. */
export type HintDef = { when: Condition; text: string };
