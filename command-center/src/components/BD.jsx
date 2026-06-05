import React, { useState } from 'react'
import { Plus, Trash2, ChevronRight, Briefcase, DollarSign } from 'lucide-react'

const STAGES = ['qualify', 'develop', 'proposal', 'negotiate', 'won', 'lost']
const STAGE_LABELS = { qualify: 'Qualifying', develop: 'Developing', proposal: 'Proposal', negotiate: 'Negotiate', won: 'Won', lost: 'Lost' }
const STAGE_COLORS = {
  qualify: 'var(--text-1)', develop: 'var(--blue)', proposal: 'var(--amber)',
  negotiate: '#c084fc', won: 'var(--green)', lost: 'var(--red)',
}

const EMPTY = { name: '', client: '', value: '', stage: 'qualify', owner: '', notes: '' }

export default function BD({ bd, setBd }) {
  const [form, setForm] = useState(EMPTY)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  const save = () => {
    if (!form.name.trim()) return
    if (editing !== null) {
      setBd(prev => prev.map(d => d.id === editing ? { ...d, ...form } : d))
      setEditing(null)
    } else {
      setBd(prev => [...prev, { ...form, id: Date.now(), createdAt: new Date().toISOString() }])
    }
    setForm(EMPTY)
    setShowForm(false)
  }

  const remove = (id) => setBd(prev => prev.filter(d => d.id !== id))
  const advance = (id) => setBd(prev => prev.map(d => {
    if (d.id !== id) return d
    const idx = STAGES.indexOf(d.stage)
    return idx < STAGES.length - 1 ? { ...d, stage: STAGES[idx + 1] } : d
  }))
  const startEdit = (deal) => { setForm({ ...deal }); setEditing(deal.id); setShowForm(true) }

  const totalPipeline = bd.filter(d => !['won','lost'].includes(d.stage))
    .reduce((s, d) => s + (parseFloat(d.value) || 0), 0)
  const wonTotal = bd.filter(d => d.stage === 'won')
    .reduce((s, d) => s + (parseFloat(d.value) || 0), 0)

  const fmt = (n) => n >= 1000000 ? `$${(n/1000000).toFixed(1)}M` : n >= 1000 ? `$${(n/1000).toFixed(0)}K` : `$${n}`

  return (
    <div className="fade-in" style={{ padding: '32px 36px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Briefcase size={20} color="var(--blue)" />
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em' }}>BD Pipeline</h1>
          </div>
          <p style={{ color: 'var(--text-1)', fontSize: 13, marginTop: 4 }}>Track pursuits from qualify to close.</p>
        </div>
        <button onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(true) }} style={addBtnStyle}>
          <Plus size={14} /> Add Pursuit
        </button>
      </div>

      {/* Summary bar */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 28 }}>
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '14px 20px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-2)', letterSpacing: '0.1em' }}>PIPELINE VALUE</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--blue)' }}>{fmt(totalPipeline)}</div>
        </div>
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '14px 20px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-2)', letterSpacing: '0.1em' }}>WON YTD</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--green)' }}>{fmt(wonTotal)}</div>
        </div>
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '14px 20px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-2)', letterSpacing: '0.1em' }}>ACTIVE DEALS</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-0)' }}>{bd.filter(d=>!['won','lost'].includes(d.stage)).length}</div>
        </div>
      </div>

      {/* Add/Edit form */}
      {showForm && (
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--amber-dim)', borderRadius: 6, padding: 20, marginBottom: 24 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--amber)', letterSpacing: '0.12em', marginBottom: 14 }}>
            {editing ? 'EDIT PURSUIT' : 'NEW PURSUIT'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} placeholder="Pursuit / project name *" style={inputStyle} />
            <input value={form.client} onChange={e => setForm(p => ({...p, client: e.target.value}))} placeholder="Client" style={inputStyle} />
            <input value={form.value} onChange={e => setForm(p => ({...p, value: e.target.value}))} placeholder="Estimated value ($)" style={inputStyle} />
            <select value={form.stage} onChange={e => setForm(p => ({...p, stage: e.target.value}))} style={inputStyle}>
              {STAGES.map(s => <option key={s} value={s}>{STAGE_LABELS[s]}</option>)}
            </select>
            <input value={form.owner} onChange={e => setForm(p => ({...p, owner: e.target.value}))} placeholder="Owner" style={inputStyle} />
          </div>
          <textarea value={form.notes} onChange={e => setForm(p => ({...p, notes: e.target.value}))} placeholder="Notes / next step..." rows={2} style={{ ...inputStyle, width: '100%', resize: 'vertical', marginBottom: 12 }} />
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={save} style={addBtnStyle}>Save</button>
            <button onClick={() => { setShowForm(false); setEditing(null) }} style={cancelBtnStyle}>Cancel</button>
          </div>
        </div>
      )}

      {/* Deals by stage */}
      {STAGES.filter(s => bd.some(d => d.stage === s)).map(stage => (
        <div key={stage} style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: STAGE_COLORS[stage] }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-1)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              {STAGE_LABELS[stage]}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-2)' }}>
              ({bd.filter(d => d.stage === stage).length})
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {bd.filter(d => d.stage === stage).map(deal => (
              <div key={deal.id} style={{
                background: 'var(--bg-2)', border: '1px solid var(--border)',
                borderLeft: `3px solid ${STAGE_COLORS[stage]}`,
                borderRadius: 6, padding: '14px 16px',
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-0)' }}>{deal.name}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 5, flexWrap: 'wrap' }}>
                    {deal.client && <span className="tag tag-gray">{deal.client}</span>}
                    {deal.value && <span className="tag tag-blue"><DollarSign size={9} style={{display:'inline'}}/>{deal.value}</span>}
                    {deal.owner && <span className="tag tag-gray">{deal.owner}</span>}
                  </div>
                  {deal.notes && <div style={{ fontSize: 12, color: 'var(--text-1)', marginTop: 6 }}>{deal.notes}</div>}
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  {!['won','lost'].includes(stage) && (
                    <button onClick={() => advance(deal.id)} title="Advance stage" style={{ ...iconBtn, color: 'var(--blue)' }}>
                      <ChevronRight size={16} />
                    </button>
                  )}
                  <button onClick={() => startEdit(deal)} style={{ ...iconBtn, fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-2)' }}>edit</button>
                  <button onClick={() => remove(deal.id)} style={{ ...iconBtn, color: 'var(--red)' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {bd.length === 0 && (
        <div style={{ color: 'var(--text-2)', fontFamily: 'var(--font-mono)', fontSize: 12, padding: '40px 0', textAlign: 'center' }}>
          No pursuits yet. Add your first deal above.
        </div>
      )}
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
  padding: '8px 16px', background: 'transparent', color: 'var(--text-1)',
  border: '1px solid var(--border)', borderRadius: 4, fontSize: 13, cursor: 'pointer',
}
const iconBtn = {
  border: 'none', background: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center',
}
