import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Activity, FileText, Zap, ChevronRight, Check,
  ArrowRight, Play, Menu, X, Star, Lock, Eye, GitBranch,
  BarChart3, AlertTriangle, Globe, Cpu, Code2
} from 'lucide-react';

/* ─── Animated counter hook ─────────────────────────────── */
function useCountUp(target, duration = 1500, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

/* ─── Intersection observer hook ────────────────────────── */
function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ─── Stats data ─────────────────────────────────────────── */
const STATS = [
  { value: 98,   suffix: '%',   label: 'Compliance accuracy'  },
  { value: 2400, suffix: '+',   label: 'AI decisions audited' },
  { value: 12,   suffix: 'ms',  label: 'Avg audit latency'    },
  { value: 150,  suffix: '+',   label: 'Enterprise clients'   },
];

/* ─── Features ───────────────────────────────────────────── */
const FEATURES = [
  {
    icon: <GitBranch className="w-6 h-6" />,
    title: 'Decision Timeline',
    desc: 'Visual, step-by-step reconstruction of every reasoning chain — from input to final decision.',
    color: 'indigo',
  },
  {
    icon: <Code2 className="w-6 h-6" />,
    title: 'Tool Call Tracking',
    desc: 'Every API call, database query, and external lookup fully logged with parameters, latency, and results.',
    color: 'violet',
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: 'Plain-English Explainability',
    desc: 'Claude-powered summaries translate complex AI reasoning into clear, human-readable reports.',
    color: 'blue',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Regulatory Compliance',
    desc: 'Auto-generate responses for EU AI Act, ISO 42001, and NIST AI RMF compliance challenges.',
    color: 'green',
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: 'PII Redaction',
    desc: 'Sensitive fields are automatically detected and redacted from audit logs before storage.',
    color: 'orange',
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'Analytics & Insights',
    desc: 'Decision trends, approval rates, tool usage patterns, and compliance scores at a glance.',
    color: 'pink',
  },
];

const colorMap = {
  indigo: 'bg-indigo-50 text-indigo-600',
  violet: 'bg-violet-50 text-violet-600',
  blue:   'bg-blue-50 text-blue-600',
  green:  'bg-green-50 text-green-600',
  orange: 'bg-orange-50 text-orange-600',
  pink:   'bg-pink-50 text-pink-600',
};

/* ─── How it works ───────────────────────────────────────── */
const HOW_STEPS = [
  { n: '01', title: 'Wrap your AI agent',       desc: 'Add one import. Our SDK wraps your agent and intercepts every action automatically.' },
  { n: '02', title: 'Agent makes a decision',   desc: 'The AI executes — reading data, calling tools, reasoning — exactly as before.' },
  { n: '03', title: 'Every action is logged',   desc: 'Each step is captured: tool calls, context retrieved, reasoning steps, the final decision.' },
  { n: '04', title: 'Instant audit report',     desc: 'Get a full visual timeline, plain-English summary, and regulatory response — in one click.' },
];

/* ─── Pricing ────────────────────────────────────────────── */
const PLANS = [
  {
    name: 'Community',
    price: 'Free',
    period: '',
    desc: 'Perfect for open-source projects and side experiments.',
    features: ['500 audits/month', 'Session timeline', 'Basic explainability', 'GitHub export'],
    cta: 'Start free',
    highlight: false,
  },
  {
    name: 'Professional',
    price: '$49',
    period: '/month',
    desc: 'For teams shipping AI features to real users.',
    features: ['25,000 audits/month', 'Full analytics dashboard', 'PII redaction', 'Regulatory responses', 'API access', 'Priority support'],
    cta: 'Get started',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For organizations requiring custom compliance and SLAs.',
    features: ['Unlimited audits', 'Custom compliance rules', 'SSO & RBAC', 'On-premise deployment', 'Dedicated support', 'SLA guarantee'],
    cta: 'Contact sales',
    highlight: false,
  },
];

/* ─── FAQ ────────────────────────────────────────────────── */
const FAQS = [
  { q: 'How does instrumentation work?', a: 'You wrap your AI agent with our InstrumentedAgent SDK. It uses a decorator pattern — zero changes to your AI logic, just add one import.' },
  { q: 'What AI frameworks are supported?', a: 'Any Python-based agent — LangChain, AutoGen, raw Anthropic/OpenAI calls, CrewAI, or custom implementations.' },
  { q: 'Is my data stored securely?', a: 'Audit logs are stored in your own database. PII fields are redacted before storage. We never send your decision data to third parties.' },
  { q: 'What compliance frameworks does it support?', a: 'EU AI Act Article 13 (transparency), ISO 42001, NIST AI RMF, and custom policy rules via our Policy Engine.' },
  { q: 'How fast is the audit capture?', a: 'The capture overhead is < 2ms per event. Audit logs are written asynchronously and do not block your AI agent.' },
];

/* ─── Trusted By logos (placeholder SVG marks) ───────────── */
const LOGOS = ['Microsoft', 'OpenAI', 'Anthropic', 'Meta', 'AWS', 'Google'];

/* ──────────────────────────────────────────────────────────── */
export default function Landing() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const [statsRef, statsInView] = useInView(0.3);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* ── Navbar ─────────────────────────────────────────── */}
      <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-border shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-glow-sm">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-heading font-semibold text-foreground text-lg tracking-tight">AuditAI</span>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features"    className="nav-link">Features</a>
              <a href="#how"         className="nav-link">How it works</a>
              <a href="#pricing"     className="nav-link">Pricing</a>
              <a href="https://github.com/ATKTharun1807/decision-path-auditor" target="_blank" rel="noreferrer" className="nav-link">GitHub</a>
            </div>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-3">
              <button onClick={() => navigate('/login')} className="btn-ghost text-sm">Log in</button>
              <button onClick={() => navigate('/login')} className="btn-primary text-sm py-2 px-4">
                Get started <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile menu toggle */}
            <button className="md:hidden btn-ghost p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-white/95 backdrop-blur-xl">
            <div className="px-4 py-4 space-y-1">
              {['Features','How it works','Pricing'].map(item => (
                <a key={item} href={`#${item.toLowerCase().replace(' ', '')}`}
                   className="block px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                   onClick={() => setMenuOpen(false)}>
                  {item}
                </a>
              ))}
              <div className="pt-3 flex flex-col gap-2">
                <button onClick={() => navigate('/login')} className="btn-secondary w-full">Log in</button>
                <button onClick={() => navigate('/login')} className="btn-primary w-full">Get started</button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Background glow blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-100px] left-[-100px] w-[600px] h-[600px] rounded-full bg-indigo-100/60 blur-3xl" />
          <div className="absolute bottom-0 right-[-80px] w-[500px] h-[500px] rounded-full bg-violet-100/50 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-xs font-semibold text-indigo-700 tracking-wide uppercase">AI Governance Platform</span>
            </div>

            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-[1.08] tracking-tight mb-6">
              Every AI Decision<br />
              <span className="gradient-text">Should Be Explainable</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
              AuditAI logs every step your AI agent takes — tools called, data retrieved, reasoning performed — and turns it into a full visual audit trail in milliseconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => navigate('/login')} className="btn-primary text-base px-7 py-3.5 shadow-glow">
                Start Auditing Free <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-secondary text-base px-7 py-3.5 gap-3"
              >
                <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center">
                  <Play className="w-3 h-3 text-white fill-white ml-0.5" />
                </div>
                Watch Demo
              </button>
            </div>

            <p className="mt-5 text-sm text-muted-foreground">No credit card required · Free forever plan · SOC 2 ready</p>
          </div>

          {/* Dashboard preview mockup */}
          <div className="mt-20 relative max-w-5xl mx-auto">
            <div className="rounded-3xl border border-border bg-white shadow-[0_32px_80px_-8px_rgba(0,0,0,0.15)] overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border bg-gray-50/80">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="ml-4 flex-1 bg-gray-200 rounded-md h-6 flex items-center px-3">
                  <span className="text-xs text-gray-500 font-mono">auditai.dev/dashboard</span>
                </div>
              </div>
              {/* Dashboard preview UI */}
              <div className="bg-[#F8FAFC] p-6">
                {/* KPI row */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Active Sessions', value: '247', change: '+12%', up: true },
                    { label: 'AI Decisions',    value: '18.4K', change: '+8%', up: true },
                    { label: 'Compliance Score', value: '98%', change: '+2%', up: true },
                    { label: 'Alerts',           value: '2', change: '-1', up: false },
                  ].map(k => (
                    <div key={k.label} className="bg-white rounded-xl border border-border p-4 shadow-card">
                      <p className="text-xs text-muted-foreground font-medium mb-1">{k.label}</p>
                      <p className="text-2xl font-bold font-heading text-foreground">{k.value}</p>
                      <p className={`text-xs mt-0.5 font-medium ${k.up ? 'text-green-600' : 'text-red-500'}`}>{k.change}</p>
                    </div>
                  ))}
                </div>
                {/* Timeline preview */}
                <div className="bg-white rounded-xl border border-border p-5 shadow-card">
                  <h3 className="text-sm font-semibold text-foreground mb-4">Recent Decision · sess-a0dd38bd2155</h3>
                  <div className="space-y-4">
                    {[
                      { step: 0, type: 'INPUT',          label: 'Received personal loan application', color: 'indigo' },
                      { step: 1, type: 'TOOL CALL',      label: 'Called credit_bureau_lookup',        color: 'violet' },
                      { step: 2, type: 'TOOL RESPONSE',  label: 'Score: 610 · REDACTED',              color: 'orange', redacted: true },
                      { step: 3, type: 'REASONING STEP', label: 'Credit score below 640 threshold',   color: 'blue' },
                      { step: 4, type: 'DECISION',       label: 'DECLINE · RULE-CS-640 applied',      color: 'red' },
                    ].map(s => (
                      <div key={s.step} className="flex items-start gap-3 relative">
                        {s.step < 4 && <div className="absolute left-4 top-9 w-px h-5 bg-border" />}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 flex-shrink-0 ${
                          s.color === 'red' ? 'border-red-300 bg-red-50 text-red-700' :
                          s.color === 'orange' ? 'border-orange-300 bg-orange-50 text-orange-700' :
                          'border-indigo-200 bg-indigo-50 text-indigo-700'
                        }`}>{s.step}</div>
                        <div className="flex-1 min-w-0 pt-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">{s.type}</span>
                            {s.redacted && <span className="text-[9px] bg-red-100 text-red-700 rounded px-1.5 py-0.5 font-bold uppercase tracking-wider">Redacted</span>}
                          </div>
                          <p className="text-sm text-foreground font-medium">{s.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trusted By ─────────────────────────────────────── */}
      <section className="py-16 border-y border-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-10">
            Trusted by engineering teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {LOGOS.map(name => (
              <div key={name} className="text-gray-300 font-heading font-bold text-xl select-none tracking-tight hover:text-gray-400 transition-colors">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────── */}
      <section ref={statsRef} className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s) => {
              const count = useCountUp(s.value, 1500, statsInView);
              return (
                <div key={s.label} className="text-center">
                  <div className="font-heading text-5xl font-bold text-foreground">
                    {count}{s.suffix}
                  </div>
                  <p className="mt-2 text-sm font-medium text-muted-foreground">{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────── */}
      <section id="features" className="py-24 bg-white border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 mb-5">
              <Zap className="w-3.5 h-3.5 text-violet-600" />
              <span className="text-xs font-semibold text-violet-700 tracking-wide uppercase">Features</span>
            </div>
            <h2 className="font-heading text-4xl font-bold text-foreground tracking-tight mb-4">
              Everything you need for<br />
              <span className="gradient-text">AI governance</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From raw tool calls to regulatory reports — AuditAI covers the full compliance lifecycle.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="card-hover p-6 group"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${colorMap[f.color]} transition-transform duration-200 group-hover:scale-110`}>
                  {f.icon}
                </div>
                <h3 className="font-heading text-base font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────── */}
      <section id="how" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-foreground tracking-tight mb-4">
              Set up in <span className="gradient-text">minutes</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              One import. Zero changes to your AI logic. Full audit trail.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-indigo-200 via-violet-200 to-indigo-200" />

            {HOW_STEPS.map((s, i) => (
              <div key={s.n} className="relative text-center">
                <div className="w-20 h-20 rounded-2xl bg-white border border-border shadow-card flex items-center justify-center mx-auto mb-5 font-heading font-bold text-2xl text-indigo-600 relative z-10">
                  {s.n}
                </div>
                <h3 className="font-heading font-semibold text-base text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Code snippet */}
          <div className="mt-16 max-w-2xl mx-auto">
            <div className="code-block">
              <div className="code-header">
                <div className="code-dot bg-red-400" />
                <div className="code-dot bg-yellow-400" />
                <div className="code-dot bg-green-400" />
                <span className="ml-2 text-xs text-muted-foreground font-mono">agent.py</span>
              </div>
              <div className="code-body">
                <span className="text-gray-500"># Before</span>{'\n'}
                <span className="text-blue-400">agent</span> = <span className="text-green-400">MyLLMAgent</span>(){'\n\n'}
                <span className="text-gray-500"># After — that's it!</span>{'\n'}
                <span className="text-purple-400">from</span> app.wrapper <span className="text-purple-400">import</span> InstrumentedAgent{'\n'}
                <span className="text-blue-400">agent</span> = <span className="text-green-400">InstrumentedAgent</span>(<span className="text-orange-300">MyLLMAgent</span>(), session_id=<span className="text-yellow-300">"sess-xyz"</span>){'\n'}
                <span className="text-gray-500"># ✓ Full audit trail captured automatically</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Interactive Demo ────────────────────────────────── */}
      <section id="demo-section" className="py-24 bg-white border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl font-bold text-foreground tracking-tight mb-4">
              See it in action
            </h2>
            <p className="text-lg text-muted-foreground">
              Run a real loan-decision AI and watch the full audit trail generate in real time.
            </p>
          </div>
          <div className="flex flex-col items-center gap-6">
            <button onClick={() => navigate('/login')} className="btn-primary text-base px-8 py-4 shadow-glow">
              <Play className="w-4 h-4 fill-white" />
              Run Live Demo
            </button>
            <p className="text-sm text-muted-foreground">Sign in required · Demo runs on our hosted backend</p>
          </div>
        </div>
      </section>

      {/* ── Pricing ────────────────────────────────────────── */}
      <section id="pricing" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-foreground tracking-tight mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-muted-foreground">Start free. Scale as you grow.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            {PLANS.map(p => (
              <div
                key={p.name}
                className={`rounded-2xl border p-8 transition-all duration-200 ${
                  p.highlight
                    ? 'border-indigo-500 bg-gradient-to-b from-indigo-600 to-violet-700 text-white shadow-glow scale-[1.02]'
                    : 'border-border bg-white shadow-card hover:shadow-card-hover'
                }`}
              >
                {p.highlight && (
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white mb-4">
                    <Star className="w-3 h-3 fill-white" /> Most Popular
                  </div>
                )}
                <h3 className={`font-heading text-lg font-bold mb-1 ${p.highlight ? 'text-white' : 'text-foreground'}`}>{p.name}</h3>
                <p className={`text-sm mb-6 ${p.highlight ? 'text-indigo-200' : 'text-muted-foreground'}`}>{p.desc}</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className={`font-heading text-4xl font-bold ${p.highlight ? 'text-white' : 'text-foreground'}`}>{p.price}</span>
                  <span className={`text-sm ${p.highlight ? 'text-indigo-200' : 'text-muted-foreground'}`}>{p.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {p.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <Check className={`w-4 h-4 flex-shrink-0 ${p.highlight ? 'text-indigo-200' : 'text-green-500'}`} />
                      <span className={p.highlight ? 'text-indigo-100' : 'text-foreground'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/login')}
                  className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 ${
                    p.highlight
                      ? 'bg-white text-indigo-700 hover:bg-indigo-50'
                      : 'btn-primary'
                  }`}
                >
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────── */}
      <section className="py-24 bg-white border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-4xl font-bold text-foreground tracking-tight text-center mb-12">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <div key={i} className="card overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-muted/50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-medium text-foreground text-sm">{f.q}</span>
                  <ChevronRight className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-90' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
            Start auditing your AI decisions today
          </h2>
          <p className="text-indigo-200 text-lg mb-10 max-w-2xl mx-auto">
            Join hundreds of teams who trust AuditAI to make their AI systems transparent, compliant, and accountable.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => navigate('/login')} className="bg-white text-indigo-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-indigo-50 transition-colors inline-flex items-center gap-2">
              Get started free <ArrowRight className="w-4 h-4" />
            </button>
            <a href="https://github.com/ATKTharun1807/decision-path-auditor" target="_blank" rel="noreferrer"
               className="text-white border border-white/30 font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors inline-flex items-center gap-2">
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="border-t border-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-heading font-semibold text-foreground">AuditAI</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                Enterprise AI governance platform. Make every AI decision transparent, explainable, and compliant.
              </p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
              { title: 'Compliance', links: ['EU AI Act', 'ISO 42001', 'NIST AI RMF', 'SOC 2'] },
              { title: 'Company', links: ['About', 'Blog', 'GitHub', 'Contact'] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map(l => (
                    <li key={l}><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">© 2025 AuditAI. All rights reserved.</p>
            <p className="text-xs text-muted-foreground">Built with ♥ by ATKTharun1807</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
