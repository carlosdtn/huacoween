import type { DragEvent } from "react";
import { ITEM_MIME } from "@/components/pixel/drag";
import { ItemSprite } from "@/components/pixel/item-sprite";
import { type ItemId, items } from "@/game/content/items";

type Props = {
  inventory: ItemId[];
  selected: ItemId | null;
  combining: boolean;
  onSelect: (item: ItemId) => void;
  onCombine: (a: ItemId, b: ItemId) => void;
  onToggleCombine: () => void;
  onHover: (item: ItemId | null) => void;
};

const SLOT_IDS = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10"];

/** Click to select, drag onto the scene to use, drag onto another item to combine. */
export function Inventory({
  inventory,
  selected,
  combining,
  onSelect,
  onCombine,
  onToggleCombine,
  onHover,
}: Props) {
  const dropOn = (target: ItemId) => (event: DragEvent) => {
    event.preventDefault();
    const dragged = event.dataTransfer.getData(ITEM_MIME) as ItemId;
    if (dragged && dragged !== target) onCombine(dragged, target);
  };

  return (
    <div className="flex items-stretch gap-[0.8cqw] rounded-b-2xl border-x-4 border-b-4 border-outline bg-[#1a1022] p-[0.8cqw]">
      <button
        type="button"
        aria-pressed={combining}
        onClick={onToggleCombine}
        className={`w-[11cqw] shrink-0 cursor-pointer rounded-xl border-2 font-display text-[1.3cqw] leading-tight transition ${
          combining
            ? "border-signal bg-signal text-ink"
            : "border-white/15 bg-black/30 text-soft hover:border-white/40"
        }`}
      >
        Combinar
      </button>
      <ul className="grid flex-1 grid-cols-10 gap-[0.6cqw]">
        {inventory.map((item) => {
          const active = item === selected;
          return (
            <li key={item}>
              <button
                type="button"
                draggable
                title={items[item].name}
                aria-pressed={active}
                onClick={() => onSelect(item)}
                onMouseEnter={() => onHover(item)}
                onMouseLeave={() => onHover(null)}
                onFocus={() => onHover(item)}
                onBlur={() => onHover(null)}
                onDragStart={(event) => {
                  event.dataTransfer.setData(ITEM_MIME, item);
                  event.dataTransfer.effectAllowed = "move";
                }}
                onDragOver={(event) => event.preventDefault()}
                onDrop={dropOn(item)}
                className={`flex aspect-square w-full cursor-grab items-center justify-center rounded-xl border-2 transition active:cursor-grabbing ${
                  active
                    ? "border-signal bg-signal/20 shadow-[0_0_1em_rgba(255,193,7,0.5)]"
                    : "border-white/10 bg-black/30 hover:border-white/40"
                }`}
              >
                <ItemSprite item={item} unit="0.24cqw" />
              </button>
            </li>
          );
        })}
        {SLOT_IDS.slice(inventory.length).map((slot) => (
          <li
            key={slot}
            className="aspect-square rounded-xl border-2 border-dashed border-white/5"
          />
        ))}
      </ul>
    </div>
  );
}
