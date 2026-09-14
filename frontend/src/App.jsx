function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold">
              AI Code Review Platform
            </h1>
            <p className="text-sm text-slate-400">
              Analyze • Debug • Fix • Test • Verify
            </p>
          </div>

          <button className="rounded-lg bg-violet-600 px-4 py-2 font-medium hover:bg-violet-500">
            New Project
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <h2 className="mb-6 text-xl font-semibold">
          Dashboard
        </h2>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Projects</p>
            <p className="mt-2 text-3xl font-bold">0</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Issues Found</p>
            <p className="mt-2 text-3xl font-bold">0</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Fixes Generated</p>
            <p className="mt-2 text-3xl font-bold">0</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Tests Passed</p>
            <p className="mt-2 text-3xl font-bold">0</p>
          </div>
        </div>

        {/* Project area */}
        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-lg font-semibold">
            Start a Code Review
          </h3>

          <p className="mt-2 text-slate-400">
            Create a project and upload your source code to begin
            AI-powered analysis.
          </p>

          <button className="mt-5 rounded-lg bg-violet-600 px-5 py-2.5 font-medium hover:bg-violet-500">
            Create Your First Project
          </button>
        </div>
      </main>
    </div>
  )
}

export default App