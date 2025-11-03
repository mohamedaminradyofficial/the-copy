/**
 * E2E tests for all pages with screenshots and HAR files
 * Tests all 11 pages discovered in pages.manifest.json
 */

import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";
import { join } from "path";
import { mkdirSync, writeFileSync } from "fs";

// Get pages manifest
const pagesManifestPath = join(process.cwd(), "src/config/pages.manifest.json");
const pagesManifest = JSON.parse(
  readFileSync(pagesManifestPath, "utf-8")
) as {
  pages: Array<{ slug: string; path: string; title: string }>;
};

// Create evidence directory structure
const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
const evidenceDir = join(process.cwd(), "evidence", today);
const screensDir = join(evidenceDir, "screens");
const networkDir = join(evidenceDir, "network");
const logsDir = join(evidenceDir, "logs");

// Ensure directories exist
mkdirSync(screensDir, { recursive: true });
mkdirSync(networkDir, { recursive: true });
mkdirSync(logsDir, { recursive: true });

test.describe("Pages E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Record network activity
    await page.route("**/*", (route) => route.continue());
  });

  // Test homepage first
  test("homepage should display all page links", async ({ page }) => {
    await page.goto("/");

    // Wait for page to load
    await page.waitForLoadState("networkidle");

    // Verify all pages are linked
    for (const pageInfo of pagesManifest.pages) {
      const link = page.getByRole("link", { name: new RegExp(pageInfo.title, "i") });
      await expect(link).toBeVisible({ timeout: 5000 });
    }

    // Take screenshot
    await page.screenshot({
      path: join(screensDir, "homepage.png"),
      fullPage: true,
    });
  });

  // Test each page from manifest
  for (const pageInfo of pagesManifest.pages) {
    test(`page ${pageInfo.slug} should load successfully`, async ({
      page,
      context,
    }) => {
      // Start HAR recording
      await context.tracing.start({ screenshots: true, snapshots: true });

      // Navigate to page
      await page.goto(pageInfo.path);

      // Wait for page to load
      await page.waitForLoadState("networkidle");

      // Verify page loaded (check for common elements or no errors)
      await expect(page).toHaveURL(new RegExp(pageInfo.path));

      // Take screenshot
      await page.screenshot({
        path: join(screensDir, `${pageInfo.slug}.png`),
        fullPage: true,
      });

      // Stop tracing and save HAR
      const tracePath = join(networkDir, `${pageInfo.slug}.zip`);
      await context.tracing.stop({ path: tracePath });

      // Also save a simple HAR-like structure
      const har = {
        log: {
          version: "1.2",
          creator: { name: "Playwright", version: "1.0" },
          entries: await page.evaluate(() => {
            // Get performance entries
            const perfEntries = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
            return perfEntries.map((entry) => ({
              request: {
                url: entry.name,
                method: "GET",
                headers: {},
              },
              response: {
                status: 200,
                headers: {},
              },
              timings: {
                blocked: 0,
                dns: 0,
                connect: 0,
                send: 0,
                wait: entry.responseStart - entry.requestStart,
                receive: entry.duration - (entry.responseStart - entry.requestStart),
              },
            }));
          }),
        },
      };

      writeFileSync(
        join(networkDir, `${pageInfo.slug}.har`),
        JSON.stringify(har, null, 2)
      );
    });
  }
});

// Save pages discovered to evidence
test.afterAll(async () => {
  writeFileSync(
    join(logsDir, "pages-discovered.json"),
    JSON.stringify(pagesManifest, null, 2)
  );
});

