### 📋 Arabic Prompt Engineering Studio Integration Plan (extended)

## 🎯 Overview
Integrate the standalone arabic-prompt-engineering-studio into the Next.js 15 App Router project following the established patterns from arabic-creative-writing-studio. The plan assumes Next.js App Router is the canonical architecture; when input app structure differs, perform automated normalization to the project standard before integration.

## 📁 Structure to Create
```
frontend/src/app/(main)/arabic-prompt-engineering-studio/
├── page.tsx
├── layout.tsx
├── loading.tsx
├── components/
│   ├── PromptEngineeringStudio.tsx
│   ├── PromptEditor.tsx
│   ├── EnhancedOutput.tsx
│   ├── FrameworkSelector.tsx
│   ├── PromptMetrics.tsx
│   └── TemplateLibrary.tsx
├── lib/
│   ├── prompt-data.ts
│   ├── prompt-analyzer.ts
│   └── gemini-service.ts
├── hooks/
│   └── useArabicPromptStudio.ts
├── store/
│   └── slices/arabicPromptStudio.ts   # only if project uses Redux/Zustand (namespaced)
├── types/
│   └── index.ts
├── styles/
│   └── prompt-studio.module.css
├── assets/
│   └── (images / icons)
└── tests/
    ├── route-navigate.test.ts
    └── prompt-logic.test.ts
```

## ✅ Implementation Steps

### 1️⃣ Setup & Structure (Priority: High)
- Create the canonical App Router directory and default route files
  - Create: frontend/src/app/(main)/arabic-prompt-engineering-studio/{page.tsx,layout.tsx,loading.tsx}.
  - If source is SPA or different, run automated normalization (see Migration Script below) to produce the above.
- Copy raw files from the provided sandbox and place them into a staging directory for migration
  - Source: /home/user/the-copy/arabic-prompt-engineering-studio/{app.js,index.html,style.css}.
- Initialize TypeScript artifacts if project is TS
  - Create types/index.ts and convert JS→TSX stubs for each component.

### 2️⃣ Component Migration & Naming (Priority: High)
- Convert app.js → components/PromptEngineeringStudio.tsx
  - Use PascalCase for component names and default exports: export default function PromptEngineeringStudio().
- Break the UI into focused components:
  - PromptEditor, EnhancedOutput, FrameworkSelector, PromptMetrics, TemplateLibrary.
- Place shared presentational UI under components/ui if project has that convention and import from '@/components/ui'.
- Ensure all component filenames are PascalCase and folder names are kebab-case.

### 3️⃣ Routing & Navigation Integration (Priority: High)
- App Router route: page.tsx must export the route UI and be reachable at /arabic-prompt-engineering-studio.
- Handle nested layouts/params:
  - If the existing project uses nested layouts (segments), ensure arabic-prompt-engineering-studio sits under the correct (main) segment and inherits layout metadata.
- Add navigation entry:
  - Update main nav component (e.g., components/ui/NavBar or frontend/src/app/layout.tsx) to include a NavLink to /arabic-prompt-engineering-studio.
- Add server/client boundaries correctly: move server-side logic into server components or lib/ services and client interactions into client components.

### 4️⃣ State Management & Service Integration (Priority: High)
- If project uses Redux/Zustand:
  - Create store/slices/arabicPromptStudio.ts following existing slice patterns and register it in the root store.
- If project uses hooks/context:
  - Implement hooks/useArabicPromptStudio.ts that returns namespaced state/actions matching existing patterns.
- Reuse GeminiService implementation where available; otherwise wrap external calls in lib/gemini-service.ts with the same interface used by creative-writing-studio.

### 5️⃣ Data, Logic & Types (Priority: High)
- Extract prompt data to lib/prompt-data.ts and analysis functions to lib/prompt-analyzer.ts.
- Add types in types/index.ts and ensure strict TypeScript compliance (noImplicitAny).
- Keep async boundaries identical to project pattern (fetch vs server actions).

### 6️⃣ Styling, Tokens & RTL (Priority: Medium)
- Map all local CSS variables and values to the project token system (colors, spacing, shadows, motion).
  - Replace raw color/spacing values with project tokens (e.g., tokens.color.primary; tokens.spacing.md).
- Use module CSS or Tailwind classes per project standard: move style.css into styles/prompt-studio.module.css or Tailwind utilities as required.
- Enable RTL by default:
  - Wrap the page with the project’s RtlProvider/context or set <html dir="rtl"> / layout dir="rtl" where the project pattern dictates.
- Ensure responsive behavior and theme (light/dark) integration using project theme provider.

### 7️⃣ Aliases, Imports & Path Normalization (Priority: Medium)
- Ensure imports use project path aliases (e.g., import { X } from '@/components/ui').
- Update tsconfig.json paths and eslint resolver if necessary.
- Normalize import paths during migration (automated rewrite using a script).

### 8️⃣ CSS Conflicts & Global Styles (Priority: Medium)
- Detect conflicting global selectors in style.css and refactor into scoped module styles.
- Remove duplicated or unsafe global rules; ensure no cascade breaks existing app styles.

### 9️⃣ Accessibility & i18n (Priority: Medium)
- Add basic ARIA attributes and keyboard support on interactive components (editor, selectors, template list).
- Register any UI strings with the project i18n system (e.g., locales/en.json and locales/ar.json) if present.

### 🔁 Migration Script & Normalization (automated)
- Create scripts/migrate-arabic-studio.sh (bash) or scripts/migrate-arabic-studio.ts (node) to:
  - Create target directories.
  - Copy source files into staging.
  - Rename app.js → PromptEngineeringStudio.tsx and inject a TSX wrapper template (client directive where needed).
  - Replace CSS variables with tokens via sed/replace patterns.
  - Update imports to use aliases (run codemod or simple search/replace).
  - Run tsc --noEmit and pnpm lint --fix automatically and produce a migration report.
- Post-migration checks (automated):
  - tsc --noEmit passes
  - pnpm lint --max-warnings=0 passes
  - pnpm test (new tests) pass
  - grep ensures RtlProvider or dir="rtl" exists
  - grep ensures '@/components' imports are used

### 10️⃣ Tests, CI & Quality Gates (Priority: Medium)
- Add unit and integration tests:
  - route-navigate.test.ts validates page render and no console errors.
  - prompt-logic.test.ts validates analyzer functions and metric calculations.
  - accessibility smoke tests to ensure ARIA roles and RTL rendering.
- Update CI pipeline YAML:
  - Include linting, typecheck, tests, and coverage steps covering new files.
  - Add migration script as a pre-check for PRs that touch the new directory.
- Ensure coverage policy is enforced per project rules.

### 11️⃣ Performance & Security Checks (Priority: Low/Medium)
- Verify that external API calls are wrapped and respect existing rate-limiting/auth patterns used by GeminiService.
- Confirm no large assets were introduced; if present, move to project CDN or static assets pipeline.

## 🔑 Key Decisions (summary)
- Canonical architecture: Next.js 15 App Router. If source differs, normalize automatically via migration script.
- Component conventions: PascalCase for components, kebab-case for directories.
- UI reuse: Always import shared UI from '@/components/ui' rather than local copies.
- State: Prefer existing project state strategy (slice/hook) and register namespaced slice if global store is used.
- Tokens & RTL: Use project tokens; enable RTL by default.

## 🚀 Success Criteria
- Page available at /arabic-prompt-engineering-studio and reachable from main nav.
- Templates load and display correctly; framework selection functions.
- Prompt analysis runs and returns expected metrics.
- RTL layout applied and visually validated.
- No TypeScript errors; linting passes with zero critical warnings.
- Unit tests added and passing; CI pipeline approves PR.
- All imports use project aliases; no local UI copies remain.
- No global CSS conflicts; tokens used for styling.

## 📋 Final Checklist (copy-paste)
1. Create frontend/src/app/(main)/arabic-prompt-engineering-studio/{page.tsx,layout.tsx,loading.tsx}  
2. Convert app.js → components/PromptEngineeringStudio.tsx and split into subcomponents (PascalCase)  
3. Move styles → styles/prompt-studio.module.css or Tailwind equivalents and map to tokens  
4. Implement lib/{prompt-data,prompt-analyzer,gemini-service} and types/index.ts  
5. Implement hooks/useArabicPromptStudio.ts and store/slices/arabicPromptStudio.ts if required  
6. Ensure RTL via RtlProvider or dir="rtl" and register i18n strings in locale files  
7. Update main nav component to include /arabic-prompt-engineering-studio link  
8. Add tests: route-navigate.test.ts, prompt-logic.test.ts, accessibility smoke test  
9. Run migration script: scripts/migrate-arabic-studio.sh and fix reported issues  
10. Run checks: tsc --noEmit; pnpm lint --max-warnings=0; pnpm test; coverage threshold passed  
11. Update CI yaml to include new directory checks and test runs  
12. Create PR from feature/arabic-prompt-engineering-studio with detailed description and QA steps

## 🔁 Rollback / PR Notes
- Branch strategy: feature/arabic-prompt-engineering-studio  
- Commit convention: feat(studio): add arabic-prompt-engineering-studio integration  
- PR description must include: migration summary, files added, commands to run locally, QA steps, rollback instructions (git revert or merge revert steps)  
- Rollback: git revert <merge-commit> OR revert feature branch and re-run CI to confirm clean state

## ✅ Minimal Local Dev Run (copy-paste commands)
- pnpm install  
- pnpm dev  
- visit: http://localhost:3000/arabic-prompt-engineering-studio  
- pnpm test

---
