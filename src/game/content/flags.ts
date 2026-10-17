export const FLAGS = [
  "drawerOpen",
  "doorUnlocked",
  "cuyJoined",
  "luchaMet",
  "muquiFed",
  "chullaFled",
  "motoFueled",
  "gateOpen",
  "nameKnown",
  "cryptOpen",
  "huacosawCalmed",
  // hidden Easter eggs
  "egg1",
  "egg2",
  "egg3",
  "egg4",
  "egg5",
] as const;

export type FlagId = (typeof FLAGS)[number];
