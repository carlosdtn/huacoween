import { describe, expect, test } from "bun:test";
import { songs } from "./songs";
import { frequency, notesOf, songLength, tokensOf } from "./tracker";

describe("tracker", () => {
  test("reads note names", () => {
    expect(frequency("A4")).toBeCloseTo(440);
    expect(frequency("C#5")).toBeCloseTo(554.37, 1);
    expect(frequency("Bb4")).toBeCloseTo(466.16, 1);
    expect(frequency("-")).toBeNull();
  });

  test("held notes last several steps", () => {
    expect(notesOf(["D5 - - . E5"])).toEqual([
      { step: 0, length: 3, freq: frequency("D5") as number },
      { step: 4, length: 1, freq: frequency("E5") as number },
    ]);
  });

  for (const [id, song] of Object.entries(songs)) {
    test(`${id} has bars of the right length on every channel`, () => {
      const length = songLength(song);
      for (const channel of song.channels) {
        for (const bar of channel.bars)
          expect(tokensOf([bar])).toHaveLength(song.steps);
        expect(tokensOf(channel.bars)).toHaveLength(length);
      }
    });

    test(`${id} only uses valid tokens`, () => {
      for (const channel of song.channels) {
        for (const token of tokensOf(channel.bars)) {
          const ok =
            token === "." ||
            token === "-" ||
            (channel.kind === "drums"
              ? /^[KSH]$/.test(token)
              : frequency(token) !== null);
          expect(ok).toBe(true);
        }
      }
    });
  }
});
