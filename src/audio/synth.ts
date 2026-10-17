/** Tiny Web Audio helpers. Every sound in the game is synthesized: no files, no licences. */

const VOLUME = 0.6;
let context: AudioContext | null = null;
let master: GainNode | null = null;
let muted = false;

export const audio = (): { ctx: AudioContext; out: GainNode } | null => {
  if (typeof window === "undefined") return null;
  if (!context) {
    context = new AudioContext();
    master = context.createGain();
    master.gain.value = muted ? 0 : VOLUME;
    master.connect(context.destination);
  }
  if (context.state === "suspended") void context.resume();
  return master ? { ctx: context, out: master } : null;
};

export const isMuted = (): boolean => muted;

/** Safe to call before any sound played: it never creates the AudioContext. */
export const setMuted = (value: boolean): void => {
  muted = value;
  if (context && master)
    master.gain.setTargetAtTime(muted ? 0 : VOLUME, context.currentTime, 0.05);
};

export type Tone = {
  freq: number;
  /** Glide target, for sweeps. */
  to?: number;
  type?: OscillatorType;
  at?: number;
  duration?: number;
  volume?: number;
  /** Where to send the sound; defaults to the master bus. */
  dest?: AudioNode;
};

export const tone = ({
  freq,
  to,
  type = "square",
  at = 0,
  duration = 0.12,
  volume = 0.15,
  dest,
}: Tone): void => {
  const a = audio();
  if (!a) return;
  const start = a.ctx.currentTime + at;
  const osc = a.ctx.createOscillator();
  const gain = a.ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, start + duration);
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain).connect(dest ?? a.out);
  osc.start(start);
  osc.stop(start + duration + 0.02);
};

export const noise = ({
  at = 0,
  duration = 0.3,
  volume = 0.2,
  highpass = 800,
  dest,
}: {
  at?: number;
  duration?: number;
  volume?: number;
  highpass?: number;
  /** Where to send the sound; defaults to the master bus. */
  dest?: AudioNode;
} = {}): void => {
  const a = audio();
  if (!a) return;
  const start = a.ctx.currentTime + at;
  const buffer = a.ctx.createBuffer(
    1,
    a.ctx.sampleRate * duration,
    a.ctx.sampleRate,
  );
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const source = a.ctx.createBufferSource();
  const filter = a.ctx.createBiquadFilter();
  const gain = a.ctx.createGain();
  source.buffer = buffer;
  filter.type = "highpass";
  filter.frequency.value = highpass;
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  source
    .connect(filter)
    .connect(gain)
    .connect(dest ?? a.out);
  source.start(start);
};

/** Plays notes one after another. */
export const melody = (
  notes: number[],
  step = 0.1,
  base: Omit<Tone, "freq" | "at"> = {},
) =>
  notes.forEach((freq, i) => {
    tone({ ...base, freq, at: i * step, duration: step * 1.1 });
  });
