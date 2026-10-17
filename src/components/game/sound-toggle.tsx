"use client";

import { useEffect, useState } from "react";
import { LuVolume2, LuVolumeX } from "react-icons/lu";
import { setMuted } from "@/audio/synth";
import { META } from "@/game/content/meta";
import { hudButton } from "./hud-button";

const KEY = `${META.storageKey}:muted`;

export function SoundToggle() {
  const [muted, setMutedState] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY) === "1";
      setMutedState(stored);
      setMuted(stored);
    } catch {}
  }, []);

  const toggle = () => {
    const next = !muted;
    setMutedState(next);
    setMuted(next);
    try {
      localStorage.setItem(KEY, next ? "1" : "0");
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={muted ? "Activar sonido" : "Silenciar"}
      className={hudButton}
    >
      {muted ? <LuVolumeX /> : <LuVolume2 />}
    </button>
  );
}
