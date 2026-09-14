function Testing() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Testing & Verification</h1>

      <p className="mt-2 text-slate-400">
        Run tests and verify whether generated fixes solve the
        detected problems.
      </p>

      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-6">
        <p className="text-slate-400">
          Run your project tests to verify the code.
        </p>

        <button className="mt-4 rounded-lg bg-violet-600 px-5 py-2.5 font-medium hover:bg-violet-500">
          Run Tests
        </button>
      </div>
    </div>
  )
}

export default Testing