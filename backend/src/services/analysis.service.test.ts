import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AnalysisService } from './analysis.service';
import type { PipelineInput } from '@/types';

// Create mock function
const mockAnalyzeText = vi.fn();

// Mock GeminiService
vi.mock('./gemini.service', () => ({
  GeminiService: class {
    analyzeText = mockAnalyzeText;
  },
}));

vi.mock('@/utils/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

describe('AnalysisService', () => {
  let analysisService: AnalysisService;

  beforeEach(async () => {
    vi.clearAllMocks();
    analysisService = new AnalysisService();
  });

  describe('runFullPipeline', () => {
    const mockInput: PipelineInput = {
      fullText: 'نص درامي للتحليل',
      projectName: 'مشروع اختبار',
      metadata: {
        author: 'المؤلف',
        createdAt: '2024-01-01',
      },
    };

    it('should successfully run complete pipeline', async () => {
      const mockAnalysis = 'تحليل الشخصيات: البطل، البطلة، الشرير';
      
      mockAnalyzeText.mockResolvedValue(mockAnalysis);

      const result = await analysisService.runFullPipeline(mockInput);

      expect(result).toHaveProperty('stationOutputs');
      expect(result).toHaveProperty('pipelineMetadata');
      expect(result.stationOutputs).toHaveProperty('station1');
      expect(result.pipelineMetadata.stationsCompleted).toBe(7);
    });

    it('should call Gemini service for station 1 analysis', async () => {
      const mockAnalysis = 'تحليل الشخصيات';
      
      mockAnalyzeText.mockResolvedValue(mockAnalysis);

      await analysisService.runFullPipeline(mockInput);

      expect(mockAnalyzeText).toHaveBeenCalledWith(
        mockInput.fullText,
        'characters'
      );
    });

    it('should return station1 output with correct structure', async () => {
      const mockAnalysis = 'الشخصيات: البطل، البطلة';
      
      mockAnalyzeText.mockResolvedValue(mockAnalysis);

      const result = await analysisService.runFullPipeline(mockInput);

      expect(result.stationOutputs.station1).toMatchObject({
        stationId: 1,
        stationName: 'Text Analysis',
        status: 'completed',
      });
      expect(result.stationOutputs.station1.majorCharacters).toBeDefined();
      expect(result.stationOutputs.station1.relationships).toBeDefined();
      expect(result.stationOutputs.station1.narrativeStyleAnalysis).toBeDefined();
    });

    it('should track execution time', async () => {
      const mockAnalysis = 'تحليل';
      
      mockAnalyzeText.mockResolvedValue(mockAnalysis);

      const result = await analysisService.runFullPipeline(mockInput);

      expect(result.pipelineMetadata.totalExecutionTime).toBeGreaterThanOrEqual(0);
      expect(result.pipelineMetadata.startedAt).toBeDefined();
      expect(result.pipelineMetadata.finishedAt).toBeDefined();
    });

    it('should handle Gemini service errors', async () => {
      mockAnalyzeText.mockRejectedValue(
        new Error('API Error')
      );

      await expect(
        analysisService.runFullPipeline(mockInput)
      ).rejects.toThrow();
    });

    it('should include all 7 stations in output', async () => {
      const mockAnalysis = 'تحليل';
      
      mockAnalyzeText.mockResolvedValue(mockAnalysis);

      const result = await analysisService.runFullPipeline(mockInput);

      expect(result.stationOutputs).toHaveProperty('station1');
      expect(result.stationOutputs).toHaveProperty('station2');
      expect(result.stationOutputs).toHaveProperty('station3');
      expect(result.stationOutputs).toHaveProperty('station4');
      expect(result.stationOutputs).toHaveProperty('station5');
      expect(result.stationOutputs).toHaveProperty('station6');
      expect(result.stationOutputs).toHaveProperty('station7');
    });
  });

  describe('extractCharacters', () => {
    it('should extract characters from analysis text', async () => {
      const mockAnalysis = `
        الشخصيات الرئيسية:
        1. البطل - شخصية قوية
        2. البطلة - شخصية محورية
        3. الشرير - شخصية معادية
      `;
      
      mockAnalyzeText.mockResolvedValue(mockAnalysis);

      const result = await analysisService.runFullPipeline({
        fullText: 'نص',
        projectName: 'مشروع',
        metadata: {},
      });

      expect(result.stationOutputs.station1.majorCharacters).toBeDefined();
      expect(Array.isArray(result.stationOutputs.station1.majorCharacters)).toBe(true);
    });

    it('should limit characters to 10', async () => {
      const mockAnalysis = Array(20).fill('شخصية').join('\n');
      
      mockAnalyzeText.mockResolvedValue(mockAnalysis);

      const result = await analysisService.runFullPipeline({
        fullText: 'نص',
        projectName: 'مشروع',
        metadata: {},
      });

      expect(result.stationOutputs.station1.majorCharacters.length).toBeLessThanOrEqual(10);
    });
  });

  describe('extractRelationships', () => {
    it('should extract relationships', async () => {
      const mockAnalysis = 'العلاقات: البطل والبطلة لديهم علاقة حب';
      
      mockAnalyzeText.mockResolvedValue(mockAnalysis);

      const result = await analysisService.runFullPipeline({
        fullText: 'نص',
        projectName: 'مشروع',
        metadata: {},
      });

      expect(result.stationOutputs.station1.relationships).toBeDefined();
      expect(Array.isArray(result.stationOutputs.station1.relationships)).toBe(true);
    });

    it('should include relationship properties', async () => {
      const mockAnalysis = 'تحليل';
      
      mockAnalyzeText.mockResolvedValue(mockAnalysis);

      const result = await analysisService.runFullPipeline({
        fullText: 'نص',
        projectName: 'مشروع',
        metadata: {},
      });

      const relationship = result.stationOutputs.station1.relationships[0];
      expect(relationship).toHaveProperty('character1');
      expect(relationship).toHaveProperty('character2');
      expect(relationship).toHaveProperty('relationshipType');
      expect(relationship).toHaveProperty('strength');
    });
  });
});
