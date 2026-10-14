import { NextResponse, type NextRequest } from "next/server";
import { serverEnv } from "@/lib/env";
import { syncExamSchedule } from "@/lib/examSchedule/sync";
import { logger } from "@/lib/logger";

// Vercel Cron invokes this on vercel.json's schedule, sending
// `Authorization: Bearer ${CRON_SECRET}` automatically whenever that
// env var is set on the project — the same convention Vercel's own
// cron docs recommend, so this route can't be hit by an arbitrary
// caller and used to spam csca.cn or overwrite the schedule table.
export async function GET(request: NextRequest): Promise<NextResponse> {
  if (!serverEnv.CRON_SECRET) {
    return NextResponse.json({ error: "CRON_SECRET is not configured" }, { status: 500 });
  }
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${serverEnv.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await syncExamSchedule();
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    logger.error({ err: (error as Error).message }, "exam_schedule_sync_failed");
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 502 });
  }
}
