export const SOUNDS = [
  "click",
  "pickup",
  "unlock",
  "error",
  "door",
  "death",
  "success",
  "hiss",
  "tv",
  "coin",
  "squeak",
  "whistle",
  "engine",
  "sizzle",
  "bonk",
] as const;

export type SoundId = (typeof SOUNDS)[number];
