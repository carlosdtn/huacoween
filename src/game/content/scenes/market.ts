import type { SceneDef } from "../../types";
import {
  arrow,
  decor,
  egg,
  not,
  rect,
  remark,
  say,
  think,
  travel,
} from "../dsl";

export const market: SceneDef = {
  title: "Mercado de las Brujas — 01:13",
  floor: rect(8, 224, 464, 40),
  spawn: { x: 40, y: 244 },
  onEnter: [
    think(
      "El Mercado de las Brujas. Huele a palo santo, a ruda y a sapo seco.",
    ),
  ],
  hotspots: [
    arrow("back", "Volver a la calle", "left", rect(0, 190, 24, 74), [
      { effects: travel("street") },
    ]),
    {
      id: "lucha",
      label: "Hermana Lucha",
      rect: rect(64, 116, 100, 100),
      art: "lucha",
      interactions: [
        {
          with: "huevo",
          effects: [
            { type: "take", item: "huevo" },
            { type: "sfx", sound: "hiss" },
            say(
              "lucha",
              "A ver, hijito. Te paso el huevo por la cabeza… lo rompo en el vaso…",
              "Uy. Veo… veo… tres mil cuatrocientas doce papas fritas ajenas.",
              "Ese huaco es moche, y está picón. Un huaquero lo sacó de su huaca y desde entonces no descansa.",
              "Toma esta agua florida bendecida. Échasela encima: le quita la máscara de valiente.",
              "Pero solo se calma si lo llamas por su nombre verdadero. Ese nombre lo sabe el huaquero que lo sacó.",
              "Dicen que lo enterraron en el Más Acá. Con su pala y su culpa.",
            ),
            { type: "give", item: "aguaFlorida" },
            { type: "sfx", sound: "pickup" },
          ],
        },
        {
          with: "order",
          ...remark(
            "Hermana Lucha huele el pollo, suspira y niega con la cabeza. «Eso no es para mí, hijito».",
          ),
        },
        {
          when: { collected: "aguaFlorida" },
          effects: [
            say(
              "lucha",
              "Agua florida y su nombre verdadero, hijito. Y no te comas nada en el camino.",
            ),
          ],
        },
        {
          when: { flag: "luchaMet" },
          effects: [
            say(
              "lucha",
              "Tráeme un huevo, hijito. Sin huevo no veo nada. Ni con lentes.",
            ),
          ],
        },
        {
          effects: [
            { type: "set", flag: "luchaMet" },
            say(
              "lucha",
              "Pasa, hijito, pasa. Limpias, amarres, florecimientos y desamarres de ex.",
              "Uy… tú traes algo pegado. Algo de barro, con cachetes en espiral.",
              "Tráeme un huevo y te leo el destino. Sin huevo no veo nada.",
            ),
          ],
        },
      ],
    },
    {
      id: "cuyStall",
      label: "Jaulas de cuyes",
      rect: rect(178, 150, 76, 66),
      art: "cuyCages",
      interactions: [
        {
          when: { flag: "cuyJoined" },
          effects: [
            say(
              "chicharron",
              "¡Cuiii! (¡Tío Pancho! ¡Prima Rosita!)",
              "Cui… (Tranquilos, el señor del pollo es de confianza.)",
            ),
          ],
        },
        remark(
          "Jaulas llenas de cuyes. Un cartel dice «para limpia o para almuerzo». Prefiero no preguntar.",
        ),
      ],
    },
    decor(
      "herbStall",
      "Puesto de hierbas",
      rect(268, 116, 86, 100),
      "herbStall",
      "Ruda, chamico, huayruros y sapos secos. Un sapo me guiñó el ojo. Ya van dos esta noche.",
    ),
    egg(
      "egg3",
      rect(358, 208, 8, 8),
      "¡Un caramelo entre los huayruros! Dice «para la suerte». Ojalá funcione.",
    ),
    {
      id: "trapdoor",
      label: "Trampilla",
      rect: rect(376, 210, 56, 18),
      art: "trapdoor",
      stand: { x: 404, y: 244 },
      interactions: [
        {
          when: { has: "lighter" },
          effects: [
            think(
              "Prendo el encendedor… al tercer intento. Hay una escalera que baja.",
            ),
            ...travel("catacombs"),
          ],
        },
        {
          when: not({ has: "lighter" }),
          ...remark(
            "Una trampilla en el piso. Abajo está oscurísimo. Sin luz no bajo ni loco.",
          ),
        },
      ],
    },
  ],
};
