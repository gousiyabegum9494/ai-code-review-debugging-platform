import { useState } from 'react'
import Editor from '@monaco-editor/react'
import api from '../api/api'

const initialCode = `def calculate_average(numbers):
    total = 0
    divisor = len(numbers)

    for number in numbers:
        total += number

    result = total / divisor

    print("Average:", result)

    unused_value = 100

    return total
`

const sampleIssues = [
  {
    id: 1,
    line: 8,
    severity: 'High',
    category: 'Bug',
    title: 'Possible division by zero',
    description:
      'The divisor is calculated from the length of the input list. If an empty list is provided, the division operation will fail.',
    recommendation:
      'Check whether the input list is empty before performing the division.',
  },
  {
    id: 2,
    line: 10,
    severity: 'Medium',
    category: 'Code Quality',
    title: 'Unused variable detected',
    description:
      'The variable unused_value is assigned but never used anywhere in the function.',
    recommendation:
      'Remove the unused variable or use it if the value is required.',
  },
  {
    id: 3,
    line: 3,
    severity: 'Low',
    category: 'Maintainability',
    title: 'Redundant divisor variable',
    description:
      'The length of the collection can be used directly instead of storing it in a separate variable.',
    recommendation:
      'Consider simplifying the expression to improve readability.',
  },
]

const severityStyles = {
  High: {
    badge: 'border-red-500/20 bg-red-500/10 text-red-300',
    dot: 'bg-red-400',
  },
  Medium: {
    badge: 'border-amber-500/20 bg-amber-500/10 text-amber-300',
    dot: 'bg-amber-400',
  },
  Low: {
    badge: 'border-blue-500/20 bg-blue-500/10 text-blue-300',
    dot: 'bg-blue-400',
  },
}

function CodeReview() {
  const [code, setCode] = useState(initialCode)
  const [selectedFile, setSelectedFile] = useState('app.py')
  const [isReviewing, setIsReviewing] = useState(false)
  const [reviewComplete, setReviewComplete] = useState(false)
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [reviewResult, setReviewResult] = useState(null)

  const handleReview = async () => {
    setIsReviewing(true)
    setReviewComplete(false)
    setReviewResult(null)

    try {
      const response = await api.post('/review/', {
        project_id: 4,
        filename: selectedFile,
        language: 'Python',
        code: code,
      })

      console.log('Review response:', response.data)

      setReviewResult(response.data)
      setReviewComplete(true)
    } catch (error) {
      console.error('Review failed:', error)

      alert(
        'Unable to connect to the AI review backend. Make sure FastAPI is running.'
      )
    } finally {
      setIsReviewing(false)
    }
  }

  const handleIssueClick = (issue) => {
    setSelectedIssue(issue)

    const editor = window.monacoEditorInstance

    if (editor) {
      editor.revealLineInCenter(issue.line)

      editor.setPosition({
        lineNumber: issue.line,
        column: 1,
      })

      editor.focus()
    }
  }

  const handleReset = () => {
    setCode(initialCode)
    setReviewComplete(false)
    setReviewResult(null)
    setSelectedIssue(null)
  }

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">

        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>Workspace</span>
            <span>/</span>
            <span className="text-violet-400">
              Code Review
            </span>
          </div>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">
            AI Code Review
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Review your source code for bugs, security vulnerabilities,
            performance issues and maintainability problems.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">

          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />

            <span className="text-xs font-medium text-slate-300">
              Analysis Engine Ready
            </span>
          </div>

          <button
            onClick={handleReview}
            disabled={isReviewing}
            className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/20 transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isReviewing
              ? 'Analyzing Code...'
              : reviewComplete
                ? 'Run Review Again'
                : 'Run AI Review'}
          </button>

        </div>
      </div>


      {/* =====================================================
          PROJECT CONTEXT
      ===================================================== */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80">

        <div className="grid gap-4 p-5 md:grid-cols-3">

          {/* Project */}

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Project
            </p>

            <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-xs font-bold text-violet-300">
                PY
              </div>

              <div>
                <p className="text-sm font-medium text-slate-200">
                  Demo Python Project
                </p>

                <p className="text-xs text-slate-500">
                  Project #4
                </p>
              </div>

            </div>
          </div>


          {/* File */}

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Source File
            </p>

            <select
              value={selectedFile}
              onChange={(event) =>
                setSelectedFile(event.target.value)
              }
              className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-violet-500"
            >
              <option value="app.py">
                app.py
              </option>

              <option value="utils.py">
                utils.py
              </option>

              <option value="main.py">
                main.py
              </option>
            </select>
          </div>


          {/* Language */}

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Language
            </p>

            <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">

              <span className="text-lg">
                🐍
              </span>

              <div>
                <p className="text-sm font-medium text-slate-200">
                  Python
                </p>

                <p className="text-xs text-slate-500">
                  Automatic language detection
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>


      {/* =====================================================
          MAIN WORKSPACE
      ===================================================== */}

      <div className="grid min-h-[650px] gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(380px,0.65fr)]">


        {/* =================================================
            CODE EDITOR
        ================================================= */}

        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl shadow-black/10">

          {/* Editor Header */}

          <div className="flex flex-col gap-3 border-b border-slate-800 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-300">
                {'</>'}
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  Source Code
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  {selectedFile} · Editable
                </p>
              </div>

            </div>


            <div className="flex items-center gap-2">

              <span className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-[11px] font-medium text-slate-400">
                Python
              </span>

              <span className="rounded-lg border border-emerald-500/10 bg-emerald-500/5 px-3 py-1.5 text-[11px] font-medium text-emerald-400">
                ● Saved locally
              </span>

            </div>

          </div>


          {/* Monaco Editor */}

          <div className="bg-[#0b1120]">

            <Editor
              height="560px"
              language="python"
              theme="vs-dark"
              value={code}
              onChange={(value) =>
                setCode(value || '')
              }
              onMount={(editor) => {
                window.monacoEditorInstance = editor
              }}
              options={{
                fontSize: 14,
                lineHeight: 24,

                minimap: {
                  enabled: true,
                },

                wordWrap: 'on',

                automaticLayout: true,

                scrollBeyondLastLine: false,

                smoothScrolling: true,

                cursorBlinking: 'smooth',

                padding: {
                  top: 16,
                  bottom: 16,
                },

                renderLineHighlight: 'all',

                bracketPairColorization: {
                  enabled: true,
                },

                suggestOnTriggerCharacters: true,

                tabSize: 4,
              }}
            />

          </div>


          {/* Editor Footer */}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 bg-slate-900 px-5 py-3">

            <div className="flex items-center gap-4 text-xs text-slate-500">

              <span>
                {code.split('\n').length} lines
              </span>

              <span>
                {code.length} characters
              </span>

              <span>
                UTF-8
              </span>

            </div>


            <button
              onClick={handleReset}
              className="text-xs font-medium text-slate-400 transition hover:text-white"
            >
              Reset Code
            </button>

          </div>

        </section>


        {/* =================================================
            REVIEW FINDINGS
        ================================================= */}

        <section className="flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl shadow-black/10">

          {/* Header */}

          <div className="border-b border-slate-800 px-5 py-4">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-semibold text-white">
                  Review Findings
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Issues detected by AI analysis
                </p>

              </div>


              {reviewComplete && (
                <span className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-300">
                  Review Complete
                </span>
              )}

            </div>

          </div>


          {/* Summary */}

          <div className="grid grid-cols-3 gap-3 border-b border-slate-800 p-5">

            <div className="rounded-xl border border-red-500/10 bg-red-500/5 p-4">

              <div className="flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-red-400" />

                <span className="text-xs text-slate-500">
                  High
                </span>

              </div>

              <p className="mt-2 text-2xl font-bold text-red-300">
                1
              </p>

            </div>


            <div className="rounded-xl border border-amber-500/10 bg-amber-500/5 p-4">

              <div className="flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-amber-400" />

                <span className="text-xs text-slate-500">
                  Medium
                </span>

              </div>

              <p className="mt-2 text-2xl font-bold text-amber-300">
                1
              </p>

            </div>


            <div className="rounded-xl border border-blue-500/10 bg-blue-500/5 p-4">

              <div className="flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-blue-400" />

                <span className="text-xs text-slate-500">
                  Low
                </span>

              </div>

              <p className="mt-2 text-2xl font-bold text-blue-300">
                1
              </p>

            </div>

          </div>


          {/* Backend Response */}

          {reviewResult && (
            <div className="mx-5 mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">

              <div className="flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-emerald-400" />

                <p className="text-xs font-semibold text-emerald-300">
                  Backend Connected
                </p>

              </div>

              <p className="mt-2 text-xs leading-5 text-slate-400">
                {reviewResult.message}
              </p>

              <div className="mt-3 grid grid-cols-2 gap-2">

                <div className="rounded-lg bg-slate-950/60 p-2">
                  <p className="text-[10px] text-slate-600">
                    Project
                  </p>

                  <p className="mt-1 text-xs text-slate-300">
                    #{reviewResult.project_id}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-950/60 p-2">
                  <p className="text-[10px] text-slate-600">
                    Code Length
                  </p>

                  <p className="mt-1 text-xs text-slate-300">
                    {reviewResult.code_length}
                  </p>
                </div>

              </div>

            </div>
          )}


          {/* Issues */}

          <div className="flex-1 space-y-3 overflow-y-auto p-5">

            {sampleIssues.map((issue) => {

              const style =
                severityStyles[issue.severity]

              const active =
                selectedIssue?.id === issue.id

              return (
                <button
                  key={issue.id}
                  onClick={() =>
                    handleIssueClick(issue)
                  }
                  className={`w-full rounded-xl border p-4 text-left transition ${
                    active
                      ? 'border-violet-500/40 bg-violet-500/5'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-950'
                  }`}
                >

                  <div className="flex items-start justify-between gap-3">

                    <div className="flex min-w-0 items-start gap-3">

                      <span
                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${style.dot}`}
                      />

                      <div className="min-w-0">

                        <p className="text-sm font-semibold text-slate-100">
                          {issue.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Line {issue.line} · {issue.category}
                        </p>

                      </div>

                    </div>


                    <span
                      className={`shrink-0 rounded-md border px-2 py-1 text-[10px] font-semibold ${style.badge}`}
                    >
                      {issue.severity}
                    </span>

                  </div>


                  <p className="mt-3 text-xs leading-5 text-slate-400">
                    {issue.description}
                  </p>


                  <div className="mt-3 border-t border-slate-800 pt-3">

                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                      Recommendation
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {issue.recommendation}
                    </p>

                  </div>

                </button>
              )
            })}

          </div>

        </section>

      </div>


      {/* =====================================================
          AI EXPLANATION
      ===================================================== */}

      <section className="rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-500/10 to-slate-900 p-6">

        <div className="flex flex-col gap-5 md:flex-row">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-sm font-bold text-white shadow-lg shadow-violet-900/30">
            AI
          </div>


          <div className="flex-1">

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

              <h3 className="text-sm font-semibold text-white">
                AI Analysis Explanation
              </h3>

              <span className="text-xs text-slate-500">
                Confidence: 95%
              </span>

            </div>


            <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-400">
              The current function calculates an average using
              the number of elements as the divisor. When an empty
              list is passed to the function, the divisor becomes
              zero and the division operation raises a
              ZeroDivisionError.
            </p>


            <div className="mt-4 grid gap-3 md:grid-cols-3">

              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">

                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                  Category
                </p>

                <p className="mt-1 text-xs font-medium text-slate-300">
                  Runtime Bug
                </p>

              </div>


              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">

                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                  Affected Line
                </p>

                <p className="mt-1 text-xs font-medium text-slate-300">
                  Line 8
                </p>

              </div>


              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">

                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                  Suggested Action
                </p>

                <p className="mt-1 text-xs font-medium text-slate-300">
                  Add input validation
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          NEXT MODULE
      ===================================================== */}

      <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <p className="text-sm font-semibold text-white">
            Continue to automated debugging
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Generate fixes and regression tests for detected issues.
          </p>

        </div>


        <button
          onClick={() => {
            window.location.href = '/debugging'
          }}
          className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-700"
        >
          Open Debugging →
        </button>

      </div>

    </div>
  )
}

export default CodeReview