import type { SceneId } from "@/game/content/scenes";
import type { Song } from "./tracker";

/*
 * Original chiptune, composed for this game and released with it.
 * Mischievous and spooky in the spirit of old Flash adventures, but no melody
 * is borrowed from anywhere.
 */

const villain: Song = {
  title: "Huayno de Huacosaw",
  bpm: 132,
  steps: 16,
  channels: [
    {
      kind: "tone",
      wave: "square",
      volume: 0.05,
      bars: [
        "D5 . A4 . D5 . F5 . E5 . D5 . C#5 . A4 .",
        "Bb4 . D5 . G5 . F5 . E5 . C#5 . A4 . . .",
        "D5 . A4 . D5 . F5 . A5 . G5 . F5 . E5 .",
        "D5 - - . C#5 . E5 . D5 - - - . . . .",
        "F5 . E5 . D5 . C#5 . D5 . E5 . F5 . G5 .",
        "A5 - - . F5 . D5 . Bb4 - - . A4 . . .",
        "D5 . F5 . A5 . D6 . C#6 . A5 . E5 . G5 .",
        "F5 . E5 . C#5 . A4 . D5 - - - . . . .",
      ],
    },
    {
      kind: "tone",
      wave: "triangle",
      volume: 0.12,
      bars: [
        "D3 . . . A2 . . . D3 . . . A2 . . .",
        "G2 . . . D3 . . . A2 . . . A2 . C#3 .",
        "D3 . . . A2 . . . F2 . . . C3 . . .",
        "A2 . . . A2 . . . D3 . . . D3 . . .",
        "Bb2 . . . F3 . . . Bb2 . . . F3 . . .",
        "G2 . . . D3 . . . G2 . . . A2 . . .",
        "D3 . . . A2 . . . F2 . . . A2 . . .",
        "A2 . . . A2 . C#3 . D3 . . . D3 . . .",
      ],
    },
    {
      kind: "drums",
      volume: 0.12,
      bars: [
        ...Array.from({ length: 7 }, () => "K . H . S . H . K . H . S . H H"),
        "K . H . S . H . K K S . S S S S",
      ],
    },
  ],
};

const criollo: Song = {
  title: "Festejo de las ánimas",
  bpm: 112,
  steps: 12,
  channels: [
    {
      kind: "tone",
      wave: "square",
      volume: 0.045,
      bars: [
        "A4 . C5 . E5 . D5 C5 . A4 . .",
        "G4 . B4 . D5 . C5 B4 . G4 . .",
        "F4 . A4 . C5 . E5 D5 . C5 B4 .",
        "A4 - - . E4 . A4 - - . . .",
        "C5 . E5 . A5 . G5 E5 . C5 . .",
        "D5 . F5 . A5 . G5 F5 . E5 . .",
        "F5 . E5 . D5 . C5 B4 . A4 G#4 .",
        "A4 - - . E5 . A4 - - . . .",
      ],
    },
    {
      kind: "tone",
      wave: "triangle",
      volume: 0.12,
      bars: [
        "A2 . . E3 . . A2 . . E3 . .",
        "G2 . . D3 . . G2 . . D3 . .",
        "F2 . . C3 . . F2 . . C3 . .",
        "E2 . . B2 . . A2 . . . . .",
        "A2 . . E3 . . A2 . . E3 . .",
        "D2 . . A2 . . D2 . . A2 . .",
        "F2 . . C3 . . E2 . . G#2 . .",
        "A2 . . E3 . . A2 . . . . .",
      ],
    },
    {
      kind: "drums",
      volume: 0.13,
      bars: [
        ...Array.from({ length: 7 }, () => "K . H S . H K . S . H S"),
        "K . S K . S K S S S S S",
      ],
    },
  ],
};

const haunted: Song = {
  title: "El panteón duerme",
  bpm: 84,
  steps: 16,
  channels: [
    {
      kind: "tone",
      wave: "triangle",
      volume: 0.1,
      bars: [
        "E5 - - - G5 - A5 - B5 - - - A5 - G5 -",
        "E5 - - - D5 - E5 - G5 - - - - - - -",
        "B4 - - - D5 - E5 - G5 - A5 - G5 - E5 -",
        "D5 - - - B4 - - - E5 - - - - - - -",
        "G5 - - - A5 - B5 - D6 - - - B5 - A5 -",
        "G5 - - - E5 - - - D5 - E5 - G5 - - -",
        "B4 - - - A4 - B4 - D5 - - - E5 - D5 -",
        "E5 - - - - - - - . . . . . . . .",
      ],
    },
    {
      kind: "tone",
      wave: "square",
      volume: 0.025,
      bars: [
        "E2 - - - - - - - E2 - - - - - - -",
        "E2 - - - - - - - E2 - - - - - - -",
        "G2 - - - - - - - D2 - - - - - - -",
        "B1 - - - - - - - E2 - - - - - - -",
        "G2 - - - - - - - G2 - - - - - - -",
        "C2 - - - - - - - C2 - - - - - - -",
        "D2 - - - - - - - B1 - - - - - - -",
        "E2 - - - - - - - E2 - - - - - - -",
      ],
    },
    {
      kind: "tone",
      wave: "sine",
      volume: 0.04,
      bars: Array.from({ length: 8 }, (_, bar) =>
        bar % 2
          ? "G6 . . . . . . . E6 . . . . . . ."
          : "E6 . . . . . . . B5 . . . . . . .",
      ),
    },
    {
      kind: "drums",
      volume: 0.08,
      bars: Array.from({ length: 8 }, () => "K . . . . . . . . . . . S . . ."),
    },
  ],
};

export const songs = { villain, criollo, haunted } satisfies Record<
  string,
  Song
>;
export type SongId = keyof typeof songs;

/** Which tune plays in each place. */
export const sceneSongs: Record<SceneId, SongId> = {
  kitchen: "villain",
  street: "villain",
  market: "criollo",
  park: "criollo",
  catacombs: "haunted",
  cemeteryGate: "criollo",
  cemetery: "haunted",
  crypt: "haunted",
};
