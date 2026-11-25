// Integration test for admin-granted free access (student_access_grants,
// the extended current_user_plan_tier(), and the handle_new_user
// registration trigger) — needs a real Postgres with
// supabase/migrations/*.sql applied, same requirement and the same
// DATABASE_URL_FOR_TESTS / `npm run test:integration` entry point as
// lib/exam/actions-core.integration.test.ts (see that file's header for
// the full explanation, including why this couldn't be executed in the
// sandbox this was authored in).
//
// Covers every DB-dependent scenario from this feature's test plan:
// granting to an existing vs. unregistered student, registration
// auto-linking (both the authorized and unauthorized case), expiration,
// extend/revoke + audit trail, a student attempting to write their own
// grant (RLS must refuse it), and the paid-subscription-plus-free-grant
// interaction (current_user_plan_tier() takes the higher of the two).
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import postgres from "postgres";
import { sql, eq } from "drizzle-orm";
import { createDbClient, studentAccessGrants, auditLogs, subscriptions, type Database } from "@csca/db";
import type { SessionUser } from "@/lib/auth/session";
import { grantFreeAccessCore, updateAccessGrantCore, revokeAccessGrantCore } from "./access-grants-actions-core";
import { normalizeEmail } from "@/lib/validation/access-grants";
import { withRlsContext as makeRlsContext } from "@/lib/db";

const TEST_DATABASE_URL = process.env.DATABASE_URL_FOR_TESTS;

async function isReachable(url: string): Promise<boolean> {
  try {
    const probe = postgres(url, { connect_timeout: 3, max: 1 });
    await probe`select 1`;
    await probe.end({ timeout: 1 });
    return true;
  } catch {
    return false;
  }
}

const reachable = TEST_DATABASE_URL ? await isReachable(TEST_DATABASE_URL) : false;

if (!reachable) {
  console.warn(
    "[integration] Skipping access-grants integration tests — set DATABASE_URL_FOR_TESTS to a reachable " +
      "throwaway Postgres (migrations applied) to run them. See this file's header comment.",
  );
}

describe.skipIf(!reachable)("admin-granted free access — database operations", () => {
  let db: Database;
  let adminId: string;
  const admin: () => SessionUser = () => ({ id: adminId, email: "admin-integration-test@example.com", role: "admin" });
  const createdUserIds: string[] = [];

  async function createTestUser(email: string, role: "student" | "admin" = "student"): Promise<string> {
    const rows = await db.execute<{ id: string }>(sql`insert into auth.users (id, email) values (gen_random_uuid(), ${email}) returning id`);
    const id = rows[0]!.id;
    // handle_new_user() already inserted a profiles row via the trigger —
    // only bump the role here when the test needs something other than
    // the default 'student'.
    if (role !== "student") {
      await db.execute(sql`update public.profiles set role = ${role} where id = ${id}`);
    }
    createdUserIds.push(id);
    return id;
  }

  /** Reads current_user_plan_tier() as if the given user were the
   * authenticated caller — the same JWT-claims simulation withRlsContext
   * uses, inlined here since this test wants the raw tier, not a
   * business-logic wrapper around it. */
  async function planTierAs(userId: string, role: "student" | "admin" = "student"): Promise<string> {
    return db.transaction(async (tx) => {
      await tx.execute(sql`select set_config('request.jwt.claims', ${JSON.stringify({ sub: userId, user_role: role })}, true)`);
      await tx.execute(sql`set local role authenticated`);
      const rows = await tx.execute<{ tier: string }>(sql`select public.current_user_plan_tier() as tier`);
      return rows[0]!.tier;
    });
  }

  beforeAll(async () => {
    db = createDbClient(TEST_DATABASE_URL!);
    adminId = await createTestUser("admin-integration-test@example.com", "admin");
  });

  afterAll(async () => {
    // student_access_grants.user_id is ON DELETE SET NULL (by design —
    // a grant's history outlives the account it was linked to), so
    // deleting auth.users alone wouldn't remove these rows; clean them
    // up explicitly by the same test-email pattern every test in this
    // file uses.
    await db.execute(sql`delete from public.student_access_grants where email like '%@example.com'`);
    await db.execute(sql`delete from public.subscriptions where stripe_customer_id like 'cus_test_integration%'`);
    for (const id of createdUserIds) {
      await db.execute(sql`delete from auth.users where id = ${id}`);
    }
  });

  it("1. grants access to an existing student and links it immediately", async () => {
    const email = "existing-student@example.com";
    const userId = await createTestUser(email);

    const result = await grantFreeAccessCore(admin(), { email, grantedTier: "premium_plus", expirationOption: "12m" });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.wasExisting).toBe(false);

    const [grant] = await db.select().from(studentAccessGrants).where(eq(studentAccessGrants.id, result.data.grantId));
    expect(grant?.userId).toBe(userId);
    expect(await planTierAs(userId)).toBe("premium_plus");
  });

  it("2. grants access to an email with no account — stays unlinked (pending registration)", async () => {
    const email = "not-registered-yet@example.com";
    const result = await grantFreeAccessCore(admin(), { email, grantedTier: "premium", expirationOption: "12m" });
    expect(result.success).toBe(true);
    if (!result.success) return;

    const [grant] = await db.select().from(studentAccessGrants).where(eq(studentAccessGrants.id, result.data.grantId));
    expect(grant?.userId).toBeNull();
  });

  it("3. an authorized email registering later gets auto-linked by the signup trigger", async () => {
    const email = "authorized-future-signup@example.com";
    const grantResult = await grantFreeAccessCore(admin(), { email, grantedTier: "premium_plus", expirationOption: "12m" });
    expect(grantResult.success).toBe(true);
    if (!grantResult.success) return;

    // Raw insert into auth.users, same as GoTrue's own signup path would
    // do — Postgres triggers fire regardless of which client issued the
    // INSERT, so this genuinely exercises handle_new_user().
    const userId = await createTestUser(email);

    const [grant] = await db.select().from(studentAccessGrants).where(eq(studentAccessGrants.id, grantResult.data.grantId));
    expect(grant?.userId).toBe(userId);

    const [auditRow] = await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.action, "access_auto_linked_at_registration"))
      .orderBy(sql`created_at desc`)
      .limit(1);
    expect(auditRow?.targetId).toBe(grantResult.data.grantId);
  });

  it("4. an unauthorized email registering gets no grant and no free access", async () => {
    const email = "never-granted-anything@example.com";
    const userId = await createTestUser(email);
    expect(await planTierAs(userId)).toBe("free");

    const [grant] = await db.select().from(studentAccessGrants).where(eq(studentAccessGrants.userId, userId));
    expect(grant).toBeUndefined();
  });

  it("5. an expired grant no longer grants premium tier", async () => {
    const email = "expired-grant@example.com";
    const userId = await createTestUser(email);
    const [{ id: grantId }] = await db
      .insert(studentAccessGrants)
      .values({
        email: normalizeEmail(email),
        userId,
        grantedTier: "premium_plus",
        grantedBy: adminId,
        expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
      })
      .returning({ id: studentAccessGrants.id });

    expect(await planTierAs(userId)).toBe("free");
    await db.delete(studentAccessGrants).where(eq(studentAccessGrants.id, grantId));
  });

  it("6. extending access moves the expiration date out and logs it", async () => {
    const email = "extend-me@example.com";
    await createTestUser(email);
    const granted = await grantFreeAccessCore(admin(), { email, grantedTier: "premium", expirationOption: "7d" });
    if (!granted.success) throw new Error("setup failed");

    const extended = await updateAccessGrantCore(admin(), { grantId: granted.data.grantId, expirationOption: "12m" });
    expect(extended.success).toBe(true);

    const [grant] = await db.select().from(studentAccessGrants).where(eq(studentAccessGrants.id, granted.data.grantId));
    const daysUntilExpiry = (grant!.expiresAt!.getTime() - Date.now()) / (24 * 60 * 60 * 1000);
    expect(daysUntilExpiry).toBeGreaterThan(300); // ~12 months, comfortably more than the original 7 days

    const [auditRow] = await db.select().from(auditLogs).where(eq(auditLogs.action, "access_extended")).orderBy(sql`created_at desc`).limit(1);
    expect(auditRow?.targetId).toBe(granted.data.grantId);
  });

  it("7. revoking access removes premium tier immediately and logs it", async () => {
    const email = "revoke-me@example.com";
    const userId = await createTestUser(email);
    const granted = await grantFreeAccessCore(admin(), { email, grantedTier: "premium_plus", expirationOption: "12m" });
    if (!granted.success) throw new Error("setup failed");
    expect(await planTierAs(userId)).toBe("premium_plus");

    const revoked = await revokeAccessGrantCore(admin(), granted.data.grantId);
    expect(revoked.success).toBe(true);
    expect(await planTierAs(userId)).toBe("free");

    const [auditRow] = await db.select().from(auditLogs).where(eq(auditLogs.action, "access_revoked")).orderBy(sql`created_at desc`).limit(1);
    expect(auditRow?.targetId).toBe(granted.data.grantId);
  });

  it("8/9. a student (non-admin) cannot write their own access grant — RLS refuses it, not just the UI", async () => {
    const email = "self-granting-student@example.com";
    const userId = await createTestUser(email);

    // student_access_grants has no INSERT policy for `authenticated` at
    // all (see 0012_student_access_grants.sql) — this must fail at the
    // database layer even with a genuine, valid student session, which
    // is the actual proof this spec's security section asks for.
    await expect(
      makeRlsContext(userId, "student", (tx) =>
        tx.insert(studentAccessGrants).values({
          email: normalizeEmail(email),
          userId,
          grantedTier: "premium_plus",
          grantedBy: userId,
        }),
      ),
    ).rejects.toThrow();
  });

  it("10. an active paid subscription and an active free grant both present — the higher tier wins", async () => {
    const email = "both-sub-and-grant@example.com";
    const userId = await createTestUser(email);

    await db.insert(subscriptions).values({
      userId,
      planTier: "premium",
      status: "active",
      stripeCustomerId: "cus_test_integration",
      stripeSubscriptionId: `sub_test_${userId}`,
      stripePriceId: "price_test_integration",
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    const granted = await grantFreeAccessCore(admin(), { email, grantedTier: "premium_plus", expirationOption: "12m" });
    if (!granted.success) throw new Error("setup failed");

    // premium_plus (the grant) outranks premium (the subscription).
    expect(await planTierAs(userId)).toBe("premium_plus");
  });

  it("11. free access expires but the paid subscription remains active — subscription tier applies", async () => {
    const email = "grant-expires-sub-stays@example.com";
    const userId = await createTestUser(email);

    await db.insert(subscriptions).values({
      userId,
      planTier: "premium",
      status: "active",
      stripeCustomerId: "cus_test_integration_2",
      stripeSubscriptionId: `sub_test_2_${userId}`,
      stripePriceId: "price_test_integration",
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    await db.insert(studentAccessGrants).values({
      email: normalizeEmail(email),
      userId,
      grantedTier: "premium_plus",
      grantedBy: adminId,
      expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // already expired
    });

    expect(await planTierAs(userId)).toBe("premium"); // falls back to the subscription, not 'free'
  });

  it("12. a case/whitespace-variant email is treated as the same grant, never a duplicate", async () => {
    const canonical = "case-variant-test@example.com";

    const first = await grantFreeAccessCore(admin(), { email: "  Case-Variant-Test@Example.com  ", grantedTier: "premium", expirationOption: "12m" });
    expect(first.success).toBe(true);
    const second = await grantFreeAccessCore(admin(), { email: "case-variant-test@example.com", grantedTier: "premium_plus", expirationOption: "6m" });
    expect(second.success).toBe(true);
    if (!first.success || !second.success) return;

    expect(second.data.wasExisting).toBe(true);
    expect(second.data.grantId).toBe(first.data.grantId);

    const rows = await db.select().from(studentAccessGrants).where(eq(studentAccessGrants.email, canonical));
    expect(rows).toHaveLength(1);
    expect(rows[0]!.grantedTier).toBe("premium_plus"); // the second call's update won
  });
});
