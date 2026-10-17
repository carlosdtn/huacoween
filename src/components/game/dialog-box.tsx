"use client";

import { useEffect, useState } from "react";
import { blip, hush, speak } from "@/audio/voice";
import { Portrait } from "@/components/pixel/portrait";
import { characters } from "@/game/content/characters";
import { META } from "@/game/content/meta";
import type { DialogLine } from "@/game/types";

const CHARS_PER_TICK = 2;
const TICK_MS = 28;

/** Mount with a key per line so the typewriter restarts. */
export function DialogBox({
  line,
  onNext,
}: {
  line: DialogLine;
  onNext: () => void;
}) {
  const [shown, setShown] = useState(0);
  const done = shown >= line.text.length;

  useEffect(() => {
    if (line.speaker === META.villain) speak(line.text);
    return hush;
  }, [line]);

  useEffect(() => {
    if (done) return;
    const timer = setTimeout(() => {
      setShown(shown + CHARS_PER_TICK);
      if (line.speaker !== META.villain) blip(line.speaker);
    }, TICK_MS);
    return () => clearTimeout(timer);
  }, [shown, done, line.speaker]);

  // First press finishes the line, second press moves on.
  const press = () => (done ? onNext() : setShown(line.text.length));

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== " " && event.key !== "Enter") return;
      event.preventDefault();
      press();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <button
      type="button"
      onClick={press}
      className="absolute inset-x-[3%] bottom-[4%] z-20 flex animate-rise cursor-pointer items-center gap-[2cqw] rounded-2xl border-4 border-outline bg-[#fff8e9] p-[1.5cqw] text-left text-ink shadow-[0_0.6em_0_#3a2318]"
    >
      <Portrait
        character={line.speaker}
        className={`h-[9cqw] w-[9cqw] shrink-0 ${done ? "" : "animate-talk"}`}
      />
      <span className="flex-1">
        <span className="block font-display text-[2cqw] text-blood">
          {characters[line.speaker].name}
        </span>
        <span className="block text-[1.9cqw] leading-snug font-semibold">
          {line.text.slice(0, shown)}
          <span className="invisible">{line.text.slice(shown)}</span>
        </span>
      </span>
      <span
        className={`self-end text-[1.6cqw] ${done ? "animate-pulse" : "opacity-0"}`}
      >
        ▶
      </span>
    </button>
  );
}
