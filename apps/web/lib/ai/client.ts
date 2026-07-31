import "server-only";

import OpenAI from "openai";
import { serverEnv } from "@/lib/env";
import { AppError } from "@/lib/errors";

// gpt-4o-mini: cheap and fast enough to run per-question at 100k+ student
// scale, while still being good enough for short-answer grading and
// tutoring explanations. Stored alongside every generated row (explanations
// .model_version, ai_recommendations.model_version) so a future model
// upgrade can be told apart from stale content instead of silently mixing.
const MODEL = "gpt-4o-mini";
export const AI_MODEL_VERSION = MODEL;

let cachedClient: OpenAI | undefined;

function getClient(): OpenAI {
  if (!serverEnv.OPENAI_API_KEY) {
    throw new AppError("PROVIDER_ERROR", "AI features aren't configured on this server yet.");
  }
  if (!cachedClient) {
    cachedClient = new OpenAI({ apiKey: serverEnv.OPENAI_API_KEY, timeout: 20_000 });
  }
  return cachedClient;
}

export type RecommendationDraft = {
  type: "study_plan" | "revision" | "learning_strategy";
  title: string;
  content: string;
  categoryName?: string;
};

/**
 * Everything the app's AI features need, expressed as an interface so
 * core logic (lib/ai/*.ts) can be exercised against a fake in tests
 * without a network call or an API key — only `openaiClient` below talks
 * to the real API.
 */
export interface AiClient {
  gradeFreeResponse(input: { title: string; body: string; correctAnswerText: string; studentAnswer: string }): Promise<boolean>;
  explainQuestion(input: {
    title: string;
    body: string;
    options: { content: string; isCorrect: boolean }[];
    correctAnswerText: string | null;
  }): Promise<string>;
  draftRecommendations(input: {
    weakAreas: { subjectName: string; categoryName: string; masteryScore: number }[];
    recentPercentage: number | null;
  }): Promise<RecommendationDraft[]>;
}

const RECOMMENDATION_TYPES = new Set(["study_plan", "revision", "learning_strategy"]);

export const openaiClient: AiClient = {
  async gradeFreeResponse({ title, body, correctAnswerText, studentAnswer }) {
    const completion = await getClient().chat.completions.create({
      model: MODEL,
      temperature: 0,
      messages: [
        {
          role: "system",
          content: 'You are grading a short-answer exam question. Respond with exactly one word: "correct" or "incorrect".',
        },
        {
          role: "user",
          content: `Question: ${title}\n${body}\n\nModel answer: ${correctAnswerText}\n\nStudent answer: ${studentAnswer}\n\nDoes the student's answer capture the same core meaning as the model answer? Minor wording differences are fine.`,
        },
      ],
    });
    const verdict = completion.choices[0]?.message.content?.trim().toLowerCase() ?? "";
    return verdict.startsWith("correct");
  },

  async explainQuestion({ title, body, options, correctAnswerText }) {
    const optionsList = options
      .map((o, i) => `${String.fromCharCode(65 + i)}. ${o.content}${o.isCorrect ? " (correct answer)" : ""}`)
      .join("\n");
    const completion = await getClient().chat.completions.create({
      model: MODEL,
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content:
            "You are a patient CSCA exam tutor. In 2-4 short sentences, explain why the correct answer is right and briefly why the others are wrong. Be concise and encouraging, and never repeat the full question back verbatim.",
        },
        {
          role: "user",
          content: `Question: ${title}\n${body}\n\n${optionsList || `Expected answer: ${correctAnswerText ?? "(not provided)"}`}`,
        },
      ],
    });
    return completion.choices[0]?.message.content?.trim() ?? "";
  },

  async draftRecommendations({ weakAreas, recentPercentage }) {
    const areasList = weakAreas.map((a) => `- ${a.categoryName} (${a.subjectName}): ${Math.round(a.masteryScore * 100)}% mastery`).join("\n");
    const completion = await getClient().chat.completions.create({
      model: MODEL,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            'You are a CSCA exam-prep coach. Given a student\'s weakest topics, draft up to 3 short, actionable study recommendations as JSON: {"recommendations": [{"type": "study_plan" | "revision" | "learning_strategy", "title": string, "content": string, "categoryName": string | null}]}. Keep title under 60 characters and content under 240 characters. Be specific to the topics given, not generic.',
        },
        {
          role: "user",
          content: `Recent mock exam score: ${recentPercentage === null ? "n/a" : `${recentPercentage}%`}\n\nWeakest topics:\n${areasList}`,
        },
      ],
    });

    const raw = completion.choices[0]?.message.content ?? "{}";
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return [];
    }

    const list = (parsed as { recommendations?: unknown })?.recommendations;
    if (!Array.isArray(list)) return [];

    return list
      .filter((r): r is Record<string, unknown> => typeof r === "object" && r !== null)
      .filter((r) => typeof r.title === "string" && typeof r.content === "string")
      .slice(0, 3)
      .map((r) => ({
        type: RECOMMENDATION_TYPES.has(r.type as string) ? (r.type as RecommendationDraft["type"]) : "study_plan",
        title: (r.title as string).slice(0, 120),
        content: (r.content as string).slice(0, 500),
        categoryName: typeof r.categoryName === "string" ? r.categoryName : undefined,
      }));
  },
};
