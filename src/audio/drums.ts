import { noise, tone } from "./synth";

/** Four cajón strokes, from deep bass to sharp slap. */
export const PADS = [
  {
    label: "Bum",
    hit: () =>
      tone({ freq: 110, to: 50, type: "sine", duration: 0.25, volume: 0.4 }),
  },
  {
    label: "Pa",
    hit: () =>
      tone({ freq: 220, to: 120, type: "sine", duration: 0.15, volume: 0.3 }),
  },
  {
    label: "Ta",
    hit: () => {
      noise({ duration: 0.08, volume: 0.25, highpass: 1500 });
      tone({ freq: 330, type: "triangle", duration: 0.06, volume: 0.12 });
    },
  },
  {
    label: "Tac",
    hit: () => noise({ duration: 0.05, volume: 0.35, highpass: 4000 }),
  },
] as const;
