import { hints } from "../content/hints";
import type { ItemId } from "../content/items";
import { META } from "../content/meta";
import { puzzles } from "../content/puzzles";
import { quips } from "../content/quips";
import { recipes } from "../content/recipes";
import { START_SCENE, scenes } from "../content/scenes";
import type { Effect, Hotspot, Interaction } from "../types";
import { check } from "./conditions";
import { run, startAt } from "./effects";
import { type GameState, initialState, type Progress } from "./state";

export type Action =
  | { type: "newGame" }
  | { type: "resume"; progress: Progress }
  | { type: "clickHotspot"; id: string }
  | { type: "selectItem"; item: ItemId }
  /** Drag and drop: one item onto another. */
  | { type: "combine"; a: ItemId; b: ItemId }
  /** Drag and drop: an item onto something in the scene. */
  | { type: "useItem"; item: ItemId; id: string }
  | { type: "advanceDialog" }
  | { type: "choose"; index: number }
  | { type: "submitCode"; code: string }
  | { type: "closePuzzle" }
  | { type: "hint" }
  | { type: "retry" }
  | { type: "toTitle" };

export const isVisible = (hotspot: Hotspot, state: Progress): boolean =>
  check(hotspot.visibleWhen, state) &&
  !(hotspot.item && state.collected.includes(hotspot.item));

export const visibleHotspots = (state: Progress): Hotspot[] =>
  scenes[state.scene].hotspots.filter((h) => isVisible(h, state));

const quip = (state: GameState): Effect => ({
  type: "say",
  lines: [{ speaker: META.player, text: quips[state.turn % quips.length] }],
});

const findInteraction = (
  hotspot: Hotspot,
  state: GameState,
): Interaction | undefined =>
  hotspot.interactions.find(
    (i) => i.with === (state.selectedItem ?? undefined) && check(i.when, state),
  );

const clickHotspot = (state: GameState, id: string): GameState => {
  const hotspot = visibleHotspots(state).find((h) => h.id === id);
  if (!hotspot) return state;
  const interaction = findInteraction(hotspot, state);
  const effects: Effect[] = interaction
    ? interaction.effects
    : [{ type: "sfx", sound: "error" }, quip(state)];
  return run({ ...state, selectedItem: null }, effects);
};

const combine = (state: GameState, a: ItemId, b: ItemId): GameState => {
  if (a === b || !state.inventory.includes(a) || !state.inventory.includes(b)) {
    return { ...state, selectedItem: null };
  }
  const recipe = recipes.find(
    (r) => r.inputs.includes(a) && r.inputs.includes(b),
  );
  const effects: Effect[] = recipe
    ? [
        { type: "take", item: a },
        { type: "take", item: b },
        { type: "give", item: recipe.output },
        { type: "sfx", sound: "success" },
        { type: "say", lines: recipe.lines },
      ]
    : [{ type: "sfx", sound: "error" }, quip(state)];
  return run({ ...state, selectedItem: null }, effects);
};

/** Selecting toggles; combining is its own action (the Combinar button or drag and drop). */
const selectItem = (state: GameState, item: ItemId): GameState =>
  state.selectedItem === item
    ? { ...state, selectedItem: null }
    : { ...state, selectedItem: item, sounds: ["click"] };

const advanceDialog = (state: GameState): GameState => {
  const overlay = state.overlay;
  if (overlay?.kind !== "dialog") return state;
  if (overlay.index < overlay.lines.length - 1) {
    return { ...state, overlay: { ...overlay, index: overlay.index + 1 } };
  }
  return run({ ...state, overlay: null }, []);
};

const choose = (state: GameState, index: number): GameState => {
  const overlay = state.overlay;
  if (overlay?.kind !== "choice") return state;
  const option = overlay.options[index];
  if (!option) return state;
  return run({ ...state, overlay: null }, option.effects);
};

const submitCode = (state: GameState, code: string): GameState => {
  const overlay = state.overlay;
  if (overlay?.kind !== "puzzle") return state;
  const puzzle = puzzles[overlay.puzzle];
  if (code !== puzzle.answer) {
    return {
      ...state,
      overlay: { ...overlay, failed: true },
      sounds: ["error"],
    };
  }
  return run({ ...state, overlay: null }, puzzle.onSolve);
};

const playing = (state: GameState): GameState => ({
  ...state,
  status: { kind: "playing" },
  overlay: null,
  queue: [],
  selectedItem: null,
});

const hint = (state: GameState): GameState => {
  const next = hints.find((h) => check(h.when, state));
  if (!next) return state;
  return run(state, [
    { type: "say", lines: [{ speaker: META.player, text: next.text }] },
  ]);
};

const reduce = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case "newGame":
      return startAt(playing(initialState()), START_SCENE);
    case "resume":
      return playing({
        ...state,
        ...action.progress,
        checkpoint: action.progress,
      });
    case "clickHotspot":
      return clickHotspot(state, action.id);
    case "selectItem":
      return selectItem(state, action.item);
    case "combine":
      return combine(state, action.a, action.b);
    case "useItem":
      return state.inventory.includes(action.item)
        ? clickHotspot({ ...state, selectedItem: action.item }, action.id)
        : state;
    case "advanceDialog":
      return advanceDialog(state);
    case "choose":
      return choose(state, action.index);
    case "submitCode":
      return submitCode(state, action.code);
    case "closePuzzle":
      return state.overlay?.kind === "puzzle"
        ? { ...state, overlay: null, queue: [] }
        : state;
    case "hint":
      return hint(state);
    case "retry":
      return playing({ ...state, ...state.checkpoint });
    case "toTitle":
      return { ...state, status: { kind: "title" }, overlay: null, queue: [] };
  }
};

/** Only actions that can happen in the current status are applied. */
const allowed: Record<GameState["status"]["kind"], Action["type"][]> = {
  title: ["newGame", "resume"],
  playing: [
    "clickHotspot",
    "selectItem",
    "combine",
    "useItem",
    "advanceDialog",
    "choose",
    "submitCode",
    "closePuzzle",
    "hint",
    "toTitle",
  ],
  dead: ["retry", "toTitle"],
  ended: ["newGame", "toTitle"],
};

export const gameReducer = (state: GameState, action: Action): GameState => {
  if (!allowed[state.status.kind].includes(action.type)) return state;
  const blocked =
    state.overlay &&
    (action.type === "clickHotspot" ||
      action.type === "selectItem" ||
      action.type === "combine" ||
      action.type === "useItem" ||
      action.type === "hint");
  if (blocked) return state;
  return reduce(
    { ...state, sounds: [], gained: [], turn: state.turn + 1 },
    action,
  );
};
