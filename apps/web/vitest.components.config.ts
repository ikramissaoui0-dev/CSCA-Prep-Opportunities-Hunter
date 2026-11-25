import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

// Component tests need regular React (hooks, react-dom/server), unlike
// vitest.config.ts, which resolves the "react-server" export condition so
// `import "server-only"` is a no-op — under that condition React has no
// hooks and react-dom/server refuses to load.
export default defineConfig({
  plugins: [tsconfigPaths()],
  // tsconfig has `jsx: "preserve"` (Next.js compiles JSX itself), which
  // leaves Vitest unable to parse any .tsx file a test imports.
  oxc: { jsx: { runtime: "automatic" } },
  test: {
    environment: "node",
    include: ["components/**/*.test.ts"],
    setupFiles: ["./vitest.setup.ts"],
    pool: "threads",
    fileParallelism: false,
  },
});
