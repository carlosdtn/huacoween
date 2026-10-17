"use client";

import { useEffect, useReducer } from "react";
import { sfx } from "@/audio/sfx";
import { gameReducer } from "@/game/engine/reducer";
import { clearProgress, saveProgress } from "@/game/engine/save";
import { initialState, progressOf } from "@/game/engine/state";

export function useGame() {
  const [state, dispatch] = useReducer(gameReducer, undefined, initialState);
  const { status, overlay, queue, sounds, turn } = state;

  // Only stable moments are saved, so queued effects are never lost.
  useEffect(() => {
    if (status.kind === "ended") clearProgress();
    if (status.kind === "playing" && !overlay && queue.length === 0) {
      saveProgress(progressOf(state));
    }
  }, [state, status, overlay, queue]);

  useEffect(() => {
    if (turn === 0) return;
    for (const sound of sounds) sfx[sound]();
    if (status.kind === "dead") sfx.death();
  }, [turn, sounds, status]);

  // Playtests read and drive the game through this hook in development.
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    (window as unknown as { __TEST__: unknown }).__TEST__ = { state, dispatch };
  }, [state]);

  return [state, dispatch] as const;
}
