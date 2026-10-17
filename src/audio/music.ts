import { type SongId, songs } from "./songs";
import { audio, noise, tone } from "./synth";
import {
  type Hit,
  hitsOf,
  type Note,
  notesOf,
  songLength,
  type Wave,
} from "./tracker";

/** Schedules the chiptune a little ahead of time so it never stutters. */

const LOOKAHEAD = 0.15;
const TICK_MS = 25;
const FADE = 0.4;

type Compiled = {
  length: number;
  stepSeconds: number;
  tones: { wave: Wave; volume: number; byStep: Map<number, Note> }[];
  drums: { volume: number; byStep: Map<number, Hit> }[];
};

const compile = (id: SongId): Compiled => {
  const song = songs[id];
  const tones: Compiled["tones"] = [];
  const drums: Compiled["drums"] = [];
  for (const channel of song.channels) {
    if (channel.kind === "tone") {
      tones.push({
        wave: channel.wave,
        volume: channel.volume,
        byStep: new Map(notesOf(channel.bars).map((n) => [n.step, n])),
      });
    } else {
      drums.push({
        volume: channel.volume,
        byStep: new Map(hitsOf(channel.bars).map((h) => [h.step, h])),
      });
    }
  }
  return {
    length: songLength(song),
    stepSeconds: 60 / song.bpm / 4,
    tones,
    drums,
  };
};

let bus: GainNode | null = null;
let timer: ReturnType<typeof setInterval> | null = null;
let current: { id: SongId; song: Compiled; step: number; next: number } | null =
  null;

const playDrum = (hit: Hit, at: number, volume: number, dest: AudioNode) => {
  if (hit.drum === "K")
    tone({
      freq: 150,
      to: 40,
      type: "sine",
      at,
      duration: 0.16,
      volume: volume * 2,
      dest,
    });
  if (hit.drum === "S") {
    noise({ at, duration: 0.1, volume, highpass: 1500, dest });
    tone({
      freq: 190,
      type: "triangle",
      at,
      duration: 0.06,
      volume: volume / 2,
      dest,
    });
  }
  if (hit.drum === "H")
    noise({ at, duration: 0.03, volume: volume / 2, highpass: 7000, dest });
};

const tick = () => {
  const a = audio();
  if (!a || !bus || !current) return;
  const { song } = current;
  while (current.next < a.ctx.currentTime + LOOKAHEAD) {
    const at = current.next - a.ctx.currentTime;
    for (const channel of song.tones) {
      const note = channel.byStep.get(current.step);
      if (note) {
        tone({
          freq: note.freq,
          type: channel.wave,
          at,
          duration: note.length * song.stepSeconds * 0.95,
          volume: channel.volume,
          dest: bus,
        });
      }
    }
    for (const channel of song.drums) {
      const hit = channel.byStep.get(current.step);
      if (hit) playDrum(hit, at, channel.volume, bus);
    }
    current.step = (current.step + 1) % song.length;
    current.next += song.stepSeconds;
  }
};

/** Starts a tune, or crossfades to it if another one is playing. */
export const playSong = (id: SongId): void => {
  const a = audio();
  if (!a || current?.id === id) return;
  if (!bus) {
    bus = a.ctx.createGain();
    bus.connect(a.out);
  }
  const now = a.ctx.currentTime;
  bus.gain.cancelScheduledValues(now);
  bus.gain.setValueAtTime(bus.gain.value, now);
  bus.gain.linearRampToValueAtTime(0, now + FADE);
  bus.gain.linearRampToValueAtTime(1, now + FADE * 2);
  current = { id, song: compile(id), step: 0, next: now + FADE };
  if (!timer) timer = setInterval(tick, TICK_MS);
};

export const stopMusic = (): void => {
  if (timer) clearInterval(timer);
  timer = null;
  current = null;
};
