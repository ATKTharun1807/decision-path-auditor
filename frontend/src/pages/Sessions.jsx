import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, ChevronRight, Filter, Download, RefreshCw,
  Clock, AlertTriangle, CheckCircle, RotateCcw, ArrowRight, Shield
} from 'lucide-react';
import AppLayout from '../components/AppLayout';

const SESSIONS_DATA = [
  { id: 'sess-a0dd38bd2155', title: 'Personal Loan Application', user: 'user-7090', decision: 'DECLINE', confidence: '94%', rule: 'RULE-CS-640',  ago: '2 min ago',  amount: '$12,000' },
  { id: 'sess-8b9487775caf', title: 'Auto Loan Financing',       user: 'user-6657', decision: 'DECLINE', confidence: '98%', rule: 'RULE-CS-640',  ago: '8 min ago',  amount: '$8,500'  },
  { id: 'sess-f2a9c1be4d21', title: 'Refinance Application',    user: 'user-2341', decision: 'APPROVE', confidence: '96%', rule: 'RULE-INC-220', ago: '15 min ago', amount: '$24,000' },
  { id: 'sess-71c34e2a9f08', title: 'Mortgage Pre-approval',     user: 'user-8812', decision: 'APPROVE', confidence: '99%', rule: 'RULE-INC-220', ago: '31 min ago', amount: '$340,000'},
  { id: 'sess-3d1ab7f82c69', title: 'Business Credit Line',     user: 'user-5590', decision: 'REVIEW',  confidence: '82%', rule: 'RULE-CS-640',  ago: '1 hour ago', amount: '$50,000' },
];

export default function Sessions() {
  const navigate             = useNavigate();
  const [search, setSearch]  = useState('');
  const [filter, setFilter]  = useState('All');

  const filtered = SESSIONS_DATA.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = !q || s.id.includes(q) || s.user.includes(q) || s.title.toLowerCase().includes(q);
    const matchFilter = filter === 'All' || s.decision === filter;
    return matchSearch && matchFilter;
  });

  return (
    <AppLayout title="Sessions Inbox">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-heading text-xl font-extrabold text-[#1E293B]">Decision Audit Inbox</h2>
          <p className="text-xs text-slate-500 mt-0.5">Inbox view of all agent execution sessions across models.</p>
        </div>

        <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-white p-0.5 shadow-xs">
          {['All', 'APPROVE', 'DECLINE', 'REVIEW'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 text-xs font-bold transition-all rounded-lg ${
                filter === f ? 'bg-[#0EA5A4] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Inbox Search Bar */}
      <div className="aurora-card p-4 mb-6 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by session ID, title, or user ID…"
          className="aurora-input border-none shadow-none bg-transparent focus:ring-0 p-0"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Sessions Inbox Cards */}
      <div className="space-y-3">
        {filtered.map(s => (
          <div
            key={s.id}
            onClick={() => navigate(`/session/${s.id}`)}
            className="aurora-card p-5 hover:border-[#0EA5A4]/50 hover:shadow-aurora-lg transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="font-heading font-extrabold text-[#1E293B] text-base">{s.title}</span>
                <span className={`badge ${
                  s.decision === 'APPROVE' ? 'badge-aurora-emerald' : s.decision === 'DECLINE' ? 'badge-aurora-red' : 'badge-aurora-amber'
                }`}>
                  {s.decision}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                {s.id} · User: {s.user} · Amount: {s.amount} · Rule: {s.rule}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-slate-600 font-semibold font-sans">Confidence: <strong>{s.confidence}</strong></span>
              <span className="text-slate-400">{s.ago}</span>
              <ArrowRight className="w-4 h-4 text-[#0EA5A4]" />
            </div>
          </div>
        ))}
      </div>

    </AppLayout>
  );
}
