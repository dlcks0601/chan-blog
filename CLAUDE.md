# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**legacy** (@leechan) — a personal space for things left behind. Next.js 16 application with TypeScript and Tailwind CSS 4, App Router with a `src/` directory, and tooling for code quality and consistent commits. See **Design System** below before touching any styling.

## Architecture

The project follows **Feature-Sliced Design (FSD) v2.1** architecture with Next.js App Router:

### FSD v2.1 Layer Structure
- **`app/`**: Next.js App Router pages and routing (top-level)
- **`pages/`**: Stub folder for Next.js compatibility (with .gitkeep)
- **`src/app/`**: FSD app layer - providers, global styles, app initialization
- **`src/pages/`**: FSD pages layer with "Pages First" approach - page-specific code stays here
- **`src/widgets/`**: Enhanced widgets with own logic, state, and API interactions
- **`src/features/`**: Reusable business features and user actions
- **`src/entities/`**: Business entities (user, product, etc.)
- **`src/shared/`**: Expanded shared layer with application-aware configs
  - `src/shared/ui/`: Shared UI components (button, input, modal)
  - `src/shared/lib/`: Utility functions and helpers
  - `src/shared/config/`: Theme constants and the legacy mark glyph data (`legacyMark.ts`)

### Technology Stack
- **Framework**: Next.js 16 with App Router and Turbopack
- **Runtime**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 (CSS-first `@theme` in `src/app/styles/globals.css`, no `tailwind.config`)
- **Font**: Overused Grotesk variable (OFL), self-hosted in `public/fonts`

## Design System

All tokens live in `src/app/styles/globals.css`. Components use tokens only — no hex colors, no font-size utilities, no arbitrary colors.

- **Color**: four roles — `canvas` (page), `ink` (text), `muted` (secondary text), `surface` (behind artworks). Dark/light only swap values via `<html data-theme>`; `dark:` follows that attribute, not the OS. `muted` passes WCAG AA on both `canvas` and `surface`.
- **Type**: one size (`text-base` = 14px / 1.5) and base weight 300 for everything. Hierarchy comes from weight (`font-semibold` = 600) and color (`text-muted`) only.
- **Spacing**: `gutter` for page edges and grid gaps (16px → 20px at `lg`), `section` (44px) between blocks. Smaller gaps use the Tailwind 4px scale.
- **Layout**: pages render inside `SiteFrame` (four corners: logo · nav · contacts · theme). Content grids are 12 columns with `gap-x-gutter`.
- **Mark**: the legacy symbol is pixel letters l·e·g·a·c·y folded into 10×11 cells. Glyph data in `shared/config/legacyMark.ts` drives the logo (`LogoMark`), the `logo` artwork, and the generated icons (`app/icon.tsx`, `app/apple-icon.tsx`). Render it only at heights that are multiples of 11px.
- **Focus**: `:focus-visible` draws a 1px `ink` outline, 3px offset.
- **Artworks**: each Collection piece is a widget (`widgets/legacy-logo-artwork`, `widgets/duo-artwork`) plus a page slice. The `duo` device shows site captures in `public/artworks/duo` (folded = mobile home, unfolded = home and Resume as one screen) — when those pages change, run `node scripts/capture-duo-screens.mjs` with `pnpm dev` up.
- **Dev note**: Turbopack sometimes keeps stale CSS after `@theme` changes — stop the dev server, `rm -rf .next`, restart.

## Development Commands

### Package Management
```bash
pnpm install                     # Install dependencies (uses pnpm, not npm)
pnpm dev                        # Start development server with Turbopack
pnpm build                      # Build for production with Turbopack
pnpm start                      # Start production server
pnpm lint                       # Run ESLint
```

### FSD CLI (v2.1)
```bash
npm install -g @feature-sliced/cli  # Install FSD CLI globally
fsd p home -s ui -r src             # Generate page slice with segments
fsd f auth -s ui api model -r src   # Generate feature slice
fsd w header -s ui api -r src       # Generate widget slice
fsd s ui api lib config -r src      # Generate shared segments
```

### Git and Commits
```bash
pnpm run commit                 # Interactive commit with Commitizen (recommended)
npx cz                          # Alternative commit command
```

**Commit Types**: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert

## Development Workflow

### Code Quality
- **Pre-commit hooks**: Automatically run ESLint and Prettier on staged files
- **Commit message linting**: Enforces Conventional Commits format
- **Lint-staged**: Only processes staged files for faster commits

### Git Hooks (Husky)
- `pre-commit`: Runs lint-staged (ESLint + Prettier)
- `commit-msg`: Validates commit message format

### Import Alias
- Use `@/*` for imports from `src/` directory (e.g., `import Component from '@/shared/ui/Component'`)
- Cross-imports use `@x` notation (FSD v2.1 standardized)

### FSD v2.1 Key Principles
- **Pages First**: Keep page-specific code that isn't reused in the page slice
- **Enhanced Widgets**: Widgets can contain their own stores and business logic
- **Expanded Shared**: Application-aware configs (routes, API endpoints) are allowed
- **Dependency Rule**: Higher layers can import from lower layers only

### API Organization Patterns

#### Page-Specific APIs (Pages First)
APIs used only on a single page:
```typescript
// src/pages/home/api/getHomeData.ts
export async function getLatestPosts() {
  return fetch('/api/posts/latest?limit=5') // Home page only
}
```

#### Domain APIs (Entities)
APIs reused across multiple pages:
```typescript
// src/entities/post/api/postApi.ts
export async function getPostById(id: string) {
  return fetch(`/api/posts/${id}`) // Used in detail, edit, preview pages
}
```

#### Shared API Utilities
Common API clients and configurations:
```typescript
// src/shared/api/client.ts
export const apiClient = {
  get: (url: string) => fetch(url)
}
```

**Decision Rule**: "Will this API be used on other pages?"
- No → `pages/[page]/api/`
- Yes → `entities/[domain]/api/` or `shared/api/`

## Technology Stack

- **Framework**: Next.js 16 with App Router and Turbopack
- **Runtime**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Architecture**: Feature-Sliced Design v2.1
- **Development Tools**: FSD CLI, Steiger (linter, in development)
- **Code Quality**: ESLint 9, Prettier 3.6.2, Husky 9.1.7
- **Commit Tools**: Commitizen, Commitlint with Conventional Commits

## Documentation

Detailed architecture documentation is available in:
- `docs/architecture-en.md` - English version
- `docs/architecture-ko.md` - Korean version