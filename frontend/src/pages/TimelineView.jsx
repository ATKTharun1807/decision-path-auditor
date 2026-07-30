import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft, Clock, Shield, CheckCircle, FileText, Bot,
  Activity, AlertTriangle, ChevronDown, ChevronUp,
  Code2, Database, GitBranch, Cpu, Zap, Copy, Check
} from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000';

/* ─── Event type config ──────────────────────────────────── */
const EVENT_CONFIG = {
  input:          { icon: Bot,          label: 'Input',           dot: 'border-indigo-400 bg-indigo-50 text-indigo-700',  card: 'border-indigo-100 bg-white'          },
  context_retrieved:{ icon: Database,   label: 'Context Retrieved',dot: 'border-blue-400 bg-blue-50 text-blue-700',       card: 'border-blue-100 bg-white'            },
  tool_call:      { icon: Code2,        label: 'Tool Call',        dot: 'border-violet-400 bg-violet-50 text-violet-700', card: 'border-violet-100 bg-white'          },
  tool_response:  { icon: CheckCircle,  label: 'Tool Response',    dot: 'border-cyan-400 bg-cyan-50 text-cyan-700',       card: 'border-cyan-100 bg-white'            },
  reasoning_step: { icon: GitBranch,    label: 'Reasoning Step',   dot: 'border-amber-400 bg-amber-50 text-amber-700',   card: 'border-amber-100 bg-white'           },
  decision:       { icon: Shield,       label: 'Decision',         dot: 'border-red-400 bg-red-50 text-red-700',          card: 'border-red-200 bg-red-50/30'         },
  output:         { icon: FileText,     label: 'Output',           dot: 'border-green-400 bg-green-50 text-green-700',   card: 'border-green-100 bg-white'           },
};
const DEFAULT_CFG = { icon: Activity, label: 'Event', dot: 'border-gray-300 bg-gray-50 text-gray-600', card: 'border-border bg-white' };

/* ─── Copy button ────────────────────────────────────────── */
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" title="Copy JSON">
      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
    </button>
  );
}

/* ─── Single event card ──────────────────────────────────── */
function EventCard({ evt, index, isLast }) {
  const [expanded, setExpanded] = useState(true);
  const cfg = EVENT_CONFIG[evt.event_type] || DEFAULT_CFG;
  const Icon = cfg.icon;
  const payloadStr = JSON.stringify(evt.payload, null, 2);

  return (
    <div className="relative flex items-start gap-5 group">
      {/* Connector line */}
      {!isLast && (
        <div className="absolute left-[1.1875rem] top-12 bottom-[-2.5rem] w-px bg-gradient-to-b from-border to-transparent" />
      )}

      {/* Step dot */}
      <div className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold font-mono shadow-card transition-all duration-200 group-hover:scale-110 ${cfg.dot}`}>
        {index}
      </div>

      {/* Event card */}
      <div className={`flex-1 min-w-0 rounded-2xl border transition-all duration-200 hover:shadow-card-hover overflow-hidden mb-2 ${cfg.card}`}>
        {/* Header */}
        <div
          className="flex items-center gap-3 px-5 py-4 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className={`p-2 rounded-xl ${cfg.dot}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">{cfg.label}</span>
              {evt.redacted && (
                <span className="badge-red text-[9px]">REDACTED</span>
              )}
            </div>
            <p className="text-sm font-medium text-foreground mt-0.5 truncate">{evt.summary}</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-xs font-mono text-muted-foreground hidden sm:block">
              {new Date(evt.timestamp).toLocaleTimeString()}
            </span>
            {expanded
              ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
              : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </div>
        </div>

        {/* JSON payload */}
        {expanded && (
          <div className="border-t border-inherit">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-900/95">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <span className="ml-2 text-xs text-gray-400 font-mono">payload.json</span>
              </div>
              <CopyButton text={payloadStr} />
            </div>
            <div className="p-4 bg-gray-950 overflow-x-auto">
              <pre className="text-xs font-mono text-gray-300 leading-relaxed whitespace-pre">
                <code>{syntaxHighlight(payloadStr)}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Syntax highlight (pure JS, no deps) ───────────────── */
function syntaxHighlight(json) {
  // Return JSX with colored spans
  const tokens = [];
  let i = 0;
  const str = json;
  while (i < str.length) {
    // String
    if (str[i] === '"') {
      let j = i + 1;
      while (j < str.length && !(str[j] === '"' && str[j-1] !== '\\')) j++;
      const token = str.slice(i, j + 1);
      // Check if next non-whitespace is ':'
      let k = j + 1;
      while (k < str.length && str[k] === ' ') k++;
      const isKey = str[k] === ':';
      tokens.push(
        <span key={i} style={{ color: isKey ? '#93c5fd' : '#86efac' }}>{token}</span>
      );
      i = j + 1;
    } else if (/[\d-]/.test(str[i]) || (str[i] === '-' && /\d/.test(str[i+1]))) {
      let j = i;
      while (j < str.length && /[\d.eE+-]/.test(str[j])) j++;
      tokens.push(<span key={i} style={{ color: '#fca5a5' }}>{str.slice(i, j)}</span>);
      i = j;
    } else if (str.slice(i, i+4) === 'true' || str.slice(i, i+5) === 'false' || str.slice(i, i+4) === 'null') {
      const end = str[i] === 'n' ? i+4 : str.slice(i,i+4) === 'true' ? i+4 : i+5;
      tokens.push(<span key={i} style={{ color: '#c4b5fd' }}>{str.slice(i, end)}</span>);
      i = end;
    } else {
      tokens.push(<span key={i} style={{ color: '#94a3b8' }}>{str[i]}</span>);
      i++;
    }
  }
  return tokens;
}

/* ─── Tabs ───────────────────────────────────────────────── */
function Tab({ id, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`pb-4 text-sm font-medium border-b-2 transition-all duration-150 ${
        active
          ? 'border-indigo-600 text-indigo-600'
          : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
      }`}
    >
      {label}
    </button>
  );
}

/* ──────────────────────────────────────────────────────────── */
export default function TimelineView() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const [timeline,  setTimeline]   = useState(null);
  const [error,     setError]      = useState('');
  const [activeTab, setActiveTab]  = useState('timeline');

  const [summary,        setSummary]        = useState(null);
  const [summaryError,   setSummaryError]   = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const [challenge,       setChallenge]       = useState('');
  const [regulatory,      setRegulatory]      = useState(null);
  const [regulatoryError, setRegulatoryError] = useState(null);
  const [loadingReg,      setLoadingReg]      = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/decision-path/session/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setTimeline(res.data);
      } catch {
        setError('Session not found or access denied.');
      }
    };
    fetch();
  }, [id]);

  const genSummary = async () => {
    setLoadingSummary(true);
    setSummaryError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_BASE_URL}/decision-path/session/${id}/summary`, {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setSummary(res.data.summary);
    } catch (err) {
      setSummaryError(err.response?.data?.detail || err.message);
    } finally {
      setLoadingSummary(false);
    }
  };

  const genRegulatory = async () => {
    setLoadingReg(true);
    setRegulatoryError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_BASE_URL}/decision-path/session/${id}/challenge-response`, { challenge_text: challenge }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setRegulatory(res.data.challenge_response);
    } catch (err) {
      setRegulatoryError(err.response?.data?.detail || err.message);
    } finally {
      setLoadingReg(false);
    }
  };

  if (error) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="font-heading text-xl font-semibold text-foreground mb-2">Session Not Found</h2>
        <p className="text-muted-foreground text-sm mb-6">{error}</p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary">← Back to Dashboard</button>
      </div>
    </div>
  );

  if (!timeline) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground text-sm">Loading audit trail…</p>
      </div>
    </div>
  );

  const decisionEvt   = timeline.timeline.find(e => e.event_type === 'decision');
  const decisionValue = decisionEvt?.payload?.decision || 'UNKNOWN';
  const ruleApplied   = decisionEvt?.payload?.rule_id  || 'N/A';
  const toolCalls     = timeline.timeline.filter(e => e.event_type === 'tool_call').length;
  const redacted      = timeline.timeline.filter(e => e.redacted).length;

  const decisionColor = decisionValue === 'APPROVE' ? 'badge-green' : decisionValue === 'DECLINE' ? 'badge-red' : 'badge-yellow';

  return (
    <div className="min-h-screen bg-background">
      {/* ── Nav ──────────────────────────────────────────── */}
      <nav className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-ghost p-2 -ml-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
              <Shield className="w-3 h-3 text-white" />
            </div>
            <span className="font-heading font-semibold text-sm text-foreground truncate">
              {id}
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span className="font-mono">{timeline.step_count} events</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Summary card ─────────────────────────────── */}
        <div className="card p-6 mb-8">
          {/* Top row */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div className="flex flex-wrap gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Session</p>
                <p className="font-mono text-sm font-medium text-foreground">{id}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">User</p>
                <p className="font-mono text-sm font-medium text-foreground">{timeline.user_id}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Decision</p>
              <span className={`badge text-sm px-3 py-1 font-bold ${decisionColor}`}>{decisionValue}</span>
            </div>
          </div>

          {/* KPI mini-row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Steps captured',  value: timeline.step_count, icon: Activity,      color: 'text-indigo-600' },
              { label: 'Tool calls',      value: toolCalls,           icon: Code2,         color: 'text-violet-600' },
              { label: 'Events redacted', value: redacted,            icon: AlertTriangle, color: 'text-amber-600'  },
              { label: 'Rule applied',    value: ruleApplied,         icon: Shield,        color: 'text-green-600'  },
            ].map(k => {
              const Icon = k.icon;
              return (
                <div key={k.label} className="bg-muted/50 rounded-xl p-3.5">
                  <Icon className={`w-4 h-4 ${k.color} mb-1.5`} />
                  <p className="text-xs text-muted-foreground mb-0.5">{k.label}</p>
                  <p className="font-heading font-bold text-lg text-foreground">{k.value}</p>
                </div>
              );
            })}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 border-b border-border -mb-6 -mx-0 overflow-x-auto">
            {[
              { id: 'timeline',   label: 'Timeline'            },
              { id: 'summary',    label: 'Plain-English Summary'},
              { id: 'regulatory', label: 'Regulatory Response'  },
            ].map(t => (
              <Tab key={t.id} id={t.id} label={t.label} active={activeTab === t.id} onClick={() => setActiveTab(t.id)} />
            ))}
          </div>
        </div>

        {/* ── Tab content ──────────────────────────────── */}

        {activeTab === 'timeline' && (
          <div className="space-y-0">
            {timeline.timeline.map((evt, i) => (
              <EventCard
                key={evt.event_id}
                evt={evt}
                index={i}
                isLast={i === timeline.timeline.length - 1}
              />
            ))}
          </div>
        )}

        {activeTab === 'summary' && (
          <div className="card p-6">
            <div className="flex items-start gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-foreground">Plain-English Summary</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Generated by Claude from the reconstructed timeline — grounded only in what actually happened.
                </p>
              </div>
            </div>

            <button onClick={genSummary} disabled={loadingSummary} className="btn-primary text-sm mb-6">
              {loadingSummary ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Generating…
                </>
              ) : (
                <><Zap className="w-4 h-4" /> Generate Summary</>
              )}
            </button>

            {summaryError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 mb-4">
                <AlertTriangle className="w-4 h-4 inline mr-1.5 mb-0.5" />
                {summaryError}
              </div>
            )}
            {summary && (
              <div className="bg-muted/50 rounded-xl p-6 text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed border border-border">
                {summary}
              </div>
            )}
          </div>
        )}

        {activeTab === 'regulatory' && (
          <div className="card p-6">
            <div className="flex items-start gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-foreground">Regulatory Response</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Draft a compliance response to a customer challenge or regulator inquiry.
                </p>
              </div>
            </div>

            <label className="block text-sm font-medium text-foreground mb-2">
              Challenge text <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <textarea
              className="input mb-4 resize-none"
              rows={4}
              placeholder="e.g. The applicant disputes the loan decline and requests a full explanation under GDPR Article 22…"
              value={challenge}
              onChange={e => setChallenge(e.target.value)}
            />

            <button onClick={genRegulatory} disabled={loadingReg} className="btn-primary text-sm mb-6">
              {loadingReg ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Drafting…
                </>
              ) : (
                <><FileText className="w-4 h-4" /> Draft Response</>
              )}
            </button>

            {regulatoryError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 mb-4">
                <AlertTriangle className="w-4 h-4 inline mr-1.5 mb-0.5" />
                {regulatoryError}
              </div>
            )}
            {regulatory && (
              <div className="bg-muted/50 rounded-xl p-6 text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed border border-border">
                {regulatory}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
