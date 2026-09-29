import { describe, it, expect } from "vitest";
import { startExamSchema, saveAnswerSchema } from "./exam";

const uuid = "11111111-1111-1111-1111-111111111111";

describe("startExamSchema", () => {
  it("accepts each of the four valid modes with their own required fields", () => {
    expect(startExamSchema.safeParse({ mode: "full_mock", examId: uuid }).success).toBe(true);
    expect(startExamSchema.safeParse({ mode: "daily_challenge", examId: uuid }).success).toBe(true);
    expect(startExamSchema.safeParse({ mode: "subject_practice", subjectId: uuid }).success).toBe(true);
    expect(startExamSchema.safeParse({ mode: "difficulty_practice", difficultyMin: 0.2, difficultyMax: 0.6 }).success).toBe(true);
  });

  it("rejects a curated mode with an ad-hoc field instead of examId", () => {
    // full_mock/daily_challenge are curated (Phase 4) — they need a real
    // exam_id, not a subject/difficulty filter.
    expect(startExamSchema.safeParse({ mode: "full_mock", subjectId: uuid }).success).toBe(false);
  });

  it("rejects a difficulty value outside 0-1", () => {
    expect(startExamSchema.safeParse({ mode: "difficulty_practice", difficultyMin: -0.1, difficultyMax: 0.5 }).success).toBe(false);
  });

  it("rejects an unknown mode entirely", () => {
    expect(startExamSchema.safeParse({ mode: "speedrun", examId: uuid }).success).toBe(false);
  });
});

describe("saveAnswerSchema", () => {
  it("accepts an MCQ answer (selectedOptionId) or a free-response answer, but requires one of them", () => {
    expect(saveAnswerSchema.safeParse({ sessionId: uuid, questionId: uuid, selectedOptionId: uuid }).success).toBe(true);
    expect(saveAnswerSchema.safeParse({ sessionId: uuid, questionId: uuid, freeResponseText: "42" }).success).toBe(true);
    expect(saveAnswerSchema.safeParse({ sessionId: uuid, questionId: uuid }).success).toBe(false);
  });

  it("rejects an empty free-response answer", () => {
    expect(saveAnswerSchema.safeParse({ sessionId: uuid, questionId: uuid, freeResponseText: "   " }).success).toBe(false);
  });

  it("rejects a non-uuid session or question id", () => {
    expect(saveAnswerSchema.safeParse({ sessionId: "not-a-uuid", questionId: uuid, selectedOptionId: uuid }).success).toBe(false);
  });
});
