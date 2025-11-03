import path from "path";
import react from "@vitejs/plugin-react";
import { createRequire } from "module";
import type { PluginOption } from "vite";
import { defineConfig } from "vitest/config";

const require = createRequire(import.meta.url);

type TsconfigPathsFactory = () => PluginOption;

const resolveTsconfigPathsPlugin = (): PluginOption => {
  let factory: TsconfigPathsFactory | undefined;

  try {
    const loaded = require("vite-tsconfig-paths");
    factory = (loaded?.default ?? loaded) as TsconfigPathsFactory;
  } catch (error) {
    console.warn(
      "[vitest] vite-tsconfig-paths is unavailable; falling back to a no-op plugin.",
      error,
    );
  }

  if (!factory) {
    return {
      name: "tsconfig-paths-stub",
    };
  }

  return factory();
};

export default defineConfig({
  plugins: [react(), resolveTsconfigPathsPlugin()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts", "./jest.setup.ts"],
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/build/**",
      "**/e2e/**",
      "**/tests/e2e/**",
    ],
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      reportsDirectory: "./reports/unit",
      exclude: [
        "coverage/**",
        "dist/**",
        "**/node_modules/**",
        "**/[.]**",
        "packages/*/test{,s}/**",
        "**/*.d.ts",
        "**/virtual:*",
        "**/__x00__*",
        "**/\\x00*",
        "cypress/**",
        "test{,s}/**",
        "test{,-*}.{js,cjs,mjs,ts,tsx,jsx}",
        "**/*{.,-}test.{js,cjs,mjs,ts,tsx,jsx}",
        "**/*{.,-}spec.{js,cjs,mjs,ts,tsx,jsx}",
        "**/__tests__/**",
        "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
        "**/vitest.{workspace,projects}.[jt]s?(on)",
        "**/.{eslint,mocha,prettier}rc.{?(c|m)js,yml}",
        "next.config.*",
        "tailwind.config.*",
        "postcss.config.*",
        ".env*",
        "tests/**",
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "~": path.resolve(__dirname, "src"),
      "@core": path.resolve(__dirname, "src/lib/drama-analyst"),
      "@agents": path.resolve(__dirname, "src/lib/drama-analyst/agents"),
      "@services": path.resolve(__dirname, "src/lib/drama-analyst/services"),
      "@orchestration": path.resolve(
        __dirname,
        "src/lib/drama-analyst/orchestration",
      ),
      "@shared": path.resolve(
        __dirname,
        "src/app/(main)/directors-studio/shared",
      ),
      "@components": path.resolve(__dirname, "src/components"),
    },
  },
  esbuild: {
    target: "node18",
    jsx: "automatic",
    jsxImportSource: "react",
  },
});
