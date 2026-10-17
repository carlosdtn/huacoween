import { scenes } from "../content/scenes";
import type { Effect } from "../types";
import { check } from "./conditions";
import { type GameState, progressOf } from "./state";

const without = <T>(list: T[], value: T): T[] =>
  list.filter((v) => v !== value);
const withValue = <T>(list: T[], value: T): T[] =>
  list.includes(value) ? list : [...list, value];

/** Applies one effect. Effects that open an overlay pause the run. */
const apply = (state: GameState, effect: Effect): GameState => {
  switch (effect.type) {
    case "say":
      return {
        ...state,
        overlay: { kind: "dialog", lines: effect.lines, index: 0 },
      };
    case "choice":
      return {
        ...state,
        overlay: {
          kind: "choice",
          prompt: effect.prompt,
          options: effect.options,
        },
      };
    case "puzzle":
      return {
        ...state,
        overlay: { kind: "puzzle", puzzle: effect.puzzle, failed: false },
      };
    case "give":
      return {
        ...state,
        inventory: withValue(state.inventory, effect.item),
        collected: withValue(state.collected, effect.item),
        gained: state.inventory.includes(effect.item)
          ? state.gained
          : [...state.gained, effect.item],
      };
    case "take":
      return {
        ...state,
        inventory: without(state.inventory, effect.item),
        selectedItem:
          state.selectedItem === effect.item ? null : state.selectedItem,
      };
    case "set":
      return { ...state, flags: withValue(state.flags, effect.flag) };
    case "sfx":
      return { ...state, sounds: [...state.sounds, effect.sound] };
    case "goto":
      return enterScene(state, effect.scene);
    case "branch":
      return {
        ...state,
        queue: [
          ...(check(effect.when, state)
            ? effect.ifTrue
            : (effect.ifFalse ?? [])),
          ...state.queue,
        ],
      };
    case "die":
      return {
        ...state,
        status: { kind: "dead", death: effect.death },
        deaths: state.deaths + 1,
        queue: [],
        overlay: null,
      };
    case "end":
      return {
        ...state,
        status: { kind: "ended", ending: effect.ending },
        queue: [],
        overlay: null,
      };
  }
};

const enterScene = (state: GameState, scene: GameState["scene"]): GameState => {
  const firstVisit = !state.visited.includes(scene);
  const arrived: GameState = {
    ...state,
    scene,
    selectedItem: null,
    visited: withValue(state.visited, scene),
  };
  const withCheckpoint = { ...arrived, checkpoint: progressOf(arrived) };
  const intro = firstVisit ? (scenes[scene].onEnter ?? []) : [];
  return { ...withCheckpoint, queue: [...intro, ...withCheckpoint.queue] };
};

/** Runs queued effects until one opens an overlay or the game stops. */
export const run = (state: GameState, effects: Effect[]): GameState => {
  let next: GameState = { ...state, queue: [...effects, ...state.queue] };
  while (
    next.queue.length > 0 &&
    !next.overlay &&
    next.status.kind === "playing"
  ) {
    const [effect, ...rest] = next.queue;
    next = apply({ ...next, queue: rest }, effect);
  }
  return next;
};

export const startAt = (
  state: GameState,
  scene: GameState["scene"],
): GameState => run(state, [{ type: "goto", scene }]);
