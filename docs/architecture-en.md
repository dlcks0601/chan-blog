# Project Architecture Documentation

## Overview

This project implements **Feature-Sliced Design (FSD)** architecture with Next.js 15 App Router, providing a scalable and maintainable structure for modern React applications.

## Technology Stack

- **Framework**: Next.js 15.5.3 with App Router and Turbopack
- **Runtime**: React 19.1.0
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with PostCSS
- **Animation**: Framer Motion 12.23.15
- **Package Manager**: pnpm
- **Code Quality**: ESLint, Prettier, Husky, Commitlint

## Directory Structure

```
ai-study/
├── app/                          # Next.js App Router (routing only)
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── favicon.ico              # App favicon
│
├── pages/                        # Next.js compatibility stub
│   └── .gitkeep                 # Keep directory in git
│
├── src/                          # FSD architecture layers
│   ├── app/                     # App layer - initialization & global settings
│   │   ├── providers/           # React providers (theme, state, etc.)
│   │   └── styles/              # Global styles
│   │       └── globals.css      # Global CSS with Tailwind
│   │
│   ├── pages/                   # Pages layer - FSD v2.1 "Pages First"
│   │   └── home/                # Home page slice
│   │       ├── index.ts         # Public API
│   │       └── ui/              # Page-specific UI components
│   │           └── HomePage.tsx # Home page component
│   │
│   ├── widgets/                 # Widget layer - complete UI blocks
│   │   └── .gitkeep
│   │
│   ├── features/                # Feature layer - business features
│   │   └── .gitkeep
│   │
│   ├── entities/                # Entity layer - business entities
│   │   └── .gitkeep
│   │
│   └── shared/                  # Shared layer - reusable code
│       ├── ui/                  # Shared UI components
│       │   └── index.ts         # UI components export
│       ├── lib/                 # Utility functions
│       │   └── index.ts         # Library functions export
│       ├── api/                 # API layer
│       │   └── index.ts         # API client export
│       └── config/              # Configuration files
│           ├── index.ts         # Config exports
│           ├── routes.ts        # Route constants
│           ├── api.ts           # API configuration
│           └── env.ts           # Environment variables
│
├── docs/                         # Documentation
├── .husky/                       # Git hooks
└── Configuration files...
```

## FSD v2.1 Layer Architecture

### Layer Hierarchy (Top to Bottom)

1. **App Layer** (`src/app/`)
   - Application initialization
   - Global providers (Theme, Router, State)
   - Global styles and fonts
   - App-level configurations

2. **Pages Layer** (`src/pages/` + Next.js `app/` routing)
   - **v2.1 "Pages First" approach**: Keep more code in pages
   - Large UI blocks, forms, and data logic not reused on other pages
   - Page-specific components and logic
   - SEO and metadata

3. **Widgets Layer** (`src/widgets/`)
   - **v2.1 Enhanced**: No longer just a compositional layer
   - Can include widget's own stores, business logic, and API interactions
   - Large, self-contained UI blocks
   - Header, Footer, Sidebar, Dashboard components

4. **Features Layer** (`src/features/`)
   - Reusable business features
   - User interactions (login, search, cart)
   - Feature-specific logic and state

5. **Entities Layer** (`src/entities/`)
   - Business domain models
   - Data structures (User, Product, Order)
   - Entity-specific operations

6. **Shared Layer** (`src/shared/`)
   - **v2.1 Expanded**: Application-aware elements now allowed
   - Route constants, API calls, company logo, etc.
   - UI kit components (Button, Input, Modal)
   - Helper functions and configuration

## Import Rules

### Dependency Direction
- Higher layers can import from lower layers
- Lower layers cannot import from higher layers
- Same-level imports should be avoided

### Import Examples
```typescript
// ✅ Correct - Higher layer importing from lower
// src/features/auth/login.tsx
import { Button } from '@/shared/ui/button'
import { User } from '@/entities/user'

// ✅ Correct - Using alias
import { api } from '@/shared/api'

// ❌ Wrong - Lower layer importing from higher
// src/shared/ui/button.tsx
import { LoginForm } from '@/features/auth' // ❌ Don't do this
```

## Development Guidelines

### Component Creation
1. Identify the appropriate layer for your component
2. Create the component following TypeScript best practices
3. Export through index files for clean imports
4. Add proper typing and documentation

### Feature Development
1. Start with shared utilities if needed
2. Create entity models for business logic
3. Implement features using entities and shared code
4. Compose widgets from features and entities
5. Connect everything in the app layer

### File Naming Conventions
- Use kebab-case for directories: `user-profile/`
- Use PascalCase for React components: `UserProfile.tsx`
- Use camelCase for utilities: `formatDate.ts`
- Use UPPER_CASE for constants: `API_ENDPOINTS.ts`

### API Organization Guidelines (FSD v2.1)

#### 1. Pages First - Page-Specific APIs
APIs used only on a single page should stay in that page slice:
```typescript
// src/pages/home/api/getHomeData.ts
// APIs only used on the home page
export async function getLatestPosts() {
  return fetch('/api/posts/latest?limit=5') // Home-specific latest 5 posts
}

export async function getHomeBanner() {
  return fetch('/api/banner/home') // Home page exclusive banner
}
```

#### 2. Entities - Domain-Specific Reusable APIs
APIs reused across multiple pages for domain-specific operations:
```typescript
// src/entities/post/api/postApi.ts
// Reused in detail page, edit page, preview modal, etc.
export async function getPostById(id: string) {
  return fetch(`/api/posts/${id}`)
}

export async function getAllPosts() {
  return fetch('/api/posts') // Used in list page, search page, admin page
}
```

#### 3. Shared - Common API Utilities
General-purpose API clients and configurations:
```typescript
// src/shared/api/client.ts
export const apiClient = {
  get: (url: string) => fetch(url),
  post: (url: string, data: any) => fetch(url, { method: 'POST', body: JSON.stringify(data) })
}

// src/shared/config/api.ts
export const API_ENDPOINTS = {
  POSTS: '/api/posts',
  USERS: '/api/users'
}
```

#### Decision Criteria
- **Used on one page only** → `pages/[page]/api/`
- **Reused across multiple pages** → `entities/[domain]/api/`
- **Common API utilities** → `shared/api/`

## Benefits of This Architecture

1. **Scalability**: Clear separation of concerns makes adding new features predictable
2. **Maintainability**: Dependencies flow in one direction, reducing complexity
3. **Reusability**: Shared components and utilities can be used across features
4. **Team Collaboration**: Clear boundaries help teams work independently
5. **Testing**: Each layer can be tested in isolation

## FSD CLI Usage (v2.1)

### CLI Installation
```bash
npm install -g @feature-sliced/cli
```

### Structure Generation Examples
```bash
# Generate home page slice in Pages layer with ui segment
fsd p home -s ui -r src

# Generate auth feature in Features layer
fsd f auth -s ui api model -r src

# Generate multiple segments in Shared layer
fsd s ui api lib config -r src

# Generate header widget in Widgets layer
fsd w header -s ui api -r src
```

## v2.1 Key Changes

1. **"Pages First" Approach**: Keep code that isn't reused across pages in the respective page slice
2. **Enhanced Widget Layer**: Widgets can now contain their own logic and state
3. **Cross-Import Standardization**: `@x` notation is now officially standardized
4. **Expanded Shared Layer**: Application-aware configs and constants are now allowed

## Getting Started

1. Install dependencies: `pnpm install`
2. Start development: `pnpm dev`
3. Generate structure with FSD CLI: `fsd [layer] [slice] -s [segments] -r src`
4. Develop page-specific features in `src/pages/` (Pages First approach)
5. Build shared components in `src/shared/ui/`
6. Follow the commit convention: `pnpm run commit`

## Development Tools

- **FSD CLI**: `@feature-sliced/cli` - Auto-generate layers, slices, and segments
- **Steiger**: FSD architecture linter (in development)
- **Husky**: Code quality management through git hooks
- **Commitizen**: Conventional Commits compliance