# Arabic Creative Writing Studio Integration Plan

📋 Overview  
Integrate the standalone "Arabic Creative Writing Studio" into the main Next.js 15 codebase, fully normalizing structure, styling, runtime behavior, routing, RTL, state, and CI so the feature becomes a first-class page inside the app and conforms 100% to the project conventions.

---

## 🎯 Key Objectives
- ✅ Migrate files into Next.js App Router structure (frontend/src/app/(main)/arabic-creative-writing-studio/)  
- ✅ Normalize code to use project conventions (Tailwind tokens, Radix UI, @/ path aliases)  
- ✅ Decide and apply Server vs Client components explicitly; add "use client" where required  
- ✅ Enable and verify RTL support for Arabic content (visual snapshots + assertions)  
- ✅ Integrate page into existing navigation and routing metadata  
- ✅ Merge/remove local package.json / tsconfig.json and align dependencies and tsconfig paths  
- ✅ Add unit (Vitest) and E2E (Playwright) tests; meet coverage target (95% or project threshold)  
- ✅ CI adjustments: lint → build → test, visual snapshot checks, coverage gating  
- ✅ Deliver branch, PR, README, CI-green artifacts

---

## 📁 Target Directory Structure (final normalized layout)
frontend/src/app/(main)/arabic-creative-writing-studio/  
├── page.tsx                    # Page entry (export default Page) — decide Server/Client per rules  
├── layout.tsx (optional)       # If page needs local layout or providers  
├── components/  
│   ├── CreativeWritingStudio.tsx  
│   ├── PromptLibrary.tsx  
│   ├── WritingEditor.tsx  
│   └── SettingsPanel.tsx  
├── lib/  
│   ├── gemini-service.ts  
│   └── data-manager.ts  
├── hooks/ (optional)  
├── styles/ (optional)  
└── types/  
    └── index.ts

Notes: component filenames use PascalCase; folder names use kebab-case. All imports must use project path aliases (e.g., @/components/ui, @/lib).

---

## 🔄 Migration Steps (copy/paste executable TODO)

1. Create Git branch  
   - git checkout -b feat/integrate-arabic-creative-writing-studio

2. Discover project context (automated detection)  
   - Detect App Router vs SPA (Next.js 15 App Router expected)  
   - Extract project tokens: tailwind.config, theme provider, alias paths (tsconfig/next.config)  
   - Detect state management (Redux / Context / Zustand) and CSS strategy (Tailwind, CSS Modules)  
   - Detect server/client component policy (next.config or repository conventions)

3. Create canonical folders and move files  
   - mkdir -p frontend/src/app/(main)/arabic-creative-writing-studio/{components,lib,types}  
   - Move and rename files:
     - CreativeWritingStudio.tsx -> components/CreativeWritingStudio.tsx  
     - PromptLibrary.tsx -> components/PromptLibrary.tsx  
     - WritingEditor.tsx -> components/WritingEditor.tsx  
     - SettingsPanel.tsx -> components/SettingsPanel.tsx  
     - geminiService.ts -> lib/gemini-service.ts  
     - dataManager.ts -> lib/data-manager.ts  
     - types.ts -> types/index.ts  
   - Create page.tsx that imports and renders CreativeWritingStudio component as the route entry

4. Decide Server vs Client components and mark explicitly  
   - For each file: determine whether it uses hooks, browser-only APIs, or interactive state.  
   - Add "use client" to top of interactive files (WritingEditor, PromptLibrary, SettingsPanel if they use hooks or DOM).  
   - Leave stateless/SSR-friendly parts as Server Components when safe.

5. Normalize imports and exports automatically  
   - Run codemod/script to convert relative paths to aliases (@/...) and to fix extensions and default/named export mismatches.  
   - Ensure all components export via PascalCase named or default as per repo convention (match other pages).  
   - Example automated actions:
     - replace("../../components/Button") -> "@/components/ui/button"
     - convert export const X -> export default X where project expects default, or vice versa per convention

6. Replace styles and UI primitives with project tokens and UI library  
   - Replace custom CSS classes with Tailwind utility classes using tokens from tailwind.config (colors, spacing, shadows, motion).  
   - Replace custom primitive components with centralized UI components:
     - Buttons -> @/components/ui/button  
     - Inputs -> @/components/ui/input  
     - Selects -> @/components/ui/select  
     - Dialogs -> @/components/ui/dialog  
     - Toasts -> @/components/ui/toast  
   - Remove inline theme toggles; use project theme provider and rely on existing dark mode implementation

7. RTL enablement and verification  
   - Ensure page root sets direction via project pattern:
     - If global RTL already enabled: confirm page inherits dir="rtl"  
     - If not global: wrap page with <div dir="rtl"> or use project-level provider per conventions  
   - Ensure Arabic font families are referenced from tailwind.config  
   - Adjust icon/SVG mirroring where necessary (use transform: scaleX(-1) strategy if project uses it)  
   - Add visual snapshot tests verifying layout mirror and key component alignment

8. State management alignment  
   - If components hold significant local state that should be global, move relevant parts to the project's store (Redux/Zustand/Context) with small adapter hooks under hooks/  
   - If keeping local state, ensure consistent patterns for data-fetching (use fetch/server actions per Next.js 15 standards) and prop-drilling minimized

9. API/service integration and secrets  
   - Move gemini-service.ts to lib/ and adapt to project service conventions (server actions or client adapter)  
   - Ensure all secrets (Gemini API key) read from process.env and never in client bundles  
   - Lazy-load heavy network code (dynamic import in component that triggers Gemini requests) and ensure server-side proxying if required

10. Update routing and navigation  
    - Page route: /arabic-creative-writing-studio (decide slug kebab-case per repo rules; unify across nav and metadata)  
    - Modify frontend/src/components/main-nav.tsx (or central nav config):
      {
        href: "/arabic-creative-writing-studio",
        label: "استوديو الكتابة",
        icon: Pen,
      }
    - Add route metadata (title, description, permissions) to central routing config if present

11. Testing: unit, visual, and E2E  
    - Add Vitest unit tests for:
      - Rendering of CreativeWritingStudio (smoke test)  
      - PromptLibrary interactions (add/remove prompt)  
      - WritingEditor core editor state and save flow (mock services)  
    - Add Playwright E2E tests:
      - Navigate to /arabic-creative-writing-studio, assert visible elements, perform text edit and save, assert persisted state or expected UI changes  
      - Visual snapshot tests for RTL layout (before/after mirror)  
    - Ensure coverage reports integrated into CI and coverage threshold enforced (95% or repo threshold). If coverage cannot reach threshold, add coverage exclude with justification in PR

12. CI and lint integration  
    - Ensure new files included in lint/build/test steps in CI YAML  
    - Run lint fixes (eslint --fix) and resolve residual warnings per repo rules  
    - Run pnpm install (or repo package manager) and pnpm build && pnpm test locally to reproduce CI result  
    - Add Playwright visual snapshot validation step in CI

13. Dependencies, tsconfig, and package.json reconciliation  
    - Copy necessary dependencies from local package.json into root package.json (if any) and run install  
    - Do not leave a package.json in the feature folder unless the repo uses workspace packages (in that case, update pnpm-workspace.yaml)  
    - Merge tsconfig paths/types into root tsconfig if types or path aliases required; verify no conflicting compilerOptions

14. Performance optimizations (applied conservatively)  
    - Use dynamic imports for heavy or editor-related components (Next.js dynamic import)  
    - Lazy-load Gemini service and large third-party modules  
    - Tree-shake imports (prefer named imports from libraries)  
    - Ensure image assets use next/image when applicable and size-sensible bundles

15. Security and data handling  
    - Ensure client does not expose API keys; place request logic server-side or use server actions / API routes  
    - Use environment variables (process.env) and validate at runtime; fail-fast with clear error if missing  
    - Maintain CSP, X-Frame-Options, and other headers from next.config.js

16. Documentation and README  
    - Create frontend/src/app/(main)/arabic-creative-writing-studio/README.md containing:
      - Feature overview and architecture diagram (brief)  
      - Local dev commands (npm run dev, build, test) and env vars required  
      - Testing instructions and where snapshots live  
      - Notes on Server vs Client component decisions and state architecture

17. PR and acceptance checklist (required on PR description)
    - Branch: feat/integrate-arabic-creative-writing-studio  
    - Checklist items (must be checked before merge):
      - [ ] CI build is green (lint, build, test)  
      - [ ] Vitest unit tests pass and coverage meets threshold  
      - [ ] Playwright E2E tests pass including RTL visual snapshots  
      - [ ] Page reachable at /arabic-creative-writing-studio and appears in navigation  
      - [ ] No stray package.json / tsconfig.json left in feature folder (or workspace declared)  
      - [ ] All imports use @/ aliases and conform to repo export rules  
      - [ ] All interactive components with browser APIs are marked "use client"  
      - [ ] Secrets not leaked to client; Gemini key is env-only  
      - [ ] README added and PR notes list all structural renames/moves + rationale for exceptions  
      - [ ] Any unresolved deviations documented with explicit mitigation plan

18. Git commands / execution script (suggested)
    - git checkout -b feat/integrate-arabic-creative-writing-studio  
    - mkdir -p frontend/src/app/(main)/arabic-creative-writing-studio/{components,lib,types}  
    - mv "/home/user/the-copy-/Arabic Creative Writing Studio/CreativeWritingStudio.tsx" frontend/src/app/(main)/arabic-creative-writing-studio/components/CreativeWritingStudio.tsx  
    - mv "/home/user/the-copy-/Arabic Creative Writing Studio/"*.tsx frontend/src/app/(main)/arabic-creative-writing-studio/components/  
    - mv "/home/user/the-copy-/Arabic Creative Writing Studio/"*.ts frontend/src/app/(main)/arabic-creative-writing-studio/lib/  
    - mv "/home/user/the-copy-/Arabic Creative Writing Studio/types.ts" frontend/src/app/(main)/arabic-creative-writing-studio/types/index.ts  
    - Create page.tsx that imports components/CreativeWritingStudio and exports default Page  
    - Run codemod to fix imports → aliases (example: npx jscodeshift with repo codemod)  
    - pnpm install && pnpm build && pnpm test  
    - git add . && git commit -m "chore: integrate Arabic Creative Writing Studio into app structure" && git push origin feat/integrate-arabic-creative-writing-studio

---

## 🎨 Design Decisions & Clarifications (applied rules)
- No separate package.json or tsconfig.json in feature folder unless repo uses workspace packages and workspace is updated accordingly  
- Prefer Server Components where possible; mark interactive components with "use client" explicitly  
- Tailwind tokens and global theme used; do not introduce new token sets without core team approval  
- All UI primitives replaced with project UI library (Radix + internal wrappers) to ensure consistency and accessibility  
- Kebab-case slugs for URLs (/arabic-creative-writing-studio) to match repo routing conventions (if repo uses spaced slugs, adjust accordingly and document)

---

## ⚠️ Risks and Mitigations
- Risk: CI build failures due to missed tsconfig/path merges  
  - Mitigation: run local build using same Node and pnpm versions as CI and include tsconfig merge step in PR notes  
- Risk: RTL visual regressions (icons, spacing)  
  - Mitigation: Playwright visual snapshots and targeted CSS utilities for mirroring  
- Risk: Exposure of Gemini API key  
  - Mitigation: move calls to server-side; validate env presence on startup and fail fast in dev with clear message  
- Risk: Coverage gating blocks merge  
  - Mitigation: add tests for critical flows first; if full coverage not possible, add explicit coverage excludes with reviewable justification

---

## 📚 Deliverables
- Git branch feat/integrate-arabic-creative-writing-studio with full changes  
- PR with checklist and README inside the feature folder  
- page accessible at /arabic-creative-writing-studio and registered in main-nav  
- Vitest unit tests, Playwright E2E tests, and visual snapshots in CI (green)  
- No stray local package.json/tsconfig unless workspace intentionally used
