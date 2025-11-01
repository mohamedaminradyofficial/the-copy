 
**Step 1: Environment and Context Discovery**
1.1. Confirm Project Type: Next.js App Router.
1.2. Identify Project Conventions:
**Step 2: Create Feature Branch and Directory Structure**
2.1. Create a new Git branch: `feat/integrate-arabic-creative-writing-studio`.
2.2. Create the directory structure inside `frontend/src/app/(main)/`:
**Step 3: Migrate and Normalize Files**
3.1. Move files from `Arabic Creative Writing Studio/` to the new structure:
3.2. Create the main page file `frontend/src/app/(main)/arabic-creative-writing-studio/page.tsx` to render the `CreativeWritingStudio` component.
3.3. Update all import paths within the moved files to use the project's path aliases (e.g., `@/app/(main)/arabic-creative-writing-studio/...`).
**Step 4: Code Integration and Refactoring**
4.1. Refactor CSS to use Tailwind CSS utility classes and theme tokens from `tailwind.config.ts`.
4.2. Replace custom UI components with existing components from `frontend/src/components/ui/` where applicable (e.g., Button, Dialog, etc.).
4.3. Ensure the new page and components are server components where possible, and use `"use client";` only when necessary.
4.4. Add `dir="rtl"` to the root element of the page layout to enable right-to-left text direction.
**Step 5: Dependency Management**
5.1. Identify dependencies from `Arabic Creative Writing Studio/package.json`.
5.2. Add necessary dependencies to `frontend/package.json`.
5.3. Run `pnpm install` to install the new dependencies.
5.4. Delete the standalone `Arabic Creative Writing Studio/package.json` and `tsconfig.json`.
**Step 6: Routing and Navigation**
6.1. The new page will be automatically available at `/arabic-creative-writing-studio` due to the App Router file structure.
6.2. Add a link to the new page in the main navigation component (`frontend/src/components/main-nav.tsx`).
**Step 7: Testing**
7.1. Add basic unit tests using Vitest for the main components (`CreativeWritingStudio`, `WritingEditor`).
7.2. Add a Playwright E2E test to verify that the page loads correctly at `/arabic-creative-writing-studio`.
**Step 8: Documentation and Pull Request**
8.1. Create a `README.md` inside `frontend/src/app/(main)/arabic-creative-writing-studio/` explaining the feature.
8.2. Prepare a comprehensive Pull Request detailing the changes, integration steps, and testing instructions.