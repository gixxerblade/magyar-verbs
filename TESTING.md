# Testing Documentation

## Overview

This project now includes comprehensive unit tests for core utility functions using Vitest and Testing Library.

## Test Coverage

## Running Tests

### Available Commands

```bash
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

### Code Quality Commands

```bash
# Run all quality checks (format, lint, tsc)
npm run check

# Run individual checks
npm run format    # Format code with Biome
npm run lint      # Lint code with Biome
npm run tsc       # TypeScript type checking
npm run build     # Full production build
```

## Test Configuration

### Vitest Configuration

Location: [src/__tests__/vitest.config.ts](src/__tests__/vitest.config.ts)

- **Environment**: Node (for pure utility function testing)
- **Globals**: Enabled for easier test writing
- **Coverage Provider**: v8
- **Coverage Reports**: text, json, html

### Biome Configuration

Test files are configured to allow magic numbers (common in test data):

```json
{
  "includes": ["**/*.test.ts", "**/*.test.tsx", "**/__tests__/**"],
  "linter": {
    "rules": {
      "style": {
        "noMagicNumbers": "off"
      }
    }
  }
}
```

## Test Structure

All tests follow this pattern:

1. **Arrange**: Set up test data and dependencies
2. **Act**: Execute the function being tested
3. **Assert**: Verify the expected outcome

Example:

```typescript
it('should conjugate back harmony verb for én', () => {
  // Arrange
  const backVerbEntry: VerbEntry = {
    infinitive: 'tanulni',
    stem: 'tanul',
    english: 'to learn',
    harmony: 'back',
  };

  // Act
  const result = buildConjugation(backVerbEntry, 'én');

  // Assert
  expect(result).toBe('tanulok');
});
```

## Key Testing Patterns

### Testing Random Functions

Functions that use randomness are tested for:
- Correct data types and structure
- Valid values from expected sets
- Distribution over multiple iterations

```typescript
it('should return items with roughly equal distribution', () => {
  const items = ['a', 'b', 'c'] as const;
  const counts = { a: 0, b: 0, c: 0 };
  const iterations = 300;

  for (let i = 0; i < iterations; i += 1) {
    const result = randomItem(items);
    counts[result] += 1;
  }

  const minExpected = iterations * 0.2;
  expect(counts.a).toBeGreaterThan(minExpected);
  expect(counts.b).toBeGreaterThan(minExpected);
  expect(counts.c).toBeGreaterThan(minExpected);
});
```

### Testing Array Mutations

Functions that transform arrays are tested to ensure:
- Original arrays are not mutated
- Output contains expected elements
- Array length is preserved

```typescript
it('should not modify original array', () => {
  const items = [1, 2, 3, 4, 5];
  const original = [...items];
  shuffle(items);
  expect(items).toEqual(original);
});
```

### Testing Conjugation Logic

Verb conjugation is tested for:
- All pronouns (én, te, ő, mi, ti, ők)
- All harmony types (back, front, mixed)
- Proper ending application
- Hyphen removal

```typescript
it('should conjugate back harmony verb for mi', () => {
  const result = buildConjugation(backVerbEntry, 'mi');
  expect(result).toBe('tanulunk');
});
```

## Continuous Integration

Before committing code, ensure all checks pass:

```bash
npm run test      # All tests must pass
npm run tsc       # No TypeScript errors
npm run lint      # No linting errors
npm run build     # Production build succeeds
```

## Adding New Tests

When adding new utility functions:

1. Create a test file in `src/__tests__/utils/`
2. Use descriptive `describe` and `it` blocks
3. Test edge cases (empty arrays, null values, etc.)
4. Test error conditions when applicable
5. Ensure no magic numbers (use constants)
6. Run `npm run check` before committing

## Test Best Practices

1. **Descriptive test names**: Use full sentences that explain what is being tested
2. **One assertion per test**: Focus each test on a single behavior
3. **Test data**: Use realistic test data that represents actual use cases
4. **Constants**: Define test constants at the top of describe blocks
5. **Coverage**: Aim for comprehensive coverage of all code paths

## Future Testing Considerations

Areas that could benefit from additional testing:

- **React Components**: Add component tests using Testing Library
- **Integration Tests**: Test interactions between multiple modules
- **E2E Tests**: Test complete user workflows
- **Firebase Integration**: Mock Firebase calls for testing hooks
- **TanStack Query**: Test data fetching and caching behavior
