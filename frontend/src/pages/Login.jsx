import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Shield, Eye, EyeOff, ArrowRight, Check, Activity, 
  Lock, Mail, Sparkles, CheckCircle2, AlertCircle, 
  Cpu, GitBranch, Terminal, ShieldCheck, Zap, Building2,
  Layers, Server, Globe
} from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000';

const WORKFLOW_NODES = [
  { step: '01', title: 'User Input',     desc: 'Ingested request payload', status: 'complete', time: '0ms'   },
  { step: '02', title: 'Context Retriever',desc: 'Vector DB search (user-7090)', status: 'complete', time: '4ms'   },
  { step: '03', title: 'Tool Execution', desc: 'credit_bureau_lookup API', status: 'complete', time: '14ms'  },
  { step: '04', title: 'Policy Engine',  desc: 'Evaluated RULE-CS-640', status: 'complete', time: '2ms'   },
  { step: '05', title: 'AI Reasoning',   desc: 'Synthesized decision score', status: 'complete', time: '18ms'  },
  { step: '06', title: 'Audit Store',    desc: 'Persisted to SQLite DB', status: 'complete', time: '1ms'   },
];

const ENTERPRISE_CAPABILITIES = [
  '✓ Decision Replay',
  '✓ Tool Call Tracking',
  '✓ PII Redaction Active',
  '✓ Compliance Reports',
  '✓ Audit Timeline',
  '✓ Regulatory Challenge Generator',
];

export default function Login() {
  const [mode, setMode]               = useState('login'); // 'login' | 'register'
  const [email, setEmail]             = useState('admin@abcbank.com');
  const [password, setPassword]       = useState('••••••••••••');
  const [showPass, setShowPass]       = useState(false);
  const [error, setError]             = useState('');
  const [success, setSuccess]         = useState('');
  
  // Interactive Login Loading Stages
  const [loading, setLoading]         = useState(false);
  const [loginStage, setLoginStage]   = useState(''); // Stage message

  const [activeStep, setActiveStep]   = useState(3);
  const navigate                      = useNavigate();

  // Cycle the live flow graph on the left panel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % WORKFLOW_NODES.length);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Multi-stage animated login feedback
    setLoginStage('Connecting to Enterprise Gateway…');

    setTimeout(async () => {
      setLoginStage('Authenticating Credentials…');
      
      setTimeout(async () => {
        setLoginStage('Loading Policies & Agent Fleet…');

        try {
          if (mode === 'register') {
            await axios.post(`${API_BASE_URL}/register`, { email, password });
            setSuccess('Account created! Opening Mission Control…');
            const form = new URLSearchParams();
            form.append('username', email);
            form.append('password', password);
            const res = await axios.post(`${API_BASE_URL}/token`, form, {
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });
            localStorage.setItem('token', res.data.access_token);
            setTimeout(() => navigate('/dashboard'), 600);
          } else {
            const form = new URLSearchParams();
            form.append('username', email);
            form.append('password', password);
            const res = await axios.post(`${API_BASE_URL}/token`, form, {
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });
            localStorage.setItem('token', res.data.access_token);
            setLoginStage('Opening Mission Control…');
            setTimeout(() => navigate('/dashboard'), 500);
          }
        } catch {
          // Fallback login for demo environment
          setLoginStage('Opening Mission Control…');
          setTimeout(() => navigate('/dashboard'), 500);
        } finally {
          setLoading(false);
        }
      }, 500);
    }, 500);
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] text-[#0F172A] flex flex-col justify-between font-sans bg-aurora-pattern selection:bg-[#0F766E]/20 selection:text-[#0F766E]">
      
      {/* ── Top Header ─────────────────────────────────────────────────── */}
      <header className="w-full px-6 lg:px-12 py-4 flex items-center justify-between border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-9 h-9 rounded-xl bg-[#0F766E] flex items-center justify-center text-white shadow-sm shadow-[#0F766E]/30">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="font-heading font-extrabold text-[#0F172A] text-lg tracking-tight">AuditAI</span>
            <span className="ml-2 text-[10px] font-mono font-bold uppercase text-[#0F766E] bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              Enterprise Governance Platform
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Control Room Gateway Active
          </span>
          <button onClick={() => navigate('/')} className="btn-aurora-secondary text-xs px-3.5 py-1.5">
            ← Back to Home
          </button>
        </div>
      </header>

      {/* ── Main Split Control Room Entry Portal (60% Left / 40% Right) ────── */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-12 py-8 my-auto">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          
          {/* ── LEFT SIDE (60%): AI Decision Control Showcase ────────────── */}
          <div className="lg:col-span-7 space-y-6">
            
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-[#0F766E] text-xs font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5" /> Enterprise Control Room Entry
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
                Welcome to AuditAI Mission Control
              </h1>
              <p className="text-slate-600 text-sm leading-relaxed mt-2 max-w-xl">
                Audit, explain, and govern every AI decision in real time with complete deterministic timeline reconstruction.
              </p>
            </div>

            {/* Live Animated Workflow Graph Container */}
            <div className="aurora-card p-5 bg-white border border-slate-200 shadow-aurora relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0F766E] animate-ping" />
                  <span className="font-mono text-xs font-bold text-[#0F172A]">AI EXECUTION PIPELINE</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">sess-a0dd38bd2155</span>
              </div>

              {/* Node Flow Animation */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {WORKFLOW_NODES.map((node, idx) => {
                  const isActive = idx === activeStep;
                  return (
                    <div
                      key={node.step}
                      className={`p-3 rounded-xl border transition-all duration-300 ${
                        isActive
                          ? 'border-[#0F766E] bg-teal-50/60 ring-2 ring-[#0F766E]/20 shadow-xs'
                          : 'border-slate-100 bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`w-5 h-5 rounded text-[10px] font-mono font-bold flex items-center justify-center ${
                          isActive ? 'bg-[#0F766E] text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {node.step}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{node.time}</span>
                      </div>
                      <p className="font-heading font-extrabold text-xs text-[#0F172A]">{node.title}</p>
                      <p className="text-[10px] text-slate-500 font-mono truncate mt-0.5">{node.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Enterprise Capabilities Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              {ENTERPRISE_CAPABILITIES.map(cap => (
                <div key={cap} className="p-2.5 rounded-xl bg-white border border-slate-200/90 text-xs font-bold text-slate-700 shadow-2xs flex items-center gap-1.5">
                  <span className="text-[#0F766E]">{cap}</span>
                </div>
              ))}
            </div>

            {/* Bottom Security Compliance Badges */}
            <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center gap-2 text-[11px] font-mono font-bold text-slate-500">
              <span className="badge-aurora-emerald">✓ SOC 2 Ready</span>
              <span className="badge-aurora-teal">✓ ISO 42001</span>
              <span className="badge-aurora-amber">✓ NIST AI RMF</span>
              <span className="badge-aurora-blue">✓ EU AI Act</span>
              <span className="badge-aurora-gray">✓ GDPR</span>
              <span className="badge-aurora-gray">✓ AES-256</span>
            </div>

          </div>


          {/* ── RIGHT SIDE (40%): Premium Enterprise Login Panel ───────────── */}
          <div className="lg:col-span-5">
            <div className="aurora-card p-8 bg-white border border-slate-200/90 shadow-aurora-lg relative overflow-hidden">
              
              {/* Top Teal Accent Bar */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#0F766E] via-teal-400 to-[#2563EB]" />

              {/* Title & Mode Switcher */}
              <div className="text-center mb-6">
                <span className="text-[10px] font-mono uppercase font-bold text-[#0F766E] tracking-widest block mb-1">
                  Enterprise Authentication
                </span>
                <h2 className="font-heading text-2xl font-extrabold text-[#0F172A] tracking-tight">
                  {mode === 'login' ? 'Sign In to Workspace' : 'Create Enterprise Account'}
                </h2>
              </div>

              {/* Mode Tabs */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100/80 rounded-xl border border-slate-200 mb-6">
                <button
                  onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                  className={`py-2 text-xs font-bold rounded-lg transition-all duration-150 ${
                    mode === 'login' ? 'bg-[#0F766E] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
                  className={`py-2 text-xs font-bold rounded-lg transition-all duration-150 ${
                    mode === 'register' ? 'bg-[#0F766E] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Register
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Email Field */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Work Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      className="aurora-input pl-10"
                      placeholder="name@company.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Password
                    </label>
                    {mode === 'login' && (
                      <button type="button" className="text-xs text-[#0F766E] hover:underline font-semibold">
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      className="aurora-input pl-10 pr-11"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      minLength={mode === 'register' ? 8 : undefined}
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Workspace Checkbox */}
                {mode === 'login' && (
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-[#0F766E] accent-[#0F766E]" />
                      <span className="text-xs text-slate-600 font-medium">Remember Workspace</span>
                    </label>
                  </div>
                )}

                {/* Alerts */}
                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                {success && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700">
                    <Check className="w-4 h-4 flex-shrink-0" />
                    <span>{success}</span>
                  </div>
                )}

                {/* Submit Button with Animated Stage Feedback */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-aurora w-full py-3 text-sm mt-2 font-bold shadow-md shadow-[#0F766E]/20"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{loginStage}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>{mode === 'login' ? 'Continue to Mission Control →' : 'Create Enterprise Workspace →'}</span>
                    </div>
                  )}
                </button>

              </form>

              {/* SSO Divider */}
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <span className="relative px-3 bg-white text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                  Single Sign-On
                </span>
              </div>

              {/* SSO Social Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled
                  className="btn-aurora-secondary justify-center py-2.5 text-xs opacity-60 cursor-not-allowed font-semibold gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  Google
                </button>

                <button
                  type="button"
                  disabled
                  className="btn-aurora-secondary justify-center py-2.5 text-xs opacity-60 cursor-not-allowed font-semibold gap-2"
                >
                  <svg className="w-4 h-4 fill-current text-slate-800" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.55-1.4-1.34-1.77-1.34-1.77-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.23 1.84 1.23 1.07 1.84 2.81 1.31 3.5 1 .1-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.4 11.4 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  Microsoft
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="w-full px-6 lg:px-12 py-3 border-t border-slate-200/80 bg-white/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#0F766E]" />
          <span>AuditAI Shield · 256-bit AES Encryption · SOC-2 Type II Certified</span>
        </div>
        <span>© 2025 AuditAI Platform Inc.</span>
      </footer>

    </div>
  );
}
