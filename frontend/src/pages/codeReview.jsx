function CodeReview() {
  return (
    <div>
      <h1 className="text-3xl font-bold">AI Code Review</h1>

      <p className="mt-2 text-slate-400">
        Analyze your code for bugs, security issues,
        performance problems, and code quality issues.
      </p>

      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-6">
        <p className="text-slate-400">
          Select a project and start an AI-powered code review.
        </p>

        <button className="mt-4 rounded-lg bg-violet-600 px-5 py-2.5 font-medium hover:bg-violet-500">
          Start Code Review
        </button>
      </div>
    </div>
  )
}

export default CodeReview