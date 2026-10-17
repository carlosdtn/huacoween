import { LuLightbulb } from "react-icons/lu";
import { hudButton } from "./hud-button";
import { SoundToggle } from "./sound-toggle";

export function Hud({ onHint }: { onHint?: () => void }) {
  return (
    <div className="absolute top-[2%] right-[1.5%] z-10 flex gap-[0.6cqw]">
      {onHint && (
        <button
          type="button"
          onClick={onHint}
          aria-label="Pista"
          title="Pista"
          className={hudButton}
        >
          <LuLightbulb />
        </button>
      )}
      <SoundToggle />
    </div>
  );
}
