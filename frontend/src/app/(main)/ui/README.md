// استخدام Border Radius
const borderRadius = designTokens.borderRadius.md;
\`\`\`

## 🎨 استخدام الألوان في Tailwind

\`\`\`tsx
// ألوان نظام Figma الجديدة

// <div className="bg-bg text-text">
// <div className="bg-panel border border-surface">
// <span className="text-muted-text">نص مكتوم</span>
// <button className="bg-accent-color text-bg">زر</button>
// </div>
// </div>

// ألوان الحالات

// <div className="bg-state-draft">مسودة</div>
// <div className="bg-state-final">نهائي</div>
// <div className="bg-state-alt">بديل</div>
// <div className="bg-state-flagged">مُعلّم</div>
\`\`\`

## 🌓 الثيمات

يدعم النظام ثيمين:

- **Light Theme** (افتراضي) - للاستخدام العام
- **Dark Theme** (من Figma) - للواجهات غير الخطية والتحليل

يمكنك تبديل الثيم بإضافة class `dark` على العنصر الجذري:

\`\`\`tsx
// <html className="dark">
// {/_ محتوى التطبيق _/}
// </html>
\`\`\`

## 📱 Responsive Design

النظام يدعم 4 مقاسات رئيسية:

- **Mobile**: 390×844px (iPhone standard)
- **Tablet**: 1024×1366px (iPad Pro portrait)
- **Desktop**: 1280×800px (Secondary)
- **Desktop Large**: 1440×900px (Primary)

## ↔️ دعم RTL

جميع المكونات مصممة لدعم RTL بشكل كامل. تأكد من وجود `dir="rtl"` على العنصر الجذري:

\`\`\`tsx
// <html lang="ar" dir="rtl">
// {/_ محتوى التطبيق _/}
// </html>
\`\`\`

## 🔗 المصدر
