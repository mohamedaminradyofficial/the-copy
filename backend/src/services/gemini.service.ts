import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '@/config/env';
import { logger } from '@/utils/logger';
import { cacheService } from './cache.service';
import { trackGeminiRequest, trackGeminiCache } from '@/middleware/metrics.middleware';
import {
  generateGeminiCacheKey,
  getGeminiCacheTTL,
  cachedGeminiCall,
  getAdaptiveTTL,
} from './gemini-cache.strategy';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private readonly REQUEST_TIMEOUT = 30000; // 30 seconds

  constructor() {
    const apiKey = env.GOOGLE_GENAI_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_GENAI_API_KEY غير محدد في البيئة');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  }

  async analyzeText(text: string, analysisType: string): Promise<string> {
    const startTime = Date.now();

    // Generate optimized cache key
    const cacheKey = generateGeminiCacheKey('analysis', { text, analysisType });

    // Get cache stats for adaptive TTL
    const stats = cacheService.getStats();
    const ttl = getAdaptiveTTL(analysisType, stats.hitRate);

    logger.debug(`Using adaptive TTL: ${ttl}s (hit rate: ${stats.hitRate}%)`);

    try {
      // Use cached call with stale-while-revalidate for better UX
      const result = await cachedGeminiCall(
        cacheKey,
        ttl,
        async () => {
          const prompt = this.buildPrompt(text, analysisType);

          // Add timeout to prevent hanging requests
          const apiResult = await Promise.race([
            this.model.generateContent(prompt),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Gemini request timeout')), this.REQUEST_TIMEOUT)
            ),
          ]);

          return (apiResult as any).response.text();
        },
        {
          staleWhileRevalidate: true,
          staleTTL: ttl * 2, // Keep stale data for 2x TTL
        }
      );

      // Track metrics
      const duration = Date.now() - startTime;
      trackGeminiRequest(analysisType, duration, true);
      trackGeminiCache(result !== null);

      return result;
    } catch (error) {
      // Track failed request
      const duration = Date.now() - startTime;
      trackGeminiRequest(analysisType, duration, false);
      trackGeminiCache(false);

      logger.error('Gemini analysis failed:', error);
      throw new Error('فشل في تحليل النص باستخدام الذكاء الاصطناعي');
    }
  }

  async reviewScreenplay(text: string): Promise<string> {
    const startTime = Date.now();

    // Generate optimized cache key
    const cacheKey = generateGeminiCacheKey('screenplay', { text });

    // Get TTL for screenplay review
    const ttl = getGeminiCacheTTL('screenplay');

    const prompt = `أنت خبير في كتابة السيناريوهات العربية. قم بمراجعة النص التالي وقدم ملاحظات على:
1. استمرارية الحبكة
2. تطور الشخصيات
3. قوة الحوار
4. التناقضات في النص

قدم اقتراحات محددة لتحسين النص مع الحفاظ على الأسلوب العربي الأصيل.

النص:
${text}`;

    try {
      const result = await cachedGeminiCall(
        cacheKey,
        ttl,
        async () => {
          // Add timeout
          const apiResult = await Promise.race([
            this.model.generateContent(prompt),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Gemini request timeout')), this.REQUEST_TIMEOUT)
            ),
          ]);

          return (apiResult as any).response.text();
        },
        {
          staleWhileRevalidate: true,
          staleTTL: ttl * 2,
        }
      );

      const duration = Date.now() - startTime;
      trackGeminiRequest('screenplay', duration, true);

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      trackGeminiRequest('screenplay', duration, false);

      logger.error('Screenplay review failed:', error);
      throw new Error('فشل في مراجعة السيناريو');
    }
  }

  private buildPrompt(text: string, analysisType: string): string {
    const prompts = {
      characters: `حلل الشخصيات في النص التالي واستخرج:
1. الشخصيات الرئيسية
2. العلاقات بينها
3. تطور كل شخصية

النص: ${text}`,
      
      themes: `حلل المواضيع والأفكار في النص التالي:
1. الموضوع الرئيسي
2. المواضيع الفرعية
3. الرسائل المضمنة

النص: ${text}`,
      
      structure: `حلل البنية الدرامية للنص التالي:
1. البداية والعقدة والحل
2. نقاط التحول
3. الإيقاع الدرامي

النص: ${text}`,
    };

    return prompts[analysisType as keyof typeof prompts] || prompts.characters;
  }
}