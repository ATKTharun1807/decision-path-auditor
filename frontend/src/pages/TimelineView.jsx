import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft, Clock, Shield, CheckCircle2, FileText, Bot,
  Activity, AlertTriangle, ChevronRight, Code2, Database, GitBranch,
  Zap, Copy, Check, Play, RotateCcw, Sparkles, Layers, Sliders
} from 'lucide-react';
import AppLayout from '../components/AppLayout';

const API_BASE_URL = 'http://127.0.0.1:8000';

/* Horizontal Pipeline Nodes Mock Data */
const PIPELINE_NODES = [
  { id: 'user',      label: 'User Input',     type: 'INPUT',       status: 'complete', time: '0ms',   desc: 'Received loan request ($12,000)' },
  { id: 'retriever', label: 'Retriever',      type: 'RETRIEVER',   status: 'complete', time: '4ms',   desc: 'Fetched user profile user-7090' },
  { id: 'tool',      label: 'Tool Execution', type: 'TOOL_CALL',   status: 'complete', time: '14ms',  desc: 'Executed credit_bureau_lookup' },
  { id: 'policy',    label: 'Policy Check',   type: 'POLICY',      status: 'complete', time: '2ms',   desc: 'Evaluated RULE-CS-640' },
  { id: 'reasoning', label: 'Reasoning',      type: 'REASONING',   status: 'complete', time: '18ms',  desc: 'Credit score 610 < 640 threshold' },
  { id: 'decision',  label: 'Decision',       type: 'DECISION',    status: 'declined', time: '1ms',   desc: 'DECLINE loan application' },
  { id: 'audit',     label: 'Audit Store',    type: 'AUDIT_STORE', status: 'complete', time: '2ms',   desc: 'Persisted to immutability store' },
];

export default function TimelineView() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const [selectedNode, setSelectedNode] = useState(PIPELINE_NODES[2]); // Default Tool Execution
  const [isReplaying, setIsReplaying]   = useState(false);
  const [replayStep, setReplayStep]     = useState(-1);
  const [copied, setCopied]             = useState(false);
  const [activeTab, setActiveTab]       = useState('evidence'); // 'evidence' | 'json' | 'summary'

  // Replay Animation Execution Loop
  const startReplay = () => {
    setIsReplaying(true);
    setReplayStep(0);
    setSelectedNode(PIPELINE_NODES[0]);

    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step < PIPELINE_NODES.length) {
        setReplayStep(step);
        setSelectedNode(PIPELINE_NODES[step]);
      } else {
        clearInterval(interval);
        setIsReplaying(false);
        setReplayStep(-1);
      }
    }, 1200);
  };

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(selectedNode, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppLayout title="Decision Flow Explorer">
      
      {/* ── Top Header Navigation Bar ─────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/sessions')} className="btn-aurora-secondary p-2">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-[#1E293B] text-xl">{id || 'sess-a0dd38bd2155'}</span>
              <span className="badge-aurora-red">DECLINE</span>
              <span className="badge-aurora-teal">Confidence: 96%</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">User: user-7090 · Agent: LoanEvaluator-v4 · Total Latency: 42ms</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={startReplay} 
            disabled={isReplaying}
            className="btn-aurora text-xs px-4 py-2.5 shadow-glow-teal flex items-center gap-2"
          >
            <Play className={`w-3.5 h-3.5 fill-white ${isReplaying ? 'animate-spin' : ''}`} />
            <span>{isReplaying ? 'Replaying AI Decision…' : '▶ Replay Decision'}</span>
          </button>
        </div>
      </div>

      {/* ── GitHub Actions-Style Horizontal Pipeline ───────────────────────── */}
      <div className="aurora-card p-6 mb-8 bg-white border border-slate-200/90 overflow-x-auto">
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#0EA5A4]" />
            <h3 className="font-heading font-bold text-sm text-[#1E293B]">Execution Pipeline Graph</h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Click any node to inspect data</span>
        </div>

        {/* Horizontal Connector Flow */}
        <div className="flex items-center justify-between gap-2 py-4 min-w-[850px] relative">
          {PIPELINE_NODES.map((node, idx) => {
            const isSelected = selectedNode.id === node.id;
            const isReplayActive = replayStep === idx;
            const isDeclined = node.status === 'declined';

            return (
              <React.Fragment key={node.id}>
                {/* Node Box */}
                <div
                  onClick={() => setSelectedNode(node)}
                  className={`pipeline-node flex-1 transition-all duration-300 ${
                    isReplayActive
                      ? 'border-[#0EA5A4] bg-teal-50 ring-4 ring-[#0EA5A4]/30 scale-105 shadow-glow-teal'
                      : isSelected
                      ? 'pipeline-node-active'
                      : isDeclined
                      ? 'border-rose-300 bg-rose-50/50 text-rose-700'
                      : 'hover:border-slate-300'
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
                    {node.type}
                  </span>
                  <span className="font-heading font-extrabold text-xs text-[#1E293B] text-center mb-1">
                    {node.label}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {node.time}
                  </span>
                </div>

                {/* Arrow Connector Line */}
                {idx < PIPELINE_NODES.length - 1 && (
                  <div className="flex items-center text-slate-300 font-mono text-sm px-1">
                    ──────►
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── Split-Panel Explorer: Evidence / JSON / Summary ───────────────── */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: Selected Node Inspector & Evidence */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="aurora-card p-6 border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-[#0EA5A4] font-bold text-xs">
                  {selectedNode.type.slice(0, 2)}
                </div>
                <div>
                  <h4 className="font-heading font-extrabold text-base text-[#1E293B]">{selectedNode.label}</h4>
                  <p className="text-xs text-slate-500 font-mono">{selectedNode.desc}</p>
                </div>
              </div>

              <div className="flex rounded-xl border border-slate-200 overflow-hidden text-xs">
                {['evidence', 'json', 'summary'].map(t => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`px-3 py-1.5 font-semibold capitalize transition-colors ${
                      activeTab === t ? 'bg-[#0EA5A4] text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab: Evidence */}
            {activeTab === 'evidence' && (
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 font-heading">
                  Inspected Node Payload & Evidence
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <span className="text-slate-400 font-mono text-[10px] block mb-1">Execution Status</span>
                    <span className="font-bold text-emerald-600">✓ Deterministic Pass</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <span className="text-slate-400 font-mono text-[10px] block mb-1">Node Latency</span>
                    <span className="font-mono font-bold text-slate-800">{selectedNode.time}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                  <div className="flex justify-between text-slate-400 text-[10px] mb-2 pb-2 border-b border-slate-800">
                    <span>node_payload.json</span>
                    <button onClick={copyJson} className="hover:text-white flex items-center gap-1">
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre><code>{JSON.stringify(selectedNode, null, 2)}</code></pre>
                </div>
              </div>
            )}

            {/* Tab: JSON */}
            {activeTab === 'json' && (
              <div className="p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs leading-relaxed border border-slate-800">
                <pre><code>{JSON.stringify(PIPELINE_NODES, null, 2)}</code></pre>
              </div>
            )}

            {/* Tab: Summary */}
            {activeTab === 'summary' && (
              <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200 text-xs text-slate-700 leading-relaxed">
                <p className="font-bold text-[#0EA5A4] mb-2 flex items-center gap-1.5 text-sm">
                  <Sparkles className="w-4 h-4" /> Plain-English Audit Summary
                </p>
                The AI agent parsed the loan request for user-7090, executed the credit bureau lookup API, and evaluated policy RULE-CS-640. The applicant's credit score of 610 was below the minimum 640 threshold, resulting in a deterministic DECLINE decision.
              </div>
            )}

          </div>

        </div>

        {/* Right 5 Cols: Applied Policies & Audit Evidence Box */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="aurora-card p-6 border-slate-200">
            <h4 className="font-heading font-extrabold text-sm text-[#1E293B] mb-4 flex items-center justify-between">
              <span>Applied Policies</span>
              <span className="badge-aurora-amber">1 Rule Evaluated</span>
            </h4>

            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs font-bold text-amber-900">RULE-CS-640</span>
                <span className="badge-aurora-red text-[10px]">Triggered Decline</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed mt-1">
                Credit Score Threshold Policy: Auto-decline loan if credit score is below 640.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Policy ID:</span>
                <span className="font-mono font-bold text-slate-800">RULE-CS-640</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Evaluated Value:</span>
                <span className="font-mono font-bold text-rose-600">610 (Fail)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Threshold:</span>
                <span className="font-mono font-bold text-slate-800">640</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </AppLayout>
  );
}
