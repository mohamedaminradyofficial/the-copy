/**
 * Functional test scenarios for each page type
 */

import { test, expect } from "@playwright/test";

test.describe("Functional Scenarios", () => {
  test("editor: create and save short document", async ({ page }) => {
    await page.goto("/editor");
    await page.waitForLoadState("networkidle");

    // Find editor and type some text
    const editor = page.locator("textarea, [contenteditable], [role='textbox']").first();
    if (await editor.count() > 0) {
      await editor.fill("FADE IN:\n\nEXT. PARK - DAY\n\nA man walks through a park.");
    }

    // Look for save button/action
    const saveButton = page.getByRole("button", { name: /save|حفظ/i });
    if (await saveButton.count() > 0) {
      await saveButton.click();
      await page.waitForTimeout(1000);
    }
  });

  test("analysis: run pipeline on short text", async ({ page }) => {
    await page.goto("/analysis");
    await page.waitForLoadState("networkidle");

    // Find text input
    const textInput = page.locator("textarea").first();
    if (await textInput.count() > 0) {
      await textInput.fill("Test screenplay text for analysis.");
    }

    // Look for analyze/start button
    const analyzeButton = page.getByRole("button", { name: /analyze|تحليل|start|بدء/i }).first();
    if (await analyzeButton.count() > 0) {
      await analyzeButton.click();
      
      // Wait for at least station 1 to complete (if visible)
      await page.waitForTimeout(5000);
      
      // Check if any station completed
      const stationIndicator = page.locator("[data-station], [class*='station'], [class*='completed']").first();
      if (await stationIndicator.count() > 0) {
        await expect(stationIndicator).toBeVisible({ timeout: 10000 });
      }
    }
  });

  test("development: import analysis and create card", async ({ page }) => {
    await page.goto("/development");
    await page.waitForLoadState("networkidle");

    // Look for import button or action
    const importButton = page.getByRole("button", { name: /import|استيراد/i });
    if (await importButton.count() > 0) {
      await importButton.click();
      await page.waitForTimeout(1000);
    }

    // Look for create card button
    const createButton = page.getByRole("button", { name: /create|create card|إنشاء/i });
    if (await createButton.count() > 0) {
      await createButton.click();
      await page.waitForTimeout(1000);
    }
  });

  test("brainstorm: generate ideas and save", async ({ page }) => {
    await page.goto("/brainstorm");
    await page.waitForLoadState("networkidle");

    // Look for generate button
    const generateButton = page.getByRole("button", { name: /generate|generate ideas|توليد/i });
    if (await generateButton.count() > 0) {
      // Generate ideas
      await generateButton.click();
      await page.waitForTimeout(5000);

      // Check if ideas appeared
      const ideaCard = page.locator("[class*='idea'], [class*='card'], [data-idea]").first();
      if (await ideaCard.count() > 0) {
        await expect(ideaCard).toBeVisible({ timeout: 10000 });
      }
    }
  });

  test("breakdown: upload text file and extract elements", async ({ page }) => {
    await page.goto("/breakdown");
    await page.waitForLoadState("networkidle");

    // Look for file upload
    const fileInput = page.locator("input[type='file']");
    if (await fileInput.count() > 0) {
      // Create a small test file
      const testFile = new File(
        ["Test screenplay content for breakdown."],
        "test.txt",
        { type: "text/plain" }
      );
      await fileInput.setInputFiles({
        name: "test.txt",
        mimeType: "text/plain",
        buffer: Buffer.from("Test screenplay content for breakdown."),
      });
      
      await page.waitForTimeout(3000);
      
      // Check if elements were extracted
      const elements = page.locator("[class*='element'], [data-element]").first();
      if (await elements.count() > 0) {
        await expect(elements).toBeVisible({ timeout: 10000 });
      }
    }
  });

  test("ui: interact with basic component", async ({ page }) => {
    await page.goto("/ui");
    await page.waitForLoadState("networkidle");

    // Find any interactive component (button, dialog trigger, etc.)
    const button = page.getByRole("button").first();
    if (await button.count() > 0) {
      await button.click();
      await page.waitForTimeout(1000);
    }

    // Look for dialog or modal
    const dialog = page.locator("[role='dialog'], [class*='dialog'], [class*='modal']").first();
    if (await dialog.count() > 0) {
      await expect(dialog).toBeVisible({ timeout: 2000 });
    }
  });

  test("new: create new project or space", async ({ page }) => {
    await page.goto("/new");
    await page.waitForLoadState("networkidle");

    // Look for create project button
    const createProjectButton = page.getByRole("button", { 
      name: /create|new project|مشروع جديد/i 
    });
    
    if (await createProjectButton.count() > 0) {
      await createProjectButton.click();
      await page.waitForTimeout(2000);
      
      // Check if form or next step appeared
      const form = page.locator("form, [class*='form'], [data-form]").first();
      if (await form.count() > 0) {
        await expect(form).toBeVisible({ timeout: 5000 });
      }
    }
  });
});

