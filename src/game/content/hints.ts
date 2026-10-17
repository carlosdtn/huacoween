import type { HintDef } from "../types";

const not = (when: HintDef["when"]): HintDef["when"] => ({ not: when });
const all = (...conditions: HintDef["when"][]): HintDef["when"] => ({
  all: conditions,
});
const any = (...conditions: HintDef["when"][]): HintDef["when"] => ({
  any: conditions,
});

/** Ordered by story progress: the first hint whose condition holds is the one shown. */
export const hints: HintDef[] = [
  // Kitchen
  {
    when: not({ collected: "smallKey" }),
    text: "Ese mandil colgado tiene bolsillos. Los cocineros siempre guardan cosas ahí.",
  },
  {
    when: not({ flag: "drawerOpen" }),
    text: "La llavecita debe abrir algo del mostrador.",
  },
  {
    when: not({ collected: "chicken" }),
    text: "Con las pinzas puedo sacar el pollo del asador sin quemarme.",
  },
  {
    when: not({ collected: "fries" }),
    text: "Faltan las papas. Están en la freidora. Ni se me ocurra probarlas.",
  },
  {
    when: not(any({ collected: "order" })),
    text: "Pollo y papas juntos hacen el pedido. Puedo combinarlos.",
  },
  {
    when: not({ collected: "cremas" }),
    text: "La comanda dice «con cremas». Están en el mostrador.",
  },
  {
    when: not({ collected: "lettuce" }),
    text: "En la refri debe haber algo para la ensalada.",
  },
  {
    when: not({ flag: "cuyJoined" }),
    text: "El cuy no sale si le pongo la comida en la cara. ¿Y si se la dejo en el piso, lejos de él?",
  },
  {
    when: not({ flag: "doorUnlocked" }),
    text: "La puerta cuesta lo mismo que un cuarto de pollo. La pizarra tiene los precios.",
  },
  { when: not({ visited: "street" }), text: "La puerta ya está abierta." },
  // Street, market and catacombs
  {
    when: not({ collected: "coin" }),
    text: "Doña Pocha vende anticuchos a sol. En la caja de la pollería había algo.",
  },
  {
    when: not({ collected: "anticucho" }),
    text: "Le compro un anticucho a Doña Pocha con mi sol.",
  },
  {
    when: not({ collected: "emptyBottle" }),
    text: "En el callejón hay cosas tiradas. Si alguien silba, mejor no contestar.",
  },
  {
    when: not({ visited: "market" }),
    text: "A la derecha de la calle está el Mercado de las Brujas. Ahí saben de huacos malditos.",
  },
  {
    when: not({ collected: "huevo" }),
    text: "Hermana Lucha necesita un huevo. En la refri de la pollería había uno.",
  },
  {
    when: not({ collected: "aguaFlorida" }),
    text: "Le llevo el huevo a Hermana Lucha para que me lea el destino.",
  },
  {
    when: not({ collected: "lighter" }),
    text: "Para bajar por la trampilla necesito luz. En la cocina de la pollería hay un encendedor.",
  },
  {
    when: not({ visited: "catacombs" }),
    text: "La trampilla del mercado baja a las catacumbas.",
  },
  {
    when: not({ flag: "muquiFed" }),
    text: "Al Muqui no se le quita nada a la fuerza. ¿Y si le invito algo rico?",
  },
  {
    when: all(not({ collected: "mallet" }), not({ flag: "cuyJoined" })),
    text: "En el hueco no entra mi mano. Ese cuy de la pollería sí entraría.",
  },
  {
    when: not({ collected: "mallet" }),
    text: "Con el Muqui distraído, Chicharrón puede meterse al hueco.",
  },
  // Park
  {
    when: not({ visited: "park" }),
    text: "A la izquierda de la calle hay un parque. Dicen que allí pasan cosas raras.",
  },
  {
    when: not({ flag: "chullaFled" }),
    text: "Esa no es mi mamá. Si le alumbro los pies, sabré quién es.",
  },
  {
    when: not({ collected: "hose" }),
    text: "La falsa mamá dejó caer algo en el parque.",
  },
  {
    when: not(any({ collected: "siphon" })),
    text: "Una manguera y una botella. Juntas sirven para sacar gasolina.",
  },
  {
    when: not({ collected: "gasoline" }),
    text: "La mototaxi del parque todavía tiene gasolina.",
  },
  {
    when: not({ flag: "motoFueled" }),
    text: "La Chancha necesita gasolina.",
  },
  // Cemetery
  {
    when: not({ visited: "cemeteryGate" }),
    text: "Con gasolina, la moto me lleva al cementerio.",
  },
  {
    when: not({ flag: "gateOpen" }),
    text: "La banda no abre sin su maza. Luego hay que repetir el huayno: escucha bien el bombo.",
  },
  {
    when: not({ flag: "nameKnown" }),
    text: "El huaquero que sacó a Huacosaw está enterrado en este pabellón. Leamos las tumbas.",
  },
  {
    when: not({ flag: "cryptOpen" }),
    text: "La puerta del mausoleo pide el año en que se fue Don Eusebio. La placa lo dice.",
  },
  {
    when: not({ flag: "huacosawCalmed" }),
    text: "Agua florida encima y luego su nombre verdadero. Así dijo Hermana Lucha.",
  },
  {
    when: not({ has: "cremas" }),
    text: "Puedo entregar ya… aunque la comanda decía «con cremas».",
  },
  {
    when: { has: "order" },
    text: "Solo falta entregar el pedido en el nicho. Bien entregado.",
  },
  { when: { all: [] }, text: "Ya casi amanece. Termina el reparto." },
];
