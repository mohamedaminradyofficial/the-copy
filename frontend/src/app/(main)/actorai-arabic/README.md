# ActorAI Pro - Arabic Integration

## Overview

ActorAI Pro is an AI-powered acting training platform that helps actors master their craft through script analysis, virtual scene partners, and performance analytics.

## Features

### 🧠 Script Analysis

- Deep analysis of objectives, obstacles, and emotional arcs
- Support for multiple acting methodologies (Stanislavsky, Meisner, Chekhov, etc.)
- Beat-by-beat breakdown of scenes
- Personalized coaching tips

### 💬 AI Scene Partner

- Rehearse scenes with intelligent AI partners
- Natural dialogue flow
- Real-time responses

### 📊 Performance Analytics

- Detailed feedback on emotional authenticity
- Vocal delivery assessment
- Physical presence analysis
- Progress tracking over time

### 📈 Dashboard

- Manage uploaded scripts
- Track performance recordings
- View performance scores
- Monitor improvement metrics

## Project Structure

```
actorai-arabic/
├── components/
│   ├── ActorAiArabicStudio.tsx    # Main component
│   └── ui/                         # UI-specific components
├── hooks/                          # Custom React hooks
├── lib/                            # Utility functions and services
├── styles/                         # Component-specific styles
├── assets/                         # Static assets
├── static-source/                  # Original vanilla JS source files
│   ├── app.js
│   ├── index.html
│   └── style.css
├── page.tsx                        # Next.js page entry point
└── README.md                       # This file
```

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **UI Components**: Radix UI (via shadcn/ui)
- **Styling**: Tailwind CSS
- **State Management**: React Hooks

## Usage

### Running Locally

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the development server:

   ```bash
   pnpm dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000/actorai-arabic
   ```

### Available Routes

- `/actorai-arabic` - Main application page

## Components

### ActorAiArabicStudio

The main component that orchestrates all features:

```tsx
import ActorAiArabicStudio from "./components/ActorAiArabicStudio";

export default function ActoraiArabicPage() {
  return <ActorAiArabicStudio />;
}
```

## Integration Notes

### Design System Compatibility

The application uses the project's shared UI components from `@/components/ui/`:

- Card
- Tabs
- Alert
- Badge

All components follow the project's design tokens and theming system.

### RTL Support

The application is built with RTL (Right-to-Left) support in mind, though the current implementation is in English. RTL can be enabled by:

- Using Tailwind's RTL utilities (e.g., `space-x-reverse`)

## Development Guidelines

### Adding New Features

1. Create new components in the `components/` directory
2. Use TypeScript for type safety
3. Follow the existing component patterns
4. Reuse shared UI components where possible
5. Add appropriate documentation

### Styling

- Use Tailwind CSS utility classes
- Follow the project's design tokens
- Maintain consistency with other pages
- Use the `className` prop for styling

### State Management

- Use React hooks for local state
- Consider adding a context provider for shared state if needed
- Keep state close to where it's used

## Testing

Run the type checker:

```bash
pnpm typecheck
```

Run linting:

```bash
pnpm lint
```

Build for production:

```bash
pnpm build
```

## Future Enhancements

- [ ] Integration with actual AI services (Gemini API)
- [ ] Audio recording and playback
- [ ] Video performance recording
- [ ] Real-time performance feedback
- [ ] User authentication and data persistence
- [ ] Export functionality for scripts and recordings
- [ ] Mobile responsive improvements
- [ ] Accessibility enhancements
- [ ] Arabic language support

## Migration from Original Source

This is a React/TypeScript migration of the original vanilla JavaScript application found in `static-source/`. The key changes include:

1. **Component Architecture**: Converted class-based vanilla JS to functional React components
2. **Type Safety**: Added TypeScript types and interfaces
3. **UI Components**: Replaced custom elements with Radix UI components
4. **Styling**: Migrated from vanilla CSS to Tailwind CSS
5. **State Management**: Replaced custom state management with React hooks
6. **Routing**: Integrated with Next.js App Router

## Support

For issues or questions, please refer to the main project documentation or contact the development team.

## License

Part of the main project. See root LICENSE file for details.
