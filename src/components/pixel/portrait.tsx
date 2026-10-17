import { type CharacterId, characters } from "@/game/content/characters";
import { portraits } from "@/pixel/art";
import { PixelSprite } from "./pixel-sprite";

export function Portrait({
  character,
  className = "",
}: {
  character: CharacterId;
  className?: string;
}) {
  return (
    <PixelSprite
      art={portraits[character]}
      scale={0}
      label={characters[character].name}
      className={`object-contain ${className}`}
    />
  );
}
