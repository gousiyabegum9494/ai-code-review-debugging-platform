function Reports() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Reports</h1>

      <p className="mt-2 text-slate-400">
        View code review results, fixes, testing results, and
        project history.
      </p>

      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-6">
        <p className="text-slate-400">
          Your completed review reports will appear here.
        </p>

        <button className="mt-4 rounded-lg bg-violet-600 px-5 py-2.5 font-medium hover:bg-violet-500">
          View Reports
        </button>
      </div>
    </div>
  )
}

export default Reports