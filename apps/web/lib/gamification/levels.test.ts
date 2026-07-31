import { describe, it, expect } from "vitest";
import { computeLevel } from "./levels";

describe("computeLevel", () => {
  it("starts everyone at level 1 with zero points", () => {
    expect(computeLevel(0)).toEqual({ level: 1, title: "Beginner", pointsIntoLevel: 0, pointsToNextLevel: 100 });
  });

  it("stays at the current level right up to the next threshold", () => {
    expect(computeLevel(99).level).toBe(1);
    expect(computeLevel(100).level).toBe(2);
  });

  it("computes progress into the current level and points remaining to the next", () => {
    const info = computeLevel(150);
    expect(info).toEqual({ level: 2, title: "Learner", pointsIntoLevel: 50, pointsToNextLevel: 150 });
  });

  it("has no next level once at the top tier", () => {
    const info = computeLevel(5000);
    expect(info.level).toBe(5);
    expect(info.title).toBe("Master");
    expect(info.pointsToNextLevel).toBeNull();
  });

  it("never regresses below level 1 for a negative or zero input", () => {
    expect(computeLevel(-10).level).toBe(1);
  });
});
