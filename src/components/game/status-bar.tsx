import { type ItemId, items } from "@/game/content/items";

type Props = {
  title: string;
  selected: ItemId | null;
  combining: boolean;
  /** Inventory item under the pointer: its name and a joke about it. */
  hovered: ItemId | null;
};

/** The classic point-and-click verb line, without giving away what is clickable. */
export function StatusBar({ title, selected, combining, hovered }: Props) {
  const name = selected ? items[selected].name : null;
  const line = combining
    ? name
      ? `Combinar ${name} con…`
      : "Combinar: elige el primer objeto"
    : name
      ? `Usar ${name} con…`
      : hovered
        ? `${items[hovered].name}: ${items[hovered].description}`
        : "";
  return (
    <div className="flex items-center justify-between gap-4 rounded-t-2xl border-x-4 border-t-4 border-outline bg-[#1a1022] px-[1.4cqw] py-[0.7cqw] text-[1.5cqw]">
      <span className="font-display tracking-wide text-pumpkin">{title}</span>
      <span className="truncate text-soft">{line}</span>
    </div>
  );
}
