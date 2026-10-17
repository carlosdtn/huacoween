import type { SceneDef } from "../../types";
import { decor, egg, not, rect, remark, say, think, travel } from "../dsl";

export const catacombs: SceneDef = {
  title: "Catacumbas — 01:48",
  floor: rect(8, 224, 464, 40),
  spawn: { x: 60, y: 244 },
  onEnter: [
    think(
      "Catacumbas debajo del mercado. Huesos acomodados en círculos, como si alguien tuviera mucho tiempo libre.",
    ),
  ],
  hotspots: [
    {
      id: "up",
      label: "Subir al mercado",
      rect: rect(20, 92, 56, 124),
      art: "stairsUp",
      arrow: "up",
      interactions: [{ effects: travel("market") }],
    },
    decor(
      "boneCircles",
      "Círculos de huesos",
      rect(100, 60, 110, 96),
      undefined,
      "Fémures en círculo y calaveras en el centro. Decoración minimalista colonial.",
    ),
    decor(
      "skullPile",
      "Montón de calaveras",
      rect(176, 192, 40, 24),
      "skullPile",
      "Una calavera tiene frenos. Alguien se fue con la ortodoncia a medio pagar.",
    ),
    egg(
      "egg4",
      rect(166, 208, 8, 8),
      "¡Un caramelo entre las calaveras! Una tiene un post-it: «no es mío».",
    ),
    {
      id: "muqui",
      label: "El Muqui",
      rect: rect(244, 164, 34, 52),
      art: "muqui",
      interactions: [
        {
          with: "anticucho",
          effects: [
            { type: "take", item: "anticucho" },
            { type: "set", flag: "muquiFed" },
            { type: "sfx", sound: "sizzle" },
            say(
              "muqui",
              "¿Anticucho? ¿Para mí? Nadie me trae nada desde 1850.",
              "Ñam ñam. Ya, ya, pasa nomás. Pero no toques mi casco.",
            ),
          ],
        },
        {
          when: { flag: "muquiFed" },
          effects: [say("muqui", "Ñam. Déjame comer tranquilo, pe.")],
        },
        {
          effects: [
            say(
              "muqui",
              "¿Quién anda ahí? Este es mi hueco. Aquí guardo lo que se me cae a los mineros.",
            ),
            {
              type: "choice",
              prompt: "El Muqui cuida su hueco con cara de pocos amigos.",
              options: [
                {
                  label: "Quitarle el casco para que no vea",
                  effects: [{ type: "die", death: "muquiHat" }],
                },
                {
                  label: "Saludarlo con respeto",
                  effects: [
                    say(
                      "muqui",
                      "Buenas, buenas. Al menos tienes modales.",
                      "Llevo siglos comiendo puro mineral. Por algo rico capaz te dejo pasar.",
                    ),
                  ],
                },
                {
                  label: "Dejarlo tranquilo",
                  effects: [think("Mejor no molestar a un duende minero.")],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "hole",
      label: "Hueco en la pared",
      rect: rect(296, 140, 30, 24),
      art: "hole",
      stand: { x: 312, y: 236 },
      interactions: [
        {
          when: { collected: "mallet" },
          ...remark("Ya no queda nada adentro. Solo un olor a cuy contento."),
        },
        {
          when: { all: [{ flag: "muquiFed" }, { flag: "cuyJoined" }] },
          effects: [
            { type: "sfx", sound: "squeak" },
            think("Chicharrón se mete al hueco sin que le diga nada…"),
            say(
              "chicharron",
              "¡Cui! (Sale arrastrando algo más grande que él.)",
            ),
            { type: "give", item: "mallet" },
            { type: "sfx", sound: "pickup" },
            think(
              "¡Una maza de bombo! Tiene grabado «Banda Los Difuntos». Buen cuy.",
            ),
          ],
        },
        {
          when: { flag: "muquiFed" },
          ...remark(
            "Hay algo adentro, pero mi mano no entra. Necesito a alguien chiquito y peludo.",
          ),
        },
        {
          when: not({ flag: "muquiFed" }),
          effects: [say("muqui", "¡Ey! ¡Las manos lejos de mi hueco!")],
        },
      ],
    },
    {
      id: "tunnel",
      label: "Túnel «al Callao»",
      rect: rect(392, 92, 76, 124),
      art: "tunnelMouth",
      interactions: [
        {
          effects: [
            {
              type: "choice",
              prompt:
                "Un cartel viejo: «Por aquí al Callao». Del fondo sale aire frío… y aleteos.",
              options: [
                {
                  label: "Entrar. Seguro es un atajo.",
                  effects: [{ type: "die", death: "callao" }],
                },
                {
                  label: "Mejor no",
                  effects: [
                    think("Si en Lima no hay atajos, menos bajo tierra."),
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
