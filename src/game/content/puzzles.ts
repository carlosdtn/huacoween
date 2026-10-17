import type { PuzzleDef } from "../types";

export const puzzles = {
  doorCode: {
    kind: "code",
    prompt:
      "Teclado de 4 dígitos. Alguien escribió con ají: «lo que cuesta un cuarto, sin el punto».",
    answer: "1990",
    onSolve: [
      { type: "set", flag: "doorUnlocked" },
      { type: "sfx", sound: "unlock" },
      {
        type: "say",
        lines: [
          {
            speaker: "tito",
            text: "¡Clic! Diecinueve noventa. Caro el pollo, ¿no?",
          },
        ],
      },
    ],
  },
  huayno: {
    kind: "rhythm",
    prompt:
      "El Maestro Cheche marca un huayno en el bombo. Escucha y repítelo.",
    answer: "0102133",
    onSolve: [
      { type: "set", flag: "gateOpen" },
      { type: "sfx", sound: "success" },
      {
        type: "say",
        lines: [
          {
            speaker: "cheche",
            text: "¡Eso es huayno, carajo! ¡Que pase el joven del pollo!",
          },
          {
            speaker: "cheche",
            text: "Muchachos, abran la reja. Y toquen algo alegre, que es Halloween.",
          },
        ],
      },
    ],
  },
  cryptCode: {
    kind: "code",
    prompt:
      "La puerta del mausoleo tiene un teclado oxidado: «el año en que me fui».",
    answer: "1999",
    onSolve: [
      { type: "set", flag: "cryptOpen" },
      { type: "sfx", sound: "unlock" },
      {
        type: "say",
        lines: [
          {
            speaker: "tito",
            text: "1999. Se fue esperando un pollo y el Y2K. Pobre.",
          },
        ],
      },
    ],
  },
} satisfies Record<string, PuzzleDef>;

export type PuzzleId = keyof typeof puzzles;
