/** Visuals a hotspot can draw. Renderers live in src/pixel/art.ts. */
export const ART = [
  // kitchen
  "rotisserie",
  "fryer",
  "counter",
  "register",
  "ticket",
  "tv",
  "menuBoard",
  "stove",
  "apron",
  "sink",
  "cuyEyes",
  "lettuceBitten",
  "fridge",
  "kitchenDoor",
  "candy",
  // street
  "polleriaDoor",
  "pumpkins",
  "moto",
  "pocha",
  "lampVulture",
  "alley",
  // market
  "lucha",
  "cuyCages",
  "herbStall",
  "trapdoor",
  // catacombs
  "stairsUp",
  "skullPile",
  "muqui",
  "hole",
  "tunnelMouth",
  // park
  "fountain",
  "chulla",
  "mototaxi",
  "bench",
  // cemetery
  "band",
  "gate",
  "openGate",
  "nest",
  "tombDelivery",
  "tombHuaquero",
  "condenado",
  "plaque",
  "mausoleum",
  // crypt
  "candles",
  "huacosaw",
  "pepe",
  "nicho",
] as const;

export type ArtId = (typeof ART)[number];
