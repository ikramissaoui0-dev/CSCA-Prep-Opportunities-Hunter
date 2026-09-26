// File-based blog content (Phase 12) — there's no CMS or blog_posts
// table in this app, and adding one wasn't asked for; a public marketing
// blog with a handful of evergreen posts is simplest as data checked
// into the repo, the same way subjects/categories have no dedicated
// admin CRUD screen either. If editorial volume ever grows past what's
// comfortable to ship as code, that's the trigger to revisit this.
export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string; // ISO date
  author: string;
  content: string[]; // paragraphs
};

export const blogPosts: BlogPost[] = [
  {
    slug: "what-is-the-csca",
    title: "What Is the CSCA, and Who Needs to Take It?",
    description:
      "A plain-language introduction to the CSCA exam for international students applying to study in China — what it tests, who requires it, and how it's scored.",
    publishedAt: "2026-01-15",
    author: "Opportunities Hunter Team",
    content: [
      "The CSCA (Chinese University entrance exam for international students) is the standardized assessment many Chinese universities use to evaluate international applicants before admission. Unlike a general language test, it's designed specifically around the academic readiness of students who didn't grow up in the Chinese education system.",
      "If you're applying to an undergraduate or graduate program in China as an international student, you'll likely encounter some version of this exam — either as a direct admission requirement or as part of a placement process once you arrive.",
      "The exam typically spans several subject areas, and the exact composition can vary by university and program. That's exactly why realistic, full-length mock exams matter: knowing the format cold on exam day removes one entire category of stress, leaving you free to focus on the actual questions.",
      "In later posts, we'll break down each subject area and what a strong study plan looks like in the weeks leading up to your test date.",
    ],
  },
  {
    slug: "five-tips-for-your-mock-exam",
    title: "5 Tips to Get the Most Out of Your CSCA Mock Exam",
    description: "Practical advice for turning a timed mock exam into your most effective study tool, not just a stress test.",
    publishedAt: "2026-02-03",
    author: "Opportunities Hunter Team",
    content: [
      "1. Treat the clock as part of the test. Most students lose points not because they don't know the material, but because they run out of time on questions they could have answered correctly with more time. Practicing under the same time pressure you'll face on exam day is the only way to build real pacing instinct.",
      "2. Review every wrong answer, not just your score. A 62% tells you almost nothing about what to study next. Going question-by-question through what you missed — and why — is where the actual learning happens.",
      "3. Don't skip the free-response questions. They're worth the same as multiple choice, and skipping them out of nerves is a guaranteed zero. A partial, imperfect answer almost always beats no answer.",
      "4. Space out your full simulations. Taking a full mock exam every single day usually just leads to burnout without much extra signal. A full simulation once every week or two, with focused subject practice in between, tends to build skill faster.",
      "5. Track your weak subjects deliberately. If the same topic keeps showing up in your wrong answers, that's exactly where your next study session should go — not wherever feels most comfortable.",
    ],
  },
  {
    slug: "how-explanations-help-you-learn-faster",
    title: "How Personalized Explanations Help You Learn Faster",
    description: "Why an instant, specific explanation for a wrong answer is worth more than a generic answer key — and how we keep that affordable at scale.",
    publishedAt: "2026-03-10",
    author: "Opportunities Hunter Team",
    content: [
      "A bare answer key tells you what the right answer was. It doesn't tell you why your reasoning went wrong — and that gap is exactly where most students get stuck re-making the same mistake on a different version of the same question.",
      "When you miss a question in your exam review, we generate a short, specific explanation: why the correct answer is right, and briefly why the option you picked wasn't. It reads like a patient tutor sitting next to you, not a wall of text.",
      "Every explanation is generated once per question and reused for every student after that — so the same question never needs to be explained twice from scratch. That's what makes it possible to offer this without the cost scaling with how many students are practicing.",
      "Explanations are available after you've completed a session, so you can review with full context — never mid-exam, where it would just be an answer key in disguise.",
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
