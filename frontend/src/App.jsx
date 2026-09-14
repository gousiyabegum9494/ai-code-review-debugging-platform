import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import CodeReview from './pages/CodeReview'
import Debugging from './pages/Debugging'
import Testing from './pages/Testing'
import Reports from './pages/Reports'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-white">
        <header className="border-b border-slate-800 bg-slate-900">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link to="/" className="text-xl font-bold">
              AI Code Review Platform
            </Link>

            <nav className="flex gap-5 text-sm text-slate-300">
              <Link to="/" className="hover:text-white">
                Dashboard
              </Link>

              <Link to="/projects" className="hover:text-white">
                Projects
              </Link>

              <Link to="/review" className="hover:text-white">
                Code Review
              </Link>

              <Link to="/debugging" className="hover:text-white">
                Debugging
              </Link>

              <Link to="/testing" className="hover:text-white">
                Testing
              </Link>

              <Link to="/reports" className="hover:text-white">
                Reports
              </Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-6 py-8">
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
    </BrowserRouter>
  )
}

export default App