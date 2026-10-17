import type { ItemDef } from "../types";

export const items = {
  smallKey: {
    name: "Llavecita",
    description: "Estaba en el bolsillo del mandil. Huele a ají.",
  },
  tongs: {
    name: "Pinzas",
    description: "Pinzas largas de metal. Para no tocar lo que quema.",
  },
  chicken: {
    name: "Cuarto de pollo",
    description: "Pierna, encuentro y piel crocante. Sagrado.",
  },
  fries: {
    name: "Papas fritas",
    description: "Doraditas. No te comas ni una.",
  },
  order: {
    name: "Pedido #666",
    description: "1/4 de pollo con papas. Para: Don Eusebio. Mausoleo Quispe.",
  },
  cremas: {
    name: "Cremas",
    description: "Ají, mayonesa y huacatay. Un pollo sin cremas es un delito.",
  },
  coin: {
    name: "Moneda de 1 sol",
    description: "Tu primera propina en tres años.",
  },
  lighter: {
    name: "Encendedor",
    description: "El de la cocina. Prende al tercer intento.",
  },
  lettuce: {
    name: "Lechuga",
    description: "Fresca y crujiente. Para la ensalada… o para alguien más.",
  },
  huevo: {
    name: "Huevo",
    description: "Un huevo de gallina. Dicen que sirve para leer el destino.",
  },
  anticucho: {
    name: "Anticucho",
    description: "Corazón a la parrilla con su papita. Huele a gloria.",
  },
  emptyBottle: {
    name: "Botella vacía",
    description: "Era de chicha morada. Todavía está pegajosa.",
  },
  hose: {
    name: "Manguera",
    description: "Una manguera de jardín. La dejó caer «mamá».",
  },
  siphon: {
    name: "Sifón casero",
    description: "Manguera metida en una botella. No le digas a tu mamá.",
  },
  gasoline: {
    name: "Gasolina",
    description: "Una botella de gasolina de mototaxi. No es para tomar.",
  },
  aguaFlorida: {
    name: "Agua florida",
    description: "Bendecida por Hermana Lucha. Espanta males y abuelas.",
  },
  mallet: {
    name: "Maza de bombo",
    description: "La maza perdida de la banda. El Muqui la usaba de cuchara.",
  },
} as const satisfies Record<string, ItemDef>;

export type ItemId = keyof typeof items;
