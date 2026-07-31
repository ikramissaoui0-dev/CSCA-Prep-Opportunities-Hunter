import type { Metadata } from "next";
import { FREE_FULL_MOCK_MONTHLY_LIMIT } from "@/lib/exam/plan-limits";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "FAQ — CSCA Prep",
  description: "Answers to common questions about the CSCA exam, how CSCA Prep works, billing, and account access.",
  alternates: { canonical: "/faq" },
};

const FAQS = [
  {
    question: "What is the CSCA?",
    answer:
      "The CSCA is the entrance exam many Chinese universities use to evaluate international student applicants. CSCA Prep gives you realistic, timed mock exams and targeted practice for it.",
  },
  {
    question: "Is there really a free plan?",
    answer: `Yes. Every account can take ${FREE_FULL_MOCK_MONTHLY_LIMIT} full simulations per month for free, plus unlimited subject practice, difficulty practice, and the daily challenge — no credit card required to sign up.`,
  },
  {
    question: "What do I get if I upgrade?",
    answer:
      "Premium removes the monthly limit on full simulations and unlocks AI-generated explanations, personalized study recommendations, and advanced statistics. Premium+ adds full access to the course library on top of that.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes. You can manage or cancel your subscription anytime from your account's billing page — there's no lock-in period.",
  },
  {
    question: "How does the AI explanation feature work?",
    answer:
      "After you submit an exam, you can request an explanation for any question you missed. It's generated once per question and reused after that, so it's available instantly the next time anyone asks about that same question.",
  },
  {
    question: "Are free-response questions graded automatically?",
    answer: "Yes — free-response answers are graded automatically as part of scoring your exam, on every plan.",
  },
  {
    question: "Is my exam data safe if my connection drops mid-exam?",
    answer:
      "Your answers save as you go, and your session resumes exactly where you left off. Submission is designed so a dropped connection never costs you your progress.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-6 py-16">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Frequently asked questions</h1>
        <p className="mt-3 text-muted-foreground">Everything you need to know before you start.</p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq) => (
          <Card key={faq.question}>
            <CardHeader>
              <CardTitle className="text-base">{faq.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{faq.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </div>
  );
}
