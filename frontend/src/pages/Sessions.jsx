import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Search, ChevronRight, Filter, Download, RefreshCw,
  Clock, AlertTriangle, CheckCircle, RotateCcw, ArrowRight, Shield, Zap
} from 'lucide-react';
import AppLayout from '../components/AppLayout';

const API_BASE_URL = 'http://127.0.0.1:8000';

const FALLBACK_SESSIONS = [
  { id: 'sess-a0dd38bd2155', title: 'Personal Loan Application', user: 'user-7090', decision: 'DECLINE', confidence: '94%', rule: 'RULE-CS-640',  ago: '2 min ago',  amount: '$12,000' },
  { id: 'sess-8b9487775caf', title: 'Auto Loan Financing',       user: 'user-6657', decision: 'DECLINE', confidence: '98%', rule: 'RULE-CS-640',  ago: '8 min ago',  amount: '$8,500'  },
  { id: 'sess-f2a9c1be4d21', title: 'Refinance Application',    user: 'user-2341', decision: 'APPROVE', confidence: '96%', rule: 'RULE-INC-220', ago: '15 min ago', amount: '$24,000' },
  { id: 'sess-71c34e2a9f08', title: 'Mortgage Pre-approval',     user: 'user-8812', decision: 'APPROVE', confidence: '99%', rule: 'RULE-INC-220', ago: '31 min ago', amount: '$340,000'},
  { id: 'sess-3d1ab7f82c69', title: 'Business Credit Line',     user: 'user-5590', decision: 'REVIEW',  confidence: '82%', rule: 'RULE-CS-640',  ago: '1 hour ago', amount: '$50,000' },
];

export default function Sessions() {
  const navigate             = useNavigate();
  const [sessions, setSessions] = useState(FALLBACK_SESSIONS);
  const [search, setSearch]  = useState('');
  const [filter, setFilter]  = useState('All');
  const [loading, setLoading]= useState(false);

  const fetchSessions = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/sessions`);
      if (Array.isArray(res.data) && res.data.length > 0) {
        setSessions(res.data);
      }
    } catch {
      // Keep fallback
    }
  };

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 4000);
    return () => clearInterval(interval);
  }, []);

  const filtered = sessions.filter(s => {
    const q = search.toLowerCase();
    const sid = (s.id || s.session_id || '').toLowerCase();
    const uid = (s.user || s.user_id || '').toLowerCase();
    const agent = (s.agent || s.title || '').toLowerCase();
    
    const matchSearch = !q || sid.includes(q) || uid.includes(q) || agent.includes(q);
    const matchFilter = filter === 'All' || s.decision === filter;
    return matchSearch && matchFilter;
  });

  return (
    <AppLayout title="Sessions Inbox">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-heading text-xl font-extrabold text-[#1E293B]">Decision Audit Inbox</h2>
            <span className="badge-aurora-emerald text-[10px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live DB Polling (4s)
            </span>
          </div>
          <p className="text-xs text-slate-500">Inbox view of all agent execution sessions across models.</p>
        </div>

        <div className="flex items-center gap-3">
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

          <button onClick={fetchSessions} className="btn-aurora-secondary p-2">
            <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter sessions by ID (e.g. sess-a0dd), User, or Model…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="aurora-input pl-10 text-xs py-2.5"
          />
        </div>
      </div>

      {/* Sessions Table Container */}
      <div className="aurora-card p-0 overflow-hidden bg-white border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Session ID</th>
                <th className="py-3.5 px-4">AI Agent Model</th>
                <th className="py-3.5 px-4">User ID</th>
                <th className="py-3.5 px-4">Verdict</th>
                <th className="py-3.5 px-4">Rule Evaluated</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filtered.map(s => {
                const sid = s.id || s.session_id;
                const isDecline = s.decision === 'DECLINE';
                const isApprove = s.decision === 'APPROVE';

                return (
                  <tr key={sid} className="hover:bg-teal-50/30 transition-colors group cursor-pointer" onClick={() => navigate(`/session/${sid}`)}>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#1E293B]">
                      {sid}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {s.agent || s.title || 'LoanEvaluator-v4'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {s.user || s.user_id || 'user-1049'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold font-mono ${
                        isDecline ? 'badge-aurora-red' : isApprove ? 'badge-aurora-emerald' : 'badge-aurora-amber'
                      }`}>
                        {s.decision}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-500">
                      {s.rule || 'RULE-CS-640'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/session/${sid}`); }}
                        className="btn-aurora-secondary text-[11px] px-3 py-1 flex items-center gap-1 ml-auto"
                      >
                        <span>Inspect Flow</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </AppLayout>
  );
}
