import { useEffect, useState } from 'react'
import api from '../api/api'

function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [creating, setCreating] = useState(false)

  const fetchProjects = () => {
    setLoading(true)

    api
      .get('/projects/')
      .then((response) => {
        setProjects(response.data)
        setError('')
      })
      .catch(() => {
        setError('Unable to connect to the backend.')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleCreateProject = async (event) => {
    event.preventDefault()

    if (!name.trim()) {
      setError('Project name is required.')
      return
    }

    setCreating(true)
    setError('')

    try {
      await api.post('/projects/', {
        name: name.trim(),
        description: description.trim(),
      })

      setName('')
      setDescription('')
      setShowForm(false)

      fetchProjects()
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Unable to create project.'
      )
    } finally {
      setCreating(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>

          <p className="mt-2 text-slate-400">
            Create and manage your code review projects.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-violet-600 px-5 py-2.5 font-medium hover:bg-violet-500"
        >
          {showForm ? 'Cancel' : 'Create Project'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreateProject}
          className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-6"
        >
          <h2 className="text-xl font-semibold">
            Create New Project
          </h2>

          <div className="mt-5">
            <label className="mb-2 block text-sm text-slate-300">
              Project Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter project name"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-violet-500"
            />
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm text-slate-300">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Enter project description"
              rows="4"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-violet-500"
            />
          </div>

          <button
            type="submit"
            disabled={creating}
            className="mt-5 rounded-lg bg-violet-600 px-5 py-2.5 font-medium hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {creating ? 'Creating...' : 'Create Project'}
          </button>
        </form>
      )}

      {loading && (
        <p className="mt-6 text-slate-400">
          Loading projects...
        </p>
      )}

      {error && (
        <p className="mt-6 text-red-400">
          {error}
        </p>
      )}

      {!loading && !error && projects.length === 0 && (
        <p className="mt-6 text-slate-400">
          No projects found.
        </p>
      )}

      <div className="mt-6 space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="rounded-xl border border-slate-800 bg-slate-900 p-5"
          >
            <h2 className="text-xl font-semibold">
              {project.name}
            </h2>

            <p className="mt-1 text-slate-400">
              {project.description || 'No description'}
            </p>

            <p className="mt-3 text-sm text-slate-500">
              Project ID: {project.id}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Projects