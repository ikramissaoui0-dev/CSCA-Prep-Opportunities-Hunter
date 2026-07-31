import { describe, it, expect } from "vitest";
import { shuffle } from "./random";

describe("shuffle", () => {
  it("preserves length and every original element exactly once", () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8];
    const result = shuffle(input);
    expect(result).toHaveLength(input.length);
    expect([...result].sort()).toEqual([...input].sort());
  });

  it("does not mutate the input array", () => {
    const input = Object.freeze([1, 2, 3, 4, 5]);
    expect(() => shuffle(input)).not.toThrow();
    expect(input).toEqual([1, 2, 3, 4, 5]);
  });

  it("eventually produces more than one distinct ordering", () => {
    // Anti-cheat only works if it's actually randomizing — a shuffle that
    // silently degenerated into the identity function would still pass
    // the two tests above.
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const orderings = new Set<string>();
    for (let i = 0; i < 30; i++) {
      orderings.add(shuffle(input).join(","));
    }
    expect(orderings.size).toBeGreaterThan(1);
  });

  it("handles empty and single-element arrays without throwing", () => {
    expect(shuffle([])).toEqual([]);
    expect(shuffle([42])).toEqual([42]);
  });
});
