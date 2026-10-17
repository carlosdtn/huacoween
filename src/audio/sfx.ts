import type { SoundId } from "@/game/content/sounds";
import { melody, noise, tone } from "./synth";

export const sfx: Record<SoundId, () => void> = {
  click: () => tone({ freq: 660, duration: 0.05, volume: 0.08 }),
  pickup: () => melody([523, 659, 784], 0.07, { type: "triangle" }),
  coin: () => melody([988, 1319], 0.08, { type: "square", volume: 0.1 }),
  unlock: () => {
    tone({ freq: 220, duration: 0.05, type: "square" });
    tone({ freq: 330, at: 0.08, duration: 0.08, type: "square" });
  },
  error: () =>
    tone({ freq: 180, to: 90, duration: 0.25, type: "sawtooth", volume: 0.12 }),
  door: () => {
    tone({ freq: 90, to: 60, duration: 0.4, type: "sawtooth", volume: 0.12 });
    noise({ duration: 0.25, volume: 0.08, highpass: 300 });
  },
  death: () =>
    melody([392, 370, 349, 330, 196], 0.22, { type: "sawtooth", volume: 0.14 }),
  success: () => melody([523, 659, 784, 1047], 0.09, { type: "triangle" }),
  hiss: () => noise({ duration: 1.2, volume: 0.25, highpass: 2000 }),
  tv: () => {
    noise({ duration: 0.5, volume: 0.15, highpass: 1500 });
    tone({ freq: 60, duration: 0.5, type: "square", volume: 0.06 });
  },
  bonk: () => {
    tone({ freq: 160, to: 70, duration: 0.18, type: "square", volume: 0.2 });
    noise({ duration: 0.1, volume: 0.2, highpass: 600 });
  },
  squeak: () => {
    tone({
      freq: 1400,
      to: 1900,
      duration: 0.08,
      type: "triangle",
      volume: 0.1,
    });
    tone({
      freq: 1500,
      to: 2100,
      at: 0.1,
      duration: 0.1,
      type: "triangle",
      volume: 0.1,
    });
  },
  whistle: () => {
    tone({ freq: 1800, to: 2400, duration: 0.35, type: "sine", volume: 0.08 });
    tone({
      freq: 2400,
      to: 1600,
      at: 0.45,
      duration: 0.5,
      type: "sine",
      volume: 0.08,
    });
  },
  engine: () => {
    for (let i = 0; i < 6; i++)
      tone({
        freq: 55 + i * 6,
        at: i * 0.09,
        duration: 0.08,
        type: "sawtooth",
        volume: 0.12,
      });
    noise({ duration: 0.6, volume: 0.06, highpass: 200 });
  },
  sizzle: () => noise({ duration: 0.7, volume: 0.12, highpass: 4000 }),
};
