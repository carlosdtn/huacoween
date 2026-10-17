"use client";

import { useEffect, useState } from "react";
import { LuDelete, LuX } from "react-icons/lu";
import { type PuzzleId, puzzles } from "@/game/content/puzzles";

type Props = {
  puzzle: PuzzleId;
  failed: boolean;
  onSubmit: (code: string) => void;
  onClose: () => void;
};

const KEYS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "del",
  "0",
  "ok",
] as const;

export function Keypad({ puzzle, failed, onSubmit, onClose }: Props) {
  const { prompt, answer } = puzzles[puzzle];
  const [code, setCode] = useState("");
  const [attempt, setAttempt] = useState(0);

  const press = (key: (typeof KEYS)[number]) => {
    if (key === "del") return setCode((c) => c.slice(0, -1));
    if (key === "ok") {
      onSubmit(code);
      setAttempt((a) => a + 1);
      return setCode("");
    }
    setCode((c) => (c.length < answer.length ? c + key : c));
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (/^\d$/.test(event.key)) press(event.key as (typeof KEYS)[number]);
      if (event.key === "Backspace") press("del");
      if (event.key === "Enter") {
        // Keeps Enter from also clicking whatever hotspot still has focus.
        event.preventDefault();
        press("ok");
      }
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
      <div
        key={attempt}
        className={`relative w-[34%] animate-rise rounded-2xl border-4 border-outline bg-[#2b1d36] p-[1.6cqw] ${failed && attempt > 0 ? "animate-shake" : ""}`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-[0.6cqw] right-[0.6cqw] cursor-pointer text-[2cqw] text-white/60 hover:text-white"
        >
          <LuX />
        </button>
        <p className="mb-[1cqw] pr-[2cqw] text-[1.4cqw] text-soft">{prompt}</p>
        <output
          className={`mb-[1cqw] block rounded-lg bg-black py-[0.6cqw] text-center font-mono text-[3cqw] tracking-[0.5em] ${failed ? "text-blood" : "text-emerald-400"}`}
        >
          {code.padEnd(answer.length, "_")}
        </output>
        <div className="grid grid-cols-3 gap-[0.6cqw]">
          {KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => press(key)}
              className={`flex cursor-pointer items-center justify-center rounded-lg border-b-4 py-[0.6cqw] font-mono text-[2cqw] font-bold active:translate-y-[2px] active:border-b-2 ${
                key === "ok"
                  ? "border-emerald-900 bg-emerald-500 text-black"
                  : "border-black/50 bg-[#4a3a57] text-white"
              }`}
            >
              {key === "del" ? <LuDelete /> : key === "ok" ? "OK" : key}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
