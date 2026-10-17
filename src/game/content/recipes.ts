import type { RecipeDef } from "../types";

export const recipes: RecipeDef[] = [
  {
    inputs: ["chicken", "fries"],
    output: "order",
    lines: [
      {
        speaker: "tito",
        text: "Pollo y papas en la bolsa. Pedido armado. Sin probar nada, Tito.",
      },
    ],
  },
  {
    inputs: ["hose", "emptyBottle"],
    output: "siphon",
    lines: [
      {
        speaker: "tito",
        text: "Manguera en la botella: kit profesional para robar gasolina. Perdón, «tomarla prestada».",
      },
    ],
  },
];
