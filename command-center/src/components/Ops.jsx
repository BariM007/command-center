import React, { useState } from 'react'
import { Plus, Trash2, Wrench, ChevronDown, ChevronUp } from 'lucide-react'

const HEALTH = ['green', 'yellow', 'red']
const HEALTH_LABELS = { green: 'On Track', yellow: 'Watch', red: 'At Risk' }
const HEALTH_COLORS = { green: 'var(--green)', yellow: 'var(--amber)', red: 'var(--red)' }
const HEALTH_TAGS = { green: 'tag-green', yellow: 'tag-amber', red: 'tag-red' }

const EMPTY = { name: '', client: '', pm: '', health: 'green', status: '', completion: 50, endDate: '' }

export default function Ops({ ops, setOps }) {
  const [form, setForm] = useState(EMPTY)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [expanded, setExpanded] = useState(null)

  const save = () => {
    if (!form.name.trim()) return
    if (editing !== null) {
      setOps(prev => prev.map(o => o.id === editing ? { ...o, ...form } : o))
      setEditing(null)
    } else {
      setOps(prev => [...prev, { ...form, id: Date.now() }])
    }
    setForm(EMPTY)
    setShowForm(false)
  }

  const remove = (id) => setOps(prev => prev.filter(o => o.id !== id))
  const startEdit = (op) => { setForm({ ...op }); setEditing(op.id); setShowForm(true) }
  const cycleHealth = (id) => setOps(prev => prev.map(o => {
    if (o.id !== id) return o
    const idx = HEALTH.indexOf(o.health)
    return { ...o, health: HEALTH[(idx + 1) % HEALTH.length] }
  }))

  const byHealth = (h) => ops.filter(o => o.health === h)

  return (
    <div className="fade-in" style={{ padding: '32px 36px', maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Wrench size={20} color="var(--green)" />
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em' }}>Operations</h1>
          </div>
          <p style={{ color: 'var(--text-1)', fontSize: 13, marginTop: 4 }}>Project health at a glance.</p>
        </div>
        <button onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(true) }} style={addBtnStyle}>
          <Plus size={14} /> Add Project
        </button>
      </div>

      {/* Health summary */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
        {HEALTH.map(h => (
          <div key={h} style={{
            flex: 1, background: 'var(--bg-2)', border: `1px solid var(--border)`,
            borderTop: `2px solid ${HEALTH_COLORS[h]}`, borderRadius: 6, padding: '14px 18px',
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-2)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{HEALTH_LABELS[h]}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: HEALTH_COLORS[h] }}>{byHealth(h).length}</div>
          </div>
        ))}
      </div>

      {/* Add/Edit form */}
      {showForm && (
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: 20, marginBottom: 24 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--green)', letterSpacing: '0.12em', marginBottom: 14 }}>
            {editing ? 'EDIT PROJECT' : 'NEW PROJECT'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} placeholder="Project name *" style={inputStyle} />
            <input value={form.client} onChange={e => setForm(p => ({...p, client: e.target.value}))} placeholder="Client" style={inputStyle} />
            <input value={form.pm} onChange={e => setForm(p => ({...p, pm: e.target.value}))} placeholder="Project Manager" style={inputStyle} />
            <select value={form.health} onChange={e => setForm(p => ({...p, health: e.target.value}))} style={inputStyle}>
              {HEALTH.map(h => <option key={h} value={h}>{HEALTH_LABELS[h]}</option>)}
            </select>
            <input value={form.endDate} onChange={e => setForm(p => ({...p, endDate: e.target.value}))} type="date" style={inputStyle} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-1)', whiteSpace: 'nowrap' }}>{form.completion}% done</span>
              <input type="range" min={0} max={100} value={form.completion}
                onChange={e => setForm(p => ({...p, completion: +e.target.value}))}
                style={{ flex: 1, accentColor: 'var(--green)' }} />
            </div>
          </div>
          <textarea value={form.status} onChange={e => setForm(p => ({...p, status: e.target.value}))} placeholder="Status update / blockers..." rows={2} style={{ ...inputStyle, width: '100%', resize: 'vertical', marginBottom: 12 }} />
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={save} style={addBtnStyle}>Save</button>
            <button onClick={() => { setShowForm(false); setEditing(null) }} style={cancelBtnStyle}>Cancel</button>
          </div>
        </div>
      )}

      {/* Projects list */}
      {ops.length === 0 && (
        <div style={{ color: 'var(--text-2)', fontFamily: 'var(--font-mono)', fontSize: 12, padding: '40px 0', textAlign: 'center' }}>
          No projects tracked yet.
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {ops.map(op => (
          <div key={op.id} style={{
            background: 'var(--bg-2)', border: '1px solid var(--border)',
            borderLeft: `3px solid ${HEALTH_COLORS[op.health]}`,
            borderRadius: 6, overflow: 'hidden',
          }}>
            <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
              onClick={() => setExpanded(expanded === op.id ? null : op.id)}>
              {/* Health dot - click to cycle */}
              <button onClick={e => { e.stopPropagation(); cycleHealth(op.id) }} style={{
                width: 12, height: 12, borderRadius: '50%', background: HEALTH_COLORS[op.health],
                border: 'none', cursor: 'pointer', flexShrink: 0, animation: op.health === 'red' ? 'pulse-amber 2s infinite' : 'none',
              }} title="Click to change health" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-0)' }}>{op.name}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' }}>
                  {op.client && <span className="tag tag-gray">{op.client}</span>}
                  {op.pm && <span className="tag tag-gray">PM: {op.pm}</span>}
                  <span className={`tag ${HEALTH_TAGS[op.health]}`}>{HEALTH_LABELS[op.health]}</span>
                </div>
              </div>
              {/* Progress */}
              <div style={{ width: 80, textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-1)' }}>{op.completion}%</div>
                <div style={{ height: 3, background: 'var(--bg-3)', borderRadius: 2, marginTop: 4 }}>
                  <div style={{ height: '100%', width: `${op.completion}%`, background: HEALTH_COLORS[op.health], borderRadius: 2 }} />
                </div>
              </div>
              {expanded === op.id ? <ChevronUp size={14} color="var(--text-2)" /> : <ChevronDown size={14} color="var(--text-2)" />}
            </div>

            {expanded === op.id && (
              <div style={{ padding: '0 16px 14px 42px', borderTop: '1px solid var(--border)' }}>
                {op.status && <p style={{ fontSize: 13, color: 'var(--text-1)', marginTop: 10 }}>{op.status}</p>}
                {op.endDate && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-2)', marginTop: 8 }}>Target: {op.endDate}</p>}
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button onClick={() => startEdit(op)} style={cancelBtnStyle}>Edit</button>
                  <button onClick={() => remove(op.id)} style={{ ...cancelBtnStyle, color: 'var(--red)', borderColor: 'var(--red-dim)' }}>Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const inputStyle = {
  flex: 1, width: '100%', background: 'var(--bg-3)', border: '1px solid var(--border)',
  borderRadius: 4, padding: '8px 12px', color: 'var(--text-0)', fontSize: 13, outline: 'none',
}
const addBtnStyle = {
  display: 'flex', alignItems: 'center', gap: 6,
  padding: '8px 16px', background: 'var(--amber)', color: '#000',
  border: 'none', borderRadius: 4, fontSize: 13, fontWeight: 700, cursor: 'pointer',
}
const cancelBtnStyle = {
  padding: '7px 14px', background: 'transparent', color: 'var(--text-1)',
  border: '1px solid var(--border)', borderRadius: 4, fontSize: 13, cursor: 'pointer',
}
