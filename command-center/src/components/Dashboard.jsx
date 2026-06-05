import React from 'react'
import { AlertTriangle, TrendingUp, Wrench, CheckSquare, Clock } from 'lucide-react'
import { format } from 'date-fns'

function StatCard({ label, value, sub, accent }) {
  return (
    <div style={{
      background: 'var(--bg-2)',
      border: '1px solid var(--border)',
      borderRadius: 6,
      padding: '20px 24px',
      borderTop: `2px solid ${accent || 'var(--border)'}`,
    }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-2)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 36, fontWeight: 800, color: accent || 'var(--text-0)', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text-1)', marginTop: 6 }}>{sub}</div>}
    </div>
  )
}

function AlertItem({ text, type }) {
  const colors = { warn: 'var(--amber)', danger: 'var(--red)', ok: 'var(--green)' }
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '10px 0', borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: colors[type] || 'var(--text-2)', marginTop: 5, flexShrink: 0 }} />
      <span style={{ fontSize: 13, color: 'var(--text-0)', lineHeight: 1.5 }}>{text}</span>
    </div>
  )
}

export default function Dashboard({ rocks, bd, ops, actions }) {
  const today = new Date()
  const weekRocks = rocks.filter(r => !r.done)
  const overdueActions = actions.filter(a => !a.done && a.dueDate && new Date(a.dueDate) < today)
  const activeDeals = bd.filter(d => !['won','lost'].includes(d.stage))
  const redOps = ops.filter(o => o.health === 'red')
  const dueActions = actions.filter(a => !a.done).slice(0, 5)

  return (
    <div className="fade-in" style={{ padding: '32px 36px', maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-2)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>
          {format(today, 'EEEE, MMMM d yyyy')}
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-0)', letterSpacing: '-0.02em' }}>
          Good {today.getHours() < 12 ? 'morning' : today.getHours() < 17 ? 'afternoon' : 'evening'}.
        </h1>
        <p style={{ color: 'var(--text-1)', marginTop: 6, fontSize: 14 }}>Here's what needs your attention today.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        <StatCard label="Open Rocks" value={weekRocks.length} sub={`${rocks.filter(r=>r.done).length} completed`} accent="var(--amber)" />
        <StatCard label="Active Pursuits" value={activeDeals.length} sub={`${bd.filter(d=>d.stage==='proposal').length} at proposal`} accent="var(--blue)" />
        <StatCard label="Projects" value={ops.length} sub={`${redOps.length} need attention`} accent={redOps.length > 0 ? 'var(--red)' : 'var(--green)'} />
        <StatCard label="Overdue Actions" value={overdueActions.length} sub={`${actions.filter(a=>!a.done).length} total open`} accent={overdueActions.length > 0 ? 'var(--red)' : 'var(--green)'} />
      </div>

      {/* Two column */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Alerts */}
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <AlertTriangle size={14} color="var(--amber)" />
            <span style={{ fontWeight: 700, fontSize: 13, letterSpacing: '0.05em' }}>ATTENTION ITEMS</span>
          </div>
          {overdueActions.length === 0 && redOps.length === 0 ? (
            <div style={{ color: 'var(--text-2)', fontSize: 13, fontFamily: 'var(--font-mono)' }}>All clear. No blockers.</div>
          ) : (
            <>
              {redOps.map(o => <AlertItem key={o.id} text={`${o.name} — project needs attention`} type="danger" />)}
              {overdueActions.map(a => <AlertItem key={a.id} text={`Overdue: ${a.text}`} type="warn" />)}
            </>
          )}
        </div>

        {/* Next actions */}
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Clock size={14} color="var(--blue)" />
            <span style={{ fontWeight: 700, fontSize: 13, letterSpacing: '0.05em' }}>NEXT ACTIONS</span>
          </div>
          {dueActions.length === 0 ? (
            <div style={{ color: 'var(--text-2)', fontSize: 13, fontFamily: 'var(--font-mono)' }}>No open actions.</div>
          ) : dueActions.map(a => (
            <div key={a.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: 'var(--text-0)' }}>{a.text}</span>
              {a.dueDate && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: new Date(a.dueDate) < today ? 'var(--red)' : 'var(--text-2)' }}>
                  {format(new Date(a.dueDate), 'MMM d')}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
