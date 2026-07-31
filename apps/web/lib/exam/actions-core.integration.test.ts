// Integration test for the exam engine's core database operations
// (Phase 14's "Database operations" + "Exam system" verification) —
// unlike every other *.test.ts in this project, this one needs a real
// Postgres with the supabase/migrations/*.sql schema applied, since it
// exercises actual inserts/updates/RLS-adjacent grading logic rather
// than pure functions.
//
// Run against a throwaway database only, never a real project's:
//   DATABASE_URL_FOR_TESTS=postgres://... npm run test:integration
// (e.g. a local `supabase start` instance, or a CI-provisioned Postgres
// with migrations applied — see docs/ARCHITECTURE.md's CI section).
//
// This suite could not be run in the sandbox this file was authored in
// (no reachable Postgres was available there — see the session's other
// notes on Supabase CLI/Docker being unavailable) — it's written to the
// same standard as everything else, but hasn't been executed end-to-end
// against a live database. Treat a first real run as the actual proof,
// not this comment.
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import postgres from "postgres";
import { sql } from "drizzle-orm";
import { createDbClient, type Database } from "@csca/db";
import { startExamCore, saveAnswerCore, submitExamCore } from "./actions-core";
import type { SessionUser } from "@/lib/auth/session";

const TEST_DATABASE_URL = process.env.DATABASE_URL_FOR_TESTS;

async function isReachable(url: string): Promise<boolean> {
  try {
    const probe = postgres(url, { connect_timeout: 3, max: 1 });
    await probe`select 1`;
    await probe.end({ timeout: 1 });
    return true;
  } catch {
    return false;
  }
}

const reachable = TEST_DATABASE_URL ? await isReachable(TEST_DATABASE_URL) : false;

if (!reachable) {
  console.warn(
    "[integration] Skipping exam-core integration tests — set DATABASE_URL_FOR_TESTS to a reachable throwaway " +
      "Postgres (migrations applied) to run them. See this file's header comment.",
  );
}

describe.skipIf(!reachable)("exam engine — database operations", () => {
  let db: Database;
  let userId: string;
  let subjectId: string;
  let categoryId: string;
  let mcqQuestionId: string;
  let correctOptionId: string;
  const user: () => SessionUser = () => ({ id: userId, email: "integration-test@example.com", role: "student" });

  beforeAll(async () => {
    db = createDbClient(TEST_DATABASE_URL!);

    // auth.users is a real Postgres table underneath Supabase Auth —
    // inserting into it directly (rather than going through GoTrue) is
    // the standard way to seed a test user without a running Auth
    // server, matching profiles' own FK to it.
    const authUserRows = await db.execute<{ id: string }>(
      sql`insert into auth.users (id, email) values (gen_random_uuid(), 'integration-test@example.com') returning id`,
    );
    userId = authUserRows[0]!.id;
    await db.execute(sql`insert into public.profiles (id, full_name, role) values (${userId}, 'Integration Test', 'student')`);

    const subjectRows = await db.execute<{ id: string }>(
      sql`insert into public.subjects (name, slug) values ('Integration Test Subject', 'integration-test-subject-' || gen_random_uuid()) returning id`,
    );
    subjectId = subjectRows[0]!.id;

    const categoryRows = await db.execute<{ id: string }>(
      sql`insert into public.question_categories (subject_id, name, slug) values (${subjectId}, 'Integration Test Topic', 'integration-test-topic-' || gen_random_uuid()) returning id`,
    );
    categoryId = categoryRows[0]!.id;

    const questionRows = await db.execute<{ id: string }>(
      sql`insert into public.questions (category_id, type, difficulty, title, body, is_published)
                 values (${categoryId}, 'mcq', 0.5, 'Integration test question', '2 + 2 = ?', true) returning id`,
    );
    mcqQuestionId = questionRows[0]!.id;

    const correctOptionRows = await db.execute<{ id: string }>(
      sql`insert into public.question_options (question_id, content, is_correct, position) values (${mcqQuestionId}, '4', true, 1) returning id`,
    );
    correctOptionId = correctOptionRows[0]!.id;
    await db.execute(sql`insert into public.question_options (question_id, content, is_correct, position) values (${mcqQuestionId}, '5', false, 2)`);
  });

  afterAll(async () => {
    // profiles/subjects cascade-delete their dependents (exam_sessions,
    // question_categories -> questions -> question_options), so deleting
    // these two rows is enough to leave the test database clean.
    await db.execute(sql`delete from public.profiles where id = ${userId}`);
    await db.execute(sql`delete from auth.users where id = ${userId}`);
    await db.execute(sql`delete from public.subjects where id = ${subjectId}`);
  });

  it("starts a subject-practice session with the right question pool", async () => {
    const result = await startExamCore(user(), { mode: "subject_practice", subjectId, questionCount: 10 });
    expect(result.success).toBe(true);
  });

  it("grades an MCQ answer correctly and finalizes with the expected score", async () => {
    const started = await startExamCore(user(), { mode: "subject_practice", subjectId, questionCount: 10 });
    if (!started.success) throw new Error("setup failed: could not start session");
    const sessionId = started.data.sessionId;

    const saved = await saveAnswerCore(user(), { sessionId, questionId: mcqQuestionId, selectedOptionId: correctOptionId });
    expect(saved.success).toBe(true);

    const submitted = await submitExamCore(user(), sessionId);
    expect(submitted.success).toBe(true);
    // Only one question in the pool answered correctly — 100%.
    if (submitted.success) {
      expect(submitted.data.sessionId).toBe(sessionId);
    }
  });

  it("rejects saving an answer to a session that isn't the caller's own", async () => {
    const started = await startExamCore(user(), { mode: "subject_practice", subjectId, questionCount: 10 });
    if (!started.success) throw new Error("setup failed: could not start session");

    const otherUser: SessionUser = { id: "00000000-0000-0000-0000-000000000000", email: "other@example.com", role: "student" };
    const result = await saveAnswerCore(otherUser, { sessionId: started.data.sessionId, questionId: mcqQuestionId, selectedOptionId: correctOptionId });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.code).toBe("FORBIDDEN");
  });
});
