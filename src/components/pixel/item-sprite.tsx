import { type ItemId, items as itemDefs } from "@/game/content/items";
import { icons } from "@/pixel/sprites/icons";
import { PixelSprite } from "./pixel-sprite";

/** Items keep one pixel scale everywhere, so a coin never looks as big as a laptop. */
export function ItemSprite({
  item,
  unit = "0.5cqw",
  className = "",
}: {
  item: ItemId;
  unit?: string;
  className?: string;
}) {
  return (
    <PixelSprite
      art={icons[item]}
      unit={unit}
      label={itemDefs[item].name}
      className={className}
    />
  );
}
