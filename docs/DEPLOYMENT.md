# Deployment — Phase 15

This is a manual checklist, not automation — every step here requires access to
an account (Vercel, Supabase, Stripe, ...) that only you have. Nothing in this
repo can complete these steps on its own.

**Required to run at all:** Vercel + Supabase.
**Optional, degrade gracefully when unset:** Stripe, OpenAI, Resend, Upstash,
Sentry — see each one's comment in `apps/web/.env.example` for exactly what
stops working without it.

---

## 1. Supabase (production project)

1. Create a new project at [supabase.com](https://supabase.com) (or a
   dedicated one per environment if you want separate staging/production
   projects — recommended).
2. Link the CLI and push the schema:
   ```bash
   supabase link --project-ref <your-project-ref>
   supabase db push
   ```
   This applies every file in `supabase/migrations/` in order. It's the same
   schema this repo's CI validates on every push (see `.github/workflows/ci.yml`'s
   `migration-dry-run` job) — if that job is green, this push should be too.
3. **Custom access token hook — manual step, easy to miss.** `supabase/config.toml`'s
   `[auth.hook.custom_access_token]` only applies to `supabase start` (local dev).
   On a hosted project you must wire this up yourself:
   Dashboard → Authentication → Hooks → Customize Access Token (JWT) Claims →
   point it at `public.custom_access_token_hook` (created by
   `0001_auth_foundation.sql`). Without this, every JWT is missing `user_role`
   and every RLS policy that checks it silently denies everyone.
4. Enable Google OAuth: Dashboard → Authentication → Providers → Google, add
   your OAuth client ID/secret, and set the redirect URL to
   `https://<your-domain>/auth/callback`.
5. Enable Point-in-Time Recovery: Dashboard → Database → Backups. The free
   tier doesn't include this — worth it once there's real user data.
6. Deploy the Stripe webhook Edge Function (skip if not using Stripe yet):
   ```bash
   supabase functions deploy stripe-webhook
   supabase secrets set STRIPE_SECRET_KEY=... STRIPE_WEBHOOK_SECRET=... \
     STRIPE_PRICE_PREMIUM_MONTHLY=... STRIPE_PRICE_PREMIUM_PLUS_MONTHLY=...
   ```
   Note these are Edge Function secrets — a completely separate store from
   Vercel's environment variables, even though some names overlap. See
   `supabase/functions/stripe-webhook/index.ts`'s header comment.

## 2. Vercel

1. Import this repo. Under Project Settings → General → **Root Directory**,
   set it to `apps/web` — this is an npm workspaces monorepo, so Vercel won't
   find the app at the repo root.
2. Project Settings → Environment Variables: add every variable from
   `apps/web/.env.example` that you're actually using. At minimum:
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL` (the **pooled** connection
   string from Supabase, not the direct one), `NEXT_PUBLIC_SITE_URL`.
3. Vercel Analytics and Speed Insights need no configuration — they're already
   wired into `app/layout.tsx` and activate automatically once the app is
   running on Vercel's infrastructure. Turn them on under Project Settings →
   Analytics / Speed Insights if they don't appear active by default.
4. Production deploys are a manual promotion by design (see
   `docs/ARCHITECTURE.md`'s deployment strategy) — merges to `main` deploy to
   preview/staging; promote to production explicitly once you've checked it.

## 3. Domain

1. Vercel → Project Settings → Domains → add your domain, follow its DNS
   instructions (usually a CNAME or A record at your registrar).
2. Once the domain is live, update `NEXT_PUBLIC_SITE_URL` in Vercel's
   environment variables to `https://<your-domain>` and redeploy — this
   value builds every absolute callback/redirect URL (auth, Stripe checkout
   success/cancel, sitemap, Open Graph tags).
3. Update the Google OAuth redirect URL (step 1.4 above) and the Stripe
   webhook endpoint (step 4.2 below) to match the real domain — both were
   likely set up against a preview URL first.

## 4. Stripe (skip if not selling subscriptions yet)

1. Create the Premium and Premium+ products with monthly recurring prices in
   the Stripe Dashboard. Copy each Price ID into
   `STRIPE_PRICE_PREMIUM_MONTHLY` / `STRIPE_PRICE_PREMIUM_PLUS_MONTHLY` —
   both in Vercel's env vars (checkout) and Supabase's Edge Function secrets
   (webhook), since it's the one place both need to agree.
2. Dashboard → Developers → Webhooks → add endpoint:
   `https://<project-ref>.supabase.co/functions/v1/stripe-webhook`, subscribed
   to `checkout.session.completed`, `customer.subscription.updated`,
   `customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed`.
   Copy the signing secret into `STRIPE_WEBHOOK_SECRET` (Edge Function secret,
   not Vercel).
3. Switch from test mode to live mode keys only once you've actually run a
   real checkout end-to-end in test mode.

## 5. Monitoring

- **Sentry** (optional): create a project at [sentry.io](https://sentry.io),
  copy its DSN into `NEXT_PUBLIC_SENTRY_DSN` in Vercel. That's the entire
  setup — `instrumentation.ts`/`instrumentation-client.ts` pick it up
  automatically and no-op without it. Source-map upload (readable stack
  traces) isn't wired up — this integration deliberately stayed runtime-only
  to avoid coupling the production build to a Sentry auth token; add the
  `withSentryConfig` build plugin later if that's worth the added build-time
  dependency.
- **Vercel Analytics / Speed Insights**: see step 2.3 above — no separate
  account needed.
- **Logs**: Vercel's own function logs cover request-level errors; `pino`
  (this app's structured logger, `lib/logger.ts`) is what everything else
  logs through.

## 6. Post-deploy smoke test

Once deployed, verify by hand (this is exactly what a staging environment is
for):

- [ ] Register a new account, verify the confirmation email arrives
- [ ] Sign in, land on `/student`
- [ ] Start and submit a full mock exam, confirm a score appears
- [ ] Request an AI explanation on a missed question (needs `OPENAI_API_KEY`)
- [ ] Visit `/pricing`, `/blog`, `/faq` — confirm they render without auth
- [ ] Submit the `/contact` form (needs `RESEND_API_KEY` +
      `CONTACT_FORM_RECIPIENT_EMAIL`)
- [ ] If Stripe is live: complete a real Checkout, confirm the webhook marks
      the account Premium and it shows on `/student/billing`
- [ ] Confirm `/admin` is reachable by an admin account and refused for a
      student account
