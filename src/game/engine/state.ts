import type { DeathId } from "../content/deaths";
import type { EndingId } from "../content/endings";
import type { FlagId } from "../content/flags";
import type { ItemId } from "../content/items";
import type { PuzzleId } from "../content/puzzles";
import { type SceneId, START_SCENE } from "../content/scenes";
import type { SoundId } from "../content/sounds";
import type { ChoiceOption, DialogLine, Effect } from "../types";

export type Overlay =
  | { kind: "dialog"; lines: DialogLine[]; index: number }
  | { kind: "choice"; prompt: string; options: ChoiceOption[] }
  | { kind: "puzzle"; puzzle: PuzzleId; failed: boolean };

export type Status =
  | { kind: "title" }
  | { kind: "playing" }
  | { kind: "dead"; death: DeathId }
  | { kind: "ended"; ending: EndingId };

/** The part of the state worth saving and restoring after a death. */
export type Progress = {
  scene: SceneId;
  inventory: ItemId[];
  collected: ItemId[];
  flags: FlagId[];
  visited: SceneId[];
};

export type GameState = Progress & {
  status: Status;
  selectedItem: ItemId | null;
  overlay: Overlay | null;
  /** Effects waiting for the current overlay to close. */
  queue: Effect[];
  /** Restored when the player retries after dying. */
  checkpoint: Progress;
  /** Feedback produced by the last action; `turn` lets the UI notice repeats. */
  sounds: SoundId[];
  gained: ItemId[];
  deaths: number;
  turn: number;
};

export const initialProgress = (): Progress => ({
  scene: START_SCENE,
  inventory: [],
  collected: [],
  flags: [],
  visited: [],
});

export const initialState = (): GameState => ({
  ...initialProgress(),
  status: { kind: "title" },
  selectedItem: null,
  overlay: null,
  queue: [],
  checkpoint: initialProgress(),
  sounds: [],
  gained: [],
  deaths: 0,
  turn: 0,
});

export const progressOf = ({
  scene,
  inventory,
  collected,
  flags,
  visited,
}: Progress): Progress => ({ scene, inventory, collected, flags, visited });
