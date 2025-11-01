/**
 * استوديو هندسة الأوامر - Prompt Engineering Studio
 * TypeScript-style Configuration with JSDoc types
 * @version 2.0.0
 */

/** @typedef {'zero-shot' | 'few-shot' | 'chain-of-thought' | 'role-based' | 'task-specific'} PromptType */
/** @typedef {'costar' | 'clear' | 'ice' | 'craft' | 'star'} FrameworkType */
/** @typedef {'مبتدئ' | 'متوسط' | 'متقدم' | 'خبير'} DifficultyLevel */

/** @type {{appName: string, version: string, totalTemplates: number, frameworks: number, categories: number}} */
const STUDIO_CONFIG = {
  appName: 'استوديو هندسة الأوامر',
  version: '2.0.0',
  subtitle: 'مدعوم بـ Gemini 2.5 Pro - تحسين متقدم',
  totalTemplates: 200,
  frameworks: 5,
  categories: 12,
  autoSaveInterval: 30000,
  apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent'
};

/** 
 * Calculate total templates across all categories
 * @returns {number} Total number of templates
 */
function getTotalTemplates() {
  return Object.values(promptEngineeringData.categories).reduce((total, cat) => total + cat.templates.length, 0);
}

// API Configuration (stored in memory only)
let apiConfig = {
  apiKey: '',
  model: 'gemini-2.0-flash-exp',
  temperature: 0.7,
  maxTokens: 2048,
  isConnected: false
};

// In-memory storage (no localStorage due to sandbox restrictions)
let writingHistory = [];
let savedPrompts = [];
let currentDraft = null;

/**
 * Prompt Engineering Data Structure
 * TypeScript-style data with comprehensive templates
 * @type {Object}
 */
const promptEngineeringData = {
  categories: {
    content_creation: {
      nameAr: "إنشاء المحتوى",
      nameEn: "Content Creation",
      icon: "📝",
      color: "#3B82F6",
      description: "قوالب لكتابة المقالات، المحتوى التسويقي، وسائل التواصل، والإعلانات",
      templates: [
        {
          id: "blog-writer-pro",
          titleAr: "كاتب المقالات المحترف",
          framework: "costar",
          difficulty: "متوسط",
          description: "أنشئ مقالات شاملة بأسلوب محترف محسّن لمحركات البحث"
        },
        {
          id: "social-media-master",
          titleAr: "خبير وسائل التواصل الاجتماعي",
          framework: "clear",
          difficulty: "مبتدئ",
          description: "أنشئ محتوى جذاب لمنصات التواصل الاجتماعي"
        },
        {
          id: "ad-copy-wizard",
          titleAr: "ساحر كتابة الإعلانات",
          framework: "craft",
          difficulty: "متقدم",
          description: "أنشئ نصوص إعلانية مقنعة وفعّالة"
        }
      ]
    },
    analysis_research: {
      nameAr: "التحليل والبحث",
      nameEn: "Analysis & Research",
      icon: "🔍",
      color: "#10B981",
      description: "قوالب لتحليل البيانات، البحث الأكاديمي، والتقارير",
      templates: [
        {
          id: "data-analyst-expert",
          titleAr: "محلل البيانات الخبير",
          framework: "costar",
          difficulty: "متقدم",
          description: "حلل البيانات المعقدة واستخرج رؤى قيّمة"
        },
        {
          id: "research-paper-writer",
          titleAr: "كاتب الأبحاث الأكاديمية",
          framework: "ice",
          difficulty: "خبير",
          description: "أنشئ أبحاث أكاديمية عالية الجودة"
        }
      ]
    },
    programming_development: {
      nameAr: "البرمجة والتطوير",
      nameEn: "Programming & Development",
      icon: "💻",
      color: "#8B5CF6",
      description: "قوالب لتوليد الكود، إصلاح الأخطاء، ومراجعة البرامج",
      templates: [
        {
          id: "code-generator-pro",
          titleAr: "مولد الكود المحترف",
          framework: "craft",
          difficulty: "متقدم",
          description: "ولّد كود برمجي نظيف وموثق"
        }
      ]
    },
    business_productivity: {
      nameAr: "الأعمال والإنتاجية",
      nameEn: "Business & Productivity",
      icon: "💼",
      color: "#F59E0B",
      description: "قوالب للرسائل التجارية، العروض، وإدارة المشاريع",
      templates: [
        {
          id: "business-email-writer",
          titleAr: "كاتب الرسائل التجارية",
          framework: "costar",
          difficulty: "متوسط",
          description: "أنشئ رسائل بريد إلكتروني مهنية وفعّالة"
        }
      ]
    },
    education_training: {
      nameAr: "التعليم والتدريب",
      nameEn: "Education & Training",
      icon: "🎓",
      color: "#EF4444",
      description: "قوالب لشرح المفاهيم، إنشاء الدروس، والاختبارات",
      templates: [
        {
          id: "concept-explainer",
          titleAr: "شارح المفاهيم",
          framework: "ice",
          difficulty: "متوسط",
          description: "اشرح مفاهيم معقدة بطريقة بسيطة"
        }
      ]
    },
    marketing_sales: {
      nameAr: "التسويق والمبيعات",
      nameEn: "Marketing & Sales",
      icon: "📊",
      color: "#06B6D4",
      description: "قوالب لاستراتيجيات التسويق وعروض المبيعات",
      templates: [
        {
          id: "marketing-strategy",
          titleAr: "مخطط التسويق",
          framework: "costar",
          difficulty: "متقدم",
          description: "طوّر استراتيجيات تسويقية شاملة"
        }
      ]
    }
  },
  frameworks: {
    costar: {
      nameAr: "إطار COSTAR",
      nameEn: "COSTAR Framework",
      icon: "⭐",
      description: "السياق، الهدف، الأسلوب، النبرة، الجمهور، الاستجابة",
      components: [
        { key: "context", nameAr: "السياق (Context)", required: true },
        { key: "objective", nameAr: "الهدف (Objective)", required: true },
        { key: "style", nameAr: "الأسلوب (Style)", required: false },
        { key: "tone", nameAr: "النبرة (Tone)", required: false },
        { key: "audience", nameAr: "الجمهور (Audience)", required: true },
        { key: "response", nameAr: "الاستجابة (Response)", required: true }
      ]
    },
    clear: {
      nameAr: "إطار CLEAR",
      nameEn: "CLEAR Framework",
      icon: "💎",
      description: "موجز، منطقي، واضح، قابل للتكيف، تأملي",
      components: [
        { key: "concise", nameAr: "موجز (Concise)", required: true },
        { key: "logical", nameAr: "منطقي (Logical)", required: true },
        { key: "explicit", nameAr: "واضح (Explicit)", required: true },
        { key: "adaptive", nameAr: "قابل للتكيف (Adaptive)", required: false },
        { key: "reflective", nameAr: "تأملي (Reflective)", required: false }
      ]
    },
    ice: {
      nameAr: "إطار ICE",
      nameEn: "ICE Framework",
      icon: "🧊",
      description: "التعليمات، السياق، الأمثلة",
      components: [
        { key: "instruction", nameAr: "التعليمات (Instruction)", required: true },
        { key: "context", nameAr: "السياق (Context)", required: true },
        { key: "examples", nameAr: "الأمثلة (Examples)", required: false }
      ]
    },
    craft: {
      nameAr: "إطار CRAFT",
      nameEn: "CRAFT Framework",
      icon: "🎨",
      description: "السياق، الدور، العمل، التنسيق، النبرة",
      components: [
        { key: "context", nameAr: "السياق (Context)", required: true },
        { key: "role", nameAr: "الدور (Role)", required: true },
        { key: "action", nameAr: "العمل (Action)", required: true },
        { key: "format", nameAr: "التنسيق (Format)", required: true },
        { key: "tone", nameAr: "النبرة (Tone)", required: false }
      ]
    },
    star: {
      nameAr: "إطار STAR",
      nameEn: "STAR Framework",
      icon: "✨",
      description: "الموقف، المهمة، الإجراء، النتيجة",
      components: [
        { key: "situation", nameAr: "الموقف (Situation)", required: true },
        { key: "task", nameAr: "المهمة (Task)", required: true },
        { key: "action", nameAr: "الإجراء (Action)", required: true },
        { key: "result", nameAr: "النتيجة (Result)", required: true }
      ]
    }
  },
  promptTypes: {
    'zero-shot': { nameAr: 'عديم الأمثلة', color: '#3B82F6' },
    'few-shot': { nameAr: 'مع أمثلة', color: '#10B981' },
    'chain-of-thought': { nameAr: 'سلسلة تفكير', color: '#8B5CF6' },
    'role-based': { nameAr: 'قائم على الدور', color: '#F59E0B' },
    'task-specific': { nameAr: 'محدد المهمة', color: '#EF4444' }
  },
  difficultyLevels: {
    'مبتدئ': { nameEn: "Beginner", color: "#10B981", icon: "🌱" },
    'متوسط': { nameEn: "Intermediate", color: "#3B82F6", icon: "🌿" },
    'متقدم': { nameEn: "Advanced", color: "#8B5CF6", icon: "🌳" },
    'خبير': { nameEn: "Expert", color: "#EF4444", icon: "🎓" }
  }
};

/** System Messages in Arabic */
const SYSTEM_MESSAGES = {
  success: {
    promptGenerated: "🎉 تم إنشاء الأمر المحسّن بنجاح!",
    promptSaved: "💾 تم حفظ الأمر بنجاح",
    promptCopied: "📋 تم نسخ الأمر إلى الحافظة",
    settingsSaved: "⚙️ تم حفظ الإعدادات بنجاح",
    apiConnected: "🔗 تم الاتصال بـ API بنجاح"
  },
  error: {
    apiKeyMissing: "⚠️ يرجى إدخال مفتاح API صحيح",
    apiConnectionFailed: "❌ فشل الاتصال بـ API، تحقق من مفتاح API",
    promptTooShort: "⚠️ الأمر قصير جداً، يرجى إضافة المزيد",
    networkError: "🌐 خطأ في الشبكة",
    processingError: "❌ حدث خطأ أثناء المعالجة"
  },
  info: {
    processing: "🔄 جاري تحسين الأمر... يرجى الانتظار",
    analyzing: "🔍 جاري تحليل الأمر...",
    saving: "💾 جاري الحفظ...",
    loading: "⏳ جاري التحميل..."
  }
};

/** Application State - TypeScript style */
let appState = {
  currentText: "",
  selectedCategory: null,
  selectedFramework: "costar",
  currentTemplate: null,
  sidebarCollapsed: false,
  enhancedPrompt: "",
  analysis: null
};



/**
 * Initialize Prompt Engineering Studio Application
 */
function initializeApp() {
  setupEventListeners();
  loadCategories();
  updatePromptMetrics();
  checkApiStatus();
  
  // Update display
  const totalTemplates = getTotalTemplates();
  const display = document.getElementById('totalPromptsDisplay');
  if (display) display.textContent = `${totalTemplates}+`;
  
  showToast('success', `⚡ مرحباً بك في استوديو هندسة الأوامر!`);
  
  setInterval(autoSave, STUDIO_CONFIG.autoSaveInterval);
}

/**
 * Setup Event Listeners
 */
function setupEventListeners() {
  const promptInput = document.getElementById('promptInput');
  let debounceTimer;
  
  promptInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      appState.currentText = e.target.value;
      updatePromptMetrics();
    }, 500);
  });

  // Framework selector
  document.querySelectorAll('.framework-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.framework-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      appState.selectedFramework = btn.dataset.framework;
    });
  });

  // Main buttons
  document.getElementById('generateBtn').addEventListener('click', generateRandomTemplate);
  document.getElementById('clearBtn').addEventListener('click', clearInput);
  document.getElementById('copyBtn').addEventListener('click', copyPrompt);
  document.getElementById('exportBtn').addEventListener('click', () => showModal('exportModal'));
  document.getElementById('saveBtn').addEventListener('click', saveToHistory);
  document.getElementById('toggleSidebar').addEventListener('click', toggleSidebar);
  document.getElementById('historyBtn').addEventListener('click', showHistory);
  document.getElementById('settingsBtn').addEventListener('click', showSettings);
  document.getElementById('analyzeBtn').addEventListener('click', analyzePrompt);
  
  const enhanceBtn = document.getElementById('enhanceBtn');
  if (enhanceBtn) enhanceBtn.addEventListener('click', enhanceWithAI);

  // Modal controls
  document.getElementById('closeExportModal').addEventListener('click', () => hideModal('exportModal'));
  document.getElementById('closeHistoryModal').addEventListener('click', () => hideModal('historyModal'));
  document.getElementById('closeHistoryBtn').addEventListener('click', () => hideModal('historyModal'));
  document.getElementById('clearHistory').addEventListener('click', clearAllHistory);
  document.getElementById('closeSettingsModal').addEventListener('click', () => hideModal('settingsModal'));
  
  // API Settings controls
  document.getElementById('testApiKey').addEventListener('click', testApiConnection);
  document.getElementById('toggleApiKeyVisibility').addEventListener('click', toggleApiKeyVisibility);
  document.getElementById('saveSettings').addEventListener('click', saveApiSettings);
  document.getElementById('resetSettings').addEventListener('click', resetApiSettings);
  
  // Settings sliders
  document.getElementById('temperature').addEventListener('input', (e) => {
    document.getElementById('tempValue').textContent = e.target.value;
  });

  // Export options
  document.querySelectorAll('.export-option').forEach(option => {
    option.addEventListener('click', (e) => {
      const format = option.dataset.format;
      exportWriting(format);
    });
  });
}

/**
 * Load Categories into Sidebar
 */
function loadCategories() {
  const categoryMap = {
    'content_creation': 'contentCreation',
    'analysis_research': 'analysisResearch',
    'programming_development': 'programmingDev',
    'business_productivity': 'businessProd',
    'education_training': 'educationTraining',
    'marketing_sales': 'marketingSales'
  };

  Object.keys(promptEngineeringData.categories).forEach(catKey => {
    const category = promptEngineeringData.categories[catKey];
    const containerId = categoryMap[catKey];
    const container = document.getElementById(containerId);
    if (!container) return;

    // Show templates
    category.templates.forEach((template, index) => {
      const templateItem = document.createElement('div');
      templateItem.className = 'template-item';
      const difficultyIcon = promptEngineeringData.difficultyLevels[template.difficulty]?.icon || '🌱';
      templateItem.innerHTML = `
        <strong>${difficultyIcon} ${template.titleAr}</strong>
        <span>${template.description}</span>
      `;
      templateItem.addEventListener('click', () => selectTemplate(catKey, template));
      container.appendChild(templateItem);
    });
    
    // Add count badge
    if (category.templates.length > 0) {
      const badge = document.createElement('div');
      badge.className = 'template-item';
      badge.style.background = 'var(--color-bg-2)';
      badge.style.textAlign = 'center';
      badge.style.fontWeight = 'bold';
      badge.style.color = 'var(--color-primary)';
      badge.innerHTML = `<strong>📊 ${category.templates.length} قالب</strong>`;
      container.appendChild(badge);
    }
  });
}

// Show All Prompts for a Genre
function showAllPromptsForGenre(genreKey) {
  const genre = creativeWritingData.genres[genreKey];
  const outputContent = document.getElementById('outputContent');
  
  outputContent.innerHTML = `
    <div style="padding: var(--space-24);">
      <h2 style="font-size: var(--font-size-3xl); margin-bottom: var(--space-16); color: var(--color-primary);">
        ${genre.icon} ${genre.name}
      </h2>
      <p style="font-size: var(--font-size-md); color: var(--color-text-secondary); margin-bottom: var(--space-24);">
        ${genre.description}
      </p>
      <p style="font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); margin-bottom: var(--space-16);">
        Total Prompts: ${genre.prompts.length}
      </p>
      <div style="display: flex; flex-direction: column; gap: var(--space-12);">
        ${genre.prompts.map((prompt, index) => `
          <div class="template-item" onclick="selectPrompt('${genreKey}', \`${prompt.replace(/`/g, '\\`').replace(/'/g, "\\'")}
\`)" style="cursor: pointer;">
            <strong>Prompt #${index + 1}</strong>
            <span>${prompt}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  showToast('info', `عرض جميع ${genre.prompts.length} محفز ${genre.name}`);
}

/**
 * Display Template in Output Panel
 */
function displayTemplateInOutput(template, category, framework) {
  const output = document.getElementById('outputContent');
  const difficultyInfo = promptEngineeringData.difficultyLevels[template.difficulty];
  
  output.innerHTML = `
    <div style="padding: var(--space-24); font-family: var(--font-family-base);">
      <div style="display: flex; align-items: center; gap: var(--space-12); margin-bottom: var(--space-16);">
        <span style="font-size: var(--font-size-3xl);">${category.icon}</span>
        <div>
          <h2 style="font-size: var(--font-size-2xl); margin: 0; color: var(--color-primary);">
            ${template.titleAr}
          </h2>
          <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin: var(--space-4) 0 0 0;">
            ${category.nameAr} | ${framework.nameAr}
          </p>
        </div>
      </div>
      
      <div style="display: flex; gap: var(--space-8); margin-bottom: var(--space-16);">
        <span class="status status--info" style="font-size: var(--font-size-xs);">
          ${difficultyInfo.icon} ${template.difficulty}
        </span>
        <span class="status status--success" style="font-size: var(--font-size-xs);">
          ${framework.icon} ${template.framework.toUpperCase()}
        </span>
      </div>
      
      <div style="padding: var(--space-16); background: var(--color-bg-2); border-radius: var(--radius-base); border-right: 3px solid var(--color-primary);">
        <h4 style="margin: 0 0 var(--space-8) 0; font-size: var(--font-size-md);">🎯 الوصف:</h4>
        <p style="margin: 0; color: var(--color-text); line-height: 1.6;">${template.description}</p>
      </div>
      
      <div style="margin-top: var(--space-20); padding: var(--space-16); background: var(--color-bg-1); border-radius: var(--radius-base);">
        <h4 style="margin: 0 0 var(--space-12) 0; font-size: var(--font-size-md);">💡 كيفية الاستخدام:</h4>
        <ol style="margin: 0; padding-right: var(--space-20); line-height: 1.8; color: var(--color-text-secondary);">
          <li>أدخل أمرك الأولي في محرر الأوامر</li>
          <li>تأكد من اختيار إطار "${framework.nameAr}"</li>
          <li>انقر "🔍 تحليل الأمر" لرؤية التحسينات المقترحة</li>
          <li>استخدم "🚀 تحسين متقدم بـ AI" للتحسين الأوتوماتيكي</li>
        </ol>
      </div>
    </div>
  `;
}

// Make functions globally accessible
window.selectTemplate = selectTemplate;

/**
 * Generate Random Template
 */
function generateRandomTemplate() {
  const categories = Object.keys(promptEngineeringData.categories);
  const randomCat = categories[Math.floor(Math.random() * categories.length)];
  const category = promptEngineeringData.categories[randomCat];
  
  if (category.templates.length > 0) {
    const randomTemplate = category.templates[Math.floor(Math.random() * category.templates.length)];
    selectTemplate(randomCat, randomTemplate);
  } else {
    showToast('info', 'لا توجد قوالب متاحة في هذه الفئة');
  }
}



/**
 * Show Framework Components
 */
function showFrameworkComponents(framework) {
  const section = document.getElementById('frameworkBreakdown');
  const components = document.getElementById('frameworkComponents');
  
  section.style.display = 'block';
  components.innerHTML = '';
  
  framework.components.forEach(comp => {
    const item = document.createElement('div');
    item.className = 'component-item';
    item.innerHTML = `
      <strong>${comp.nameAr}</strong>
      <p>${comp.required ? '✅ مطلوب' : '⚪ اختياري'}</p>
    `;
    components.appendChild(item);
  });
}

/**
 * Analyze Prompt Quality
 * @param {string} text - The prompt text to analyze
 * @returns {Object} Analysis results
 */
function analyzePromptQuality(text) {
  if (!text.trim()) {
    return {
      type: '--',
      effectiveness: 0,
      clarity: 0,
      completeness: 0,
      tokenCount: 0,
      estimatedCost: 0
    };
  }
  
  const words = text.split(/\s+/).length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
  
  // Detect prompt type
  const type = detectPromptType(text);
  
  // Calculate metrics
  const effectiveness = calculateEffectiveness(text);
  const clarity = calculateClarity(text);
  const completeness = calculateCompleteness(text);
  
  // Token estimation (rough: ~0.75 tokens per word)
  const tokenCount = Math.ceil(words * 0.75);
  
  // Cost estimation (Gemini 2.5 Pro: ~$0.00125 per 1K input tokens)
  const estimatedCost = (tokenCount / 1000) * 0.00125;
  
  return {
    type,
    effectiveness,
    clarity,
    completeness,
    tokenCount,
    estimatedCost
  };
}

/**
 * Detect Prompt Type
 */
function detectPromptType(text) {
  const lowerText = text.toLowerCase();
  
  if (/\b(مثال|كما في|example|for instance)\b/i.test(text)) {
    return 'few-shot';
  }
  if (/\b(خطوة|فكر|حلل|step|think|analyze)\b/i.test(text)) {
    return 'chain-of-thought';
  }
  if (/\b(أنت|بصفتك|كخبير|you are|as an expert|act as)\b/i.test(text)) {
    return 'role-based';
  }
  if (/\b(أنشئ|اكتب|حلل|لخص|create|write|analyze|summarize)\b/i.test(text)) {
    return 'task-specific';
  }
  
  return 'zero-shot';
}

/**
 * Calculate Effectiveness Score
 */
function calculateEffectiveness(text) {
  let score = 0;
  const words = text.split(/\s+/).length;
  
  // Length (20-200 words is ideal)
  if (words >= 20 && words <= 200) score += 30;
  else if (words < 20) score += words;
  else score += 30 - Math.min((words - 200) / 10, 20);
  
  // Has context
  if (/\b(السياق|الخلفية|context|background)\b/i.test(text)) score += 20;
  
  // Has specific goal
  if (/\b(الهدف|الغرض|goal|objective|purpose)\b/i.test(text)) score += 20;
  
  // Has constraints or format
  if (/\b(بتنسيق|بأسلوب|format|style|tone)\b/i.test(text)) score += 15;
  
  // Has examples
  if (/\b(مثال|example)\b/i.test(text)) score += 15;
  
  return Math.min(score, 100);
}

/**
 * Calculate Clarity Score
 */
function calculateClarity(text) {
  let score = 50; // Base score
  
  const sentences = text.split(/[.!?]+/).filter(s => s.trim());
  const avgLength = text.split(/\s+/).length / Math.max(sentences.length, 1);
  
  // Sentence length (10-25 words is clear)
  if (avgLength >= 10 && avgLength <= 25) score += 25;
  else score += Math.max(0, 25 - Math.abs(avgLength - 17));
  
  // Has clear structure
  if (/[\n\r]/.test(text)) score += 15; // Paragraphs
  if (/[\d+\.]|[-•*]/.test(text)) score += 10; // Lists
  
  return Math.min(score, 100);
}

/**
 * Calculate Completeness Score
 */
function calculateCompleteness(text) {
  let score = 0;
  
  // Check for key elements
  const hasTask = /\b(أنشئ|اكتب|قم بـ|create|write|generate|do)\b/i.test(text);
  const hasContext = text.split(/\s+/).length > 15;
  const hasAudience = /\b(لل|موجه|للجمهور|for|audience|target)\b/i.test(text);
  const hasFormat = /\b(تنسيق|أسلوب|format|style|structure)\b/i.test(text);
  const hasTone = /\b(نبرة|أسلوب|tone|voice)\b/i.test(text);
  
  if (hasTask) score += 30;
  if (hasContext) score += 25;
  if (hasAudience) score += 20;
  if (hasFormat) score += 15;
  if (hasTone) score += 10;
  
  return Math.min(score, 100);
}





/**
 * Update Prompt Metrics Display
 */
function updatePromptMetrics() {
  const text = appState.currentText;
  const analysis = analyzePromptQuality(text);
  
  // Update display
  const typeData = promptEngineeringData.promptTypes[analysis.type];
  document.getElementById('promptType').textContent = typeData ? typeData.nameAr : '--';
  document.getElementById('effectiveness').textContent = analysis.effectiveness > 0 ? `${analysis.effectiveness}/100` : '--/100';
  document.getElementById('clarity').textContent = analysis.clarity > 0 ? `${analysis.clarity}/100` : '--/100';
  document.getElementById('completeness').textContent = analysis.completeness > 0 ? `${analysis.completeness}/100` : '--/100';
  document.getElementById('tokenCount').textContent = analysis.tokenCount > 0 ? `${analysis.tokenCount} رمز` : '-- رمز';
  document.getElementById('estimatedCost').textContent = analysis.estimatedCost > 0 ? `$${analysis.estimatedCost.toFixed(4)}` : '$--';
  
  // Store analysis
  appState.analysis = analysis;
}



/**
 * Analyze Prompt and Show Improvements
 */
function analyzePrompt() {
  const text = appState.currentText.trim();
  
  if (!text) {
    showToast('error', '⚠️ يرجى إدخال أمر أولاً');
    return;
  }
  
  const analysis = analyzePromptQuality(text);
  const framework = promptEngineeringData.frameworks[appState.selectedFramework];
  
  // Generate improvements
  const improvements = generateImprovements(text, analysis, framework);
  
  // Display enhanced prompt
  displayEnhancedPrompt(text, analysis, framework, improvements);
  
  showToast('success', '🎯 تم تحليل الأمر بنجاح!');
}

/**
 * Generate Improvement Suggestions
 */
function generateImprovements(text, analysis, framework) {
  const improvements = [];
  
  if (analysis.effectiveness < 70) {
    improvements.push({
      title: '⭐ تحسين الفعالية',
      suggestion: 'أضف مزيداً من السياق والتفاصيل لتحسين وضوح الأمر'
    });
  }
  
  if (analysis.clarity < 70) {
    improvements.push({
      title: '💎 تحسين الوضوح',
      suggestion: 'استخدم جملاً قصيرة وواضحة، وقسّم الأمر إلى فقرات'
    });
  }
  
  if (analysis.completeness < 70) {
    improvements.push({
      title: '✅ تحسين الاكتمال',
      suggestion: `ضمّن جميع مكونات ${framework.nameAr}: ${framework.components.map(c => c.nameAr).join('، ')}`
    });
  }
  
  if (!text.includes('\n')) {
    improvements.push({
      title: '📝 البنية',
      suggestion: 'قسّم الأمر إلى أقسام واضحة باستخدام عناوين أو قوائم'
    });
  }
  
  return improvements;
}

/**
 * Display Enhanced Prompt with Analysis
 */
function displayEnhancedPrompt(original, analysis, framework, improvements) {
  const output = document.getElementById('outputContent');
  const typeData = promptEngineeringData.promptTypes[analysis.type];
  
  let enhanced = generateEnhancedVersion(original, framework);
  appState.enhancedPrompt = enhanced;
  
  output.innerHTML = `
    <div style="padding: var(--space-24); font-family: var(--font-family-base);">
      <h2 style="margin: 0 0 var(--space-16) 0; color: var(--color-primary);">✨ الأمر المحسّن</h2>
      
      <div style="display: flex; gap: var(--space-8); margin-bottom: var(--space-16); flex-wrap: wrap;">
        <span class="status status--info">📊 ${typeData.nameAr}</span>
        <span class="status status--success">⚡ ${analysis.effectiveness}/100</span>
        <span class="status" style="background: var(--color-bg-1); color: var(--color-primary);">💎 ${analysis.clarity}/100</span>
        <span class="status" style="background: var(--color-bg-3); color: var(--color-success);">✅ ${analysis.completeness}/100</span>
      </div>
      
      <div style="padding: var(--space-16); background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-base); font-family: var(--font-family-mono); white-space: pre-wrap; line-height: 1.6; margin-bottom: var(--space-16);">${enhanced}</div>
      
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-12); font-size: var(--font-size-sm);">
        <div style="padding: var(--space-12); background: var(--color-bg-5); border-radius: var(--radius-base);">
          <strong>🔢 تقدير الرموز:</strong> ${analysis.tokenCount} رمز
        </div>
        <div style="padding: var(--space-12); background: var(--color-bg-6); border-radius: var(--radius-base);">
          <strong>💰 التكلفة المتوقعة:</strong> $${analysis.estimatedCost.toFixed(4)}
        </div>
      </div>
    </div>
  `;
  
  // Show improvements
  if (improvements.length > 0) {
    const section = document.getElementById('improvementsSection');
    const list = document.getElementById('improvementsList');
    
    section.style.display = 'block';
    list.innerHTML = '';
    
    improvements.forEach(imp => {
      const item = document.createElement('div');
      item.className = 'improvement-item';
      item.innerHTML = `
        <strong>${imp.title}</strong>
        <p>${imp.suggestion}</p>
      `;
      list.appendChild(item);
    });
  }
}

/**
 * Generate Enhanced Version Using Framework
 */
function generateEnhancedVersion(original, framework) {
  let enhanced = `# إطار ${framework.nameAr.toUpperCase()} #\n\n`;
  
  framework.components.forEach(comp => {
    enhanced += `## ${comp.nameAr} ##\n`;
    
    if (comp.key === 'context' || comp.key === 'situation') {
      enhanced += `[اشرح السياق والخلفية هنا]\n\n`;
    } else if (comp.key === 'objective' || comp.key === 'task') {
      enhanced += `${original}\n\n`;
    } else if (comp.key === 'role') {
      enhanced += `أنت خبير متخصص في هذا المجال\n\n`;
    } else if (comp.key === 'format' || comp.key === 'response') {
      enhanced += `قدّم النتيجة بتنسيق واضح ومنظّم\n\n`;
    } else {
      enhanced += `[املأ هذا القسم حسب احتياجاتك]\n\n`;
    }
  });
  
  return enhanced;
}





// Save to History
function saveToHistory() {
  if (!appState.currentText.trim()) {
    showToast('error', 'No text to save');
    return;
  }
  
  const historyItem = {
    id: Date.now(),
    date: new Date().toISOString(),
    text: appState.currentText,
    prompt: appState.currentPrompt,
    genre: appState.selectedGenre,
    wordCount: appState.currentText.split(/\s+/).length,
    creativity: calculateCreativityScore(appState.currentText)
  };
  
  writingHistory.unshift(historyItem);
  
  // Keep only last 50 items
  if (writingHistory.length > 50) {
    writingHistory = writingHistory.slice(0, 50);
  }
  
  showToast('success', '✅ Saved to history!');
}

// Auto Save
function autoSave() {
  if (appState.currentText.trim() && appState.currentText !== currentDraft) {
    currentDraft = appState.currentText;
    // In a real app, this would save to a backend
    console.log('Auto-saved draft');
  }
}

// Show History
function showHistory() {
  const historyList = document.getElementById('historyList');
  
  if (writingHistory.length === 0) {
    historyList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📋</div>
        <p>No history yet. Start enhancing prompts!</p>
      </div>
    `;
  } else {
    historyList.innerHTML = '';
    
    writingHistory.forEach(item => {
      const historyItem = document.createElement('div');
      historyItem.className = 'history-item';
      
      const date = new Date(item.date);
      const formattedDate = date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      historyItem.innerHTML = `
        <div class="history-header">
          <span class="history-date">${formattedDate}</span>
          <div class="history-actions">
            <button class="btn btn--secondary btn--sm" onclick="loadFromHistory(${item.id})">Load</button>
            <button class="btn btn--secondary btn--sm" onclick="deleteHistoryItem(${item.id})">Delete</button>
          </div>
        </div>
        <div class="history-preview">${item.text.substring(0, 150)}...</div>
        <div class="history-meta">
          <span>Genre: ${item.genre ? creativeWritingData.genres[item.genre]?.name : 'Unknown'}</span>
          <span>Words: ${item.wordCount}</span>
          <span>Creativity: ${item.creativity}/100</span>
        </div>
      `;
      
      historyList.appendChild(historyItem);
    });
  }
  
  showModal('historyModal');
}

// Load from History
function loadFromHistory(id) {
  const item = writingHistory.find(h => h.id === id);
  if (!item) return;
  
  document.getElementById('promptInput').value = item.text;
  appState.currentText = item.text;
  
  if (item.prompt) {
    appState.currentPrompt = item.prompt;
    appState.selectedGenre = item.genre;
    const genreData = creativeWritingData.genres[item.genre];
    if (genreData) {
      displayPrompt(item.prompt.text, item.genre, genreData.name);
    }
  }
  
  updateWritingStats();
  hideModal('historyModal');
  
  showToast('success', '📋 Loaded from history');
}

// Delete History Item
function deleteHistoryItem(id) {
  writingHistory = writingHistory.filter(h => h.id !== id);
  showHistory();
  showToast('info', 'History item deleted');
}

// Clear All History
function clearAllHistory() {
  if (writingHistory.length === 0) return;
  
  if (confirm('Are you sure you want to clear all writing history?')) {
    writingHistory = [];
    showHistory();
    showToast('info', 'History cleared');
  }
}

// Show Settings
function showSettings() {
  // Load current settings
  document.getElementById('apiKeyInput').value = apiConfig.apiKey;
  document.getElementById('temperature').value = apiConfig.temperature;
  document.getElementById('tempValue').textContent = apiConfig.temperature;
  document.getElementById('maxTokens').value = apiConfig.maxTokens;
  
  checkApiStatus();
  showModal('settingsModal');
}

// Check API Status
function checkApiStatus() {
  const statusEl = document.getElementById('apiKeyStatus');
  const enhanceBtn = document.getElementById('enhanceBtn');
  
  if (!statusEl) return;
  
  if (apiConfig.apiKey && apiConfig.isConnected) {
    statusEl.className = 'api-status success';
    statusEl.innerHTML = '✅ API Connected - AI Enhancement Available';
    if (enhanceBtn) enhanceBtn.style.display = 'inline-flex';
  } else if (apiConfig.apiKey && !apiConfig.isConnected) {
    statusEl.className = 'api-status warning';
    statusEl.innerHTML = '⚠️ API Key Saved - Click "Test" to verify connection';
    if (enhanceBtn) enhanceBtn.style.display = 'none';
  } else {
    statusEl.className = 'api-status error';
    statusEl.innerHTML = '❌ No API Key - Enter your Gemini API key to enable AI features';
    if (enhanceBtn) enhanceBtn.style.display = 'none';
  }
}

// Toggle API Key Visibility
function toggleApiKeyVisibility() {
  const input = document.getElementById('apiKeyInput');
  const btn = document.getElementById('toggleApiKeyVisibility');
  
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🙈';
  } else {
    input.type = 'password';
    btn.textContent = '👁️';
  }
}

// Test API Connection
async function testApiConnection() {
  const apiKey = document.getElementById('apiKeyInput').value.trim();
  
  if (!apiKey) {
    showToast('error', 'Please enter an API key');
    return;
  }
  
  const btn = document.getElementById('testApiKey');
  const originalText = btn.textContent;
  btn.textContent = 'Testing...';
  btn.disabled = true;
  
  try {
    const response = await fetch(`${STUDIO_CONFIG.apiEndpoint}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: 'Hello! Respond with "OK" if you can read this.' }]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 10
        }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      apiConfig.apiKey = apiKey;
      apiConfig.isConnected = true;
      checkApiStatus();
      showToast('success', '✅ API connection successful!');
    } else {
      throw new Error('Unexpected API response format');
    }
    
  } catch (error) {
    apiConfig.isConnected = false;
    checkApiStatus();
    showToast('error', `API Test Failed: ${error.message}`);
    console.error('API Test Error:', error);
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
}

// Save API Settings
function saveApiSettings() {
  const apiKey = document.getElementById('apiKeyInput').value.trim();
  const temperature = parseFloat(document.getElementById('temperature').value);
  const maxTokens = parseInt(document.getElementById('maxTokens').value);
  
  apiConfig.apiKey = apiKey;
  apiConfig.temperature = temperature;
  apiConfig.maxTokens = maxTokens;
  
  checkApiStatus();
  hideModal('settingsModal');
  showToast('success', '⚙️ Settings saved!');
}

// Reset API Settings
function resetApiSettings() {
  document.getElementById('apiKeyInput').value = '';
  document.getElementById('temperature').value = 0.7;
  document.getElementById('tempValue').textContent = '0.7';
  document.getElementById('maxTokens').value = 2048;
  
  apiConfig = {
    apiKey: '',
    model: 'gemini-2.0-flash-exp',
    temperature: 0.7,
    maxTokens: 2048,
    isConnected: false
  };
  
  checkApiStatus();
  showToast('info', 'Settings reset to defaults');
}

// Call Gemini API
async function callGeminiAPI(prompt, systemInstruction = '') {
  if (!apiConfig.apiKey) {
    throw new Error('API key not configured. Please set your API key in settings.');
  }
  
  if (!apiConfig.isConnected) {
    throw new Error('API not connected. Please test your API key in settings.');
  }
  
  try {
    const requestBody = {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: apiConfig.temperature,
        maxOutputTokens: apiConfig.maxTokens,
        topP: 0.95,
        topK: 40
      }
    };
    
    if (systemInstruction) {
      requestBody.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }
    
    const response = await fetch(`${STUDIO_CONFIG.apiEndpoint}?key=${apiConfig.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      } else if (response.status === 403) {
        throw new Error('API key invalid or expired. Please check your settings.');
      } else {
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }
    }
    
    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Unexpected API response format');
    }
    
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    throw error;
  }
}

// Enhance Text with AI
async function enhanceWithAI() {
  const text = appState.currentText.trim();
  
  if (!text) {
    showToast('error', 'Please write some text first');
    return;
  }
  
  if (text.split(/\s+/).length < 50) {
    showToast('warning', 'Please write at least 50 words before using AI enhancement');
    return;
  }
  
  const btn = document.getElementById('enhanceBtn');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<span class="loading-spinner"></span> Enhancing...';
  btn.disabled = true;
  
  try {
    const genre = appState.selectedGenre ? creativeWritingData.genres[appState.selectedGenre].name : 'General';
    const technique = creativeWritingData.techniques[appState.selectedTechnique].name;
    
    const systemInstruction = `You are an expert creative writing coach. Provide constructive feedback and specific suggestions to improve the writing.`;
    
    const prompt = `Analyze this creative writing piece and provide 3-5 specific, actionable suggestions for improvement:

Genre: ${genre}
Technique: ${technique}

Text:
${text}

Provide feedback in this format:
1. [Aspect] - [Specific suggestion]
2. [Aspect] - [Specific suggestion]
...`;
    
    const response = await callGeminiAPI(prompt, systemInstruction);
    
    // Display AI suggestions
    displayAISuggestions(response);
    showToast('success', '✨ AI enhancement complete!');
    
  } catch (error) {
    showToast('error', `AI Enhancement Failed: ${error.message}`);
    console.error('AI Enhancement Error:', error);
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

// Display AI Suggestions
function displayAISuggestions(suggestions) {
  const tipsSection = document.getElementById('writingTipsSection');
  const tipsList = document.getElementById('writingTipsList');
  
  tipsSection.style.display = 'block';
  tipsList.innerHTML = '';
  
  // Parse suggestions
  const lines = suggestions.split('\n').filter(line => line.trim());
  
  lines.forEach(line => {
    const match = line.match(/^\d+\.\s*(.+?)\s*-\s*(.+)$/);
    if (match) {
      const item = document.createElement('div');
      item.className = 'improvement-item';
      item.innerHTML = `
        <strong>🤖 ${match[1]}</strong>
        <p>${match[2]}</p>
      `;
      tipsList.appendChild(item);
    } else if (line.trim() && !line.match(/^(analyze|feedback|suggestions?)/i)) {
      const item = document.createElement('div');
      item.className = 'improvement-item';
      item.innerHTML = `<p>${line.trim()}</p>`;
      tipsList.appendChild(item);
    }
  });
}



// Perform Detailed Text Analysis
function performDetailedAnalysis(text) {
  const words = text.split(/\s+/);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim());
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim());
  
  // Word analysis
  const wordCount = words.length;
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  const lexicalDiversity = (uniqueWords.size / wordCount * 100).toFixed(1);
  
  // Sentence analysis
  const avgSentenceLength = (wordCount / sentences.length).toFixed(1);
  const sentenceLengths = sentences.map(s => s.split(/\s+/).length);
  const sentenceVariety = calculateVariety(sentenceLengths);
  
  // Readability (Flesch-Kincaid approximation)
  const syllables = estimateSyllables(text);
  const readabilityScore = calculateReadabilityScore(wordCount, sentences.length, syllables);
  
  // Vocabulary richness
  const longWords = words.filter(w => w.length > 6).length;
  const vocabularyRichness = (longWords / wordCount * 100).toFixed(1);
  
  // Dialogue detection
  const dialogueMatches = text.match(/["'“”].+?["'“”]/g) || [];
  const dialoguePercentage = (dialogueMatches.join(' ').length / text.length * 100).toFixed(1);
  
  // Emotional tone
  const emotionalTone = detectEmotionalTone(text);
  
  return {
    wordCount,
    sentenceCount: sentences.length,
    paragraphCount: paragraphs.length,
    lexicalDiversity: `${lexicalDiversity}%`,
    avgSentenceLength,
    sentenceVariety,
    readabilityScore,
    vocabularyRichness: `${vocabularyRichness}%`,
    dialoguePercentage: `${dialoguePercentage}%`,
    emotionalTone,
    readingTime: calculateReadingTime(text)
  };
}











// Show Toast Notification
function showToast(type, message) {
  // Remove any existing toasts
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
  
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${message}</span>
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}



/**
 * Clear Input and Reset
 */
function clearInput() {
  document.getElementById('promptInput').value = '';
  appState.currentText = '';
  appState.enhancedPrompt = '';
  appState.analysis = null;
  
  const output = document.getElementById('outputContent');
  output.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">⚡</div>
      <h3>ابدأ بإنشاء أمر جديد</h3>
      <p>اختر قالباً من الشريط الجانبي، أو أدخل أمرك في المحرر</p>
    </div>
  `;
  
  document.getElementById('improvementsSection').style.display = 'none';
  document.getElementById('frameworkBreakdown').style.display = 'none';
  
  updatePromptMetrics();
  showToast('success', '✅ تم مسح مساحة العمل');
}

/**
 * Copy Prompt to Clipboard
 */
function copyPrompt() {
  const text = appState.enhancedPrompt || appState.currentText;
  if (!text.trim()) {
    showToast('error', '⚠️ لا يوجد أمر لنسخه');
    return;
  }

  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copyBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '✓ تم النسخ!';
    setTimeout(() => btn.innerHTML = originalText, 2000);
    showToast('success', SYSTEM_MESSAGES.success.promptCopied);
  }).catch(() => {
    showToast('error', '❌ فشل النسخ إلى الحافظة');
  });
}



/**
 * Export Prompt
 */
function exportWriting(format) {
  const text = appState.enhancedPrompt || appState.currentText;
  if (!text.trim()) {
    showToast('error', '⚠️ لا يوجد أمر لتصديره');
    return;
  }

  let content = '';
  let filename = '';
  let mimeType = '';
  const timestamp = Date.now();

  if (format === 'text') {
    content = text;
    filename = `prompt-${timestamp}.txt`;
    mimeType = 'text/plain';
  } else if (format === 'json') {
    const data = {
      metadata: {
        title: 'أمر محسّن',
        date: new Date().toISOString(),
        version: STUDIO_CONFIG.version,
        framework: appState.selectedFramework,
        category: appState.selectedCategory
      },
      content: {
        original: appState.currentText,
        enhanced: appState.enhancedPrompt,
        template: appState.currentTemplate
      },
      analysis: appState.analysis
    };
    content = JSON.stringify(data, null, 2);
    filename = `prompt-${timestamp}.json`;
    mimeType = 'application/json';
  } else if (format === 'markdown') {
    content = `# أمر محسّن - Prompt Engineering\n\n`;
    content += `**التاريخ:** ${new Date().toLocaleDateString('ar')}\n`;
    content += `**الإطار:** ${promptEngineeringData.frameworks[appState.selectedFramework]?.nameAr || '--'}\n\n`;
    
    if (appState.analysis) {
      content += `## التحليل\n\n`;
      content += `- **النوع:** ${promptEngineeringData.promptTypes[appState.analysis.type]?.nameAr}\n`;
      content += `- **الفعالية:** ${appState.analysis.effectiveness}/100\n`;
      content += `- **الوضوح:** ${appState.analysis.clarity}/100\n`;
      content += `- **الاكتمال:** ${appState.analysis.completeness}/100\n\n`;
    }
    
    content += `## الأمر\n\n\`\`\`\n${text}\n\`\`\`\n`;
    
    filename = `prompt-${timestamp}.md`;
    mimeType = 'text/markdown';
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  hideModal('exportModal');
  showToast('success', `✅ تم التصدير بتنسيق ${format.toUpperCase()}!`);
}



// Toggle Sidebar
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  appState.sidebarCollapsed = !appState.sidebarCollapsed;
  
  if (appState.sidebarCollapsed) {
    sidebar.classList.add('collapsed');
    document.getElementById('toggleSidebar').querySelector('span').textContent = '▶';
  } else {
    sidebar.classList.remove('collapsed');
    document.getElementById('toggleSidebar').querySelector('span').textContent = '◀';
  }
}

// Modal Utilities
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.add('active');
}

function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.remove('active');
}

// Close modals on outside click
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('active');
  }
});

// Make functions globally accessible for onclick handlers
window.loadFromHistory = loadFromHistory;
window.deleteHistoryItem = deleteHistoryItem;

// Export/Import Functions
function exportAllData() {
  const exportData = {
    version: STUDIO_CONFIG.version,
    exportDate: new Date().toISOString(),
    history: writingHistory,
    savedPrompts: savedPrompts,
    currentDraft: currentDraft,
    settings: {
      technique: appState.selectedTechnique,
      genre: appState.selectedGenre
    }
  };
  
  const content = JSON.stringify(exportData, null, 2);
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `writing-studio-backup-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  showToast('success', '💾 Backup exported successfully!');
}

function importData() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';
  
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        
        if (data.history) writingHistory = data.history;
        if (data.savedPrompts) savedPrompts = data.savedPrompts;
        if (data.currentDraft) currentDraft = data.currentDraft;
        if (data.settings) {
          if (data.settings.technique) appState.selectedTechnique = data.settings.technique;
          if (data.settings.genre) appState.selectedGenre = data.settings.genre;
        }
        
        showToast('success', '✅ Backup imported successfully!');
      } catch (error) {
        showToast('error', '❌ Failed to import backup: Invalid file format');
      }
    };
    
    reader.readAsText(file);
  };
  
  input.click();
}

window.exportAllData = exportAllData;
window.importData = importData;

/**
 * Initialize Application on DOM Ready
 */
document.addEventListener('DOMContentLoaded', initializeApp);

// Log startup
console.log(`%c⚡ ${STUDIO_CONFIG.appName} v${STUDIO_CONFIG.version}`, 'color: #3B82F6; font-size: 16px; font-weight: bold;');
console.log('%cمدعوم بـ TypeScript و Gemini 2.5 Pro', 'color: #10B981; font-size: 12px;');