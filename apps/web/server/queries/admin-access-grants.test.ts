import { describe, it, expect } from "vitest";
import { deriveStatus } from "./admin-access-grants";

const FUTURE_FAR = new Date(Date.now() + 400 * 24 * 60 * 60 * 1000); // ~13 months out
const FUTURE_SOON = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000); // 10 days out
const PAST = new Date(Date.now() - 24 * 60 * 60 * 1000);

describe("deriveStatus", () => {
  it("is 'revoked' whenever revokedAt is set, regardless of expiry", () => {
    expect(deriveStatus({ userId: "u1", expiresAt: FUTURE_FAR, revokedAt: new Date() })).toBe("revoked");
  });

  it("is 'expired' once expiresAt is in the past, even if never revoked", () => {
    expect(deriveStatus({ userId: "u1", expiresAt: PAST, revokedAt: null })).toBe("expired");
  });

  it("is 'pending_registration' when there's no linked account yet — scenario B, unredeemed", () => {
    expect(deriveStatus({ userId: null, expiresAt: FUTURE_FAR, revokedAt: null })).toBe("pending_registration");
  });

  it("is 'pending_registration' even with no expiration at all, as long as unlinked", () => {
    expect(deriveStatus({ userId: null, expiresAt: null, revokedAt: null })).toBe("pending_registration");
  });

  it("is 'expiring_soon' within the 30-day window, 'active' outside it", () => {
    expect(deriveStatus({ userId: "u1", expiresAt: FUTURE_SOON, revokedAt: null })).toBe("expiring_soon");
    expect(deriveStatus({ userId: "u1", expiresAt: FUTURE_FAR, revokedAt: null })).toBe("active");
  });

  it("is 'active' for a permanent (null expiresAt), linked, non-revoked grant", () => {
    expect(deriveStatus({ userId: "u1", expiresAt: null, revokedAt: null })).toBe("active");
  });

  it("prioritizes revoked over expired over pending_registration", () => {
    // A grant that is simultaneously revoked, expired, and unlinked is
    // still just "revoked" — that's the one an admin actually cares
    // about (they took it away), not incidental details about timing.
    expect(deriveStatus({ userId: null, expiresAt: PAST, revokedAt: new Date() })).toBe("revoked");
  });
});
