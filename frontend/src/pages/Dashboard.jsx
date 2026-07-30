import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Activity, Play, Search, Shield, Cpu, CheckCircle2, AlertTriangle,
  ArrowRight, RefreshCw, Sparkles, Sliders, Zap, Eye, Terminal, Clock
} from 'lucide-react';
import AppLayout from '../components/AppLayout';

const API_BASE_URL = 'http://127.0.0.1:8000';

const MODELS_RUNNING = [
  { name: 'GPT-4o',        provider: 'OpenAI',    latency: '340ms', status: 'Active', color: 'bg-emerald-500' },
  { name: 'Claude 3.5',    provider: 'Anthropic', latency: '210ms', status: 'Active', color: 'bg-teal-500'    },
  { name: 'Gemini 1.5',    provider: 'Google',    latency: '180ms', status: 'Active', color: 'bg-[#0EA5A4]'   },
  { name: 'Llama 3 Local', provider: 'Ollama',    latency: '45ms',  status: 'Active', color: 'bg-indigo-500' },
];

const RECENT_STREAM = [
  { id: 'sess-a0dd38bd2155', agent: 'LoanEvaluator-v4', decision: 'DECLINE', confidence: '96%', rule: 'RULE-CS-640',  steps: 5, ago: '2 min ago', risk: 'High' },
  { id: 'sess-8b9487775caf', agent: 'CreditRiskGuard',  decision: 'DECLINE', confidence: '98%', rule: 'RULE-CS-640',  steps: 5, ago: '8 min ago', risk: 'High' },
  { id: 'sess-f2a9c1be4d21', agent: 'AutoLoanAgent',    decision: 'APPROVE', confidence: '94%', rule: 'RULE-INC-220', steps: 4, ago: '15 min ago', risk: 'Low' },
  { id: 'sess-71c34e2a9f08', agent: 'MortgageBot-v2',   decision: 'APPROVE', confidence: '99%', rule: 'RULE-INC-220', steps: 6, ago: '31 min ago', risk: 'Low' },
];

export default function Dashboard() {
  const navigate      = useNavigate();
  const [query, setQuery]         = useState('');
  const [demoLoading, setDemoLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState(RECENT_STREAM[0]);

  const runDemo = async () => {
    setDemoLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_BASE_URL}/demo/run`, {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      navigate(`/session/${res.data.session_id}`);
    } catch {
      // Fallback redirect to sample session
      navigate('/session/sess-a0dd38bd2155');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <AppLayout title="AI Mission Control">
      
      {/* ── AI Health Banner & Top Command Bar ────────────────────────────── */}
      <div className="mb-6 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-aurora relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-teal-500/10 via-emerald-500/5 to-transparent rounded-full pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-aurora-emerald">🟢 AI Health: 97.4%</span>
              <span className="text-xs text-slate-400 font-mono font-medium">SOC-2 Verified Stream</span>
            </div>
            <h2 className="font-heading text-2xl font-extrabold text-[#1E293B]">AI Decision Mission Control</h2>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={runDemo} disabled={demoLoading} className="btn-aurora text-xs px-4 py-2.5">
              {demoLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Executing AI Session…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Play className="w-3.5 h-3.5 fill-white" />
                  Simulate AI Decision
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
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Policy Violations</p>
            <div className="flex items-baseline justify-between">
              <span className="font-heading text-3xl font-extrabold text-rose-600">3</span>
              <span className="text-xs font-bold text-slate-500">Auto-Blocked</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Compliance Accuracy</p>
            <div className="flex items-baseline justify-between">
              <span className="font-heading text-3xl font-extrabold text-[#0EA5A4]">98.2%</span>
              <span className="text-xs font-bold text-emerald-600">Optimal</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Active AI Models</p>
            <div className="flex items-center gap-1.5 mt-2">
              {MODELS_RUNNING.map(m => (
                <span key={m.name} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-mono font-bold text-slate-700 shadow-2xs" title={`${m.name} (${m.latency})`}>
                  {m.name}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ── Active AI Models Fleet Bar ─────────────────────────────────────── */}
      <div className="mb-6">
        <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-400 mb-3 px-1">
          Active AI Model Fleet
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {MODELS_RUNNING.map(m => (
            <div key={m.name} className="aurora-card p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-2.5 h-2.5 rounded-full ${m.color} animate-pulse`} />
                <div>
                  <p className="font-heading font-bold text-xs text-[#1E293B]">{m.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{m.provider}</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-semibold text-[#0EA5A4] bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60">
                {m.latency}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Decision Stream & Split Inspector Workspace ──────────────────── */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: Decision Stream (Inbox style) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-1 mb-2">
            <h3 className="font-heading font-bold text-sm text-[#1E293B] flex items-center gap-2">
              <span>Decision Stream</span>
              <span className="badge-aurora-teal text-[10px]">Real-Time Audit</span>
            </h3>
            <button onClick={() => navigate('/sessions')} className="text-xs font-bold text-[#0EA5A4] hover:underline">
              View All Inbox →
            </button>
          </div>

          <div className="space-y-3">
            {RECENT_STREAM.map(s => {
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
                    <span>Confidence: <strong className="text-slate-800 font-sans">{s.confidence}</strong></span>
                    <span>Rule: <strong className="text-slate-800">{s.rule}</strong></span>
                    <span className="text-[10px] text-slate-400">{s.ago}</span>
                  </div>

                  {/* Horizontal mini flow pipeline */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">Input</span>
                    <span>→</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">Tool</span>
                    <span>→</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">Policy</span>
                    <span>→</span>
                    <span className={`px-1.5 py-0.5 rounded font-bold ${
                      s.decision === 'APPROVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>{s.decision}</span>
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
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Inspecting Session</span>
                <h4 className="font-heading font-extrabold text-base text-[#1E293B]">{selectedSession.id}</h4>
              </div>
              <button 
                onClick={() => navigate(`/session/${selectedSession.id}`)}
                className="btn-aurora text-xs px-3.5 py-2"
              >
                Inspect Pipeline →
              </button>
            </div>

            {/* Evidence Checklist */}
            <div className="space-y-4 mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 font-heading">
                Evidence Evaluation
              </p>
              
              <div className="space-y-2">
                {[
                  { label: 'Credit Score Evaluation', result: 'Failed (Score: 610 < 640)', ok: false },
                  { label: 'Income Verification',     result: 'Verified ($45,000/yr)',     ok: true  },
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

            {/* Summary Box */}
            <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-200/80 text-xs text-slate-700 leading-relaxed">
              <p className="font-bold text-[#0EA5A4] mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Explainability Summary
              </p>
              The loan application was declined because the applicant's credit score of 610 falls below the mandatory threshold of 640 required by policy <strong>RULE-CS-640</strong>.
            </div>

          </div>
        </div>

      </div>

    </AppLayout>
  );
}
