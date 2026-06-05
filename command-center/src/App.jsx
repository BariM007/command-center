import React, { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Dashboard from './components/Dashboard.jsx'
import Rocks from './components/Rocks.jsx'
import BD from './components/BD.jsx'
import Ops from './components/Ops.jsx'
import Actions from './components/Actions.jsx'
import { useLocalStorage } from './hooks/useLocalStorage.js'

const SEED_ROCKS = [
  { id: 1, text: 'Close MBCS Phase 2 commissioning scope by Q3 end', quarter: 'Q3 2026', owner: 'Me', done: false, createdAt: new Date().toISOString() },
  { id: 2, text: 'Submit EGP commissioning bid and debrief internally', quarter: 'Q3 2026', owner: 'Me', done: false, createdAt: new Date().toISOString() },
  { id: 3, text: 'Land 2 new BD conversations with tier-1 midstream clients', quarter: 'Q3 2026', owner: 'Me', done: false, createdAt: new Date().toISOString() },
]

const SEED_BD = [
  { id: 1, name: 'NGTL DGS Booster Program', client: 'TC Energy', value: '2400000', stage: 'proposal', owner: 'Me', notes: 'Gantt submitted, awaiting feedback', createdAt: new Date().toISOString() },
  { id: 2, name: 'Eagle Mountain–Woodfibre Gas Pipeline', client: 'FortisBC', value: '1800000', stage: 'develop', owner: 'Me', notes: 'RFP commissioning bid in progress', createdAt: new Date().toISOString() },
  { id: 3, name: 'Enbridge US PLC Upgrades', client: 'Enbridge', value: '950000', stage: 'qualify', owner: 'Me', notes: 'Cross-border licensing risks being assessed', createdAt: new Date().toISOString() },
]

const SEED_OPS = [
  { id: 1, name: 'MBCS – Mount Bracey Compressor Station', client: 'TC Energy', pm: 'Field Lead', health: 'yellow', status: 'Level 2 schedule updated. Commissioning phase on track through early 2027.', completion: 45, endDate: '2027-03-01' },
  { id: 2, name: 'Edmonton Branch Operations', client: 'Internal', pm: 'Me', health: 'green', status: 'P&L tracking positive. AR collection on schedule.', completion: 60, endDate: '2026-12-31' },
]

const SEED_ACTIONS = [
  { id: 1, text: 'Follow up with TC Energy on NGTL pricing approval', dueDate: '2026-06-10', category: 'BD', done: false, createdAt: new Date().toISOString() },
  { id: 2, text: 'Review MBCS Level 2 schedule with field PM', dueDate: '2026-06-07', category: 'Ops', done: false, createdAt: new Date().toISOString() },
  { id: 3, text: 'Prepare branch KPI deck for leadership review', dueDate: '2026-06-15', category: 'Ops', done: false, createdAt: new Date().toISOString() },
]

export default function App() {
  const [view, setView] = useState('dashboard')
  const [rocks, setRocks] = useLocalStorage('cc_rocks', SEED_ROCKS)
  const [bd, setBd] = useLocalStorage('cc_bd', SEED_BD)
  const [ops, setOps] = useLocalStorage('cc_ops', SEED_OPS)
  const [actions, setActions] = useLocalStorage('cc_actions', SEED_ACTIONS)

  const views = { dashboard: Dashboard, rocks: Rocks, bd: BD, ops: Ops, actions: Actions }
  const View = views[view]

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar active={view} onNav={setView} />
      <main style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-0)' }}>
        <View
          rocks={rocks} setRocks={setRocks}
          bd={bd} setBd={setBd}
          ops={ops} setOps={setOps}
          actions={actions} setActions={setActions}
        />
      </main>
    </div>
  )
}
