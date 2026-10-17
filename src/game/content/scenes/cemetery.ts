import type { SceneDef } from "../../types";
import { arrow, decor, egg, rect, say, think, travel } from "../dsl";

export const cemetery: SceneDef = {
  title: "Pabellón San Judas Tadeo — 04:04",
  floor: rect(8, 224, 464, 40),
  spawn: { x: 40, y: 244 },
  onEnter: [
    think(
      "Nichos hasta el cielo, velas, flores de plástico. Y neblina, cómo no.",
    ),
  ],
  hotspots: [
    arrow("toGate", "Volver a la puerta", "left", rect(0, 190, 24, 74), [
      { effects: travel("cemeteryGate") },
    ]),
    decor(
      "tombDelivery",
      "Lápida",
      rect(52, 158, 40, 58),
      "tombDelivery",
      "«Aquí yace un delivery. Llegó tarde». Qué presión.",
    ),
    egg(
      "egg5",
      rect(96, 208, 8, 8),
      "¡Un caramelo de menta en una tumba! Lo dejo… no, me lo llevo. Halloween es Halloween.",
    ),
    {
      id: "huaqueroTomb",
      label: "Tumba del huaquero",
      rect: rect(132, 150, 44, 66),
      art: "tombHuaquero",
      interactions: [
        {
          effects: [
            { type: "set", flag: "nameKnown" },
            think(
              "«Aquí yace Pancracio, huaquero. Saqué un huaco moche de su huaca y nunca me perdonó».",
              "Abajo, en letra chiquita: «Perdóname, Pepe».",
              "¿Pepe? ¿Huacosaw se llama… Pepe?",
            ),
          ],
        },
      ],
    },
    {
      id: "condenado",
      label: "Condenado",
      rect: rect(204, 136, 38, 80),
      art: "condenado",
      interactions: [
        {
          effects: [
            say("condenado", "Uuuuh… estoy condenado a vagar… por deudas…"),
            {
              type: "choice",
              prompt:
                "El condenado arrastra sus cadenas y te mira con ojitos de pena.",
              options: [
                {
                  label: "Darle un abrazo",
                  effects: [{ type: "die", death: "hug" }],
                },
                {
                  label: "Preguntarle por Don Eusebio",
                  effects: [
                    say(
                      "condenado",
                      "¿El viejo Eusebio? En el mausoleo de los Quispe, el del ángel sin nariz.",
                      "Lleva veinticinco años esperando ese pollo. Ya ni nos saluda de la cólera.",
                      "El número de su puerta es el año en que se fue. Está en la placa.",
                    ),
                  ],
                },
                {
                  label: "Retroceder despacito",
                  effects: [
                    think(
                      "Lo siento, compadre. Yo también tengo deudas, pero vivas.",
                    ),
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    decor(
      "plaque",
      "Placa",
      rect(256, 168, 40, 48),
      "plaque",
      "«Eusebio Quispe, 1931–1999. Se fue esperando su pollo». Abajo alguien escribió: «y el Y2K».",
    ),
    {
      id: "mausoleum",
      label: "Mausoleo Quispe",
      rect: rect(304, 56, 136, 160),
      art: "mausoleum",
      interactions: [
        { when: { flag: "cryptOpen" }, effects: travel("crypt") },
        {
          effects: [
            think(
              "El mausoleo de los Quispe. Hay un ángel sin nariz y una puerta con teclado.",
            ),
            { type: "puzzle", puzzle: "cryptCode" },
          ],
        },
      ],
    },
  ],
};
