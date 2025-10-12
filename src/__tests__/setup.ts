import '@testing-library/jest-dom';
import {cleanup} from '@testing-library/react';
import {afterEach, vi} from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock environment variables for tests
vi.mock('import.meta', () => ({
  env: {
    VITE_AUTHORIZED_EMAILS: 'test@example.com,admin@example.com',
  },
}));
