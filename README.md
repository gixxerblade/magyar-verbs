# Magyar Learning Playground

An interactive web application for learning Hungarian (Magyar) language, featuring verb conjugation practice, vocabulary building, and flashcards. Master Hungarian verb patterns, vowel harmony, and essential vocabulary through engaging exercises and drills.

## Features

### Core Learning Tools

- **Reference Guide**: Browse comprehensive conjugation patterns and endings for different vowel harmony types (back, front, mixed)
- **Verb Lab**: Experiment with a library of 48+ Hungarian verbs and see their conjugations across all pronouns (én, te, ő, mi, ti, ők)
- **Quick Quiz**: Test your knowledge by conjugating random verbs with immediate feedback
- **Harmony Drill**: Practice identifying vowel harmony patterns in Hungarian verbs

### Vocabulary Features

- **Flashcards**: Interactive flashcard system for learning Hungarian vocabulary with spaced repetition
  - Filter by category (essentials, food & dining, travel & transportation)
  - Filter by difficulty level (beginner, intermediate, advanced)
  - Filter by part of speech (noun, verb, adjective, adverb)
  - Track your progress with known/unknown cards

- **Vocabulary Practice**: Practice mode for testing your vocabulary knowledge with instant feedback

### Authenticated Features

When logged in with Firebase Authentication, users can access:

- **Vocabulary Manager**: Create, edit, and manage your own custom vocabulary entries
  - Add custom Hungarian words with English translations
  - Categorize by topic and difficulty
  - Add example sentences and notes

- **Custom Verbs**: Create and manage your own custom verb entries for personalized practice

## Hungarian Language Concepts

### Vowel Harmony

Hungarian verbs follow vowel harmony rules that determine which endings to use:

- **Back harmony**: Verbs with back vowels (a, á, o, ó, u, ú) use endings like -ok, -sz, -unk, -tok, -nak
- **Front harmony**: Verbs with front vowels (e, é, i, í) use endings like -ek, -sz, -ünk, -tek, -nek
- **Mixed harmony**: Special verbs (containing ö, ő, ü, ű) use endings like -ök, -sz, -ünk, -tök, -nek

### Conjugation Focus

The application focuses on the indefinite present tense conjugation for Hungarian verbs that do not require connecting vowels, making it ideal for beginners learning fundamental conjugation patterns.

## Tech Stack

### Frontend Framework & Libraries

- **React 19** with TypeScript for type-safe component development
- **Vite** for fast development and optimized production builds
- **TanStack Router** (v1.132+) for type-safe, file-based routing with flat route structure
- **TanStack Query** (v5.90+) for server state management and data caching
- **Tailwind CSS v4.0** for utility-first styling
- **Headless UI** (@headlessui/react) for accessible, unstyled UI components
- **Heroicons** for consistent iconography
- **React Hook Form** with Zod validation for type-safe form handling

### Backend & Data

- **Firebase** (v12.4+) for authentication and Firestore database
- Custom verb and vocabulary data management with real-time updates

### Development Tools

- **Bun** as package manager and runtime (recommended)
- **TypeScript** (v5.2+) with strict type checking
- **Biome** for code formatting and linting (replaces ESLint + Prettier)
- **Vite SWC** plugin for fast React refresh

### Code Quality Standards

This project follows strict code quality standards:

- Zero TypeScript errors required
- Zero lint errors required
- Consistent code formatting with Biome
- Explicit return types on all functions
- No magic numbers or strings
- Zod schemas for all data validation
- React Hook Form for all form management
- Headless UI for all interactive components

## Getting Started

### Prerequisites

- **Bun** (recommended) or Node.js v18+
- A Firebase project (for authentication and database features)

### Installation

```bash
# Install dependencies (recommended)
bun install

# Or with npm
npm install
```

### Environment Setup

Create a `.env` file in the project root with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Note**: Never commit the `.env` file to version control. It's included in `.gitignore`.

### Development

```bash
# Start development server (port 5173)
npm run dev

# Or with bun
bun dev
```

Visit `http://localhost:5173` to view the app.

### Code Quality Commands

```bash
# Format code with Biome
npm run format

# Lint code with Biome
npm run lint

# Run all checks (format + lint + organize imports)
npm run check

# TypeScript type checking
npm run tsc
```

**Important**: All of these commands must pass before committing code.

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Routing Architecture

This project uses **TanStack Router** with a flat file-based routing structure:

- All routes are in `src/routes/` using dot notation for nesting
- `__root.tsx` provides the root layout
- `_auth.tsx` is a pathless layout for protected routes
- Route files like `_auth.vocabulary.tsx` inherit from pathless layouts
- Type-safe route parameters and search params with Zod validation

## State Management

- **TanStack Query** for server state, data fetching, and caching
- **React Hook Form** with Zod resolvers for form state
- **Firebase Firestore** for persistent data storage
- Query key factories for consistent cache management

## Authentication

Firebase Authentication is used for user management:

- Sign in with Google (or other configured providers)
- Protected routes require authentication
- User-specific data stored in Firestore
- Automatic redirection for unauthorized access

## Contributing

When contributing to this project:

1. Read [CLAUDE.md](./CLAUDE.md) for comprehensive development guidelines
2. Ensure all code quality commands pass (`npm run check`, `npm run tsc`)
3. Follow the established patterns (Headless UI, Zod validation, React Hook Form)
4. Use Bun for package management (`bun add <package>`)
5. Never commit secrets or environment variables

## Development Philosophy

This project emphasizes:

- **Type safety**: Strict TypeScript with explicit types
- **Code quality**: Zero tolerance for lint/type errors
- **Consistency**: Standardized patterns for forms, validation, and UI
- **Accessibility**: Headless UI components for WCAG compliance
- **Performance**: Optimized builds, code splitting, and efficient caching

## License

This project is open source and available under the MIT License.
