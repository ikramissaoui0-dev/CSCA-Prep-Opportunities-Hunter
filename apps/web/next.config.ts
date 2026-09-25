import type { NextConfig } from "next";

// Phase 13 security headers. `script-src` keeps 'unsafe-inline' rather
// than a strict nonce policy — the App Router's RSC streaming relies on
// inline <script> tags to flush server data into the client as it
// streams, and blocking that without wiring a per-request nonce through
// middleware would break hydration outright. Everything else here is
// unconditional: frame-ancestors/X-Frame-Options blocks clickjacking,
// object-src blocks legacy plugin content, frame-src is scoped to only
// the video hosts lesson-viewer.tsx actually embeds.
//
// 'unsafe-eval' is added to script-src only outside production — Next's
// dev-mode HMR/webpack runtime evaluates code via eval(), which a strict
// CSP blocks, silently breaking client hydration in `next dev` (React
// renders the initial HTML, then no interaction ever works). Production
// builds don't need eval, so this never loosens the real deployed policy.
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "production" ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co",
  "frame-src 'self' https://www.youtube.com https://player.vimeo.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  // Workspace packages ship raw TypeScript (no build step of their own) —
  // Next needs to run them through its own compiler rather than treating
  // them as pre-built node_modules.
  transpilePackages: ["@csca/types", "@csca/db"],

  // pino's dev-only pretty-printer spawns a worker thread that does its
  // own runtime require() of the transport target. Webpack bundling that
  // file (the default for server code) rewrites/moves it in ways the
  // worker can't resolve, so every log call threw "Cannot find module
  // .../vendor-chunks/lib/worker.js" and crashed the worker thread —
  // stalling the request for the deopt/retry cycle. Marking pino and
  // pino-pretty external leaves them as plain node_modules requires.
  serverExternalPackages: ["pino", "pino-pretty"],

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: CSP },
          // Superseded by frame-ancestors above in modern browsers, kept
          // for the handful of older ones that only honor this header.
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },
};

export default nextConfig;
