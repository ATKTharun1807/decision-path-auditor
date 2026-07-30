import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot, Shield, Cpu, Activity, Zap, Clock, CheckCircle2,
  ArrowRight, Filter, Play, Sliders, RefreshCw, AlertTriangle
} from 'lucide-react';
import AppLayout from '../components/AppLayout';

const FLEET_AGENTS = [
  {
    id: 'agent-loan-01',
    name: 'LoanEvaluator-v4',
    domain: 'Financial Credit & Loans',
    provider: 'OpenAI GPT-4o',
    policy: 'RULE-CS-640',
    status: 'Healthy',
    decisionsToday: 64,
    avgLatency: '24ms',
    complianceScore: '99.2%',
    color: 'bg-emerald-500',
    desc: 'Evaluates personal loan applications against credit score and income verification rules.'
  },
  {
    id: 'agent-hr-02',
    name: 'HiringAgent-v2',
    domain: 'HR Candidate Screening',
    provider: 'Anthropic Claude 3.5',
    policy: 'RULE-HR-101',
    status: 'Healthy',
    decisionsToday: 38,
    avgLatency: '32ms',
    complianceScore: '98.8%',
    color: 'bg-teal-500',
    desc: 'Automates resume evaluation and experience verification for enterprise recruiting.'
  },
  {
    id: 'agent-ins-03',
    name: 'InsuranceAI-v1',
    domain: 'Underwriting Claims',
    provider: 'Google Gemini 1.5',
    policy: 'RULE-INS-210',
    status: 'Healthy',
    decisionsToday: 29,
    avgLatency: '18ms',
    complianceScore: '97.5%',
    color: 'bg-[#0EA5A4]',
    desc: 'Assesses insurance claim risk scores and enforces automated approval caps.'
  },
  {
    id: 'agent-fr-04',
    name: 'FraudDetector-v3',
    domain: 'Real-Time Fraud Prevention',
    provider: 'Ollama Llama 3 (Local)',
    policy: 'RULE-FR-500',
    status: 'Healthy',
    decisionsToday: 82,
    avgLatency: '8ms',
    complianceScore: '100%',
    color: 'bg-indigo-500',
    desc: 'High-frequency transaction velocity monitor and IP geographic anomaly detector.'
  },
  {
    id: 'agent-med-05',
    name: 'MedicalAssistant-v2',
    domain: 'Clinical Diagnostics',
    provider: 'Claude 3.5 Sonnet',
    policy: 'RULE-MED-330',
    status: 'Healthy',
    decisionsToday: 15,
    avgLatency: '45ms',
    complianceScore: '97.0%',
    color: 'bg-purple-500',
    desc: 'Crosschecks prescription dosages and allergy safety bounds before doctor review.'
  },
];

export default function Agents() {
  const navigate = useNavigate();
  const [selectedAgent, setSelectedAgent] = useState(FLEET_AGENTS[0]);
  const [search, setSearch] = useState('');

  const filteredAgents = FLEET_AGENTS.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) || 
    a.domain.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout title="AI Agent Fleet">
      
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-heading text-xl font-extrabold text-[#1E293B]">AI Agent Fleet Manager</h2>
          <p className="text-xs text-slate-500 mt-0.5">Monitor integrated model fleets, latencies, policy bindings, and decision health.</p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search agents or domains…"
            className="aurora-input text-xs py-2 w-56"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="aurora-card p-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Active Fleet Size</p>
          <div className="flex items-baseline justify-between">
            <span className="font-heading text-3xl font-extrabold text-[#1E293B]">5 Agents</span>
            <span className="badge-aurora-emerald text-xs">100% Active</span>
          </div>
        </div>

        <div className="aurora-card p-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Total Decisions Today</p>
          <div className="flex items-baseline justify-between">
            <span className="font-heading text-3xl font-extrabold text-[#0EA5A4]">228</span>
            <span className="text-xs font-bold text-emerald-600">+18% vs avg</span>
          </div>
        </div>

        <div className="aurora-card p-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Fleet Avg Latency</p>
          <div className="flex items-baseline justify-between">
            <span className="font-heading text-3xl font-extrabold text-[#1E293B]">25.4ms</span>
            <span className="text-xs font-bold text-emerald-600">Optimal</span>
          </div>
        </div>

        <div className="aurora-card p-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Governance Bound</p>
          <div className="flex items-baseline justify-between">
            <span className="font-heading text-3xl font-extrabold text-indigo-600">5 Policies</span>
            <span className="text-xs font-bold text-slate-500">Bound</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left 7 Cols Agent List / Right 5 Cols Inspector */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Left Column: Agent Cards List */}
        <div className="lg:col-span-7 space-y-3">
          {filteredAgents.map(agent => {
            const isSelected = selectedAgent.id === agent.id;
            return (
              <div
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`aurora-card p-5 cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'border-[#0EA5A4] bg-teal-50/20 ring-2 ring-[#0EA5A4]/20 shadow-aurora-lg' 
                    : 'hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-[#0EA5A4]">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-heading font-extrabold text-sm text-[#1E293B]">{agent.name}</h4>
                      <p className="text-xs text-slate-500 font-mono">{agent.domain}</p>
                    </div>
                  </div>

                  <span className="badge-aurora-emerald text-xs">🟢 {agent.status}</span>
                </div>

                <p className="text-xs text-slate-600 mb-3">{agent.desc}</p>

                <div className="flex items-center justify-between text-xs font-mono pt-3 border-t border-slate-100 text-slate-500">
                  <span>Provider: <strong className="text-slate-800">{agent.provider}</strong></span>
                  <span>Latency: <strong className="text-[#0EA5A4]">{agent.avgLatency}</strong></span>
                  <span>Decisions: <strong className="text-slate-800">{agent.decisionsToday}</strong></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Agent Inspector Workspace */}
        <div className="lg:col-span-5">
          <div className="aurora-card p-6 sticky top-20 border-teal-200/80 shadow-aurora-lg">
            
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-[#0EA5A4] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Inspecting AI Agent</span>
                <h3 className="font-heading font-extrabold text-lg text-[#1E293B]">{selectedAgent.name}</h3>
              </div>
            </div>

            <div className="space-y-4 mb-6 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Domain Workspace:</span>
                  <span className="font-bold text-slate-800">{selectedAgent.domain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">LLM Provider:</span>
                  <span className="font-mono font-bold text-[#0EA5A4]">{selectedAgent.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Bound Policy Rule:</span>
                  <span className="font-mono font-bold text-amber-700">{selectedAgent.policy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Compliance Accuracy:</span>
                  <span className="font-mono font-bold text-emerald-600">{selectedAgent.complianceScore}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200 text-slate-700 leading-relaxed">
                <p className="font-bold text-[#0EA5A4] mb-1 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" /> Governance Instrumentation Active
                </p>
                This agent is wrapped with <code>InstrumentedAgent</code>. All tool calls, PII redactions, and decision rules are automatically logged to the audit store with zero latency impact.
              </div>
            </div>

            <button 
              onClick={() => navigate('/sessions')}
              className="btn-aurora w-full py-2.5 text-xs font-bold shadow-xs"
            >
              Inspect Agent Decision Inbox →
            </button>

          </div>
        </div>

      </div>

    </AppLayout>
  );
}
