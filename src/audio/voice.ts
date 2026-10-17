import type { CharacterId } from "@/game/content/characters";
import { isMuted, tone } from "./synth";

/** Each speaker "talks" in short blips at their own pitch, Animal Crossing style. */
const pitch: Record<CharacterId, number> = {
  tito: 220,
  huacosaw: 90,
  pepe: 160,
  chicharron: 1100,
  lucha: 380,
  pocha: 440,
  tunche: 1400,
  muqui: 620,
  chullachaqui: 520,
  cheche: 160,
  condenado: 120,
  eusebio: 200,
};

export const blip = (speaker: CharacterId): void =>
  tone({
    freq: pitch[speaker] * (0.9 + Math.random() * 0.2),
    type: "triangle",
    duration: 0.05,
    volume: 0.05,
  });

/** The villain also gets a real, very low synthesized voice when the browser has one. */
export const speak = (text: string): void => {
  if (isMuted() || typeof speechSynthesis === "undefined") return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-ES";
  utterance.pitch = 0.1;
  utterance.rate = 0.85;
  speechSynthesis.speak(utterance);
};

export const hush = (): void => {
  if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
};
