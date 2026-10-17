import type { SceneDef } from "../../types";
import {
  decor,
  egg,
  not,
  pickup,
  rect,
  remark,
  say,
  spot,
  think,
  travel,
} from "../dsl";

export const kitchen: SceneDef = {
  title: "Pollería La Brasa Eterna — 23:57",
  floor: rect(8, 224, 464, 40),
  spawn: { x: 300, y: 244 },
  onEnter: [
    { type: "sfx", sound: "tv" },
    say(
      "huacosaw",
      "Hola, Tito. Quiero jugar un juego.",
      "Durante años te comiste las papas fritas de tus clientes. Marcaste «entregado» desde tu cama.",
      "Esta noche de Halloween harás la entrega más difícil de tu vida: un cuarto de pollo para Don Eusebio.",
      "Don Eusebio murió en 1999… esperando su pedido.",
      "Si no llegas antes del amanecer, serás repartidor fantasma por toda la eternidad. Con una estrella.",
    ),
    think(
      "¿Un huaco con cachetes en espiral manejando un triciclo?",
      "Ya no vuelvo a hacer doble turno.",
    ),
  ],
  hotspots: [
    egg(
      "egg1",
      rect(4, 212, 8, 8),
      "¡Un caramelo detrás del asador! Envoltura de 1999. Mejor lo guardo de recuerdo.",
    ),
    {
      id: "rotisserie",
      label: "Asador",
      rect: rect(18, 108, 88, 108),
      art: "rotisserie",
      interactions: [
        {
          with: "tongs",
          when: not({ collected: "chicken" }),
          effects: [
            { type: "sfx", sound: "sizzle" },
            { type: "give", item: "chicken" },
            think(
              "Con las pinzas saco un cuarto de pollo. Pierna y encuentro, como manda la ley.",
            ),
          ],
        },
        {
          when: { collected: "chicken" },
          ...remark(
            "Los pollos siguen girando. Juraría que uno me guiñó el ojo.",
          ),
        },
        {
          effects: [
            think("Saco un pollo con la mano. ¿Qué tan caliente puede estar?"),
            { type: "die", death: "spit" },
          ],
        },
      ],
    },
    {
      id: "fryer",
      label: "Freidora",
      rect: rect(114, 160, 46, 56),
      art: "fryer",
      interactions: [
        {
          when: { collected: "fries" },
          ...remark("Solo queda aceite. Aceite con historia."),
        },
        {
          effects: [
            {
              type: "choice",
              prompt: "Las papas están doraditas. Huelen a gloria.",
              options: [
                {
                  label: "Probar una. Solo una. Nadie se entera.",
                  effects: [{ type: "die", death: "papita" }],
                },
                {
                  label: "Ni una. El pedido es sagrado.",
                  effects: [
                    { type: "give", item: "fries" },
                    { type: "sfx", sound: "pickup" },
                    think(
                      "Las sirvo completitas. Me duele el alma, pero completitas.",
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
      "counter",
      "Mostrador",
      rect(166, 170, 96, 46),
      "counter",
      "El mostrador. Aquí han pasado mil pollos y ninguna propina.",
    ),
    {
      id: "cremas",
      label: "Cremas",
      rect: rect(174, 158, 26, 14),
      item: "cremas",
      interactions: [
        pickup(
          "cremas",
          "Ají, mayonesa y huacatay. Un pollo sin cremas es un delito.",
        ),
      ],
    },
    {
      id: "register",
      label: "Caja registradora",
      rect: rect(226, 146, 32, 26),
      art: "register",
      interactions: [
        {
          when: not({ collected: "coin" }),
          effects: [
            { type: "sfx", sound: "coin" },
            { type: "give", item: "coin" },
            think(
              "¡Clin! Un sol con una nota: «propina para el delivery». La primera en tres años.",
            ),
          ],
        },
        remark("Vacía. Hasta las polillas se fueron."),
      ],
    },
    {
      id: "drawer",
      label: "Cajón",
      rect: rect(204, 192, 26, 14),
      interactions: [
        {
          with: "smallKey",
          effects: [
            { type: "take", item: "smallKey" },
            { type: "set", flag: "drawerOpen" },
            { type: "give", item: "tongs" },
            { type: "sfx", sound: "unlock" },
            think("¡Unas pinzas largas! Ideales para no tocar lo que quema."),
          ],
        },
        {
          when: { flag: "drawerOpen" },
          ...remark("Solo quedan servilletas y un palito de anticucho."),
        },
        remark("Cerrado con llave."),
      ],
    },
    {
      id: "ticket",
      label: "Comanda",
      rect: rect(250, 82, 16, 22),
      art: "ticket",
      interactions: [
        remark(
          "Pedido #666. Un cuarto de pollo con papas y cremas.",
          "Para: Don Eusebio. Mausoleo Quispe, Cementerio Jardines del Más Acá.",
          "Nota del cliente: «Tocar fuerte. Estoy medio muerto».",
        ),
      ],
    },
    {
      id: "tv",
      label: "Televisor",
      rect: rect(190, 22, 60, 46),
      art: "tv",
      interactions: [
        {
          effects: [
            { type: "sfx", sound: "tv" },
            say(
              "huacosaw",
              "Tic, tac, Tito. El gallo canta a las cinco.",
              "Pista gratis: la puerta cuesta lo mismo que un cuarto de pollo.",
            ),
          ],
        },
      ],
    },
    decor(
      "menu",
      "Pizarra",
      rect(276, 26, 76, 52),
      "menuBoard",
      "La carta. Un cuarto de pollo: diecinueve con noventa. Abajo dice «NO HAY CUY». Qué alivio.",
    ),
    {
      id: "stove",
      label: "Cocina",
      rect: rect(270, 164, 60, 52),
      art: "stove",
      interactions: [
        remark("Una cocina industrial. Las hornillas susurran en quechua."),
      ],
    },
    {
      id: "lighter",
      label: "Encendedor",
      rect: rect(296, 152, 14, 10),
      item: "lighter",
      interactions: [
        pickup(
          "lighter",
          "El encendedor de la cocina. Prende al tercer intento.",
        ),
      ],
    },
    {
      id: "apron",
      label: "Mandil",
      rect: rect(342, 76, 26, 46),
      art: "apron",
      interactions: [
        {
          when: not({ collected: "smallKey" }),
          ...pickup(
            "smallKey",
            "En el bolsillo del mandil hay una llavecita. Huele a ají.",
          ),
        },
        remark(
          "El mandil del cocinero. Dice «El Rey del Pollo». Ahí sigue colgado; el rey, no.",
        ),
      ],
    },
    {
      id: "sink",
      label: "Lavadero",
      rect: rect(334, 156, 44, 46),
      art: "sink",
      interactions: [remark("Platos sucios desde el Halloween pasado.")],
    },
    {
      id: "cuy",
      label: "Debajo del lavadero",
      rect: rect(338, 202, 36, 14),
      art: "cuyEyes",
      visibleWhen: not({ flag: "cuyJoined" }),
      interactions: [
        {
          with: "lettuce",
          effects: [
            { type: "sfx", sound: "squeak" },
            think(
              "Le pongo la lechuga en la cara. El cuy se esconde más. Tiene sus maneras.",
            ),
          ],
        },
        {
          effects: [
            { type: "sfx", sound: "squeak" },
            think(
              "Dos ojitos brillan debajo del lavadero. Un cuy. Tiembla como gelatina.",
            ),
          ],
        },
      ],
    },
    // Leaving the lettuce out in the open is what finally coaxes the cuy out.
    spot(
      "floorSpot",
      rect(150, 224, 170, 40),
      [
        {
          with: "lettuce",
          effects: [
            { type: "take", item: "lettuce" },
            { type: "set", flag: "cuyJoined" },
            { type: "sfx", sound: "squeak" },
            think("Dejo la lechuga en el piso y me hago el loco…"),
            say(
              "chicharron",
              "¡Cuiii! (Lechuga orgánica. Eres de los buenos.)",
              "¡Cui cui! (Me llamo Chicharrón. Llevo tres Halloweens escapando de la carta. Te sigo.)",
            ),
          ],
        },
      ],
      not({ flag: "cuyJoined" }),
    ),
    {
      id: "lettuceBitten",
      label: "Lechuga mordida",
      rect: rect(236, 244, 16, 8),
      art: "lettuceBitten",
      visibleWhen: { flag: "cuyJoined" },
      interactions: [remark("Chicharrón dejó solo el tronquito. Respeto.")],
    },
    {
      id: "fridge",
      label: "Refrigeradora",
      rect: rect(380, 116, 40, 100),
      art: "fridge",
      interactions: [
        {
          when: not({ collected: "lettuce" }),
          ...pickup(
            "lettuce",
            "Una lechuga fresca. Para la ensalada… o para alguien chiquito.",
          ),
        },
        {
          when: not({ collected: "huevo" }),
          ...pickup(
            "huevo",
            "Un huevo. Mi abuela decía que sirven para ver el destino.",
          ),
        },
        remark("Solo queda una Inca Kola sin gas y un limón con miedo."),
      ],
    },
    {
      id: "door",
      label: "Puerta",
      rect: rect(428, 112, 46, 104),
      art: "kitchenDoor",
      interactions: [
        { when: { flag: "doorUnlocked" }, effects: travel("street") },
        { effects: [{ type: "puzzle", puzzle: "doorCode" }] },
      ],
    },
  ],
};
