import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { useForm } from 'react-hook-form'
import {
  Upload, Loader2, CheckCircle2, AlertCircle, ChevronDown, ChevronUp,
  Plus, Trash2, Save, RefreshCw, Eye
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  uploadResume, getMeta, updateMeta,
  getSkills, createSkill, updateSkill, deleteSkill,
  getExperience, createExperience, updateExperience, deleteExperience,
  getProjects, createProject, updateProject, deleteProject,
  getEducation, createEducation, updateEducation, deleteEducation,
  getCertifications, createCertification, updateCertification, deleteCertification,
} from '../api/client'

// ── Small UI helpers ─────────────────────────────────────────────────────────
function Section({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-white font-semibold hover:bg-slate-700/40 transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        {title}
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && <div className="px-5 pb-5 border-t border-slate-700/60">{children}</div>}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs text-slate-400 mb-1">{label}</label>
      {children}
    </div>
  )
}

const inputCls =
  'w-full bg-slate-900/60 border border-slate-600/60 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors'

// ── Upload Card ───────────────────────────────────────────────────────────────
function ResumeUploader({ onParsed }) {
  const [status, setStatus] = useState('idle') // idle | uploading | success | error
  const [msg, setMsg] = useState('')
  const [progress, setProgress] = useState(0)

  const onDrop = useCallback(async (files) => {
    const file = files[0]
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    setStatus('uploading')
    setMsg('Parsing resume with AI...')
    setProgress(0)
    try {
      const res = await uploadResume(fd, setProgress)
      setStatus('success')
      setMsg(`Parsed successfully! ${res.data.message}`)
      onParsed()
    } catch (e) {
      setStatus('error')
      setMsg(e.response?.data?.detail || 'Upload failed. Please try again.')
    }
  }, [onParsed])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
    multiple: false,
  })

  return (
    <div className="mb-8">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
          isDragActive ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-600 hover:border-indigo-500/60 hover:bg-slate-800/40'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto mb-3 text-slate-500" size={32} />
        <p className="text-white font-medium mb-1">
          {isDragActive ? 'Drop your resume here' : 'Upload Resume (PDF or DOCX)'}
        </p>
        <p className="text-slate-500 text-sm">Drag & drop or click to browse</p>
      </div>

      {status === 'uploading' && (
        <div className="mt-4 p-4 bg-slate-800 rounded-lg flex items-center gap-3">
          <Loader2 className="animate-spin text-indigo-400" size={18} />
          <div className="flex-1">
            <p className="text-white text-sm">{msg}</p>
            <div className="mt-2 bg-slate-700 rounded-full h-1.5">
              <div className="bg-indigo-500 h-1.5 rounded-full transition-all" style={{ width: `${Math.max(progress, 10)}%` }} />
            </div>
          </div>
        </div>
      )}
      {status === 'success' && (
        <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3">
          <CheckCircle2 className="text-green-400" size={18} />
          <p className="text-green-300 text-sm">{msg}</p>
        </div>
      )}
      {status === 'error' && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
          <AlertCircle className="text-red-400" size={18} />
          <p className="text-red-300 text-sm">{msg}</p>
        </div>
      )}
    </div>
  )
}

// ── Meta Editor ───────────────────────────────────────────────────────────────
function MetaEditor({ onRefresh }) {
  const { register, handleSubmit, reset } = useForm()
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getMeta().then((r) => reset(r.data))
  }, [reset])

  const onSubmit = async (data) => {
    setSaving(true)
    await updateMeta(data)
    setSaving(false)
    onRefresh()
  }

  return (
    <Section title="About / Hero" defaultOpen>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full Name"><input {...register('name')} className={inputCls} /></Field>
        <Field label="Job Title"><input {...register('title')} className={inputCls} /></Field>
        <Field label="Email"><input {...register('email')} className={inputCls} /></Field>
        <Field label="Phone"><input {...register('phone')} className={inputCls} /></Field>
        <Field label="Location"><input {...register('location')} className={inputCls} /></Field>
        <Field label="Photo URL"><input {...register('photo_url')} className={inputCls} /></Field>
        <Field label="LinkedIn"><input {...register('linkedin')} className={inputCls} /></Field>
        <Field label="GitHub"><input {...register('github')} className={inputCls} /></Field>
        <Field label="Twitter"><input {...register('twitter')} className={inputCls} /></Field>
        <Field label="Website"><input {...register('website')} className={inputCls} /></Field>
        <div className="sm:col-span-2">
          <Field label="Bio"><textarea {...register('bio')} rows={3} className={inputCls} /></Field>
        </div>
        <div className="sm:col-span-2">
          <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm transition-colors disabled:opacity-50">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
          </button>
        </div>
      </form>
    </Section>
  )
}

// ── Generic list editor ───────────────────────────────────────────────────────
function ListEditor({ title, fetchFn, createFn, updateFn, deleteFn, fields, defaultValues }) {
  const [items, setItems] = useState([])
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(defaultValues)
  const [saving, setSaving] = useState(false)

  const load = () => fetchFn().then((r) => setItems(r.data))
  useEffect(() => { load() }, [])

  const startEdit = (item) => { setEditId(item.id); setForm({ ...item }) }
  const startNew = () => { setEditId('new'); setForm(defaultValues) }
  const cancel = () => { setEditId(null); setForm(defaultValues) }

  const save = async () => {
    setSaving(true)
    if (editId === 'new') await createFn(form)
    else await updateFn(editId, form)
    setSaving(false)
    setEditId(null)
    load()
  }

  const remove = async (id) => {
    await deleteFn(id)
    load()
  }

  return (
    <Section title={title}>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-3 p-3 bg-slate-900/40 rounded-lg">
            {editId === item.id ? (
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {fields.map((f) => (
                  <Field key={f.key} label={f.label}>
                    {f.type === 'textarea' ? (
                      <textarea
                        value={form[f.key] ?? ''}
                        onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                        rows={2}
                        className={inputCls}
                      />
                    ) : f.type === 'checkbox' ? (
                      <input
                        type="checkbox"
                        checked={!!form[f.key]}
                        onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.checked }))}
                        className="mt-2"
                      />
                    ) : f.type === 'tags' ? (
                      <input
                        value={Array.isArray(form[f.key]) ? form[f.key].join(', ') : form[f.key]}
                        onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) }))}
                        placeholder="comma separated"
                        className={inputCls}
                      />
                    ) : (
                      <input
                        type={f.type || 'text'}
                        value={form[f.key] ?? ''}
                        onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))}
                        className={inputCls}
                      />
                    )}
                  </Field>
                ))}
                <div className="sm:col-span-2 flex gap-2">
                  <button onClick={save} disabled={saving} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs">
                    {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Save
                  </button>
                  <button onClick={cancel} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">
                    {item.name || item.company || item.institution || item.role || item.title || `Item ${item.id}`}
                  </p>
                  <p className="text-slate-500 text-xs">
                    {item.role || item.category || item.degree || item.issuer || ''}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(item)} className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-700 transition-colors">
                    <RefreshCw size={13} />
                  </button>
                  <button onClick={() => remove(item.id)} className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-slate-700 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        {editId === 'new' ? (
          <div className="p-3 bg-slate-900/40 rounded-lg border border-indigo-500/30">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              {fields.map((f) => (
                <Field key={f.key} label={f.label}>
                  {f.type === 'textarea' ? (
                    <textarea
                      value={form[f.key] ?? ''}
                      onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                      rows={2}
                      className={inputCls}
                    />
                  ) : f.type === 'checkbox' ? (
                    <input
                      type="checkbox"
                      checked={!!form[f.key]}
                      onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.checked }))}
                      className="mt-2"
                    />
                  ) : f.type === 'tags' ? (
                    <input
                      value={Array.isArray(form[f.key]) ? form[f.key].join(', ') : ''}
                      onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) }))}
                      placeholder="comma separated"
                      className={inputCls}
                    />
                  ) : (
                    <input
                      type={f.type || 'text'}
                      value={form[f.key] ?? ''}
                      onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))}
                      className={inputCls}
                    />
                  )}
                </Field>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={save} disabled={saving} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs">
                {saving ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />} Add
              </button>
              <button onClick={cancel} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs">Cancel</button>
            </div>
          </div>
        ) : (
          <button
            onClick={startNew}
            className="flex items-center gap-2 px-3 py-2 border border-dashed border-slate-600 hover:border-indigo-500 text-slate-400 hover:text-white rounded-lg text-sm w-full justify-center transition-colors"
          >
            <Plus size={14} /> Add {title.replace(' Editor', '')}
          </button>
        )}
      </div>
    </Section>
  )
}

// ── Main Admin Page ───────────────────────────────────────────────────────────
export default function Admin() {
  const [refreshKey, setRefreshKey] = useState(0)
  const refresh = () => setRefreshKey((k) => k + 1)

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Portfolio Admin</h1>
            <p className="text-slate-400 text-sm mt-1">Upload your resume or edit sections manually</p>
          </div>
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 hover:border-indigo-500 text-slate-300 hover:text-white rounded-lg text-sm transition-colors"
          >
            <Eye size={14} /> View Portfolio
          </Link>
        </div>

        {/* Resume Upload */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 mb-6">
          <h2 className="text-white font-semibold mb-1">Auto-fill from Resume</h2>
          <p className="text-slate-400 text-sm mb-4">
            Upload your PDF or DOCX resume — Claude AI will extract and populate all sections automatically.
          </p>
          <ResumeUploader onParsed={refresh} />
        </div>

        {/* Section Editors */}
        <div className="space-y-4">
          <MetaEditor key={`meta-${refreshKey}`} onRefresh={refresh} />

          <ListEditor
            key={`skills-${refreshKey}`}
            title="Skills"
            fetchFn={getSkills}
            createFn={createSkill}
            updateFn={updateSkill}
            deleteFn={deleteSkill}
            defaultValues={{ category: 'General', name: '', proficiency: 3, icon: '' }}
            fields={[
              { key: 'name', label: 'Skill Name' },
              { key: 'category', label: 'Category (Backend/Frontend/DevOps…)' },
              { key: 'proficiency', label: 'Proficiency (1-5)', type: 'number' },
              { key: 'icon', label: 'Icon (optional)' },
            ]}
          />

          <ListEditor
            key={`exp-${refreshKey}`}
            title="Experience"
            fetchFn={getExperience}
            createFn={createExperience}
            updateFn={updateExperience}
            deleteFn={deleteExperience}
            defaultValues={{ company: '', role: '', start_date: '', end_date: '', is_current: false, location: '', description: '' }}
            fields={[
              { key: 'company', label: 'Company' },
              { key: 'role', label: 'Role / Title' },
              { key: 'start_date', label: 'Start Date' },
              { key: 'end_date', label: 'End Date' },
              { key: 'is_current', label: 'Currently working here?', type: 'checkbox' },
              { key: 'location', label: 'Location' },
              { key: 'description', label: 'Description', type: 'textarea' },
            ]}
          />

          <ListEditor
            key={`proj-${refreshKey}`}
            title="Projects"
            fetchFn={getProjects}
            createFn={createProject}
            updateFn={updateProject}
            deleteFn={deleteProject}
            defaultValues={{ name: '', description: '', tech_stack: [], github_url: '', live_url: '', image_url: '' }}
            fields={[
              { key: 'name', label: 'Project Name' },
              { key: 'description', label: 'Description', type: 'textarea' },
              { key: 'tech_stack', label: 'Tech Stack (comma separated)', type: 'tags' },
              { key: 'github_url', label: 'GitHub URL' },
              { key: 'live_url', label: 'Live URL' },
              { key: 'image_url', label: 'Image URL' },
            ]}
          />

          <ListEditor
            key={`edu-${refreshKey}`}
            title="Education"
            fetchFn={getEducation}
            createFn={createEducation}
            updateFn={updateEducation}
            deleteFn={deleteEducation}
            defaultValues={{ institution: '', degree: '', field: '', start_year: '', end_year: '', gpa: '' }}
            fields={[
              { key: 'institution', label: 'Institution' },
              { key: 'degree', label: 'Degree' },
              { key: 'field', label: 'Field of Study' },
              { key: 'start_year', label: 'Start Year' },
              { key: 'end_year', label: 'End Year' },
              { key: 'gpa', label: 'GPA (optional)' },
            ]}
          />

          <ListEditor
            key={`cert-${refreshKey}`}
            title="Certifications"
            fetchFn={getCertifications}
            createFn={createCertification}
            updateFn={updateCertification}
            deleteFn={deleteCertification}
            defaultValues={{ name: '', issuer: '', date: '', credential_url: '' }}
            fields={[
              { key: 'name', label: 'Certification Name' },
              { key: 'issuer', label: 'Issuer / Organization' },
              { key: 'date', label: 'Date' },
              { key: 'credential_url', label: 'Credential URL' },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
