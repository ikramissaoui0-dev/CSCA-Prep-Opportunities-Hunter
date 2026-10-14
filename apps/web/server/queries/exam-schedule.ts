import "server-only";

import { asc } from "drizzle-orm";
import { examScheduleSessions } from "@csca/db";
import { db } from "@/lib/db";

export type UpcomingExamSession = {
  session: string; // "November 2026"
  examDates: string; // "Nov 14–15, 2026"
  registration: string | null; // "Oct 15–21, 2026", or null if not yet announced
  status: string; // "Registration opening soon" / "Registration open" / "Registration closed" / "Registration not yet open"
};

const MONTH_FMT = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" });
const MONTH_YEAR_FMT = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" });

function formatDateRange(start: Date, end: Date): string {
  const year = start.getUTCFullYear();
  const startDay = start.getUTCDate();
  const endDay = end.getUTCDate();
  if (start.getUTCMonth() === end.getUTCMonth() && year === end.getUTCFullYear()) {
    return `${MONTH_FMT.format(start)} ${startDay}–${endDay}, ${year}`;
  }
  return `${MONTH_FMT.format(start)} ${startDay} – ${MONTH_FMT.format(end)} ${endDay}, ${end.getUTCFullYear()}`;
}

// A session is "opening soon" once its registration window is within
// this many days — otherwise it just reads as a future, already-known
// open date rather than something to act on now.
const OPENING_SOON_WINDOW_DAYS = 30;

function describeStatus(signupStart: Date | null, signupEnd: Date | null): string {
  if (!signupStart || !signupEnd) return "Registration not yet open";
  const now = new Date();
  if (now < signupStart) {
    const daysUntil = (signupStart.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return daysUntil <= OPENING_SOON_WINDOW_DAYS ? "Registration opening soon" : "Registration not yet open";
  }
  if (now <= signupEnd) return "Registration open";
  return "Registration closed";
}

/**
 * Reads the exam schedule table kept in sync with csca.cn (see
 * lib/examSchedule/sync.ts) — genuinely public reference data with no
 * per-user scope, so this goes through the elevated `db` client rather
 * than withRlsContext, the same reasoning lib/db.ts documents for
 * trusted server-only reads.
 */
export async function getUpcomingExamSessions(): Promise<UpcomingExamSession[]> {
  const rows = await db.select().from(examScheduleSessions).orderBy(asc(examScheduleSessions.examStart));

  return rows.map((row) => {
    const examStart = new Date(`${row.examStart}T00:00:00Z`);
    const examEnd = new Date(`${row.examEnd}T00:00:00Z`);
    return {
      session: MONTH_YEAR_FMT.format(examStart),
      examDates: formatDateRange(examStart, examEnd),
      registration: row.signupStart && row.signupEnd ? formatDateRange(row.signupStart, row.signupEnd) : null,
      status: describeStatus(row.signupStart, row.signupEnd),
    };
  });
}
