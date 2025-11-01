# Design Guidelines: AI Film Production Assistant

## Design Approach

**Selected Approach**: Design System (Material Design) with Creative Industry Refinements

This professional production tool requires a robust, functional foundation with creative industry polish. We'll use Material Design principles adapted for Arabic RTL layout, enhanced with visual sophistication befitting creative professionals in film production.

**Key Design Principles**:
- Clarity and efficiency for complex production workflows
- Professional sophistication matching industry standards
- Seamless Arabic RTL experience
- Information hierarchy that supports decision-making
- Visual refinement without sacrificing functionality

---

## Typography

**Arabic Font Families**:
- **Primary**: 'Tajawal' (Google Fonts) - Clean, modern Arabic sans-serif for UI elements
- **Secondary**: 'Cairo' (Google Fonts) - Slightly geometric for headings and emphasis
- **Monospace**: 'IBM Plex Sans Arabic' for technical data and timestamps

**Type Scale**:
- Display (Hero/Dashboard Headers): 48px/56px, Bold (Cairo)
- H1 (Page Titles): 36px/44px, Bold (Cairo)
- H2 (Section Headers): 28px/36px, Semibold (Tajawal)
- H3 (Component Headers): 20px/28px, Semibold (Tajawal)
- Body Large: 18px/28px, Regular (Tajawal)
- Body: 16px/24px, Regular (Tajawal)
- Small/Meta: 14px/20px, Regular (Tajawal)
- Tiny/Labels: 12px/16px, Medium (Tajawal)

**RTL Typography Rules**:
- All text alignment right-aligned by default
- Numbers displayed in Arabic-Indic numerals or Western based on context
- Proper Arabic letter shaping and ligatures
- Adequate letter-spacing for Arabic readability (slightly tighter than Latin)

---

## Layout System

**Spacing Scale**: Use Tailwind units of **2, 3, 4, 6, 8, 12, 16, 20, 24** for consistent rhythm
- Component padding: p-4, p-6, p-8
- Section spacing: space-y-6, space-y-8, space-y-12
- Card margins: m-4, m-6
- Tight spacing: gap-2, gap-3
- Generous spacing: gap-8, gap-12

**Grid System**:
- Dashboard: 12-column grid with RTL flow
- Content areas: max-w-7xl container
- Sidebar navigation: 280px fixed width (right side for RTL)
- Main content: Fluid with 24px padding
- Cards/Panels: Consistent 8px border-radius

**RTL Layout Considerations**:
- Navigation drawer opens from right
- Progressive disclosure flows right-to-left
- Action buttons positioned right-aligned
- Breadcrumbs flow right-to-left with Arabic separators

---

## Component Library

### Navigation & Structure

**Top Navigation Bar**:
- Height: 64px, fixed position
- Logo positioned right (RTL)
- Primary navigation items: right-aligned, 16px spacing
- User profile menu: left side
- Background with subtle shadow for depth

**Sidebar Navigation** (Right-side for RTL):
- Collapsible drawer, 280px expanded
- Icon + label navigation items
- Active state with accent indicator strip
- Grouped sections with dividers
- Collapse to 64px icon-only on toggle

**Dashboard Layout**:
- Header section with project title and quick stats
- 3-column grid for key metrics (lg:grid-cols-3)
- Main content area with tabs for different workflows
- Quick action floating button (left-bottom for RTL)

### Content Components

**Script Upload Zone**:
- Large dropzone area (min-height: 400px)
- Dashed border with upload icon
- Drag-and-drop with visual feedback
- Supported formats clearly indicated
- Progress bar for upload status

**Scene Cards**:
- Card design with 8px border-radius
- Scene thumbnail or icon (right-aligned)
- Scene number badge (top-right corner)
- Title, location, time of day
- Character count and tags
- Action menu (3-dot, left-aligned)
- Hover state with subtle elevation

**Character Tracker Panel**:
- Avatar/image grid layout
- Character name and appearance count
- Color-coded consistency status indicators
- Expandable details with costume/prop notes
- Visual timeline of character appearances

**Shot Planning Interface**:
- Split view: Script excerpt (right) + Visual planning (left)
- Camera angle selector with icons
- Movement notation tools
- Lighting setup diagrams
- Reference image attachment area

**AI Chat Assistant**:
- Fixed chat panel (can be toggled)
- Message bubbles with clear user/AI distinction
- Code/technical content with proper formatting
- Suggested prompts as pills/chips
- Typing indicator for AI responses
- Message timestamp in Arabic format

### Form Elements

**Input Fields**:
- Outlined style (Material Design)
- Right-aligned labels for RTL
- Floating label animation
- Helper text below field
- Error states with inline validation
- Icon support (right-side inside field)

**Buttons**:
- Primary: Filled with elevation
- Secondary: Outlined
- Text buttons for tertiary actions
- Icon buttons for compact actions
- Minimum touch target: 44px
- Right-aligned in button groups

**Dropdowns & Selects**:
- Material Design dropdown style
- RTL-aware menu positioning
- Search functionality for long lists
- Multi-select with chips
- Grouped options with headers

### Data Display

**Tables**:
- Right-aligned headers and content for RTL
- Zebra striping for readability
- Sortable columns with Arabic indicators
- Row actions menu (left-side)
- Sticky header on scroll
- Pagination with Arabic numerals

**Status Badges**:
- Pill-shaped with 16px border-radius
- Color-coded by status type
- Small size (12px font, 6px padding)
- Positioned right-aligned in layouts

**Progress Indicators**:
- Linear progress bars for uploads/processing
- Circular progress for loading states
- Percentage display in Arabic numerals
- Color transitions based on completion

---

## Images

**Hero Section** (Dashboard Landing):
- Large hero image showcasing film production scene
- Aspect ratio: 21:9 for cinematic feel
- Gradient overlay (right-to-left fade) for text readability
- Welcome message and quick action buttons overlaid
- Buttons with backdrop-blur-md background

**Reference Library**:
- Masonry grid layout for visual references
- Lightbox view for detailed inspection
- Image thumbnails: 16:9 or square crop
- Upload placeholder with camera icon
- Organized by scene or category

**Scene Thumbnails**:
- 16:9 aspect ratio thumbnails
- Generated from script or user-uploaded
- Placeholder with film clapperboard icon
- Positioned right-side of scene cards

**Avatars** (Character Tracker):
- Circular avatars, 48px standard size
- Larger size (96px) for detailed view
- Placeholder with first letter of character name
- Border indicating consistency status

---

## Animations

**Minimal, Purposeful Animations**:
- Page transitions: 200ms ease-in-out fade
- Card hover: Subtle elevation increase (2px shadow growth)
- Dropdown menus: 150ms slide-down
- Modal/dialog: 250ms scale-in with backdrop fade
- Loading states: Smooth skeleton screens
- NO complex scroll animations
- NO distracting parallax effects

---

## Accessibility & RTL

**RTL Implementation**:
- `dir="rtl"` on HTML element
- Tailwind RTL variants for all directional properties
- Mirror all layouts and flows
- Proper Arabic punctuation and numbering
- Bidirectional text handling in mixed content

**Accessibility**:
- WCAG 2.1 AA compliance minimum
- Keyboard navigation with visible focus states
- Screen reader support with Arabic ARIA labels
- Sufficient contrast ratios (4.5:1 for body text)
- Focus trap in modals
- Skip navigation links

---

## Professional Polish

**Visual Refinement**:
- Subtle shadows for depth hierarchy
- Consistent 8px border-radius for softness
- Refined hover states (not aggressive)
- Thoughtful micro-interactions
- Professional iconography (Material Icons or Heroicons)

**Film Industry Feel**:
- Cinematic aspect ratios where appropriate
- Clapperboard and film reel motifs in empty states
- Timeline visualizations for production schedules
- Storyboard-style layouts for shot planning
- Professional production terminology throughout

This design system creates a powerful, professional tool that respects Arabic language conventions while providing the sophisticated interface expected by creative professionals in film production.