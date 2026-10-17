import type { EndingDef } from "../types";

export const endings = {
  fiveStars: {
    rank: "good",
    cast: ["tito", "chicharron", "eusebio", "pepe", "lucha"],
    title: "Cinco estrellas",
    text: "Don Eusebio prueba el pollo, moja una papa en huacatay y llora de felicidad. Te deja cinco estrellas y una propina de 1999. Sale el sol, Pepe vuelve a ser un huaco tranquilo y Chicharrón se convierte en tu copiloto oficial.",
  },
  threeStars: {
    rank: "meh",
    cast: ["tito", "eusebio"],
    title: "Tres estrellas",
    text: "«Buen pollo, joven… pero ¿y mis cremitas?». Don Eusebio te deja tres estrellas y un comentario largo. Huacosaw te mira desde la repisa: «Casi, Tito. Casi».",
  },
  oneStar: {
    rank: "meh",
    cast: ["tito", "huacosaw"],
    title: "Una estrella",
    text: "Dejas la bolsa en el piso, marcas «entregado» y sales corriendo. Una estrella. Desde la oscuridad, Huacosaw pedalea su triciclo: «Nos vemos el próximo Halloween, repartidor».",
  },
} satisfies Record<string, EndingDef>;

export type EndingId = keyof typeof endings;
