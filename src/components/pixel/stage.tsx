"use client";

import { type DragEvent, type MouseEvent, useEffect, useRef } from "react";
import type { ItemId } from "@/game/content/items";
import { META } from "@/game/content/meta";
import { type SceneId, scenes } from "@/game/content/scenes";
import { visibleHotspots } from "@/game/engine/reducer";
import type { Progress } from "@/game/engine/state";
import { clampToFloor, spawnPoint, standPoint, step } from "@/game/engine/walk";
import { type Hotspot, type Point, STAGE } from "@/game/types";
import { arrows, artRenderers, follower, player } from "@/pixel/art";
import { backdrops } from "@/pixel/scenes";
import { drawAt, frameAt } from "@/pixel/sprite";
import { items } from "@/pixel/sprites/items";
import { ITEM_MIME } from "./drag";

const WALK_SPEED = 110;
const FOLLOW_SPEED = 100;
const ITEM_LIFT = 28;
/** How far behind the player the companion trots. */
const FOLLOW_GAP = 30;

type Props = {
  progress: Progress;
  /** Input is ignored while dialogs, puzzles or end screens are open. */
  blocked: boolean;
  talking: boolean;
  /** An item is selected, so unmarked spots can take it. */
  holding: boolean;
  onUse: (id: string) => void;
  onUseItem: (item: ItemId, id: string) => void;
};

type Walker = {
  at: Point;
  facing: 1 | -1;
  target: Point | null;
  onArrive: (() => void) | null;
};

const backdropCache = new Map<SceneId, HTMLCanvasElement>();

const bakedBackdrop = (scene: SceneId): HTMLCanvasElement => {
  const hit = backdropCache.get(scene);
  if (hit) return hit;
  const canvas = document.createElement("canvas");
  canvas.width = STAGE.w;
  canvas.height = STAGE.h;
  const ctx = canvas.getContext("2d");
  if (ctx) backdrops[scene].paint(ctx);
  backdropCache.set(scene, canvas);
  return canvas;
};

const percent = (value: number, total: number) => `${(value / total) * 100}%`;

const toStage = (event: MouseEvent<HTMLElement>, box: DOMRect): Point => ({
  x: ((event.clientX - box.left) / box.width) * STAGE.w,
  y: ((event.clientY - box.top) / box.height) * STAGE.h,
});

/** The playable scene: a pixel canvas plus invisible buttons for every hotspot. */
export function Stage({
  progress,
  blocked,
  talking,
  holding,
  onUse,
  onUseItem,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const walker = useRef<Walker>({
    at: spawnPoint(progress.scene, null),
    facing: 1,
    target: null,
    onArrive: null,
  });
  const buddy = useRef<{ at: Point; facing: 1 | -1; moving: boolean } | null>(
    null,
  );
  const live = useRef({ progress, talking });
  live.current.progress = progress;
  live.current.talking = talking;

  const previousScene = useRef<SceneId | null>(null);
  const { scene } = progress;
  const floor = scenes[scene].floor;
  const hotspots = visibleHotspots(progress);

  // Arriving in a scene: appear at the exit that leads back where we came from.
  useEffect(() => {
    const at = spawnPoint(scene, previousScene.current);
    walker.current = {
      at,
      facing: previousScene.current ? 1 : -1,
      target: null,
      onArrive: null,
    };
    if (buddy.current)
      buddy.current = {
        at: { x: at.x - FOLLOW_GAP, y: at.y + 1 },
        facing: 1,
        moving: false,
      };
    previousScene.current = scene;
  }, [scene]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let last = performance.now();
    const start = last;

    const frame = (now: number) => {
      const time = (now - start) / 1000;
      const dt = Math.min(0.25, Math.max(0, now - last) / 1000);
      last = now;
      const { progress: current, talking: speaking } = live.current;
      const me = walker.current;

      if (me.target) {
        const moved = step(me.at, me.target, dt, WALK_SPEED);
        if (moved.at.x !== me.at.x) me.facing = moved.at.x > me.at.x ? 1 : -1;
        me.at = moved.at;
        if (moved.arrived) {
          me.target = null;
          const arrive = me.onArrive;
          me.onArrive = null;
          arrive?.();
        }
      }

      // The companion trails a few steps behind once it joins.
      const companion = current.flags.includes(META.companionFlag);
      if (companion && !buddy.current) {
        buddy.current = {
          at: { x: me.at.x - FOLLOW_GAP, y: me.at.y + 1 },
          facing: me.facing,
          moving: false,
        };
      }
      const cat = companion ? buddy.current : null;
      if (cat) {
        const goal = { x: me.at.x - me.facing * FOLLOW_GAP, y: me.at.y + 1 };
        const far = Math.hypot(goal.x - cat.at.x, goal.y - cat.at.y) > 6;
        cat.moving = far;
        if (far) {
          const moved = step(cat.at, goal, dt, FOLLOW_SPEED);
          if (moved.at.x !== cat.at.x)
            cat.facing = moved.at.x > cat.at.x ? 1 : -1;
          cat.at = moved.at;
        } else {
          cat.facing = me.facing;
        }
      }

      ctx.clearRect(0, 0, STAGE.w, STAGE.h);
      ctx.drawImage(bakedBackdrop(current.scene), 0, 0);
      backdrops[current.scene].ambient?.(ctx, time, current);

      // Painter's algorithm: whatever stands lower on screen is drawn later.
      const drawables = visibleHotspots(current)
        .filter((h) => h.art || h.item)
        // Items usually rest on furniture, so they sort a little further front.
        .map((h) => ({
          y: h.rect.y + h.rect.h + (h.item ? ITEM_LIFT : 0),
          draw: () => drawHotspot(ctx, h, time),
        }));
      const anim = me.target
        ? player.walk
        : speaking
          ? player.talk
          : player.idle;
      drawables.push({
        y: me.at.y,
        draw: () =>
          drawAt(ctx, frameAt(anim, time), me.at.x, me.at.y, me.facing < 0),
      });
      if (cat) {
        drawables.push({
          y: cat.at.y,
          draw: () =>
            cat.moving
              ? drawAt(
                  ctx,
                  frameAt(follower.walk, time),
                  cat.at.x,
                  cat.at.y,
                  cat.facing < 0,
                )
              : drawAt(
                  ctx,
                  frameAt(follower.idle, time),
                  cat.at.x,
                  cat.at.y,
                  cat.facing < 0,
                ),
        });
      }
      for (const d of drawables.sort((a, b) => a.y - b.y)) d.draw();

      // Exits blink, like the arrows in the old Flash adventures.
      if (Math.floor(time * 2) % 2 === 0) {
        for (const h of visibleHotspots(current)) {
          if (!h.arrow) continue;
          const x = h.rect.x + h.rect.w / 2;
          const y = h.rect.y + h.rect.h / 2 + 10;
          drawAt(ctx, arrows[h.arrow], x, y, h.arrow === "left");
        }
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  const walkTo = (target: Point, onArrive: (() => void) | null) => {
    walker.current.target = target;
    walker.current.onArrive = onArrive;
  };

  /** Walk over first, turn to face it, then act. */
  const approach = (hotspot: Hotspot, act: () => void) => {
    const centre = hotspot.rect.x + hotspot.rect.w / 2;
    walkTo(standPoint(hotspot, floor), () => {
      walker.current.facing = centre >= walker.current.at.x ? 1 : -1;
      act();
    });
  };

  const walkToPointer = (event: MouseEvent<HTMLElement>) => {
    const box = rootRef.current?.getBoundingClientRect();
    if (box) walkTo(clampToFloor(toStage(event, box), floor), null);
  };

  const clickHotspot = (
    hotspot: Hotspot,
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    if (blocked) return;
    // An unmarked spot behaves like plain floor unless you are holding something.
    if (hotspot.hidden && !holding) return walkToPointer(event);
    approach(hotspot, () => onUse(hotspot.id));
  };

  const draggedItem = (event: DragEvent) =>
    event.dataTransfer.getData(ITEM_MIME) as ItemId;

  const dropOn = (hotspot: Hotspot, event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const item = draggedItem(event);
    if (blocked || !item) return;
    approach(hotspot, () => onUseItem(item, hotspot.id));
  };

  const allowDrop = (event: DragEvent) => {
    if (event.dataTransfer.types.includes(ITEM_MIME)) event.preventDefault();
  };

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents lint/a11y/noStaticElementInteractions: walking is a pointer nicety; every hotspot is a real button
    <div
      ref={rootRef}
      onClick={(event) =>
        !blocked && event.target === event.currentTarget && walkToPointer(event)
      }
      onDragOver={allowDrop}
      onDrop={(event) => event.preventDefault()}
      className="absolute inset-0 animate-fade-in"
    >
      <canvas
        ref={canvasRef}
        width={STAGE.w}
        height={STAGE.h}
        className="pointer-events-none absolute inset-0 h-full w-full [image-rendering:pixelated]"
      />
      {hotspots.map((hotspot) => (
        <button
          key={hotspot.id}
          type="button"
          aria-label={hotspot.hidden ? undefined : hotspot.label}
          aria-hidden={hotspot.hidden || undefined}
          tabIndex={hotspot.hidden ? -1 : undefined}
          onClick={(event) => clickHotspot(hotspot, event)}
          onDragOver={allowDrop}
          onDrop={(event) => dropOn(hotspot, event)}
          // Only the hand cursor gives things away; unmarked spots don't even get that.
          className={`absolute outline-none focus-visible:ring-2 focus-visible:ring-signal ${hotspot.hidden ? "cursor-default" : "cursor-pointer"}`}
          style={{
            left: percent(hotspot.rect.x, STAGE.w),
            top: percent(hotspot.rect.y, STAGE.h),
            width: percent(hotspot.rect.w, STAGE.w),
            height: percent(hotspot.rect.h, STAGE.h),
          }}
        />
      ))}
    </div>
  );
}

function drawHotspot(
  ctx: CanvasRenderingContext2D,
  hotspot: Hotspot,
  time: number,
) {
  if (hotspot.art) artRenderers[hotspot.art](ctx, hotspot.rect, time);
  if (!hotspot.item) return;
  const { x, y, w, h } = hotspot.rect;
  drawAt(ctx, items[hotspot.item], x + w / 2, y + h);
}
