import { type Grid, grid } from "../builder";
import type { Anim, Frame } from "../sprite";

/* Furniture and set pieces, built from shapes so they stay tidy and editable. */

const anim = (frames: Frame[], fps: number): Anim => ({ frames, fps });

/* ——— Kitchen ——— */

const chicken = (g: Grid, x: number, y: number, turn: number) => {
  g.circle(x, y, 7, "t", undefined, 5).recolor(x - 7, y + 1, 15, 6, "t", "T");
  g.dither(x - 6, y - 4, 12, 4, "q");
  g.circle(x + (turn ? 6 : -6), y + 3, 3, "T", undefined, 2);
  g.px(x + (turn ? 9 : -9), y + 4, "J");
};

const rotisserieFrame = (flame: number): Frame => {
  const g = grid(88, 108);
  // hood and chimney
  g.box(20, 0, 48, 8, "g").box(8, 8, 72, 8, "g").hline(9, 9, 70, "w");
  // steel cabinet with a hot glass window
  g.box(4, 16, 80, 84, "g").fill(5, 17, 78, 2, "w");
  g.box(10, 22, 68, 62, "Q").fill(11, 23, 66, 60, "O");
  g.dither(11, 23, 66, 60, "Q");
  for (let row = 0; row < 3; row++) {
    const y = 34 + row * 18;
    g.hline(12, y, 64, "g");
    for (let i = 0; i < 4; i++)
      chicken(g, 21 + i * 16, y, (i + row + flame) % 2);
  }
  // glass shine
  g.line(16, 26, 26, 24, "i").line(16, 28, 22, 27, "i");
  // the brasa itself
  g.fill(10, 86, 68, 8, "M");
  for (let i = 0; i < 9; i++) {
    const h = 3 + ((i + flame) % 3) * 2;
    g.fill(13 + i * 7, 88 - h, 4, h, (i + flame) % 2 ? "o" : "y");
  }
  g.fill(4, 100, 8, 8, "G").fill(76, 100, 8, 8, "G");
  return g.outline().frame();
};

export const rotisserie = anim(
  [rotisserieFrame(0), rotisserieFrame(1), rotisserieFrame(2)],
  5,
);

const fryerFrame = (bubble: boolean): Frame => {
  const g = grid(46, 56);
  g.box(2, 14, 42, 42, "g").fill(3, 15, 40, 2, "w").fill(3, 40, 40, 1, "G");
  g.box(6, 10, 34, 8, "G").fill(7, 11, 32, 6, "T");
  if (bubble) g.px(12, 12, "q").px(26, 13, "q").px(33, 11, "q");
  else g.px(18, 12, "q").px(30, 14, "q");
  // basket of fries hanging on the edge
  g.box(14, 2, 18, 10, "M").fill(15, 3, 16, 8, "t").dither(15, 3, 16, 8, "q");
  g.stroke(32, 4, 42, 0, 2, "G");
  g.fill(8, 24, 6, 6, "M")
    .px(10, 26, "r")
    .fill(32, 24, 6, 6, "M")
    .px(34, 26, "e");
  return g.outline().frame();
};

export const fryer = anim([fryerFrame(false), fryerFrame(true)], 4);

export const counter: Frame = (() => {
  const g = grid(96, 46);
  g.box(0, 0, 96, 6, "n").hline(1, 1, 94, "u");
  g.box(2, 6, 92, 40, "w");
  for (let y = 8; y < 44; y += 6)
    for (let x = 3 + ((y / 6) % 2) * 3; x < 92; x += 6) g.fill(x, y, 5, 5, "I");
  g.hline(3, 20, 90, "r").hline(3, 21, 90, "y");
  // drawer under the register
  g.box(38, 22, 26, 14, "n").hline(39, 23, 24, "u").fill(49, 28, 4, 2, "q");
  return g.outline().frame();
})();

export const register: Frame = (() => {
  const g = grid(32, 26);
  g.polygon(
    [
      [2, 10],
      [30, 10],
      [30, 25],
      [2, 25],
    ],
    "G",
  );
  g.box(6, 0, 20, 10, "g").fill(8, 2, 16, 6, "E").fill(9, 3, 8, 2, "l");
  for (let r = 0; r < 2; r++)
    for (let c = 0; c < 6; c++)
      g.fill(4 + c * 4, 12 + r * 4, 3, 3, c % 3 ? "J" : "r");
  g.box(4, 20, 24, 5, "g").fill(14, 22, 4, 1, "M");
  return g.outline().frame();
})();

export const ticket: Frame = (() => {
  const g = grid(16, 22);
  g.box(2, 3, 12, 18, "w").fill(3, 19, 10, 1, "J");
  for (const y of [6, 9, 12, 15]) g.hline(4, y, 8, "g");
  g.hline(4, 6, 5, "r");
  g.circle(8, 2, 2, "r").px(8, 1, "p");
  return g.outline().frame();
})();

const tvFrame = (noise: number): Frame => {
  const g = grid(60, 46);
  // wall bracket
  g.fill(26, 36, 8, 10, "M").hline(18, 44, 24, "M");
  g.box(0, 0, 60, 38, "M").fill(1, 1, 58, 2, "G");
  g.box(4, 4, 44, 30, "k").fill(5, 5, 42, 28, "C");
  // Huacosaw on screen
  g.fill(22, 7, 8, 3, "a").fill(20, 9, 12, 4, "d");
  g.circle(26, 21, 9, "a", undefined, 9).recolor(29, 12, 8, 18, "a", "A");
  g.fill(21, 18, 4, 2, "w")
    .fill(28, 18, 4, 2, "w")
    .px(23, 18, "k")
    .px(30, 18, "k");
  g.circle(19, 25, 2, "r").circle(33, 25, 2, "r").hline(23, 27, 6, "d");
  // scanlines and static
  for (let y = 5 + noise; y < 33; y += 3) g.dither(5, y, 42, 1, "c");
  g.fill(51, 6, 5, 5, "G").fill(51, 14, 5, 5, "G").px(53, 8, "r");
  for (let y = 24; y < 34; y += 2) g.hline(51, y, 5, "k");
  return g.outline().frame();
};

export const tv = anim([tvFrame(0), tvFrame(1), tvFrame(2)], 8);

export const menuBoard: Frame = (() => {
  const g = grid(76, 52);
  g.box(0, 0, 76, 52, "n").box(3, 3, 70, 46, "x", "N");
  g.dither(4, 4, 68, 44, "E");
  return g.outline().frame();
})();

export const stove: Frame = (() => {
  const g = grid(60, 52);
  g.box(0, 8, 60, 44, "g").fill(1, 9, 58, 2, "w");
  g.box(4, 20, 52, 26, "G").fill(5, 21, 50, 3, "g").fill(22, 23, 16, 2, "M");
  g.box(10, 28, 40, 14, "M")
    .fill(11, 29, 38, 12, "Z")
    .dither(11, 29, 38, 12, "Q");
  for (const x of [6, 18, 30, 42]) g.box(x, 12, 10, 5, "M").px(x + 4, 14, "b");
  // a pot of something simmering
  g.box(36, 0, 18, 10, "G").fill(37, 1, 16, 3, "e").px(42, 2, "l");
  return g.outline().frame();
})();

export const apron: Frame = (() => {
  const g = grid(26, 46);
  g.fill(11, 0, 4, 3, "G").px(12, 3, "G");
  g.stroke(8, 4, 12, 2, 2, "w").stroke(17, 4, 13, 2, 2, "w");
  g.polygon(
    [
      [6, 6],
      [20, 6],
      [21, 18],
      [24, 44],
      [2, 44],
      [5, 18],
    ],
    "w",
  );
  g.recolor(15, 6, 10, 40, "w", "J");
  g.fill(8, 22, 10, 8, "J").hline(8, 22, 10, "X");
  g.hline(6, 12, 14, "r").hline(6, 13, 14, "r");
  return g.outline().frame();
})();

export const sink: Frame = (() => {
  const g = grid(44, 46);
  g.box(0, 10, 44, 10, "g").fill(4, 11, 36, 4, "z").fill(1, 18, 42, 1, "G");
  g.stroke(30, 10, 30, 2, 2, "g")
    .stroke(30, 2, 22, 2, 2, "g")
    .fill(21, 3, 2, 3, "g");
  // a stack of dirty plates
  for (let i = 0; i < 4; i++)
    g.circle(10, 9 - i * 2, 6, i % 2 ? "w" : "J", undefined, 1);
  g.px(7, 3, "e").px(12, 6, "T");
  g.fill(2, 20, 3, 26, "G").fill(39, 20, 3, 26, "G");
  return g.outline().frame();
})();

export const lettuceBitten: Frame = (() => {
  const g = grid(16, 8);
  g.circle(8, 5, 4, "L", undefined, 2).fill(7, 2, 2, 5, "l");
  return g.outline().frame();
})();

export const fridge: Frame = (() => {
  const g = grid(40, 100);
  g.box(0, 0, 40, 100, "w").recolor(28, 1, 11, 98, "w", "J");
  g.hline(1, 34, 38, "g").fill(32, 12, 3, 14, "g").fill(32, 44, 3, 20, "g");
  // magnets
  g.fill(6, 8, 6, 5, "y").fill(7, 9, 4, 1, "b");
  g.fill(14, 50, 7, 6, "o").px(17, 52, "k");
  g.fill(6, 70, 8, 4, "p");
  g.fill(4, 96, 4, 4, "G").fill(32, 96, 4, 4, "G");
  return g.outline().frame();
})();

export const kitchenDoor: Frame = (() => {
  const g = grid(46, 104);
  g.box(0, 0, 46, 104, "G").box(4, 4, 38, 100, "g");
  g.circle(23, 26, 9, "M").circle(23, 26, 7, "C").line(18, 22, 21, 19, "c");
  g.hline(5, 60, 36, "G").fill(36, 58, 4, 8, "G");
  // the keypad
  g.box(8, 46, 14, 18, "M").fill(9, 47, 12, 3, "E");
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++) g.px(10 + c * 4, 52 + r * 4, "J");
  g.fill(6, 92, 34, 3, "y").dither(6, 92, 34, 3, "k");
  return g.outline().frame();
})();

export const candy: Frame = [
  "k.kkk.k.",
  "kpkwwkpk",
  "kppwppPk",
  "kpkpPkpk",
  "k.kkk.k.",
];

/* ——— Street ——— */

export const polleriaDoor: Frame = (() => {
  const g = grid(50, 100);
  g.box(0, 0, 50, 100, "Q").box(5, 6, 40, 94, "N");
  g.box(8, 10, 16, 88, "C").box(26, 10, 16, 88, "C");
  g.dither(9, 11, 14, 86, "B").dither(27, 11, 14, 86, "B");
  g.line(11, 16, 18, 12, "c").line(29, 16, 36, 12, "c");
  g.fill(20, 52, 2, 10, "y").fill(28, 52, 2, 10, "y");
  return g.outline().frame();
})();

const pumpkin = (g: Grid, x: number, y: number, r: number, lit: boolean) => {
  g.circle(x, y, r, "o", undefined, r - 2).recolor(
    x + 1,
    y - r,
    r,
    r * 2,
    "o",
    "O",
  );
  g.vline(x, y - r + 3, 2 * r - 6, "O").fill(x - 1, y - r, 3, 3, "x");
  const eye = lit ? "q" : "y";
  g.fill(x - r + 3, y - 2, 3, 2, eye).fill(x + r - 5, y - 2, 3, 2, eye);
  g.hline(x - r + 3, y + 3, 2 * r - 5, eye)
    .px(x - 1, y + 2, eye)
    .px(x + 2, y + 4, "O");
};

const pumpkinsFrame = (lit: boolean): Frame => {
  const g = grid(34, 20);
  pumpkin(g, 9, 12, 7, lit);
  pumpkin(g, 24, 13, 6, !lit);
  return g.outline().frame();
};

export const pumpkins = anim([pumpkinsFrame(true), pumpkinsFrame(false)], 2);

export const moto: Frame = (() => {
  const g = grid(80, 46);
  // wheels
  for (const x of [14, 64]) {
    g.circle(x, 36, 9, "M", "k").circle(x, 36, 5, "G").circle(x, 36, 1, "J");
  }
  // pink body: «La Chancha»
  g.polygon(
    [
      [10, 26],
      [24, 18],
      [48, 18],
      [58, 24],
      [66, 30],
      [40, 34],
      [20, 34],
    ],
    "p",
  );
  g.recolor(10, 28, 60, 8, "p", "P").dither(26, 20, 20, 4, "i");
  g.fill(22, 14, 22, 5, "M").hline(23, 14, 20, "G");
  g.stroke(58, 22, 66, 8, 3, "g")
    .stroke(62, 8, 72, 6, 2, "M")
    .fill(68, 12, 6, 5, "y");
  g.stroke(66, 30, 66, 34, 3, "g");
  // a curly pig tail and a snout sticker
  g.px(6, 22, "p").px(5, 21, "p").px(6, 20, "p").px(7, 21, "p");
  g.circle(36, 26, 3, "P").px(35, 26, "k").px(37, 26, "k");
  g.fill(30, 34, 12, 3, "G");
  return g.outline().frame();
})();

export const anticuchoCart: Frame = (() => {
  const g = grid(60, 44);
  g.box(4, 14, 52, 22, "n").hline(5, 15, 50, "u").dither(5, 18, 50, 16, "N");
  g.fill(6, 22, 48, 3, "y").hline(6, 23, 48, "r");
  g.box(8, 6, 44, 9, "M").fill(9, 7, 42, 4, "Q");
  for (let i = 0; i < 5; i++) {
    g.stroke(12 + i * 8, 4, 18 + i * 8, 4, 2, "R").hline(
      10 + i * 8,
      5,
      12,
      "J",
    );
  }
  g.circle(12, 38, 5, "M", "k").circle(48, 38, 5, "M", "k");
  g.circle(12, 38, 2, "G").circle(48, 38, 2, "G");
  return g.outline().frame();
})();

export const coals = anim(
  [
    ["oyo.yo", ".o.yo."],
    ["yoy.oy", "o.oy.o"],
  ],
  6,
);

export const lamp: Frame = (() => {
  const g = grid(24, 160);
  g.fill(10, 20, 4, 136, "M").fill(7, 150, 10, 10, "M").hline(11, 22, 1, "G");
  g.stroke(12, 22, 20, 14, 2, "M")
    .box(14, 12, 10, 6, "M")
    .fill(15, 17, 8, 2, "q");
  return g.outline().frame();
})();

/* ——— Market ——— */

export const stall: Frame = (() => {
  const g = grid(100, 54);
  g.box(0, 14, 100, 40, "n").dither(1, 30, 98, 22, "N");
  // aguayo tablecloth
  g.fill(1, 14, 98, 16, "p");
  const stripes = ["r", "y", "e", "b", "o", "v"];
  stripes.forEach((key, i) => {
    g.hline(1, 16 + i * 2, 98, key);
  });
  for (let x = 4; x < 96; x += 8)
    g.px(x, 28, "w")
      .px(x + 1, 27, "w")
      .px(x + 2, 28, "w");
  // eggs, agua florida and candles on top
  for (const x of [8, 14, 20]) g.circle(x, 11, 2, "w", undefined, 2);
  for (const x of [70, 78])
    g.box(x, 4, 6, 10, "e")
      .fill(x + 1, 8, 4, 3, "w")
      .fill(x + 2, 1, 2, 3, "y");
  g.fill(88, 2, 3, 12, "J").px(89, 0, "o");
  return g.outline().frame();
})();

const cage = (g: Grid, x: number, y: number, cuyColor: string) => {
  g.box(x, y, 34, 26, "N", "D").fill(x + 1, y + 1, 32, 24, "D");
  g.circle(x + 16, y + 17, 7, cuyColor, undefined, 4)
    .px(x + 21, y + 15, "k")
    .px(x + 11, y + 12, "p");
  for (let i = x + 4; i < x + 34; i += 5) g.vline(i, y + 1, 24, "n");
};

export const cuyCages: Frame = (() => {
  const g = grid(76, 66);
  cage(g, 2, 40, "n");
  cage(g, 38, 40, "w");
  cage(g, 20, 14, "u");
  g.box(18, 4, 40, 10, "w").fill(19, 5, 38, 8, "Y");
  return g.outline().frame();
})();

export const herbStall: Frame = (() => {
  const g = grid(86, 100);
  g.fill(2, 0, 4, 100, "N").fill(80, 0, 4, 100, "N").box(0, 0, 86, 10, "Q");
  // hanging herbs and dried frogs
  for (let i = 0; i < 6; i++) {
    const x = 10 + i * 12;
    g.vline(x, 10, 8, "J");
    if (i % 2)
      g.circle(x, 21, 3, "L", undefined, 4).dither(x - 3, 18, 6, 8, "l");
    else
      g.circle(x, 21, 3, "x", undefined, 2)
        .px(x - 3, 24, "x")
        .px(x + 3, 24, "x")
        .px(x - 1, 20, "y");
  }
  // shelves of jars
  for (const y of [40, 62]) {
    g.fill(4, y, 78, 3, "n");
    for (let x = 8; x < 78; x += 10) {
      const key = ["e", "r", "y", "v", "c", "o", "l"][(x + y) % 7];
      g.box(x, y - 10, 7, 10, key).fill(x + 1, y - 9, 2, 3, "i");
    }
  }
  g.box(4, 70, 78, 30, "n").dither(5, 71, 76, 28, "N");
  for (let x = 10; x < 76; x += 6) g.circle(x, 69, 2, (x / 6) % 2 ? "r" : "k");
  return g.outline().frame();
})();

export const trapdoor: Frame = (() => {
  const g = grid(56, 18);
  g.polygon(
    [
      [6, 1],
      [50, 1],
      [55, 17],
      [1, 17],
    ],
    "n",
  );
  for (const x of [14, 28, 42]) g.line(x, 2, x + (x - 28) / 6, 16, "N");
  g.circle(28, 9, 3, "n", "y").circle(28, 9, 1, "n");
  return g.outline().frame();
})();

/* ——— Catacombs ——— */

export const stairsUp: Frame = (() => {
  const g = grid(56, 124);
  g.fill(4, 0, 48, 124, "Z");
  for (let i = 0; i < 10; i++) {
    const y = 120 - i * 12;
    const inset = i * 2;
    g.fill(2 + inset, y - 4, 52 - inset * 2, 4, i % 2 ? "X" : "J").hline(
      2 + inset,
      y - 4,
      52 - inset * 2,
      "w",
    );
  }
  g.fill(0, 0, 4, 124, "G").fill(52, 0, 4, 124, "G");
  return g.outline().frame();
})();

const skull = (g: Grid, x: number, y: number) => {
  g.circle(x, y, 4, "J", undefined, 4).fill(x - 2, y + 3, 5, 2, "J");
  g.fill(x - 2, y - 1, 2, 2, "k")
    .fill(x + 1, y - 1, 2, 2, "k")
    .px(x, y + 2, "k");
};

export const skullPile: Frame = (() => {
  const g = grid(40, 24);
  for (const [x, y] of [
    [6, 18],
    [16, 19],
    [26, 18],
    [34, 19],
    [11, 11],
    [21, 11],
    [30, 11],
    [16, 4],
    [26, 4],
  ])
    skull(g, x, y);
  g.fill(24, 7, 3, 1, "g");
  return g.outline().frame();
})();

export const hole: Frame = (() => {
  const g = grid(30, 24);
  g.circle(15, 13, 12, "X", undefined, 10).circle(15, 14, 8, "Z", undefined, 6);
  skull(g, 3, 4);
  skull(g, 27, 5);
  g.px(13, 14, "y").px(18, 14, "y");
  return g.outline().frame();
})();

export const tunnelMouth: Frame = (() => {
  const g = grid(76, 124);
  g.box(0, 18, 76, 106, "G")
    .circle(38, 40, 30, "Z", undefined, 26)
    .fill(8, 40, 60, 84, "Z");
  for (let y = 22; y < 124; y += 10)
    for (let x = (y % 20) / 2; x < 76; x += 14) g.hline(x, y, 10, "M");
  g.circle(38, 40, 30, "Z", undefined, 26).fill(8, 40, 60, 84, "Z");
  // the old sign
  g.box(18, 0, 40, 14, "n").fill(19, 1, 38, 12, "u");
  return g.outline().frame();
})();

/* ——— Park ——— */

export const fountain: Frame = (() => {
  const g = grid(86, 80);
  g.circle(43, 64, 40, "g", "G", 12).circle(43, 62, 34, "G", undefined, 8);
  g.dither(10, 56, 66, 12, "X");
  for (const [x, y, key] of [
    [30, 62, "p"],
    [46, 64, "y"],
    [56, 60, "e"],
    [38, 66, "o"],
  ] as const)
    g.fill(x, y, 4, 2, key);
  g.fill(38, 20, 10, 40, "g").recolor(44, 20, 4, 40, "g", "G");
  g.circle(43, 20, 14, "g", "G", 5).fill(30, 10, 26, 6, "g");
  g.circle(43, 6, 5, "g", "G").px(42, 4, "w");
  g.fill(4, 72, 78, 8, "G");
  return g.outline().frame();
})();

export const mototaxi: Frame = (() => {
  const g = grid(104, 80);
  for (const [x, r] of [
    [18, 10],
    [70, 10],
    [92, 9],
  ] as const) {
    g.circle(x, 68, r, "M", "k")
      .circle(x, 68, r - 4, "G")
      .circle(x, 68, 1, "J");
  }
  // cabin with its red canopy
  g.box(4, 34, 76, 30, "r").recolor(4, 50, 76, 14, "r", "R");
  g.box(0, 6, 82, 10, "R").fill(1, 7, 80, 3, "r");
  g.fill(4, 16, 3, 20, "M").fill(76, 16, 3, 20, "M");
  g.box(12, 18, 56, 18, "b")
    .fill(13, 19, 54, 16, "Z")
    .dither(13, 19, 54, 16, "B");
  g.fill(14, 44, 54, 4, "y");
  // front: the motorbike part
  g.polygon(
    [
      [80, 40],
      [94, 36],
      [100, 56],
      [82, 60],
    ],
    "r",
  );
  g.stroke(92, 36, 98, 22, 3, "g").fill(96, 18, 6, 4, "M");
  g.fill(96, 40, 5, 4, "q");
  return g.outline().frame();
})();

export const bench: Frame = (() => {
  const g = grid(64, 40);
  for (const y of [4, 10, 22]) g.box(2, y, 60, 5, "n").hline(3, y + 1, 58, "u");
  g.fill(6, 4, 4, 36, "M").fill(54, 4, 4, 36, "M").fill(6, 26, 52, 2, "M");
  return g.outline().frame();
})();

/* ——— Cemetery gate ——— */

const gateFrame = (open: boolean): Frame => {
  const g = grid(116, 140);
  g.box(0, 20, 12, 120, "g").box(104, 20, 12, 120, "g");
  g.box(-2, 12, 16, 10, "G").box(102, 12, 16, 10, "G");
  g.circle(6, 8, 5, "g", "k").circle(110, 8, 5, "g", "k");
  const bars = (x0: number, x1: number) => {
    for (let x = x0; x <= x1; x += 6) {
      g.fill(x, 36, 2, 102, "M");
      g.polygon(
        [
          [x - 1, 36],
          [x + 1, 30],
          [x + 3, 36],
        ],
        "M",
      );
    }
    g.fill(x0, 50, x1 - x0 + 2, 3, "M").fill(x0, 120, x1 - x0 + 2, 3, "M");
  };
  if (open) {
    bars(14, 26);
    bars(88, 100);
  } else {
    bars(14, 100);
    // chain and padlock
    g.stroke(46, 74, 70, 82, 2, "g").stroke(46, 82, 70, 74, 2, "g");
    g.box(53, 80, 10, 10, "y").fill(55, 76, 6, 4, "g").px(57, 85, "k");
  }
  return g.outline().frame();
};

export const gate: Frame = gateFrame(false);
export const openGate: Frame = gateFrame(true);

export const nest: Frame = (() => {
  const g = grid(48, 34);
  g.circle(24, 26, 22, "n", undefined, 7).dither(4, 20, 40, 14, "N");
  for (let i = 0; i < 9; i++)
    g.line(4 + i * 5, 20 + (i % 3), 10 + i * 4, 30 - (i % 2) * 4, "j");
  g.px(30, 22, "q").px(31, 22, "w").px(30, 23, "y");
  return g.outline().frame();
})();

/* ——— Cemetery ——— */

export const tombstone = (w: number, h: number): Frame => {
  const g = grid(w, h);
  g.circle(w / 2, w / 2, w / 2 - 1, "g", undefined, w / 2 - 1).fill(
    1,
    w / 2,
    w - 2,
    h - w / 2 - 4,
    "g",
  );
  g.recolor(w - 8, 0, 8, h, "g", "G").dither(1, h - 14, w - 2, 10, "X");
  g.fill(0, h - 5, w, 5, "G");
  return g.outline().frame();
};

export const shovel: Frame = (() => {
  const g = grid(14, 44);
  g.stroke(4, 2, 9, 30, 2, "n").polygon(
    [
      [5, 30],
      [13, 28],
      [13, 42],
      [8, 43],
    ],
    "g",
  );
  return g.outline().frame();
})();

export const plaque: Frame = (() => {
  const g = grid(40, 48);
  g.box(2, 0, 36, 36, "G").box(4, 2, 32, 32, "X");
  g.fill(0, 36, 40, 12, "g").recolor(30, 36, 10, 12, "g", "G");
  return g.outline().frame();
})();

export const mausoleum: Frame = (() => {
  const g = grid(136, 160);
  // base and steps
  g.box(0, 146, 136, 14, "g").box(6, 140, 124, 8, "J");
  // walls and columns
  g.box(12, 54, 112, 88, "J").dither(13, 55, 110, 86, "X");
  for (const x of [16, 34, 94, 112])
    g.box(x, 52, 10, 90, "w").recolor(x + 6, 52, 4, 90, "w", "J");
  // pediment
  g.polygon(
    [
      [4, 54],
      [68, 22],
      [132, 54],
    ],
    "J",
  );
  g.polygon(
    [
      [16, 50],
      [68, 28],
      [120, 50],
    ],
    "X",
  );
  g.box(4, 52, 128, 6, "w");
  // the angel with no nose
  g.circle(68, 12, 5, "J", undefined, 5).fill(65, 17, 7, 10, "J");
  g.polygon(
    [
      [58, 12],
      [64, 18],
      [62, 26],
    ],
    "w",
  );
  g.polygon(
    [
      [78, 12],
      [72, 18],
      [74, 26],
    ],
    "w",
  );
  g.px(66, 11, "G").px(70, 11, "G");
  // iron door with a keypad
  g.box(50, 76, 36, 64, "M").fill(51, 77, 34, 62, "G");
  g.vline(68, 77, 62, "M").fill(64, 104, 2, 6, "y").fill(70, 104, 2, 6, "y");
  g.box(88, 96, 10, 14, "M").fill(89, 97, 8, 3, "E");
  for (let r = 0; r < 3; r++) g.hline(90, 102 + r * 3, 6, "J");
  // name plate above the door
  g.box(46, 62, 44, 10, "G").fill(47, 63, 42, 8, "X");
  return g.outline().frame();
})();

/* ——— Crypt ——— */

const candlesFrame = (t: number): Frame => {
  const g = grid(48, 26);
  for (const [x, h, i] of [
    [6, 12, 0],
    [15, 18, 1],
    [24, 10, 2],
    [33, 16, 0],
    [42, 13, 1],
  ] as const) {
    g.box(x - 2, 26 - h, 5, h, "w").fill(x - 1, 26 - h, 1, h, "i");
    const flicker = (i + t) % 2;
    g.fill(x - 1, 26 - h - 4 - flicker, 3, 3 + flicker, "o").px(
      x,
      26 - h - 3,
      "q",
    );
  }
  return g.outline().frame();
};

export const candles = anim([candlesFrame(0), candlesFrame(1)], 5);

export const nicho: Frame = (() => {
  const g = grid(60, 46);
  g.box(0, 0, 60, 40, "g").box(4, 4, 52, 32, "J").dither(5, 5, 50, 30, "w");
  g.box(14, 8, 32, 10, "X");
  // a vase of plastic flowers
  g.box(24, 30, 12, 16, "G");
  for (const [x, key] of [
    [22, "r"],
    [28, "y"],
    [34, "p"],
    [26, "o"],
    [32, "e"],
  ] as const)
    g.circle(x, 25 - (x % 3), 2, key);
  return g.outline().frame();
})();

export const shelf: Frame = (() => {
  const g = grid(44, 8);
  g.box(0, 0, 44, 5, "n").hline(1, 1, 42, "u");
  g.polygon(
    [
      [4, 5],
      [10, 5],
      [6, 8],
    ],
    "N",
  );
  g.polygon(
    [
      [34, 5],
      [40, 5],
      [38, 8],
    ],
    "N",
  );
  return g.frame();
})();

/* ——— Navigation arrows ——— */

export const arrow: Frame = (() => {
  const g = grid(16, 16);
  g.polygon(
    [
      [1, 5],
      [8, 5],
      [8, 1],
      [15, 8],
      [8, 15],
      [8, 11],
      [1, 11],
    ],
    "y",
  );
  g.recolor(1, 9, 15, 6, "y", "o");
  return g.outline().frame();
})();

export const arrowUp: Frame = (() => {
  const g = grid(16, 16);
  g.polygon(
    [
      [5, 15],
      [5, 8],
      [1, 8],
      [8, 1],
      [15, 8],
      [11, 8],
      [11, 15],
    ],
    "y",
  );
  g.recolor(9, 1, 7, 15, "y", "o");
  return g.outline().frame();
})();

export const arrowDown: Frame = [...arrowUp].reverse();

/* ——— Icons for the end screens ——— */

export const pumpkinIcon: Frame = (() => {
  const g = grid(22, 20);
  pumpkin(g, 11, 11, 9, true);
  return g.outline().frame();
})();

export const skullIcon: Frame = (() => {
  const g = grid(22, 22);
  g.circle(11, 9, 8, "J", undefined, 8).fill(6, 15, 11, 5, "J");
  g.recolor(14, 1, 8, 20, "J", "X");
  g.fill(6, 8, 4, 4, "k").fill(12, 8, 4, 4, "k").fill(10, 13, 2, 2, "k");
  for (let x = 7; x < 16; x += 2) g.vline(x, 17, 3, "k");
  return g.outline().frame();
})();
