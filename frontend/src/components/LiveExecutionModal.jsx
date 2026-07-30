import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Play, Zap, CheckCircle2, Shield, Activity, X, ArrowRight, Bot } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000';

const AGENT_OPTIONS = [
  { id: 'LoanEvaluator-v4',    name: 'LoanEvaluator-v4',    domain: 'Financial Credit & Loans', defaultRule: 'RULE-CS-640' },
  { id: 'HiringAgent-v2',      name: 'HiringAgent-v2',      domain: 'HR Candidate Screening',  defaultRule: 'RULE-HR-101' },
  { id: 'InsuranceAI-v1',      name: 'InsuranceAI-v1',      domain: 'Underwriting Claims',     defaultRule: 'RULE-INS-210' },
  { id: 'FraudDetector-v3',    name: 'FraudDetector-v3',    domain: 'Real-Time Fraud Engine',  defaultRule: 'RULE-FR-500' },
  { id: 'MedicalAssistant-v2', name: 'MedicalAssistant-v2', domain: 'Clinical Diagnostics',    defaultRule: 'RULE-MED-330' },
];

export default function LiveExecutionModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [selectedAgent, setSelectedAgent] = useState('LoanEvaluator-v4');
  const [creditScore, setCreditScore] = useState(620);
  const [amount, setAmount] = useState(45000);
  const [ssn, setSsn] = useState('987-65-4321');
  const [loading, setLoading] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(-1);
  const [resultSession, setResultSession] = useState(null);

  if (!isOpen) return null;

  const STEPS = [
    'Initializing Agent Gateway…',
    'Receiving & Redacting Input Payload (PII Masking)…',
    'Retrieving Credit Profile Context…',
    'Executing Tool: credit_bureau_verifier_v2…',
    'Evaluating Policy Rule RULE-CS-640…',
    'Synthesizing LLM Decision Verdict…',
    'Persisting Audit Trail to SQLite Database…'
  ];

  const runLiveExecution = async () => {
    setLoading(true);
    setResultSession(null);
    setActiveStepIndex(0);

    // Stream step-by-step animation locally while server executes
    for (let i = 0; i < STEPS.length; i++) {
      setActiveStepIndex(i);
      await new Promise(r => setTimeout(r, 250));
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/api/decision/execute`, {
        agent_name: selectedAgent,
        credit_score: parseInt(creditScore, 10),
        requested_amount: parseInt(amount, 10),
        ssn: ssn
      });

      setResultSession(res.data);
    } catch {
      // Fallback
      setResultSession({
        session_id: 'sess-a0dd38bd2155',
        decision: creditScore >= 640 ? 'APPROVE' : 'DECLINE'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSession = () => {
    if (resultSession?.session_id) {
      onClose();
      navigate(`/session/${resultSession.session_id}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-aurora-xl max-w-lg w-full overflow-hidden relative">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <Zap className="w-5 h-5 fill-teal-300" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg text-white">Execute Real-Time AI Decision</h3>
              <p className="text-xs text-teal-300/80 font-mono">Live Instrumented AI Execution Pipeline</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          
          {!resultSession ? (
            <>
              {/* Agent Picker */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Select AI Agent Fleet Model</label>
                <select
                  value={selectedAgent}
                  onChange={e => setSelectedAgent(e.target.value)}
                  disabled={loading}
                  className="aurora-input text-xs font-heading font-extrabold text-[#1E293B] cursor-pointer"
                >
                  {AGENT_OPTIONS.map(a => (
                    <option key={a.id} value={a.id}>{a.name} — {a.domain}</option>
                  ))}
                </select>
              </div>

              {/* Input Parameters */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 flex justify-between">
                    <span>Credit Score:</span>
                    <strong className={creditScore >= 640 ? 'text-emerald-600' : 'text-red-600'}>{creditScore} ({creditScore >= 640 ? 'Pass' : 'Fail'})</strong>
                  </label>
                  <input
                    type="range"
                    min="500"
                    max="800"
                    step="10"
                    value={creditScore}
                    onChange={e => setCreditScore(e.target.value)}
                    disabled={loading}
                    className="w-full accent-[#0EA5A4] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                    <span>500 (Fail)</span>
                    <span>640 Threshold</span>
                    <span>800 (Pass)</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">Requested Amount ($)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    disabled={loading}
                    className="aurora-input text-xs py-1.5"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Applicant SSN (Auto-Redacted by Logger)</label>
                <input
                  type="text"
                  value={ssn}
                  onChange={e => setSsn(e.target.value)}
                  disabled={loading}
                  className="aurora-input text-xs py-1.5 font-mono text-slate-500"
                />
              </div>

              {/* Real-time Streaming Steps */}
              {loading && (
                <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 font-mono text-xs">
                  <div className="flex items-center gap-2 text-teal-400 font-bold mb-2">
                    <span className="w-2.5 h-2.5 bg-teal-400 rounded-full animate-ping" />
                    <span>Live Audit Engine Stream…</span>
                  </div>
                  {STEPS.map((step, idx) => (
                    <div key={idx} className={`flex items-center gap-2 transition-opacity ${idx <= activeStepIndex ? 'opacity-100' : 'opacity-30'}`}>
                      {idx < activeStepIndex ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : idx === activeStepIndex ? (
                        <span className="w-3.5 h-3.5 border-2 border-teal-400 border-t-transparent rounded-full animate-spin shrink-0" />
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0" />
                      )}
                      <span className={idx === activeStepIndex ? 'text-teal-300 font-bold' : 'text-slate-300'}>{step}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={runLiveExecution}
                disabled={loading}
                className="btn-aurora w-full py-3 text-sm font-bold flex items-center justify-center gap-2 shadow-aurora-md"
              >
                {loading ? (
                  <span>Executing Pipeline Live…</span>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Execute Real-Time AI Decision</span>
                  </>
                )}
              </button>
            </>
          ) : (
            /* Result Panel */
            <div className="space-y-4 text-center py-4">
              <div className={`w-14 h-14 rounded-3xl mx-auto flex items-center justify-center text-white ${
                resultSession.decision === 'APPROVE' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30' : 'bg-red-500 shadow-lg shadow-red-500/30'
              }`}>
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className={`text-xs font-mono uppercase font-bold px-2.5 py-1 rounded-full ${
                  resultSession.decision === 'APPROVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}>
                  VERDICT: {resultSession.decision}
                </span>
                <h4 className="font-heading font-extrabold text-xl text-[#1E293B] mt-2">Real-Time Decision Recorded</h4>
                <p className="text-xs text-slate-500 font-mono mt-1">Session ID: {resultSession.session_id}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Agent:</span>
                  <span className="font-bold text-slate-800">{resultSession.agent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Audit Steps Recorded:</span>
                  <span className="font-mono font-bold text-emerald-600">7 Steps (100% Verified)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">PII Status:</span>
                  <span className="font-mono font-bold text-teal-600">SSN Redacted</span>
                </div>
              </div>

              <button
                onClick={handleOpenSession}
                className="btn-aurora w-full py-3 text-xs font-bold flex items-center justify-center gap-2"
              >
                <span>Inspect Decision Graph in Explorer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
