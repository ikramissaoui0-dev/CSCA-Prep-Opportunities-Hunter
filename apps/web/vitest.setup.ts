// lib/env.ts validates and throws at import time if these are missing —
// correct behavior for the real app (fail fast on misconfiguration), but
// it means anything that transitively imports it (lib/db.ts, lib/stripe/
// client.ts, lib/rate-limit.ts, ...) needs *some* value present before a
// single test file loads. These are dummy, never-dialed values — no test
// here ever makes a real network call to Supabase.
process.env.NEXT_PUBLIC_SUPABASE_URL ??= "https://test.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??= "test-anon-key";
process.env.SUPABASE_SERVICE_ROLE_KEY ??= "test-service-role-key";
process.env.DATABASE_URL ??= "postgres://test:test@localhost:5432/test";

// Deterministic values for tests that exercise the price-id -> plan-tier
// mapping (lib/stripe/client.ts) — arbitrary strings, not real Stripe ids.
process.env.STRIPE_PRICE_PREMIUM_MONTHLY ??= "price_test_premium";
process.env.STRIPE_PRICE_PREMIUM_PLUS_MONTHLY ??= "price_test_premium_plus";
