import { createQueryKeyStore } from '@lukemorales/query-key-factory';

export const queryKeys = createQueryKeyStore({
  auth: {
    user: null,
  },
  vocabulary: {
    all: null,
  },
  customVerbs: {
    all: null,
  },
});
