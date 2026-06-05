import React, { useState } from 'react'
import { Plus, Trash2, CheckCircle2, Circle, Target } from 'lucide-react'

const QUARTERS = ['Q3 2026', 'Q2 2026', 'Q4 2026']

export default function Rocks({ rocks, setRocks }) {
  const [newText, setNewText] = useState('')
  const [newQuarter, setNewQuarter] = useState('Q3 2026')
  const [newOwner, setNewOwner] = useState('')
  const [filter, setFilter] = useState('all')

  const addRock = () => {
    if (!newText.trim()) return
    setRocks(prev => [...prev, {
      id: Date.now(),
      text: newText.trim(),
      quarter: newQuarter,
      owner: newOwner.trim() || 'Me',
      done: false,
      createdAt: new Date().toISOString(),
    }])
    setNewText('')
    setNewOwner('')
  }

  const toggle = (id) => setRocks(prev => prev.map(r => r.id === id ? { ...r, done: !r.done } : r))
  const remove = (id) => setRocks(prev => prev.filter(r => r.id !== id))

  const filtered = rocks.filter(r => {
    if (filter === 'open') return !r.done
    if (filter === 'done') return r.done
    return true
  })

  const pct = rocks.length ? Math.round(rocks.filter(r => r.done).length / rocks.length * 100) : 0

  return (
    <div className="fade-in" style={{ padding: '32px 36px', maxWidth: 800 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Target size={20} color="var(--amber)" />
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em' }}>Rocks</h1>
          </div>
          <p style={{ color: 'var(--text-1)', fontSize: 13, marginTop: 4 }}>Your most important priorities this quarter.</p>
        </div>
        {/* Progress ring text */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--amber)' }}>{pct}%</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-2)', letterSpacing: '0.1em' }}>COMPLETE</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: 'var(--bg-3)', borderRadius: 2, marginBottom: 28 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: 'var(--amber)', borderRadius: 2, transition: 'width 0.4s ease' }} />
      </div>

      {/* Add form */}
      <div style={{
        background: 'var(--bg-2)', border: '1px solid var(--border)',
        borderRadius: 6, padding: 20, marginBottom: 24,
      }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-2)', letterSpacing: '0.12em', marginBottom: 12 }}>ADD ROCK</div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          <input
            value={newText}
            onChange={e => setNewText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addRock()}
            placeholder="Define this rock clearly and specifically..."
            style={inputStyle}
          />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <select value={newQuarter} onChange={e => setNewQuarter(e.target.value)} style={{ ...inputStyle, flex: '0 0 140px' }}>
            {QUARTERS.map(q => <option key={q}>{q}</option>)}
          </select>
          <input value={newOwner} onChange={e => setNewOwner(e.target.value)} placeholder="Owner (default: Me)" style={inputStyle} />
          <button onClick={addRock} style={addBtnStyle}>
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['all','open','done'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '4px 14px', borderRadius: 3,
            border: '1px solid ' + (filter === f ? 'var(--amber)' : 'var(--border)'),
            background: filter === f ? 'var(--amber-glow)' : 'transparent',
            color: filter === f ? 'var(--amber)' : 'var(--text-1)',
            fontSize: 12, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>{f}</button>
        ))}
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.length === 0 && (
          <div style={{ color: 'var(--text-2)', fontFamily: 'var(--font-mono)', fontSize: 12, padding: '24px 0', textAlign: 'center' }}>
            No rocks yet. Add your top priorities above.
          </div>
        )}
        {filtered.map(rock => (
          <div key={rock.id} style={{
            background: 'var(--bg-2)', border: '1px solid var(--border)',
            borderRadius: 6, padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: 12,
            opacity: rock.done ? 0.5 : 1,
            transition: 'opacity 0.2s',
          }}>
            <button onClick={() => toggle(rock.id)} style={{ border: 'none', background: 'none', padding: 0, color: rock.done ? 'var(--green)' : 'var(--text-2)', flexShrink: 0 }}>
              {rock.done ? <CheckCircle2 size={18} /> : <Circle size={18} />}
            </button>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: 'var(--text-0)', textDecoration: rock.done ? 'line-through' : 'none' }}>{rock.text}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <span className="tag tag-amber">{rock.quarter}</span>
                <span className="tag tag-gray">{rock.owner}</span>
              </div>
            </div>
            <button onClick={() => remove(rock.id)} style={{ border: 'none', background: 'none', padding: 0, color: 'var(--text-2)', cursor: 'pointer' }}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

const inputStyle = {
  flex: 1, background: 'var(--bg-3)', border: '1px solid var(--border)',
  borderRadius: 4, padding: '8px 12px', color: 'var(--text-0)',
  fontSize: 13, outline: 'none',
}

const addBtnStyle = {
  display: 'flex', alignItems: 'center', gap: 6,
  padding: '8px 16px', background: 'var(--amber)', color: '#000',
  border: 'none', borderRadius: 4, fontSize: 13, fontWeight: 700,
  cursor: 'pointer', flexShrink: 0,
}
