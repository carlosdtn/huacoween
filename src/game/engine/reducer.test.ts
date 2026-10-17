import { describe, expect, test } from "bun:test";
import type { ItemId } from "../content/items";
import { scenes } from "../content/scenes";
import { STAGE } from "../types";
import { type Action, gameReducer, visibleHotspots } from "./reducer";
import { type GameState, initialState } from "./state";

const skipDialogs = (state: GameState): GameState => {
  let next = state;
  while (next.overlay?.kind === "dialog")
    next = gameReducer(next, { type: "advanceDialog" });
  return next;
};

const dispatch = (state: GameState, action: Action): GameState =>
  skipDialogs(gameReducer(state, action));

type Step = (s: GameState) => GameState;

const click =
  (id: string): Step =>
  (s) =>
    dispatch(s, { type: "clickHotspot", id });
const use =
  (item: ItemId, id: string): Step =>
  (s) =>
    click(id)(dispatch(s, { type: "selectItem", item }));
const combine =
  (a: ItemId, b: ItemId): Step =>
  (s) =>
    dispatch(s, { type: "combine", a, b });
const code =
  (value: string): Step =>
  (s) =>
    dispatch(s, { type: "submitCode", code: value });
const choose =
  (index: number): Step =>
  (s) =>
    dispatch(s, { type: "choose", index });

const play = (state: GameState, steps: Step[]) =>
  steps.reduce((s, step) => step(s), state);

const newGame = () => dispatch(initialState(), { type: "newGame" });

const placeLettuce = use("lettuce", "floorSpot");
const takeCremas = click("cremas");
const grabLighter = click("lighter");
const readTomb = click("huaqueroTomb");
const feedMuqui = use("anticucho", "muqui");
const enterCrypt = click("mausoleum");
const openTrapdoor = click("trapdoor");
const toPark = click("toPark");
const leaveKitchen = click("door");

const toNicho: Step[] = [
  // kitchen
  click("apron"),
  use("smallKey", "drawer"),
  use("tongs", "rotisserie"),
  click("fryer"),
  choose(1),
  combine("chicken", "fries"),
  takeCremas,
  click("register"),
  grabLighter,
  click("fridge"),
  click("fridge"),
  placeLettuce,
  click("door"),
  code("1990"),
  leaveKitchen,
  // street
  use("coin", "pocha"),
  click("alley"),
  choose(1),
  click("toMarket"),
  // market and catacombs
  click("lucha"),
  use("huevo", "lucha"),
  openTrapdoor,
  feedMuqui,
  click("hole"),
  click("up"),
  click("back"),
  // park
  toPark,
  click("chulla"),
  choose(1),
  click("hose"),
  combine("hose", "emptyBottle"),
  use("siphon", "mototaxi"),
  click("back"),
  // off to the cemetery
  use("gasoline", "moto"),
  click("moto"),
  use("mallet", "band"),
  code("0102133"),
  click("gateOpen"),
  readTomb,
  click("mausoleum"),
  code("1999"),
  enterCrypt,
  // the boss
  use("aguaFlorida", "huacosawBoss"),
  choose(2),
  use("order", "nicho"),
];

const without = (...skip: Step[]) => toNicho.filter((s) => !skip.includes(s));
const upTo = (step: Step, steps = toNicho) =>
  steps.slice(0, steps.indexOf(step) + 1);

describe("walkthrough", () => {
  test("plays the intro and starts in the kitchen", () => {
    const state = gameReducer(initialState(), { type: "newGame" });
    expect(state.scene).toBe("kitchen");
    expect(state.overlay?.kind).toBe("dialog");
  });

  test("reaches five stars with the cremas", () => {
    const state = play(newGame(), [...toNicho, choose(2)]);
    expect(state.status).toEqual({ kind: "ended", ending: "fiveStars" });
  });

  test("reaches three stars without the cremas", () => {
    const state = play(newGame(), [...without(takeCremas), choose(2)]);
    expect(state.status).toEqual({ kind: "ended", ending: "threeStars" });
  });

  test("reaches one star by leaving the bag on the floor", () => {
    const state = play(newGame(), [...toNicho, choose(0)]);
    expect(state.status).toEqual({ kind: "ended", ending: "oneStar" });
  });

  test("one last fry is still fatal", () => {
    const state = play(newGame(), [...toNicho, choose(1)]);
    expect(state.status).toEqual({ kind: "dead", death: "lastFry" });
  });
});

describe("puzzles", () => {
  test("eating a fry from the order kills you", () => {
    const state = play(newGame(), [click("fryer"), choose(0)]);
    expect(state.status).toEqual({ kind: "dead", death: "papita" });
  });

  test("the cuy ignores lettuce shoved in its face", () => {
    const state = play(newGame(), [click("fridge"), use("lettuce", "cuy")]);
    expect(state.inventory).toContain("lettuce");
    expect(state.flags).not.toContain("cuyJoined");
  });

  test("the trapdoor stays shut without light", () => {
    const state = play(newGame(), upTo(openTrapdoor, without(grabLighter)));
    expect(state.scene).toBe("market");
  });

  test("without Chicharrón the hole keeps the mallet", () => {
    const state = play(newGame(), upTo(feedMuqui, without(placeLettuce)));
    const after = click("hole")(state);
    expect(after.scene).toBe("catacombs");
    expect(after.inventory).not.toContain("mallet");
  });

  test("the Chullachaqui keeps its secret in the dark", () => {
    const state = play(newGame(), [
      ...upTo(leaveKitchen, without(grabLighter)),
      toPark,
      click("chulla"),
      choose(1),
    ]);
    expect(state.scene).toBe("park");
    expect(state.flags).not.toContain("chullaFled");
  });

  test("Huacosaw keeps the nicho until you know his name", () => {
    const state = play(newGame(), [
      ...upTo(enterCrypt, without(readTomb)),
      use("aguaFlorida", "huacosawBoss"),
    ]);
    expect(state.scene).toBe("crypt");
    expect(state.flags).not.toContain("huacosawCalmed");
    expect(state.inventory).toContain("aguaFlorida");
  });

  test("calling him Huacosaw is fatal", () => {
    const atBoss = upTo(enterCrypt);
    const state = play(newGame(), [
      ...atBoss,
      use("aguaFlorida", "huacosawBoss"),
      choose(0),
    ]);
    expect(state.status).toEqual({ kind: "dead", death: "wrongName" });
  });

  test("items can be combined and used by drag and drop", () => {
    const state = play(newGame(), [click("apron")]);
    const used = dispatch(state, {
      type: "useItem",
      item: "smallKey",
      id: "drawer",
    });
    expect(used.inventory).toContain("tongs");
    const mixed = dispatch(used, { type: "combine", a: "tongs", b: "tongs" });
    expect(mixed.inventory).toContain("tongs");
  });
});

describe("rules", () => {
  test("wrong code keeps the puzzle open", () => {
    const state = play(newGame(), [click("door"), code("0000")]);
    expect(state.overlay).toEqual({
      kind: "puzzle",
      puzzle: "doorCode",
      failed: true,
    });
  });

  test("dying and retrying restores the scene checkpoint", () => {
    const dead = play(newGame(), [click("register"), click("rotisserie")]);
    expect(dead.status).toEqual({ kind: "dead", death: "spit" });
    const retried = dispatch(dead, { type: "retry" });
    expect(retried.status.kind).toBe("playing");
    expect(retried.inventory).toEqual([]);
    expect(retried.overlay).toBeNull();
  });

  test("using an item on the wrong target keeps it", () => {
    const state = play(newGame(), [click("register"), use("coin", "tv")]);
    expect(state.inventory).toContain("coin");
  });

  test("collected items disappear from the scene", () => {
    const state = play(newGame(), [takeCremas]);
    expect(visibleHotspots(state).some((h) => h.id === "cremas")).toBe(false);
  });

  test("hotspots are blocked while a dialog is open", () => {
    const state = gameReducer(initialState(), { type: "newGame" });
    expect(
      gameReducer(state, { type: "clickHotspot", id: "rotisserie" }).status
        .kind,
    ).toBe("playing");
  });
});

describe("feedback", () => {
  const hintText = (state: GameState) => {
    const next = gameReducer(state, { type: "hint" });
    return next.overlay?.kind === "dialog" ? next.overlay.lines[0].text : null;
  };

  test("hints follow story progress", () => {
    const start = newGame();
    expect(hintText(start)).toContain("mandil");
    expect(hintText(play(start, [click("apron")]))).toContain("llavecita");
  });

  test("every step of the walkthrough has a hint", () => {
    let state = newGame();
    for (const step of toNicho) {
      if (!state.overlay) expect(hintText(state)).not.toBeNull();
      state = step(state);
    }
  });

  test("new items are reported once", () => {
    const state = gameReducer(newGame(), {
      type: "clickHotspot",
      id: "register",
    });
    expect(state.gained).toEqual(["coin"]);
    expect(gameReducer(state, { type: "advanceDialog" }).gained).toEqual([]);
  });

  test("deaths are counted across retries", () => {
    const twice = play(newGame(), [
      click("rotisserie"),
      (s) => dispatch(s, { type: "retry" }),
      click("rotisserie"),
    ]);
    expect(twice.deaths).toBe(2);
  });
});

describe("inventory", () => {
  test("never holds more items than the ten inventory slots", () => {
    let state = newGame();
    let most = 0;
    for (const step of toNicho) {
      state = step(state);
      most = Math.max(most, state.inventory.length);
    }
    expect(most).toBeLessThanOrEqual(10);
  });

  test("picking another item switches the selection instead of combining", () => {
    const state = play(newGame(), [click("apron"), click("register")]);
    const first = dispatch(state, { type: "selectItem", item: "smallKey" });
    const second = dispatch(first, { type: "selectItem", item: "coin" });
    expect(second.selectedItem).toBe("coin");
    expect(second.inventory).toContain("smallKey");
  });
});

describe("content", () => {
  test("hotspot ids are unique per scene", () => {
    for (const scene of Object.values(scenes)) {
      const ids = scene.hotspots.map((h) => h.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  test("hotspots stay inside the stage", () => {
    for (const scene of Object.values(scenes)) {
      for (const { rect } of scene.hotspots) {
        expect(rect.x + rect.w).toBeLessThanOrEqual(STAGE.w);
        expect(rect.y + rect.h).toBeLessThanOrEqual(STAGE.h);
      }
    }
  });
});
