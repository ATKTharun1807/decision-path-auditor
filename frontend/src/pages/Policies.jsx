import React, { useState } from 'react';
import {
  Shield, Plus, Search, Edit2, Trash2, ToggleLeft, ToggleRight,
  ChevronRight, AlertTriangle, CheckCircle, Clock
} from 'lucide-react';
import AppLayout from '../components/AppLayout';

const INITIAL_POLICIES = [
  { id: 'RULE-CS-640',  name: 'Credit Score Threshold',      category: 'Credit',     description: 'Decline loan if credit score < 640.',                  active: true,  severity: 'high',   lastUpdated: '2025-07-15', hits: 847 },
  { id: 'RULE-INC-220', name: 'Income Verification',         category: 'Income',     description: 'Require income docs if annual income < $22,000.',      active: true,  severity: 'medium', lastUpdated: '2025-07-10', hits: 712 },
  { id: 'RULE-DQ-001',  name: 'Delinquency Limit',           category: 'Credit',     description: 'Max 1 delinquency in last 24 months.',                  active: true,  severity: 'high',   lastUpdated: '2025-06-28', hits: 421 },
  { id: 'RULE-FR-055',  name: 'Fraud Score Block',           category: 'Fraud',      description: 'Auto-decline if fraud score > 750.',                   active: true,  severity: 'critical',lastUpdated: '2025-07-20', hits: 298 },
  { id: 'RULE-PII-001', name: 'PII Redaction Required',      category: 'Compliance', description: 'Redact SSN, DOB, and account numbers before logging.', active: true,  severity: 'critical',lastUpdated: '2025-07-01', hits: 1924},
  { id: 'RULE-EU-013',  name: 'EU AI Act Article 13',        category: 'Compliance', description: 'Require explainability report for all credit decisions.',active: false, severity: 'high',   lastUpdated: '2025-07-22', hits: 0   },
  { id: 'RULE-EMP-110', name: 'Employment Stability Check',  category: 'Income',     description: 'Flag review if employment < 6 months at current job.', active: false, severity: 'low',    lastUpdated: '2025-06-15', hits: 0   },
];

const severityColor = {
  critical: 'badge-red',
  high:     'badge-red',
  medium:   'badge-yellow',
  low:      'badge-green',
};
const CATEGORIES = ['All', 'Credit', 'Income', 'Fraud', 'Compliance'];

export default function Policies() {
  const [policies, setPolicies] = useState(INITIAL_POLICIES);
  const [search, setSearch]     = useState('');
  const [cat, setCat]           = useState('All');
  const [showNew, setShowNew]   = useState(false);
  const [newPolicy, setNewPolicy] = useState({ id: '', name: '', category: 'Credit', description: '', severity: 'medium' });
  const [editId, setEditId]     = useState(null);

  const filtered = policies.filter(p => {
    const q = search.toLowerCase();
    const matchQ   = !q || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    const matchCat = cat === 'All' || p.category === cat;
    return matchQ && matchCat;
  });

  const toggle = (id) => setPolicies(ps => ps.map(p => p.id === id ? { ...p, active: !p.active } : p));
  const remove = (id) => { if (window.confirm('Delete this policy?')) setPolicies(ps => ps.filter(p => p.id !== id)); };

  const addPolicy = () => {
    if (!newPolicy.id || !newPolicy.name) return;
    setPolicies(ps => [...ps, { ...newPolicy, active: true, lastUpdated: new Date().toISOString().slice(0,10), hits: 0 }]);
    setNewPolicy({ id: '', name: '', category: 'Credit', description: '', severity: 'medium' });
    setShowNew(false);
  };

  return (
    <AppLayout title="Policies">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground">Policy Engine</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Manage the rules governing AI decisions and compliance requirements.</p>
        </div>
        <button onClick={() => setShowNew(true)} className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> New Policy
        </button>
      </div>

      {/* New policy form */}
      {showNew && (
        <div className="card p-6 mb-6 border-indigo-200 bg-indigo-50/30">
          <h3 className="font-heading font-semibold text-foreground mb-4">Create New Policy</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Rule ID</label>
              <input className="input" placeholder="RULE-XX-000" value={newPolicy.id} onChange={e => setNewPolicy(p => ({ ...p, id: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Name</label>
              <input className="input" placeholder="Policy name" value={newPolicy.name} onChange={e => setNewPolicy(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Category</label>
              <select className="input" value={newPolicy.category} onChange={e => setNewPolicy(p => ({ ...p, category: e.target.value }))}>
                {['Credit','Income','Fraud','Compliance'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Severity</label>
              <select className="input" value={newPolicy.severity} onChange={e => setNewPolicy(p => ({ ...p, severity: e.target.value }))}>
                {['critical','high','medium','low'].map(s => <option key={s} className="capitalize">{s}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Description</label>
              <textarea className="input resize-none" rows={2} placeholder="Describe what this rule does…" value={newPolicy.description} onChange={e => setNewPolicy(p => ({ ...p, description: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={addPolicy} className="btn-primary text-sm">Create Policy</button>
            <button onClick={() => setShowNew(false)} className="btn-secondary text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card p-4 mb-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input className="input pl-9" placeholder="Search policies…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex rounded-xl border border-border overflow-hidden">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)} className={`px-3 py-1.5 text-xs font-semibold transition-colors ${cat === c ? 'bg-indigo-600 text-white' : 'bg-white text-muted-foreground hover:bg-muted'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { icon: CheckCircle, label: 'Active rules',   value: policies.filter(p => p.active).length,   color: 'text-green-600', bg: 'bg-green-50' },
          { icon: Clock,       label: 'Inactive rules', value: policies.filter(p => !p.active).length,  color: 'text-amber-600', bg: 'bg-amber-50' },
          { icon: AlertTriangle,label:'Critical rules', value: policies.filter(p => p.severity === 'critical').length, color: 'text-red-600', bg: 'bg-red-50' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className={`font-heading text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Policy list */}
      <div className="space-y-3">
        {filtered.map(p => (
          <div key={p.id} className={`card p-5 transition-all ${p.active ? '' : 'opacity-60'}`}>
            <div className="flex items-start gap-4">
              {/* Toggle */}
              <button onClick={() => toggle(p.id)} className="mt-0.5 flex-shrink-0 text-muted-foreground hover:text-indigo-600 transition-colors">
                {p.active
                  ? <ToggleRight className="w-8 h-8 text-indigo-600" />
                  : <ToggleLeft  className="w-8 h-8" />}
              </button>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-muted-foreground">{p.id}</span>
                  <span className={`badge ${severityColor[p.severity]} capitalize`}>{p.severity}</span>
                  <span className="badge-gray">{p.category}</span>
                  {!p.active && <span className="badge-gray">Inactive</span>}
                </div>
                <h4 className="font-heading font-semibold text-sm text-foreground">{p.name}</h4>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{p.description}</p>
                <div className="flex items-center gap-4 mt-2 text-[11px] text-muted-foreground">
                  <span>Updated {p.lastUpdated}</span>
                  {p.hits > 0 && <span>{p.hits.toLocaleString()} decisions matched</span>}
                </div>
              </div>
              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button className="btn-ghost p-2 text-muted-foreground hover:text-indigo-600" title="Edit">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => remove(p.id)} className="btn-ghost p-2 text-muted-foreground hover:text-red-500" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="card p-12 text-center">
            <Shield className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No policies match your search.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
