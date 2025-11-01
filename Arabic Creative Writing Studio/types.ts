// types.ts
// أنواع وواجهات استوديو الكتابة الإبداعية العربي

export type Language = 'ar' | 'en';
export type Theme = 'dark' | 'light' | 'auto';
export type TextDirection = 'rtl' | 'ltr';

// أنواع المحفزات الإبداعية
export type CreativeGenre = 
  | 'fantasy' 
  | 'science_fiction' 
  | 'mystery' 
  | 'romance' 
  | 'historical_fiction' 
  | 'literary_fiction' 
  | 'poetry' 
  | 'cross_genre';

// تقنيات الكتابة
export type WritingTechnique = 
  | 'character_driven' 
  | 'world_building' 
  | 'plot_driven' 
  | 'dialogue_driven' 
  | 'sensory_driven' 
  | 'atmospheric' 
  | 'experimental';

// مستويات الصعوبة
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'academic';

// واجهة المحفز الإبداعي
export interface CreativePrompt {
  id: string;
  title: string;
  description: string;
  genre: CreativeGenre;
  technique: WritingTechnique;
  difficulty: DifficultyLevel;
  wordCount?: number;
  timeEstimate?: string;
  tags: string[];
  arabic: string;
  english?: string;
  examples?: string[];
  tips?: string[];
  relatedPrompts?: string[];
}

// واجهة المشروع الإبداعي
export interface CreativeProject {
  id: string;
  title: string;
  content: string;
  promptId?: string;
  genre: CreativeGenre;
  wordCount: number;
  characterCount: number;
  paragraphCount: number;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  isCompleted: boolean;
  qualityScore?: number;
}

// واجهة تحليل النص
export interface TextAnalysis {
  wordCount: number;
  characterCount: number;
  paragraphCount: number;
  sentenceCount: number;
  averageWordsPerSentence: number;
  averageSentencesPerParagraph: number;
  readabilityScore: number;
  vocabularyDiversity: number;
  sentenceVariety: number;
  emotionalTone: 'positive' | 'neutral' | 'negative';
  qualityMetrics: {
    clarity: number;
    creativity: number;
    coherence: number;
    impact: number;
  };
  suggestions: string[];
}

// واجهة إعدادات التطبيق
export interface AppSettings {
  language: Language;
  theme: Theme;
  textDirection: TextDirection;
  fontSize: 'small' | 'medium' | 'large';
  autoSave: boolean;
  autoSaveInterval: number;
  geminiApiKey?: string;
  geminiModel: string;
  geminiTemperature: number;
  geminiMaxTokens: number;
}

// واجهة إعدادات Gemini API
export interface GeminiSettings {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  topK: number;
}

// واجهة استجابة API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// واجهة بيانات المحفز المحسن
export interface EnhancedPromptData {
  originalPrompt: string;
  enhancedPrompt: string;
  improvements: string[];
  estimatedTokens: number;
  estimatedCost: number;
}

// واجهة التحدي الأسبوعي
export interface WeeklyChallenge {
  id: string;
  week: number;
  title: string;
  description: string;
  requirements: string[];
  deadline: Date;
  reward: string;
  participants?: number;
}

// واجهة محفز اليوم
export interface DailyPrompt {
  id: string;
  date: string;
  prompt: CreativePrompt;
  specialEvent?: string;
}

// واجهة إحصائيات المستخدم
export interface UserStatistics {
  totalProjects: number;
  totalWords: number;
  averageQuality: number;
  favoriteGenre: CreativeGenre;
  writingStreak: number;
  completedChallenges: number;
  timeSpentWriting: number;
  improvementScore: number;
}

// واجهة إعدادات التصدير
export interface ExportSettings {
  format: 'txt' | 'json' | 'html' | 'rtf' | 'pdf';
  includeMetadata: boolean;
  includeAnalysis: boolean;
  fontSize?: number;
  fontFamily?: string;
}

// نوع أحداث التطبيق
export type AppEvent = 
  | 'prompt_generated'
  | 'text_analyzed'
  | 'project_saved'
  | 'project_exported'
  | 'settings_updated'
  | 'api_connected'
  | 'challenge_completed';

// واجهة حدث التطبيق
export interface AppEventData {
  type: AppEvent;
  timestamp: Date;
  data: any;
  userId?: string;
}