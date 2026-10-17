import type { SceneDef } from "../../types";
import {
  arrow,
  decor,
  not,
  pickup,
  rect,
  remark,
  say,
  think,
  travel,
} from "../dsl";

export const park: SceneDef = {
  title: "Parque de los Lamentos — 02:22",
  floor: rect(8, 224, 464, 40),
  spawn: { x: 440, y: 244 },
  onEnter: [think("El parque. Los árboles se mueven aunque no hay viento.")],
  hotspots: [
    decor(
      "fountain",
      "Pileta",
      rect(18, 136, 86, 80),
      "fountain",
      "Una pileta seca. Alguien tiró caramelos en vez de monedas. Deseos de Halloween.",
    ),
    {
      id: "chulla",
      label: "¿Mamá?",
      rect: rect(132, 146, 32, 70),
      art: "chulla",
      visibleWhen: not({ flag: "chullaFled" }),
      interactions: [
        {
          effects: [
            say(
              "chullachaqui",
              "Tito, hijito. ¿Qué haces a esta hora? Ven, que la sopa se enfría.",
              "Sígueme, por aquí, entre los árboles. Es un atajo.",
            ),
            {
              type: "choice",
              prompt: "Es igualita a tu mamá. Bueno… casi.",
              options: [
                {
                  label: "Seguirla",
                  effects: [{ type: "die", death: "lost" }],
                },
                {
                  label: "Mirarle los pies",
                  effects: [
                    {
                      type: "branch",
                      when: { has: "lighter" },
                      ifTrue: [
                        think(
                          "Prendo el encendedor y le alumbro los pies…",
                          "¡Uno es chiquito y el otro es un palo!",
                        ),
                        say(
                          "chullachaqui",
                          "¡Nooo! ¡Mis pies no, que me da vergüenza!",
                        ),
                        { type: "set", flag: "chullaFled" },
                        { type: "sfx", sound: "hiss" },
                        think(
                          "El Chullachaqui sale corriendo cojito entre los árboles. Dejó caer algo.",
                        ),
                      ],
                      ifFalse: [
                        think(
                          "Está muy oscuro. No le veo ni los pies ni la cara. Necesito luz.",
                        ),
                      ],
                    },
                  ],
                },
                {
                  label: "Decirle que ya comí",
                  effects: [
                    say(
                      "chullachaqui",
                      "Ay, este chico. Aquí te espero, hijito. Siempre te espero.",
                    ),
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "hose",
      label: "Manguera",
      rect: rect(132, 206, 24, 10),
      item: "hose",
      visibleWhen: { flag: "chullaFled" },
      interactions: [
        pickup(
          "hose",
          "Una manguera de jardín. «Mamá» regaba las plantas para disimular.",
        ),
      ],
    },
    {
      id: "mototaxi",
      label: "Mototaxi abandonada",
      rect: rect(250, 136, 104, 80),
      art: "mototaxi",
      interactions: [
        {
          with: "siphon",
          when: not({ collected: "gasoline" }),
          effects: [
            { type: "take", item: "siphon" },
            { type: "give", item: "gasoline" },
            { type: "sfx", sound: "pickup" },
            think(
              "Chupo la manguera… ¡puaj! Pero la botella se llena. Gasolina de mototaxi, la más resistente del mundo.",
            ),
          ],
        },
        {
          with: "hose",
          ...remark("Tengo cómo sacarla, pero no dónde echarla."),
        },
        {
          with: "emptyBottle",
          ...remark("Tengo dónde echarla, pero no cómo sacarla."),
        },
        {
          when: { collected: "gasoline" },
          ...remark("Ya le saqué la gasolina. Perdón, mototaxi. Te debo una."),
        },
        remark(
          "Una mototaxi abandonada. Dice «Dios es mi copiloto». El tanque todavía tiene gasolina.",
        ),
      ],
    },
    decor(
      "bench",
      "Banca",
      rect(378, 176, 64, 40),
      "bench",
      "En la banca alguien grabó «Tito + Chabelita». No fui yo. Creo.",
    ),
    arrow("back", "Volver a la calle", "right", rect(456, 190, 24, 74), [
      { effects: travel("street") },
    ]),
  ],
};
