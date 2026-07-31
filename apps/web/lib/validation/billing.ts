import { z } from "zod";

export const checkoutPlanSchema = z.enum(["premium", "premium_plus"]);
export type CheckoutPlan = z.infer<typeof checkoutPlanSchema>;
