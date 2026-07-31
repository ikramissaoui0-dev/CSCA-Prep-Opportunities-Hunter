/**
 * Fisher-Yates shuffle. Used to randomize question order once at session
 * creation (persisted to exam_sessions.question_order) — every student
 * sees the same curated question set, but in a different order, which
 * is the "basic anti-cheat" question-randomization Phase 4 asks for.
 */
export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
