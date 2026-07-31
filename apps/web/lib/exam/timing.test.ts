import { describe, it, expect } from "vitest";
import { computeDeadline, isPastDeadline, computeTimeSpentSeconds } from "./timing";

describe("computeDeadline", () => {
  it("returns null for untimed practice", () => {
    expect(computeDeadline(new Date(), null)).toBeNull();
  });

  it("adds the time limit in seconds to the start time", () => {
    const start = new Date("2026-01-01T00:00:00.000Z");
    const deadline = computeDeadline(start, 1800); // 30 minutes
    expect(deadline?.toISOString()).toBe("2026-01-01T00:30:00.000Z");
  });
});

describe("isPastDeadline", () => {
  it("is never past deadline for untimed practice, no matter how much time passes", () => {
    const start = new Date("2026-01-01T00:00:00.000Z");
    const farFuture = new Date("2030-01-01T00:00:00.000Z");
    expect(isPastDeadline(start, null, farFuture)).toBe(false);
  });

  it("is false right up to the deadline and true just after it", () => {
    const start = new Date("2026-01-01T00:00:00.000Z");
    const atDeadline = new Date("2026-01-01T00:30:00.000Z");
    const justAfter = new Date("2026-01-01T00:30:00.001Z");
    expect(isPastDeadline(start, 1800, atDeadline)).toBe(false);
    expect(isPastDeadline(start, 1800, justAfter)).toBe(true);
  });
});

describe("computeTimeSpentSeconds", () => {
  it("reports actual elapsed time for untimed practice", () => {
    const start = new Date("2026-01-01T00:00:00.000Z");
    const now = new Date("2026-01-01T00:10:00.000Z");
    expect(computeTimeSpentSeconds(start, null, now)).toBe(600);
  });

  it("caps elapsed time at the limit for a long-abandoned timed session", () => {
    const start = new Date("2026-01-01T00:00:00.000Z");
    const threeDaysLater = new Date("2026-01-04T00:00:00.000Z");
    // A 30-minute exam swept up 3 days later must report ~30 minutes
    // spent, not 3 days — see the function's own docstring.
    expect(computeTimeSpentSeconds(start, 1800, threeDaysLater)).toBe(1800);
  });

  it("never returns a negative value if `now` is before `startedAt`", () => {
    const start = new Date("2026-01-01T00:10:00.000Z");
    const now = new Date("2026-01-01T00:00:00.000Z");
    expect(computeTimeSpentSeconds(start, null, now)).toBe(0);
  });
});
