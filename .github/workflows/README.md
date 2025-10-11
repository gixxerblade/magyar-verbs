# GitHub Actions CI/CD

## Overview

This repository uses GitHub Actions for Continuous Integration (CI) to ensure code quality and prevent broken builds.

## Workflow: CI

**File**: [`.github/workflows/ci.yml`](./ci.yml)

**Triggers**:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

### Jobs

#### 1. Test and Lint Job

Runs all code quality checks in parallel:

1. **TypeScript Compilation** (`npm run tsc`)
   - Ensures no TypeScript errors
   - Validates type safety across the codebase

2. **Format Check** (`bun run biome format .`)
   - Verifies code follows consistent formatting
   - Checks indentation, quotes, semicolons, etc.

3. **Lint Check** (`npm run lint`)
   - Runs Biome linter
   - Enforces code quality rules (no magic numbers, proper imports, etc.)

4. **Unit Tests** (`npm run test`)
   - Runs all 103 unit tests
   - Tests utility functions for verb conjugation, quiz generation, flashcards, etc.

5. **Coverage Report** (`npm run test:coverage`)
   - Generates code coverage report
   - Uploads to Codecov (optional, requires CODECOV_TOKEN secret)

#### 2. Build Job

Runs after the test job passes:

1. **Production Build** (`npm run build`)
   - Compiles TypeScript
   - Builds optimized production bundle with Vite
   - Ensures the app can be successfully deployed

2. **Build Verification**
   - Checks that the `dist` directory was created
   - Validates build artifacts exist

## Setup Instructions

### 1. Enable GitHub Actions

GitHub Actions is automatically enabled for all repositories. No setup required!

### 2. Optional: Codecov Integration

To enable code coverage reporting:

1. Sign up at [codecov.io](https://codecov.io)
2. Connect your GitHub repository
3. Get your Codecov token
4. Add it as a repository secret:
   - Go to Repository Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `CODECOV_TOKEN`
   - Value: Your Codecov token

If you don't want Codecov integration, the workflow will still run successfully (coverage upload is set to `fail_ci_if_error: false`).

### 3. Update README Badges ✅

The README badges have been configured with your GitHub username (`gixxerblade`):

```markdown
[![CI](https://github.com/gixxerblade/magyar-verbs/actions/workflows/ci.yml/badge.svg)](https://github.com/gixxerblade/magyar-verbs/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/gixxerblade/magyar-verbs/branch/main/graph/badge.svg)](https://codecov.io/gh/gixxerblade/magyar-verbs)
```

## Local Development

Before pushing code, run all checks locally:

```bash
# Run all checks at once
npm run tsc && npm run lint && npm run test && npm run build

# Or run individually
npm run tsc        # TypeScript check
npm run lint       # Biome lint
npm run test       # Unit tests
npm run build      # Production build
```

## CI Requirements

For the CI pipeline to pass, all of the following must succeed:

- ✅ TypeScript compilation with zero errors
- ✅ Biome format check (all files properly formatted)
- ✅ Biome lint check (zero lint errors)
- ✅ All 103 unit tests passing
- ✅ Production build completes successfully
- ✅ Build artifacts (dist directory) created

## Troubleshooting

### CI Fails on TypeScript Check

**Fix**: Run `npm run tsc` locally and fix all type errors.

### CI Fails on Format Check

**Fix**: Run `npm run format` to auto-format all files.

### CI Fails on Lint Check

**Fix**: Run `npm run check` to auto-fix most issues, then manually fix remaining errors.

### CI Fails on Tests

**Fix**: Run `npm run test` locally to see which tests are failing and fix them.

### CI Fails on Build

**Fix**: Run `npm run build` locally and fix any build errors (usually TypeScript or missing dependencies).

## Branch Protection (Recommended)

To enforce CI checks before merging:

1. Go to Repository Settings → Branches
2. Add a branch protection rule for `main`
3. Enable "Require status checks to pass before merging"
4. Select the CI workflow jobs:
   - Test and Lint
   - Build Check

This prevents merging pull requests with failing tests or broken builds.

## Performance

The CI pipeline typically completes in **2-4 minutes**:

- Test and Lint: ~1-2 minutes
- Build Check: ~1-2 minutes

Jobs run in parallel when possible to minimize wait time.

## Cost

GitHub Actions is **free** for public repositories with generous limits:

- **Public repos**: Unlimited minutes
- **Private repos**: 2,000 minutes/month free (more than enough for this project)

The build step is just compilation and bundling (Vite), not deployment, so there are **no deployment costs**.
