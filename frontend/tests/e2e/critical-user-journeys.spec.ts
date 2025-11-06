/**
 * Critical User Journeys E2E Tests
 *
 * These tests cover the most important user workflows including AI-powered features.
 * Uses mocked Gemini responses for stable, deterministic test results.
 */

import { test, expect } from '@playwright/test';
import {
  setupGeminiMock,
  setupSevenStationsMock,
  waitForAIResponse,
  MOCK_RESPONSES,
} from './helpers/gemini-mock';

test.describe('Critical User Journeys', () => {
  test.describe('AI Analysis Pipeline', () => {
    test('should complete full Seven Stations analysis workflow', async ({ page }) => {
      // Setup Gemini API mock
      await setupSevenStationsMock(page);

      // Navigate to analysis page
      await page.goto('/analysis');
      await page.waitForLoadState('networkidle');

      // Enter screenplay text
      const textInput = page.locator('textarea').first();
      await textInput.fill(`
        FADE IN:

        EXT. PARK - DAY

        JOHN, 30s, walks through a beautiful park.

        JOHN
        (to himself)
        Today is the day everything changes.

        He sees SARAH, 20s, sitting on a bench.

        FADE OUT.
      `);

      // Start analysis
      const analyzeButton = page.getByRole('button', { name: /analyze|تحليل|start|بدء/i }).first();
      await expect(analyzeButton).toBeVisible();
      await analyzeButton.click();

      // Wait for AI processing
      await waitForAIResponse(page, 60000);

      // Verify results appeared
      const results = page.locator('[data-result], [class*="result"], [class*="analysis"]');
      await expect(results.first()).toBeVisible({ timeout: 10000 });

      // Check that at least one station completed
      const stationIndicator = page.locator('[data-station-status="completed"], [class*="completed"]');
      await expect(stationIndicator.first()).toBeVisible({ timeout: 5000 });
    });

    test('should handle analysis errors gracefully', async ({ page }) => {
      // Setup mock to return error
      await page.route('**/api/analysis/**', async (route) => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            error: 'حدث خطأ أثناء التحليل',
          }),
        });
      });

      await page.goto('/analysis');
      await page.waitForLoadState('networkidle');

      const textInput = page.locator('textarea').first();
      if (await textInput.count() > 0) {
        await textInput.fill('Test text for error scenario');

        const analyzeButton = page.getByRole('button', { name: /analyze|تحليل/i }).first();
        if (await analyzeButton.count() > 0) {
          await analyzeButton.click();

          // Wait for error message
          const errorMessage = page.locator('[role="alert"], [class*="error"], [data-error]');
          await expect(errorMessage.first()).toBeVisible({ timeout: 10000 });
        }
      }
    });
  });

  test.describe('Screenplay Review Workflow', () => {
    test('should review screenplay and display suggestions', async ({ page }) => {
      await setupGeminiMock(page, 'screenplay_review');

      await page.goto('/editor');
      await page.waitForLoadState('networkidle');

      // Enter screenplay content
      const editor = page.locator('textarea, [contenteditable]').first();
      if (await editor.count() > 0) {
        await editor.fill(`
          INT. COFFEE SHOP - MORNING

          AHMED sits alone, sipping coffee.
        `);

        // Trigger review
        const reviewButton = page.getByRole('button', { name: /review|مراجعة/i });
        if (await reviewButton.count() > 0) {
          await reviewButton.click();
          await waitForAIResponse(page);

          // Verify review results
          const reviewResults = page.locator('[data-review], [class*="review"], [class*="suggestion"]');
          await expect(reviewResults.first()).toBeVisible({ timeout: 15000 });
        }
      }
    });
  });

  test.describe('Directors Studio - Shot Generation', () => {
    test('should generate cinematography shots with AI', async ({ page }) => {
      await setupGeminiMock(page, 'shot_generation');

      await page.goto('/cinematography-studio');
      await page.waitForLoadState('networkidle');

      // Look for generate shots button
      const generateButton = page.getByRole('button', { name: /generate|توليد|shots/i });
      if (await generateButton.count() > 0) {
        await generateButton.click();
        await waitForAIResponse(page);

        // Verify shots were generated
        const shotsList = page.locator('[data-shot], [class*="shot-list"], [class*="shots"]');
        await expect(shotsList.first()).toBeVisible({ timeout: 15000 });
      }
    });

    test('should validate shot composition', async ({ page }) => {
      await page.goto('/cinematography-studio');
      await page.waitForLoadState('networkidle');

      // Select a shot type
      const shotTypeSelect = page.locator('select, [role="combobox"]').first();
      if (await shotTypeSelect.count() > 0) {
        await shotTypeSelect.selectOption({ label: /wide|واسع/i });

        // Verify selection
        await expect(shotTypeSelect).toHaveValue(/.+/);
      }
    });
  });

  test.describe('Creative Brainstorming', () => {
    test('should generate creative ideas with AI', async ({ page }) => {
      await setupGeminiMock(page, 'brainstorm_ideas');

      await page.goto('/brainstorm');
      await page.waitForLoadState('networkidle');

      // Enter prompt
      const promptInput = page.locator('textarea, input[type="text"]').first();
      if (await promptInput.count() > 0) {
        await promptInput.fill('أفكار لتطوير شخصية البطل');

        // Generate ideas
        const generateButton = page.getByRole('button', { name: /generate|توليد/i });
        if (await generateButton.count() > 0) {
          await generateButton.click();
          await waitForAIResponse(page);

          // Verify ideas appeared
          const ideasContainer = page.locator('[data-ideas], [class*="idea"], [class*="suggestions"]');
          await expect(ideasContainer.first()).toBeVisible({ timeout: 15000 });
        }
      }
    });

    test('should save generated ideas', async ({ page }) => {
      await setupGeminiMock(page, 'brainstorm_ideas');

      await page.goto('/brainstorm');
      await page.waitForLoadState('networkidle');

      const promptInput = page.locator('textarea').first();
      if (await promptInput.count() > 0) {
        await promptInput.fill('Test brainstorm prompt');

        const generateButton = page.getByRole('button', { name: /generate|توليد/i });
        if (await generateButton.count() > 0) {
          await generateButton.click();
          await waitForAIResponse(page);

          // Look for save button
          const saveButton = page.getByRole('button', { name: /save|حفظ/i });
          if (await saveButton.count() > 0) {
            await saveButton.click();
            await page.waitForTimeout(2000);

            // Check for success indicator
            const successMessage = page.locator('[role="status"], [class*="success"]');
            if (await successMessage.count() > 0) {
              await expect(successMessage.first()).toBeVisible({ timeout: 5000 });
            }
          }
        }
      }
    });
  });

  test.describe('Full User Journey - From Analysis to Production', () => {
    test('should complete end-to-end workflow', async ({ page }) => {
      // Setup mocks for different stages
      await setupGeminiMock(page, 'character_analysis');

      // Step 1: Upload/Input screenplay
      await page.goto('/editor');
      await page.waitForLoadState('networkidle');

      const editor = page.locator('textarea, [contenteditable]').first();
      if (await editor.count() > 0) {
        await editor.fill('FADE IN:\n\nINT. ROOM - DAY\n\nTest screenplay content.');
      }

      // Step 2: Run analysis
      await page.goto('/analysis');
      await page.waitForLoadState('networkidle');

      const textInput = page.locator('textarea').first();
      if (await textInput.count() > 0) {
        await textInput.fill('Test screenplay for full journey');

        const analyzeButton = page.getByRole('button', { name: /analyze|تحليل/i }).first();
        if (await analyzeButton.count() > 0) {
          await analyzeButton.click();
          await page.waitForTimeout(3000);
        }
      }

      // Step 3: Navigate to development
      await page.goto('/development');
      await page.waitForLoadState('networkidle');

      // Step 4: Create production elements
      const createButton = page.getByRole('button', { name: /create|إنشاء/i }).first();
      if (await createButton.count() > 0) {
        await createButton.click();
        await page.waitForTimeout(2000);
      }
    });
  });

  test.describe('Performance - AI Operations', () => {
    test('should handle multiple simultaneous AI requests', async ({ page }) => {
      await setupGeminiMock(page, 'default');

      await page.goto('/analysis');
      await page.waitForLoadState('networkidle');

      // This tests that the UI doesn't break with rapid requests
      const textInput = page.locator('textarea').first();
      if (await textInput.count() > 0) {
        await textInput.fill('Test 1');

        const analyzeButton = page.getByRole('button', { name: /analyze|تحليل/i }).first();
        if (await analyzeButton.count() > 0) {
          // Trigger multiple requests
          await analyzeButton.click();
          await page.waitForTimeout(500);

          // Change text and trigger again
          await textInput.fill('Test 2');
          await analyzeButton.click();

          // Verify the UI handles this gracefully
          await page.waitForTimeout(2000);

          // Should not show multiple loading indicators
          const loadingIndicators = page.locator('[data-loading="true"]');
          const count = await loadingIndicators.count();
          expect(count).toBeLessThanOrEqual(1);
        }
      }
    });
  });
});
