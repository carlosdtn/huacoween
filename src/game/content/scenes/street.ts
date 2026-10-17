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

export const street: SceneDef = {
  title: "Jr. Las Ánimas — 00:31",
  floor: rect(8, 224, 464, 40),
  spawn: { x: 90, y: 244 },
  onEnter: [
    think(
      "Afuera. Ni un alma en la calle… bueno, almas sí hay. Vivos, no.",
      "Mi moto está ahí. Vamos, Chancha.",
    ),
  ],
  hotspots: [
    arrow("toPark", "Parque de los Lamentos", "left", rect(0, 190, 24, 74), [
      { effects: travel("park") },
    ]),
    {
      id: "toKitchen",
      label: "Pollería",
      rect: rect(54, 116, 50, 100),
      art: "polleriaDoor",
      interactions: [{ effects: travel("kitchen") }],
    },
    decor(
      "pumpkins",
      "Calabazas",
      rect(16, 196, 34, 20),
      "pumpkins",
      "Calabazas talladas. Una tiene mi cara. No sé cómo sentirme.",
    ),
    {
      id: "moto",
      label: "Moto «La Chancha»",
      rect: rect(124, 172, 80, 46),
      art: "moto",
      interactions: [
        {
          with: "gasoline",
          effects: [
            { type: "take", item: "gasoline" },
            { type: "set", flag: "motoFueled" },
            { type: "sfx", sound: "engine" },
            think(
              "Glu glu glu. ¡La Chancha ruge! Bueno, tose. Pero tose con ganas.",
            ),
          ],
        },
        {
          when: { flag: "motoFueled" },
          effects: [
            { type: "sfx", sound: "engine" },
            think("¡Al cementerio, Chancha!"),
            { type: "goto", scene: "cemeteryGate" },
          ],
        },
        remark(
          "Tanque vacío. Alguien le chupó la gasolina con un sorbete.",
          "Hay huellas de triciclo alrededor. Huacosaw.",
        ),
      ],
    },
    {
      id: "pocha",
      label: "Doña Pocha",
      rect: rect(220, 146, 78, 70),
      art: "pocha",
      interactions: [
        {
          with: "coin",
          effects: [
            { type: "take", item: "coin" },
            { type: "give", item: "anticucho" },
            { type: "sfx", sound: "sizzle" },
            say(
              "pocha",
              "Un palito para el joven. Con su papita y su ají.",
              "Los vivos pagan con sol. Los muertos, con chismes. Tú eres de los primeros… por ahora.",
            ),
          ],
        },
        {
          when: { collected: "anticucho" },
          effects: [
            say(
              "pocha",
              "¿Otro? Ya no me queda corazón, joven. Literalmente: me lo comió un pishtaco en 1962.",
            ),
          ],
        },
        {
          effects: [
            say(
              "pocha",
              "¡Anticuchos para vivos y difuntos! A sol el palito.",
              "¿Para el cementerio vas? Uy, joven. Esta noche los muertos tienen hambre.",
            ),
          ],
        },
      ],
    },
    decor(
      "lamp",
      "Poste",
      rect(306, 56, 24, 160),
      "lampVulture",
      "Un gallinazo en el poste. Me mira como si yo fuera el delivery de él.",
    ),
    {
      id: "alley",
      label: "Callejón",
      rect: rect(342, 108, 54, 108),
      art: "alley",
      interactions: [
        {
          effects: [
            { type: "sfx", sound: "whistle" },
            say("tunche", "Fiuuu… fiu fiu…"),
            {
              type: "choice",
              prompt: "Alguien silba desde el fondo del callejón.",
              options: [
                {
                  label: "Silbarle de vuelta",
                  effects: [{ type: "die", death: "tunche" }],
                },
                {
                  label: "Entrar sin hacer ni un ruido",
                  effects: [
                    {
                      type: "branch",
                      when: not({ collected: "emptyBottle" }),
                      ifTrue: [
                        { type: "give", item: "emptyBottle" },
                        { type: "sfx", sound: "pickup" },
                        think(
                          "Entro de puntitas, agarro una botella vacía y salgo sin respirar. El silbido me sigue un rato.",
                        ),
                      ],
                      ifFalse: [
                        think(
                          "Ahí ya no hay nada más que el silbido. Y el silbido no se lleva.",
                        ),
                      ],
                    },
                  ],
                },
                {
                  label: "Hacerme el sordo y alejarme",
                  effects: [think("Aquí no escuché nada. Nada de nada.")],
                },
              ],
            },
          ],
        },
      ],
    },
    egg(
      "egg2",
      rect(404, 208, 8, 8),
      "¡Un caramelo de limón junto al callejón! El Tunche no come dulces. Solo almas.",
    ),
    arrow(
      "toMarket",
      "Mercado de las Brujas",
      "right",
      rect(456, 190, 24, 74),
      [{ effects: travel("market") }],
    ),
  ],
};
