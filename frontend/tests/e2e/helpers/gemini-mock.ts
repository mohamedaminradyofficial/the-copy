/**
 * Gemini API Mock Helper for E2E Tests
 *
 * This helper provides stable, deterministic responses for AI-powered tests
 * to avoid flaky tests due to non-deterministic AI outputs.
 */

import { Page, Route } from '@playwright/test';

export interface MockGeminiResponse {
  text: string;
  delay?: number; // Simulate AI processing time in ms
}

export const MOCK_RESPONSES: Record<string, MockGeminiResponse> = {
  // Analysis responses
  'character_analysis': {
    text: `تحليل الشخصيات:

1. البطل الرئيسي: محمد
   - شخصية قوية ومعقدة
   - يمر بتحول درامي واضح
   - العلاقات: صديق لأحمد، نزاع مع سارة

2. الشخصية الثانوية: أحمد
   - شخصية داعمة
   - دوره في تطور الحبكة: محوري`,
    delay: 2000,
  },

  'theme_analysis': {
    text: `تحليل المواضيع:

الموضوع الرئيسي: الصداقة والخيانة
المواضيع الفرعية:
- البحث عن الهوية
- الصراع الداخلي
- التضحية`,
    delay: 2000,
  },

  'structure_analysis': {
    text: `تحليل البنية الدرامية:

1. البداية (الفصل 1-2): تقديم الشخصيات والعالم
2. العقدة (الفصل 3-5): تصاعد الأحداث
3. الذروة (الفصل 6): نقطة التحول الرئيسية
4. الحل (الفصل 7): الخاتمة`,
    delay: 2500,
  },

  // Screenplay review response
  'screenplay_review': {
    text: `مراجعة السيناريو:

✅ نقاط القوة:
- حوار طبيعي وواقعي
- تطور شخصيات جيد
- بنية درامية متماسكة

⚠️ نقاط التحسين:
- إضافة المزيد من التفاصيل البصرية
- تعميق دوافع الشخصية الثانوية
- تحسين إيقاع المشهد الثالث`,
    delay: 3000,
  },

  // Shot generation
  'shot_generation': {
    text: `اقتراحات اللقطات:

المشهد 1:
1. WIDE SHOT - لقطة واسعة للمكان
2. MEDIUM SHOT - لقطة متوسطة للشخصية الرئيسية
3. CLOSE-UP - لقطة قريبة لتعبيرات الوجه
4. OVER-THE-SHOULDER - لقطة من فوق الكتف للحوار`,
    delay: 2500,
  },

  // Brainstorming ideas
  'brainstorm_ideas': {
    text: `أفكار إبداعية:

1. تطوير شخصية جانبية تضيف عمقاً للحبكة
2. إضافة مشهد فلاش باك يكشف دوافع البطل
3. تغيير نهاية الفصل الثاني لزيادة التشويق
4. دمج عنصر رمزي متكرر عبر السيناريو`,
    delay: 2000,
  },

  // Default response for unknown requests
  'default': {
    text: 'تم إنشاء المحتوى بنجاح. هذا نص تجريبي للاختبار.',
    delay: 1500,
  },
};

/**
 * Setup Gemini API mocking for E2E tests
 */
export async function setupGeminiMock(page: Page, mockType: keyof typeof MOCK_RESPONSES = 'default') {
  await page.route('**/api/**', async (route: Route) => {
    const url = route.request().url();
    const method = route.request().method();

    // Mock Gemini API calls
    if (url.includes('/api/review-screenplay') ||
        url.includes('/api/cineai') ||
        url.includes('/api/analysis')) {

      const response = MOCK_RESPONSES[mockType] || MOCK_RESPONSES.default;

      // Simulate processing delay
      if (response.delay) {
        await page.waitForTimeout(response.delay);
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            text: response.text,
            analysis: response.text,
            suggestions: response.text,
          },
        }),
      });
    } else {
      // Allow other requests to pass through
      await route.continue();
    }
  });
}

/**
 * Setup mock for Seven Stations Pipeline
 */
export async function setupSevenStationsMock(page: Page) {
  await page.route('**/api/analysis/seven-stations', async (route: Route) => {
    await page.waitForTimeout(5000); // Simulate full pipeline processing

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          stations: [
            {
              id: 1,
              name: 'تحليل النص',
              status: 'completed',
              result: MOCK_RESPONSES.structure_analysis.text,
            },
            {
              id: 2,
              name: 'تحليل الشخصيات',
              status: 'completed',
              result: MOCK_RESPONSES.character_analysis.text,
            },
            {
              id: 3,
              name: 'تحليل المواضيع',
              status: 'completed',
              result: MOCK_RESPONSES.theme_analysis.text,
            },
          ],
          completed: true,
        },
      }),
    });
  });
}

/**
 * Verify AI response appeared in the UI
 */
export async function waitForAIResponse(page: Page, timeout = 30000) {
  // Wait for loading indicators to disappear
  await page.waitForSelector('[data-loading="true"], [class*="loading"], [class*="spinner"]', {
    state: 'hidden',
    timeout,
  }).catch(() => {
    // Ignore if no loading indicator found
  });

  // Wait for result content to appear
  await page.waitForSelector('[data-result], [class*="result"], [class*="analysis"]', {
    state: 'visible',
    timeout,
  }).catch(() => {
    // Check for alternative result containers
  });
}
