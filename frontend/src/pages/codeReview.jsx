import { useState } from 'react'
import api from '../api/api'

function CodeReview() {
  const [projectId, setProjectId] = useState('4')
  const [filename, setFilename] = useState('app.py')
  const [code, setCode] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const reviewCode = async () => {
    if (!code.trim()) {
      setError('Please enter some Python code.')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await api.post('/review/', {
        project_id: Number(projectId),
        files: [
          {
            filename: filename,
            language: 'python',
            content: code,
          },
        ],
      })

      setResult(response.data)
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Unable to connect to the backend.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8 text-gray-900">

      <div className="mx-auto max-w-6xl">

        {/* PAGE HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            AI Code Review
          </h1>

          <p className="mt-2 text-gray-600">
            Analyze your Python code for bugs, security,
            code quality, and performance issues.
          </p>
        </div>


        {/* PROJECT INFORMATION */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow">

          <h2 className="mb-5 text-xl font-bold text-gray-900">
            Project Information
          </h2>

          <div className="grid gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block font-semibold text-gray-800">
                Project ID
              </label>

              <input
                type="number"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>


            <div>
              <label className="mb-2 block font-semibold text-gray-800">
                Filename
              </label>

              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

          </div>
        </div>


        {/* CODE INPUT */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow">

          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Source Code
          </h2>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your Python code here..."
            spellCheck="false"
            className="h-80 w-full resize-y rounded-lg border border-gray-700 bg-gray-950 p-5 font-mono text-sm leading-6 text-green-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
          />

          <div className="mt-4 flex items-center gap-4">

            <button
              onClick={reviewCode}
              disabled={loading}
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Analyzing Code...' : 'Review Code'}
            </button>

            {loading && (
              <span className="text-sm text-gray-600">
                Please wait while the analyzer checks your code...
              </span>
            )}

          </div>

        </div>


        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-8 rounded-xl border border-red-300 bg-red-50 p-5 text-red-800 shadow">

            <h3 className="font-bold">
              Review Error
            </h3>

            <p className="mt-1">
              {error}
            </p>

          </div>
        )}


        {/* RESULTS */}
        {result && (
          <div>

            {/* RESULT SUMMARY */}
            <div className="mb-6 rounded-xl bg-gray-900 p-6 text-white shadow-lg">

              <h2 className="text-2xl font-bold">
                Review Results
              </h2>

              <div className="mt-5 grid gap-4 md:grid-cols-3">

                <div className="rounded-lg bg-gray-800 p-5">
                  <p className="text-sm text-gray-400">
                    Project ID
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    {result.project_id}
                  </p>
                </div>


                <div className="rounded-lg bg-gray-800 p-5">
                  <p className="text-sm text-gray-400">
                    Files Analyzed
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    {result.file_count}
                  </p>
                </div>


                <div className="rounded-lg bg-gray-800 p-5">
                  <p className="text-sm text-gray-400">
                    Issues Found
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    {result.issue_count}
                  </p>
                </div>

              </div>
            </div>


            {/* NO ISSUES */}
            {result.issues.length === 0 ? (

              <div className="rounded-xl border border-green-300 bg-green-50 p-6 text-green-800 shadow">

                <h3 className="text-xl font-bold">
                  No Issues Detected
                </h3>

                <p className="mt-2">
                  The analyzer did not find any problems in this code.
                </p>

              </div>

            ) : (

              /* ISSUE LIST */
              <div>

                <h2 className="mb-5 text-2xl font-bold text-gray-900">
                  Detected Issues
                </h2>


                <div className="space-y-5">

                  {result.issues.map((issue, index) => (

                    <div
                      key={index}
                      className="overflow-hidden rounded-xl border border-gray-300 bg-white shadow-md"
                    >

                      {/* ISSUE HEADER */}
                      <div className="border-b border-gray-200 bg-gray-50 p-5">

                        <div className="flex flex-wrap items-center gap-2">

                          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
                            {issue.category}
                          </span>


                          <span
                            className={`rounded-full px-3 py-1 text-sm font-semibold ${
                              issue.severity === 'High'
                                ? 'bg-red-100 text-red-800'
                                : issue.severity === 'Medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {issue.severity}
                          </span>


                          <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-800">
                            Line {issue.line}
                          </span>

                        </div>


                        <h3 className="mt-4 text-xl font-bold text-gray-900">
                          {issue.title}
                        </h3>

                      </div>


                      {/* ISSUE BODY */}
                      <div className="p-5">

                        <div className="mb-5">

                          <p className="mb-2 font-semibold text-gray-900">
                            Explanation
                          </p>

                          <p className="leading-7 text-gray-700">
                            {issue.description}
                          </p>

                        </div>


                        {/* RECOMMENDATION */}
                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">

                          <p className="font-bold text-blue-900">
                            Recommendation
                          </p>

                          <p className="mt-2 leading-6 text-gray-800">
                            {issue.recommendation}
                          </p>

                        </div>


                        {/* ISSUE DETAILS */}
                        <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 border-t border-gray-200 pt-4 text-sm text-gray-600">

                          <span>
                            <strong className="text-gray-900">
                              File:
                            </strong>{' '}
                            {issue.file}
                          </span>


                          <span>
                            <strong className="text-gray-900">
                              Line:
                            </strong>{' '}
                            {issue.line}
                          </span>


                          <span>
                            <strong className="text-gray-900">
                              Confidence:
                            </strong>{' '}
                            {(issue.confidence * 100).toFixed(0)}%
                          </span>

                        </div>

                      </div>

                    </div>

                  ))}

                </div>

              </div>
            )}

          </div>
        )}

      </div>

    </div>
  )
}

export default CodeReview