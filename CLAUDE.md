# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application with TypeScript, Tailwind CSS, and Framer Motion. The project uses App Router architecture with `src/` directory structure and includes comprehensive development tooling for code quality and consistent commits.

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
  - `src/shared/api/`: API layer and requests
  - `src/shared/config/`: Configuration files (routes, API endpoints, env)

### Technology Stack
- **Framework**: Next.js 15.5.3 with App Router and Turbopack
- **Runtime**: React 19.1.0
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with PostCSS for utility-first CSS
- **Animations**: Framer Motion for complex animations and transitions
- **Fonts**: Geist Sans and Geist Mono fonts optimized with `next/font`

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

- **Framework**: Next.js 15.5.3 with App Router and Turbopack
- **Runtime**: React 19.1.0
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4.1.13
- **Animation**: Framer Motion 12.23.15
- **Architecture**: Feature-Sliced Design v2.1
- **Development Tools**: FSD CLI, Steiger (linter, in development)
- **Code Quality**: ESLint 9, Prettier 3.6.2, Husky 9.1.7
- **Commit Tools**: Commitizen, Commitlint with Conventional Commits

## Documentation

Detailed architecture documentation is available in:
- `docs/architecture-en.md` - English version
- `docs/architecture-ko.md` - Korean version