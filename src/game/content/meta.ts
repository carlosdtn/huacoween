import type { CharacterId } from "./characters";
import type { FlagId } from "./flags";

/** The few facts about this story that the engine and UI need to know. */
export const META = {
  title: "Huacoween",
  subtitle: "Pollo a la Brasa del Más Allá",
  /** Who the player controls; also says the fallback quips and hints. */
  player: "tito",
  /** Gets a real synthesized voice when the browser has one. */
  villain: "huacosaw",
  /** Once set, the companion trails behind the player. */
  companionFlag: "cuyJoined",
  eggs: ["egg1", "egg2", "egg3", "egg4", "egg5"],
  storageKey: "huacoween",
} as const satisfies {
  title: string;
  subtitle: string;
  player: CharacterId;
  villain: CharacterId;
  companionFlag: FlagId;
  eggs: readonly FlagId[];
  storageKey: string;
};
