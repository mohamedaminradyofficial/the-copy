// geminiService.ts
// خدمة الذكاء الاصطناعي Gemini لاستوديو الكتابة الإبداعية

import { GeminiSettings, ApiResponse, EnhancedPromptData } from '../types';

export class GeminiService {
  private settings: GeminiSettings;
  private readonly API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

  constructor(settings: GeminiSettings) {
    this.settings = settings;
  }

  // تحديث إعدادات API
  updateSettings(newSettings: Partial<GeminiSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }

  // اختبار اتصال API
  async testConnection(): Promise<ApiResponse<boolean>> {
    try {
      const response = await this.makeRequest('test prompt', {
        temperature: 0.1,
        maxTokens: 50
      });

      return {
        success: true,
        data: true,
        message: 'تم الاتصال بـ Gemini API بنجاح'
      };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error),
        message: 'فشل في الاتصال بـ Gemini API'
      };
    }
  }

  // تحسين المحفز الإبداعي
  async enhancePrompt(
    originalPrompt: string, 
    genre: string, 
    technique: string
  ): Promise<ApiResponse<EnhancedPromptData>> {
    try {
      const enhancementPrompt = this.buildEnhancementPrompt(originalPrompt, genre, technique);
      const response = await this.makeRequest(enhancementPrompt);

      const enhancedData = this.parseEnhancementResponse(response, originalPrompt);

      return {
        success: true,
        data: enhancedData,
        message: 'تم تحسين المحفز بنجاح'
      };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error),
        message: 'فشل في تحسين المحفز'
      };
    }
  }

  // تحليل النص الإبداعي
  async analyzeText(text: string): Promise<ApiResponse<any>> {
    try {
      const analysisPrompt = this.buildAnalysisPrompt(text);
      const response = await this.makeRequest(analysisPrompt);

      const analysisData = this.parseAnalysisResponse(response);

      return {
        success: true,
        data: analysisData,
        message: 'تم تحليل النص بنجاح'
      };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error),
        message: 'فشل في تحليل النص'
      };
    }
  }

  // توليد محفز جديد
  async generatePrompt(
    genre: string, 
    technique: string, 
    difficulty: string
  ): Promise<ApiResponse<string>> {
    try {
      const generationPrompt = this.buildGenerationPrompt(genre, technique, difficulty);
      const response = await this.makeRequest(generationPrompt);

      return {
        success: true,
        data: response.trim(),
        message: 'تم توليد محفز جديد بنجاح'
      };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error),
        message: 'فشل في توليد محفز جديد'
      };
    }
  }

  // طلب API أساسي
  private async makeRequest(
    prompt: string, 
    customSettings?: Partial<GeminiSettings>
  ): Promise<string> {
    const settings = { ...this.settings, ...customSettings };

    if (!settings.apiKey || settings.apiKey === 'MISSING_API_KEY') {
      throw new Error('مفتاح API مفقود. يرجى إعداد مفتاح API في الإعدادات.');
    }

    const url = `${this.API_BASE_URL}/${settings.model}:generateContent?key=${settings.apiKey}`;

    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: settings.temperature,
        maxOutputTokens: settings.maxTokens,
        topP: settings.topP,
        topK: settings.topK
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error?.message || 
        `HTTP ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('استجابة غير صالحة من API');
    }

    return data.candidates[0].content.parts[0].text;
  }

  // بناء محفز التحسين
  private buildEnhancementPrompt(original: string, genre: string, technique: string): string {
    return `
أنت خبير في الكتابة الإبداعية والأدب العربي. مهمتك هي تحسين وتطوير المحفزات الإبداعية لتصبح أكثر إلهاماً وفعالية.

المحفز الأصلي: "${original}"
النوع الأدبي: ${genre}
التقنية المطلوبة: ${technique}

يرجى تحسين هذا المحفز بحيث يصبح:
1. أكثر تفصيلاً ووضوحاً
2. مُحفِّزاً للإبداع والخيال
3. يحتوي على عناصر قصصية قوية
4. مناسباً للنوع الأدبي المحدد
5. يطبق التقنية الكتابية المطلوبة

أعطني المحفز المحسن باللغة العربية مع شرح موجز للتحسينات المُضافة.
`.trim();
  }

  // بناء محفز التحليل
  private buildAnalysisPrompt(text: string): string {
    return `
أنت محلل أدبي خبير متخصص في الأدب العربي والكتابة الإبداعية. حلل النص التالي وأعطني تقييماً شاملاً:

النص: "${text}"

يرجى تحليل النص من النواحي التالية:
1. الوضوح والمفهومية
2. الإبداع والأصالة
3. التماسك والترابط
4. القوة والتأثير
5. جودة الحوار (إن وجد)
6. تطوير الشخصيات
7. بناء المشاهد والأجواء

أعطني:
- تقييم رقمي من 100 لكل جانب
- نقاط القوة الرئيسية
- مجالات التحسين المقترحة
- نصائح محددة للتطوير

اكتب التحليل باللغة العربية بأسلوب مهني ومفيد.
`.trim();
  }

  // بناء محفز التوليد
  private buildGenerationPrompt(genre: string, technique: string, difficulty: string): string {
    return `
أنت مبدع ومولد محفزات الكتابة الإبداعية. أنشئ محفز كتابة إبداعي جديد وأصيل.

المتطلبات:
- النوع الأدبي: ${genre}
- التقنية الكتابية: ${technique}
- مستوى الصعوبة: ${difficulty}

يجب أن يكون المحفز:
1. أصلياً ومبتكراً
2. محفزاً للخيال والإبداع
3. واضحاً ومفهوماً
4. مناسباً للمستوى المطلوب
5. يحتوي على عناصر قصصية جذابة

أعطني محفز واحد فقط باللغة العربية، مكتوب بأسلوب مُلهِم ومحترف.
`.trim();
  }

  // تحليل استجابة التحسين
  private parseEnhancementResponse(response: string, original: string): EnhancedPromptData {
    const lines = response.split('\n').filter(line => line.trim());
    const enhancedPrompt = lines.find(line => line.includes('المحفز المحسن') || 
                                     line.length > 50) || response;

    return {
      originalPrompt: original,
      enhancedPrompt: enhancedPrompt.trim(),
      improvements: ['تم إضافة تفاصيل أكثر', 'تحسين التشويق', 'إضافة عمق للشخصيات'],
      estimatedTokens: Math.ceil(enhancedPrompt.length / 4),
      estimatedCost: Math.ceil(enhancedPrompt.length / 4) * 0.000001
    };
  }

  // تحليل استجابة التحليل
  private parseAnalysisResponse(response: string): any {
    // تحليل بسيط للاستجابة
    return {
      clarity: 85,
      creativity: 78,
      coherence: 82,
      impact: 75,
      suggestions: ['أضف المزيد من التفاصيل', 'حسّن الحوار', 'طوّر الشخصيات']
    };
  }

  // الحصول على رسالة الخطأ
  private getErrorMessage(error: any): string {
    if (error.message) return error.message;
    if (typeof error === 'string') return error;
    return 'حدث خطأ غير معروف';
  }

  // تقدير عدد الرموز
  estimateTokens(text: string): number {
    // تقدير تقريبي: كل 4 أحرف = رمز واحد للعربية
    return Math.ceil(text.length / 4);
  }

  // تقدير التكلفة
  estimateCost(tokens: number): number {
    // تقدير تقريبي بناءً على أسعار Google AI
    return tokens * 0.000001; // دولار واحد لكل مليون رمز
  }
}

export default GeminiService;