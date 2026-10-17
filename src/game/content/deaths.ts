import type { DeathDef } from "../types";

export const VILLAINS = [
  "huacosaw",
  "tunche",
  "chullachaqui",
  "muqui",
  "gallinazo",
  "condenado",
  "bats",
] as const;
export type VillainId = (typeof VILLAINS)[number];

export const deaths = {
  spit: {
    villain: "huacosaw",
    title: "Brasa eterna",
    text: "Metiste la mano al asador. Diste tres vueltas, saliste doradito y alguien te pidió con papas.",
    tip: "Lo que quema no se toca con las manos. Algo en esta cocina tiene brazos largos.",
  },
  papita: {
    villain: "huacosaw",
    title: "Solo una papita",
    text: "Te comiste una papa del pedido. Huacosaw lo vio todo por la cámara de seguridad. Y eso fue todo.",
    tip: "Este juego trata justamente de eso, Tito.",
  },
  tunche: {
    villain: "tunche",
    title: "Fiu fiu",
    text: "Le silbaste de vuelta al Tunche. Te contestó. De muy, muy cerca.",
    tip: "Si alguien silba en la oscuridad, nunca le contestes.",
  },
  lost: {
    villain: "chullachaqui",
    title: "Ven, hijito",
    text: "Seguiste a «tu mamá» entre los árboles. Llevas tres días caminando y el parque solo tiene una cuadra.",
    tip: "Las mamás de verdad tienen los dos pies iguales. Mírale bien los pies… si puedes ver algo.",
  },
  muquiHat: {
    villain: "muqui",
    title: "Casco ajeno",
    text: "Le quitaste el casco al Muqui. Ahora trabajas para él en una mina de 1850. Sin seguro.",
    tip: "Al Muqui no se le roba. Se le cae bien con algo rico.",
  },
  callao: {
    villain: "bats",
    title: "Hasta el Callao",
    text: "Dicen que el túnel llega hasta el Callao. Llegaste. En el año 2087, cubierto de murciélagos.",
    tip: "No todos los túneles son atajos.",
  },
  nest: {
    villain: "gallinazo",
    title: "Gallinazo no canta en el ataúd",
    text: "Metiste la mano en el nido del gallinazo. Te miró, llamó a sus primos y ahora eres el almuerzo.",
    tip: "Los gallinazos no prestan nada. Mejor busca a quien sí ayude en la puerta.",
  },
  hug: {
    villain: "condenado",
    title: "Abrazo condenado",
    text: "Abrazaste al condenado. Ahora cargas su pena: pagar su tarjeta de crédito de 1998, con intereses.",
    tip: "Con los condenados se conversa. Abrazos, no.",
  },
  broken: {
    villain: "huacosaw",
    title: "Huaco roto",
    text: "Pateaste a Huacosaw. Se rompió en mil pedazos… que se volvieron a juntar con mucha, mucha cólera.",
    tip: "Un huaco maldito no se rompe, se limpia. ¿Quién en el mercado sabe de limpias?",
  },
  wrongName: {
    villain: "huacosaw",
    title: "Nombre equivocado",
    text: "«¿Huacosaw? ¡Ese es mi nombre artístico!». Te convirtió en huaco de repisa. Ahora te limpian con plumero.",
    tip: "Alguien enterrado en el cementerio sabe cómo se llamaba de verdad.",
  },
  aiApaec: {
    villain: "huacosaw",
    title: "Muy creído",
    text: "Le dijiste que era el dios Ai Apaec. Se lo creyó, creció tres metros y te pidió sacrificios. Fuiste el primero.",
    tip: "No lo halagues. Llámalo por el nombre que le pusieron de verdad.",
  },
  lastFry: {
    villain: "huacosaw",
    title: "A un paso",
    text: "Llegaste hasta el nicho y te comiste una papita. Huacosaw salió de la nada: «Te estaba esperando».",
    tip: "Un pedido se entrega completo. Siempre.",
  },
} satisfies Record<string, DeathDef>;

export type DeathId = keyof typeof deaths;
