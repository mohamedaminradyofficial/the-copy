"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Station2ConceptualAnalysis = void 0;
const base_station_1 = require("./base-station");
const gemini_service_1 = require("./gemini-service");
const text_utils_1 = require("../utils/text-utils");
class Station2ConceptualAnalysis extends base_station_1.BaseStation {
  constructor(geminiService) {
    super(geminiService, "Station 2: Conceptual Analysis", 2);
  }
  async execute(input, options) {
    const station2Input = input;
    const startTime = Date.now();
    const context = this.buildContextFromStation1(
      station2Input.station1Output,
      station2Input.text
    );
    try {
      const [
        storyStatements,
        threeDMap,
        hybridGenreOptions,
        themeAnalysis,
        targetAudience,
      ] = await Promise.all([
        this.generateStoryStatements(context),
        this.generate3DMap(context),
        this.generateHybridGenre(context),
        this.analyzeThemes(context),
        this.identifyTargetAudience(context),
      ]);
      const storyStatement = storyStatements[0] || "فشل توليد بيان القصة";
      const hybridGenre = hybridGenreOptions[0] || "دراما عامة";
      const [
        elevatorPitch,
        genreMatrix,
        dynamicTone,
        artisticReferences,
        marketAnalysis,
      ] = await Promise.all([
        this.generateElevatorPitch(storyStatement, context),
        this.generateGenreMatrix(hybridGenre, context),
        this.generateDynamicTone(hybridGenre, context),
        this.generateArtisticReferences(hybridGenre, context),
        this.analyzeMarketPotential(hybridGenre, context),
      ]);
      const processingTime = Date.now() - startTime;
      return {
        storyStatement,
        alternativeStatements: storyStatements.slice(1),
        threeDMap,
        elevatorPitch: elevatorPitch || "فشل توليد العرض المختصر",
        hybridGenre,
        genreAlternatives: hybridGenreOptions.slice(1),
        genreContributionMatrix: genreMatrix,
        dynamicTone,
        artisticReferences,
        themeAnalysis,
        targetAudience,
        marketAnalysis,
        metadata: {
          analysisTimestamp: new Date(),
          status: "Success",
          processingTime,
          confidenceScore: this.calculateConfidenceScore(
            storyStatements,
            threeDMap,
            themeAnalysis
          ),
        },
      };
    } catch (error) {
      console.error("[Station2] Processing error:", error);
      return this.getErrorFallback();
    }
  }
  buildContextFromStation1(s1Output, fullText) {
    const relationshipSummary = "علاقات الشخصيات الرئيسية";
    const conflictSummary = "الصراعات الأساسية في النص";
    return {
      majorCharacters: s1Output.majorCharacters,
      relationshipSummary: relationshipSummary || "لم يتم تحديد علاقات رئيسية.",
      narrativeTone: s1Output.narrativeStyleAnalysis.overallTone,
      fullText,
      logline: s1Output.logline,
      conflictSummary: conflictSummary || "لم يتم تحديد صراعات واضحة.",
      dialogueQuality: s1Output.dialogueAnalysis.efficiency,
    };
  }
  async generateStoryStatements(context) {
    const prompt = `
بصفتك خبير تحليل درامي، قم بصياغة **ثلاثة (3)** بيانات قصة (Story Statements) متميزة ومحكمة البناء.

**السياق المتاح:**
- الشخصيات الرئيسية: ${context.majorCharacters.map((c) => c.name).join("، ")}
- العلاقات الأساسية: ${context.relationshipSummary}
- الصراعات: ${context.conflictSummary}
- النبرة السردية: ${context.narrativeTone}
- ملخص القصة: ${context.logline}

**متطلبات كل بيان (4 جمل):**
1. **الحدث المحوري**: الحدث الجامع أو نقطة الانطلاق الدرامية
2. **الصراعات المتشابكة**: الدوافع المتقاطعة والتوترات المركزية
3. **العالم القصصي**: السياق الفريد والبيئة الدرامية المميزة
4. **السؤال الفلسفي**: الثيمة الجامعة أو القضية الفكرية المطروحة

**التنسيق المطلوب:**
قدم الإجابة كنص عادي، كل بيان في فقرة منفصلة بدون ترقيم أو عناوين.
كل فقرة يجب أن تحتوي على 4 جمل متماسكة ومترابطة.

**ملاحظة مهمة:** 
- استخدم لغة سينمائية قوية ومباشرة
- تجنب التعميمات والعبارات المبهمة
- ركز على التفاصيل الدرامية الملموسة
- اجعل كل بيان يقدم زاوية مختلفة للقصة
`;
    const result = await this.geminiService.generate({
      prompt,
      context: (0, text_utils_1.safeSub)(context.fullText, 0, 30000),
      model: gemini_service_1.GeminiModel.FLASH,
      temperature: 0.85,
    });
    if (!result.content) {
      return ["فشل توليد بيان القصة"];
    }
    const statements = (0, text_utils_1.toText)(result.content)
      .split("\n\n")
      .filter((s) => s.trim().length > 50)
      .slice(0, 3);
    return statements.length > 0 ? statements : ["فشل توليد بيانات قصة متعددة"];
  }
  async generate3DMap(context) {
    const prompt = `
قم بإنشاء **خريطة ثلاثية الأبعاد (3D Map)** شاملة للبنية الدرامية بناءً على السياق التالي:

**السياق:**
${JSON.stringify(
  {
    characters: context.majorCharacters.map((c) => c.name),
    relationships: context.relationshipSummary,
    conflicts: context.conflictSummary,
    tone: context.narrativeTone,
  },
  null,
  2
)}

**المحاور الثلاثة المطلوبة:**

1. **المحور الأفقي (الأحداث):**
   قدم قائمة بالأحداث الرئيسية مرتبة زمنياً، مع:
   - اسم الحدث (موجز ووصفي)
   - إشارة للمشهد المقابل (إن أمكن)
   - الوزن السردي (1-10)

2. **المحور العمودي (المعنى):**
   لكل حدث رئيسي، حدد:
   - الطبقة الرمزية أو الثيمة المرتبطة
   - العمق الفلسفي أو النفسي
   - الصلة بالثيمات الأساسية

3. **المحور الزمني (التطور):**
   حلل:
   - تأثير الماضي على الحاضر
   - الخيارات الحالية وعواقبها
   - توقعات المستقبل
   - الصلة بقوس تطور البطل
   - السببية (كيف يؤدي حدث لآخر)

**التنسيق:**
قدم إجابة JSON صارمة بدون أي نص إضافي:
{
  "horizontalEventsAxis": [
    {
      "event": "...",
      "sceneRef": "...",
      "timestamp": "...",
      "narrativeWeight": 8
    }
  ],
  "verticalMeaningAxis": [
    {
      "eventRef": "...",
      "symbolicLayer": "...",
      "thematicConnection": "...",
      "depth": 7
    }
  ],
  "temporalDevelopmentAxis": {
    "pastInfluence": "...",
    "presentChoices": "...",
    "futureExpectations": "...",
    "heroArcConnection": "...",
    "causality": "..."
  }
}
`;
    const result = await this.geminiService.generate({
      prompt,
      context: (0, text_utils_1.safeSub)(context.fullText, 0, 25000),
      model: gemini_service_1.GeminiModel.FLASH,
      temperature: 0.7,
    });
    try {
      const parsed = JSON.parse((0, text_utils_1.toText)(result.content));
      return this.validate3DMap(parsed);
    } catch (error) {
      console.error("[Station2] Failed to parse 3D Map:", error);
      return this.getDefault3DMap();
    }
  }
  validate3DMap(parsed) {
    return {
      horizontalEventsAxis: Array.isArray(parsed.horizontalEventsAxis)
        ? parsed.horizontalEventsAxis.map((e) => ({
            event: e.event || "",
            sceneRef: e.sceneRef || "",
            timestamp: e.timestamp || "",
            narrativeWeight: e.narrativeWeight || 5,
          }))
        : [],
      verticalMeaningAxis: Array.isArray(parsed.verticalMeaningAxis)
        ? parsed.verticalMeaningAxis.map((m) => ({
            eventRef: m.eventRef || "",
            symbolicLayer: m.symbolicLayer || "",
            thematicConnection: m.thematicConnection || "",
            depth: m.depth || 5,
          }))
        : [],
      temporalDevelopmentAxis: {
        pastInfluence: parsed.temporalDevelopmentAxis?.pastInfluence || "",
        presentChoices: parsed.temporalDevelopmentAxis?.presentChoices || "",
        futureExpectations:
          parsed.temporalDevelopmentAxis?.futureExpectations || "",
        heroArcConnection:
          parsed.temporalDevelopmentAxis?.heroArcConnection || "",
        causality: parsed.temporalDevelopmentAxis?.causality || "",
      },
    };
  }
  async generateElevatorPitch(storyStatement, context) {
    const prompt = `
بناءً على:
- **بيان القصة**: "${storyStatement}"
- **الشخصيات**: ${context.majorCharacters.map((c) => c.name).join("، ")}
- **النبرة**: ${context.narrativeTone}

صغ **Elevator Pitch** احترافي وجذاب:
- لا يتجاوز 40 كلمة
- يركز على الصراع المحوري
- يثير الفضول والتشويق
- يستهدف المنتجين/الممولين

قدم النص فقط بدون مقدمات أو تنسيقات.
`;
    const result = await this.geminiService.generate({
      prompt,
      model: gemini_service_1.GeminiModel.FLASH,
      temperature: 0.9,
    });
    return (
      (0, text_utils_1.toText)(result.content) || "فشل توليد العرض المختصر"
    );
  }
  async generateHybridGenre(context) {
    const prompt = `
بناءً على التحليل الشامل للنص:

**السياق:**
- الشخصيات: ${context.majorCharacters.map((c) => c.name).join("، ")}
- النبرة: ${context.narrativeTone}
- الصراعات: ${context.conflictSummary}
- جودة الحوار: ${context.dialogueQuality}/10

**المطلوب:**
اقترح **5 بدائل** لتركيبة نوع هجين (Hybrid Genre) دقيقة ومبتكرة.

**معايير الاقتراح:**
- دمج 2-3 أنواع رئيسية بطريقة منطقية
- تجنب الأنواع العامة جداً (مثل: "دراما")
- استخدم مصطلحات صناعة السينما المعاصرة
- ركز على الأنواع القابلة للتسويق

**أمثلة للتوضيح:**
- "Psychological Thriller مع عناصر Family Drama"
- "Dark Comedy بطابع Film Noir"
- "Social Realism مع لمسات Magical Realism"

**التنسيق:**
قدم كل بديل في سطر واحد، بدون ترقيم أو شرح إضافي.
`;
    const result = await this.geminiService.generate({
      prompt,
      context: (0, text_utils_1.safeSub)(context.fullText, 0, 20000),
      model: gemini_service_1.GeminiModel.FLASH,
      temperature: 0.85,
    });
    if (!result.content) {
      return ["دراما نفسية"];
    }
    const genres = (0, text_utils_1.toText)(result.content)
      .split("\n")
      .filter((line) => line.trim().length > 5)
      .map((line) => line.replace(/^[-•*]\s*/, "").trim())
      .slice(0, 5);
    return genres.length > 0 ? genres : ["دراما معاصرة"];
  }
  async generateGenreMatrix(hybridGenre, context) {
    const prompt = `
للنوع الهجين المحدد: **"${hybridGenre}"**

قم بإنشاء **مصفوفة مساهمة النوع** تفصيلية توضح كيف يُثري كل نوع فرعي العناصر الخمسة التالية:

**العناصر المطلوب تحليلها:**
1. **الصراعات** (Conflict Structure)
2. **الإيقاع** (Pacing)
3. **التكوين البصري** (Visual Composition)
4. **الصوت والموسيقى** (Sound & Music)
5. **الشخصيات** (Characters)

**مثال للتوضيح:**
إذا كان النوع "Psychological Thriller + Family Drama"، فيجب تحليل:
- كيف يساهم "Psychological Thriller" في بناء الصراعات؟
- كيف يؤثر "Family Drama" على إيقاع السرد؟
- إلخ...

**التنسيق المطلوب:**
قدم JSON بدون أي نص إضافي:
{
  "النوع الأول": {
    "conflictContribution": "شرح تفصيلي",
    "pacingContribution": "شرح تفصيلي",
    "visualCompositionContribution": "شرح تفصيلي",
    "soundMusicContribution": "شرح تفصيلي",
    "charactersContribution": "شرح تفصيلي",
    "weight": 0.6
  },
  "النوع الثاني": {
    ...
    "weight": 0.4
  }
}

**ملاحظة:** weight يمثل الوزن النسبي للنوع في التركيبة الهجينة (مجموع الأوزان = 1).
`;
    const result = await this.geminiService.generate({
      prompt,
      context: (0, text_utils_1.safeSub)(context.fullText, 0, 15000),
      model: gemini_service_1.GeminiModel.FLASH,
      temperature: 0.75,
    });
    try {
      const parsed = JSON.parse((0, text_utils_1.toText)(result.content));
      return this.validateGenreMatrix(parsed);
    } catch (error) {
      console.error("[Station2] Failed to parse genre matrix:", error);
      return this.getDefaultGenreMatrix(hybridGenre);
    }
  }
  validateGenreMatrix(parsed) {
    const result = {};
    for (const [genre, contributions] of Object.entries(parsed)) {
      if (typeof contributions === "object" && contributions !== null) {
        result[genre] = {
          conflictContribution: contributions.conflictContribution || "",
          pacingContribution: contributions.pacingContribution || "",
          visualCompositionContribution:
            contributions.visualCompositionContribution || "",
          soundMusicContribution: contributions.soundMusicContribution || "",
          charactersContribution: contributions.charactersContribution || "",
          weight: contributions.weight || 0.5,
        };
      }
    }
    return result;
  }
  async generateDynamicTone(hybridGenre, context) {
    const prompt = `
للنوع الهجين: **"${hybridGenre}"**
والنبرة السردية: **"${context.narrativeTone}"**

حلل **النبرة الديناميكية (Dynamic Tone)** عبر مراحل السيناريو الثلاث.

**المراحل المطلوبة:**
1. **الفصل الأول (Setup)**
2. **الفصل الثاني (Confrontation)**
3. **الفصل الثالث (Resolution)**

**لكل مرحلة، قدم:**
- **الجو البصري** (Visual Atmosphere): الإضاءة، الألوان، التكوين
- **الإيقاع الكتابي** (Written Pacing): سرعة السرد، طول المشاهد
- **بنية الحوار** (Dialogue Structure): كثافة الحوار، نمطه
- **التوجيهات الصوتية** (Sound Indications): الموسيقى، المؤثرات
- **الكثافة العاطفية** (Emotional Intensity): مقياس من 1-10

**التنسيق:**
JSON صارم بدون أي نص إضافي:
{
  "setup": {
    "visualAtmosphereDescribed": "...",
    "writtenPacing": "...",
    "dialogueStructure": "...",
    "soundIndicationsDescribed": "...",
    "emotionalIntensity": 5
  },
  "confrontation": {...},
  "resolution": {...}
}
`;
    const result = await this.geminiService.generate({
      prompt,
      context: (0, text_utils_1.safeSub)(context.fullText, 0, 15000),
      model: gemini_service_1.GeminiModel.FLASH,
      temperature: 0.7,
    });
    try {
      const parsed = JSON.parse((0, text_utils_1.toText)(result.content));
      return this.validateDynamicTone(parsed);
    } catch (error) {
      console.error("[Station2] Failed to parse dynamic tone:", error);
      return this.getDefaultDynamicTone(context);
    }
  }
  validateDynamicTone(parsed) {
    const result = {};
    const stages = ["setup", "confrontation", "resolution"];
    for (const stage of stages) {
      if (parsed[stage] && typeof parsed[stage] === "object") {
        result[stage] = {
          visualAtmosphereDescribed:
            parsed[stage].visualAtmosphereDescribed || "",
          writtenPacing: parsed[stage].writtenPacing || "",
          dialogueStructure: parsed[stage].dialogueStructure || "",
          soundIndicationsDescribed:
            parsed[stage].soundIndicationsDescribed || "",
          emotionalIntensity: parsed[stage].emotionalIntensity || 5,
        };
      }
    }
    return result;
  }
  async generateArtisticReferences(hybridGenre, context) {
    const prompt = `
للنوع الهجين: **"${hybridGenre}"**
والسياق الدرامي المتاح

اقترح **مراجع فنية شاملة** تشمل:

1. **مراجع بصرية (3-5 أعمال):**
   - لوحات فنية أو أعمال تصوير فوتوغرافي
   - سبب الاختيار وكيفية التطبيق على المشاهد

2. **المزاج الموسيقي:**
   - النمط الموسيقي العام
   - أمثلة لمؤلفين أو أعمال مرجعية

3. **تأثيرات سينمائية (3-5 أفلام):**
   - أفلام مرجعية مع أسماء المخرجين
   - الجانب المستوحى (إضاءة، إيقاع، بناء مشهد)

4. **موازيات أدبية (2-3 أعمال):**
   - أعمال أدبية ذات صلة
   - أوجه التشابه الثيمية أو الأسلوبية

**التنسيق:**
JSON صارم:
{
  "visualReferences": [
    {
      "work": "...",
      "artist": "...",
      "reason": "...",
      "sceneApplication": "..."
    }
  ],
  "musicalMood": "...",
  "cinematicInfluences": [
    {
      "film": "...",
      "director": "...",
      "aspect": "..."
    }
  ],
  "literaryParallels": [
    {
      "work": "...",
      "author": "...",
      "connection": "..."
    }
  ]
}
`;
    const result = await this.geminiService.generate({
      prompt,
      context: (0, text_utils_1.safeSub)(context.fullText, 0, 12000),
      model: gemini_service_1.GeminiModel.FLASH,
      temperature: 0.8,
    });
    try {
      const parsed = JSON.parse((0, text_utils_1.toText)(result.content));
      return this.validateArtisticReferences(parsed);
    } catch (error) {
      console.error("[Station2] Failed to parse artistic references:", error);
      return this.getDefaultArtisticReferences(hybridGenre);
    }
  }
  validateArtisticReferences(parsed) {
    return {
      visualReferences: Array.isArray(parsed.visualReferences)
        ? parsed.visualReferences.map((ref) => ({
            work: ref.work || "",
            artist: ref.artist || undefined,
            reason: ref.reason || "",
            sceneApplication: ref.sceneApplication || "",
          }))
        : [],
      musicalMood: parsed.musicalMood || "",
      cinematicInfluences: Array.isArray(parsed.cinematicInfluences)
        ? parsed.cinematicInfluences.map((inf) => ({
            film: inf.film || "",
            director: inf.director || undefined,
            aspect: inf.aspect || "",
          }))
        : [],
      literaryParallels: Array.isArray(parsed.literaryParallels)
        ? parsed.literaryParallels.map((par) => ({
            work: par.work || "",
            author: par.author || undefined,
            connection: par.connection || "",
          }))
        : [],
    };
  }
  async analyzeThemes(context) {
    const prompt = `
بناءً على السياق الدرامي الكامل:

**السياق:**
${JSON.stringify(
  {
    characters: context.majorCharacters.map((c) => ({
      name: c.name,
      role: c.role,
    })),
    tone: context.narrativeTone,
    conflicts: context.conflictSummary,
  },
  null,
  2
)}

قم بتحليل **الثيمات (Themes)** بشكل شامل:

**المطلوب:**
1. **الثيمات الأساسية (3-5):**
   - اسم الثيمة
   - أدلة نصية تدعمها (3-5 أمثلة)
   - قوة الثيمة (1-10)
   - كيفية تطورها عبر السيناريو

2. **الثيمات الثانوية (2-4):**
   - اسم الثيمة
   - عدد مرات ظهورها

3. **اتساق الثيمات:**
   - مقياس من 1-10 لمدى اتساق الثيمات

**التنسيق:**
JSON صارم:
{
  "primaryThemes": [
    {
      "theme": "...",
      "evidence": ["...", "...", "..."],
      "strength": 8,
      "development": "..."
    }
  ],
  "secondaryThemes": [
    {
      "theme": "...",
      "occurrences": 5
    }
  ],
  "thematicConsistency": 8
}
`;
    const result = await this.geminiService.generate({
      prompt,
      context: (0, text_utils_1.safeSub)(context.fullText, 0, 20000),
      model: gemini_service_1.GeminiModel.FLASH,
      temperature: 0.7,
    });
    try {
      const parsed = JSON.parse((0, text_utils_1.toText)(result.content));
      return this.validateThemeAnalysis(parsed);
    } catch (error) {
      console.error("[Station2] Failed to parse theme analysis:", error);
      return this.getDefaultThemeAnalysis();
    }
  }
  validateThemeAnalysis(parsed) {
    return {
      primaryThemes: Array.isArray(parsed.primaryThemes)
        ? parsed.primaryThemes.map((t) => ({
            theme: t.theme || "",
            evidence: Array.isArray(t.evidence) ? t.evidence : [],
            strength: t.strength || 5,
            development: t.development || "",
          }))
        : [],
      secondaryThemes: Array.isArray(parsed.secondaryThemes)
        ? parsed.secondaryThemes.map((t) => ({
            theme: t.theme || "",
            occurrences: t.occurrences || 1,
          }))
        : [],
      thematicConsistency: parsed.thematicConsistency || 5,
    };
  }
  async identifyTargetAudience(context) {
    const prompt = `
بناءً على السياق الدرامي:
- الشخصيات: ${context.majorCharacters.map((c) => c.name).join("، ")}
- النبرة: ${context.narrativeTone}
- الصراعات: ${context.conflictSummary}

حدد الجمهور المستهدف بدقة:

**المطلوب:**
1. **الجمهور الأساسي**: وصف موجز (مثال: "شباب بالغون 18-35 سنة")
2. **الخصائص الديموغرافية**: 3-5 خصائص (عمر، جنس، موقع، تعليم، دخل)
3. **الخصائص النفسية**: 3-5 خصائص (اهتمامات، قيم، نمط حياة)

**التنسيق:**
JSON صارم:
{
  "primaryAudience": "...",
  "demographics": ["...", "...", "..."],
  "psychographics": ["...", "...", "..."]
}
`;
    const result = await this.geminiService.generate({
      prompt,
      model: gemini_service_1.GeminiModel.FLASH,
      temperature: 0.7,
    });
    try {
      const parsed = JSON.parse((0, text_utils_1.toText)(result.content));
      return {
        primaryAudience: parsed.primaryAudience || "جمهور عام",
        demographics: Array.isArray(parsed.demographics)
          ? parsed.demographics
          : [],
        psychographics: Array.isArray(parsed.psychographics)
          ? parsed.psychographics
          : [],
      };
    } catch (error) {
      console.error("[Station2] Failed to parse target audience:", error);
      return {
        primaryAudience: "جمهور عام",
        demographics: ["بالغون", "كلا الجنسين"],
        psychographics: ["مهتمو الدراما"],
      };
    }
  }
  async analyzeMarketPotential(hybridGenre, context) {
    const prompt = `
للنوع الهجين: **"${hybridGenre}"**
والسياق الدرامي المتاح

قم بتقييم إمكانات السوق من خلال ثلاثة مؤشرات:

**المؤشرات المطلوبة (مقياس 1-10):**
1. **إمكانية الإنتاج** (Producibility):
   - سهولة التنفيذ التقني
   - متطلبات الموارد
   - التعقيد الإنتاجي

2. **الإمكانية التجارية** (Commercial Potential):
   - جاذبية السوق
   - حجم الجمهور المحتمل
   - فرص التوزيع

3. **الأصالة** (Uniqueness):
   - التميز عن الأعمال المشابهة
   - الابتكار في المفهوم
   - الجاذبية الفنية

**التنسيق:**
JSON صارم:
{
  "producibility": 7,
  "commercialPotential": 8,
  "uniqueness": 6
}
`;
    const result = await this.geminiService.generate({
      prompt,
      model: gemini_service_1.GeminiModel.FLASH,
      temperature: 0.6,
    });
    try {
      const parsed = JSON.parse((0, text_utils_1.toText)(result.content));
      return {
        producibility: parsed.producibility || 5,
        commercialPotential: parsed.commercialPotential || 5,
        uniqueness: parsed.uniqueness || 5,
      };
    } catch (error) {
      console.error("[Station2] Failed to parse market analysis:", error);
      return {
        producibility: 5,
        commercialPotential: 5,
        uniqueness: 5,
      };
    }
  }
  calculateConfidenceScore(storyStatements, threeDMap, themeAnalysis) {
    let score = 0.5;
    if (storyStatements.length >= 3) {
      score += 0.15;
    } else if (storyStatements.length >= 2) {
      score += 0.1;
    } else if (storyStatements.length >= 1) {
      score += 0.05;
    }
    const hasValidEvents = threeDMap.horizontalEventsAxis.length > 0;
    const hasValidMeaning = threeDMap.verticalMeaningAxis.length > 0;
    const hasValidTemporal =
      threeDMap.temporalDevelopmentAxis.pastInfluence.length > 0;
    if (hasValidEvents && hasValidMeaning && hasValidTemporal) {
      score += 0.2;
    } else if (hasValidEvents || hasValidMeaning || hasValidTemporal) {
      score += 0.1;
    }
    const hasPrimaryThemes = themeAnalysis.primaryThemes.length > 0;
    const hasSecondaryThemes = themeAnalysis.secondaryThemes.length > 0;
    const hasConsistencyScore = themeAnalysis.thematicConsistency > 0;
    if (hasPrimaryThemes && hasSecondaryThemes && hasConsistencyScore) {
      score += 0.15;
    } else if (hasPrimaryThemes || hasSecondaryThemes) {
      score += 0.1;
    }
    return Math.min(score, 1.0);
  }
  getErrorFallback() {
    return {
      storyStatement: "فشل في تحليل المفهوم",
      alternativeStatements: [],
      threeDMap: this.getDefault3DMap(),
      elevatorPitch: "فشل في توليد العرض المختصر",
      hybridGenre: "دراما عامة",
      genreAlternatives: [],
      genreContributionMatrix: this.getDefaultGenreMatrix("دراما عامة"),
      dynamicTone: this.getDefaultDynamicTone({
        majorCharacters: [],
        relationshipSummary: "",
        narrativeTone: "",
        fullText: "",
        logline: "",
        conflictSummary: "",
        dialogueQuality: 5,
      }),
      artisticReferences: this.getDefaultArtisticReferences("دراما عامة"),
      themeAnalysis: this.getDefaultThemeAnalysis(),
      targetAudience: {
        primaryAudience: "جمهور عام",
        demographics: ["بالغون"],
        psychographics: ["مهتمو الدراما"],
      },
      marketAnalysis: {
        producibility: 5,
        commercialPotential: 5,
        uniqueness: 5,
      },
      metadata: {
        analysisTimestamp: new Date(),
        status: "Failed",
        processingTime: 0,
        confidenceScore: 0.1,
      },
    };
  }
  getDefault3DMap() {
    return {
      horizontalEventsAxis: [
        {
          event: "حدث افتراضي",
          sceneRef: "مشهد افتراضي",
          timestamp: "00:00:00",
          narrativeWeight: 5,
        },
      ],
      verticalMeaningAxis: [
        {
          eventRef: "حدث افتراضي",
          symbolicLayer: "طبقة رمزية افتراضية",
          thematicConnection: "صلة ثيماتية افتراضية",
          depth: 5,
        },
      ],
      temporalDevelopmentAxis: {
        pastInfluence: "تأثير الماضي الافتراضي",
        presentChoices: "الخيارات الحالية الافتراضية",
        futureExpectations: "توقعات المستقبل الافتراضية",
        heroArcConnection: "صلة قوس البطل الافتراضية",
        causality: "سببية افتراضية",
      },
    };
  }
  getDefaultGenreMatrix(hybridGenre) {
    return {
      [hybridGenre]: {
        conflictContribution: "مساهمة افتراضية في الصراع",
        pacingContribution: "مساهمة افتراضية في الإيقاع",
        visualCompositionContribution: "مساهمة افتراضية في التكوين البصري",
        soundMusicContribution: "مساهمة افتراضية في الصوت والموسيقى",
        charactersContribution: "مساهمة افتراضية في الشخصيات",
        weight: 1.0,
      },
    };
  }
  getDefaultDynamicTone(context) {
    return {
      setup: {
        visualAtmosphereDescribed: "جو بصري افتراضي للبداية",
        writtenPacing: "إيقاع كتابي افتراضي للبداية",
        dialogueStructure: "بنية حوار افتراضية للبداية",
        soundIndicationsDescribed: "توجيهات صوتية افتراضية للبداية",
        emotionalIntensity: 5,
      },
      confrontation: {
        visualAtmosphereDescribed: "جو بصري افتراضي للمواجهة",
        writtenPacing: "إيقاع كتابي افتراضي للمواجهة",
        dialogueStructure: "بنية حوار افتراضية للمواجهة",
        soundIndicationsDescribed: "توجيهات صوتية افتراضية للمواجهة",
        emotionalIntensity: 7,
      },
      resolution: {
        visualAtmosphereDescribed: "جو بصري افتراضي للحل",
        writtenPacing: "إيقاع كتابي افتراضي للحل",
        dialogueStructure: "بنية حوار افتراضية للحل",
        soundIndicationsDescribed: "توجيهات صوتية افتراضية للحل",
        emotionalIntensity: 4,
      },
    };
  }
  getDefaultArtisticReferences(hybridGenre) {
    return {
      visualReferences: [
        {
          work: "عمل فني افتراضي",
          artist: "فنان افتراضي",
          reason: "سبب افتراضي",
          sceneApplication: "تطبيق افتراضي",
        },
      ],
      musicalMood: "مزاج موسيقي افتراضي",
      cinematicInfluences: [
        {
          film: "فيلم افتراضي",
          director: "مخرج افتراضي",
          aspect: "جانب مستوحى افتراضي",
        },
      ],
      literaryParallels: [
        {
          work: "عمل أدبي افتراضي",
          author: "كاتب افتراضي",
          connection: "صلة افتراضية",
        },
      ],
    };
  }
  getDefaultThemeAnalysis() {
    return {
      primaryThemes: [
        {
          theme: "ثيمة افتراضية",
          evidence: ["دليل افتراضي 1", "دليل افتراضي 2"],
          strength: 5,
          development: "تطور افتراضي",
        },
      ],
      secondaryThemes: [
        {
          theme: "ثيمة ثانوية افتراضية",
          occurrences: 3,
        },
      ],
      thematicConsistency: 5,
    };
  }
  getAgentsUsed() {
    return [
      "Story Statement Generator",
      "3D Map Builder",
      "Genre Analyzer",
      "Theme Analyzer",
      "Target Audience Identifier",
      "Market Analyzer",
    ];
  }
}
exports.Station2ConceptualAnalysis = Station2ConceptualAnalysis;
//# sourceMappingURL=station2-conceptual-analysis.js.map
