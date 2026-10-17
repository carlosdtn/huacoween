import type { SceneDef } from "../../types";
import { not, rect, remark, say, think, travel } from "../dsl";

export const cemeteryGate: SceneDef = {
  title: "Cementerio Jardines del Más Acá — 03:33",
  floor: rect(8, 224, 464, 40),
  spawn: { x: 110, y: 244 },
  onEnter: [
    think(
      "El cementerio. Hay una banda tocando en la puerta. Son… esqueletos. Claro que son esqueletos.",
    ),
  ],
  hotspots: [
    {
      id: "moto",
      label: "Volver en moto",
      rect: rect(26, 172, 80, 46),
      art: "moto",
      interactions: [
        {
          effects: [
            { type: "sfx", sound: "engine" },
            { type: "goto", scene: "street" },
          ],
        },
      ],
    },
    {
      id: "band",
      label: "Banda Los Difuntos",
      rect: rect(118, 136, 120, 80),
      art: "band",
      interactions: [
        {
          with: "mallet",
          effects: [
            { type: "take", item: "mallet" },
            say(
              "cheche",
              "¡Nuestra maza! ¿Dónde estaba? ¿El Muqui? Ese enano la usaba de cuchara.",
              "A ver si tienes oído, joven. Repite el huayno y te abrimos.",
            ),
            { type: "puzzle", puzzle: "huayno" },
          ],
        },
        {
          when: { flag: "gateOpen" },
          effects: [
            say(
              "cheche",
              "¡Pasa, pasa! Y si ves a Don Eusebio, dile que ya le toca pagar la serenata.",
            ),
          ],
        },
        {
          when: { collected: "mallet" },
          effects: [
            say("cheche", "¡Otra vez, joven! El huayno, como te enseñé."),
            { type: "puzzle", puzzle: "huayno" },
          ],
        },
        {
          effects: [
            say(
              "cheche",
              "¡Buenas noches, joven! Banda Los Difuntos, para servirle.",
              "Esta noche nadie entra sin huayno. Pero se nos perdió la maza del bombo.",
              "Sin bombo no hay huayno, y sin huayno no abrimos. Así es la tradición.",
            ),
          ],
        },
      ],
    },
    {
      id: "gate",
      label: "Reja del cementerio",
      rect: rect(262, 76, 116, 140),
      art: "gate",
      visibleWhen: not({ flag: "gateOpen" }),
      interactions: [
        remark(
          "Cerrada con cadena. Un cartel: «Horario de visitas: de 6 p. m. a nunca».",
        ),
      ],
    },
    {
      id: "gateOpen",
      label: "Entrar al cementerio",
      rect: rect(262, 76, 116, 140),
      art: "openGate",
      visibleWhen: { flag: "gateOpen" },
      interactions: [{ effects: travel("cemetery") }],
    },
    {
      id: "nest",
      label: "Nido",
      rect: rect(400, 52, 48, 34),
      art: "nest",
      stand: { x: 424, y: 236 },
      interactions: [
        {
          effects: [
            think("Algo brilla dentro del nido. Meto la mano…"),
            { type: "die", death: "nest" },
          ],
        },
      ],
    },
  ],
};
