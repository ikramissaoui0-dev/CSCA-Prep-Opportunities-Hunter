import "server-only";

import { eq, desc, and, gte } from "drizzle-orm";
import { aiRecommendations, topicMastery, questionCategories, subjects, examResults, examSessions, type Database } from "@csca/db";
import type { UserRole } from "@csca/types";
import { logger } from "@/lib/logger";
import { getCurrentPlanTier, planTierAtLeast } from "@/lib/billing/plan";
import { openaiClient, AI_MODEL_VERSION, type AiClient } from "./client";

// Bounds OpenAI spend per student to at most one recommendation batch
// every 6 hours, regardless of how many full mock exams they take in
// that window — the dashboard already has 3+ years of runway on the
// existing rows whenever this is skipped (getStudentDashboardData falls
// back to rule-based suggestions only when there are zero rows at all).
const COOLDOWN_MS = 6 * 60 * 60 * 1000;

// mastery_score starts at a neutral 0.5 default with zero evidence behind
// it — the same noise floor used for the dashboard's weak/strong split
// (server/queries/dashboard.ts), kept in sync here for the same reason.
const MIN_ATTEMPTS_FOR_SIGNAL = 3;
const MAX_WEAK_AREAS = 3;

/**
 * Best-effort: called after a full_mock session finalizes (see
 * submitExamCore), never awaited on the critical submit path. Any
 * failure — cooldown aside — is logged and swallowed; a broken AI
 * provider must never be the reason a student can't submit an exam.
 */
export async function maybeGenerateRecommendations(
  db: Database,
  userId: string,
  userRole: UserRole,
  sessionId: string,
  client: AiClient = openaiClient,
): Promise<void> {
  try {
    // AI recommendations are a Premium feature (Phase 9's plan matrix) —
    // checked first, before the cooldown/mastery queries, so a free-tier
    // student's exam submissions never spend a DB round-trip on a
    // feature they can't see anyway, let alone an OpenAI call.
    const planTier = await getCurrentPlanTier(userId, userRole);
    if (!planTierAtLeast(planTier, "premium")) {
      return;
    }

    const [recent] = await db
      .select({ generatedAt: aiRecommendations.generatedAt })
      .from(aiRecommendations)
      .where(eq(aiRecommendations.userId, userId))
      .orderBy(desc(aiRecommendations.generatedAt))
      .limit(1);

    if (recent && Date.now() - recent.generatedAt.getTime() < COOLDOWN_MS) {
      return;
    }

    const masteryRows = await db
      .select({
        categoryId: topicMastery.categoryId,
        categoryName: questionCategories.name,
        subjectName: subjects.name,
        masteryScore: topicMastery.masteryScore,
      })
      .from(topicMastery)
      .innerJoin(questionCategories, eq(questionCategories.id, topicMastery.categoryId))
      .innerJoin(subjects, eq(subjects.id, questionCategories.subjectId))
      .where(and(eq(topicMastery.userId, userId), gte(topicMastery.questionsAttempted, MIN_ATTEMPTS_FOR_SIGNAL)));

    if (masteryRows.length === 0) {
      return;
    }

    const weakAreas = [...masteryRows].sort((a, b) => a.masteryScore - b.masteryScore).slice(0, MAX_WEAK_AREAS);

    const [latestResult] = await db
      .select({ percentage: examResults.percentage })
      .from(examResults)
      .innerJoin(examSessions, eq(examSessions.id, examResults.sessionId))
      .where(eq(examSessions.userId, userId))
      .orderBy(desc(examSessions.submittedAt))
      .limit(1);

    const drafts = await client.draftRecommendations({
      weakAreas: weakAreas.map((w) => ({ subjectName: w.subjectName, categoryName: w.categoryName, masteryScore: w.masteryScore })),
      recentPercentage: latestResult?.percentage ?? null,
    });

    if (drafts.length === 0) return;

    const categoryIdByName = new Map(weakAreas.map((w) => [w.categoryName, w.categoryId]));

    await db.insert(aiRecommendations).values(
      drafts.map((d) => ({
        userId,
        type: d.type,
        title: d.title,
        content: d.content,
        relatedCategoryId: d.categoryName ? (categoryIdByName.get(d.categoryName) ?? null) : null,
        relatedSessionId: sessionId,
        modelVersion: AI_MODEL_VERSION,
      })),
    );
  } catch (error) {
    logger.error({ err: error, userId, sessionId }, "AI recommendation generation failed");
  }
}
