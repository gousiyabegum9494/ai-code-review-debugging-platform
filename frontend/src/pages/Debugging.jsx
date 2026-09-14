function Debugging() {
  return (
    <div>
      <h1 className="text-3xl font-bold">AI Debugging</h1>

      <p className="mt-2 text-slate-400">
        Analyze errors, identify root causes, and generate
        automated fixes.
      </p>

      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-6">
        <p className="text-slate-400">
          Submit an error or stack trace to begin debugging.
        </p>

        <button className="mt-4 rounded-lg bg-violet-600 px-5 py-2.5 font-medium hover:bg-violet-500">
          Start Debugging
        </button>
      </div>
    </div>
  )
}

export default Debugging