import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

// Separate from vitest.config.ts on purpose: integration tests need a
// real Postgres (DATABASE_URL_FOR_TESTS) and are never part of the
// default `npm test` run — see actions-core.integration.test.ts's
// header comment for how to point this at one.
export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: { conditions: ["react-server"] },
  ssr: { resolve: { conditions: ["react-server"] } },
  test: {
    environment: "node",
    include: ["**/*.integration.test.ts"],
    exclude: ["node_modules/**", ".next/**"],
    setupFiles: ["./vitest.setup.ts"],
    fileParallelism: false,
    testTimeout: 15000,
  },
});
