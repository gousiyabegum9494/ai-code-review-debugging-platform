function Dashboard() {
  const stats = [
    {
      label: 'Projects',
      value: '04',
      detail: 'Active projects',
      icon: '▣',
    },
    {
      label: 'Code Reviews',
      value: '18',
      detail: 'Reviews completed',
      icon: '⌘',
    },
    {
      label: 'Issues Found',
      value: '37',
      detail: 'Across all projects',
      icon: '⚠',
    },
    {
      label: 'Tests Passed',
      value: '92%',
      detail: 'Verification rate',
      icon: '✓',
    },
  ]

  const projects = [
    {
      name: 'E-Commerce API',
      language: 'Python',
      issues: 12,
      status: 'Needs review',
    },
    {
      name: 'Banking System',
      language: 'Java',
      issues: 7,
      status: 'In progress',
    },
    {
      name: 'Portfolio Website',
      language: 'JavaScript',
      issues: 3,
      status: 'Reviewed',
    },
  ]

  return (
    <div className="space-y-8">
      <section>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-violet-400">
              Developer Workspace
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Good afternoon 👋
            </h1>

            <p className="mt-2 max-w-2xl text-slate-400">
              Analyze, debug, test, and improve your code with AI-powered
              developer tools.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            All systems operational
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-5 transition hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-900"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-lg text-violet-400">
                {stat.icon}
              </div>

              <span className="text-xs text-slate-600">
                LIVE
              </span>
            </div>

            <p className="mt-5 text-sm text-slate-400">
              {stat.label}
            </p>

            <div className="mt-1 flex items-end justify-between">
              <p className="text-3xl font-bold text-white">
                {stat.value}
              </p>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              {stat.detail}
            </p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70">
          <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
            <div>
              <h2 className="font-semibold text-white">
                Recent Projects
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Your latest code analysis activity
              </p>
            </div>

            <a
              href="/projects"
              className="text-sm font-medium text-violet-400 hover:text-violet-300"
            >
              View all →
            </a>
          </div>

          <div className="divide-y divide-slate-800">
            {projects.map((project) => (
              <div
                key={project.name}
                className="flex flex-col gap-4 px-6 py-5 transition hover:bg-slate-800/30 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-sm font-bold text-violet-300">
                    {project.name.charAt(0)}
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-200">
                      {project.name}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {project.language} · {project.issues} issues detected
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      project.status === 'Reviewed'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-amber-500/10 text-amber-400'
                    }`}
                  >
                    {project.status}
                  </span>

                  <span className="text-slate-600">
                    →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <div>
            <h2 className="font-semibold text-white">
              Quick Actions
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Start working on your code
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <a
              href="/projects"
              className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-violet-500/40 hover:bg-violet-500/5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                +
              </div>

              <div>
                <p className="text-sm font-medium text-slate-200">
                  New Project
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Create a new code review project
                </p>
              </div>
            </a>

            <a
              href="/review"
              className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-violet-500/40 hover:bg-violet-500/5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                ⌘
              </div>

              <div>
                <p className="text-sm font-medium text-slate-200">
                  Run Code Review
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Analyze your source code with AI
                </p>
              </div>
            </a>

            <a
              href="/testing"
              className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-violet-500/40 hover:bg-violet-500/5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                ✓
              </div>

              <div>
                <p className="text-sm font-medium text-slate-200">
                  Verify Code
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Run tests and validate fixes
                </p>
              </div>
            </a>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-950/40 to-slate-900 p-6 sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-violet-400">
              AI-Powered Development
            </p>

            <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
              Find bugs before they reach production.
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Detect bugs, security vulnerabilities, code smells and
              performance issues, then generate fixes and verify them
              automatically.
            </p>
          </div>

          <a
            href="/review"
            className="shrink-0 rounded-xl bg-violet-600 px-5 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-500"
          >
            Start Code Review
          </a>
        </div>
      </section>
    </div>
  )
}

export default Dashboard