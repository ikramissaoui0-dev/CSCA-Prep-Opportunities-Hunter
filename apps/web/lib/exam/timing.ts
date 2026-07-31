/**
 * Null time_limit_seconds means untimed practice — no deadline, never expires.
 */
export function computeDeadline(startedAt: Date, timeLimitSeconds: number | null): Date | null {
  if (timeLimitSeconds === null) return null;
  return new Date(startedAt.getTime() + timeLimitSeconds * 1000);
}

export function isPastDeadline(startedAt: Date, timeLimitSeconds: number | null, now: Date = new Date()): boolean {
  const deadline = computeDeadline(startedAt, timeLimitSeconds);
  return deadline !== null && now.getTime() > deadline.getTime();
}

/**
 * Elapsed time capped at the time limit — without this, a session
 * abandoned for days before being lazily swept would report "3 days
 * spent on a 30-minute exam" instead of the sane ~30 minutes.
 */
export function computeTimeSpentSeconds(startedAt: Date, timeLimitSeconds: number | null, now: Date = new Date()): number {
  const actualElapsed = Math.max(0, Math.round((now.getTime() - startedAt.getTime()) / 1000));
  return timeLimitSeconds === null ? actualElapsed : Math.min(actualElapsed, timeLimitSeconds);
}
