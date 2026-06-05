import React, { useState } from 'react'
import { Plus, Trash2, CheckCircle2, Circle, CheckSquare } from 'lucide-react'
import { format, isAfter, isBefore, addDays } from 'date-fns'

const CATS = ['BD', 'Ops', 'People', 'Finance', 'Personal', 'Other']

export default function Actions({ actions, setActions }) {
  const [text, setText] = useState('')
  const [due, setDue] = useState('')
  const [cat, setCat] = useState('BD')
  const [filter, setFilter] = useState('open')

  const add = () => {
    if (!text.trim()) return
    setActions(prev => [...prev, { id: Date.now(), text: text.trim(), dueDate: due, category: cat, done: false, createdAt: new Date().toISOString() }])
    setText('')
    setDue('')
  }

  const toggle = (id) => setActions(prev => prev.map(a => a.id === id ? { ...a, done: !a.done, doneAt: !a.done ? new Date().toISOString() : null } : a))
  const remove = (id) => setActions(prev => prev.filter(a => a.id !== id))

  const today = new Date()
  const soon = addDays(today, 3)

  const urgency = (a) => {
    if (!a.dueDate) return 'none'
    const d = new Date(a.dueDate)
    if (isBefore(d, today)) return 'overdue'
    if (isBefore(d, soon)) return 'soon'
    return 'ok'
  }

  const filtered = actions.filter(a => {
    if (filter === 'open') return !a.done
    if (filter === 'done') return a.done
    if (filter === 'overdue') return !a.done && urgency(a) === 'overdue'
    return true
  }).sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1
    if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate)
    if (a.dueDate) return -1
    if (b.dueDate) return 1
    return 0
  })

  const CAT_COLORS = { BD: 'tag-blue', Ops: 'tag-green', People: 'tag-amber', Finance: 'tag-amber', Personal: 'tag-gray', Other: 'tag-gray' }

  const overdueCnt = actions.filter(a => !a.done && urgency(a) === 'overdue').length

  return (
    <div className="fade-in" style={{ padding: '32px 36px', maxWidth: 800 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <CheckSquare size={20} color="var(--amber)" />
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em' }}>Actions</h1>
      </div>
      <p style={{ color: 'var(--text-1)', fontSize: 13, marginBottom: 28 }}>Every next step, one place.</p>

      {/* Add */}
      <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: 20, marginBottom: 24 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-2)', letterSpacing: '0.12em', marginBottom: 12 }}>QUICK ADD</div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()}
            placeholder="What needs to happen?" style={{ ...inputStyle, flex: 1 }} />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <select value={cat} onChange={e => setCat(e.target.value)} style={{ ...inputStyle, flex: '0 0 130px' }}>
            {CATS.map(c => <option key={c}>{c}</option>)}
          </select>
          <input type="date" value={due} onChange={e => setDue(e.target.value)} style={{ ...inputStyle, flex: '0 0 160px' }} />
          <button onClick={add} style={addBtnStyle}><Plus size={14} /> Add</button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['open','done','overdue','all'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '4px 14px', borderRadius: 3,
            border: '1px solid ' + (filter === f ? 'var(--amber)' : 'var(--border)'),
            background: filter === f ? 'var(--amber-glow)' : 'transparent',
            color: filter === f ? 'var(--amber)' : 'var(--text-1)',
            fontSize: 12, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em',
            position: 'relative',
          }}>
            {f}
            {f === 'overdue' && overdueCnt > 0 && (
              <span style={{ marginLeft: 5, background: 'var(--red)', color: '#fff', borderRadius: 10, padding: '1px 5px', fontSize: 9, fontFamily: 'var(--font-mono)' }}>{overdueCnt}</span>
            )}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-2)', alignSelf: 'center' }}>
          {actions.filter(a=>!a.done).length} open · {actions.filter(a=>a.done).length} done
        </span>
      </div>

      {/* List */}
      {filtered.length === 0 && (
        <div style={{ color: 'var(--text-2)', fontFamily: 'var(--font-mono)', fontSize: 12, textAlign: 'center', padding: '40px 0' }}>
          {filter === 'open' ? 'Nothing open. Add your first action above.' : 'No items here.'}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {filtered.map(action => {
          const u = urgency(action)
          const borderColor = !action.done && u === 'overdue' ? 'var(--red)' : !action.done && u === 'soon' ? 'var(--amber)' : 'var(--border)'
          return (
            <div key={action.id} style={{
              background: 'var(--bg-2)', border: `1px solid ${borderColor}`,
              borderRadius: 5, padding: '12px 14px',
              display: 'flex', alignItems: 'center', gap: 12,
              opacity: action.done ? 0.45 : 1, transition: 'opacity 0.2s',
            }}>
              <button onClick={() => toggle(action.id)} style={{ border: 'none', background: 'none', padding: 0, color: action.done ? 'var(--green)' : 'var(--text-2)', flexShrink: 0, cursor: 'pointer' }}>
                {action.done ? <CheckCircle2 size={17} /> : <Circle size={17} />}
              </button>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 13, color: 'var(--text-0)', textDecoration: action.done ? 'line-through' : 'none' }}>{action.text}</span>
                <div style={{ display: 'flex', gap: 6, marginTop: 5 }}>
                  <span className={`tag ${CAT_COLORS[action.category] || 'tag-gray'}`}>{action.category}</span>
                  {action.dueDate && (
                    <span className={`tag ${u === 'overdue' ? 'tag-red' : u === 'soon' ? 'tag-amber' : 'tag-gray'}`}>
                      {u === 'overdue' ? '⚠ ' : ''}{format(new Date(action.dueDate), 'MMM d')}
                    </span>
                  )}
                </div>
              </div>
              <button onClick={() => remove(action.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-2)', padding: 4 }}>
                <Trash2 size={13} />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const inputStyle = {
  background: 'var(--bg-3)', border: '1px solid var(--border)',
  borderRadius: 4, padding: '8px 12px', color: 'var(--text-0)', fontSize: 13, outline: 'none',
}
const addBtnStyle = {
  display: 'flex', alignItems: 'center', gap: 6,
  padding: '8px 16px', background: 'var(--amber)', color: '#000',
  border: 'none', borderRadius: 4, fontSize: 13, fontWeight: 700, cursor: 'pointer',
}
