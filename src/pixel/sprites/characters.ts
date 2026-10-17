import { type Grid, grid } from "../builder";
import { type Anim, type Frame, lift, rotate } from "../sprite";

/*
 * The cast, drawn with shapes on a 480×270 stage: every character gets two or
 * three tones of shading and an automatic dark outline.
 */

/* Tito — delivery rider for Rapidito: red cap, orange jacket, teal backpack. */

type Legs = "stand" | "stride" | "pass";

const titoLegs = (g: Grid, legs: Legs) => {
  if (legs === "stand") {
    g.fill(12, 38, 5, 13, "b").fill(18, 38, 5, 13, "b").vline(17, 38, 13, "B");
    g.vline(12, 40, 10, "B");
    g.fill(10, 50, 8, 3, "w").fill(18, 50, 9, 3, "w");
    g.hline(10, 52, 8, "g").hline(18, 52, 9, "g");
    return;
  }
  if (legs === "stride") {
    g.stroke(14, 40, 9, 49, 5, "B").stroke(20, 40, 24, 49, 5, "b");
    g.fill(4, 50, 8, 3, "g").fill(22, 50, 9, 3, "w");
    g.hline(22, 52, 9, "g");
    return;
  }
  g.stroke(15, 40, 13, 49, 5, "B").stroke(19, 40, 19, 49, 5, "b");
  g.fill(9, 50, 8, 3, "g").fill(17, 50, 9, 3, "w");
  g.hline(17, 52, 9, "g");
};

const titoFrame = ({
  legs = "stand" as Legs,
  blink = false,
  talk = false,
} = {}): Frame => {
  const g = grid(36, 56);
  // backpack behind the body
  g.box(1, 18, 13, 20, "C", "C")
    .fill(2, 19, 11, 2, "c")
    .fill(2, 36, 11, 1, "M");
  g.fill(4, 25, 6, 6, "y").fill(5, 26, 4, 4, "o").px(6, 27, "w").px(7, 28, "w");
  titoLegs(g, legs);
  // jacket
  g.polygon(
    [
      [10, 25],
      [13, 21],
      [23, 21],
      [26, 25],
      [26, 39],
      [10, 39],
    ],
    "o",
  );
  g.fill(10, 25, 4, 14, "O").hline(10, 31, 16, "y").hline(10, 32, 16, "q");
  g.vline(19, 22, 17, "O").fill(21, 26, 3, 3, "w").px(22, 27, "o");
  g.vline(13, 22, 9, "M");
  // front arm and hand
  g.stroke(24, 24, 27, 35, 4, "o").stroke(24, 24, 25, 30, 2, "O");
  g.circle(27, 37, 2, "s").px(26, 38, "S");
  // neck and head
  g.fill(16, 19, 5, 3, "S");
  g.circle(18, 13, 7, "s", undefined, 7);
  g.fill(11, 9, 4, 9, "h").px(12, 15, "S").px(13, 14, "S");
  g.recolor(11, 15, 5, 6, "s", "S");
  // cap with the visor forward
  g.circle(17, 7, 8, "r", undefined, 4).fill(9, 8, 17, 2, "r");
  g.fill(10, 3, 6, 2, "R").fill(11, 9, 14, 1, "R");
  g.fill(24, 9, 7, 2, "R").hline(24, 11, 7, "k");
  g.px(16, 4, "w").px(17, 4, "w");
  // face
  if (blink) g.hline(19, 14, 2, "k").hline(23, 14, 2, "k");
  else
    g.fill(19, 13, 2, 2, "k")
      .fill(23, 13, 2, 2, "k")
      .px(19, 13, "w")
      .px(23, 13, "w");
  g.hline(18, 12, 3, "h").hline(23, 12, 2, "h");
  g.px(25, 15, "S").px(25, 16, "S");
  if (talk) g.fill(20, 17, 4, 2, "R").hline(20, 17, 4, "k");
  else g.hline(20, 18, 4, "R").px(24, 17, "R");
  return g.outline().frame();
};

const titoStand = titoFrame();

export const tito = {
  idle: {
    frames: [titoStand, titoStand, titoStand, titoFrame({ blink: true })],
    fps: 2,
  },
  walk: {
    frames: [
      titoFrame({ legs: "stride" }),
      lift(titoFrame({ legs: "pass" })),
      titoFrame({ legs: "stride" }),
      lift(titoFrame({ legs: "pass" })),
    ],
    fps: 8,
  },
  talk: { frames: [titoStand, titoFrame({ talk: true })], fps: 6 },
} satisfies Record<string, Anim>;

export const titoPortrait: Frame = titoStand
  .slice(0, 24)
  .map((row) => row.slice(6, 34));

export const titoKnockedOut: Frame = rotate(
  rotate(rotate(titoFrame({ blink: true }))),
);

/* Chicharrón — a cuy who has escaped the menu three Halloweens in a row. */

const cuy = ({ step = 0, blink = false, sniff = false } = {}): Frame => {
  const g = grid(26, 18);
  g.circle(11, 10, 9, "n", undefined, 5);
  g.circle(6, 9, 4, "w", undefined, 4).fill(3, 11, 7, 3, "w");
  g.recolor(2, 12, 20, 4, "n", "N").recolor(2, 13, 10, 3, "w", "J");
  g.fill(8, 5, 6, 2, "u").px(10, 4, "u").px(12, 4, "u");
  g.circle(19, 9, 4, "n", undefined, 4).fill(18, 6, 3, 7, "w");
  g.fill(16, 4, 3, 2, "p").px(17, 3, "P");
  if (blink) g.hline(20, 8, 2, "k");
  else g.fill(20, 7, 2, 2, "k").px(20, 7, "w");
  g.fill(23, sniff ? 9 : 10, 2, 2, "p");
  const feet: [number, number][] =
    step === 0
      ? [
          [5, 15],
          [15, 15],
        ]
      : step === 1
        ? [
            [3, 15],
            [17, 15],
          ]
        : [
            [7, 15],
            [13, 15],
          ];
  for (const [x, y] of feet) g.fill(x, y, 3, 2, "S");
  return g.outline().frame();
};

export const chicharron: Anim = {
  frames: [cuy(), cuy({ sniff: true }), cuy(), cuy({ blink: true })],
  fps: 3,
};

export const chicharronWalk: Anim = {
  frames: [cuy({ step: 1 }), lift(cuy({ step: 2 }), 2)],
  fps: 8,
};

export const chicharronPortrait: Frame = cuy().map((row) => row.slice(12));

export const cuyEyes: Anim = {
  frames: [
    ["..yy......yy..", ".yqy......yqy.", "..yy......yy.."],
    ["..............", ".kyk......kyk.", ".............."],
    ["..yy......yy..", ".yqy......yqy.", "..yy......yy.."],
    ["..yy......yy..", ".yqy......yqy.", "..yy......yy.."],
  ],
  fps: 2,
};

/* Huacosaw — a cursed Moche portrait vessel with spiral cheeks, on a tricycle. */

const huacoHead = (g: Grid, x: number, y: number, cursed: boolean) => {
  // stirrup spout
  g.stroke(x + 9, y + 15, x + 9, y + 6, 4, "a");
  g.stroke(x + 23, y + 15, x + 23, y + 6, 4, "a");
  g.stroke(x + 9, y + 5, x + 23, y + 5, 4, "a");
  g.fill(x + 14, y, 4, 5, "a").hline(x + 14, y, 4, "A");
  g.fill(x + 11, y + 8, 10, 6, ".");
  // the head itself
  g.circle(x + 16, y + 30, 15, "a", undefined, 15);
  g.recolor(x + 22, y + 16, 12, 30, "a", "A");
  g.dither(x + 26, y + 18, 6, 26, "d");
  // painted headdress band
  g.fill(x + 3, y + 18, 27, 6, "d");
  for (let i = 0; i < 6; i++) g.fill(x + 5 + i * 4, y + 20, 2, 2, "i");
  // ear flares
  g.circle(x + 2, y + 31, 3, "i").px(x + 2, y + 31, "d");
  g.circle(x + 30, y + 31, 3, "J").px(x + 30, y + 31, "d");
  // brows, eyes, nose and lips
  g.hline(x + 7, y + 26, 7, "d").hline(x + 19, y + 26, 7, "d");
  g.fill(x + 8, y + 28, 6, 3, "w").fill(x + 19, y + 28, 6, 3, "w");
  g.fill(cursed ? x + 11 : x + 10, y + 28, 2, 3, "k");
  g.fill(cursed ? x + 22 : x + 21, y + 28, 2, 3, "k");
  g.fill(x + 15, y + 30, 3, 7, "A").hline(x + 14, y + 37, 5, "d");
  g.fill(x + 11, y + 40, 11, 2, "d").hline(x + 12, y + 42, 9, "Q");
  if (cursed) {
    // spiral cheeks, a nod to a certain puppet
    for (const cx of [x + 6, x + 26]) {
      g.circle(cx, y + 36, 3, "r");
      g.px(cx, y + 36, "a")
        .px(cx + 1, y + 36, "a")
        .px(cx, y + 35, "a");
      g.px(cx - 1, y + 37, "R");
    }
  } else {
    g.hline(x + 9, y + 29, 4, "k").hline(x + 20, y + 29, 4, "k");
    g.fill(x + 8, y + 28, 6, 1, "a").fill(x + 19, y + 28, 6, 1, "a");
    g.fill(x + 8, y + 30, 6, 1, "a").fill(x + 19, y + 30, 6, 1, "a");
    g.circle(x + 6, y + 36, 2, "p").circle(x + 26, y + 36, 2, "p");
  }
  // a little clay base
  g.fill(x + 9, y + 45, 15, 3, "A").hline(x + 9, y + 47, 15, "d");
};

const huacosawFrame = (spin: boolean, look: boolean): Frame => {
  const g = grid(64, 80);
  // tricycle: big front wheel, two back wheels, red frame
  g.stroke(14, 66, 46, 66, 3, "r").stroke(44, 66, 50, 46, 3, "r");
  g.stroke(46, 46, 54, 44, 2, "g").fill(52, 42, 5, 3, "M");
  g.fill(12, 58, 22, 4, "R").hline(12, 58, 22, "r");
  g.circle(50, 70, 8, "G", "k").circle(50, 70, 5, "M").circle(50, 70, 1, "g");
  if (spin) g.line(45, 70, 55, 70, "g").line(50, 65, 50, 75, "g");
  else g.line(46, 66, 54, 74, "g").line(46, 74, 54, 66, "g");
  g.circle(12, 73, 5, "G", "k").circle(12, 73, 2, "M");
  g.fill(38, spin ? 66 : 70, 5, 2, "M");
  // the huaco rides on the seat
  huacoHead(g, 8 + (look ? 1 : 0), 10, true);
  // tiny clay arms on the handlebar
  g.stroke(38, 46, 52, 44, 3, "a").circle(52, 44, 2, "A");
  // a pumpkin bucket for trick-or-treating
  g.circle(6, 55, 5, "o", undefined, 4)
    .fill(3, 52, 7, 1, "O")
    .fill(4, 49, 1, 3, "k");
  g.hline(4, 49, 6, "k").fill(4, 55, 2, 1, "k").fill(8, 55, 2, 1, "k");
  return g.outline().frame();
};

export const huacosaw: Anim = {
  frames: [
    huacosawFrame(false, false),
    huacosawFrame(true, false),
    huacosawFrame(false, true),
    huacosawFrame(true, true),
  ],
  fps: 3,
};

export const huacosawPortrait: Frame = huacosaw.frames[0]
  .slice(8, 60)
  .map((row) => row.slice(6, 44));

const pepeFrame = (): Frame => {
  const g = grid(36, 52);
  huacoHead(g, 1, 2, false);
  return g.outline().frame();
};

export const pepe: Frame = pepeFrame();

/* A skeleton musician, reused for the whole Banda Los Difuntos. */

const skeleton = (
  g: Grid,
  x: number,
  y: number,
  vest: string,
  arms: "trumpet" | "drum" | "tuba",
  beat: boolean,
) => {
  // legs
  g.stroke(x + 5, y + 34, x + 4, y + 52, 2, "J").stroke(
    x + 11,
    y + 34,
    x + 12,
    y + 52,
    2,
    "J",
  );
  g.fill(x + 1, y + 52, 6, 2, "M").fill(x + 10, y + 52, 6, 2, "M");
  // band vest over the ribs
  g.fill(x + 2, y + 18, 13, 16, vest).hline(x + 2, y + 25, 13, "y");
  g.vline(x + 8, y + 18, 16, "J")
    .hline(x + 5, y + 21, 7, "J")
    .hline(x + 5, y + 29, 7, "J");
  // skull with a bandleader hat
  g.circle(x + 8, y + 10, 6, "J", undefined, 6).recolor(
    x + 10,
    y + 4,
    6,
    12,
    "J",
    "X",
  );
  g.fill(x + 4, y + 9, 3, 3, "k")
    .fill(x + 10, y + 9, 3, 3, "k")
    .px(x + 8, y + 13, "k");
  g.hline(x + 5, y + 15, 7, "k")
    .px(x + 6, y + 15, "J")
    .px(x + 8, y + 15, "J")
    .px(x + 10, y + 15, "J");
  g.fill(x + 2, y + 2, 13, 2, "N")
    .fill(x + 4, y - 1, 9, 3, "N")
    .hline(x + 4, y + 1, 9, "r");
  const raise = beat ? -2 : 0;
  if (arms === "trumpet") {
    g.stroke(x + 14, y + 20, x + 20, y + 15 + raise, 2, "J");
    g.stroke(x + 12, y + 14 + raise, x + 26, y + 12 + raise, 2, "y").circle(
      x + 27,
      y + 12 + raise,
      3,
      "y",
      "O",
    );
  } else if (arms === "drum") {
    g.circle(x + 8, y + 33, 9, "r", "R", 7)
      .fill(x + 5, y + 27, 7, 13, "w")
      .vline(x + 8, y + 27, 13, "g");
    g.stroke(x + 3, y + 21, x - 2, y + 28 + raise, 2, "J").stroke(
      x + 14,
      y + 21,
      x + 20,
      y + 24 + raise,
      2,
      "J",
    );
  } else {
    g.circle(x + 15, y + 28, 7, "y", "O").circle(x + 15, y + 28, 3, "O");
    g.stroke(x + 13, y + 21, x + 15, y + 8 + raise, 3, "y").stroke(
      x + 3,
      y + 22,
      x + 10,
      y + 28,
      2,
      "J",
    );
  }
};

const bandFrame = (beat: boolean): Frame => {
  const g = grid(124, 80);
  skeleton(g, 6, 24, "R", "trumpet", beat);
  skeleton(g, 50, 22, "B", "drum", !beat);
  skeleton(g, 92, 24, "R", "tuba", beat);
  // music notes when the band plays
  if (beat)
    g.fill(40, 8, 2, 6, "q").fill(42, 8, 3, 2, "q").fill(39, 13, 3, 2, "q");
  else g.fill(84, 6, 2, 6, "q").fill(86, 6, 3, 2, "q").fill(83, 11, 3, 2, "q");
  return g.outline().frame();
};

export const band: Anim = {
  frames: [bandFrame(false), bandFrame(true)],
  fps: 3,
};

export const chechePortrait: Frame = band.frames[0]
  .slice(18, 50)
  .map((row) => row.slice(48, 72));

/* Hermana Lucha — curandera, bowler hat, braids and a striped lliclla. */

const lucha = (blink: boolean): Frame => {
  const g = grid(40, 60);
  // braids behind the shawl
  g.stroke(10, 16, 9, 44, 3, "h").stroke(29, 16, 30, 44, 3, "h");
  g.fill(7, 44, 4, 3, "r").fill(29, 44, 4, 3, "r");
  // skirt and blouse
  g.polygon(
    [
      [8, 40],
      [32, 40],
      [36, 59],
      [4, 59],
    ],
    "v",
  );
  g.hline(5, 54, 31, "p").hline(5, 56, 31, "y");
  g.fill(12, 24, 16, 18, "w");
  // lliclla shawl with stripes
  g.polygon(
    [
      [6, 26],
      [14, 21],
      [26, 21],
      [34, 26],
      [32, 40],
      [8, 40],
    ],
    "p",
  );
  for (const [y, key] of [
    [28, "r"],
    [31, "y"],
    [34, "e"],
    [37, "b"],
  ] as const)
    g.recolor(6, y, 30, 1, "p", key);
  g.fill(18, 24, 4, 3, "y");
  // face
  g.circle(20, 15, 7, "s", undefined, 7).recolor(23, 9, 6, 14, "s", "S");
  g.fill(13, 10, 14, 3, "h");
  if (blink) g.hline(16, 15, 2, "k").hline(22, 15, 2, "k");
  else g.fill(16, 14, 2, 2, "k").fill(22, 14, 2, 2, "k");
  g.px(20, 17, "S").hline(18, 19, 4, "R");
  // bowler hat
  g.circle(20, 6, 6, "G", undefined, 4)
    .fill(11, 8, 18, 2, "G")
    .hline(14, 7, 12, "r");
  g.px(17, 3, "g");
  return g.outline().frame();
};

export const luchaAnim: Anim = {
  frames: [lucha(false), lucha(false), lucha(false), lucha(true)],
  fps: 2,
};

export const luchaPortrait: Frame = lucha(false).slice(0, 30);

/* Doña Pocha — a ghost anticuchera, pale and kind, with a hair bun. */

const pocha = (wave: boolean): Frame => {
  const g = grid(30, 52);
  // a wispy tail instead of feet
  g.polygon(
    [
      [6, 30],
      [24, 30],
      [22, 44],
      [17, 50],
      [14, 44],
      [10, 49],
    ],
    "z",
  );
  g.fill(7, 22, 16, 14, "I").fill(9, 26, 12, 12, "w").hline(9, 30, 12, "z");
  g.stroke(22, 24, wave ? 28 : 26, wave ? 16 : 30, 3, "I");
  g.circle(15, 13, 7, "I", undefined, 7).recolor(18, 6, 6, 14, "I", "z");
  g.circle(15, 5, 4, "z").fill(9, 7, 13, 3, "z");
  g.fill(11, 12, 2, 3, "B").fill(17, 12, 2, 3, "B").hline(12, 17, 5, "B");
  return g.outline("B").frame();
};

export const pochaAnim: Anim = { frames: [pocha(false), pocha(true)], fps: 2 };

export const pochaPortrait: Frame = pocha(false).slice(0, 24);

/* The Muqui — a pale, bearded mine goblin with a helmet lamp. */

const muqui = (chew: boolean): Frame => {
  const g = grid(30, 46);
  g.fill(9, 38, 4, 6, "M").fill(17, 38, 4, 6, "M");
  g.polygon(
    [
      [5, 22],
      [25, 22],
      [27, 39],
      [3, 39],
    ],
    "r",
  );
  g.hline(4, 30, 23, "y").hline(4, 33, 23, "R");
  // long beard over the poncho
  g.polygon(
    [
      [8, 17],
      [22, 17],
      [19, 34],
      [15, 37],
      [11, 34],
    ],
    "Y",
  );
  g.dither(9, 20, 12, 14, "q");
  g.circle(15, 12, 7, "i", undefined, 6).recolor(18, 6, 6, 12, "i", "J");
  g.fill(11, 11, 2, 2, "k").fill(17, 11, 2, 2, "k");
  g.fill(13, chew ? 16 : 17, 4, 1, "Q");
  // helmet and lamp
  g.circle(15, 6, 8, "y", undefined, 4).fill(6, 7, 18, 2, "O");
  g.fill(13, 1, 5, 4, "q").px(15, 2, "w");
  // pickaxe
  g.stroke(26, 18, 26, 40, 2, "n").stroke(21, 18, 29, 15, 2, "g");
  return g.outline().frame();
};

export const muquiAnim: Anim = {
  frames: [muqui(false), muqui(true), muqui(false), muqui(false)],
  fps: 4,
};

export const muquiPortrait: Frame = muqui(false).slice(0, 24);

/* The Chullachaqui disguised as Tito's mother. One foot is tiny, the other a peg. */

const chulla = (beckon: boolean): Frame => {
  const g = grid(32, 66);
  // the giveaway: a tiny foot and a wooden peg
  g.stroke(13, 48, 13, 62, 3, "S").fill(11, 62, 4, 2, "n");
  g.stroke(19, 48, 20, 63, 2, "N").px(20, 64, "N");
  // dress and apron
  g.polygon(
    [
      [9, 24],
      [23, 24],
      [27, 50],
      [5, 50],
    ],
    "P",
  );
  g.fill(10, 30, 12, 18, "w").dither(10, 30, 12, 18, "J");
  g.hline(10, 34, 12, "p").hline(10, 40, 12, "p");
  g.stroke(9, 26, 6, 40, 3, "P").circle(6, 42, 2, "s");
  g.stroke(23, 26, beckon ? 30 : 27, beckon ? 18 : 36, 3, "P").circle(
    beckon ? 30 : 27,
    beckon ? 16 : 38,
    2,
    "s",
  );
  // face, curls and a smile that is a bit too wide
  g.circle(16, 15, 7, "s", undefined, 8).recolor(19, 8, 6, 16, "s", "S");
  for (const [cx, cy] of [
    [10, 9],
    [15, 6],
    [20, 7],
    [23, 11],
    [9, 14],
  ])
    g.circle(cx, cy, 3, "h");
  g.fill(13, 15, 2, 2, "k").fill(19, 15, 2, 2, "y");
  g.hline(12, 20, 9, "R").px(11, 19, "R").px(21, 19, "R");
  return g.outline().frame();
};

export const chullaAnim: Anim = {
  frames: [chulla(false), chulla(true)],
  fps: 2,
};

export const chullaPortrait: Frame = chulla(false).slice(0, 26);

/* The Tunche — a hunched bird-shadow that whistles in the dark. */

const tunche = (open: boolean): Frame => {
  const g = grid(40, 50);
  g.polygon(
    open
      ? [
          [2, 16],
          [20, 10],
          [38, 16],
          [32, 40],
          [26, 48],
          [14, 48],
          [8, 40],
        ]
      : [
          [10, 14],
          [20, 10],
          [30, 14],
          [30, 40],
          [26, 48],
          [14, 48],
          [10, 40],
        ],
    "K",
  );
  g.dither(4, 16, 32, 30, "V");
  g.circle(20, 11, 6, "M").polygon(
    [
      [24, 10],
      [33, 13],
      [24, 14],
    ],
    "X",
  );
  g.fill(17, 9, 2, 2, "y").fill(21, 9, 2, 2, "y");
  return g.outline().frame();
};

export const tuncheAnim: Anim = {
  frames: [tunche(false), tunche(true)],
  fps: 3,
};

export const tunchePortrait: Frame = tunche(false).slice(0, 24);

/* A condenado — a wandering soul in a ragged shroud, dragging chains. */

const condenado = (sway: boolean): Frame => {
  const g = grid(40, 74);
  g.polygon(
    [
      [12, 18],
      [28, 18],
      [34, 62],
      [30, 72],
      [26, 64],
      [20, 72],
      [15, 64],
      [9, 72],
      [6, 62],
    ],
    "I",
  );
  g.recolor(22, 18, 14, 56, "I", "z");
  g.circle(20, 12, 8, "I", undefined, 9).recolor(23, 4, 8, 18, "I", "z");
  g.fill(15, 10, 3, 4, "k").fill(22, 10, 3, 4, "k").fill(18, 17, 4, 3, "k");
  // chains
  for (let i = 0; i < 6; i++) {
    const x = (sway ? 4 : 6) + i * 5;
    g.circle(x, 46 + (i % 2), 2, "g", "G");
  }
  return g.outline("B").frame();
};

export const condenadoAnim: Anim = {
  frames: [condenado(false), condenado(true)],
  fps: 2,
};

export const condenadoPortrait: Frame = condenado(false).slice(0, 26);

/* Don Eusebio — an old ghost in his Sunday suit, still waiting for his chicken. */

const eusebio = (): Frame => {
  const g = grid(32, 60);
  g.polygon(
    [
      [8, 22],
      [24, 22],
      [26, 48],
      [22, 58],
      [16, 52],
      [10, 58],
      [6, 48],
    ],
    "z",
  );
  g.fill(14, 22, 4, 14, "I").vline(16, 24, 10, "r");
  g.stroke(25, 26, 28, 40, 3, "z").stroke(28, 40, 28, 58, 2, "X");
  g.circle(16, 14, 7, "I", undefined, 7).recolor(19, 7, 6, 15, "I", "z");
  g.fill(12, 13, 2, 2, "B").fill(18, 13, 2, 2, "B");
  g.fill(12, 17, 9, 2, "w").px(16, 18, "I");
  g.fill(7, 6, 18, 2, "G").fill(10, 1, 12, 5, "G").hline(10, 5, 12, "M");
  return g.outline("B").frame();
};

export const eusebioFrame: Frame = eusebio();

export const eusebioPortrait: Frame = eusebio().slice(0, 26);

/* A gallinazo, Lima's black vulture. */

const vulture = (wings: boolean): Frame => {
  const g = grid(30, 26);
  if (wings)
    g.polygon(
      [
        [1, 6],
        [12, 10],
        [18, 10],
        [29, 6],
        [24, 18],
        [6, 18],
      ],
      "K",
    );
  g.circle(14, 15, 7, "k", undefined, 6).dither(9, 11, 10, 9, "M");
  g.stroke(19, 9, 22, 5, 3, "G").circle(23, 5, 3, "G").px(24, 4, "w");
  g.fill(25, 5, 3, 2, "J").px(27, 7, "X");
  g.fill(10, 21, 2, 4, "X").fill(16, 21, 2, 4, "X");
  return g.outline("Z").frame();
};

export const gallinazo: Anim = {
  frames: [vulture(false), vulture(false), vulture(true)],
  fps: 3,
};

export const gallinazoStill: Frame = vulture(false);

/* Bats for the tunnel to the Callao. */

export const bats: Anim = {
  frames: [
    grid(34, 18)
      .polygon(
        [
          [1, 2],
          [10, 8],
          [17, 6],
          [24, 8],
          [33, 2],
          [28, 14],
          [17, 11],
          [6, 14],
        ],
        "K",
      )
      .circle(17, 9, 3, "k")
      .px(16, 8, "r")
      .px(18, 8, "r")
      .frame(),
    grid(34, 18)
      .polygon(
        [
          [4, 14],
          [10, 8],
          [17, 6],
          [24, 8],
          [30, 14],
          [24, 12],
          [17, 13],
          [10, 12],
        ],
        "K",
      )
      .circle(17, 9, 3, "k")
      .px(16, 8, "r")
      .px(18, 8, "r")
      .frame(),
  ],
  fps: 6,
};
