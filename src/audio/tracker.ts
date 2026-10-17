/**
 * A tiny text tracker. Each channel is a line of tokens, one per step:
 *   "D4" plays a note, "-" holds the previous note, "." is silence,
 *   and drum channels use "K" (kick), "S" (snare) and "H" (hat).
 */

export type Wave = "square" | "triangle" | "sawtooth" | "sine";

export type Channel =
  | { kind: "tone"; wave: Wave; volume: number; bars: string[] }
  | { kind: "drums"; volume: number; bars: string[] };

export type Song = {
  title: string;
  bpm: number;
  /** Steps per bar: 16 for straight time, 12 for a 6/8 swing. */
  steps: number;
  channels: Channel[];
};

export type Note = { step: number; length: number; freq: number };
export type Hit = { step: number; drum: "K" | "S" | "H" };

const NOTE = /^([A-G])(#|b)?(-?\d)$/;
const SEMITONES: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

export const frequency = (token: string): number | null => {
  const match = NOTE.exec(token);
  if (!match) return null;
  const [, letter, accidental, octave] = match;
  const shift = accidental === "#" ? 1 : accidental === "b" ? -1 : 0;
  const midi = (Number(octave) + 1) * 12 + SEMITONES[letter] + shift;
  return 440 * 2 ** ((midi - 69) / 12);
};

export const tokensOf = (bars: string[]): string[] =>
  bars.flatMap((bar) => bar.trim().split(/\s+/));

/** Turns a tone channel into notes with their lengths in steps. */
export const notesOf = (bars: string[]): Note[] => {
  const tokens = tokensOf(bars);
  const notes: Note[] = [];
  tokens.forEach((token, step) => {
    const freq = frequency(token);
    if (freq === null) return;
    let length = 1;
    while (tokens[step + length] === "-") length++;
    notes.push({ step, length, freq });
  });
  return notes;
};

export const hitsOf = (bars: string[]): Hit[] =>
  tokensOf(bars).flatMap((token, step) =>
    token === "K" || token === "S" || token === "H"
      ? [{ step, drum: token }]
      : [],
  );

export const songLength = (song: Song): number =>
  tokensOf(song.channels[0].bars).length;
