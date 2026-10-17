import type { SceneId } from "@/game/content/scenes";
import { catacombs } from "./catacombs";
import { cemetery } from "./cemetery";
import { cemeteryGate } from "./cemetery-gate";
import { crypt } from "./crypt";
import { kitchen } from "./kitchen";
import { market } from "./market";
import { park } from "./park";
import { street } from "./street";
import type { Backdrop } from "./types";

export const backdrops: Record<SceneId, Backdrop> = {
  kitchen,
  street,
  market,
  catacombs,
  park,
  cemeteryGate,
  cemetery,
  crypt,
};
