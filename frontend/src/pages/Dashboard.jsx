import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Activity, Play, Search, Shield, Cpu, CheckCircle2, AlertTriangle,
  ArrowRight, RefreshCw, Sparkles, Sliders, Zap, Eye, Terminal, Clock, Filter
} from 'lucide-react';
import AppLayout from '../components/AppLayout';

const API_BASE_URL = 'http://127.0.0.1:8000';

const RECENT_STREAM = [
  { id: 'sess-a0dd38bd2155', agent: 'LoanEvaluator-v4', decision: 'DECLINE', confidence: '96%', rule: 'RULE-CS-640',  steps: 5, ago: '2 min ago', risk: 'High', user: 'user-7090' },
  { id: 'sess-8b9487775caf', agent: 'CreditRiskGuard',  decision: 'DECLINE', confidence: '98%', rule: 'RULE-CS-640',  steps: 5, ago: '8 min ago', risk: 'High', user: 'user-6657' },
  { id: 'sess-f2a9c1be4d21', agent: 'AutoLoanAgent',    decision: 'APPROVE', confidence: '94%', rule: 'RULE-INC-220', steps: 4, ago: '15 min ago', risk: 'Low', user: 'user-2341' },
  { id: 'sess-71c34e2a9f08', agent: 'MortgageBot-v2',   decision: 'APPROVE', confidence: '99%', rule: 'RULE-INC-220', steps: 6, ago: '31 min ago', risk: 'Low', user: 'user-8812' },
];

export default function Dashboard() {
  const navigate                  = useNavigate();
  const [query, setQuery]         = useState('');
  const [searchError, setSearchError] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [recentStream, setRecentStream] = useState(RECENT_STREAM);
  const [selectedSession, setSelectedSession] = useState(RECENT_STREAM[0]);

  useEffect(() => {
    const fetchStream = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/sessions`);
        if (Array.isArray(res.data) && res.data.length > 0) {
          const top4 = res.data.slice(0, 4);
          setRecentStream(top4);
          setSelectedSession(prev => top4.find(s => s.id === prev.id) || top4[0]);
        }
      } catch (e) {}
    };
    fetchStream();
    const interval = setInterval(fetchStream, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleLookup = async (e) => {
    if (e) e.preventDefault();
    const cleanQ = query.trim();
    if (!cleanQ) return;
    
    setSearchLoading(true);
    setSearchError('');
    try {
      if (cleanQ.startsWith('sess-')) {
        navigate(`/session/${cleanQ}`);
      } else {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/decision-path/user/${cleanQ}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const sessions = Object.keys(res.data);
        if (sessions.length > 0) {
          navigate(`/session/${sessions[0]}`);
        } else {
          setSearchError(`No session found for User ID "${cleanQ}".`);
        }
      }
    } catch {
      navigate(`/session/${cleanQ}`);
    } finally {
      setSearchLoading(false);
    }
  };

  const runDemo = async () => {
    setDemoLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_BASE_URL}/demo/run`, {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      navigate(`/session/${res.data.session_id}`);
    } catch {
      navigate('/session/sess-a0dd38bd2155');
    } finally {
      setDemoLoading(false);
    }
  };

  const generate50Demo = async () => {
    setDemoLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_BASE_URL}/demo/generate`, {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.data?.sample_sessions?.length > 0) {
        navigate(`/session/${res.data.sample_sessions[0].session_id}`);
      } else {
        navigate('/sessions');
      }
    } catch {
      navigate('/sessions');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <AppLayout title="AI Mission Control">
      
      {/* ── AI Health Banner ────────────────────────────────────────────────── */}
      <div className="mb-6 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-aurora relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-teal-500/10 via-emerald-500/5 to-transparent rounded-full pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-aurora-emerald">🟢 System Uptime: 99.9%</span>
              <span className="text-xs text-slate-400 font-mono font-medium">Secure & Compliant</span>
            </div>
            <h2 className="font-heading text-2xl font-extrabold text-[#1E293B]">Loan Decisions Overview</h2>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={generate50Demo} disabled={demoLoading} className="btn-aurora-secondary text-xs px-4 py-2.5 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Create Test Applications</span>
            </button>
            <button onClick={runDemo} disabled={demoLoading} className="btn-aurora text-xs px-4 py-2.5">
              {demoLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Play className="w-3.5 h-3.5 fill-white" />
                  Process New Application
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 4 Health Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Today's Decisions</p>
            <div className="flex items-baseline justify-between">
              <span className="font-heading text-3xl font-extrabold text-[#1E293B]">142</span>
              <span className="text-xs font-bold text-emerald-600">+14% vs avg</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Declined (Policy)</p>
            <div className="flex items-baseline justify-between">
              <span className="font-heading text-3xl font-extrabold text-rose-600">3</span>
              <span className="text-xs font-bold text-slate-500">Auto-Declined</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Approval Accuracy</p>
            <div className="flex items-baseline justify-between">
              <span className="font-heading text-3xl font-extrabold text-[#0EA5A4]">98.2%</span>
              <span className="text-xs font-bold text-emerald-600">Optimal</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">System Speed</p>
            <div className="flex items-center justify-between mt-2">
              <span className="badge-aurora-teal text-xs">Fast</span>
              <span className="text-xs font-mono font-bold text-slate-600">24ms avg</span>
            </div>
          </div>
        </div>

      </div>

      {/* ── Prominent Session & User ID Lookup Widget with Quick Test Chips ── */}
      <div className="mb-6 aurora-card p-5 border-[#0EA5A4]/40 bg-teal-50/20">
        <div className="flex items-center gap-2 mb-2">
          <Search className="w-4 h-4 text-[#0EA5A4]" />
          <h3 className="font-heading font-bold text-sm text-[#1E293B]">Search for an Application</h3>
          <span className="badge-aurora-teal text-[10px]">Quick Search</span>
        </div>
        <p className="text-xs text-slate-500 mb-3">
          Enter an <strong>Application ID</strong> or <strong>User ID</strong> to see exactly why a loan was approved or declined.
        </p>

        <form onSubmit={handleLookup} className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="e.g. sess-8b9487775caf or user-6657"
              className="aurora-input"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <button type="submit" disabled={searchLoading} className="btn-aurora text-xs px-5">
            {searchLoading ? 'Searching…' : 'Search →'}
          </button>
        </form>

        {/* Quick Test Examples */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium text-[11px]">Click Quick Examples:</span>
          
          <button
            type="button"
            onClick={() => { setQuery('sess-8b9487775caf'); navigate('/session/sess-8b9487775caf'); }}
            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#0EA5A4] text-slate-700 font-mono text-[11px] font-semibold transition-colors shadow-2xs flex items-center gap-1"
          >
            <span>Session 1:</span>
            <span className="text-[#0EA5A4]">sess-8b9487775caf</span>
          </button>

          <button
            type="button"
            onClick={() => { setQuery('sess-f2a9c1be4d21'); navigate('/session/sess-f2a9c1be4d21'); }}
            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#0EA5A4] text-slate-700 font-mono text-[11px] font-semibold transition-colors shadow-2xs flex items-center gap-1"
          >
            <span>Session 2:</span>
            <span className="text-[#0EA5A4]">sess-f2a9c1be4d21</span>
          </button>

          <button
            type="button"
            onClick={() => { setQuery('user-6657'); navigate('/session/sess-8b9487775caf'); }}
            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#0EA5A4] text-slate-700 font-mono text-[11px] font-semibold transition-colors shadow-2xs flex items-center gap-1"
          >
            <span>User ID:</span>
            <span className="text-emerald-700">user-6657</span>
          </button>
        </div>

        {searchError && <p className="text-xs text-rose-600 mt-2">{searchError}</p>}
      </div>

      {/* ── Decision Stream & Split Inspector Workspace ──────────────────── */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: Decision Stream */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-1 mb-2">
            <h3 className="font-heading font-bold text-sm text-[#1E293B] flex items-center gap-2">
              <span>Recent Applications</span>
              <span className="badge-aurora-teal text-[10px]">Live Updates</span>
            </h3>
            <button onClick={() => navigate('/sessions')} className="text-xs font-bold text-[#0EA5A4] hover:underline">
              View All Inbox →
            </button>
          </div>

          <div className="space-y-3">
            {recentStream.map(s => {
              const isSelected = selectedSession.id === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedSession(s)}
                  className={`aurora-card p-4 cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? 'border-[#0EA5A4] bg-teal-50/20 ring-2 ring-[#0EA5A4]/20 shadow-aurora-lg' 
                      : 'hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#1E293B]">{s.id}</span>
                      <span className="text-xs font-semibold text-slate-500">· {s.agent}</span>
                    </div>
                    <span className={`badge ${
                      s.decision === 'APPROVE' ? 'badge-aurora-emerald' : 'badge-aurora-red'
                    }`}>
                      {s.decision}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span>User: <strong className="text-slate-800">{s.user}</strong></span>
                    <span>Confidence: <strong className="text-slate-800 font-sans">{s.confidence}</strong></span>
                    <span className="text-[10px] text-slate-400">{s.ago}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 5 Cols: Selected Session Quick Inspector */}
        <div className="lg:col-span-5">
          <div className="aurora-card p-6 sticky top-20 border-teal-200/60 shadow-aurora-lg">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Inspecting Application</span>
                <h4 className="font-heading font-extrabold text-base text-[#1E293B]">{selectedSession.id}</h4>
              </div>
              <button 
                onClick={() => navigate(`/session/${selectedSession.id}`)}
                className="btn-aurora text-xs px-3.5 py-2"
              >
                View Full Details →
              </button>
            </div>

            {/* Evidence Checklist */}
            <div className="space-y-4 mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 font-heading">
                Evidence Evaluation
              </p>
              
              <div className="space-y-2">
                {[
                  { 
                    label: 'Credit Score Evaluation', 
                    result: selectedSession.decision === 'APPROVE' ? 'Passed (Score: 720 > 640)' : 'Failed (Score: 610 < 640)', 
                    ok: selectedSession.decision === 'APPROVE' 
                  },
                  { label: 'Income Verification',     result: 'Verified',     ok: true  },
                  { label: 'PII Redaction Active',    result: 'SSN & DOB Redacted',        ok: true  },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-slate-800">{item.label}</p>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">{item.result}</p>
                    </div>
                    <span className={item.ok ? 'badge-aurora-emerald' : 'badge-aurora-red'}>
                      {item.ok ? '✓ PASS' : '✗ FAIL'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-200/80 text-xs text-slate-700 leading-relaxed">
              <p className="font-bold text-[#0EA5A4] mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Explainability Summary
              </p>
              {selectedSession.decision === 'APPROVE' ? (
                <>The application was <strong>approved</strong> because the applicant meets the mandatory threshold required by policy <strong>RULE-CS-640</strong>.</>
              ) : (
                <>The application was <strong>declined</strong> because the applicant falls below the mandatory threshold required by policy <strong>RULE-CS-640</strong>.</>
              )}
            </div>

          </div>
        </div>

      </div>

    </AppLayout>
  );
}
