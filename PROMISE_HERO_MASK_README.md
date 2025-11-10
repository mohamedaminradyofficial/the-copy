# استخراج أكواد صفحة Promise - Hero Section مع الماسك

تم استخراج هذا الكود من ملف `Untitled-1.js` وملفات أخرى متعلقة بصفحة Promise.

## الملفات المستخرجة

### 1. `promise-hero-mask-extracted.js`
ملف JavaScript يحتوي على جميع الأكواد المستخرجة بشكل منظم:
- HTML Structure
- CSS Styles
- React/Next.js Component
- Vanilla JavaScript
- معلومات الفيديو

### 2. `promise-hero-mask.html`
ملف HTML كامل جاهز للاستخدام مباشرة. يحتوي على:
- Hero Section (comp-mb1elno6)
- Video Element (comp-mb1g9h8y)
- Mask Effect للكلمة
- GSAP ScrollTrigger animations

## المكونات الرئيسية

### 1. Hero Section (comp-mb1elno6)
القسم الرئيسي الأول في الصفحة الذي يحتوي على الفيديو والنص.

### 2. Video Element (comp-mb1g9h8y)
عنصر الفيديو الذي يعرض في الخلفية:
- Video ID: `99801c_8bb6150edc104da6bc26ff7cf43c0e06`
- Dimensions: 1920x1080
- Qualities: 360p, 480p, 720p, 1080p
- Format: MP4
- Auto-play: نعم
- Loop: نعم
- Muted: نعم

### 3. Mask Effect (تأثير الماسك)
تأثير الماسك يجعل الفيديو يظهر فقط من خلال النص. هناك طريقتان:

#### الطريقة الأولى: mix-blend-mode (Knockout Effect)
```css
.mask-content {
  background-color: white;
  mix-blend-mode: screen;
}

.mask-content h1 {
  color: black;
}
```
هذه الطريقة تجعل النص الأسود "يخرق" الطبقة البيضاء ويكشف الفيديو تحتها.

#### الطريقة الثانية: background-clip
```css
.hero-text-gradient {
  color: transparent;
  background-image: linear-gradient(...);
  -webkit-background-clip: text;
  background-clip: text;
}
```
هذه الطريقة تستخدم gradient كخلفية للنص.

## كيفية الاستخدام

### الاستخدام المباشر (HTML)
1. افتح ملف `promise-hero-mask.html` في المتصفح
2. تأكد من أن مسار الفيديو صحيح
3. يمكنك تغيير النص من "النسخة" إلى "PROMISE" أو أي نص آخر

### الاستخدام في React/Next.js
استخدم الكود من `ReactHeroComponent` في ملف `promise-hero-mask-extracted.js`:

```tsx
import PromiseHero from './components/PromiseHero';

export default function Home() {
  return (
    <div>
      <PromiseHero />
      {/* باقي المحتوى */}
    </div>
  );
}
```

### التخصيص

#### تغيير النص
في ملف HTML، غيّر النص في:
```html
<div class="mask-content">
  <h1>النسخة</h1> <!-- غيّر هنا -->
</div>
```

#### تغيير الفيديو
غيّر مسار الفيديو في:
```html
<video>
  <source src="مسار-الفيديو-الجديد.mp4" type="video/mp4">
</video>
```

#### تغيير الألوان
في CSS، غيّر الألوان:
```css
.mask-content {
  background-color: white; /* غيّر اللون هنا */
}

.mask-content h1 {
  color: black; /* غيّر لون النص هنا */
}
```

## التأثيرات المتحركة (GSAP)

الكود يتضمن التأثيرات التالية:

1. **Video Zoom**: تكبير الفيديو عند التمرير
2. **Text Fade Out**: اختفاء النص تدريجياً
3. **Pin Effect**: تثبيت القسم أثناء التمرير (اختياري)

## المتطلبات

- GSAP library (3.12.2 أو أحدث)
- ScrollTrigger plugin
- متصفح حديث يدعم:
  - CSS mix-blend-mode
  - CSS background-clip
  - HTML5 Video

## الملاحظات

1. **الفيديو**: تأكد من أن الفيديو متاح وأن المسار صحيح
2. **الأداء**: استخدم جودة مناسبة للفيديو حسب سرعة الاتصال
3. **التوافق**: تأكد من اختبار التأثير في متصفحات مختلفة
4. **الخطوط**: الخط المستخدم هو 'Noto Kufi Arabic' للعربية

## المصادر

- `Untitled-1.js` - HTML structure من موقع Promise
- `frontend/src/app/page.tsx` - React component
- `Untitled-2.html` - HTML/CSS/JS implementation

## الدعم

إذا واجهت أي مشاكل، تأكد من:
1. تحميل مكتبة GSAP بشكل صحيح
2. صحة مسار الفيديو
3. دعم المتصفح للخصائص المستخدمة




