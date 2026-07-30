import React, { useState } from 'react';
import {
  Shield, Plus, Search, Edit2, Trash2, ToggleLeft, ToggleRight,
  ChevronRight, AlertTriangle, CheckCircle, Clock, X, Sparkles, Sliders, Check
} from 'lucide-react';
import AppLayout from '../components/AppLayout';

const INITIAL_POLICIES = [
  { id: 'RULE-CS-640',  name: 'Credit Score Threshold',      category: 'Credit',     description: 'Decline loan if credit score < 640.',                  active: true,  severity: 'High',     lastUpdated: '2025-07-15', hits: 847,  agents: ['LoanEvaluator-v4', 'CreditRiskGuard'] },
  { id: 'RULE-INC-220', name: 'Income Verification',         category: 'Income',     description: 'Require income docs if annual income < $22,000.',      active: true,  severity: 'Medium',   lastUpdated: '2025-07-10', hits: 712,  agents: ['AutoLoanAgent', 'MortgageBot-v2'] },
  { id: 'RULE-DQ-001',  name: 'Delinquency Limit',           category: 'Credit',     description: 'Max 1 delinquency in last 24 months.',                  active: true,  severity: 'High',     lastUpdated: '2025-06-28', hits: 421,  agents: ['CreditRiskGuard'] },
  { id: 'RULE-FR-055',  name: 'Fraud Score Block',           category: 'Fraud',      description: 'Auto-decline if fraud score > 750.',                   active: true,  severity: 'Critical', lastUpdated: '2025-07-20', hits: 298,  agents: ['FraudDetect-Pro'] },
  { id: 'RULE-PII-001', name: 'PII Redaction Required',      category: 'Compliance', description: 'Redact SSN, DOB, and account numbers before logging.', active: true,  severity: 'Critical', lastUpdated: '2025-07-01', hits: 1924, agents: ['All Active Agents'] },
  { id: 'RULE-EU-013',  name: 'EU AI Act Article 13',        category: 'Compliance', description: 'Require explainability report for all credit decisions.',active: false, severity: 'High',     lastUpdated: '2025-07-22', hits: 0,    agents: ['AuditAI Pipeline'] },
];

const CATEGORIES = ['All', 'Credit', 'Income', 'Fraud', 'Compliance'];

export default function Policies() {
  const [policies, setPolicies] = useState(INITIAL_POLICIES);
  const [search, setSearch]     = useState('');
  const [cat, setCat]           = useState('All');
  const [selectedPolicy, setSelectedPolicy] = useState(null); // Right drawer state
  const [showNew, setShowNew]   = useState(false);
  const [newPolicy, setNewPolicy] = useState({ id: '', name: '', category: 'Credit', description: '', severity: 'Medium' });

  const filtered = policies.filter(p => {
    const q = search.toLowerCase();
    const matchQ   = !q || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
    const matchCat = cat === 'All' || p.category === cat;
    return matchQ && matchCat;
  });

  const togglePolicy = (id) => {
    setPolicies(ps => ps.map(p => p.id === id ? { ...p, active: !p.active } : p));
    if (selectedPolicy?.id === id) {
      setSelectedPolicy(prev => prev ? { ...prev, active: !prev.active } : null);
    }
  };

  const addPolicy = () => {
    if (!newPolicy.id || !newPolicy.name) return;
    const item = { ...newPolicy, active: true, lastUpdated: new Date().toISOString().slice(0,10), hits: 0, agents: ['Custom Agent'] };
    setPolicies(ps => [...ps, item]);
    setNewPolicy({ id: '', name: '', category: 'Credit', description: '', severity: 'Medium' });
    setShowNew(false);
  };

  return (
    <AppLayout title="Policy Engine">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-heading text-xl font-extrabold text-[#1E293B]">Policy Engine Rules</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage deterministic rules governing AI agent decision compliance.</p>
        </div>
        <button onClick={() => setShowNew(true)} className="btn-aurora text-xs">
          <Plus className="w-4 h-4" /> New Policy Rule
        </button>
      </div>

      {/* New Policy Form */}
      {showNew && (
        <div className="aurora-card p-6 mb-6 border-[#0EA5A4]/40 bg-teal-50/20">
          <h3 className="font-heading font-bold text-[#1E293B] text-sm mb-4">Create New Policy Rule</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Rule ID</label>
              <input className="aurora-input" placeholder="RULE-XX-000" value={newPolicy.id} onChange={e => setNewPolicy(p => ({ ...p, id: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Policy Name</label>
              <input className="aurora-input" placeholder="Policy name" value={newPolicy.name} onChange={e => setNewPolicy(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
              <select className="aurora-input" value={newPolicy.category} onChange={e => setNewPolicy(p => ({ ...p, category: e.target.value }))}>
                {['Credit','Income','Fraud','Compliance'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Severity</label>
              <select className="aurora-input" value={newPolicy.severity} onChange={e => setNewPolicy(p => ({ ...p, severity: e.target.value }))}>
                {['Critical','High','Medium','Low'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Rule Description</label>
              <textarea className="aurora-input resize-none" rows={2} placeholder="Describe rule evaluation logic…" value={newPolicy.description} onChange={e => setNewPolicy(p => ({ ...p, description: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={addPolicy} className="btn-aurora text-xs">Create Policy</button>
            <button onClick={() => setShowNew(false)} className="btn-aurora-secondary text-xs">Cancel</button>
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="aurora-card p-4 mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input className="aurora-input pl-10" placeholder="Search policies by name or ID…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-slate-100/60 p-0.5">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)} className={`px-3 py-1.5 text-xs font-bold transition-all rounded-lg ${cat === c ? 'bg-white text-[#0EA5A4] shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Hexagon / Card Grid Layout */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(p => (
          <div
            key={p.id}
            onClick={() => setSelectedPolicy(p)}
            className={`policy-hexagon-card ${!p.active ? 'opacity-60' : ''}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs font-bold text-[#0EA5A4]">{p.id}</span>
              <span className={`badge ${
                p.severity === 'Critical' || p.severity === 'High' ? 'badge-aurora-red' : 'badge-aurora-amber'
              }`}>
                {p.severity}
              </span>
            </div>

            <h4 className="font-heading font-extrabold text-[#1E293B] text-base mb-1">{p.name}</h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">{p.description}</p>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
              <span className="font-semibold text-slate-700">{p.hits.toLocaleString()} Decisions Matched</span>
              <span className="text-[#0EA5A4] font-bold">Inspect →</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Slide-Over Policy Drawer (Right Side) ─────────────────────────── */}
      {selectedPolicy && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-md bg-white border-l border-slate-200 h-full p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
            
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-[#0EA5A4]">Policy Drawer Inspector</span>
                  <h3 className="font-heading font-extrabold text-xl text-[#1E293B]">{selectedPolicy.id}</h3>
                </div>
                <button onClick={() => setSelectedPolicy(null)} className="btn-aurora-ghost p-1.5">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Policy Details */}
              <div className="space-y-5">
                <div>
                  <h4 className="font-heading font-bold text-sm text-[#1E293B] mb-1">{selectedPolicy.name}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{selectedPolicy.description}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Category:</span>
                    <span className="font-bold text-slate-800">{selectedPolicy.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Severity Level:</span>
                    <span className="font-bold text-rose-600">{selectedPolicy.severity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Matched Decisions:</span>
                    <span className="font-mono font-bold text-[#0EA5A4]">{selectedPolicy.hits.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Last Modified:</span>
                    <span className="font-mono text-slate-700">{selectedPolicy.lastUpdated}</span>
                  </div>
                </div>

                {/* AI Agents Using It */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 font-heading mb-2">
                    Linked AI Agents
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedPolicy.agents.map(a => (
                      <span key={a} className="px-2.5 py-1 rounded-xl bg-teal-50 border border-teal-200/80 text-xs font-mono font-bold text-[#0EA5A4]">
                        🤖 {a}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">
                Status: {selectedPolicy.active ? '🟢 Active' : '🔴 Inactive'}
              </span>
              <button 
                onClick={() => togglePolicy(selectedPolicy.id)}
                className={`btn-aurora text-xs ${!selectedPolicy.active ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}`}
              >
                {selectedPolicy.active ? 'Disable Policy' : 'Activate Policy'}
              </button>
            </div>

          </div>
        </div>
      )}

    </AppLayout>
  );
}
