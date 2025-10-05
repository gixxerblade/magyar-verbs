# Magyar Verb Playground

An interactive web application for learning Hungarian (Magyar) verb conjugation, focusing on the indefinite present tense for verbs that don't require connecting vowels.

## Features

- **Reference Guide**: Browse comprehensive conjugation patterns and endings for different vowel harmony types (back, front, mixed)
- **Verb Lab**: Experiment with a library of 48+ Hungarian verbs and see their conjugations across all pronouns (én, te, ő, mi, ti, ők)
- **Quick Quiz**: Test your knowledge by conjugating random verbs with immediate feedback
- **Harmony Drill**: Practice identifying vowel harmony patterns in Hungarian verbs

## Vowel Harmony

Hungarian verbs follow vowel harmony rules that determine which endings to use:

- **Back harmony**: Verbs with back vowels (a, á, o, ó, u, ú) use endings like -ok, -sz, -unk, -tok, -nak
- **Front harmony**: Verbs with front vowels (e, é, i, í) use endings like -ek, -sz, -ünk, -tek, -nek
- **Mixed harmony**: Special verbs (containing ö, ő, ü, ű) use endings like -ök, -sz, -ünk, -tök, -nek

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and building
- **TanStack Router** for type-safe routing
- **Tailwind CSS** for styling
- **Headless UI** for accessible components
- **Heroicons** for icons

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or bun

### Installation

```bash
# Install dependencies
npm install
# or
bun install
```

### Development

```bash
# Start development server
npm run dev
# or
bun dev
```

Visit `http://localhost:5173` to view the app.

### Build

```bash
# Build for production
npm run build
# or
bun run build

# Preview production build
npm run preview
# or
bun preview
```

## Project Structure

```text
src/
├── data/
│   └── conjugation.ts    # Verb data and conjugation patterns
├── pages/                # Page components
│   ├── reference.tsx
│   ├── verb-lab.tsx
│   ├── quiz.tsx
│   └── harmony-drill.tsx
├── routes/               # TanStack Router routes
├── types.ts              # TypeScript types
└── main.tsx              # Application entry point
```

## License

This project is open source and available under the MIT License.
