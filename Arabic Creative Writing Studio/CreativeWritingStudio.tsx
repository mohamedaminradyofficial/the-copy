// CreativeWritingStudio.tsx
// المكون الرئيسي لاستوديو الكتابة الإبداعية

import React, { useState, useEffect, useCallback } from 'react';
import { 
  CreativePrompt, 
  CreativeProject, 
  TextAnalysis, 
  AppSettings, 
  CreativeGenre,
  WritingTechnique,
  DifficultyLevel 
} from './types';
import { GeminiService } from './geminiService';
import { PromptLibrary } from './PromptLibrary';
import { WritingEditor } from './WritingEditor';
import { TextAnalyzer } from './TextAnalyzer';
import { SettingsPanel } from './SettingsPanel';

interface CreativeWritingStudioProps {
  initialSettings?: Partial<AppSettings>;
}

export const CreativeWritingStudio: React.FC<CreativeWritingStudioProps> = ({ 
  initialSettings 
}) => {
  // حالات التطبيق الأساسية
  const [currentView, setCurrentView] = useState<'home' | 'library' | 'editor' | 'analysis' | 'settings'>('home');
  const [currentProject, setCurrentProject] = useState<CreativeProject | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<CreativePrompt | null>(null);
  const [projects, setProjects] = useState<CreativeProject[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    language: 'ar',
    theme: 'dark',
    textDirection: 'rtl',
    fontSize: 'medium',
    autoSave: true,
    autoSaveInterval: 30000,
    geminiModel: 'gemini-2.5-pro',
    geminiTemperature: 0.7,
    geminiMaxTokens: 8192,
    ...initialSettings
  });

  // خدمات التطبيق
  const [geminiService, setGeminiService] = useState<GeminiService | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  } | null>(null);

  // تهيئة خدمة Gemini
  useEffect(() => {
    if (settings.geminiApiKey) {
      const service = new GeminiService({
        apiKey: settings.geminiApiKey,
        model: settings.geminiModel,
        temperature: settings.geminiTemperature,
        maxTokens: settings.geminiMaxTokens,
        topP: 0.95,
        topK: 40
      });
      setGeminiService(service);
    }
  }, [settings.geminiApiKey, settings.geminiModel]);

  // عرض الإشعارات
  const showNotification = useCallback((
    type: 'success' | 'error' | 'warning' | 'info',
    message: string
  ) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  // حفظ المشروع
  const saveProject = useCallback((project: CreativeProject) => {
    const existingIndex = projects.findIndex(p => p.id === project.id);
    if (existingIndex >= 0) {
      const newProjects = [...projects];
      newProjects[existingIndex] = { ...project, updatedAt: new Date() };
      setProjects(newProjects);
    } else {
      setProjects([...projects, project]);
    }
    setCurrentProject(project);
    showNotification('success', 'تم حفظ المشروع بنجاح 🎉');
  }, [projects, showNotification]);

  // إنشاء مشروع جديد
  const createNewProject = useCallback((prompt?: CreativePrompt) => {
    const newProject: CreativeProject = {
      id: `project_${Date.now()}`,
      title: prompt ? prompt.title : 'مشروع جديد',
      content: '',
      promptId: prompt?.id,
      genre: prompt?.genre || 'cross_genre',
      wordCount: 0,
      characterCount: 0,
      paragraphCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: prompt?.tags || [],
      isCompleted: false
    };

    setCurrentProject(newProject);
    setSelectedPrompt(prompt || null);
    setCurrentView('editor');
  }, []);

  // تحليل النص
  const analyzeText = useCallback(async (text: string): Promise<TextAnalysis | null> => {
    if (!geminiService) {
      showNotification('warning', 'يرجى إعداد مفتاح Gemini API أولاً');
      return null;
    }

    setLoading(true);
    try {
      const response = await geminiService.analyzeText(text);
      if (response.success) {
        showNotification('success', 'تم تحليل النص بنجاح 📊');
        return response.data;
      } else {
        showNotification('error', response.error || 'فشل في تحليل النص');
        return null;
      }
    } catch (error) {
      showNotification('error', 'حدث خطأ أثناء تحليل النص');
      return null;
    } finally {
      setLoading(false);
    }
  }, [geminiService, showNotification]);

  // تحسين المحفز
  const enhancePrompt = useCallback(async (
    prompt: string, 
    genre: CreativeGenre, 
    technique: WritingTechnique
  ) => {
    if (!geminiService) {
      showNotification('warning', 'يرجى إعداد مفتاح Gemini API أولاً');
      return null;
    }

    setLoading(true);
    try {
      const response = await geminiService.enhancePrompt(prompt, genre, technique);
      if (response.success) {
        showNotification('success', 'تم تحسين المحفز بنجاح 🚀');
        return response.data;
      } else {
        showNotification('error', response.error || 'فشل في تحسين المحفز');
        return null;
      }
    } catch (error) {
      showNotification('error', 'حدث خطأ أثناء تحسين المحفز');
      return null;
    } finally {
      setLoading(false);
    }
  }, [geminiService, showNotification]);

  // تصدير المشروع
  const exportProject = useCallback((
    project: CreativeProject,
    format: 'txt' | 'json' | 'html' | 'rtf'
  ) => {
    let content = '';
    const filename = `${project.title.replace(/[^a-zA-Z0-9؀-ۿ]/g, '_')}.${format}`;

    switch (format) {
      case 'txt':
        content = `${project.title}

${project.content}`;
        break;
      case 'json':
        content = JSON.stringify(project, null, 2);
        break;
      case 'html':
        content = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>${project.title}</title>
    <style>
        body { font-family: 'Noto Sans Arabic', Arial; padding: 20px; }
        h1 { color: #6B46C1; }
        p { line-height: 1.8; }
    </style>
</head>
<body>
    <h1>${project.title}</h1>
    <div>${project.content.replace(/
/g, '<br>')}</div>
</body>
</html>
        `;
        break;
      case 'rtf':
        content = `{\rtf1\ansi\deff0 {\fonttbl {\f0 Times New Roman;}}\f0\fs24 ${project.title}\par ${project.content}}`;
        break;
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showNotification('success', `تم تصدير الملف بصيغة ${format.toUpperCase()} 📤`);
  }, [showNotification]);

  // تحديث الإعدادات
  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    showNotification('success', 'تم حفظ الإعدادات ⚙️');
  }, [showNotification]);

  // عرض شريط التنقل العلوي
  const renderHeader = () => (
    <header className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 space-x-reverse">
          <h1 className="text-2xl font-bold">🎨 استوديو الكتابة الإبداعية</h1>
          <span className="text-purple-200">مدعوم بـ Gemini 2.5 Pro</span>
        </div>
        <nav className="flex space-x-4 space-x-reverse">
          <button
            onClick={() => setCurrentView('home')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentView === 'home' ? 'bg-white text-purple-900' : 'hover:bg-purple-800'
            }`}
          >
            🏠 الرئيسية
          </button>
          <button
            onClick={() => setCurrentView('library')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentView === 'library' ? 'bg-white text-purple-900' : 'hover:bg-purple-800'
            }`}
          >
            📚 مكتبة المحفزات
          </button>
          <button
            onClick={() => setCurrentView('editor')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentView === 'editor' ? 'bg-white text-purple-900' : 'hover:bg-purple-800'
            }`}
          >
            ✍️ المحرر
          </button>
          <button
            onClick={() => setCurrentView('settings')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentView === 'settings' ? 'bg-white text-purple-900' : 'hover:bg-purple-800'
            }`}
          >
            ⚙️ الإعدادات
          </button>
        </nav>
      </div>
    </header>
  );

  // عرض الإشعارات
  const renderNotification = () => {
    if (!notification) return null;

    const bgColors = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      warning: 'bg-yellow-500',
      info: 'bg-blue-500'
    };

    return (
      <div className={`fixed top-4 right-4 ${bgColors[notification.type]} text-white p-4 rounded-lg shadow-lg z-50`}>
        {notification.message}
      </div>
    );
  };

  // عرض المحتوى الرئيسي
  const renderMainContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <div className="text-center py-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              مرحباً بك في عالم الإبداع! 🌟
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              ابدأ رحلتك الإبداعية مع أكثر من 114 محفز كتابة احترافي
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div 
                className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => setCurrentView('library')}
              >
                <div className="text-4xl mb-4">📚</div>
                <h3 className="font-bold mb-2">مكتبة المحفزات</h3>
                <p className="text-gray-600">استكشف مجموعة متنوعة من المحفزات الإبداعية</p>
              </div>
              <div 
                className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => createNewProject()}
              >
                <div className="text-4xl mb-4">✍️</div>
                <h3 className="font-bold mb-2">ابدأ الكتابة</h3>
                <p className="text-gray-600">أنشئ مشروع جديد وابدأ رحلة الإبداع</p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="font-bold mb-2">محفز اليوم</h3>
                <p className="text-gray-600">تحدٍ إبداعي جديد كل يوم</p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="font-bold mb-2">التحدي الأسبوعي</h3>
                <p className="text-gray-600">شارك في التحديات الأسبوعية</p>
              </div>
            </div>
          </div>
        );

      case 'library':
        return (
          <PromptLibrary
            onPromptSelect={(prompt) => {
              setSelectedPrompt(prompt);
              createNewProject(prompt);
            }}
            onEnhancePrompt={enhancePrompt}
            loading={loading}
          />
        );

      case 'editor':
        return (
          <WritingEditor
            project={currentProject}
            selectedPrompt={selectedPrompt}
            onProjectChange={setCurrentProject}
            onSave={saveProject}
            onAnalyze={analyzeText}
            onExport={exportProject}
            settings={settings}
            loading={loading}
          />
        );

      case 'settings':
        return (
          <SettingsPanel
            settings={settings}
            onSettingsUpdate={updateSettings}
            onTestConnection={async () => {
              if (geminiService) {
                const result = await geminiService.testConnection();
                showNotification(
                  result.success ? 'success' : 'error',
                  result.message || 'تم اختبار الاتصال'
                );
              }
            }}
          />
        );

      default:
        return <div>المحتوى غير متوفر</div>;
    }
  };

  return (
    <div className={`min-h-screen ${settings.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`} dir={settings.textDirection}>
      {renderHeader()}
      {renderNotification()}
      <main className="container mx-auto px-4 py-8">
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">جاري المعالجة... يرجى الانتظار 🔄</p>
            </div>
          </div>
        )}
        {renderMainContent()}
      </main>
    </div>
  );
};

export default CreativeWritingStudio;