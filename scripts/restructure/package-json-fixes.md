# Package.json Fixes - التعديلات المطلوبة

## 🎯 المشاكل المكتشفة والحلول

### 1. Root package.json

#### المشكلة: اعتمادات مكررة

```json
// ❌ الحالي - حذف هذه
{
  "dependencies": {
    "tailwindcss": "^4.1.16",
    "typescript": "^5.9.3"
  }
}
```

#### الحل المقترح:

```json
// ✅ المقترح
{
  "name": "the-copy-monorepo",
  "private": true,
  "packageManager": "pnpm@10.20.0",
  "scripts": {
    "start:dev": "powershell -NoProfile -ExecutionPolicy Bypass -File ./start-dev.ps1",
    "kill:dev": "powershell -NoProfile -ExecutionPolicy Bypass -File ./kill-dev.ps1",
    "lint": "pnpm --filter frontend lint",
    "lint:fix": "pnpm --filter frontend lint:fix",
    "test": "pnpm --filter frontend test",
    "test:all": "pnpm run test && pnpm --filter backend test",
    "typecheck": "pnpm --filter frontend typecheck && pnpm --filter backend typecheck",
    "build": "pnpm --filter backend build && pnpm --filter frontend build",
    "dev": "pnpm run start:dev",
    "ci": "pnpm run check:exports && pnpm run lint && pnpm run typecheck && pnpm run test && pnpm run build"
  },
  "dependencies": {
    "@mistralai/mistralai": "^1.10.0"
    // إزالة tailwindcss و typescript (موجودة في frontend)
  },
  "devDependencies": {
    "sharp": "^0.34.5",
    "vitest": "^4.0.6"
  },
  "pnpm": {
    "overrides": {
      "@types/d3-array": "^3.2.1",
      "@types/d3-scale": "^4.0.8",
      "@types/d3-shape": "^3.1.6",
      "@types/babel__traverse": "^7.20.5",
      "@types/eslint": "^8.56.10",
      "esbuild": "^0.25.0"
    }
  }
}
```

**التغييرات:**
- ✅ حذف `tailwindcss` (موجود في frontend)
- ✅ حذف `typescript` (موجود في frontend)
- ✅ إضافة `test:all` لتشغيل اختبارات frontend و backend
- ✅ تحسين `typecheck` لفحص الاثنين معاً

---

### 2. Frontend package.json

#### المشكلة 1: Test script يشغل ملف واحد فقط

```json
// ❌ الحالي
{
  "scripts": {
    "test": "vitest run \"src/app/(main)/directors-studio/helpers/__tests__/projectSummary.test.ts\""
  }
}
```

```json
// ✅ المقترح
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest --watch",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:single": "vitest run \"src/app/(main)/directors-studio/helpers/__tests__/projectSummary.test.ts\""
  }
}
```

#### المشكلة 2: إصدارات غير متطابقة

```json
// ❌ الحالي
{
  "dependencies": {
    "typescript": "^5"  // نطاق واسع
  },
  "overrides": {
    "esbuild": "^0.25.0"
  }
}
```

```json
// ✅ المقترح
{
  "dependencies": {
    "typescript": "^5.9.3"  // إصدار محدد
  },
  "overrides": {
    "next@<=15.4.7": "15.4.7",
    "esbuild": "^0.25.0"
  }
}
```

#### Package.json النهائي المقترح للـ Frontend:

```json
{
  "name": "nextn",
  "version": "1.2.0",
  "engines": {
    "node": ">=20.11.0",
    "npm": ">=10.0.0"
  },
  "private": true,
  "scripts": {
    "dev": "node --max-old-space-size=4096 scripts/dev-with-fallback.js",
    "prebuild": "node scripts/generate-pages-manifest.js",
    "build": "cross-env NODE_ENV=production next build",
    "build:production": "NODE_ENV=production ESLINT_NO_DEV_ERRORS=true next build",
    "start": "next start -p 5000 -H 0.0.0.0",
    "analyze": "ANALYZE=true npm run build",

    "lint": "eslint \"src/**/*.{ts,tsx}\" --max-warnings=10",
    "lint:fix": "eslint \"src/**/*.{ts,tsx}\" --fix --max-warnings=10",
    "format": "prettier --write .",
    "format:check": "prettier --check .",

    "typecheck": "tsc --noEmit --skipLibCheck",

    "test": "vitest run",
    "test:smoke": "vitest run \"src/app/__smoke__/simple.test.ts\"",
    "test:watch": "vitest --watch",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",

    "e2e": "playwright test",
    "e2e:ui": "playwright test --ui",
    "e2e:headed": "playwright test --headed",
    "e2e:debug": "playwright test --debug",

    "test:all": "npm run test:coverage && npm run e2e",
    "prepush": "npm run lint && npm run typecheck && npm run test",
    "ci": "npm run lint && npm run typecheck && npm run test && npm run build && npm run e2e"
  },
  "dependencies": {
    "@genkit-ai/google-genai": "^1.20.0",
    "@genkit-ai/next": "^1.20.0",
    "@google/genai": "^0.8.0",
    "@hookform/resolvers": "^4.1.3",
    "@radix-ui/react-accordion": "^1.2.3",
    "@radix-ui/react-alert-dialog": "^1.1.6",
    "@radix-ui/react-avatar": "^1.1.3",
    "@radix-ui/react-checkbox": "^1.1.4",
    "@radix-ui/react-collapsible": "^1.1.11",
    "@radix-ui/react-dialog": "^1.1.6",
    "@radix-ui/react-dropdown-menu": "^2.1.6",
    "@radix-ui/react-label": "^2.1.2",
    "@radix-ui/react-menubar": "^1.1.6",
    "@radix-ui/react-popover": "^1.1.6",
    "@radix-ui/react-progress": "^1.1.2",
    "@radix-ui/react-radio-group": "^1.2.3",
    "@radix-ui/react-scroll-area": "^1.2.3",
    "@radix-ui/react-select": "^2.1.6",
    "@radix-ui/react-separator": "^1.1.2",
    "@radix-ui/react-slider": "^1.2.3",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.1.3",
    "@radix-ui/react-tabs": "^1.1.3",
    "@radix-ui/react-toast": "^1.2.6",
    "@radix-ui/react-tooltip": "^1.1.8",
    "@sentry/nextjs": "^8.47.0",
    "@sentry/react": "^8.47.0",
    "@tanstack/react-query": "^5.90.6",
    "@types/dompurify": "^3.2.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^3.6.0",
    "dompurify": "^3.3.0",
    "dotenv": "^16.5.0",
    "drizzle-orm": "^0.44.7",
    "drizzle-zod": "^0.8.3",
    "embla-carousel-react": "^8.6.0",
    "firebase": "^11.9.1",
    "framer-motion": "^11.0.0",
    "genkit": "^1.20.0",
    "ioredis": "^5.8.2",
    "lucide-react": "^0.475.0",
    "mammoth": "^1.7.0",
    "next": "15.4.7",
    "patch-package": "^8.0.0",
    "pdfjs-dist": "^4.4.168",
    "react": "^18.3.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.54.2",
    "react-window": "^2.2.2",
    "recharts": "^2.15.1",
    "tailwind-merge": "^3.0.1",
    "tailwindcss-animate": "^1.0.7",
    "three": "^0.180.0",
    "web-vitals": "^4.2.4",
    "zod": "^3.25.76"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3.1.0",
    "@fullhuman/postcss-purgecss": "^5.0.0",
    "@lhci/cli": "^0.15.1",
    "@next/bundle-analyzer": "^15.4.7",
    "@next/eslint-plugin-next": "^15.3.3",
    "@playwright/test": "^1.49.1",
    "@sentry/cli": "^2.39.0",
    "@tailwindcss/postcss": "^4.1.16",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^14.6.1",
    "@types/express": "^5.0.4",
    "@types/node": "^20",
    "@types/pdfjs-dist": "^2.10.377",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "@types/react-window": "^2.0.0",
    "@types/three": "^0.180.0",
    "@typescript-eslint/eslint-plugin": "^8.19.1",
    "@typescript-eslint/parser": "^8.19.1",
    "@vitejs/plugin-react": "^4.3.1",
    "@vitest/coverage-v8": "^2.1.8",
    "@vitest/ui": "^2.1.8",
    "autoprefixer": "^10.4.16",
    "cross-env": "^10.1.0",
    "cssnano": "^6.0.2",
    "eslint": "^9.17.0",
    "eslint-config-next": "^15.3.3",
    "eslint-config-prettier": "^10.1.8",
    "eslint-plugin-import": "^2.32.0",
    "eslint-plugin-unused-imports": "^4.3.0",
    "eslint-plugin-vitest": "^0.5.4",
    "genkit-cli": "^1.20.0",
    "husky": "^9.1.7",
    "jsdom": "^27.0.1",
    "lint-staged": "^15.2.10",
    "postcss": "^8",
    "postcss-preset-env": "^9.3.0",
    "prettier": "^3.6.2",
    "sharp": "^0.34.5",
    "tailwindcss": "^4.1.16",
    "typescript": "^5.9.3",
    "vite-tsconfig-paths": "^4.3.2",
    "vitest": "^2.1.8"
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "prettier --write",
      "eslint --fix"
    ],
    "*.{js,jsx,json,css,md}": [
      "prettier --write"
    ]
  },
  "overrides": {
    "next@<=15.4.7": "15.4.7",
    "esbuild": "^0.25.0",
    "@next/bundle-analyzer": "15.4.7"
  }
}
```

**التغييرات الرئيسية:**
- ✅ `test` الآن يشغل كل الاختبارات
- ✅ `lint` الآن يفحص كل src/**/*.{ts,tsx}
- ✅ إضافة `test:single` للاختبار الفردي
- ✅ توحيد إصدار TypeScript
- ✅ توحيد إصدار @next/bundle-analyzer

---

### 3. Backend package.json

#### المشكلة: @types في dependencies بدلاً من devDependencies

```json
// ❌ الحالي
{
  "dependencies": {
    "@types/bcrypt": "^6.0.0",
    "@types/cookie-parser": "^1.4.10"
  }
}
```

```json
// ✅ المقترح
{
  "dependencies": {
    "bcrypt": "^6.0.0",
    "cookie-parser": "^1.4.7"
    // نقل @types إلى devDependencies
  },
  "devDependencies": {
    "@types/bcrypt": "^6.0.0",
    "@types/cookie-parser": "^1.4.10"
  }
}
```

#### Package.json النهائي المقترح للـ Backend:

```json
{
  "name": "@the-copy/backend",
  "version": "1.0.0",
  "description": "Backend API for The Copy - Drama Analysis Platform",
  "main": "dist/server.js",
  "scripts": {
    "dev": "tsc-watch --onSuccess \"node dist/server.js\"",
    "dev:mcp": "tsx watch src/mcp-server.ts",
    "mcp": "tsx src/mcp-server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint src --ext .ts --max-warnings=0",
    "lint:fix": "eslint src --ext .ts --fix",
    "typecheck": "tsc --noEmit",
    "db:generate": "drizzle-kit generate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  },
  "keywords": [
    "drama",
    "analysis",
    "ai",
    "arabic",
    "screenplay"
  ],
  "author": "The Copy Team",
  "license": "MIT",
  "dependencies": {
    "@google/generative-ai": "^0.24.1",
    "@modelcontextprotocol/sdk": "^1.20.2",
    "@neondatabase/serverless": "^1.0.2",
    "bcrypt": "^6.0.0",
    "bullmq": "^5.63.0",
    "compression": "^1.7.4",
    "connect-pg-simple": "^10.0.0",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "dotenv": "^16.5.0",
    "drizzle-kit": "^0.31.6",
    "drizzle-orm": "^0.44.7",
    "express": "^4.18.2",
    "express-rate-limit": "^7.1.5",
    "express-session": "^1.18.2",
    "helmet": "^7.1.0",
    "ioredis": "^5.8.2",
    "jsonwebtoken": "^9.0.2",
    "mammoth": "^1.7.0",
    "module-alias": "^2.2.3",
    "multer": "^2.0.2",
    "pdfjs-dist": "^4.4.168",
    "winston": "^3.11.0",
    "zod": "^3.25.76"
  },
  "devDependencies": {
    "@types/bcrypt": "^6.0.0",
    "@types/compression": "^1.7.5",
    "@types/cookie-parser": "^1.4.10",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/express-session": "^1.18.2",
    "@types/jsonwebtoken": "^9.0.10",
    "@types/multer": "^1.4.11",
    "@types/node": "^20.0.0",
    "@types/supertest": "^6.0.2",
    "@types/ws": "^8.18.1",
    "@typescript-eslint/eslint-plugin": "^8.19.1",
    "@typescript-eslint/parser": "^8.19.1",
    "@vitest/coverage-v8": "^4.0.2",
    "eslint": "^9.17.0",
    "supertest": "^7.1.3",
    "tsc-watch": "^7.2.0",
    "tsx": "^4.7.0",
    "typescript": "^5.9.3",
    "vitest": "^4.0.2",
    "ws": "^8.18.3"
  },
  "engines": {
    "node": ">=20.0.0"
  },
  "_moduleAliases": {
    "@": "dist"
  },
  "overrides": {
    "esbuild": "^0.25.0"
  }
}
```

**التغييرات:**
- ✅ نقل @types إلى devDependencies
- ✅ إضافة `test:watch` للتطوير
- ✅ توحيد إصدار TypeScript مع frontend

---

## 🛠️ كيفية التطبيق

### الطريقة 1: يدوياً

```bash
# 1. فتح كل ملف package.json
# 2. نسخ التغييرات من هذا المستند
# 3. حفظ الملف
```

### الطريقة 2: باستخدام الأوامر

```bash
# 1. backup الملفات الحالية
cp package.json package.json.backup
cp frontend/package.json frontend/package.json.backup
cp backend/package.json backend/package.json.backup

# 2. تطبيق التغييرات (يدوياً)

# 3. إعادة التثبيت
rm -rf node_modules frontend/node_modules backend/node_modules
rm pnpm-lock.yaml
pnpm install

# 4. التحقق
pnpm run typecheck
pnpm run test
pnpm run build
```

---

## ✅ التحقق من النجاح

بعد تطبيق التغييرات:

```bash
# 1. يجب أن تمر كل هذه الأوامر
pnpm install          # ✅ بدون أخطاء
pnpm run typecheck    # ✅ بدون أخطاء
pnpm run lint         # ✅ بدون أخطاء
pnpm run test         # ✅ كل الاختبارات تمر
pnpm run build        # ✅ البناء ينجح

# 2. التحقق من الاعتمادات
pnpm list            # ✅ بدون conflicts
pnpm audit           # ⚠️  فحص الثغرات
```

---

## 📝 ملاحظات

### حزم يجب مراجعتها:

```bash
# 1. تحقق من استخدام هذه الحزم
@mistralai/mistralai    # في root - هل مستخدمة؟
patch-package           # تحقق من patches/
cross-env               # Windows specific - ضروري؟

# 2. إصدارات جديدة - تحقق من الاستقرار
bcrypt@6.0.0           # إصدار جديد جداً
multer@2.0.2           # إصدار major جديد
```

### نصائح:

1. **قبل التطبيق**: backup package.json files
2. **بعد التطبيق**: rm -rf node_modules && pnpm install
3. **تحقق**: pnpm run typecheck && pnpm run test
4. **commit**: git commit -m "chore: update package.json dependencies"

---

تم بحمد الله ✨
