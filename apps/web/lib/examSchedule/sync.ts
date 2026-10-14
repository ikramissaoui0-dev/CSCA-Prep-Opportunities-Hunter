import "server-only";

import { db } from "@/lib/db";
import { examScheduleSessions } from "@csca/db";
import { logger } from "@/lib/logger";

// csca.cn's own homepage data feed — the exact JSON that powers their
// "考试日期" (exam dates) cards at csca.cn/home, found via that page's
// network requests. Not an HTML scrape: a stable, documented-by-use
// JSON endpoint the official site itself depends on, so it's at least
// as reliable a source as the page markup would be, and far less
// fragile than parsing rendered HTML/CSS would be.
const CSCA_SCHEDULE_API = "https://csca.cn/sv/open/getConfByCode?confCode=SY_KSRQ";

type CscaScheduleResponse = {
  code: string;
  success: boolean;
  data?: {
    // The schedule itself arrives JSON-encoded a second time, inside
    // this string field — csca.cn's own API shape, not a choice made
    // here.
    confContent: string;
  };
};

type CscaSession = {
  id: number | string;
  examDate: string; // "2026-11-14"
  examDateEnd: string; // "2026-11-15"
  signupTime: string; // "2026.10.15 15:00-2026.10.21 23:59", or "" when not yet announced
  status: { zt: number; zh: string; en: string };
};

const SIGNUP_TIME_PATTERN = /^(\d{4})\.(\d{2})\.(\d{2}) (\d{2}:\d{2})-(\d{4})\.(\d{2})\.(\d{2}) (\d{2}:\d{2})$/;

// csca.cn labels this field "报名时间（北京时间）" — Beijing time, a
// fixed UTC+8 offset with no DST to worry about.
function parseSignupWindow(raw: string): { start: Date | null; end: Date | null } {
  const match = SIGNUP_TIME_PATTERN.exec(raw.trim());
  if (!match) return { start: null, end: null };
  const [, sy, sm, sd, st, ey, em, ed, et] = match;
  const start = new Date(`${sy}-${sm}-${sd}T${st}:00+08:00`);
  const end = new Date(`${ey}-${em}-${ed}T${et}:00+08:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return { start: null, end: null };
  return { start, end };
}

export type SyncExamScheduleResult = { synced: number };

/**
 * Pulls the current session list from csca.cn and replaces this
 * table's contents with it (delete-all-then-reinsert, inside one
 * transaction) — the upstream list is small (routinely under 10 rows)
 * and this guarantees the table is an exact mirror of the source with
 * no drift from a session csca.cn later removed or renumbered, rather
 * than trying to diff and patch it.
 */
export async function syncExamSchedule(): Promise<SyncExamScheduleResult> {
  const res = await fetch(CSCA_SCHEDULE_API, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`csca.cn schedule fetch failed: HTTP ${res.status}`);
  }
  const body = (await res.json()) as CscaScheduleResponse;
  if (!body.success || !body.data?.confContent) {
    throw new Error(`csca.cn schedule response missing data: ${JSON.stringify(body).slice(0, 500)}`);
  }

  let sessions: CscaSession[];
  try {
    sessions = JSON.parse(body.data.confContent);
  } catch (error) {
    throw new Error(`csca.cn schedule confContent was not valid JSON: ${(error as Error).message}`);
  }
  if (!Array.isArray(sessions) || sessions.length === 0) {
    throw new Error("csca.cn schedule returned an empty or non-array session list — refusing to wipe existing data");
  }

  const rows = sessions.map((s) => {
    const { start, end } = parseSignupWindow(s.signupTime ?? "");
    return {
      sourceId: String(s.id),
      examStart: s.examDate,
      examEnd: s.examDateEnd,
      signupStart: start,
      signupEnd: end,
      signupTextRaw: s.signupTime || null,
      statusZh: s.status?.zh ?? null,
      statusEn: s.status?.en ?? null,
    };
  });

  await db.transaction(async (tx) => {
    await tx.delete(examScheduleSessions);
    await tx.insert(examScheduleSessions).values(rows);
  });

  logger.info({ synced: rows.length }, "exam_schedule_synced");
  return { synced: rows.length };
}
