import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    // Several lib/*.ts files start with `import "server-only"` to fail
    // loudly if ever bundled into a Client Component — that package's
    // default export throws unconditionally, and only resolves to a
    // no-op under the "react-server" export condition. Next.js sets
    // that condition for RSC/server code at build time; Vitest needs to
    // be told to do the same, or every server-only module throws on
    // import here despite being perfectly test-safe Node code. Vitest's
    // node environment resolves modules through Vite's SSR pipeline,
    // which reads `ssr.resolve.conditions` rather than the top-level
    // one — both are set so this holds regardless of which one wins.
    conditions: ["react-server"],
  },
  ssr: {
    resolve: {
      conditions: ["react-server"],
    },
  },
  test: {
    environment: "node",
    // *.integration.test.ts needs a real Postgres (DATABASE_URL_FOR_TESTS)
    // and is run separately via `npm run test:integration` — excluded
    // here so the fast unit suite (`npm test`) never depends on one being
    // reachable.
    include: ["**/*.test.ts"],
    exclude: ["node_modules/**", ".next/**", "**/*.integration.test.ts"],
    setupFiles: ["./vitest.setup.ts"],
    // Running test files across worker threads intermittently produced
    // spurious ETIMEDOUT failures on module import in this sandbox — not
    // a real bug in any tested module (each one passes fine in
    // isolation). Single-process execution is slower but reliable; this
    // suite is small enough that it doesn't matter.
    fileParallelism: false,
  },
});
