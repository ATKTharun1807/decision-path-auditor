import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Activity, Zap, Check, ArrowRight, Play, Layers,
  Lock, Eye, GitBranch, BarChart3, AlertTriangle, Cpu, Code2,
  Terminal, Sparkles, Server, CheckCircle2, ArrowUpRight, ChevronRight
} from 'lucide-react';

/* ─── Live Hero Pipeline Animation Data ─────────────────── */
const HERO_PIPELINE_STEPS = [
  { step: '01', title: 'User Input',       detail: 'Loan Application ($12,000)', status: 'complete', time: '0ms',   icon: UserIcon },
  { step: '02', title: 'Context Retrieval',detail: 'Fetched credit_history for user-7090', status: 'complete', time: '4ms',   icon: DatabaseIcon },
  { step: '03', title: 'Tool Execution',   detail: 'Executed credit_bureau_lookup API', status: 'complete', time: '14ms',  icon: Code2Icon },
  { step: '04', title: 'Policy Engine',    detail: 'Evaluated RULE-CS-640 (Score: 610 < 640)', status: 'flagged',  time: '2ms',   icon: ShieldIcon },
  { step: '05', title: 'AI Reasoning',     detail: 'Credit score below threshold requirement', status: 'complete', time: '18ms',  icon: CpuIcon },
  { step: '06', title: 'Audit Trail',      detail: 'Persisted to immutable SQLite audit store', status: 'complete', time: '1ms',   icon: LayersIcon },
];

function UserIcon() { return <div className="w-2 h-2 rounded-full bg-[#0F766E]" />; }
function DatabaseIcon() { return <div className="w-2 h-2 rounded-full bg-blue-500" />; }
function Code2Icon() { return <div className="w-2 h-2 rounded-full bg-[#0EA5A4]" />; }
function ShieldIcon() { return <div className="w-2 h-2 rounded-full bg-amber-500" />; }
function CpuIcon() { return <div className="w-2 h-2 rounded-full bg-purple-500" />; }
function LayersIcon() { return <div className="w-2 h-2 rounded-full bg-emerald-500" />; }

const FRAMEWORKS = [
  { name: 'OpenAI',    icon: '⚡' },
  { name: 'Anthropic', icon: '🧠' },
  { name: 'LangChain', icon: '🦜' },
  { name: 'LangGraph', icon: '🕸' },
  { name: 'FastAPI',   icon: '🚀' },
  { name: 'PostgreSQL',icon: '🐘' },
];

const CAPABILITIES = [
  { label: 'Supported Tool Types', value: '20+', sub: 'API calls, SQL queries, Vector DBs' },
  { label: 'Decision Replay Mode', value: 'Realtime', sub: 'Node-by-node execution playback' },
  { label: 'PII Data Redaction',   value: '100%', sub: 'Automatic SSN, DOB, Account masking' },
  { label: 'Logging Overhead',     value: '<20ms', sub: 'Zero impact on model response latency' },
];

export default function Landing() {
  const navigate                  = useNavigate();
  const [activeStep, setActiveStep] = useState(3);
  const [activeWorkflowTab, setActiveWorkflowTab] = useState(0);

  // Cycle the live hero flow animation
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % HERO_PIPELINE_STEPS.length);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans selection:bg-[#0F766E]/20 selection:text-[#0F766E]">
      
      {/* ── Compact Enterprise Navbar ────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 lg:px-12 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-9 h-9 rounded-xl bg-[#0F766E] flex items-center justify-center text-white shadow-sm shadow-[#0F766E]/30">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="font-heading font-extrabold text-[#1E293B] text-lg tracking-tight">AuditAI</span>
            <span className="ml-2 text-[10px] font-mono font-bold uppercase text-[#0F766E] bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              Decision Path Auditor
            </span>
          </div>
        </div>

        {/* Center Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
          <a href="#how-it-works" className="hover:text-[#0F766E] transition-colors">How It Works</a>
          <a href="#dashboard-preview" className="hover:text-[#0F766E] transition-colors">Live Mission Control</a>
          <a href="#architecture" className="hover:text-[#0F766E] transition-colors">Architecture</a>
          <a href="#capabilities" className="hover:text-[#0F766E] transition-colors">Capabilities</a>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/login')} className="btn-aurora-secondary text-xs px-4 py-2">
            Sign In
          </button>
          <button onClick={() => navigate('/dashboard')} className="btn-aurora text-xs px-4 py-2">
            Launch Mission Control →
          </button>
        </div>
      </header>


      {/* ── Section 1: Hero Section (Split Layout, 80vh max, NO empty whitespace) ── */}
      <section className="relative px-6 lg:px-12 py-10 lg:py-14 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-[#0F766E] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              Enterprise AI Governance & Explainability Engine
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-[#1E293B] tracking-tight leading-[1.12]">
              Know Exactly Why Your AI Made Every Decision.
            </h1>

            <p className="text-slate-600 text-base leading-relaxed max-w-xl">
              AuditAI intercepts raw tool calls, agent execution chains, and PII redactions in real time — transforming black-box model outputs into deterministic, compliance-ready audit trails.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button onClick={() => navigate('/dashboard')} className="btn-aurora text-sm px-6 py-3 shadow-aurora">
                Start Auditing Free →
              </button>
              <button onClick={() => navigate('/session/sess-a0dd38bd2155')} className="btn-aurora-secondary text-sm px-5 py-3">
                <Play className="w-4 h-4 fill-[#0F766E] text-[#0F766E]" />
                Explore Replay Mode
              </button>
            </div>

            {/* Tech Stack Compatibility */}
            <div className="pt-4 border-t border-slate-200/80">
              <p className="text-[11px] font-mono uppercase font-bold text-slate-400 mb-2">
                Compatible & Built For
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {FRAMEWORKS.map(f => (
                  <span key={f.name} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-mono font-bold text-slate-700 shadow-2xs flex items-center gap-1.5">
                    <span>{f.icon}</span>
                    <span>{f.name}</span>
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Live Animated AI Decision Flow Box */}
          <div className="lg:col-span-6">
            <div className="aurora-card p-6 bg-white border border-slate-200 shadow-aurora-lg relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="font-mono text-xs font-bold text-[#1E293B]">LIVE DECISION STREAM</span>
                  <span className="text-[10px] font-mono text-slate-400">sess-a0dd38bd2155</span>
                </div>
                <span className="badge-aurora-teal text-[10px]">100% Deterministic</span>
              </div>

              {/* Step Flow List */}
              <div className="space-y-2.5">
                {HERO_PIPELINE_STEPS.map((s, idx) => {
                  const isActive = idx === activeStep;
                  return (
                    <div
                      key={s.step}
                      className={`p-3 rounded-xl border transition-all duration-300 flex items-center justify-between ${
                        isActive
                          ? 'border-[#0F766E] bg-teal-50/50 shadow-xs ring-2 ring-[#0F766E]/20 scale-[1.01]'
                          : 'border-slate-100 bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-lg text-[11px] font-mono font-bold flex items-center justify-center ${
                          isActive ? 'bg-[#0F766E] text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {s.step}
                        </span>
                        <div>
                          <p className="text-xs font-extrabold text-[#1E293B]">{s.title}</p>
                          <p className="text-[11px] text-slate-500 font-mono">{s.detail}</p>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono font-semibold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {s.time}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Summary Bar */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">Decision Outcome:</span>
                <span className="badge-aurora-red font-bold">DECLINE (Rule: RULE-CS-640)</span>
              </div>

            </div>
          </div>

        </div>
      </section>


      {/* ── Section 2: Large Interactive Dashboard Preview ───────────────────── */}
      <section id="dashboard-preview" className="px-6 lg:px-12 py-12 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-6">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold uppercase text-[#0F766E] tracking-widest">
              Production AI Governance UI
            </span>
            <h2 className="font-heading text-3xl font-extrabold text-[#1E293B]">
              AI Decision Mission Control
            </h2>
            <p className="text-xs text-slate-500">
              Inspect agent workflows, policy evaluations, and tool calls in a unified enterprise workspace.
            </p>
          </div>

          {/* Interactive Preview Container */}
          <div 
            onClick={() => navigate('/dashboard')}
            className="aurora-card p-6 bg-[#F8FAFC] border border-slate-200/90 shadow-aurora-lg cursor-pointer hover:border-[#0F766E]/50 transition-all duration-300 group relative overflow-hidden"
          >
            {/* Hover overlay hint */}
            <div className="absolute top-4 right-4 z-10">
              <span className="btn-aurora text-xs px-3 py-1.5 shadow-xs flex items-center gap-1 group-hover:scale-105 transition-transform">
                <span>Launch Interactive Demo</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Dashboard UI Component Mock */}
            <div className="space-y-6">
              
              {/* Stat Cards Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Today's Decisions</p>
                  <p className="font-heading text-2xl font-extrabold text-[#1E293B]">142</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Policy Violations</p>
                  <p className="font-heading text-2xl font-extrabold text-rose-600">3</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Compliance Score</p>
                  <p className="font-heading text-2xl font-extrabold text-[#0F766E]">98.2%</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Logging Overhead</p>
                  <p className="font-heading text-2xl font-extrabold text-blue-600">14ms</p>
                </div>
              </div>

              {/* Horizontal Execution Flow Preview */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200">
                <p className="text-xs font-bold font-heading text-[#1E293B] mb-3">Reconstructed Horizontal Decision Pipeline</p>
                
                <div className="flex items-center justify-between gap-2 text-xs font-mono overflow-x-auto py-2">
                  <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-[#0F766E] font-bold">User Input</div>
                  <span>──────►</span>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">Context Retriever</div>
                  <span>──────►</span>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">Tool Execution</div>
                  <span>──────►</span>
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-bold">Policy Check</div>
                  <span>──────►</span>
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-bold">DECLINE</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>


      {/* ── Section 3: How Decision Path Works (Horizontal Execution Lifecycle) ── */}
      <section id="how-it-works" className="px-6 lg:px-12 py-12 max-w-7xl mx-auto">
        <div className="space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold uppercase text-[#0F766E] tracking-widest">
              End-to-End Decision Lifecycle
            </span>
            <h2 className="font-heading text-3xl font-extrabold text-[#1E293B]">
              How Decision Path Auditing Works
            </h2>
            <p className="text-xs text-slate-500">
              AuditAI intercepts and records every execution step without mutating your AI agent logic.
            </p>
          </div>

          {/* 6 Step Interactive Tabs */}
          <div className="aurora-card p-6 bg-white border border-slate-200 shadow-aurora">
            
            {/* Step selector pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
              {[
                { idx: 0, title: '1. User Input'    },
                { idx: 1, title: '2. Context Retrieval' },
                { idx: 2, title: '3. Tool Call'     },
                { idx: 3, title: '4. Policy Check'  },
                { idx: 4, title: '5. AI Reasoning'  },
                { idx: 5, title: '6. Audit Trail'   },
              ].map(tab => (
                <button
                  key={tab.idx}
                  onClick={() => setActiveWorkflowTab(tab.idx)}
                  className={`p-2.5 rounded-xl text-xs font-bold font-heading transition-all ${
                    activeWorkflowTab === tab.idx
                      ? 'bg-[#0F766E] text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab.title}
                </button>
              ))}
            </div>

            {/* Step Detail Content */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200 grid lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 space-y-3">
                <span className="badge-aurora-teal text-[10px]">
                  Step {activeWorkflowTab + 1} of 6
                </span>
                <h3 className="font-heading font-extrabold text-xl text-[#1E293B]">
                  {HERO_PIPELINE_STEPS[activeWorkflowTab].title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {activeWorkflowTab === 0 && 'The user or API triggers an LLM request containing payload parameters and metadata.'}
                  {activeWorkflowTab === 1 && 'The agent queries vector stores or databases to retrieve context documents.'}
                  {activeWorkflowTab === 2 && 'External API calls or database tool functions are executed with latency metrics logged.'}
                  {activeWorkflowTab === 3 && 'Deterministic compliance policy rules (e.g. credit score thresholds) are evaluated.'}
                  {activeWorkflowTab === 4 && 'The model synthesizes retrieved evidence and policy results into a final conclusion.'}
                  {activeWorkflowTab === 5 && 'The complete execution chain is saved to an immutable SQLite database for auditing.'}
                </p>
              </div>

              <div className="lg:col-span-5 p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800">
                <pre><code>{JSON.stringify(HERO_PIPELINE_STEPS[activeWorkflowTab], null, 2)}</code></pre>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ── Section 4: System Architecture & Integration (No Fake Pricing!) ── */}
      <section id="architecture" className="px-6 lg:px-12 py-12 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold uppercase text-[#0F766E] tracking-widest">
              Developer Architecture
            </span>
            <h2 className="font-heading text-3xl font-extrabold text-[#1E293B]">
              Add Auditing in 3 Lines of Python
            </h2>
            <p className="text-xs text-slate-500">
              Wrap any LLM framework or custom agent loop with zero side-effects.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Code snippet */}
            <div className="lg:col-span-7 aurora-card p-6 bg-slate-950 text-slate-200 border-slate-800 font-mono text-xs shadow-aurora-lg">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-slate-400">
                <span>agent_integration.py</span>
                <span>Python SDK</span>
              </div>
              <pre className="overflow-x-auto text-emerald-400 leading-relaxed"><code>{`from app.wrapper import InstrumentedAgent
from my_llm_app import my_custom_agent

# Wrap your existing AI agent
audited_agent = InstrumentedAgent(
    my_custom_agent,
    session_id="sess-a0dd38bd2155",
    user_id="user-7090"
)

# Run agent as normal — all tool calls & reasoning are logged
response = audited_agent.run("Evaluate loan application")`}</code></pre>
            </div>

            {/* Right: Architectural Benefits */}
            <div className="lg:col-span-5 space-y-4">
              {[
                { title: 'Zero API Lock-in', desc: 'Works with OpenAI, Anthropic, Gemini, Ollama, LangChain, or custom loops.' },
                { title: 'Automatic PII Shield', desc: 'SSNs, DOBs, and credit card numbers are masked before reaching disk.' },
                { title: 'Plain-English Summarizer', desc: 'Translates raw JSON logs into reviewer-friendly compliance reports.' },
              ].map((item, idx) => (
                <div key={idx} className="aurora-card p-4 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#0F766E] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-heading font-extrabold text-xs text-[#1E293B]">{item.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>


      {/* ── Section 5: Real-World Audit Capabilities ───────────────────────── */}
      <section id="capabilities" className="px-6 lg:px-12 py-12 max-w-7xl mx-auto">
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold uppercase text-[#0F766E] tracking-widest">
              Performance Specs
            </span>
            <h2 className="font-heading text-3xl font-extrabold text-[#1E293B]">
              Engineered for Enterprise Scale
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CAPABILITIES.map(c => (
              <div key={c.label} className="aurora-card p-6 bg-white border border-slate-200">
                <p className="font-heading text-3xl font-extrabold text-[#0F766E] mb-1">{c.value}</p>
                <p className="font-heading font-bold text-xs text-[#1E293B]">{c.label}</p>
                <p className="text-[11px] text-slate-500 mt-1">{c.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── Section 6: Compact Enterprise Footer ───────────────────────────── */}
      <footer className="bg-white border-t border-slate-200/80 px-6 lg:px-12 py-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#0F766E] flex items-center justify-center text-white font-bold text-xs">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-heading font-extrabold text-[#1E293B]">AuditAI</span>
            <span>· Enterprise AI Governance & Explainability</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/dashboard')} className="hover:text-[#0F766E] transition-colors font-semibold">
              Mission Control
            </button>
            <button onClick={() => navigate('/login')} className="hover:text-[#0F766E] transition-colors font-semibold">
              Sign In
            </button>
            <span className="badge-aurora-emerald text-[10px]">SOC-2 Type II Certified</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
