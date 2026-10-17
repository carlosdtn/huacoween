import type { CharacterDef } from "../types";

export const characters = {
  tito: { name: "Tito" },
  huacosaw: { name: "Huacosaw" },
  pepe: { name: "Pepe, huaco moche" },
  chicharron: { name: "Chicharrón" },
  lucha: { name: "Hermana Lucha, curandera" },
  pocha: { name: "Doña Pocha, anticuchera" },
  tunche: { name: "¿?" },
  muqui: { name: "El Muqui" },
  chullachaqui: { name: "¿Mamá?" },
  cheche: { name: "Maestro Cheche, director de banda" },
  condenado: { name: "Un condenado" },
  eusebio: { name: "Don Eusebio" },
} as const satisfies Record<string, CharacterDef>;

export type CharacterId = keyof typeof characters;
