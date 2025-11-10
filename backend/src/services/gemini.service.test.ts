import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GeminiService } from './gemini.service';

describe('GeminiService', () => {
  let geminiService: GeminiService;
  let mockGenerateContent: any;

  beforeEach(() => {
    // Mock the GoogleGenerativeAI instance
    mockGenerateContent = vi.fn();
    
    vi.doMock('@google/generative-ai', () => ({
      GoogleGenerativeAI: class {
        getGenerativeModel() {
          return {
            generateContent: mockGenerateContent,
          };
        }
      },
    }));

    geminiService = new GeminiService();
    (geminiService as any).model = {
      generateContent: mockGenerateContent,
    };
  });

  describe('analyzeText', () => {
    it('should successfully analyze text for characters', async () => {
      const mockResponse = 'تحليل الشخصيات: البطل، الشرير';
      
      mockGenerateContent.mockResolvedValue({
        response: {
          text: () => mockResponse,
        },
      });

      const result = await geminiService.analyzeText('نص للتحليل', 'characters');

      expect(result).toBe(mockResponse);
      expect(mockGenerateContent).toHaveBeenCalledWith(
        expect.stringContaining('حلل الشخصيات')
      );
    });

    it('should analyze themes correctly', async () => {
      const mockResponse = 'تحليل المواضيع: الحب، الصراع';
      
      mockGenerateContent.mockResolvedValue({
        response: {
          text: () => mockResponse,
        },
      });

      const result = await geminiService.analyzeText('نص الاختبار', 'themes');

      expect(result).toBe(mockResponse);
      expect(mockGenerateContent).toHaveBeenCalledWith(
        expect.stringContaining('حلل المواضيع والأفكار')
      );
    });

    it('should analyze structure correctly', async () => {
      const mockResponse = 'تحليل البنية: بداية قوية';
      
      mockGenerateContent.mockResolvedValue({
        response: {
          text: () => mockResponse,
        },
      });

      const result = await geminiService.analyzeText('نص الاختبار', 'structure');

      expect(result).toBe(mockResponse);
      expect(mockGenerateContent).toHaveBeenCalledWith(
        expect.stringContaining('حلل البنية الدرامية')
      );
    });

    it('should default to characters analysis for unknown type', async () => {
      const mockResponse = 'تحليل الشخصيات';
      
      mockGenerateContent.mockResolvedValue({
        response: {
          text: () => mockResponse,
        },
      });

      const result = await geminiService.analyzeText('نص', 'unknown-type');

      expect(mockGenerateContent).toHaveBeenCalledWith(
        expect.stringContaining('حلل الشخصيات')
      );
    });

    it('should handle API errors gracefully', async () => {
      mockGenerateContent.mockRejectedValue(new Error('API Error'));

      await expect(
        geminiService.analyzeText('نص', 'characters')
      ).rejects.toThrow('فشل في تحليل النص باستخدام الذكاء الاصطناعي');
    });

    it('should include text in the prompt', async () => {
      const testText = 'نص الاختبار الكامل';
      
      mockGenerateContent.mockResolvedValue({
        response: { text: () => 'نتيجة' },
      });

      await geminiService.analyzeText(testText, 'characters');

      expect(mockGenerateContent).toHaveBeenCalledWith(
        expect.stringContaining(testText)
      );
    });
  });

  describe('reviewScreenplay', () => {
    it('should successfully review screenplay', async () => {
      const mockReview = 'ملاحظات على السيناريو: الحبكة قوية';
      
      mockGenerateContent.mockResolvedValue({
        response: {
          text: () => mockReview,
        },
      });

      const result = await geminiService.reviewScreenplay('نص السيناريو');

      expect(result).toBe(mockReview);
      expect(mockGenerateContent).toHaveBeenCalled();
    });

    it('should include review criteria in prompt', async () => {
      mockGenerateContent.mockResolvedValue({
        response: { text: () => 'نتيجة' },
      });

      await geminiService.reviewScreenplay('نص');

      const call = mockGenerateContent.mock.calls[0][0];
      expect(call).toContain('استمرارية الحبكة');
      expect(call).toContain('تطور الشخصيات');
      expect(call).toContain('قوة الحوار');
      expect(call).toContain('التناقضات في النص');
    });

    it('should include screenplay text in prompt', async () => {
      const screenplay = 'نص السيناريو الكامل للمراجعة';
      
      mockGenerateContent.mockResolvedValue({
        response: { text: () => 'نتيجة' },
      });

      await geminiService.reviewScreenplay(screenplay);

      expect(mockGenerateContent).toHaveBeenCalledWith(
        expect.stringContaining(screenplay)
      );
    });

    it('should handle API errors', async () => {
      mockGenerateContent.mockRejectedValue(new Error('API Error'));

      await expect(
        geminiService.reviewScreenplay('نص')
      ).rejects.toThrow('فشل في مراجعة السيناريو');
    });
  });

  describe('buildPrompt', () => {
    it('should build correct prompt for each analysis type', async () => {
      const testText = 'نص للاختبار';
      
      mockGenerateContent.mockResolvedValue({
        response: { text: () => 'نتيجة' },
      });

      // Test characters prompt
      await geminiService.analyzeText(testText, 'characters');
      let call = mockGenerateContent.mock.calls[0][0];
      expect(call).toContain('الشخصيات الرئيسية');

      mockGenerateContent.mockClear();

      // Test themes prompt
      await geminiService.analyzeText(testText, 'themes');
      call = mockGenerateContent.mock.calls[0][0];
      expect(call).toContain('الموضوع الرئيسي');

      mockGenerateContent.mockClear();

      // Test structure prompt
      await geminiService.analyzeText(testText, 'structure');
      call = mockGenerateContent.mock.calls[0][0];
      expect(call).toContain('البداية والعقدة والحل');
    });
  });
});
