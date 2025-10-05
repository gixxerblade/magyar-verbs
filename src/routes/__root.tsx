import { Outlet, createRootRoute, Link } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { SparklesIcon } from '@heroicons/react/24/outline'
import '../App.css'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <div className="app">
        <header className="hero">
          <div className="hero__icon">
            <SparklesIcon aria-hidden="true" />
          </div>
          <div>
            <h1>Magyar Verb Playground</h1>
            <p>
              Explore the indefinite present conjugation of Hungarian verbs that do not need connecting
              vowels. Learn the patterns, test yourself, and master vowel harmony along the way.
            </p>
          </div>
        </header>

        <nav className="tab-list">
          <Link to="/reference" className="tab" activeOptions={{ exact: false }} activeProps={{ className: 'tab tab--active' }}>
            Reference
          </Link>
          <Link to="/verb-lab" className="tab" activeOptions={{ exact: false }} activeProps={{ className: 'tab tab--active' }}>
            Verb Lab
          </Link>
          <Link to="/quiz" className="tab" activeOptions={{ exact: false }} activeProps={{ className: 'tab tab--active' }}>
            Quick Quiz
          </Link>
          <Link to="/flashcards" className="tab" activeOptions={{ exact: false }} activeProps={{ className: 'tab tab--active' }}>
            Flashcards
          </Link>
          <Link to="/harmony-drill" className="tab" activeOptions={{ exact: false }} activeProps={{ className: 'tab tab--active' }}>
            Harmony Drill
          </Link>
        </nav>

        <div className="tab-panels">
          <Outlet />
        </div>
      </div>
      <TanStackRouterDevtools />
    </>
  )
}
