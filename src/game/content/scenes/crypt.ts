import type { Effect, SceneDef } from "../../types";
import { arrow, decor, rect, remark, say, think, travel } from "../dsl";

const deliver: Effect = {
  type: "choice",
  prompt:
    "El nicho de Don Eusebio. Una mano huesuda sale despacito. ¿Cómo entregas?",
  options: [
    {
      label: "Dejar la bolsa en el piso y marcar «entregado»",
      effects: [
        { type: "take", item: "order" },
        { type: "end", ending: "oneStar" },
      ],
    },
    {
      label: "Comerme una papita antes. Total, ya llegué.",
      effects: [{ type: "die", death: "lastFry" }],
    },
    {
      label: "Entregar en la mano: «¡Buen provecho, Don Eusebio!»",
      effects: [
        { type: "take", item: "order" },
        say(
          "eusebio",
          "Veinticinco años, joven. Veinticinco años…",
          "¿Está calientito?",
        ),
        {
          type: "branch",
          when: { has: "cremas" },
          ifTrue: [
            { type: "take", item: "cremas" },
            think("Y aquí están sus cremas: ají, mayonesa y huacatay."),
            say("eusebio", "¡Con huacatay! Hijo, tú sí eres un profesional."),
            { type: "end", ending: "fiveStars" },
          ],
          ifFalse: [{ type: "end", ending: "threeStars" }],
        },
      ],
    },
  ],
};

export const crypt: SceneDef = {
  title: "Mausoleo de Don Eusebio — 04:44",
  floor: rect(8, 224, 464, 40),
  spawn: { x: 40, y: 244 },
  onEnter: [
    say(
      "huacosaw",
      "Llegaste, Tito. Con tu pollito y tus papitas.",
      "Pero este nicho es mío esta noche. ¡Nadie entrega nada sin pasar por Huacosaw!",
    ),
    think("Ahí está. Más chiquito en persona. Pero con más cachete."),
  ],
  hotspots: [
    arrow("back", "Salir del mausoleo", "left", rect(0, 190, 24, 74), [
      { effects: travel("cemetery") },
    ]),
    decor(
      "candles",
      "Velas",
      rect(100, 190, 48, 26),
      "candles",
      "Velas de Halloween y de Todos los Santos. Doble turno, como yo.",
    ),
    {
      id: "huacosawBoss",
      label: "Huacosaw",
      rect: rect(218, 136, 64, 80),
      art: "huacosaw",
      stand: { x: 184, y: 244 },
      visibleWhen: { not: { flag: "huacosawCalmed" } },
      interactions: [
        {
          with: "aguaFlorida",
          effects: [
            { type: "sfx", sound: "hiss" },
            think("¡Le echo el agua florida encima, como Hermana Lucha!"),
            say(
              "huacosaw",
              "¡Achís! ¡Achís! ¡Huele a abuelita! ¡Mi máscara de valiente se derrite!",
              "Igual no te tengo miedo. ¿Acaso sabes cómo me llamo de verdad?",
            ),
            {
              type: "branch",
              when: { flag: "nameKnown" },
              ifTrue: [
                {
                  type: "choice",
                  prompt: "Huacosaw te reta: «¡Dime mi nombre, repartidor!»",
                  options: [
                    {
                      label: "«¡Huacosaw!»",
                      effects: [{ type: "die", death: "wrongName" }],
                    },
                    {
                      label: "«¡Eres Ai Apaec, el dios moche!»",
                      effects: [{ type: "die", death: "aiApaec" }],
                    },
                    {
                      label: "«Tranquilo… Pepe».",
                      effects: [
                        { type: "take", item: "aguaFlorida" },
                        { type: "set", flag: "huacosawCalmed" },
                        { type: "sfx", sound: "success" },
                        say(
                          "huacosaw",
                          "¿P… Pepe? Nadie me decía Pepe desde el año 500.",
                          "Pancracio me sacó de mi huaca y nadie volvió a llamarme por mi nombre…",
                          "Snif. Ya, ya. Entrega tu pollo. Pero bien entregado, ¿ah?",
                        ),
                        think(
                          "Huacosaw se encoge, se le borran los espirales y se sube solito a una repisa.",
                        ),
                      ],
                    },
                  ],
                },
              ],
              ifFalse: [
                say(
                  "huacosaw",
                  "¡Ja! No tienes ni idea. ¡Vuelve cuando sepas quién soy!",
                ),
                think(
                  "El agua florida lo debilitó, pero se seca rápido. Me queda un poco en la botella.",
                ),
                think(
                  "Hermana Lucha dijo que el huaquero sabía su nombre. Está enterrado aquí en el cementerio.",
                ),
              ],
            },
          ],
        },
        {
          with: "order",
          ...remark("No puedo entregar nada con Huacosaw bloqueando el nicho."),
        },
        {
          effects: [
            {
              type: "choice",
              prompt:
                "Huacosaw toca la bocina de su triciclo: «¿Qué vas a hacer, Tito?»",
              options: [
                {
                  label: "Patearlo. Es de barro.",
                  effects: [{ type: "die", death: "broken" }],
                },
                {
                  label: "Pedirle perdón por las papas",
                  effects: [
                    say(
                      "huacosaw",
                      "¿Perdón? Tres mil cuatrocientas doce papas, Tito. Con perdón no alcanza.",
                    ),
                  ],
                },
                {
                  label: "Retroceder y pensar",
                  effects: [
                    say(
                      "huacosaw",
                      "¡Corre, corre! Ningún repartidor me ha ganado.",
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
      id: "pepe",
      label: "Pepe",
      rect: rect(232, 120, 30, 34),
      art: "pepe",
      visibleWhen: { flag: "huacosawCalmed" },
      interactions: [
        {
          effects: [
            say(
              "pepe",
              "Ya no soy Huacosaw. Soy Pepe. Ahora déjame descansar… y entrega bien ese pollo.",
            ),
          ],
        },
      ],
    },
    {
      id: "nicho",
      label: "Nicho de Don Eusebio",
      rect: rect(352, 100, 60, 46),
      art: "nicho",
      stand: { x: 382, y: 236 },
      interactions: [
        {
          with: "order",
          when: { flag: "huacosawCalmed" },
          effects: [
            { type: "sfx", sound: "door" },
            say("eusebio", "¿Delivery? ¿Por fin?"),
            deliver,
          ],
        },
        {
          when: { flag: "huacosawCalmed" },
          effects: [
            say(
              "eusebio",
              "¿Quién toca? Si no traes mi pollo, no me despiertes.",
            ),
          ],
        },
        {
          with: "order",
          ...remark(
            "Huacosaw está parado frente al nicho. Primero tengo que pasar por él.",
          ),
        },
        {
          when: { not: { flag: "huacosawCalmed" } },
          ...remark(
            "Huacosaw está parado frente al nicho. Primero tengo que pasar por él.",
          ),
        },
        {
          with: "chicken",
          ...remark("¿Solo el pollo? Falta armar el pedido con sus papas."),
        },
      ],
    },
  ],
};
