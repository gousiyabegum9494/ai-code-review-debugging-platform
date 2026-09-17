import { useEffect, useState } from 'react'
import api from '../api/api'

function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [language, setLanguage] = useState('Python')
  const [creating, setCreating] = useState(false)

  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editLanguage, setEditLanguage] = useState('Python')
  const [saving, setSaving] = useState(false)

  const loadProjects = () => {
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
    loadProjects()
  }, [])

  const createProject = async (event) => {
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
        language,
      })

      setName('')
      setDescription('')
      setLanguage('Python')

      loadProjects()
    } catch (err) {
      setError('Unable to create project.')
    } finally {
      setCreating(false)
    }
  }

  const startEdit = (project) => {
    setEditingId(project.id)
    setEditName(project.name)
    setEditDescription(project.description || '')
    setEditLanguage(project.language)
    setError('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditName('')
    setEditDescription('')
    setEditLanguage('Python')
  }

  const saveEdit = async (projectId) => {
    if (!editName.trim()) {
      setError('Project name is required.')
      return
    }

    setSaving(true)
    setError('')

    try {
      await api.put(`/projects/${projectId}`, {
        name: editName.trim(),
        description: editDescription.trim(),
        language: editLanguage,
      })

      cancelEdit()
      loadProjects()
    } catch (err) {
      setError('Unable to update project.')
    } finally {
      setSaving(false)
    }
  }

  const deleteProject = async (projectId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this project?'
    )

    if (!confirmed) {
      return
    }

    setError('')

    try {
      await api.delete(`/projects/${projectId}`)
      loadProjects()
    } catch (err) {
      setError('Unable to delete project.')
    }
  }

  const languageOptions = [
    'Python',
    'JavaScript',
    'TypeScript',
    'Java',
    'C++',
    'C',
    'Go',
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold">Projects</h1>

      <p className="mt-2 text-slate-400">
        Create and manage your code review projects.
      </p>

      <form
        onSubmit={createProject}
        className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-6"
      >
        <h2 className="text-xl font-semibold">
          Create New Project
        </h2>

        <div className="mt-4">
          <label className="block text-sm text-slate-400">
            Project Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="My Python Project"
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-white outline-none focus:border-violet-500"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm text-slate-400">
            Description
          </label>

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe your project"
            rows="3"
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-white outline-none focus:border-violet-500"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm text-slate-400">
            Language
          </label>

          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-white outline-none focus:border-violet-500"
          >
            {languageOptions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={creating}
          className="mt-5 rounded-lg bg-violet-600 px-5 py-2.5 font-medium hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {creating ? 'Creating...' : 'Create Project'}
        </button>
      </form>

      {error && (
        <p className="mt-4 text-red-400">
          {error}
        </p>
      )}

      <h2 className="mt-8 text-2xl font-semibold">
        Your Projects
      </h2>

      {loading && (
        <p className="mt-4 text-slate-400">
          Loading projects...
        </p>
      )}

      {!loading && !error && projects.length === 0 && (
        <p className="mt-4 text-slate-400">
          No projects found.
        </p>
      )}

      <div className="mt-4 space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="rounded-xl border border-slate-800 bg-slate-900 p-5"
          >
            {editingId === project.id ? (
              <div>
                <h3 className="text-xl font-semibold">
                  Edit Project
                </h3>

                <div className="mt-4">
                  <label className="block text-sm text-slate-400">
                    Project Name
                  </label>

                  <input
                    type="text"
                    value={editName}
                    onChange={(event) =>
                      setEditName(event.target.value)
                    }
                    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-white outline-none focus:border-violet-500"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm text-slate-400">
                    Description
                  </label>

                  <textarea
                    value={editDescription}
                    onChange={(event) =>
                      setEditDescription(event.target.value)
                    }
                    rows="3"
                    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-white outline-none focus:border-violet-500"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm text-slate-400">
                    Language
                  </label>

                  <select
                    value={editLanguage}
                    onChange={(event) =>
                      setEditLanguage(event.target.value)
                    }
                    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-white outline-none focus:border-violet-500"
                  >
                    {languageOptions.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={() => saveEdit(project.id)}
                    disabled={saving}
                    className="rounded-lg bg-green-600 px-5 py-2.5 font-medium hover:bg-green-500 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>

                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="rounded-lg bg-slate-700 px-5 py-2.5 font-medium hover:bg-slate-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-semibold">
                  {project.name}
                </h3>

                <p className="mt-1 text-slate-400">
                  {project.description || 'No description'}
                </p>

                <div className="mt-3 flex gap-4 text-sm text-slate-500">
                  <span>Project ID: {project.id}</span>
                  <span>Language: {project.language}</span>
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => startEdit(project)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-500"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteProject(project.id)}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium hover:bg-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Projects