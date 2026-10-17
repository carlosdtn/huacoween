import type { ItemId } from "@/game/content/items";
import { grid } from "../builder";
import type { Frame } from "../sprite";

/*
 * Items are drawn once at the 480×270 scale: the same frame lies in the scene
 * and fills its inventory slot, so a coin never looks as big as a moto.
 */

const g = grid;

export const items: Record<ItemId, Frame> = {
  smallKey: g(18, 10)
    .circle(4, 5, 3, "y", undefined, 3)
    .px(4, 5, ".")
    .fill(7, 4, 10, 2, "y")
    .fill(13, 6, 2, 2, "y")
    .fill(16, 6, 1, 2, "y")
    .hline(7, 4, 10, "q")
    .outline()
    .frame(),
  tongs: g(26, 10)
    .stroke(1, 3, 20, 4, 2, "g")
    .stroke(1, 6, 20, 5, 2, "g")
    .fill(20, 3, 5, 4, "G")
    .hline(2, 3, 16, "w")
    .outline()
    .frame(),
  chicken: g(22, 16)
    .circle(10, 9, 8, "t", undefined, 5)
    .recolor(2, 10, 18, 6, "t", "T")
    .dither(4, 5, 12, 4, "q")
    .stroke(16, 10, 20, 14, 3, "T")
    .circle(20, 14, 1, "J")
    .outline()
    .frame(),
  fries: g(18, 20)
    .fill(5, 1, 2, 9, "t")
    .fill(8, 0, 2, 10, "q")
    .fill(11, 2, 2, 8, "t")
    .fill(14, 1, 2, 9, "q")
    .polygon(
      [
        [2, 8],
        [16, 8],
        [14, 19],
        [4, 19],
      ],
      "r",
    )
    .fill(6, 11, 6, 4, "w")
    .px(8, 12, "r")
    .px(10, 13, "y")
    .outline()
    .frame(),
  order: g(22, 24)
    .polygon(
      [
        [3, 5],
        [19, 5],
        [20, 23],
        [2, 23],
      ],
      "u",
    )
    .recolor(14, 5, 8, 19, "u", "T")
    .fill(3, 3, 16, 3, "J")
    .stroke(8, 3, 11, 0, 2, "X")
    .stroke(14, 3, 11, 0, 2, "X")
    .fill(6, 11, 10, 7, "o")
    .fill(8, 13, 6, 3, "w")
    .px(10, 14, "o")
    .outline()
    .frame(),
  cremas: g(22, 14)
    .circle(4, 9, 3, "y", undefined, 3)
    .circle(11, 9, 3, "w", undefined, 3)
    .circle(18, 9, 3, "e", undefined, 3)
    .fill(3, 3, 3, 3, "J")
    .fill(10, 3, 3, 3, "J")
    .fill(17, 3, 3, 3, "J")
    .px(4, 8, "q")
    .px(17, 8, "l")
    .outline()
    .frame(),
  coin: g(12, 12)
    .circle(6, 6, 5, "y", "O")
    .circle(6, 6, 3, "t")
    .fill(5, 4, 2, 5, "q")
    .outline()
    .frame(),
  lighter: g(12, 18)
    .box(1, 6, 10, 11, "r")
    .fill(2, 7, 3, 9, "p")
    .box(3, 2, 6, 5, "g")
    .fill(5, 0, 2, 2, "o")
    .outline()
    .frame(),
  lettuce: g(18, 16)
    .circle(9, 9, 7, "l", undefined, 6)
    .dither(3, 4, 12, 10, "L")
    .vline(9, 4, 10, "i")
    .line(5, 8, 9, 12, "i")
    .line(13, 8, 9, 12, "i")
    .outline()
    .frame(),
  huevo: g(12, 16)
    .circle(6, 8, 5, "i", undefined, 6)
    .recolor(8, 3, 4, 12, "i", "J")
    .px(4, 5, "w")
    .outline()
    .frame(),
  anticucho: g(24, 12)
    .hline(1, 6, 22, "J")
    .circle(6, 6, 3, "R")
    .circle(12, 6, 3, "Q")
    .circle(18, 6, 3, "R")
    .px(6, 4, "T")
    .px(12, 4, "T")
    .px(18, 4, "T")
    .outline()
    .frame(),
  emptyBottle: g(12, 24)
    .fill(4, 0, 4, 7, "v")
    .box(1, 7, 10, 16, "v")
    .dither(2, 8, 8, 14, "V")
    .fill(3, 12, 6, 5, "w")
    .fill(4, 1, 1, 6, "p")
    .outline()
    .frame(),
  hose: g(24, 16)
    .stroke(3, 12, 8, 3, 3, "e")
    .stroke(8, 3, 16, 3, 3, "e")
    .stroke(16, 3, 20, 12, 3, "e")
    .stroke(20, 12, 12, 13, 3, "E")
    .fill(1, 12, 4, 3, "y")
    .outline()
    .frame(),
  siphon: g(26, 24)
    .fill(4, 0, 4, 7, "v")
    .box(1, 7, 10, 16, "v")
    .dither(2, 8, 8, 14, "V")
    .stroke(6, 2, 14, 0, 3, "e")
    .stroke(14, 0, 22, 8, 3, "e")
    .stroke(22, 8, 22, 22, 3, "E")
    .outline()
    .frame(),
  gasoline: g(12, 24)
    .fill(4, 0, 4, 7, "v")
    .box(1, 7, 10, 16, "v")
    .fill(2, 11, 8, 11, "t")
    .dither(2, 11, 8, 11, "T")
    .fill(3, 13, 6, 4, "r")
    .px(5, 14, "y")
    .outline()
    .frame(),
  aguaFlorida: g(14, 26)
    .fill(5, 0, 4, 3, "y")
    .fill(5, 3, 4, 4, "l")
    .polygon(
      [
        [2, 7],
        [12, 7],
        [13, 25],
        [1, 25],
      ],
      "l",
    )
    .dither(2, 8, 10, 16, "e")
    .fill(3, 12, 8, 8, "w")
    .px(6, 14, "p")
    .px(8, 15, "p")
    .px(7, 17, "e")
    .outline()
    .frame(),
  mallet: g(28, 12)
    .stroke(1, 6, 18, 6, 2, "n")
    .circle(22, 6, 4, "w", undefined, 4)
    .recolor(23, 2, 4, 9, "w", "J")
    .outline()
    .frame(),
};
