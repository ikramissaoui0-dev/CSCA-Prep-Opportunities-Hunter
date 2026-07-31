import { z } from "zod";

export const explainQuestionSchema = z.object({
  sessionId: z.string().uuid(),
  questionId: z.string().uuid(),
});
export type ExplainQuestionInput = z.infer<typeof explainQuestionSchema>;
