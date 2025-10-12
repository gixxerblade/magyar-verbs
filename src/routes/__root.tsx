import { SparklesIcon, XCircleIcon } from '@heroicons/react/24/outline';
import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Link, Outlet, useSearch } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { AuthButton } from '../components/AuthButton';
import { useCurrentUser } from '../hooks/useAuth';
import '../App.css';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
});

function RootComponent() {
  const { data: user } = useCurrentUser();
  const search = useSearch({ strict: false });
  const isUnauthorized = search && 'unauthorized' in search && search.unauthorized === 'true';

  return (
    <>
      <div className='app'>
        <header className='hero'>
          <div className='hero__icon'>
            <SparklesIcon aria-hidden='true' />
          </div>
          <div>
            <h1>
              <Link to='/'>Magyar Learning Playground</Link>
            </h1>
            <p>
              Explore the indefinite present conjugation of Hungarian verbs that do not need
              connecting vowels. Learn the patterns, test yourself, and master vowel harmony along
              the way.
            </p>
          </div>
          <AuthButton user={user ?? null} />
        </header>

        <nav className='flex items-center justify-center'>
          <Link
            to='/reference'
            className='tab'
            activeOptions={{ exact: false }}
            activeProps={{ className: 'tab tab--active' }}
          >
            Reference
          </Link>
          <Link
            to='/verb-lab'
            className='tab'
            activeOptions={{ exact: false }}
            activeProps={{ className: 'tab tab--active' }}
          >
            Verb Lab
          </Link>
          <Link
            to='/quiz'
            className='tab'
            activeOptions={{ exact: false }}
            activeProps={{ className: 'tab tab--active' }}
          >
            Quick Quiz
          </Link>
          <Link
            to='/flashcards'
            search={{
              type: 'all',
              category: 'all',
              difficulty: 'all',
              partOfSpeech: 'all',
            }}
            className='tab'
            activeOptions={{ exact: false }}
            activeProps={{ className: 'tab tab--active' }}
          >
            Flashcards
          </Link>
          <Link
            to='/harmony-drill'
            className='tab'
            activeOptions={{ exact: false }}
            activeProps={{ className: 'tab tab--active' }}
          >
            Harmony Drill
          </Link>
          <Link
            to='/vocabulary-practice'
            className='tab'
            activeOptions={{ exact: false }}
            activeProps={{ className: 'tab tab--active' }}
          >
            Vocabulary Practice
          </Link>
          {user && (
            <>
              <Link
                to='/vocabulary'
                className='tab'
                activeOptions={{ exact: false }}
                activeProps={{ className: 'tab tab--active' }}
              >
                Vocabulary Manager
              </Link>
              <Link
                to='/custom-verbs'
                className='tab'
                activeOptions={{ exact: false }}
                activeProps={{ className: 'tab tab--active' }}
              >
                Custom Verbs
              </Link>
            </>
          )}
        </nav>

        {isUnauthorized && (
          <div className='mx-auto my-4 max-w-3xl rounded-lg border border-red-300/30 bg-red-50/10 p-4 flex items-center gap-3'>
            <XCircleIcon className='size-6 text-red-500 shrink-0' />
            <div>
              <strong className='text-red-500'>Access Denied</strong>
              <p className='mt-1 text-red-900'>
                Your account is not authorized to access this feature. Please contact the
                administrator if you believe this is an error.
              </p>
            </div>
          </div>
        )}

        <div className='tab-panels'>
          <Outlet />
        </div>
      </div>
      <TanStackRouterDevtools />
    </>
  );
}
