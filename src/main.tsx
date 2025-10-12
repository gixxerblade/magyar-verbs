import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {createRouter, RouterProvider} from '@tanstack/react-router';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {routeTree} from './routeTree.gen';
import './index.css';

// Query cache configuration - Time constants
const SECONDS_PER_MINUTE = 60;
const MILLISECONDS_PER_SECOND = 1000;
const FIVE_MINUTE_COUNT = 5;
const TEN_MINUTE_COUNT = 10;
const FIVE_MINUTES = FIVE_MINUTE_COUNT * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND;
const TEN_MINUTES = TEN_MINUTE_COUNT * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND;

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: FIVE_MINUTES,
      gcTime: TEN_MINUTES,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
