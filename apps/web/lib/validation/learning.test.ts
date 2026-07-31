import { describe, it, expect } from "vitest";
import { addLessonTimeSchema, setLessonCompletedSchema } from "./learning";

const uuid = "11111111-1111-1111-1111-111111111111";

describe("addLessonTimeSchema", () => {
  it("accepts a heartbeat within the 1-300 second range", () => {
    expect(addLessonTimeSchema.safeParse({ lessonId: uuid, seconds: 30 }).success).toBe(true);
  });

  it("rejects a heartbeat above 300 seconds — a tampered client claiming an implausible chunk of time", () => {
    expect(addLessonTimeSchema.safeParse({ lessonId: uuid, seconds: 301 }).success).toBe(false);
    expect(addLessonTimeSchema.safeParse({ lessonId: uuid, seconds: 100000 }).success).toBe(false);
  });

  it("rejects zero, negative, or non-integer seconds", () => {
    expect(addLessonTimeSchema.safeParse({ lessonId: uuid, seconds: 0 }).success).toBe(false);
    expect(addLessonTimeSchema.safeParse({ lessonId: uuid, seconds: -5 }).success).toBe(false);
    expect(addLessonTimeSchema.safeParse({ lessonId: uuid, seconds: 12.5 }).success).toBe(false);
  });
});

describe("setLessonCompletedSchema", () => {
  it("accepts a valid lesson id with either boolean completion state", () => {
    expect(setLessonCompletedSchema.safeParse({ lessonId: uuid, completed: true }).success).toBe(true);
    expect(setLessonCompletedSchema.safeParse({ lessonId: uuid, completed: false }).success).toBe(true);
  });

  it("rejects a non-uuid lesson id or a non-boolean completed flag", () => {
    expect(setLessonCompletedSchema.safeParse({ lessonId: "not-a-uuid", completed: true }).success).toBe(false);
    expect(setLessonCompletedSchema.safeParse({ lessonId: uuid, completed: "yes" }).success).toBe(false);
  });
});
