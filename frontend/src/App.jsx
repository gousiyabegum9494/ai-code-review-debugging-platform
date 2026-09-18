import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import CodeReview from './pages/CodeReview'
import Debugging from './pages/Debugging'
import Testing from './pages/Testing'
import Reports from './pages/Reports'

const navigation = [
  { name: 'Dashboard', path: '/', icon: '⌂' },
  { name: 'Projects', path: '/projects', icon: '▣' },
  { name: 'Code Review', path: '/review', icon: '⌘' },
  { name: 'Debugging', path: '/debugging', icon: '⚙' },
  { name: 'Testing', path: '/testing', icon: '✓' },
  { name: 'Reports', path: '/reports', icon: '▤' },
]

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-slate-800 bg-slate-900/95 lg:flex lg:flex-col">
          <div className="flex h-20 items-center border-b border-slate-800 px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-lg font-bold shadow-lg shadow-violet-900/30">
                AI
              </div>

              <div>
                <h1 className="text-sm font-bold">
                  CodePilot
                </h1>
                <p className="text-xs text-slate-500">
                  AI Developer Platform
                </p>
              </div>
            </div>
          </div>

          <div className="px-4 pt-6">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Workspace
            </p>

            <nav className="mt-3 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? 'bg-violet-600/15 text-violet-300'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  <span className="w-5 text-center text-base">
                    {item.icon}
                  </span>

                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="mt-auto border-t border-slate-800 p-4">
            <div className="rounded-xl bg-slate-800/60 p-4">
              <p className="text-xs font-semibold text-slate-300">
                AI Analysis
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Review, debug, test and verify your code with AI.
              </p>
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-lg px-2 py-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-sm font-semibold">
                U
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  Developer
                </p>
                <p className="truncate text-xs text-slate-500">
                  Team workspace
                </p>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
          <header className="sticky top-0 z-10 h-20 border-b border-slate-800 bg-slate-950/90 px-4 backdrop-blur-md sm:px-6">
            <div className="flex h-full items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Workspace
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-200">
                  AI Code Review Platform
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-400 sm:block">
                  ● System Online
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-sm font-bold">
                  U
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/review" element={<CodeReview />} />
              <Route path="/debugging" element={<Debugging />} />
              <Route path="/testing" element={<Testing />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </main>
        </div>
      </div>
      </div>
    </BrowserRouter>
  )
}

export default App