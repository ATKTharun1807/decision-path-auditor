import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Search, Play, TrendingUp, AlertTriangle, CheckCircle, Activity,
  ChevronRight, ArrowUpRight, Zap, Cpu
} from 'lucide-react';
import AppLayout from '../components/AppLayout';

const API_BASE_URL = 'http://127.0.0.1:8000';

/* ─── KPI cards ──────────────────────────────────────────── */
const KPI_CARDS = [
  {
    label: 'Active Sessions',
    value: '247',
    change: '+12%',
    up: true,
    icon: Activity,
    color: 'indigo',
    sub: 'last 24 hours',
  },
  {
    label: 'AI Decisions',
    value: '18,400',
    change: '+8.3%',
    up: true,
    icon: Cpu,
    color: 'violet',
    sub: 'this month',
  },
  {
    label: 'Compliance Score',
    value: '98%',
    change: '+2pts',
    up: true,
    icon: CheckCircle,
    color: 'green',
    sub: 'vs last month',
  },
  {
    label: 'Active Alerts',
    value: '2',
    change: '-1',
    up: false,
    icon: AlertTriangle,
    color: 'amber',
    sub: 'require attention',
  },
];

const kpiColors = {
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', ring: 'ring-indigo-200' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-600', ring: 'ring-violet-200' },
  green:  { bg: 'bg-green-50',  text: 'text-green-600',  ring: 'ring-green-200'  },
  amber:  { bg: 'bg-amber-50',  text: 'text-amber-600',  ring: 'ring-amber-200'  },
};

/* ─── Recent activity feed ───────────────────────────────── */
const RECENT = [
  { id: 'sess-a0dd38bd2155', user: 'user-7090', decision: 'DECLINE', rule: 'RULE-CS-640', steps: 10, ago: '2m ago',  risk: 'high'   },
  { id: 'sess-8b9487775caf', user: 'user-6657', decision: 'DECLINE', rule: 'RULE-CS-640', steps: 10, ago: '8m ago',  risk: 'high'   },
  { id: 'sess-f2a9c1be4d21', user: 'user-2341', decision: 'APPROVE', rule: 'RULE-CS-640', steps: 8,  ago: '15m ago', risk: 'low'    },
  { id: 'sess-71c34e2a9f08', user: 'user-8812', decision: 'APPROVE', rule: 'RULE-INC-220',steps: 12, ago: '31m ago', risk: 'low'    },
  { id: 'sess-3d1ab7f82c69', user: 'user-5590', decision: 'REVIEW',  rule: 'RULE-CS-640', steps: 9,  ago: '1h ago',  risk: 'medium' },
];

function DecisionBadge({ d }) {
  const map = {
    APPROVE: 'badge-green',
    DECLINE: 'badge-red',
    REVIEW:  'badge-yellow',
  };
  return <span className={`badge ${map[d] || 'badge-gray'}`}>{d}</span>;
}

function RiskDot({ risk }) {
  const map = { high: 'bg-red-500', medium: 'bg-amber-400', low: 'bg-green-400' };
  return <span className={`w-2 h-2 rounded-full ${map[risk]}`} />;
}

/* ─── Approval rate mini chart (pure CSS) ───────────────── */
function ApprovalBar({ pct }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-mono text-muted-foreground w-8 text-right">{pct}%</span>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────── */
export default function Dashboard() {
  const navigate    = useNavigate();
  const [query,     setQuery]     = useState('');
  const [error,     setError]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    try {
      if (query.startsWith('sess-')) {
        navigate(`/session/${query}`);
      } else {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/decision-path/user/${query}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sessions = Object.keys(res.data);
        if (sessions.length > 0) navigate(`/session/${sessions[0]}`);
        else setError('No sessions found.');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const runDemo = async () => {
    setDemoLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_BASE_URL}/demo/run`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate(`/session/${res.data.session_id}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Demo failed');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <AppLayout title="Overview">
          {/* Greeting */}
          <div className="mb-8">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-1">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'} 👋
            </h2>
            <p className="text-muted-foreground text-sm">
              Monitor your AI systems, inspect reasoning, and ensure regulatory compliance.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 mb-6 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* KPI cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
            {KPI_CARDS.map((k) => {
              const Icon  = k.icon;
              const color = kpiColors[k.color];
              return (
                <div key={k.label} className="kpi-card group hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color.bg} ring-1 ${color.ring} group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-5 h-5 ${color.text}`} />
                    </div>
                    <span className={k.up ? 'kpi-change-up flex items-center gap-0.5' : 'kpi-change-down flex items-center gap-0.5'}>
                      <TrendingUp className="w-3 h-3" />
                      {k.change}
                    </span>
                  </div>
                  <p className="kpi-value">{k.value}</p>
                  <p className="kpi-label">{k.label}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{k.sub}</p>
                </div>
              );
            })}
          </div>

          {/* Action row */}
          <div className="grid lg:grid-cols-2 gap-5 mb-8">
            {/* Search */}
            <div className="card p-6">
              <h3 className="font-heading font-semibold text-foreground mb-1">Query decision paths</h3>
              <p className="text-sm text-muted-foreground mb-5">Look up an audited decision by session or user ID.</p>
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    className="input pl-9"
                    placeholder="sess-abc123 or user-456"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                  />
                </div>
                <button type="submit" disabled={loading} className="btn-primary px-4 py-2.5 text-sm">
                  {loading ? (
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  ) : 'Search'}
                </button>
              </form>
            </div>

            {/* Run demo */}
            <div className="card p-6 bg-gradient-to-br from-indigo-50 to-violet-50 border-indigo-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-200/30 to-transparent rounded-full -mr-12 -mt-12" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-indigo-600" />
                  <h3 className="font-heading font-semibold text-foreground">Simulate a decision</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-5">Run a fresh AI loan decision and instantly view its audit trail.</p>
                <button onClick={runDemo} disabled={demoLoading} className="btn-primary text-sm">
                  {demoLoading ? (
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  ) : <Play className="w-4 h-4 fill-white" />}
                  {demoLoading ? 'Running…' : 'Run Demo Agent'}
                </button>
              </div>
            </div>
          </div>

          {/* Approval rates */}
          <div className="grid lg:grid-cols-3 gap-5 mb-8">
            <div className="card p-6">
              <h3 className="font-heading font-semibold text-foreground text-sm mb-4">Decision breakdown</h3>
              <div className="space-y-4">
                {[
                  { label: 'Approved', pct: 62, color: 'bg-green-400' },
                  { label: 'Declined', pct: 29, color: 'bg-red-400'   },
                  { label: 'Review',   pct: 9,  color: 'bg-amber-400' },
                ].map(r => (
                  <div key={r.label}>
                    <div className="flex justify-between text-xs font-medium text-muted-foreground mb-1">
                      <span>{r.label}</span>
                    </div>
                    <ApprovalBar pct={r.pct} />
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-heading font-semibold text-foreground text-sm mb-4">Top tool calls</h3>
              <div className="space-y-3">
                {[
                  { name: 'credit_bureau_lookup', calls: 847, pct: 91 },
                  { name: 'income_verification',  calls: 712, pct: 77 },
                  { name: 'policy_engine_check',  calls: 923, pct: 99 },
                ].map(t => (
                  <div key={t.name}>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span className="font-mono truncate max-w-[140px]">{t.name}</span>
                      <span>{t.calls}</span>
                    </div>
                    <ApprovalBar pct={t.pct} />
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-heading font-semibold text-foreground text-sm mb-4">Compliance overview</h3>
              <div className="space-y-3">
                {[
                  { label: 'EU AI Act',     status: 'Compliant', ok: true  },
                  { label: 'ISO 42001',     status: 'Compliant', ok: true  },
                  { label: 'NIST AI RMF',  status: 'Partial',   ok: false },
                  { label: 'SOC 2',        status: 'Compliant', ok: true  },
                ].map(c => (
                  <div key={c.label} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                    <span className="text-sm text-foreground font-medium">{c.label}</span>
                    <span className={c.ok ? 'badge-green' : 'badge-yellow'}>{c.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent sessions table */}
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-heading font-semibold text-foreground">Recent Sessions</h3>
              <button onClick={() => navigate('/sessions')} className="text-sm text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-1">
                View all <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/40 border-b border-border">
                    <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Session</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">User</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Decision</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rule</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Steps</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Risk</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">When</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {RECENT.map((r, i) => (
                    <tr
                      key={r.id}
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer group"
                      onClick={() => navigate(`/session/${r.id}`)}
                    >
                      <td className="px-6 py-3.5">
                        <span className="font-mono text-xs text-foreground font-medium">{r.id}</span>
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground">{r.user}</td>
                      <td className="px-4 py-3.5"><DecisionBadge d={r.decision} /></td>
                      <td className="px-4 py-3.5"><span className="font-mono text-xs text-muted-foreground">{r.rule}</span></td>
                      <td className="px-4 py-3.5 text-muted-foreground">{r.steps}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <RiskDot risk={r.risk} />
                          <span className="text-xs capitalize text-muted-foreground">{r.risk}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-muted-foreground">{r.ago}</td>
                      <td className="px-4 py-3.5">
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
    </AppLayout>
  );
}
