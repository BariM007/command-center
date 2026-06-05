import React from 'react'
import { LayoutDashboard, Target, Briefcase, Wrench, CheckSquare, ChevronRight } from 'lucide-react'

const NAV = [
  { id: 'dashboard', label: 'Command', icon: LayoutDashboard },
  { id: 'rocks',     label: 'Rocks',   icon: Target },
  { id: 'bd',        label: 'BD Pipeline', icon: Briefcase },
  { id: 'ops',       label: 'Operations',  icon: Wrench },
  { id: 'actions',   label: 'Actions', icon: CheckSquare },
]

export default function Sidebar({ active, onNav }) {
  return (
    <aside style={{
      width: 220,
      minHeight: '100vh',
      background: 'var(--bg-1)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '0 0 24px 0',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: '28px 24px 32px',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 18,
          color: 'var(--amber)',
          letterSpacing: '-0.01em',
          lineHeight: 1,
        }}>COMMAND</div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--text-2)',
          letterSpacing: '0.15em',
          marginTop: 4,
        }}>CENTER // v1</div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '16px 12px', flex: 1 }}>
        {NAV.map(({ id, label, icon: Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => onNav(id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 4,
                border: 'none',
                background: isActive ? 'var(--amber-glow)' : 'transparent',
                color: isActive ? 'var(--amber)' : 'var(--text-1)',
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                marginBottom: 2,
                transition: 'all 0.15s',
                textAlign: 'left',
                cursor: 'pointer',
                borderLeft: isActive ? '2px solid var(--amber)' : '2px solid transparent',
              }}
            >
              <Icon size={15} />
              {label}
              {isActive && <ChevronRight size={12} style={{ marginLeft: 'auto' }} />}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '0 24px' }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--text-2)',
          letterSpacing: '0.1em',
        }}>
          {new Date().toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()}
        </div>
      </div>
    </aside>
  )
}
