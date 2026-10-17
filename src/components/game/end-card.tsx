import type { ReactNode } from "react";
import { PixelSprite } from "@/components/pixel/pixel-sprite";
import type { CharacterId } from "@/game/content/characters";
import { bodies } from "@/pixel/art";
import { pumpkinIcon, skullIcon } from "@/pixel/sprites/props";

type Props = {
  tone: "death" | "good" | "meh";
  kicker: string;
  title: string;
  text: string;
  footer?: string;
  /** A hint that points the way without giving the answer. */
  tip?: string;
  cast?: CharacterId[];
  /** Custom artwork in place of the cast or the default icon. */
  art?: ReactNode;
  actions: ReactNode;
};

const tones = {
  death: { art: skullIcon, color: "text-blood", bg: "bg-[#1a0306]/90" },
  good: { art: pumpkinIcon, color: "text-signal", bg: "bg-[#0d1a12]/90" },
  meh: { art: pumpkinIcon, color: "text-pumpkin", bg: "bg-[#1a1022]/90" },
};

/** Shared screen for deaths and endings. */
export function EndCard({
  tone,
  kicker,
  title,
  text,
  footer,
  tip,
  cast,
  art: custom,
  actions,
}: Props) {
  const { art, color, bg } = tones[tone];
  return (
    <div
      className={`absolute inset-0 z-20 flex animate-fade-in flex-col items-center justify-center gap-[1cqw] p-[4%] text-center ${bg}`}
    >
      {custom ? (
        custom
      ) : cast ? (
        <div className="flex items-end gap-[0.8cqw]">
          {cast.map((character) => (
            <PixelSprite
              key={character}
              art={bodies[character]}
              unit="0.22cqw"
            />
          ))}
        </div>
      ) : (
        <PixelSprite art={art} unit="0.4cqw" className="animate-flicker" />
      )}
      <p className={`font-display text-[5cqw] leading-none ${color}`}>
        {kicker}
      </p>
      <h2 className="font-display text-[2.6cqw] text-soft">{title}</h2>
      <p className="max-w-[60%] text-[1.7cqw] text-white/80">{text}</p>
      {footer && <p className="text-[1.4cqw] text-soft/70 italic">{footer}</p>}
      {tip && (
        <p className="max-w-[64%] rounded-lg border-2 border-signal/40 bg-black/40 px-[1.2cqw] py-[0.6cqw] text-[1.4cqw] text-signal">
          Consejo: {tip}
        </p>
      )}
      {/* Delayed so a click meant for the last dialog can't hit these. */}
      <div className="mt-[1cqw] flex animate-appear gap-[1cqw]">{actions}</div>
    </div>
  );
}

export function CardButton({
  children,
  onClick,
  primary = false,
}: {
  children: ReactNode;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-xl border-4 border-outline px-[2cqw] py-[0.8cqw] font-display text-[2cqw] shadow-[0_0.3em_0_#3a2318] transition active:translate-y-[0.2em] active:shadow-none ${
        primary ? "bg-signal text-ink" : "bg-[#fff8e9] text-ink"
      }`}
    >
      {children}
    </button>
  );
}
