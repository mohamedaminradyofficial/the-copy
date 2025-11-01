// SettingsPanel.tsx
// لوحة إعدادات التطبيق

"use client";

import React, { useState, useCallback } from 'react';
import { AppSettings, GeminiSettings } from '../types';

interface SettingsPanelProps {
  settings: AppSettings;
  onSettingsUpdate: (newSettings: Partial<AppSettings>) => void;
  onTestConnection: () => Promise<void>;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onSettingsUpdate,
  onTestConnection
}) => {
  const [isTestingConnection, setIsTestingConnection] = useState<boolean>(false);
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [tempSettings, setTempSettings] = useState<AppSettings>(settings);

  // اختبار اتصال API
  const handleTestConnection = useCallback(async () => {
    if (!tempSettings.geminiApiKey) {
      alert('يرجى إدخال مفتاح API أولاً');
      return;
    }

    setIsTestingConnection(true);
    try {
      await onTestConnection();
    } finally {
      setIsTestingConnection(false);
    }
  }, [tempSettings.geminiApiKey, onTestConnection]);

  // حفظ الإعدادات
  const handleSaveSettings = useCallback(() => {
    onSettingsUpdate(tempSettings);
  }, [tempSettings, onSettingsUpdate]);

  // تحديث إعداد مؤقت
  const updateTempSetting = useCallback(<K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    setTempSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">⚙️ إعدادات التطبيق</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* إعدادات Gemini API */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-6 text-purple-800">
            🤖 إعدادات Gemini API
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔑 مفتاح API
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={tempSettings.geminiApiKey || ''}
                  onChange={(e) => updateTempSetting('geminiApiKey', e.target.value)}
                  placeholder="أدخل مفتاح Gemini API هنا..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showApiKey ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🧠 النموذج
              </label>
              <select
                value={tempSettings.geminiModel}
                onChange={(e) => updateTempSetting('geminiModel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🌡️ درجة الحرارة: {tempSettings.geminiTemperature}
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={tempSettings.geminiTemperature}
                onChange={(e) => updateTempSetting('geminiTemperature', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>محافظ (0.0)</span>
                <span>متوازن (1.0)</span>
                <span>إبداعي (2.0)</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📏 أقصى عدد رموز: {tempSettings.geminiMaxTokens}
              </label>
              <input
                type="range"
                min="1024"
                max="32768"
                step="1024"
                value={tempSettings.geminiMaxTokens}
                onChange={(e) => updateTempSetting('geminiMaxTokens', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-500 mt-1">
                1K - 32K رمز
              </div>
            </div>

            <button
              onClick={handleTestConnection}
              disabled={isTestingConnection || !tempSettings.geminiApiKey}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {isTestingConnection ? '🔄 جاري الاختبار...' : '🧪 اختبار الاتصال'}
            </button>
          </div>

          {/* دليل الحصول على API Key */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">📋 دليل الإعداد السريع:</h4>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. قم بزيارة <a href="https://ai.google.dev" target="_blank" rel="noopener noreferrer" className="underline">ai.google.dev</a></li>
              <li>2. اضغط على "Get API Key"</li>
              <li>3. أنشئ مفتاح API جديد</li>
              <li>4. انسخ والصق المفتاح أعلاه</li>
              <li>5. اضغط "اختبار الاتصال" للتأكد</li>
            </ol>
          </div>
        </div>

        {/* إعدادات الواجهة */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-6 text-blue-800">
            🎨 إعدادات الواجهة
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🌍 اللغة
              </label>
              <select
                value={tempSettings.language}
                onChange={(e) => updateTempSetting('language', e.target.value as 'ar' | 'en')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🌙 المظهر
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['light', 'dark', 'auto'] as const).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => updateTempSetting('theme', theme)}
                    className={`px-3 py-2 rounded-lg border transition-colors ${
                      tempSettings.theme === theme
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    {theme === 'light' ? '☀️ فاتح' : 
                     theme === 'dark' ? '🌙 داكن' : '🔄 تلقائي'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📝 حجم الخط
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => updateTempSetting('fontSize', size)}
                    className={`px-3 py-2 rounded-lg border transition-colors ${
                      tempSettings.fontSize === size
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    {size === 'small' ? 'صغير' : 
                     size === 'medium' ? 'متوسط' : 'كبير'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ↔️ اتجاه النص
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['rtl', 'ltr'] as const).map((direction) => (
                  <button
                    key={direction}
                    onClick={() => updateTempSetting('textDirection', direction)}
                    className={`px-3 py-2 rounded-lg border transition-colors ${
                      tempSettings.textDirection === direction
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    {direction === 'rtl' ? '⬅️ من اليمين' : '➡️ من اليسار'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* إعدادات الحفظ */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-6 text-green-800">
            💾 إعدادات الحفظ
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  الحفظ التلقائي
                </label>
                <p className="text-xs text-gray-500">
                  حفظ تلقائي للمشاريع أثناء الكتابة
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={tempSettings.autoSave}
                  onChange={(e) => updateTempSetting('autoSave', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            {tempSettings.autoSave && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  فترة الحفظ: {tempSettings.autoSaveInterval / 1000} ثانية
                </label>
                <input
                  type="range"
                  min="10000"
                  max="300000"
                  step="10000"
                  value={tempSettings.autoSaveInterval}
                  onChange={(e) => updateTempSetting('autoSaveInterval', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>10 ثوان</span>
                  <span>5 دقائق</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* معلومات النظام */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-6 text-orange-800">
            ℹ️ معلومات النظام
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">إصدار التطبيق:</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">نموذج الذكاء الاصطناعي:</span>
              <span className="font-medium">{tempSettings.geminiModel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">حالة API:</span>
              <span className={`font-medium ${tempSettings.geminiApiKey ? 'text-green-600' : 'text-red-600'}`}>
                {tempSettings.geminiApiKey ? '✅ متصل' : '❌ غير متصل'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">اللغة:</span>
              <span className="font-medium">{tempSettings.language === 'ar' ? 'العربية' : 'English'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* أزرار الحفظ والإلغاء */}
      <div className="flex justify-end space-x-4 space-x-reverse mt-8">
        <button
          onClick={() => setTempSettings(settings)}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          ↩️ إلغاء التغييرات
        </button>
        <button
          onClick={handleSaveSettings}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          💾 حفظ الإعدادات
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;