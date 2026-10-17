"use client";

import type { Anim, Frame } from "@/pixel/sprite";
import * as characters from "@/pixel/sprites/characters";
import { icons } from "@/pixel/sprites/icons";
import { items } from "@/pixel/sprites/items";
import * as props from "@/pixel/sprites/props";
import { PixelSprite } from "./pixel-sprite";

const isArt = (value: unknown): value is Frame | Anim =>
  Array.isArray(value) ||
  (typeof value === "object" && value !== null && "frames" in value);

const entries = (group: Record<string, unknown>) =>
  Object.entries(group).flatMap(([name, value]) => {
    if (isArt(value)) return [[name, value] as const];
    if (value && typeof value === "object") {
      return Object.entries(value)
        .filter(([, v]) => isArt(v))
        .map(([key, v]) => [`${name}.${key}`, v as Frame | Anim] as const);
    }
    return [];
  });

const groups = { characters, props, items, icons };

export function SpriteGallery() {
  return (
    <div className="space-y-8">
      {Object.entries(groups).map(([group, mod]) => (
        <section key={group}>
          <h2 className="mb-3 text-xl font-bold text-pumpkin">{group}</h2>
          <div className="flex flex-wrap items-end gap-6">
            {entries(mod).map(([name, art]) => (
              <figure
                key={name}
                className="flex flex-col items-center gap-2 rounded bg-[#2a2140] p-3"
              >
                <PixelSprite art={art} scale={10} label={name} />
                <figcaption className="font-mono text-xs text-soft">
                  {name}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
