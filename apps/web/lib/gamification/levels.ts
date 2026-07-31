// "Achievement levels" (Phase 11) — a lightweight, points-based title
// tier. Deliberately not its own DB table: it's a pure function of
// total_points (already summed by the `leaderboard` view), so there's
// nothing here that could ever drift from the ledger the way a stored
// column could.
export const LEVELS = [
  { level: 1, title: "Beginner", minPoints: 0 },
  { level: 2, title: "Learner", minPoints: 100 },
  { level: 3, title: "Achiever", minPoints: 300 },
  { level: 4, title: "Expert", minPoints: 700 },
  { level: 5, title: "Master", minPoints: 1500 },
] as const;

export type LevelInfo = {
  level: number;
  title: string;
  pointsIntoLevel: number;
  pointsToNextLevel: number | null; // null at the top level
};

export function computeLevel(totalPoints: number): LevelInfo {
  let current: (typeof LEVELS)[number] = LEVELS[0];
  for (const tier of LEVELS) {
    if (totalPoints >= tier.minPoints) current = tier;
  }
  const next = LEVELS.find((tier) => tier.minPoints > current.minPoints);

  return {
    level: current.level,
    title: current.title,
    pointsIntoLevel: totalPoints - current.minPoints,
    pointsToNextLevel: next ? next.minPoints - totalPoints : null,
  };
}
