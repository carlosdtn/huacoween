"use client";

import { useEffect, useState } from "react";
import { LuX } from "react-icons/lu";
import { PADS } from "@/audio/drums";
import { Portrait } from "@/components/pixel/portrait";
import { type PuzzleId, puzzles } from "@/game/content/puzzles";

type Props = {
  puzzle: PuzzleId;
  failed: boolean;
  onSubmit: (answer: string) => void;
  onClose: () => void;
};

const BEAT_MS = 380;
const COLORS = ["bg-blood", "bg-pumpkin", "bg-signal", "bg-soft"];

/** Simon-style call and response: listen to the pattern, then play it back. */
export function RhythmPad({ puzzle, failed, onSubmit, onClose }: Props) {
  const { prompt, answer } = puzzles[puzzle];
  const [played, setPlayed] = useState("");
  const [lit, setLit] = useState<number | null>(null);
  const [listening, setListening] = useState(false);

  const flash = (pad: number) => {
    PADS[pad].hit();
    setLit(pad);
    setTimeout(() => setLit(null), BEAT_MS / 2);
  };

  const demo = () => {
    setPlayed("");
    setListening(true);
    [...answer].forEach((pad, i) => {
      setTimeout(() => flash(Number(pad)), (i + 1) * BEAT_MS);
    });
    setTimeout(() => setListening(false), (answer.length + 1) * BEAT_MS);
  };

  // Plays the pattern once when the cajón opens.
  // biome-ignore lint/correctness/useExhaustiveDependencies: run only on open
  useEffect(demo, []);

  const hit = (pad: number) => {
    if (listening) return;
    flash(pad);
    const next = played + pad;
    if (!answer.startsWith(next)) {
      setPlayed("");
      onSubmit(next);
      return;
    }
    setPlayed(next);
    if (next.length === answer.length)
      setTimeout(() => onSubmit(next), BEAT_MS);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const pad = ["1", "2", "3", "4"].indexOf(event.key);
      if (pad >= 0) hit(pad);
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60">
      <div className="relative flex w-[56%] animate-rise flex-col gap-[1.2cqw] rounded-2xl border-4 border-outline bg-[#2b1d36] p-[1.6cqw]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-[0.6cqw] right-[0.6cqw] cursor-pointer text-[2cqw] text-white/60 hover:text-white"
        >
          <LuX />
        </button>
        <div className="flex items-center gap-[1cqw] pr-[2cqw]">
          <Portrait character="cheche" className="h-[6cqw] w-[6cqw] shrink-0" />
          <p className="text-[1.5cqw] text-soft">{prompt}</p>
        </div>
        <div className="flex justify-center gap-[0.6cqw]">
          {[...answer].map((_, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: beat slots have no identity
              key={i}
              className={`h-[1.2cqw] w-[1.2cqw] rounded-full ${i < played.length ? "bg-emerald-400" : failed ? "bg-blood/60" : "bg-white/15"}`}
            />
          ))}
        </div>
        <div className="grid grid-cols-4 gap-[1cqw]">
          {PADS.map((pad, i) => (
            <button
              key={pad.label}
              type="button"
              disabled={listening}
              onClick={() => hit(i)}
              className={`aspect-square cursor-pointer rounded-xl border-4 border-outline font-display text-[2.4cqw] text-ink shadow-[0_0.3em_0_#3a2318] transition active:translate-y-[0.2em] active:shadow-none disabled:cursor-wait ${COLORS[i]} ${lit === i ? "scale-110 brightness-150" : ""}`}
            >
              {pad.label}
              <span className="block font-sans text-[1.1cqw] opacity-60">
                {i + 1}
              </span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={demo}
          disabled={listening}
          className="cursor-pointer self-center rounded-lg bg-black/30 px-[1.4cqw] py-[0.5cqw] text-[1.4cqw] text-soft hover:bg-black/50 disabled:opacity-50"
        >
          {listening ? "Escucha…" : "Escuchar otra vez"}
        </button>
      </div>
    </div>
  );
}
