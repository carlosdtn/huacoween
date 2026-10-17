"use client";

import { type RefObject, useEffect, useRef } from "react";
import { ItemSprite } from "@/components/pixel/item-sprite";
import type { ItemId } from "@/game/content/items";

/** The selected item follows the pointer over the stage, like in the old Flash games. */
export function ItemCursor({
  item,
  stage,
}: {
  item: ItemId;
  stage: RefObject<HTMLDivElement | null>;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const area = stage.current;
    if (!area) return;
    const move = (event: PointerEvent) => {
      const box = area.getBoundingClientRect();
      ref.current?.style.setProperty(
        "transform",
        `translate(${event.clientX - box.left}px, ${event.clientY - box.top}px)`,
      );
      ref.current?.style.setProperty("opacity", "1");
    };
    const leave = () => ref.current?.style.setProperty("opacity", "0");
    area.addEventListener("pointermove", move);
    area.addEventListener("pointerleave", leave);
    return () => {
      area.removeEventListener("pointermove", move);
      area.removeEventListener("pointerleave", leave);
    };
  }, [stage]);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute top-0 left-0 z-10 opacity-0"
    >
      <ItemSprite
        item={item}
        unit="0.2cqw"
        className="translate-x-[20%] translate-y-[20%] drop-shadow-[0_0_0.3em_#000]"
      />
    </div>
  );
}
