import type { ArtId } from "@/game/content/art";
import type { CharacterId } from "@/game/content/characters";
import type { VillainId } from "@/game/content/deaths";
import type { Rect } from "@/game/types";
import { drawText, textWidth } from "./font";
import type { Ctx } from "./paint";
import { fill } from "./paint";
import { PALETTE } from "./palette";
import { type Anim, drawAt, type Frame, frameAt, size } from "./sprite";
import * as cast from "./sprites/characters";
import * as props from "./sprites/props";

export type Renderer = (ctx: Ctx, rect: Rect, time: number) => void;

const animOf = (art: Frame | Anim): Anim =>
  "frames" in art ? art : { frames: [art], fps: 1 };

/** Draws art standing on the bottom-centre of its hotspot. */
const sprite =
  (art: Frame | Anim, flip = false): Renderer =>
  (ctx, rect, time) =>
    drawAt(
      ctx,
      frameAt(animOf(art), time),
      rect.x + rect.w / 2,
      rect.y + rect.h,
      flip,
    );

/** Ghosts float and let the scene show through them. */
const ghostly =
  (art: Frame | Anim, flip = false): Renderer =>
  (ctx, rect, time) => {
    ctx.globalAlpha = 0.8;
    const bob = Math.round(Math.sin(time * 2.5) * 3) - 3;
    sprite(art, flip)(ctx, { ...rect, y: rect.y + bob }, time);
    ctx.globalAlpha = 1;
  };

/** Centred lines of text, top at `y`. */
const lines = (
  ctx: Ctx,
  texts: string[],
  cx: number,
  y: number,
  key: keyof typeof PALETTE,
  scale = 1,
) => {
  texts.forEach((text, i) => {
    drawText(
      ctx,
      text,
      Math.round(cx - textWidth(text, scale) / 2),
      y + i * 7 * scale,
      PALETTE[key],
      scale,
    );
  });
};

const tomb =
  (texts: string[], extra?: Renderer): Renderer =>
  (ctx, rect, time) => {
    extra?.(ctx, rect, time);
    drawAt(
      ctx,
      props.tombstone(rect.w, rect.h),
      rect.x + rect.w / 2,
      rect.y + rect.h,
    );
    lines(ctx, texts, rect.x + rect.w / 2 - 2, rect.y + 16, "M");
  };

export const artRenderers: Record<ArtId, Renderer> = {
  // kitchen
  rotisserie: sprite(props.rotisserie),
  fryer: sprite(props.fryer),
  counter: sprite(props.counter),
  register: sprite(props.register),
  ticket: sprite(props.ticket),
  tv: sprite(props.tv),
  menuBoard: (ctx, rect, time) => {
    sprite(props.menuBoard)(ctx, rect, time);
    const cx = rect.x + rect.w / 2;
    lines(ctx, ["CARTA"], cx, rect.y + 7, "y");
    lines(
      ctx,
      ["1/4 POLLO 19.90", "1/2 POLLO 36.00", "PAPAS 8.00"],
      cx,
      rect.y + 17,
      "w",
    );
    lines(ctx, ["NO HAY CUY"], cx, rect.y + 40, "r");
  },
  stove: sprite(props.stove),
  apron: sprite(props.apron),
  sink: sprite(props.sink),
  cuyEyes: sprite(cast.cuyEyes),
  lettuceBitten: sprite(props.lettuceBitten),
  fridge: sprite(props.fridge),
  kitchenDoor: sprite(props.kitchenDoor),
  candy: sprite(props.candy),
  // street
  polleriaDoor: sprite(props.polleriaDoor),
  pumpkins: sprite(props.pumpkins),
  moto: sprite(props.moto),
  pocha: (ctx, rect, time) => {
    const cart = size(props.anticuchoCart);
    const cartX = rect.x + rect.w - cart.w / 2;
    // smoke from the grill
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < 6; i++) {
      const t = (time * 0.5 + i / 6) % 1;
      fill(
        ctx,
        cartX - 16 + i * 6 + Math.sin(t * 8) * 3,
        rect.y + rect.h - cart.h - t * 40,
        4,
        3,
        "I",
      );
    }
    ctx.globalAlpha = 1;
    ghostly(cast.pochaAnim)(ctx, { ...rect, w: 30, y: rect.y - 4 }, time);
    drawAt(ctx, props.anticuchoCart, cartX, rect.y + rect.h);
    drawAt(
      ctx,
      frameAt(props.coals, time),
      cartX - 6,
      rect.y + rect.h - cart.h + 12,
    );
    drawAt(
      ctx,
      frameAt(props.coals, time + 0.2),
      cartX + 10,
      rect.y + rect.h - cart.h + 12,
    );
  },
  lampVulture: (ctx, rect, time) => {
    sprite(props.lamp)(ctx, rect, time);
    drawAt(
      ctx,
      frameAt(cast.gallinazo, time),
      rect.x + rect.w / 2 + 6,
      rect.y + 20,
    );
  },
  alley: (ctx, rect, time) => {
    const { x, y, w, h } = rect;
    fill(ctx, x + 4, y + 10, w - 8, h - 10, "Z");
    fill(ctx, x + 10, y + 4, w - 20, 6, "Z");
    // the Tunche watches; its eyes come and go
    if (Math.floor(time * 0.8) % 4 !== 3) {
      fill(ctx, x + w / 2 - 6, y + 40, 3, 2, "y");
      fill(ctx, x + w / 2 + 3, y + 40, 3, 2, "y");
    }
  },
  // market
  lucha: (ctx, rect, time) => {
    const stall = size(props.stall);
    drawAt(
      ctx,
      frameAt(cast.luchaAnim, time),
      rect.x + rect.w / 2,
      rect.y + rect.h - stall.h + 18,
    );
    drawAt(ctx, props.stall, rect.x + rect.w / 2, rect.y + rect.h);
    fill(ctx, rect.x + 14, rect.y - 4, 72, 12, "k");
    fill(ctx, rect.x + 15, rect.y - 3, 70, 10, "p");
    lines(ctx, ["LIMPIAS Y AMARRES"], rect.x + rect.w / 2, rect.y - 1, "w");
  },
  cuyCages: sprite(props.cuyCages),
  herbStall: sprite(props.herbStall),
  trapdoor: sprite(props.trapdoor),
  // catacombs
  stairsUp: sprite(props.stairsUp),
  skullPile: sprite(props.skullPile),
  muqui: sprite(cast.muquiAnim, true),
  hole: sprite(props.hole),
  tunnelMouth: (ctx, rect, time) => {
    sprite(props.tunnelMouth)(ctx, rect, time);
    lines(ctx, ["CALLAO >"], rect.x + rect.w / 2, rect.y + 4, "k");
  },
  // park
  fountain: sprite(props.fountain),
  chulla: sprite(cast.chullaAnim, true),
  mototaxi: (ctx, rect, time) => {
    sprite(props.mototaxi)(ctx, rect, time);
    lines(ctx, ["DIOS ES MI COPILOTO"], rect.x + 42, rect.y + 6, "y");
  },
  bench: sprite(props.bench),
  // cemetery
  band: sprite(cast.band),
  gate: sprite(props.gate),
  openGate: sprite(props.openGate),
  nest: (ctx, rect, time) => {
    drawAt(ctx, frameAt(cast.gallinazo, time), rect.x + 16, rect.y + 18, true);
    sprite(props.nest)(ctx, rect, time);
  },
  tombDelivery: tomb(["AQUI", "YACE UN", "DELIVERY", "LLEGO", "TARDE"]),
  tombHuaquero: tomb(["PANCRACIO", "HUAQUERO", "PERDON", "PEPE"], (ctx, rect) =>
    drawAt(ctx, props.shovel, rect.x + rect.w - 2, rect.y + rect.h),
  ),
  condenado: ghostly(cast.condenadoAnim),
  plaque: (ctx, rect, time) => {
    sprite(props.plaque)(ctx, rect, time);
    lines(
      ctx,
      ["EUSEBIO", "QUISPE", "1931", "1999"],
      rect.x + rect.w / 2,
      rect.y + 5,
      "D",
    );
  },
  mausoleum: (ctx, rect, time) => {
    sprite(props.mausoleum)(ctx, rect, time);
    lines(ctx, ["QUISPE"], rect.x + rect.w / 2, rect.y + 64, "D");
  },
  // crypt
  candles: sprite(props.candles),
  huacosaw: sprite(cast.huacosaw, true),
  pepe: (ctx, rect, time) => {
    drawAt(ctx, props.shelf, rect.x + rect.w / 2, rect.y + rect.h + 8);
    drawAt(ctx, cast.pepe, rect.x + rect.w / 2, rect.y + rect.h + 1);
    void time;
  },
  nicho: (ctx, rect, time) => {
    sprite(props.nicho)(ctx, rect, time);
    lines(ctx, ["EUSEBIO"], rect.x + rect.w / 2, rect.y + 10, "D");
  },
};

export const portraits: Record<CharacterId, Frame> = {
  tito: cast.titoPortrait,
  huacosaw: cast.huacosawPortrait,
  pepe: cast.pepe.slice(0, 40),
  chicharron: cast.chicharronPortrait,
  lucha: cast.luchaPortrait,
  pocha: cast.pochaPortrait,
  tunche: cast.tunchePortrait,
  muqui: cast.muquiPortrait,
  chullachaqui: cast.chullaPortrait,
  cheche: cast.chechePortrait,
  condenado: cast.condenadoPortrait,
  eusebio: cast.eusebioPortrait,
};

/** Whole-body art for curtain calls. */
export const bodies: Record<CharacterId, Frame | Anim> = {
  tito: cast.tito.idle,
  huacosaw: cast.huacosaw,
  pepe: cast.pepe,
  chicharron: cast.chicharron,
  lucha: cast.luchaAnim,
  pocha: cast.pochaAnim,
  tunche: cast.tuncheAnim,
  muqui: cast.muquiAnim,
  chullachaqui: cast.chullaAnim,
  cheche: cast.band,
  condenado: cast.condenadoAnim,
  eusebio: cast.eusebioFrame,
};

/** Villains as they appear on the death screen, laughing at the player. */
export const villains: Record<VillainId, Frame | Anim> = {
  huacosaw: cast.huacosaw,
  tunche: cast.tuncheAnim,
  chullachaqui: cast.chullaAnim,
  muqui: cast.muquiAnim,
  gallinazo: cast.gallinazo,
  condenado: cast.condenadoAnim,
  bats: cast.bats,
};

export const knockedOut = cast.titoKnockedOut;

export const player = cast.tito;
export const follower = { walk: cast.chicharronWalk, idle: cast.chicharron };
export const arrows = {
  left: props.arrow,
  right: props.arrow,
  up: props.arrowUp,
  down: props.arrowDown,
};
