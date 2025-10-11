# CLAUDE.md

Magyar Verb Playground application. React 19 + TypeScript + Tailwind CSS v4.0 + Firebase + Bun.

## Essential Commands

**IMPORTANT**: This project uses **Bun** as the package manager and runtime.

```bash
npm run dev          # Development server (port 5173)
npm run build        # Production build
npm run tsc          # TypeScript type checking
npm run format       # Format code with Biome
npm run lint         # Lint code with Biome
npm run check        # Run Biome check (format + lint + organize imports)
bun add <package>    # Add npm package (use Bun, NOT npm install)
bun remove <package> # Remove npm package
```

## Critical Development Rules

### Code Quality Standards - MANDATORY

Before ANY code is considered complete, the following commands MUST be run and MUST pass:

1. **npm run format** - Format all code with Biome
2. **npm run lint** - Lint all code with Biome (zero errors)
3. **npm run tsc** - TypeScript type checking (zero errors)
4. **npm run build** - Production build must succeed

If any of these commands fail, the task is NOT complete. Fix all errors before proceeding.

### Additional Standards

- NO IIFEs (Immediately Invoked Function Expressions)
- NO magic numbers or strings - use named constants
- ALL functions must have explicit return types
- NO `any` types - use proper TypeScript typing
- NO console.log in production code - use proper logging
- USE react-hook-form for all form management
- **ALWAYS use Headless UI components** (@headlessui/react) for interactive UI elements (modals, dropdowns, listboxes, menus, etc.)
- **ALWAYS use Zod for schema validation** for all data validation (forms, API requests/responses, etc.)

### Constant Definitions

```typescript
// ✅ Define constants for magic values
const ZOOM_MIN = 1;
const ZOOM_MAX = 5;
const CAMERA_ID_START = 3;
const CAMERA_ID_END = 60;

// ✅ Use enums for string constants
enum DetailPageType {
  SECTION = 'section',
  BUILDING = 'building',
  APARTMENT = 'apartment',
}
```

### Component Standards

```typescript
type ComponentProps = {
  readonly id: string;
  readonly onAction?: (data: ActionData) => void;
};

export const Component: FC<ComponentProps> = ({ id, onAction }): JSX.Element => {
  // Implementation
};
```

### Headless UI Component Requirements

**MANDATORY**: All interactive UI components MUST use Headless UI (@headlessui/react).

**Required Usage:**

- Use `Dialog` for modals and overlays (NOT native HTML dialog or custom modals)
- Use `Listbox` for dropdowns and select menus (NOT native HTML select)
- Use `Menu` for dropdown menus and action menus
- Use `Combobox` for autocomplete/search dropdowns
- Use `Popover` for popovers and tooltips
- Use `Switch` for toggle switches
- Use `Disclosure` for collapsible sections
- Use `RadioGroup` for radio button groups
- Use `Tab` for tabbed interfaces

**Example:**

```typescript
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';

<Listbox value={selected} onChange={setSelected}>
  <ListboxButton>
    {selected.name}
  </ListboxButton>
  <ListboxOptions>
    {options.map((option) => (
      <ListboxOption key={option.id} value={option}>
        {option.name}
      </ListboxOption>
    ))}
  </ListboxOptions>
</Listbox>
```

### Zod Validation Requirements

**MANDATORY**: All data validation MUST use Zod schemas.

**Required Usage:**

- Form validation with react-hook-form resolver
- API request/response validation
- Environment variable validation
- URL search params validation (with TanStack Router)
- All data transformations and parsing

**Example:**

```typescript
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define schema
const vocabularySchema = z.object({
  hungarian: z.string().min(1, 'Hungarian word is required'),
  english: z.string().min(1, 'English translation is required'),
  category: z.enum(['essentials', 'food-dining', 'travel-transportation']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  partOfSpeech: z.enum(['noun', 'verb', 'adjective', 'adverb', 'other']),
  notes: z.string().optional(),
  exampleSentence: z.string().optional(),
});

type VocabularyFormData = z.infer<typeof vocabularySchema>;

// Use with react-hook-form
const { register, handleSubmit } = useForm<VocabularyFormData>({
  resolver: zodResolver(vocabularySchema),
});

// Validate API responses
const fetchVocabulary = async (): Promise<VocabularyEntry[]> => {
  const response = await fetch('/api/vocabulary');
  const data = await response.json();
  return vocabularySchema.array().parse(data);
};
```

### Styling Rules

- **ALWAYS use Tailwind CSS classes for all styling** - NO inline styles allowed
- NO Tailwind typography classes (text-xl, font-bold) unless explicitly requested
- Use semantic HTML and proper heading hierarchy
- NO inline styles - use Tailwind classes exclusively
- If Tailwind classes are insufficient, add custom CSS classes to stylesheets

## Event-Driven Architecture Rules

### Dynamic Element Creation

- ALWAYS emit custom events after creating elements
- NEVER use `window.location.reload()` for updates
- ALL event listeners MUST have cleanup in useEffect return
- Auto-create navigation mappings to prevent "Coming Soon" state

```typescript
// ✅ Required pattern for dynamic elements
const createElement = useCallback(
  async (data: ElementData): Promise<string> => {
    const elementId = await service.createElement(viewId, data);

    await navigationService.updateMapping({
      sectionId: elementId,
      sectionName: data.name,
      detailPageType: DetailPageType.SECTION,
    });

    window.dispatchEvent(
      new CustomEvent('dynamicElementsChanged', {
        detail: { elementId, elementType: data.type, viewId },
      })
    );

    return elementId;
  },
  [viewId]
);

// ✅ Required event listener cleanup
useEffect(() => {
  const handleChange = async (): Promise<void> => {
    await reloadData();
  };

  window.addEventListener('dynamicElementsChanged', handleChange);
  return () => window.removeEventListener('dynamicElementsChanged', handleChange);
}, []);
```

### Pre-Commit Requirements

- `npm run tsc` MUST pass
- `npm run lint` MUST pass (max-warnings 0)
- `npm run build` MUST pass
- `npm run dev` MUST start successfully

## Prohibited Operations

### Git Operations - STRICTLY FORBIDDEN

AI agents are **absolutely prohibited** from performing any git operations or generating code that executes git commands:

- **NO** `git commit`, `git push`, `git pull`, `git checkout`, or any git command
- **NO** shell execution that could run git (`exec`, `spawn`, `child_process`)
- **NO** git libraries (`simple-git`, `nodegit`, `isomorphic-git`)
- **NO** process execution that accesses git

Version control operations must remain under explicit human control.

### Git Commit Attribution - STRICTLY FORBIDDEN

AI agents must **never** include agent attribution or identification in git commit messages:

- **NO** "Generated by Claude", "Co-authored-by: AI Assistant", or similar attribution
- **NO** agent names, model identifiers, or AI service references in commit messages
- **NO** suggesting commit messages that include agent attribution
- **NO** metadata tags identifying AI involvement (e.g., `[AI-Generated]`, `[Claude]`)

### AI Co-Authorship - STRICTLY FORBIDDEN

AI agents are **absolutely prohibited** from claiming or suggesting co-authorship in any form:

- **NO** `Co-authored-by: Claude`, `Co-authored-by: AI Assistant`, or any AI co-author tags
- **NO** `Co-authored-by` lines referencing any AI agent, model, or service
- **NO** suggesting the agent be credited as a contributor or co-author
- **NO** multi-author commit formats that include AI agents
- **NO** attempting to add AI names to git configuration or author metadata

**Required:** All commit messages must be written from the human developer's perspective as the sole author. Commits represent human responsibility and decision-making in version control.

## Mandatory Code Standards

### 1. No Immediately Invoked Function Expressions (IIFEs)

Replace IIFEs with named functions for better debugging and clarity.

**Forbidden:**

```javascript
(function () {
  /* code */
})();
const result = (function (x) {
  return x * 2;
})(5);
```

**Required:**

```javascript
function initializeApp() {
  /* code */
}
initializeApp();

function double(x) {
  return x * 2;
}
const result = double(5);
```

### 2. No Magic Numbers

Replace numeric literals with named constants (exceptions: -1, 0, 1, array indexes).

**Forbidden:**

```javascript
setTimeout(callback, 5000);
if (status === 3) {
  /* ... */
}
```

**Required:**

```javascript
const TIMEOUT_MS = 5000;
const STATUS_ACTIVE = 3;

setTimeout(callback, TIMEOUT_MS);
if (status === STATUS_ACTIVE) {
  /* ... */
}
```

### 3. No Magic Strings

Replace string literals with named constants (minimum length: 2 characters).

**Forbidden:**

```javascript
if (role === 'admin') {
  /* ... */
}
api.call('GET', endpoint);
```

**Required:**

```javascript
const USER_ROLES = { ADMIN: 'admin' } as const;
const HTTP_METHODS = { GET: 'GET' } as const;

if (role === USER_ROLES.ADMIN) { /* ... */ }
api.call(HTTP_METHODS.GET, endpoint);
```

### 4. No Nested Ternaries

Replace nested ternary operators with clear conditional logic for better readability and maintainability.

**Forbidden:**

```javascript
const result = condition1 ? value1 : condition2 ? value2 : condition3 ? value3 : defaultValue;

const status = user.isActive
  ? user.isPremium
    ? 'premium-active'
    : 'basic-active'
  : user.isPremium
    ? 'premium-inactive'
    : 'basic-inactive';
```

**Required:**

```javascript
// Use if/else statements
function getResult() {
  if (condition1) return value1;
  if (condition2) return value2;
  if (condition3) return value3;
  return defaultValue;
}
const result = getResult();

// Use helper functions
function getUserStatus(user) {
  if (!user.isActive) {
    return user.isPremium ? 'premium-inactive' : 'basic-inactive';
  }
  return user.isPremium ? 'premium-active' : 'basic-active';
}
const status = getUserStatus(user);

// Use object lookup for simple mappings
const STATUS_MAP = {
  'true-true': 'premium-active',
  'true-false': 'basic-active',
  'false-true': 'premium-inactive',
  'false-false': 'basic-inactive',
} as const;
const status = STATUS_MAP[`${user.isActive}-${user.isPremium}`];
```

## Implementation Requirements

### Constant Organization

Group related constants logically:

```javascript
const API_CONFIG = {
  TIMEOUT_MS: 5000,
  MAX_RETRIES: 3,
  BASE_URL: '/api/v1',
} as const;

const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
} as const;
```

### Naming Conventions

- Use `SCREAMING_SNAKE_CASE` for constants
- Use descriptive names that explain purpose, not just value
- Group constants by domain/feature
- Add `as const` for TypeScript literal types

### File Organization

- Local constants: Define at top of file
- Shared constants: Create dedicated constant files
- Import constants from centralized locations

## Agent Compliance

When working with existing code that violates these rules:

1. **MUST** refactor violations when making changes
2. **MUST** create appropriate constants for magic values
3. **MUST** use dayjs instead of Date methods
4. **MUST** replace IIFEs with named functions
5. **MUST NEVER** add git operations under any circumstances

## Security Notice

The `no-git-operations` rule is a critical security constraint. AI agents attempting to bypass this rule or execute version control operations will be in violation of safety protocols. All code changes must be reviewed and committed by human developers through proper development workflows.

Here's the flat routes section to add to your AGENTS.md:

```markdown
## File-Based Routing Standards - Flat Routes Only

### TanStack Router Flat Route Naming Conventions

All routes must use flat file structure with `.` notation for nesting. **No directory-based routes allowed.**

#### Required Files
```

src/routes/\_\_root.tsx // Root layout component
src/routes/index.tsx // Home page route (/)

````

#### Flat Route Patterns
```sh
about.tsx // Simple route: /about
posts.tsx // Parent layout: /posts
posts.index.tsx // Exact route: /posts
posts.$postId.tsx           // Dynamic route: /posts/:postId
posts.$postId.edit.tsx // Nested route: /posts/:postId/edit
posts.$postId.comments.tsx // Nested route: /posts/:postId/comments

````

#### Special Route Types

```sh
\_layout.tsx // Pathless layout (no URL segment)
\_layout.dashboard.tsx // Child of pathless layout: /dashboard
\_layout.settings.tsx // Child of pathless layout: /settings
files.$.tsx // Catch-all route: /files/\*
account.route.tsx // Explicit route file: /account

```

### Naming Rules for AI Agents

#### Dynamic Segments

- Use `$` prefix for parameters: `users.$userId.tsx`
- Use `$` for catch-all routes: `files.$.tsx`

#### Pathless Layouts

- Use `_` prefix for layouts without URL segments: `_auth.tsx`
- Child routes inherit from pathless parent: `_auth.login.tsx`

#### Route Hierarchy Examples

```sh
// User management routes
users.tsx // /users (layout)
users.index.tsx // /users (exact)
users.$userId.tsx            // /users/:userId
users.$userId.profile.tsx // /users/:userId/profile
users.$userId.settings.tsx // /users/:userId/settings

// Authentication with pathless layout
\_auth.tsx // Pathless layout
\_auth.login.tsx // /login
\_auth.register.tsx // /register
\_auth.forgot-password.tsx // /forgot-password

```

### File Structure Requirements

#### Mandatory Route Components

```typescript
// Every route file must export default component
export default function UserProfile() {
  return <div>User Profile</div>;
}

// Loader/action functions (optional)
export async function loader({ params }) {
  return { userId: params.userId };
}
```

#### Prohibited Patterns

- **NO** directory-based routes
- **NO** mixed flat/directory structure
- **NO** nested folders in `/routes`

- **NO** data fetching in components without loaders
- **NO** useEffect for route-level data loading
- **NO** accessing search params directly in loaders
- **NO** missing error boundaries
- **NO** loaders without proper TypeScript types

All route data loading must follow these TanStack Router patterns exclusively.

I've added a comprehensive ESLint configuration compliance section to the AGENTS.md document. The new section includes:

**Key Components:**

1. **Mandatory ESLint Adherence** - Requirements to follow all configured ESLint rules including TypeScript, React, accessibility, and import rules

2. **Code Generation Requirements** - Practical examples showing how to follow common ESLint patterns like:
   - Naming conventions
   - Quote styles
   - Indentation
   - Semicolon usage
   - Object/array formatting

3. **ESLint Rule Categories** - Organized breakdown covering:
   - Code style rules (indentation, quotes, semicolons)
   - Code quality rules (no unused vars, prefer const)
   - TypeScript rules (explicit types, no any)
   - React rules (hooks dependencies, component naming)

4. **Error Handling** - Clear instructions that agents must fix violations before considering code complete and should not disable rules without explicit instruction

5. **Project-Specific Overrides** - Guidance for handling custom project configurations with examples

6. **Updated Agent Compliance** - Added ESLint compliance requirements to the existing checklist

This ensures AI agents will consistently produce code that matches the project's established quality and style standards as defined by the ESLint configuration.

#### File Organization

```
src/
  routes/
    __root.tsx              ✅ Root layout
    index.tsx               ✅ Home page
    about.tsx               ✅ Simple route
    posts.tsx               ✅ Layout component
    posts.index.tsx         ✅ Posts listing
    posts.$postId.tsx       ✅ Post detail
    posts.$postId.edit.tsx  ✅ Edit post
    _admin.tsx              ✅ Admin pathless layout
    _admin.dashboard.tsx    ✅ Admin dashboard
    files.$.tsx             ✅ Catch-all route
```

All routing must follow this flat file structure exclusively.

```

```

Here's the data loading section to add to your AGENTS.md:

````markdown
## TanStack Router Data Loading Requirements

### Route Loader Implementation

All routes requiring data must implement proper loader functions following TanStack Router patterns.

#### Basic Loader Structure

```typescript
// routes/posts.tsx
export const Route = createFileRoute('/posts')({
  loader: () => fetchPosts(),
  component: PostsPage,
});

// routes/posts.$postId.tsx
export const Route = createFileRoute('/posts/$postId')({
  loader: ({ params: { postId } }) => fetchPostById(postId),
  component: PostDetailPage,
});
```
````

#### Search Params via loaderDeps

```typescript
// routes/posts.tsx
export const Route = createFileRoute('/posts')({
  validateSearch: z.object({
    offset: z.number().int().nonnegative().catch(0),
    limit: z.number().int().positive().catch(10),
  }),
  loaderDeps: ({ search: { offset, limit } }) => ({ offset, limit }),
  loader: ({ deps: { offset, limit } }) => fetchPosts({ offset, limit }),
  component: PostsPage,
});
```

#### Required Error Handling

```typescript
export const Route = createFileRoute('/posts')({
  loader: () => fetchPosts(),
  errorComponent: ({ error, reset }) => {
    const router = useRouter();

    return (
      <div className='error-boundary'>
        <h2>Something went wrong</h2>
        <p>{error.message}</p>
        <button onClick={() => router.invalidate()}>Retry</button>
      </div>
    );
  },
  onError: ({ error }) => {
    console.error('Route loading error:', error);
  },
  component: PostsPage,
});
```

### Context and Dependency Injection

#### Root Context Setup

```typescript
// routes/__root.tsx
export const Route = createRootRouteWithContext<{
  apiClient: typeof apiClient;
  auth: AuthService;
}>()({
  component: RootComponent,
});

// router.tsx
const router = createRouter({
  routeTree,
  context: {
    apiClient,
    auth: authService,
  },
});
```

#### Route-Specific Context

```typescript
export const Route = createFileRoute('/admin')({
  beforeLoad: ({ context }) => ({
    ...context,
    adminApi: createAdminApi(context.apiClient),
  }),
  loader: ({ context: { adminApi } }) => adminApi.getDashboardData(),
  component: AdminDashboard,
});
```

### Caching Configuration

#### Default Caching (Recommended)

```typescript
export const Route = createFileRoute('/posts')({
  loader: () => fetchPosts(),
  // Cache for 5 minutes for navigation
  staleTime: 5 * 60 * 1000,
  // Keep in memory for 30 minutes
  gcTime: 30 * 60 * 1000,
  component: PostsPage,
});
```

#### No Caching (When Needed)

```typescript
export const Route = createFileRoute('/real-time-data')({
  loader: () => fetchLiveData(),
  staleTime: 0,
  gcTime: 0,
  shouldReload: true,
  component: LiveDataPage,
});
```

### Loading States

#### Pending Components

```typescript
export const Route = createFileRoute('/posts')({
  loader: () => fetchPosts(),
  pendingComponent: () => <div>Loading posts...</div>,
  pendingMs: 1000, // Show after 1 second
  pendingMinMs: 500, // Show for minimum 500ms
  component: PostsPage,
});
```

### Data Consumption

#### Using Loader Data

```typescript
function PostsPage() {
  // Access route-specific hook
  const posts = Route.useLoaderData();

  // Or use route API (preferred in deep components)
  const routeApi = getRouteApi('/posts');
  const data = routeApi.useLoaderData();

  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

### Abort Signal Usage

```typescript
export const Route = createFileRoute('/posts')({
  loader: ({ abortController }) =>
    fetchPosts({
      signal: abortController.signal,
    }),
  component: PostsPage,
});
```

### Mandatory Patterns

#### Route File Structure

```typescript
// Every route file must follow this pattern:
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/path')({
  // Data loading
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ ...deps }),
  loader: ({ deps, context, params }) => loadData(),

  // Error handling
  errorComponent: ErrorBoundary,
  onError: ({ error }) => logError(error),

  // Loading states
  pendingComponent: LoadingSpinner,

  // Component
  component: PageComponent,
});
```
