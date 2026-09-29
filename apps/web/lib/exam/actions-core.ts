import "server-only";

import { after } from "next/server";
import { eq, and, or, gte, lte, isNotNull, inArray, sql } from "drizzle-orm";
import {
  exams,
  examQuestions,
  examSessions,
  sessionAnswers,
  questions,
  questionCategories,
  questionOptions,
  subjects,
  type PlanTier,
} from "@csca/db";
import type { SessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { AppError, actionFailure, type ActionResult } from "@/lib/errors";
import { finalizeSession } from "./finalize";
import { maybeGenerateRecommendations } from "@/lib/ai/generate-recommendations";
import { isPastDeadline } from "./timing";
import { shuffle } from "./random";
import { getCurrentPlanTier, planTierAtLeast } from "@/lib/billing/plan";

// Every tier a caller at `planTier` is actually allowed to see, per
// plan_tier_rank — mirrors the questions_read_published RLS policy
// (0016_practice_free_preview.sql) exactly. Without this, a pool built
// on the elevated `db` (no RLS) can pick a question whose category the
// student's own RLS-scoped read of `questions` then silently hides —
// the question vanishes from the exam-taking page but still counts as
// "skipped" once finalizeSession scores the full questionOrder.
const ALL_PLAN_TIERS: PlanTier[] = ["free", "premium", "premium_plus"];
function visibleCategoryTiers(planTier: PlanTier): PlanTier[] {
  return ALL_PLAN_TIERS.filter((tier) => planTierAtLeast(planTier, tier));
}
import type { StartExamInput, SaveAnswerInput } from "@/lib/validation/exam";

// Ad-hoc practice sessions aren't tied to a curated exams.time_limit_seconds,
// so they get a computed allowance instead — keeps every mode "a timed
// test" (Phase 4) without needing the picker UI to ask for a duration.
const SECONDS_PER_PRACTICE_QUESTION = 90;

// A free_response question is only pool-eligible once it has a model
// answer to grade against — otherwise gradeFreeResponseAnswers has
// nothing to compare the student's text to, and the answer would be
// stuck ungraded (silently scored as wrong) forever. mcq questions have
// no such requirement; they grade off question_options.is_correct.
const gradeableQuestion = or(eq(questions.type, "mcq"), and(eq(questions.type, "free_response"), isNotNull(questions.correctAnswerText)));

/**
 * The actual business logic behind starting/resuming an exam, split out
 * from the "use server" action in actions.ts so it can be exercised
 * directly (no Next.js request context — cookies(), redirect() — needed
 * to call it). The exported action is a thin wrapper: authenticate,
 * validate, call this, then redirect() based on the result.
 *
 * All writes go through the elevated `db`, never withRlsContext — see
 * 0008_exam_engine_hardening.sql: exam_sessions denies direct
 * authenticated writes by design, so creating/grading a session is
 * trusted server logic with its own explicit authorization checks
 * (`user.id` from the verified session, never a client-supplied value),
 * the same way Stripe webhook handling is.
 */
export async function startExamCore(user: SessionUser, data: StartExamInput): Promise<ActionResult<{ sessionId: string }>> {
  if (data.mode === "full_mock" || data.mode === "daily_challenge") {
    const [exam] = await db.select().from(exams).where(eq(exams.id, data.examId));
    if (!exam || !exam.isPublished || exam.mode !== data.mode) {
      return actionFailure(new AppError("NOT_FOUND", "That exam isn't available."));
    }

    const [existing] = await db
      .select()
      .from(examSessions)
      .where(and(eq(examSessions.userId, user.id), eq(examSessions.examId, exam.id), eq(examSessions.status, "in_progress")));

    if (existing) {
      if (isPastDeadline(existing.startedAt, existing.timeLimitSeconds)) {
        await finalizeSession(db, existing.id, "expired");
      } else {
        return { success: true, data: { sessionId: existing.id } };
      }
    }

    // Phase 1 launch scoping: past exam papers require admin-granted
    // access from the start — there's no self-serve checkout yet (see
    // lib/billing/checkout-actions-core.ts's comment), so a free
    // account can't unlock this by paying on the platform, only by
    // contacting the team. daily_challenge stays free for everyone, a
    // small taste of the format. Resuming an in-progress session above
    // already returned before reaching this, so only a genuinely new
    // attempt can be blocked here.
    const planTier = await getCurrentPlanTier(user.id, user.role);
    if (data.mode === "full_mock" && planTier === "free") {
      return actionFailure(
        new AppError("FORBIDDEN", "Past exam papers require Premium access — contact our team to get access."),
      );
    }

    // Same guard as subject_practice's pool below: a curated exam is
    // normally all one tier, but nothing stops a future one from mixing
    // categories, and daily_challenge (free for everyone) is exactly the
    // path where a stray premium-tier question would otherwise vanish
    // from the taking page while still scoring as skipped.
    const examQuestionRows = await db
      .select({ questionId: examQuestions.questionId })
      .from(examQuestions)
      .innerJoin(questions, eq(questions.id, examQuestions.questionId))
      .innerJoin(questionCategories, eq(questionCategories.id, questions.categoryId))
      .where(and(eq(examQuestions.examId, exam.id), inArray(questionCategories.requiredPlanTier, visibleCategoryTiers(planTier))))
      .orderBy(examQuestions.position);

    if (examQuestionRows.length === 0) {
      return actionFailure(new AppError("VALIDATION_ERROR", "This exam has no questions yet."));
    }

    const questionOrder = shuffle(examQuestionRows.map((r) => r.questionId));

    const [created] = await db
      .insert(examSessions)
      .values({
        userId: user.id,
        examId: exam.id,
        mode: exam.mode,
        timeLimitSeconds: exam.timeLimitSeconds,
        questionOrder,
      })
      .returning({ id: examSessions.id });

    return { success: true, data: { sessionId: created!.id } };
  }

  if (data.mode === "subject_practice") {
    const [subject] = await db.select().from(subjects).where(eq(subjects.id, data.subjectId));
    if (!subject) {
      return actionFailure(new AppError("NOT_FOUND", "That subject doesn't exist."));
    }

    const planTier = await getCurrentPlanTier(user.id, user.role);

    // Phase 1 launch scoping: a free account gets exactly one practice
    // session per subject — a single random mix across every topic
    // (never scoped to one topic), capped at 48 questions to match the
    // real exam's length. Once that one session exists, the only way to
    // practice this subject again is contacting the team for full
    // access. Checked here, not just hidden in the UI, since this is
    // the actual security boundary for session creation.
    if (planTier === "free") {
      const [priorAttempt] = await db
        .select({ id: examSessions.id })
        .from(examSessions)
        .where(and(eq(examSessions.userId, user.id), eq(examSessions.mode, "subject_practice"), eq(examSessions.subjectId, data.subjectId)))
        .limit(1);
      if (priorAttempt) {
        return actionFailure(
          new AppError(
            "FORBIDDEN",
            "You've already used your free practice session for this subject — contact our team for full access.",
          ),
        );
      }
    }
    const FREE_SUBJECT_PRACTICE_QUESTION_CAP = 48;
    const questionCount = planTier === "free" ? Math.min(data.questionCount, FREE_SUBJECT_PRACTICE_QUESTION_CAP) : data.questionCount;

    // A category (topic group or specific topic) must actually belong to
    // the chosen subject — trusting a client-supplied categoryId without
    // this check would let someone pair a subject with an unrelated
    // category's questions. If it turns out to be a group (has
    // children), practice covers every topic under it, not just
    // questions tagged to the group row itself (which normally has none
    // — only leaf topics are ever tagged directly on a question). Free
    // accounts never scope to a category at all — their one session is
    // always the whole subject, mixed — so any categoryId they send is
    // simply ignored rather than honored or rejected.
    let categoryIds: string[] | undefined;
    if (data.categoryId && planTier !== "free") {
      const [category] = await db
        .select({ id: questionCategories.id })
        .from(questionCategories)
        .where(and(eq(questionCategories.id, data.categoryId), eq(questionCategories.subjectId, data.subjectId)));
      if (!category) {
        return actionFailure(new AppError("VALIDATION_ERROR", "That topic doesn't belong to the selected subject."));
      }
      const children = await db.select({ id: questionCategories.id }).from(questionCategories).where(eq(questionCategories.parentId, data.categoryId));
      categoryIds = [data.categoryId, ...children.map((c) => c.id)];
    }

    const pool = await db
      .select({ id: questions.id })
      .from(questions)
      .innerJoin(questionCategories, eq(questionCategories.id, questions.categoryId))
      .where(
        and(
          eq(questionCategories.subjectId, data.subjectId),
          categoryIds ? inArray(questions.categoryId, categoryIds) : undefined,
          inArray(questionCategories.requiredPlanTier, visibleCategoryTiers(planTier)),
          eq(questions.isPublished, true),
          gradeableQuestion,
        ),
      )
      .orderBy(sql`random()`)
      .limit(questionCount);

    if (pool.length === 0) {
      return actionFailure(
        new AppError("VALIDATION_ERROR", data.categoryId ? "No published questions are available for that topic yet." : "No published questions are available for that subject yet."),
      );
    }

    const [created] = await db
      .insert(examSessions)
      .values({
        userId: user.id,
        mode: "subject_practice",
        subjectId: data.subjectId,
        categoryId: data.categoryId ?? null,
        questionCount: pool.length,
        timeLimitSeconds: pool.length * SECONDS_PER_PRACTICE_QUESTION,
        questionOrder: pool.map((p) => p.id),
      })
      .returning({ id: examSessions.id });

    return { success: true, data: { sessionId: created!.id } };
  }

  // difficulty_practice pulls from every subject/category at once, so it
  // can't be narrowed to "the one free series" the way subject_practice
  // can — Phase 1 launch scoping makes it Premium-only from the start.
  const planTier = await getCurrentPlanTier(user.id, user.role);
  if (planTier === "free") {
    return actionFailure(
      new AppError("FORBIDDEN", "Practice by difficulty requires Premium access — contact our team to unlock it."),
    );
  }

  const pool = await db
    .select({ id: questions.id })
    .from(questions)
    .innerJoin(questionCategories, eq(questionCategories.id, questions.categoryId))
    .where(
      and(
        gte(questions.difficulty, data.difficultyMin),
        lte(questions.difficulty, data.difficultyMax),
        inArray(questionCategories.requiredPlanTier, visibleCategoryTiers(planTier)),
        eq(questions.isPublished, true),
        gradeableQuestion,
      ),
    )
    .orderBy(sql`random()`)
    .limit(data.questionCount);

  if (pool.length === 0) {
    return actionFailure(new AppError("VALIDATION_ERROR", "No published questions match that difficulty range yet."));
  }

  const [created] = await db
    .insert(examSessions)
    .values({
      userId: user.id,
      mode: "difficulty_practice",
      difficultyMin: data.difficultyMin,
      difficultyMax: data.difficultyMax,
      questionCount: pool.length,
      timeLimitSeconds: pool.length * SECONDS_PER_PRACTICE_QUESTION,
      questionOrder: pool.map((p) => p.id),
    })
    .returning({ id: examSessions.id });

  return { success: true, data: { sessionId: created!.id } };
}

/**
 * Handles both question types a session can contain (see the
 * gradeableQuestion filter in startExamCore above). An mcq answer grades
 * instantly off question_options.is_correct, exactly as before.
 * free_response is stored with isCorrect left null — AI grading only
 * happens once, in bulk, right before the session is scored (see
 * gradeFreeResponseAnswers in lib/exam/finalize.ts), not per keystroke,
 * since that would mean an OpenAI call on every autosave.
 */
export async function saveAnswerCore(user: SessionUser, data: SaveAnswerInput): Promise<ActionResult<null>> {
  const { sessionId, questionId } = data;

  const [session] = await db.select().from(examSessions).where(eq(examSessions.id, sessionId));
  if (!session || session.userId !== user.id) {
    return actionFailure(new AppError("FORBIDDEN"));
  }
  if (session.status !== "in_progress") {
    return actionFailure(new AppError("VALIDATION_ERROR", "This exam has already ended."));
  }
  if (isPastDeadline(session.startedAt, session.timeLimitSeconds)) {
    await finalizeSession(db, sessionId, "expired");
    return actionFailure(new AppError("VALIDATION_ERROR", "Time's up — this exam was automatically submitted."));
  }

  if ("freeResponseText" in data) {
    const [question] = await db.select({ id: questions.id, type: questions.type }).from(questions).where(eq(questions.id, questionId));
    if (!question || question.type !== "free_response") {
      return actionFailure(new AppError("VALIDATION_ERROR", "That question doesn't accept a written answer."));
    }

    await db
      .insert(sessionAnswers)
      .values({ sessionId, questionId, freeResponseText: data.freeResponseText, isCorrect: null })
      .onConflictDoUpdate({
        target: [sessionAnswers.sessionId, sessionAnswers.questionId],
        set: { freeResponseText: data.freeResponseText, selectedOptionId: null, isCorrect: null, answeredAt: new Date() },
      });

    return { success: true, data: null };
  }

  const { selectedOptionId } = data;
  const [option] = await db
    .select({ isCorrect: questionOptions.isCorrect, questionId: questionOptions.questionId })
    .from(questionOptions)
    .where(eq(questionOptions.id, selectedOptionId));
  if (!option || option.questionId !== questionId) {
    return actionFailure(new AppError("VALIDATION_ERROR", "That option doesn't belong to this question."));
  }

  await db
    .insert(sessionAnswers)
    .values({ sessionId, questionId, selectedOptionId, isCorrect: option.isCorrect })
    .onConflictDoUpdate({
      target: [sessionAnswers.sessionId, sessionAnswers.questionId],
      set: { selectedOptionId, freeResponseText: null, isCorrect: option.isCorrect, answeredAt: new Date() },
    });

  return { success: true, data: null };
}

export async function submitExamCore(user: SessionUser, sessionId: string): Promise<ActionResult<{ sessionId: string }>> {
  const [session] = await db.select().from(examSessions).where(eq(examSessions.id, sessionId));
  if (!session || session.userId !== user.id) {
    return actionFailure(new AppError("FORBIDDEN"));
  }

  if (session.status === "in_progress") {
    await finalizeSession(db, sessionId, "submitted");

    // Only a full mock is a meaningful enough sample of a student's
    // overall standing to justify a fresh recommendation batch — a
    // 5-question subject_practice rep would otherwise burn the same
    // cooldown window for a much noisier signal. Scheduled via after()
    // so this genuinely never adds latency to the submit → results
    // redirect, even on a cooldown miss.
    if (session.mode === "full_mock") {
      const runRecommendations = () => maybeGenerateRecommendations(db, user.id, user.role, sessionId);
      try {
        after(runRecommendations);
      } catch {
        // after() requires a live Next.js request scope (Server Action /
        // Route Handler) and throws synchronously outside one — e.g. a
        // standalone verification script calling this core function
        // directly. Fire-and-forget inline instead of losing the call.
        void runRecommendations();
      }
    }
  }

  return { success: true, data: { sessionId } };
}

/**
 * Basic anti-cheat telemetry (Phase 4): records that the exam-taking tab
 * lost focus. Logged for staff visibility, not enforced — a browser
 * cannot reliably prevent tab-switching, only report it. Silently a
 * no-op if the session isn't the caller's own or isn't in progress; this
 * is best-effort telemetry, not a security boundary worth erroring over.
 */
export async function logTabSwitchCore(user: SessionUser, sessionId: string): Promise<void> {
  await db
    .update(examSessions)
    .set({ tabSwitchCount: sql`${examSessions.tabSwitchCount} + 1` })
    .where(and(eq(examSessions.id, sessionId), eq(examSessions.userId, user.id), eq(examSessions.status, "in_progress")));
}
