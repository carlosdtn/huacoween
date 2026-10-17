import type { SceneDef } from "../../types";
import { catacombs } from "./catacombs";
import { cemetery } from "./cemetery";
import { cemeteryGate } from "./cemetery-gate";
import { crypt } from "./crypt";
import { kitchen } from "./kitchen";
import { market } from "./market";
import { park } from "./park";
import { street } from "./street";

export const scenes = {
  kitchen,
  street,
  market,
  catacombs,
  park,
  cemeteryGate,
  cemetery,
  crypt,
} satisfies Record<string, SceneDef>;

export type SceneId = keyof typeof scenes;

export const START_SCENE: SceneId = "kitchen";
