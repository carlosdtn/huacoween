import { ItemSprite } from "@/components/pixel/item-sprite";
import { type ItemId, items } from "@/game/content/items";

/** Mount with a key per turn so the animation replays. */
export function ItemToast({ items: gained }: { items: ItemId[] }) {
  if (gained.length === 0) return null;
  return (
    <div className="pointer-events-none absolute top-[4%] left-1/2 z-30 flex animate-toast flex-col gap-[0.5cqw]">
      {gained.map((item) => (
        <div
          key={item}
          className="flex items-center gap-[0.8cqw] rounded-full border-4 border-outline bg-[#fff8e9] py-[0.4cqw] pr-[1.4cqw] pl-[0.6cqw] text-[1.6cqw] font-bold text-ink shadow-[0_0.3em_0_#3a2318]"
        >
          <ItemSprite item={item} unit="0.14cqw" />+ {items[item].name}
        </div>
      ))}
    </div>
  );
}
