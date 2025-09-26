# Feature-Sliced Design v2.1 Architecture Rules

## Project Architecture

This project follows **Feature-Sliced Design (FSD) v2.1** with Next.js App Router.

### Directory Structure

```
├── app/                    # Next.js App Router (routing only)
├── pages/                  # Next.js compatibility stub
├── src/
│   ├── app/               # FSD app layer (providers, global styles)
│   ├── pages/             # FSD pages layer ("Pages First" approach)
│   ├── widgets/           # Enhanced widgets (own logic/state/API)
│   ├── features/          # Reusable business features
│   ├── entities/          # Business domain entities
│   └── shared/            # Expanded shared layer
│       ├── ui/            # Shared UI components
│       ├── lib/           # Utility functions
│       ├── api/           # API utilities
│       └── config/        # Application configs
```

## FSD v2.1 Key Rules

### 1. Pages First Approach
- Keep page-specific code that isn't reused in the page slice
- Large UI blocks, forms, and data logic specific to one page stay in `pages/[page]/`

### 2. API Organization Rules

#### Use `pages/[page]/api/` when:
- API is used ONLY on that specific page
- Example: Home page banner, page-specific stats, unique page data

```typescript
// ✅ Correct - Home page only
// src/pages/home/api/getHomeData.ts
export async function getHomeBanner() {
  return fetch('/api/banner/home')
}
```

#### Use `entities/[domain]/api/` when:
- API is reused across multiple pages
- Domain-specific operations (user, post, product, etc.)

```typescript
// ✅ Correct - Used in detail, edit, preview pages
// src/entities/post/api/postApi.ts
export async function getPostById(id: string) {
  return fetch(`/api/posts/${id}`)
}
```

#### Use `shared/api/` when:
- Common API utilities and configurations
- HTTP clients, interceptors, base configurations

```typescript
// ✅ Correct - Used across all API calls
// src/shared/api/client.ts
export const apiClient = {
  get: (url: string) => fetch(url)
}
```

### 3. Import Rules
- Higher layers can import from lower layers only
- Use `@/*` alias for imports from `src/`
- Cross-imports use `@x` notation (standardized in v2.1)

### 4. Widget Enhancement (v2.1)
- Widgets can now contain their own stores and business logic
- Not just compositional components anymore

### 5. Expanded Shared Layer (v2.1)
- Application-aware configs are now allowed in shared
- Route constants, API endpoints, company assets are permitted

## Decision Framework

### API Placement Decision Tree
1. **Ask**: "Will this API be used on other pages?"
   - **No** → Place in `pages/[page]/api/`
   - **Yes** → Continue to step 2

2. **Ask**: "Is this domain-specific business logic?"
   - **Yes** → Place in `entities/[domain]/api/`
   - **No** → Place in `shared/api/`

### Component Placement
1. **Ask**: "Is this component used only on this page?"
   - **Yes** → Place in `pages/[page]/ui/`
   - **No** → Continue to step 2

2. **Ask**: "Is this a large, self-contained feature?"
   - **Yes** → Place in `widgets/[widget-name]/`
   - **No** → Continue to step 3

3. **Ask**: "Is this business feature logic?"
   - **Yes** → Place in `features/[feature-name]/`
   - **No** → Place in `shared/ui/`

## Naming Conventions
- Directories: `kebab-case`
- React components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Constants: `UPPER_CASE.ts`

## Technology Stack
- **Framework**: Next.js 15.5.3 with App Router and Turbopack
- **Runtime**: React 19.1.0
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Animation**: Framer Motion 12.23.15
- **Architecture**: Feature-Sliced Design v2.1

## Commands
- Generate structure: `fsd [layer] [slice] -s [segments] -r src`
- Development: `pnpm dev`
- Build: `pnpm build`
- Commit: `pnpm run commit` (uses Conventional Commits)

## Critical Reminders
- Always follow the "Pages First" principle
- Question reusability before placing components/APIs
- Respect the dependency direction (higher → lower layers)
- Use FSD CLI for consistent structure generation