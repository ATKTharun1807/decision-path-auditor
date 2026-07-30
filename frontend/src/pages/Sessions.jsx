import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, ChevronRight, Filter, Download, RefreshCw,
  Clock, AlertTriangle, CheckCircle, RotateCcw
} from 'lucide-react';
import AppLayout from '../components/AppLayout';

const ALL_SESSIONS = [
  { id: 'sess-a0dd38bd2155', user: 'user-7090', decision: 'DECLINE', rule: 'RULE-CS-640',  steps: 10, risk: 'high',   ago: '2m ago',  product: 'Personal Loan',    amount: '$12,000' },
  { id: 'sess-8b9487775caf', user: 'user-6657', decision: 'DECLINE', rule: 'RULE-CS-640',  steps: 10, risk: 'high',   ago: '8m ago',  product: 'Personal Loan',    amount: '$8,500'  },
  { id: 'sess-f2a9c1be4d21', user: 'user-2341', decision: 'APPROVE', rule: 'RULE-CS-640',  steps: 8,  risk: 'low',    ago: '15m ago', product: 'Auto Loan',        amount: '$24,000' },
  { id: 'sess-71c34e2a9f08', user: 'user-8812', decision: 'APPROVE', rule: 'RULE-INC-220', steps: 12, risk: 'low',    ago: '31m ago', product: 'Mortgage',         amount: '$340,000'},
  { id: 'sess-3d1ab7f82c69', user: 'user-5590', decision: 'REVIEW',  rule: 'RULE-CS-640',  steps: 9,  risk: 'medium', ago: '1h ago',  product: 'Business Credit',  amount: '$50,000' },
  { id: 'sess-c92f1a47e831', user: 'user-3318', decision: 'APPROVE', rule: 'RULE-INC-220', steps: 7,  risk: 'low',    ago: '2h ago',  product: 'Personal Loan',    amount: '$5,000'  },
  { id: 'sess-dd4821b69f05', user: 'user-9901', decision: 'DECLINE', rule: 'RULE-CS-640',  steps: 11, risk: 'high',   ago: '3h ago',  product: 'Auto Loan',        amount: '$18,000' },
  { id: 'sess-ab7e29c3f142', user: 'user-4427', decision: 'APPROVE', rule: 'RULE-INC-220', steps: 6,  risk: 'low',    ago: '5h ago',  product: 'Personal Loan',    amount: '$3,200'  },
  { id: 'sess-17f3b56a8d90', user: 'user-6102', decision: 'REVIEW',  rule: 'RULE-CS-640',  steps: 13, risk: 'medium', ago: '7h ago',  product: 'Mortgage',         amount: '$210,000'},
  { id: 'sess-5ea0c812b473', user: 'user-1183', decision: 'APPROVE', rule: 'RULE-INC-220', steps: 8,  risk: 'low',    ago: '9h ago',  product: 'Auto Loan',        amount: '$32,000' },
];

const DECISION_FILTERS = ['All', 'APPROVE', 'DECLINE', 'REVIEW'];
const RISK_FILTERS     = ['All', 'high', 'medium', 'low'];

function DecisionBadge({ d }) {
  const map = { APPROVE: 'badge-green', DECLINE: 'badge-red', REVIEW: 'badge-yellow' };
  return <span className={`badge ${map[d] || 'badge-gray'}`}>{d}</span>;
}
function RiskBadge({ risk }) {
  const map = { high: 'badge-red', medium: 'badge-yellow', low: 'badge-green' };
  return <span className={`badge ${map[risk] || 'badge-gray'} capitalize`}>{risk}</span>;
}

export default function Sessions() {
  const navigate             = useNavigate();
  const [search, setSearch]  = useState('');
  const [decision, setDecision] = useState('All');
  const [risk, setRisk]      = useState('All');

  const filtered = ALL_SESSIONS.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = !q || s.id.includes(q) || s.user.includes(q) || s.product.toLowerCase().includes(q);
    const matchDecision = decision === 'All' || s.decision === decision;
    const matchRisk     = risk === 'All' || s.risk === risk;
    return matchSearch && matchDecision && matchRisk;
  });

  return (
    <AppLayout title="Sessions">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground">Audit Sessions</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Browse and inspect all AI decision audit trails.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary text-sm gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button className="btn-ghost text-sm gap-2 p-2.5">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            className="input pl-9"
            placeholder="Search by session ID, user, or product…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <div className="flex rounded-xl border border-border overflow-hidden">
            {DECISION_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setDecision(f)}
                className={`px-3 py-1.5 text-xs font-semibold transition-colors ${decision === f ? 'bg-indigo-600 text-white' : 'bg-white text-muted-foreground hover:bg-muted'}`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex rounded-xl border border-border overflow-hidden">
            {RISK_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setRisk(f)}
                className={`px-3 py-1.5 text-xs font-semibold transition-colors capitalize ${risk === f ? 'bg-indigo-600 text-white' : 'bg-white text-muted-foreground hover:bg-muted'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total sessions',  value: filtered.length,                                            color: 'text-foreground'   },
          { label: 'Declined',        value: filtered.filter(s => s.decision === 'DECLINE').length,      color: 'text-red-600'      },
          { label: 'Approved',        value: filtered.filter(s => s.decision === 'APPROVE').length,      color: 'text-green-600'    },
        ].map(s => (
          <div key={s.label} className="card p-4 text-center">
            <p className={`font-heading text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <RotateCcw className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No sessions match your filters.</p>
            <button onClick={() => { setSearch(''); setDecision('All'); setRisk('All'); }} className="btn-ghost text-sm mt-3">Clear filters</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 border-b border-border">
                  {['Session ID','User','Product','Amount','Decision','Risk','Steps','When',''].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr
                    key={s.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/session/${s.id}`)}
                  >
                    <td className="px-5 py-3.5"><span className="font-mono text-xs">{s.id}</span></td>
                    <td className="px-5 py-3.5 text-muted-foreground">{s.user}</td>
                    <td className="px-5 py-3.5 text-foreground font-medium">{s.product}</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{s.amount}</td>
                    <td className="px-5 py-3.5"><DecisionBadge d={s.decision} /></td>
                    <td className="px-5 py-3.5"><RiskBadge risk={s.risk} /></td>
                    <td className="px-5 py-3.5 text-muted-foreground text-center">{s.steps}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{s.ago}</td>
                    <td className="px-5 py-3.5">
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-indigo-600 transition-colors" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
